import { validateSubmission, validateOilCompare, validateOil0701 } from "../api/validateApi";

// TAX
const buildTaxPayload = (ocr: any) => ({
    docType: ocr.docType,
    company: ocr.company_name ?? "",
    factories: ocr.branch_no ?? "",
    documentGroup: ocr.documentGroup ?? "",
    fields: {
        company_name: ocr.company_name ?? "",
        branch_no: ocr.branch_no ?? "",
        tax_date: ocr.tax_date ?? "",
        amount: ocr.amount ?? "",
        reference_no: ocr.tax_id ?? "",
    }
});

// OIL-COMPARE
const buildOilComparePayload = (ocr: any) => ({
    docType: "oil-compare-1",
    company: ocr.company ?? "",
    factories: ocr.depot ?? "",
    documentGroup: ocr.documentGroup ?? "",
    fields: [
        { data: { company: ocr.company ?? "", warehouse: ocr.depot ?? "", date: ocr.date ?? "" } },
        { detail_table: ocr.detail_table ?? [] }
    ]
});

// OIL-07-01 (รับ ocr, context)
const buildOil0701Payload = (ocr: any, context: { materialID: string; company: string; factories: string }) => ({
    docType: "oil-07-01-page-1",
    documentGroup: ocr.documentGroup ?? "",
    materialID: context.materialID ?? "",
    company: context.company ?? "",
    factories: context.factories ?? "",
    fields: ocr.detail_table ?? [],
});

// --- CHECK FAILED LOGIC ---
const checkTaxFailed = (res: any) =>
    Array.isArray(res?.data) &&
    res.data[0]?.properties
        ? Object.values(res.data[0].properties).some((v: any) => v.passed === false)
        : false;

const checkOilCompareFailed = (res: any) =>
    Array.isArray(res?.data) &&
    res.data.some(
        (item: any) =>
            (item.company && item.company.passed === false) ||
            (item.warehouse && item.warehouse.passed === false) ||
            (item.validations && Array.isArray(item.validations) && item.validations.some((v: any) => v.passed === false))
    );

// สำหรับ 07-01 สมมติว่าสำเร็จถ้า data บรรทัดไหนมี passed === false
const checkOil0701Failed = (res: any) =>
    Array.isArray(res?.data) &&
    res.data.some((row: any) =>
        Object.values(row?.properties ?? {}).some((cell: any) => cell?.passed === false)
    );

// --- OCR_VALIDATE_MAP (version ที่รับ context ได้) ---
export const OCR_VALIDATE_MAP: Record<
    string,
    {
        buildPayload: (ocr: any, context?: any) => any;
        api: (payload: any) => Promise<any>;
        checkFailed: (res: any) => boolean;
        needsContext?: boolean; // flag สำหรับฟอร์มที่ต้องการ context เพิ่มเติม
    }
> = {
    "first-page-letter-or-1": {
        buildPayload: buildTaxPayload,
        api: validateSubmission,
        checkFailed: checkTaxFailed,
    },

    "oil-compare-1": {
        buildPayload: buildOilComparePayload,
        api: validateOilCompare,
        checkFailed: checkOilCompareFailed,
    },

    "oil-07-01-page-1": {
        buildPayload: buildOil0701Payload, // ต้องส่ง context ด้วย!
        api: validateOil0701,
        checkFailed: checkOil0701Failed,
        needsContext: true, // mark ว่าต้องการ context
    },
};

/**
 * === วิธีใช้ buildPayload (สำหรับ docType ที่ต้องการ context เช่น "oil-07-01-page-1") ===
 * 
 * const validateConfig = OCR_VALIDATE_MAP[docType];
 * 
 * // ถ้า needsContext ให้ส่ง context เพิ่ม (ตัวอย่าง context จาก zustand/localStorage)
 * const payload = validateConfig.needsContext
 *      ? validateConfig.buildPayload(page1, { materialID, company, factories })
 *      : validateConfig.buildPayload(page1);
 * 
 * const res = await validateConfig.api(payload);
 * const hasFailed = validateConfig.checkFailed(res);
 */

