import React, { useState } from "react";
import AuditPagination from "../reusable/AuditPagination";
import { OcrFields, OcrTaxDocument, OcrDetailTableDocument } from "../../types/ocrFileType";
import { detectOcrType } from "../../utils/function/orcType";
import ChecklistTax from "./ChecklistTax";
import ChecklistTable from "./ChecklistTable";

interface Props {
    ocrDocument: {
        pages: { [page: number]: OcrFields };
        pageCount: number;
    } | null;
}

const ChecklistPanel: React.FC<Props> = ({ ocrDocument }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);

    if (!ocrDocument) return <p className="text-muted">ไม่มีข้อมูล OCR</p>;

    const currentOcrFields = ocrDocument.pages[currentPage];    
    const type = detectOcrType(currentOcrFields);

    return (
        <div className="d-flex flex-column gap-2" style={{ width: "35%" }}>
            <AuditPagination
                totalPages={ocrDocument.pageCount}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />

            <div className="shadow-sm bg-white rounded-2 p-3 h-100" style={{ overflowY: "auto" }}>
                {type === "tax" && <ChecklistTax data={currentOcrFields as OcrTaxDocument} />}
                {type === "table" && <ChecklistTable data={currentOcrFields as OcrDetailTableDocument} />}
            </div>
        </div>
    );
};

export default ChecklistPanel;
