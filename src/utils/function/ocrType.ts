import { OcrFields } from "../../types/ocrFileType";

export const detectOcrType = (fields: Record<string, any>): OcrFields["type"] => {
    if (!fields || typeof fields !== "object") return "unknown";

    if ("amount" in fields && "tax_id" in fields) return "tax";    

    if ("docType" in fields && typeof fields.docType === "string") {
        const docType = fields.docType.trim();
        
        if (docType === "oil-05-03-page-3") {
            return "tax_form_0503";
        }

        if (docType === "oil-03-07-page-1") {
            return "tax_form_0307";
        }

        if (docType === "oil-05-03-page-4") {
            return "tax_form_0503_page2";
        }

        if (docType === "oil-07-02-page-1") {
            return "daily_production";
        }

        if (docType === "oil-shore-tank-1") {
            return "outturn_statement";
        }

        if (docType === "oil-formular-2") {
            return "attachment_0307";
        }

        if (docType === "oil-income-n-expense-1") {
            return "oil-income-expense";
        }

        if (docType === "oil-pipline-delivery-customer") {
            return "oil-invoice-pipline";
        }

        if (docType === "oil-formular-5") {
            return "grouped_product"
        }

        if (docType === "oil-05-02-page-4") {
            return "tax_form_0502"
        }

        if (docType === "oil-07-01-page-1-attach" || docType === "oil-07-01-page-1") {
            return "stock_oil"
        }
    }
    
    if ("form_type" in fields && typeof fields.form_type === "string") {
        const formType = fields.form_type.trim();
        if (formType.includes("ภส.03-07") || formType.includes("ภส.๐๓-๐๗")) {
            return "tax_form_0307";
        }
        
        if (formType.includes("ภส.๐๗-๐๑") || formType.includes("ภส.07-01")) {
            return "stock_oil";
        }
        
        if (formType.includes("ภส.05-02") || formType.includes("ภส.๐๕-๐๒") || formType.includes("กส.๐๕-๐๒")) {
            return "tax_form_0502";
        }    }

    if (
        fields.header?.includes("สรุปภาษีสรรพสามิต") &&
        fields.oil &&
        Array.isArray(fields.detail_table)
    ) {
        return "attachment_0307";
    }

    if ("customer_name" in fields && "tax_id" in fields && "doc_no" in fields) {
        return "refinery_tax_invoice";
    }

    if (fields.header?.includes("ตารางเทียบ แบบรายการภาษีสรรพสามิต (ภส.03-07)") || fields.header?.includes("ตารางเปรียบเทียบ แบบรายการภาษีสรรพสามิต (ภส.03-07)")) {
        return "comparison_0503_0307";
    }

    if (fields.header && fields.header.includes("ตารางเปรียบเทียบการจ่ายวัตถุดิบ (แบบ ภส.07-01) เทียบกับปริมาณการผลิตและจำหน่าย (ภส.07-02)") && fields.header.includes("07-01")) {
        return "daily_comparison";
    }

    if ("receipt_type" in fields && "tax_id" in fields && "company_name" in fields && "duty_payment" in fields) {
        return "customs_receipt";
    }

    if (
        "customer_name" in fields &&
        "customer_code" in fields &&
        "send_address" in fields &&
        "delivery_no" in fields
    ) {
        return "delivery_invoice";
    }

    if (
        "registration_no" in fields &&
        "address" in fields &&
        "tax_id" in fields &&
        "invoice_no" in fields
    ) {
        return "tax_payment_certificate";
    }

    if (
        "receipt_no" in fields &&
        "submit_date" in fields &&
        "received_from" in fields &&
        "tycoon" in fields
    ) {
        return "tax_receipt_excise";
    }

    if ("form_no" in fields && "tax_id" in fields && "company_name_th" in fields) {
        return "import_entry_0409";
    }

    if ("company_name" in fields && "date" in fields && Array.isArray(fields.detail_table)) {
        const hasExpectedProps = fields.detail_table.some((row: any) => {
            const p = row?.properties ?? {};
            return "no" in p && "tax_no" in p && "date_tax" in p;
        });
        if (hasExpectedProps) {
            return "oil_purchase_summary";
        }
    }

    if (
        Array.isArray(fields.detail_table_1) &&
        Array.isArray(fields.detail_table_2) &&
        fields.detail_table_1[0]?.properties?.column_7
    ) {
        return "attachment_0704";
    }

    if ("detail_table" in fields && Array.isArray(fields.detail_table)) {         

        const hasGroupedRow = fields.detail_table.some(
            (row: any) => row?.properties?.material_per_liter?.value === "รวม"
        );

        if (hasGroupedRow) return "grouped_product";

        const hasOilProductPattern = fields.detail_table.some((row: any) => {
            const props = row?.properties ?? {};
            return (
                "column_5" in props &&
                "column_6" in props &&
                "column_7" in props &&
                typeof props.column_5?.value === "string" &&
                props.column_5?.value.includes("\n")
            );
        });

        if (hasOilProductPattern) return "product_document";

        return "table";
    }

    return "unknown";
};
