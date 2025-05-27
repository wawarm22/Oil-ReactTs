import { FieldValidation, ValidationResult0307, ValidationResultData } from "../../types/validateResTypes";
import { validateSubmission, validateOilCompare, validateOil0701, validateOil0307, validateAttachment0307, validateOil0704, validateReceitpPayment, validateOutturn } from "../api/validateApi";
import { buildOcr0307FieldRows } from "./ocrFieldRowsBuilder";

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

const buildOil0701Payload = (ocr: any, context: { materialID: string; company: string; factories: string }) => ({
    docType: "oil-07-01-page-1",
    documentGroup: ocr.documentGroup ?? "",
    materialID: context.materialID ?? "",
    company: context.company ?? "",
    factories: context.factories ?? "",
    fields: ocr.detail_table ?? [],
});

export const buildAttachment0307Payload = (_page1: any, context: any) => ({
    docType: "oil-formular-2",
    company: context.company ?? "",
    factories: context.factories ?? "",
    documentGroup: context.documentGroup ?? "",
    fields: context.preparedData,
});

const buildOil0704Payload = (_ocr: any, context: any) => ({
    docType: "oil-07-04-page-1",
    documentGroup: context.documentGroup,
    fields: {
        ...context.genFields,
        company_name: context.company,
        form_officer_name: context.factories,
    },
});

const buildIncomeExpensePayload = (_ocr: any, context: any) => ({
    docType: "oil-income-n-expense-1",
    documentGroup: context.documentGroup ?? "",
    fields: context.fields ?? {},
});

const buildOutturnPayload = (ocr: any, context?: any) => {
    // ocr คือ page1 ที่ได้จาก ocrByDocId
    // context มักไม่ต้องใช้สำหรับ shore tank (แต่รับไว้เพื่ออนาคต)
    const value = ocr.detail_table_1?.[27]?.properties?.column_2 || {};
    const name = ocr.detail_table_1?.[27]?.properties?.column_1 || {};
    const valueQuantity = (typeof value.value === "string" ? value.value : "")?.replace(/,/g, "");
    const nameQuantity = (typeof name.value === "string" ? name.value : "") ?? "";

    return {
        docType: "oil-shore-tank-1",
        company: context?.company ?? ocr.company ?? "",
        factories: context?.factories ?? ocr.factories ?? "",
        documentGroup: ocr.documentGroup ?? "",
        fields: {
            date: ocr.date ?? "",
            product: ocr.product ?? "",
            quality: nameQuantity,
            quantity: Number(valueQuantity) || 0,
        },
    };
};

const check0307Failed = (res: any) =>
    Array.isArray(res?.data) &&
    res.data.some((row: any) =>
        Object.values(row?.properties ?? {}).some((cell: any) => cell?.passed === false)
    );

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

const checkOil0701Failed = (res: any) =>
    Array.isArray(res?.data) &&
    res.data.some((row: any) =>
        Object.values(row?.properties ?? {}).some((cell: any) => cell?.passed === false)
    );

const checkOil0704Failed = (res: any) => {
    const d = res?.data;
    if (!d) return true;
    // ตัวอย่าง logic: ถ้ามี field ไหนใน data/materials/products ที่ passed === false
    if (
        Object.values(d).some((f: any) => typeof f === "object" && f?.passed === false)
    ) return true;

    // check materials
    if (Array.isArray(d.materials)) {
        for (const mat of d.materials) {
            if (Object.values(mat).some((cell: any) => cell?.passed === false)) return true;
        }
    }
    // check products
    if (Array.isArray(d.products)) {
        for (const prod of d.products) {
            if (Object.values(prod).some((cell: any) => cell?.passed === false)) return true;
        }
    }
    return false;
};

