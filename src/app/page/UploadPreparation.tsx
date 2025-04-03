import React, { useState } from "react";
import Button from "../reusable/Button";
import { CSSTransition } from "react-transition-group";
import "../../assets/css/dropdown-icon.css";
import "../../assets/css/dropdown-animation.css";
import "../../assets/css/table.css";
import { useNavigate } from "react-router-dom";
import { documentList } from "../../types/docList";
import { RiArrowDropDownLine, RiFileDownloadLine } from "react-icons/ri";
import { AnimatePresence, motion } from "framer-motion";
import { uploadFile } from "../../utils/upload";
import { OptionType } from "../../types/selectTypes";
import UploadFilterPanel from "../reusable/UploadFilterPanel";
import oilFactories from "../../assets/json/oil-factory.json";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra);

type UploadedFileMap = {
    [docId: number]: {
        [subtitleIndex: number]: { name: string; data: string; };
    };
};

type FilterState = {
    warehouse: OptionType | null;
    transport: OptionType | null;
    periodType: OptionType | null;
    dateStart: Date | null;
    dateEnd: Date | null;
    month: Date | null;
};

const UploadPreparation: React.FC = () => {
    const navigate = useNavigate();
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFileMap>({});
    const [openDropdown, setOpenDropdown] = useState<{ [key: number]: boolean }>({});
    const [isAnimating, setIsAnimating] = useState<{ [key: number]: boolean }>({});
    const [filters, setFilters] = useState<FilterState>({
        warehouse: null, transport: null, periodType: null, dateStart: null, dateEnd: null, month: null,
    });

    const getFormattedPeriodDateStr = () => {
        if (!filters.periodType) return "";

        if (filters.periodType.value === "month" && filters.month) {
            const month = dayjs(filters.month).format("MM");
            const buddhistYear = dayjs(filters.month).format("BB").slice(-2);
            return `0000${month}${buddhistYear}`;
        }

        if (filters.periodType.value === "range" && filters.dateStart && filters.dateEnd) {
            const startDay = dayjs(filters.dateStart).format("DD");
            const endDay = dayjs(filters.dateEnd).format("DD");
            const month = dayjs(filters.dateStart).format("MM");
            const buddhistYear = dayjs(filters.dateStart).format("BB").slice(-2);
            return `${startDay}${endDay}${month}${buddhistYear}`;
        }

        return "";
    };

    const currentCompany = "OR";
    const warehouseOptions: OptionType[] = oilFactories
        .filter(fac => fac.company_name === currentCompany)
        .map(fac => ({
            value: fac.factories_id,
            label: fac.factories_name
        }));

    const transportOptions: OptionType[] = [
        { value: "00", label: "ทางเรือ" },
        { value: "01", label: "ทางท่อ" },
    ];

    const periodOptions: OptionType[] = [
        { value: "range", label: "ช่วงวันที่" },
        { value: "month", label: "เดือน" },
    ];

    const handleFilterChange = (field: keyof typeof filters, value: any) => {
        const resetMap: { [key in keyof typeof filters]?: (keyof typeof filters)[] } = {
            // warehouse: ["transport", "periodType", "dateStart", "dateEnd", "month"],
            // transport: ["periodType", "dateStart", "dateEnd", "month"],
            periodType: ["dateStart", "dateEnd", "month"],
        };

        setFilters(prev => {
            const resetFields = resetMap[field] || [];
            const resetValues = Object.fromEntries(resetFields.map(k => [k, null]));
            return { ...prev, ...resetValues, [field]: value };
        });
    };

    const toggleDropdown = (docId: number) => {
        setOpenDropdown(prev => ({ ...prev, [docId]: !prev[docId] }));
        if (openDropdown[docId]) {
            setIsAnimating(prev => ({ ...prev, [docId]: true }));
            setTimeout(() => setIsAnimating(prev => ({ ...prev, [docId]: false })), 300);
        }
    };

    // const mergeAndOpenPdf = async (docId: number) => {
    //     const storedFilesMap = uploadedFiles[docId];

    //     if (!storedFilesMap || Object.keys(storedFilesMap).length === 0) {
    //         return alert("ไม่มีไฟล์ที่อัปโหลด");
    //     }

    //     const mergedPdf = await PDFDocument.create();

    //     for (const index of Object.keys(storedFilesMap)) {
    //         const file = storedFilesMap[+index];
    //         const existingPdfBytes = await fetch(file.data).then(res => res.arrayBuffer());
    //         const existingPdf = await PDFDocument.load(existingPdfBytes);
    //         const copiedPages = await mergedPdf.copyPages(existingPdf, existingPdf.getPageIndices());
    //         copiedPages.forEach(page => mergedPdf.addPage(page));
    //     }

    //     const mergedPdfBytes = await mergedPdf.save();
    //     const mergedBlobUrl = URL.createObjectURL(new Blob([mergedPdfBytes], { type: "application/pdf" }));
    //     window.open(mergedBlobUrl, "_blank");
    // };

    const openBlobSecurely = async (fileUrlWithToken: string) => {
        console.log("fileUrlWithToken", fileUrlWithToken);
        try {
            const response = await fetch(fileUrlWithToken);
            console.log("response", response);            
            const blob = await response.blob();
            console.log("blob", blob);            
            const blobUrl = URL.createObjectURL(blob);
            console.log("blobUrl", blobUrl);

            window.open(blobUrl, "_blank");
        } catch (error) {
            console.error("ไม่สามารถเปิดไฟล์ได้:", error);
            alert("ไม่สามารถเปิดดูเอกสารได้");
        }
    };

    const handleDocumentFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
        docId: number,
        subtitleIndex?: number
    ) => {
        if (
            !event.target.files ||
            !filters.warehouse ||
            !filters.transport ||
            !filters.periodType ||
            (filters.periodType.value === "range" && (!filters.dateStart || !filters.dateEnd)) ||
            (filters.periodType.value === "month" && !filters.month)
        ) {
            alert("กรุณาเลือกคลัง, ทาง, และช่วงยื่นก่อนอัปโหลด");
            return;
        }

        const file = event.target.files[0];
        const periodDateStr = getFormattedPeriodDateStr();
        const documentGroup = currentCompany.toLowerCase();
        const fileUrl = await uploadFile(
            file,
            documentGroup,
            filters.warehouse.value,
            filters.transport.value,
            periodDateStr,
            docId,
            subtitleIndex
        );

        if (!fileUrl) return;

        const newFile = { name: file.name, data: fileUrl };
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
        (item) => !filters.transport || item.transport === filters.transport.value
    );

    return (
        <div className="container-fluid mt-3 w-100" style={{ maxWidth: '1800px' }}>
            <p className="fw-bold mb-0" style={{ fontFamily: "IBM Plex Sans Thai", fontSize: "32px", }}>
                อัปโหลดเอกสาร
            </p>
            <div className="d-flex bg-white p-4 rounded shadow-sm justify-content-center align-items-start mb-3">
                <UploadFilterPanel
                    filters={filters}
                    onChange={handleFilterChange}
                    options={{
                        warehouse: warehouseOptions,
                        transport: transportOptions,
                        period: periodOptions,
                    }}
                />
            </div>
            <div className="table-responsive bg-white p-4 rounded shadow-sm rounded-3" style={{ fontSize: '16spx' }}>
                <table className="table custom-table table-borderless fw-bold">
                    <thead style={{ borderBottom: "2px solid #0000004B" }}>
                        <tr>
                            <th className="align-middle" style={{ fontSize: '22px' }}>รายการเอกสาร</th>
                            <th className="align-middle text-center" style={{ fontSize: '22px' }}>
                                {/* จำนวนหน้า */}
                            </th>
                            <th className="text-end">
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    multiple
                                    style={{ display: "none" }}
                                    id="file-upload-multi"
                                    onChange={handleMultiFileUpload}
                                />
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
                                            onClick={() => item.subtitle && toggleDropdown(item.id)}
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

                                            {!item.subtitle && uploadedFiles[item.id]?.[0]?.name && (
                                                <span className="text-primary ms-2 fw-bold" onClick={() => openBlobSecurely(uploadedFiles[item.id][0].data)}>
                                                    {uploadedFiles[item.id][0].name}
                                                </span>
                                            )}
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
                                    </td>
                                    <td className="text-center align-middle">
                                        {/* {uploadedFiles[item.id]
                                            ? Object.values(uploadedFiles[item.id]).reduce((sum, file) => sum + file.pageCount, 0)
                                            : 0} หน้า */}
                                    </td>
                                    <td className="text-end">
                                        <Button
                                            className="w-100"
                                            type="button"
                                            label="ดูเอกสาร"
                                            bgColor="#3D4957"
                                            color="#FFFFFF"
                                            maxWidth="150px"
                                            variant="bg-hide"
                                            onClick={() => openBlobSecurely(uploadedFiles[item.id][0].data)}
                                            disabled={openDropdown[item.id] || !uploadedFiles[item.id]}
                                        // onClick={() => mergeAndOpenPdf(item.id)}
                                        />
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

export default UploadPreparation;
