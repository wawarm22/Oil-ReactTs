import React, { useState } from "react";
import { documentList } from "../../types/docList";
import PdfPreview from "./PdfPreview";
import DocumentChecklist from "./DocumentChecklist";
import ChecklistPanel from "./ChecklistPanel";
import { OcrFields } from "../../types/ocrFileType";

interface AuditDetailProps {
    selectedId: number | null;
    currentPage: number;
    uploadedFiles: { [key: number]: { name: string; data: string; pageCount: number }[] };
    folders: string[];
}

const AuditDetail: React.FC<AuditDetailProps> = ({ folders }) => {
    const [selectedOcrDocument, setSelectedOcrDocument] = useState<{
        pages: { [page: number]: OcrFields };
        pageCount: number;
    } | null>(null);

    return (
        <div className="d-flex w-100 gap-3 mt-3" style={{ maxHeight: "800px" }}>
            <DocumentChecklist
                documentList={documentList}
                folders={folders}
                onSelectDocument={(_singlePage, fullDoc) => {
                    setSelectedOcrDocument(fullDoc);
                }}
            />

            <PdfPreview ocrFields={selectedOcrDocument} />
            <ChecklistPanel ocrDocument={selectedOcrDocument} />
        </div>
    );
};

export default AuditDetail;
