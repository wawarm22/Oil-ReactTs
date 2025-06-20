import React, { } from "react";
import AuditPagination from "../reusable/AuditPagination";
import {
    OcrFields, OcrTaxDocument, OcrDetailTableDocument, OcrGroupedProductDocument, OcrOilProductDocument,
    // OcrStockOilDocument, OcrDailyProductionDocument, OcrTaxForm0307Document, OcrRefineryTaxInvoiceDocument, OcrImportEntry0409Document, OcrOutturnStatementDocument, OcrDeliveryInvoiceDocument, OcrTaxForm0503Document, OcrComparison0503And0307Document, OcrTaxPaymentCertificateDocument, OcrOilPurchaseSummaryDocument, OcrCustomsReceiptDocument, OcrDailyComparisonDocument, OcrTaxReceiptExciseDocument, OcrAttachment0307Document, OcrAttachment0704Document, OcrTaxForm0502Document, OcrTaxForm0503Page2Document, OcrIncomeNExpenseDocument, OcrDeliveryInvoicePipline
} from "../../types/ocrFileType";
import { detectOcrType } from "../../utils/function/ocrType";
import ChecklistTax from "./ChecklistTax";
import ChecklistTable from "./ChecklistTable";
import ChecklistGroupedProduct from "./ChecklistGroupedProduct";
import ChecklistOilProduct from "./ChecklistOilProduct";
// import ChecklistTaxForm0307 from "./ChecklistTaxForm0307";
// import ChecklistRefineryTaxInvoice from "./ChecklistRefineryTaxInvoice";
// import ChecklistImportEntry0409 from "./ChecklistImportEntry0409";
// import ChecklistOutturnStatement from "./ChecklistOutturnStatement";
// import ChecklistDeliveryInvoice from "./ChecklistDeliveryInvoice";
// import ChecklistTaxForm0503 from "./ChecklistTaxForm0503";
// import ChecklistComparison0503And0307 from "./ChecklistComparison0503And0307";
// import ChecklistTaxPaymentCertificate from "./ChecklistTaxPaymentCertificate";
// import ChecklistOilPurchaseSummary from "./ChecklistOilPurchaseSummary";
// import ChecklistCustomsReceipt from "./ChecklistCustomsReceipt";
// import ChecklistDailyComparison from "./ChecklistDailyComparison";
// import ChecklistTaxReceiptExcise from "./ChecklistTaxReceiptExcise";
// import ChecklistAttachment0307 from "./ChecklistAttachment0307";
// import ChecklistAttachment0704 from "./ChecklistAttachment0704";
// import ChecklistTaxForm0502 from "./ChecklistTaxForm0502";
// import ChecklistTaxForm0503Page2 from "./ChecklistTaxForm0503Page2";
// import ChecklistDeliveryInvoicePipline from "./ChecklistDeliveryInvoicePipline";
// import ChecklistForm0701 from "./ChecklistForm0701";
// import ChecklistForm0702 from "./ChecklistForm0702";
// import ChecklistIncomeNExpense from "./ChecklistIncomeNExpense";
import { ValidateResultsByDoc } from "../../types/checkList";

interface Props {
    ocrDocument: {
        pages: { [page: number]: OcrFields };
        pageCount: number;
        pageFileKeyMap?: { [page: number]: string };
    } | null;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    selectedDocId?: number | null;
    selectedSubtitleIdx?: number | null;
    // onValidationStatusChange?: (status: { docId: number; subIdx: number; failed: boolean }) => void;
    validateResultsByDoc?: ValidateResultsByDoc;
}