const checkIncomeExpenseFailed = (res: { data?: Partial<ValidationResultData> } | null | undefined): boolean => {
    const d = res?.data;
    if (!d) return true;

    // ตรวจ header
    if (d.header && Object.values(d.header).some((h: FieldValidation<any>) => h?.passed === false)) return true;

    // ตรวจแต่ละ section
    for (const sectionKey of ["openingBalance", "receipt", "disbursement"] as const) {
        const rows = d[sectionKey];
        if (Array.isArray(rows)) {
            for (const row of rows) {
                // ถ้าเป็น disbursement จะมี nested object ต้อง handle เพิ่ม (ตาม type ข้างบน)
                // แต่เบื้องต้นใช้ Object.values เช็ค cell.passed ได้เหมือนเดิมถ้า structure ไม่ซับซ้อนมาก
                if (row && Object.values(row).some((cell: any) => {
                    // กรณีเป็น object nested
                    if (typeof cell === "object" && cell !== null && "passed" in cell) {
                        return cell.passed === false;
                    }
                    // ถ้าเป็น array เช่น localSale, transfer
                    if (Array.isArray(cell)) {
                        return cell.some((item: any) => item?.passed === false ||
                            (typeof item === "object" && "passed" in item && item.passed === false));
                    }
                    return false;
                })) return true;
            }
        }
    }

    // ตรวจ endOfMonth
    if (d.endOfMonth && Object.values(d.endOfMonth).some((cell: FieldValidation<any>) => cell?.passed === false)) {
        return true;
    }

    return false;
};

export const checkAttachment0307Failed = (res: { data?: ValidationResult0307 }): boolean => {
    const data = res?.data;
    if (!data) return true;

    if (
        data.header?.passed === false ||
        data.from_date?.passed === false ||
        data.to_date?.passed === false ||
        data.product_name?.passed === false
    ) return true;

    if (Array.isArray(data.details)) {
        for (const detail of data.details) {
            if (
                detail.date?.passed === false ||
                detail.total?.passed === false ||
                detail.tax_rate?.passed === false ||
                detail.tax_discount_rate?.passed === false ||
                detail.raw_tax?.passed === false ||
                detail.discount_105?.passed === false
            ) return true;
            if (
                detail.total_tax?.paid?.passed === false ||
                detail.total_tax?.retrived?.passed === false
            ) return true;
            if (Array.isArray(detail.materials)) {
                for (const mat of detail.materials) {
                    if (mat.material_name?.passed === false || mat.quantity?.passed === false) return true;
                }
            }
        }
    }

    if (data.taxes) {
        for (const tKey of Object.keys(data.taxes)) {
            const tax = (data.taxes as any)[tKey];
            if (
                tax.raw_tax?.passed === false ||
                tax.discount_105?.passed === false ||
                tax.total_tax?.paid?.passed === false ||
                tax.total_tax?.retrived?.passed === false
            ) return true;
        }
    }
    return false;
};

const checkOutturnFailed = (res: any): boolean => {
    const d = res?.data;
    if (!d) return true;
    // ตัวอย่าง: failed ถ้ามี field ไหน passed === false
    return Object.values(d).some((cell: any) => cell?.passed === false);
};

export const OCR_VALIDATE_MAP: Record<
    string,
    {
        buildPayload: (ocr: any, context?: any) => any;
        api: (payload: any) => Promise<any>;
        checkFailed: (res: any) => boolean;
        needsContext?: boolean;
        needsAuth?: boolean;
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
        buildPayload: buildOil0701Payload,
        api: validateOil0701,
        checkFailed: checkOil0701Failed,
        needsContext: true,
    },
    "oil-03-07-page-1": {
        buildPayload: (ocr) => ({
            docType: "oil-03-07-page-1",
            company: ocr.company ?? "",
            factories: ocr.factories ?? "",
            documentGroup: ocr.documentGroup ?? "",
            fields: buildOcr0307FieldRows(ocr)
        }),
        api: validateOil0307,
        checkFailed: check0307Failed,
    },
    "oil-formular-2": {
        buildPayload: buildAttachment0307Payload,
        api: validateAttachment0307,
        checkFailed: checkAttachment0307Failed,
        needsContext: true,
        needsAuth: true,
    },
    "oil-07-04-page-1": {
        buildPayload: buildOil0704Payload,
        api: validateOil0704,
        checkFailed: checkOil0704Failed,
        needsContext: true,
    },
    "oil-income-n-expense-1": {
        buildPayload: buildIncomeExpensePayload,
        api: validateReceitpPayment,
        checkFailed: checkIncomeExpenseFailed,
        needsContext: true,
        needsAuth: true,
    },
    "oil-shore-tank-1": {
        buildPayload: buildOutturnPayload,
        api: validateOutturn,
        checkFailed: checkOutturnFailed,
    },
};



