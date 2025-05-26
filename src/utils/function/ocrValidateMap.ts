import { validateSubmission } from "../api/validateApi";

// Build payload utility ฟอร์มต่าง ๆ
export const buildTaxPayload = (ocr: any) => ({
    docType: "first-page-letter-or-1",
    company: ocr.company_name ?? "",
    factories: ocr.branch_no ?? "",
    documentGroup: ocr.documentGroup ?? "",
    fields: {
        company_name: ocr.company_name ?? "",
        branch_no: ocr.branch_no ?? "",
        tax_date: ocr.tax_date ?? "",
        amount: ocr.amount ?? "",
        reference_no: ocr.tax_id ?? "",
    },
});

// ตัวอย่าง stock_oil (เติมเองถ้ามี)
export const buildStockOilPayload = (ocr: any) => ({
    // ...payload
});

// แผนที่ type → { api, buildPayload }
export const OCR_VALIDATE_MAP: Record<string, {
    buildPayload: (data: any) => any,
    api: (payload: any) => Promise<any>
}> = {
    "first-page-letter-or-1": {
        buildPayload: (data) => ({
            docType: data.docType,
            company: data.company_name,
            factories: data.branch_no,
            documentGroup: data.documentGroup,
            fields: {
                company_name: data.company_name,
                branch_no: data.branch_no,
                tax_date: data.tax_date,
                amount: data.amount,
                reference_no: data.tax_id,
            }
        }),
        api: validateSubmission
    },
    // "tax_form_0503": {
    //     buildPayload: (data) => ({
    //         docType: data.docType,
    //         company: data.company_name,
    //         documentGroup: data.documentGroup,
    //         // ...ระบุ fields ตามที่ API ต้องการ
    //     }),
    //     api: validate0503Page1
    // },
    // เพิ่ม docType อื่น ๆ ตามต้องการ
};