const ChecklistMatch: React.FC<Props> = ({
    ocrDocument,
    currentPage,
    setCurrentPage,
    selectedDocId,
    selectedSubtitleIdx,
    // onValidationStatusChange,
    validateResultsByDoc
}) => {
    // const [currentPage, setCurrentPage] = useState<number>(1);
    if (!ocrDocument) return (
        <div className="flex-grow-1 col-12 col-lg-3 px-0 mb-3 mb-lg-0">
            <div className="shadow-sm bg-white rounded-2 p-3 h-100" style={{ overflowY: "auto" }}>
                <p className="text-muted">
                    กำลังประมวลผล OCR กรุณารอ...
                </p>
            </div>
        </div>
    );

    const { pages } = ocrDocument;
    const selectedFields = pages[currentPage];

    if (!selectedFields) {
        console.warn(`No OCR data found for page ${currentPage}`);
        return <p className="text-muted">ไม่พบข้อมูล OCR ในหน้านี้</p>;
    }

    if (selectedDocId == null || selectedSubtitleIdx == null || !validateResultsByDoc) {
        return <div>กรุณาเลือกเอกสาร</div>;
    }
    const validateResult = validateResultsByDoc[selectedDocId]?.[selectedSubtitleIdx]?.[currentPage]?.validateResult;
    const currentOcrFields = ocrDocument.pages[currentPage];
    const type = detectOcrType(currentOcrFields);
    console.log("Detected OCR type:", type);

    // const prevPageFields = ocrDocument.pages[currentPage - 1];

    // let extraOilType: string | undefined;

    // if (
    //     currentOcrFields.docType === "oil-07-01-page-1-attach" &&
    //     prevPageFields &&
    //     prevPageFields.docType === "oil-07-01-page-1"
    // ) {
    //     extraOilType = prevPageFields.oil_type;
    // }

    return (
        <div className="flex-grow-1 col-12 col-lg-3 px-0 mb-3 mb-lg-0 d-flex flex-column gap-2"
            style={{ minWidth: 0, width: '25%' }}>
            <AuditPagination
                totalPages={ocrDocument.pageCount}
                currentPage={currentPage}
                setCurrentPage={(page) => {
                    setCurrentPage(page);
                }}
                validateResultsByDoc={validateResultsByDoc}
                selectedDocId={selectedDocId}
                selectedSubtitleIdx={selectedSubtitleIdx}
            />

            <div className="shadow-sm bg-white rounded-2 p-3 h-100" style={{ overflowY: "auto" }}>
                {type === "tax" && (
                    <ChecklistTax
                        data={selectedFields as OcrTaxDocument}
                        validateResult={validateResult}
                    />
                )}

                {type === "table" &&
                    <ChecklistTable
                        data={currentOcrFields as OcrDetailTableDocument}
                        validateResult={validateResult}
                    />
                }
                {type === "grouped_product" && (
                    <ChecklistGroupedProduct
                        data={currentOcrFields as OcrGroupedProductDocument}
                        validateResult={validateResult}
                    />
                )}
                {type === "product_document" && (
                    <ChecklistOilProduct data={currentOcrFields as OcrOilProductDocument} />
                )}
                {/* {type === "stock_oil" && (
                    <ChecklistForm0701
                        data={currentOcrFields as OcrStockOilDocument}
                        oilTypeFromPrevPage={extraOilType}
                    />
                )}
                {type === "daily_production" && (
                    <ChecklistForm0702 data={currentOcrFields as OcrDailyProductionDocument} />
                )}
                {type === "tax_form_0307" && (
                    <ChecklistTaxForm0307 data={currentOcrFields as OcrTaxForm0307Document} />
                )}
                {type === "refinery_tax_invoice" && (
                    <ChecklistRefineryTaxInvoice data={currentOcrFields as OcrRefineryTaxInvoiceDocument} />
                )}
                {type === "import_entry_0409" && (
                    <ChecklistImportEntry0409 data={currentOcrFields as OcrImportEntry0409Document} />
                )}
                {type === "outturn_statement" && (
                    <ChecklistOutturnStatement data={currentOcrFields as OcrOutturnStatementDocument} />
                )}
                {type === "delivery_invoice" && (
                    <ChecklistDeliveryInvoice data={currentOcrFields as OcrDeliveryInvoiceDocument} />
                )}
                {type === "tax_form_0503" && <ChecklistTaxForm0503 data={currentOcrFields as OcrTaxForm0503Document} />}
                {type === "tax_form_0503_page2" && <ChecklistTaxForm0503Page2 data={currentOcrFields as OcrTaxForm0503Page2Document} />}
                {type === "comparison_0503_0307" && (
                    <ChecklistComparison0503And0307 data={currentOcrFields as OcrComparison0503And0307Document} />
                )}
                {type === "tax_payment_certificate" && (
                    <ChecklistTaxPaymentCertificate data={currentOcrFields as OcrTaxPaymentCertificateDocument} />
                )}
                {type === "oil_purchase_summary" && (
                    <ChecklistOilPurchaseSummary data={currentOcrFields as OcrOilPurchaseSummaryDocument} />
                )}
                {type === "customs_receipt" && (
                    <ChecklistCustomsReceipt data={currentOcrFields as OcrCustomsReceiptDocument} />
                )}
                {type === "daily_comparison" && (
                    <ChecklistDailyComparison data={currentOcrFields as OcrDailyComparisonDocument} />
                )}
                {type === "tax_receipt_excise" && (
                    <ChecklistTaxReceiptExcise data={currentOcrFields as OcrTaxReceiptExciseDocument} />
                )}
                {type === "attachment_0307" && (
                    <ChecklistAttachment0307 data={currentOcrFields as OcrAttachment0307Document} />
                )}
                {type === "attachment_0704" && (
                    <ChecklistAttachment0704 data={currentOcrFields as OcrAttachment0704Document} />
                )}
                {type === "tax_form_0502" && (
                    <ChecklistTaxForm0502 data={currentOcrFields as OcrTaxForm0502Document} />
                )}
                {type === "oil-income-expense" && (
                    <ChecklistIncomeNExpense data={currentOcrFields as OcrIncomeNExpenseDocument} />
                )}
                {type === "oil-invoice-pipline" && (
                    <ChecklistDeliveryInvoicePipline data={currentOcrFields as OcrDeliveryInvoicePipline} />
                )} */}
            </div>
        </div>
    );
};

export default ChecklistMatch;
