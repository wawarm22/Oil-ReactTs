import React, { useState } from "react";
import StepProgress from "../reusable/StepProgress";
import Button from "../reusable/Button";
import { CSSTransition } from "react-transition-group";
import "../../assets/css/dropdown-icon.css";
import "../../assets/css/dropdown-animation.css";
import "../../assets/css/table.css";
import { useNavigate } from "react-router-dom";
import { RiArrowDropDownLine, RiFileDownloadLine } from "react-icons/ri";
import { StepStatus } from "../../types/enum/stepStatus";
import { AnimatePresence, motion } from "framer-motion";
import { PDFDocument } from "pdf-lib";
import { uploadFile } from "../../utils/upload";
import { documentListFT } from "../../types/docListFristTypes";

const Upload: React.FC = () => {
    const navigate = useNavigate();
    const [uploadedFiles, setUploadedFiles] = useState<{
        [key: number]: { name: string; data: string; pageCount: number }[]
    }>({});
    const [openDropdown, setOpenDropdown] = useState<{ [key: number]: boolean }>({});
    const [isAnimating, setIsAnimating] = useState<{ [key: number]: boolean }>({});

    // useEffect(() => {
    //     const storedFiles = localStorage.getItem("uploadedFiles");
    //     if (storedFiles) {
    //         setUploadedFiles(JSON.parse(storedFiles));
    //     }
    // }, []);

    const toggleDropdown = (docId: number) => {
        setOpenDropdown(prev => ({ ...prev, [docId]: !prev[docId] }));
        if (openDropdown[docId]) {
            setIsAnimating(prev => ({ ...prev, [docId]: true }));
            setTimeout(() => setIsAnimating(prev => ({ ...prev, [docId]: false })), 300);
        }
    };

    const mergeAndOpenPdf = async (docId: number) => {
        const storedFiles = uploadedFiles[docId];
        if (!storedFiles || storedFiles.length === 0) return alert("ไม่มีไฟล์ที่อัปโหลด");

        const mergedPdf = await PDFDocument.create();
        for (const file of storedFiles) {
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

            // แปลง blob เป็น URL แบบไม่เปิดเผย token
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

    const handleDocumentFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, docId: number) => {
        if (!event.target.files) return;

        const files = Array.from(event.target.files);

        // for (const file of files) {
        //     const fileUrl = await uploadFile(file);
        //     if (!fileUrl) return;

        //     const pageCount = await getPdfPageCount(fileUrl);

        //     const newFile = { name: file.name, data: fileUrl, pageCount };

        //     setUploadedFiles(prevState => {
        //         const newFiles = { ...prevState, [docId]: [...(prevState[docId] || []), newFile] };
        //         // localStorage.setItem("uploadedFiles", JSON.stringify(newFiles));
        //         return newFiles;
        //     });
        // }
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
        const allFilesUploaded = documentListFT.every(item => uploadedFiles[item.id]?.length > 0);
        if (allFilesUploaded) {
            navigate('/confirm');
        }
    };

    const isConfirmDisabled = documentListFT.some(item => !uploadedFiles[item.id]?.length);

    return (
        <div className="container-fluid mt-3 w-100" style={{ maxWidth: '1800px' }}>
            <p className="fw-bold mb-0" style={{ fontFamily: "IBM Plex Sans Thai", fontSize: "32px", }}>
                ขั้นตอนการดำเนินงาน
            </p>
            <StepProgress status={StepStatus.UPLOAD} />
            <div className="mt-3 d-flex justify-content-between align-items-end">
                <p className="fw-bold mb-0" style={{ fontFamily: "IBM Plex Sans Thai", fontSize: "32px", }}>
                    เอกสาร
                </p>
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
                        {documentListFT.map((item) => (
                            <React.Fragment key={item.id}>
                                <tr style={{ borderBottom: openDropdown[item.id] || isAnimating[item.id] ? "none" : "2px solid #0000004B" }}>
                                    <td className="align-middle">
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

                                            {item.id}. {item.title}
                                        </span>

                                        {uploadedFiles[item.id] && (
                                            <CSSTransition
                                                in={openDropdown[item.id]}
                                                timeout={300}
                                                classNames="rotate-icon"
                                            >
                                                <RiArrowDropDownLine
                                                    size={30}
                                                    className={`dropdown-icon ${openDropdown[item.id] ? "rotated" : ""}`}
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => toggleDropdown(item.id)}
                                                />
                                            </CSSTransition>
                                        )}

                                        <div style={{ marginLeft: "30px" }}>
                                            {item.type}
                                        </div>
                                    </td>
                                    <td className="text-center align-middle">
                                        {uploadedFiles[item.id]?.reduce((sum, file) => sum + file.pageCount, 0) || 0} หน้า
                                    </td>
                                    <td className="text-end">
                                        {!openDropdown[item.id] && !isAnimating[item.id] && (
                                            <Button
                                                className="w-100"
                                                type="button"
                                                label="ดูเอกสาร"
                                                bgColor="#3D4957"
                                                color="#FFFFFF"
                                                maxWidth="150px"
                                                variant="bg-hide"
                                                disabled={!uploadedFiles[item.id]}
                                                onClick={() => mergeAndOpenPdf(item.id)}
                                            />
                                        )}
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
                                            label={!uploadedFiles[item.id] ? "อัปโหลดเอกสาร" : "อัปโหลดเอกสารเพิ่มเติม"}
                                            bgColor="#3D4957"
                                            maxWidth="260px"
                                            variant="bg-hide"
                                            onClick={() => document.getElementById(`file-upload-${item.id}`)?.click()}
                                        >
                                            <RiFileDownloadLine className="me-1" size={25} />
                                        </Button>
                                    </td>
                                </tr>

                                <AnimatePresence>
                                    {openDropdown[item.id] && uploadedFiles[item.id] && (
                                        uploadedFiles[item.id].map((file, index) => (
                                            <motion.tr
                                                key={`${item.id}-file-${index}`}
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="tr-border"
                                                style={{
                                                    borderBottom: index === uploadedFiles[item.id].length - 1 ? "2px solid #0000004B" : "none",
                                                }}
                                            >
                                                <td colSpan={2} className="align-middle td-border">
                                                    <span className="fw-bold" style={{ marginLeft: "55px" }}>
                                                        {file.name}
                                                    </span>
                                                </td>
                                                <td className="text-end td-border-r">
                                                    <Button
                                                        className="w-100"
                                                        type="button"
                                                        label="ดูเอกสาร"
                                                        bgColor="#3D4957"
                                                        maxWidth="260px"
                                                        variant="bg-hide"
                                                        onClick={() => openBlobSecurely(file.data)}
                                                    />
                                                </td>
                                            </motion.tr>
                                        ))
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