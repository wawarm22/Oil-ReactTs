import React, { useState, useEffect } from "react";
import { getPdfThumbnail } from "../../utils/function/pdfUtils";
import { documentList } from "../../types/docList";
import PdfPreview from "./PdfPreview";
import DocumentChecklist from "./DocumentChecklist";
import ChecklistPanel from "./ChecklistPanel";

interface AuditDetailProps {
    selectedId: number | null;
    currentPage: number;
    uploadedFiles: { [key: number]: { name: string; data: string; pageCount: number }[] };
    folders: string[];
}

const AuditDetail: React.FC<AuditDetailProps> = ({ selectedId, currentPage, uploadedFiles, folders }) => {
    const [pdfPageImage, setPdfPageImage] = useState<string | null>(null);
    const [selectedOcrFields, setSelectedOcrFields] = useState<Record<string, any> | null>(null);

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
            <DocumentChecklist
                documentList={documentList}
                folders={folders}
                onSelectDocument={setSelectedOcrFields}
            />
            <PdfPreview imageSrc={pdfPageImage} currentPage={currentPage} ocrFields={selectedOcrFields}/>
            <ChecklistPanel ocrFields={selectedOcrFields} />
        </div>
    );
};

export default AuditDetail;
