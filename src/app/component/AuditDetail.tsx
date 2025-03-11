import React, { useState, useEffect } from "react";
import { getPdfThumbnail } from "../../utils/function/pdfUtils";
import { checklistData, ChecklistItem } from "../../types/checkList";

interface AuditDetailProps {
    selectedId: number | null;
    currentPage: number;
    uploadedFiles: { [key: number]: { name: string; data: string; pageCount: number }[] };
}

const AuditDetail: React.FC<AuditDetailProps> = ({ selectedId, currentPage, uploadedFiles }) => {
    const [pdfPageImage, setPdfPageImage] = useState<string | null>(null);

    useEffect(() => {
        if (selectedId !== null && uploadedFiles[selectedId]) {
            const pdfFiles = uploadedFiles[selectedId];

            if (pdfFiles.length > 0) {
                let totalPageCount = 0;
                let selectedPdf = pdfFiles[0];

                for (const pdf of pdfFiles) {
                    totalPageCount += pdf.pageCount;
                    if (currentPage <= totalPageCount) {
                        selectedPdf = pdf;
                        break;
                    }
                }

                const pageInSelectedPdf = currentPage - (totalPageCount - selectedPdf.pageCount);

                getPdfThumbnail(selectedPdf.data, pageInSelectedPdf)
                    .then((thumbnail) => setPdfPageImage(thumbnail))
                    .catch(() => setPdfPageImage(null));
            }
        }
    }, [selectedId, currentPage, uploadedFiles]);

    return (
        <div className="d-flex w-100 gap-3 mt-3" style={{ maxHeight: "750px" }}>
            <div className="shadow-sm rounded-2 p-3 d-flex justify-content-center align-items-center" style={{ width: "45%", background: "#E0E0E0", borderRadius: "8px" }}>
                {pdfPageImage && (
                    <img src={pdfPageImage} alt={`PDF Page ${currentPage}`} className="w-100 h-100" style={{ objectFit: "contain", borderRadius: "6px" }} />
                )}
            </div>

            <div className="shadow-sm bg-white rounded-2 p-3" style={{ width: "55%", overflowY: "auto", borderRadius: "8px" }}>
                {checklistData.map((item: ChecklistItem, index) => (
                    <div key={index} className="mb-1 d-flex">
                        <div
                            className="me-2 rounded-2"
                            style={{
                                width: "4px",
                                height: "38px",
                                backgroundColor: "#BDBDBD",
                            }}
                        ></div>

                        <div className="flex-grow-1">
                            <div
                                className="d-flex align-items-center justify-content-between p-2 mb-2 border shadow-sm rounded-2"
                                onClick={() => document.getElementById(`checkbox-${index}`)?.click()}
                                style={{ cursor: "pointer" }}
                            >
                                <span className="fw-bold" style={{ fontSize: "16px" }}>{item.name}</span>
                                <input type="checkbox" id={`checkbox-${index}`} />
                            </div>

                            {item.subItems && (
                                <div className="ps-4">
                                    {item.subItems.map((subItem, subIdx) => (
                                        <div key={subIdx} className="d-flex">
                                            <div
                                                className="me-2 rounded-2"
                                                style={{
                                                    width: "4px",
                                                    height: "38px",
                                                    backgroundColor: "#BDBDBD",
                                                }}
                                            ></div>

                                            <div
                                                className="flex-grow-1 d-flex align-items-center justify-content-between p-2 mb-2 border shadow-sm rounded-2"
                                                onClick={() => document.getElementById(`sub-checkbox-${index}-${subIdx}`)?.click()}
                                                style={{ cursor: "pointer" }}
                                            >
                                                <span className="fw-bold" style={{ fontSize: "14px" }}>{subItem}</span>
                                                <input type="checkbox" id={`sub-checkbox-${index}-${subIdx}`} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AuditDetail;
