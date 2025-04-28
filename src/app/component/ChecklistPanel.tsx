import React, { useState } from "react";
import AuditPagination from "../reusable/AuditPagination";
import { OcrFields, OcrTaxDocument, OcrDetailTableDocument, OcrGroupedProductDocument, OcrOilProductDocument, OcrStockOilDocument, OcrDailyProductionDocument, OcrTaxForm0307Document } from "../../types/ocrFileType";
import { detectOcrType } from "../../utils/function/ocrType";
import ChecklistTax from "./ChecklistTax";
import ChecklistTable from "./ChecklistTable";
import ChecklistGroupedProduct from "./ChecklistGroupedProduct";
import ChecklistOilProduct from "./ChecklistOilProduct";
import ChecklistOilStock from "./ChecklistOilStock";
import ChecklistDailyProduction from "./ChecklistDailyProduction";
import ChecklistTaxForm0307 from "./ChecklistTaxForm0307";

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
    console.log("📦 Detected OCR type:", type);

    return (
        <div className="d-flex flex-column gap-2" style={{ width: "25%" }}>
            <AuditPagination
                totalPages={ocrDocument.pageCount}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />

            <div className="shadow-sm bg-white rounded-2 p-3 h-100" style={{ overflowY: "auto" }}>
                {type === "tax" && <ChecklistTax data={currentOcrFields as OcrTaxDocument} />}
                {type === "table" && <ChecklistTable data={currentOcrFields as OcrDetailTableDocument} />}
                {type === "grouped_product" && (
                    <ChecklistGroupedProduct data={currentOcrFields as OcrGroupedProductDocument} />
                )}
                {type === "product_document" && (
                    <ChecklistOilProduct data={currentOcrFields as OcrOilProductDocument} />
                )}
                {type === "stock_oil" && (
                    <ChecklistOilStock data={currentOcrFields as OcrStockOilDocument} />
                )}
                {type === "daily_production" && (
                    <ChecklistDailyProduction data={currentOcrFields as OcrDailyProductionDocument} />
                )}
                {type === "tax_form_0307" && (
                    <ChecklistTaxForm0307 data={currentOcrFields as OcrTaxForm0307Document} />
                )}
            </div>
        </div>
    );
};

export default ChecklistPanel;
