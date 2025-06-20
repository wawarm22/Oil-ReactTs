import React, { useEffect, useState } from "react";
import StepProgress from "../reusable/StepProgress";
import Button from "../reusable/Button";
import { CSSTransition } from "react-transition-group";
import "../../assets/css/dropdown-icon.css";
import "../../assets/css/dropdown-animation.css";
import "../../assets/css/table.css";
import { useNavigate } from "react-router-dom";
import { documentList } from "../../types/docList";
import { RiArrowDropDownLine } from "react-icons/ri";
import { StepStatus } from "../../types/enum/stepStatus";
import { AnimatePresence, motion } from "framer-motion";
import { PDFDocument } from "pdf-lib";

const MatchList: React.FC = () => {
    const navigate = useNavigate();
    const [uploadedFiles, setUploadedFiles] = useState<{
        [key: number]: { name: string; data: string; pageCount: number }[]
    }>({});
    const [openDropdown, setOpenDropdown] = useState<{ [key: number]: boolean }>({});
    const [isAnimating, setIsAnimating] = useState<{ [key: number]: boolean }>({});

    useEffect(() => {
        const storedFiles = localStorage.getItem("uploadedFiles");
        if (storedFiles) {
            setUploadedFiles(JSON.parse(storedFiles));
        }
    }, []);

    const handleBack = () => {
        navigate('/audit');
    }

    const toggleDropdown = (docId: number) => {
        setOpenDropdown(prev => ({ ...prev, [docId]: !prev[docId] }));
        if (openDropdown[docId]) {
            setIsAnimating(prev => ({ ...prev, [docId]: true }));
            setTimeout(() => setIsAnimating(prev => ({ ...prev, [docId]: false })), 300);
        }
    };

    const mergeAndOpenPdf = async (docId: number) => {
        const storedFiles = JSON.parse(localStorage.getItem("uploadedFiles") || "{}");

        if (!storedFiles[docId] || storedFiles[docId].length === 0) {
            alert("ไม่มีไฟล์ที่อัปโหลด");
            return;
        }

        const mergedPdf = await PDFDocument.create();

        for (const file of storedFiles[docId]) {
            const existingPdfBytes = await fetch(convertBase64ToBlobUrl(file.data)).then(res => res.arrayBuffer());
            const existingPdf = await PDFDocument.load(existingPdfBytes);
            const copiedPages = await mergedPdf.copyPages(existingPdf, existingPdf.getPageIndices());
            copiedPages.forEach(page => mergedPdf.addPage(page));
        }

        const mergedPdfBytes = await mergedPdf.save();
        const arrayBuffer = mergedPdfBytes.buffer as ArrayBuffer;
        const mergedBlob = new Blob([arrayBuffer], { type: "application/pdf" });
        const mergedBlobUrl = URL.createObjectURL(mergedBlob);

        window.open(mergedBlobUrl, "_blank");
    };

    const convertBase64ToBlobUrl = (base64: string) => {
        const byteCharacters = atob(base64.split(",")[1]);
        const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });
        return URL.createObjectURL(blob);
    };

    return (
        <div className="container-fluid mt-3 w-100" style={{ maxWidth: '1800px' }}>
            <p className="fw-bold mb-0" style={{ fontFamily: "IBM Plex Sans Thai", fontSize: "32px", }}>
                ขั้นตอนการดำเนินงาน
            </p>
            <StepProgress status={StepStatus.MATCH} />
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
                        </tr>
                    </thead>
                    <tbody>
                        {documentList.map((item) => (
                            <React.Fragment key={item.id}>
                                <tr style={{ borderBottom: openDropdown[item.id] || isAnimating[item.id] ? "none" : "2px solid #0000004B" }}>
                                    <td className="align-middle">
                                        <span
                                            className="fw-bold"
                                            style={{ cursor: "pointer", verticalAlign: "middle" }}
                                            onClick={() => toggleDropdown(item.id)}
                                        >
                                            <span
                                                className="me-2"
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
                                            {/* {item.type} */}
                                        </div>
                                    </td>
                                    <td className="text-end w-50">
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
                                        <Button
                                            className="ms-3 w-100"
                                            type="button"
                                            label="พร้อมรับการเปรียบเทียบ"
                                            bgColor="#3D4957"
                                            color="#FFFFFF"
                                            maxWidth="260px"
                                            variant="bg-hide"
                                            disabled
                                        />
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
                                                    <span className="fw-bold" style={{ marginLeft: "50px" }}>
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
                                                        onClick={() => window.open(convertBase64ToBlobUrl(file.data), "_blank")}
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
                        onClick={handleBack}
                        bgColor="#717171"
                        variant="bg-hide"
                    />
                    <Button
                        type="button"
                        label="ตรวจสอบการเปรียบเทียบ"
                        maxWidth="235px"
                        bgColor="#FFCB02"
                        color="#1E2329"
                        variant="bg-hide"
                        onClick={() => navigate("/match-document")}
                    />
                </div>
            </div>
        </div>
    );
};

export default MatchList;
