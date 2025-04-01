import React, { useState } from "react";
import StepProgress from "../reusable/StepProgress";
import Button from "../reusable/Button";
import { CSSTransition } from "react-transition-group";
import "../../assets/css/dropdown-icon.css";
import "../../assets/css/dropdown-animation.css";
import "../../assets/css/table.css";
import { useNavigate } from "react-router-dom";
import { documentList } from "../../types/docList";
import { RiArrowDropDownLine, RiFileDownloadLine } from "react-icons/ri";
import { StepStatus } from "../../types/enum/stepStatus";
import { AnimatePresence, motion } from "framer-motion";
import { PDFDocument } from "pdf-lib";
import { uploadFile } from "../../utils/upload";
import CustomSelect from "../reusable/CustomSelect";
import { OptionType } from "../../types/selectTypes";

type UploadedFileMap = {
    [docId: number]: {
        [subtitleIndex: number]: { name: string; data: string; pageCount: number };
    };
};

const Upload: React.FC = () => {
    const navigate = useNavigate();
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFileMap>({});
    const [openDropdown, setOpenDropdown] = useState<{ [key: number]: boolean }>({});
    const [isAnimating, setIsAnimating] = useState<{ [key: number]: boolean }>({});
    const [selectedYear, setSelectedYear] = useState<OptionType | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<OptionType | null>(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState<OptionType | null>(null);
    const [selectedTransport, setSelectedTransport] = useState<OptionType | null>(null);

    const yearOptions: OptionType[] = [
        { value: "2567", label: "2567" },
        { value: "2566", label: "2566" },
    ];

    const monthOptions: OptionType[] = [
        { value: "01", label: "ม.ค." },
        { value: "02", label: "ก.พ." },
    ];

    const warehouseOptions: OptionType[] = [
        { value: "K148", label: "คลังที่ 1" },
        { value: "K149", label: "คลังที่ 2" },
    ];

    const transportOptions: OptionType[] = [
        { value: "00", label: "ทางเรือ" },
        { value: "01", label: "ทางท่อ" },
    ];

    const toggleDropdown = (docId: number) => {
        setOpenDropdown(prev => ({ ...prev, [docId]: !prev[docId] }));
        if (openDropdown[docId]) {
            setIsAnimating(prev => ({ ...prev, [docId]: true }));
            setTimeout(() => setIsAnimating(prev => ({ ...prev, [docId]: false })), 300);
        }
    };

    const mergeAndOpenPdf = async (docId: number) => {
        const storedFilesMap = uploadedFiles[docId];

        if (!storedFilesMap || Object.keys(storedFilesMap).length === 0) {
            return alert("ไม่มีไฟล์ที่อัปโหลด");
        }

        const mergedPdf = await PDFDocument.create();

        for (const index of Object.keys(storedFilesMap)) {
            const file = storedFilesMap[+index]; // +index แปลง string เป็น number
            const existingPdfBytes = await fetch(file.data).then(res => res.arrayBuffer());
            const existingPdf = await PDFDocument.load(existingPdfBytes);
            const copiedPages = await mergedPdf.copyPages(existingPdf, existingPdf.getPageIndices());
            copiedPages.forEach(page => mergedPdf.addPage(page));
        }

        const mergedPdfBytes = await mergedPdf.save();
        const mergedBlobUrl = URL.createObjectURL(new Blob([mergedPdfBytes], { type: "application/pdf" }));
        window.open(mergedBlobUrl, "_blank");
    };


    const openBlobSecurely = async (fileUrlWithToken: string) => {
        try {
            const response = await fetch(fileUrlWithToken);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl, "_blank");
        } catch (error) {
            console.error("ไม่สามารถเปิดไฟล์ได้:", error);
            alert("ไม่สามารถเปิดดูเอกสารได้");
        }
    };

    const getPdfPageCount = async (url: string): Promise<number> => {
        try {
            const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());
            return (await PDFDocument.load(existingPdfBytes)).getPageCount();
        } catch {
            return 0;
        }
    };

    const handleDocumentFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
        docId: number,
        subtitleIndex?: number
    ) => {
        if (!event.target.files) return;
        const file = event.target.files[0];

        const fileUrl = await uploadFile(file);
        if (!fileUrl) return;

        const pageCount = await getPdfPageCount(fileUrl);

        const newFile = { name: file.name, data: fileUrl, pageCount };

        setUploadedFiles(prevState => {
            const existingDoc = prevState[docId] || {};

            if (subtitleIndex !== undefined) {
                return {
                    ...prevState,
                    [docId]: {
                        ...existingDoc,
                        [subtitleIndex]: newFile,
                    },
                };
            } else {
                return {
                    ...prevState,
                    [docId]: {
                        ...existingDoc,
                        0: newFile,
                    },
                };
            }
        });
    };

    const handleMultiFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;

        const fileArray = Array.from(event.target.files);
        const filePreviews = fileArray.map(file => ({
            name: file.name,
            url: URL.createObjectURL(file)
        }));

        localStorage.setItem("uploadedMultiFiles", JSON.stringify(filePreviews));
        navigate("/upload-multiple");
    };

    const handleConfirm = () => {
        const allFilesUploaded = documentList.every((item) =>
            item.subtitle?.every((_, index) => uploadedFiles[item.id]?.[index])
        );

        if (allFilesUploaded) {
            navigate('/confirm');
        }
    };

    const isConfirmDisabled = documentList.some(item => {
        const files = uploadedFiles[item.id];
        return !files || Object.keys(files).length === 0;
    });

    const filteredDocuments = documentList.filter(
        (item) => !selectedTransport || item.transport === selectedTransport.value
    );

    return (
        <div className="container-fluid mt-3 w-100" style={{ maxWidth: '1800px' }}>
            <p className="fw-bold mb-0" style={{ fontFamily: "IBM Plex Sans Thai", fontSize: "32px", }}>
                ขั้นตอนการดำเนินงาน
            </p>
            <StepProgress status={StepStatus.UPLOAD} />
            <div className="mt-3 d-flex justify-content-start align-items-start">
                <p className="fw-bold mb-0" style={{ fontFamily: "IBM Plex Sans Thai", fontSize: "32px", }}>
                    เอกสาร
                </p>
                <div className="d-flex flex-wrap gap-3 mt-1 px-4" >
                    <CustomSelect label="เลือกคลัง" value={selectedWarehouse} onChange={setSelectedWarehouse} options={warehouseOptions} />
                    <CustomSelect label="ทาง" value={selectedTransport} onChange={setSelectedTransport} options={transportOptions} />
                    <CustomSelect label="เลือกปี" value={selectedYear} onChange={setSelectedYear} options={yearOptions} />
                    <CustomSelect label="เลือกเดือน" value={selectedMonth} onChange={setSelectedMonth} options={monthOptions} />
                </div>
                <Button
                    type="button"
                    label="จัดทำ"
                    bgColor="#2C3E50"
                    color="#fff"
                    maxWidth="110px"
                    variant="bg-hide"
                />
            </div>
            <div className="table-responsive bg-white p-4 rounded shadow-sm rounded-3" style={{ fontSize: '16spx' }}>
                <table className="table custom-table table-borderless fw-bold">
                    <thead style={{ borderBottom: "2px solid #0000004B" }}>
                        <tr>
                            <th className="align-middle" style={{ fontSize: '22px' }}>รายการเอกสาร</th>
                            <th className="align-middle text-center" style={{ fontSize: '22px' }}>จำนวนหน้า</th>
                            <th className="text-end">
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    multiple
                                    style={{ display: "none" }}
                                    id="file-upload-multi"
                                    onChange={handleMultiFileUpload}
                                />
                                <Button
                                    className="w-100"
                                    type="button"
                                    label="อัปโหลดเอกสารหลายชนิด"
                                    bgColor="#4FA9FF"
                                    maxWidth="260px"
                                    variant="bg-hide"
                                    onClick={() => document.getElementById("file-upload-multi")?.click()}
                                >
                                    <RiFileDownloadLine className="me-1" size={25} />
                                </Button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDocuments.map((item) => (
                            <React.Fragment key={item.id}>
                                <tr style={{ borderBottom: openDropdown[item.id] || isAnimating[item.id] ? "none" : "2px solid #0000004B" }}>
                                    <td className="align-middle" style={{ maxWidth: '600px' }}>
                                        <span
                                            className="fw-bold"
                                            style={{ cursor: "pointer", verticalAlign: "middle" }}
                                            onClick={() => toggleDropdown(item.id)}
                                        >
                                            <span
                                                className="me-2 m-0"
                                                style={{
                                                    display: "inline-block",
                                                    width: "3px",
                                                    height: "28px",
                                                    backgroundColor: "#9D9D9D",
                                                    borderRadius: "2px",
                                                    verticalAlign: "middle"
                                                }}></span>

                                            {item.title}
                                        </span>

                                        {item.subtitle && (
                                            <CSSTransition
                                                in={openDropdown[item.id]}
                                                timeout={300}
                                                classNames="rotate-icon"
                                            >
                                                <RiArrowDropDownLine
                                                    size={25}
                                                    className={`dropdown-icon ${openDropdown[item.id] ? "rotated" : ""}`}
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => toggleDropdown(item.id)}
                                                />
                                            </CSSTransition>
                                        )}

                                        {/* <div style={{ marginLeft: "30px" }}>
                                            {item.type}
                                        </div> */}
                                    </td>
                                    <td className="text-center align-middle">
                                        {uploadedFiles[item.id]
                                            ? Object.values(uploadedFiles[item.id]).reduce((sum, file) => sum + file.pageCount, 0)
                                            : 0} หน้า
                                    </td>
                                    <td className="text-end">
                                        {/* {!openDropdown[item.id] && !isAnimating[item.id] && ( */}
                                        <Button
                                            className="w-100"
                                            type="button"
                                            label="ดูเอกสาร"
                                            bgColor="#3D4957"
                                            color="#FFFFFF"
                                            maxWidth="150px"
                                            variant="bg-hide"
                                            disabled={openDropdown[item.id] || !uploadedFiles[item.id]}
                                            onClick={() => mergeAndOpenPdf(item.id)}
                                        />
                                        {/* )} */}
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            multiple
                                            style={{ display: "none" }}
                                            id={`file-upload-${item.id}`}
                                            onChange={(e) => handleDocumentFileUpload(e, item.id)}
                                        />
                                        <Button
                                            className="ms-3 w-100"
                                            type="button"
                                            label="อัปโหลดเอกสาร"
                                            bgColor="#3D4957"
                                            color="#FFFFFF"
                                            maxWidth="260px"
                                            variant="bg-hide"
                                            onClick={() => document.getElementById(`file-upload-${item.id}`)?.click()}
                                            disabled={!!item.subtitle}
                                        >
                                            <RiFileDownloadLine className="me-1" size={25} />
                                        </Button>
                                    </td>
                                </tr>

                                <AnimatePresence>
                                    {openDropdown[item.id] && (
                                        item.subtitle?.map((subtitleText, index) => {
                                            const uploaded = uploadedFiles[item.id]?.[index];
                                            return (
                                                <motion.tr
                                                    key={`${item.id}-subtitle-${index}`}
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                    style={{
                                                        borderBottom:
                                                            index === (item.subtitle?.length ?? 0) - 1 ? "2px solid #0000004B" : "none",
                                                    }}
                                                >
                                                    <td colSpan={2} className="align-middle td-border">
                                                        <span className="fw-bold" style={{ marginLeft: "55px" }}>
                                                            {subtitleText}
                                                        </span>
                                                        {uploaded && (
                                                            <span className="text-primary ms-3" style={{ cursor: "pointer" }} onClick={() => openBlobSecurely(uploaded.data)}>
                                                                {uploaded.name}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="text-end td-border-r">
                                                        <Button
                                                            className="w-100 me-2"
                                                            type="button"
                                                            label="ดูเอกสาร"
                                                            bgColor="#3D4957"
                                                            color="#FFFFFF"
                                                            maxWidth="150px"
                                                            variant="bg-hide"
                                                            onClick={() => openBlobSecurely(uploaded.data)}
                                                            disabled={!uploaded}
                                                        />
                                                        <input
                                                            type="file"
                                                            accept="application/pdf"
                                                            style={{ display: "none" }}
                                                            id={`file-upload-${item.id}-${index}`}
                                                            onChange={(e) => handleDocumentFileUpload(e, item.id, index)}
                                                        />
                                                        <Button
                                                            className="w-100"
                                                            type="button"
                                                            label="อัปโหลดเอกสาร"
                                                            bgColor="#3D4957"
                                                            maxWidth="200px"
                                                            variant="bg-hide"
                                                            onClick={() => document.getElementById(`file-upload-${item.id}-${index}`)?.click()}
                                                        />
                                                    </td>
                                                </motion.tr>
                                            );
                                        })
                                    )}
                                </AnimatePresence>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
                <div className="d-flex justify-content-center mt-4">
                    <Button
                        className="me-3"
                        type="button"
                        label="ย้อนกลับ"
                        onClick={() => navigate("/")}
                        bgColor="#717171"
                        variant="bg-hide"
                    />
                    <Button
                        type="button"
                        label="ยืนยันการอัปโหลด"
                        onClick={handleConfirm}
                        bgColor="#FFCB02"
                        color="#1E2329"
                        variant="bg-hide"
                        disabled={isConfirmDisabled}
                    />
                </div>
            </div>
        </div>
    );
};

export default Upload;
