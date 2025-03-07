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
                getPdfThumbnail(pdfFiles[0].data)
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
                    <div key={index} className="mb-3">
                        <div
                            className="d-flex align-items-center justify-content-between p-2 mb-2 border shadow-sm rounded-2"
                        >
                            <span className="fw-bold" style={{ fontSize: "16px" }}>{item.name}</span>
                            <input type="checkbox" className="form-check-input" />
                        </div>

                        {item.subItems && (
                            <div className="ps-3">
                                {item.subItems.map((subItem, subIdx) => (
                                    <div key={subIdx} className="d-flex align-items-center justify-content-between p-2 mb-1 border shadow-sm rounded-2">
                                        <span className="fw-bold" style={{ fontSize: "14px" }}>{subItem}</span>
                                        <input type="checkbox" className="form-check-input" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AuditDetail;
