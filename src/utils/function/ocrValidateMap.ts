import { useCompanyStore } from "../../store/companyStore";
import { FieldValidation, ReceiptPaymentTransactionValidation, ReceiptPaymentValidateResult, Validate0502Result, Validate0503Page1Result, Validate0503Page2Result, Validate0701Result, ValidateFormularApprovData, ValidateInvoiceTaxResult, ValidationResult0307 } from "../../types/validateResTypes";
import { validateSubmission, validateOilCompare, validateOil0307, validateAttachment0307, validateOil0704, validateOutturn, validateFormularApprov, validate0503Page2, validate0503Page1, validateForm0502, validateInvoiceTax, validate0701New, validateReceitpPaymentNew } from "../api/validateApi";
import { buildOcr0307FieldRows } from "./ocrFieldRowsBuilder";

const cleanValue = (val?: any): string => {
    if (val === null || val === undefined) return "";
    const str = String(val);
    if (str.trim() === "" || str === ":unselected:") return "";
    return str.trim();
};

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

// const buildOilComparePayload = (ocr: any, context: any) => ({
//     docType: ocr.docType,
//     company: context.company ?? "",
//     factories: context.factories ?? "",
//     documentGroup: ocr.documentGroup ?? "",
//     fields: [
//         { data: { company: ocr.company ?? "", warehouse: ocr.depot ?? "", date: ocr.date ?? "" } },
//         { detail_table: ocr.detail_table ?? [] }
//     ]
// });

const buildOilComparePayload = (ocr: any, context: any) => {
    // Field 0: Header (ข้อมูลหัวตาราง)
    const data: Record<string, { value: string }> = {
        "บริษัท": { value: ocr.company ?? "" },
        "คลัง": { value: ocr.depot ?? "" },
        "วันที่": { value: ocr.date ?? "" }
    };

    // Field 1: detail_table (วนแต่ละแถว properties)
    const detail_table: Record<string, { value: string }>[] = Array.isArray(ocr.detail_table)
        ? ocr.detail_table.map((row: any) => {
            const props = row.properties || {};
            const cleanedRow: Record<string, { value: string }> = {};
            // เอาแค่ column_1 ถึง column_7
            for (let i = 1; i <= 7; i++) {
                const key = `column_${i}`;
                const value = props[key]?.value;
                cleanedRow[key] = { value: typeof value === "string" ? value.trim() : "" };
            }
            return cleanedRow;
        })
        : [];

    return {
        docType: ocr.docType,
        company: context.company ?? "",
        factories: context.factories ?? "",
        documentGroup: ocr.documentGroup ?? "",
        fields: [
            { data },
            { detail_table }
        ]
    };
};


// const buildOil0701Payload = (ocr: any, context: { materialID: string; company: string; factories: string }) => ({
//     docType: ocr.docType,
//     documentGroup: ocr.documentGroup ?? "",
//     materialID: context.materialID ?? "",
//     company: context.company ?? "",
//     factories: context.factories ?? "",
//     fields: ocr.detail_table ?? [],
// });

const buildOil0701Payload = (ocr: any, context: any) => ({
    docType: ocr.docType,
    documentGroup: context.documentGroup ?? "",
    fields: context.fields ?? {},
    transport: context.transport ?? "",
});
const buildAttachment0307Payload = (page1: any, context: any) => ({
    docType: page1.docType,
    company: context.company ?? "",
    factories: context.factories ?? "",
    documentGroup: context.documentGroup ?? "",
    fields: context.preparedData,
});

const buildOil0704Payload = (ocr: any, context: any) => ({
    docType: ocr.docType,
    documentGroup: context.documentGroup,
    fields: {
        ...context.genFields,
        company_name: context.company,
        form_officer_name: context.factories,
    },
});

const buildIncomeExpensePayload = (ocr: any, context: any) => ({
    docType: ocr.docType,
    documentGroup: context.documentGroup ?? "",
    fields: context.fields ?? {},
});

const buildFormularApprovPayload = (ocr: any, context: any) => ({
    docType: ocr.docType,
    documentGroup: context.documentGroup ?? "",
    fields: context.fields ?? {},
});

const build0503Page1Payload = (ocr: any, context: any) => ({
    docType: ocr.docType,
    documentGroup: context.documentGroup ?? "",
    fields: context.fields ?? {},
});

const build0503Page2Payload = (ocr: any, context: any) => ({
    docType: ocr.docType,
    documentGroup: context.documentGroup ?? "",
    fields: context.fields ?? {},
});

const build0502Payload = (ocr: any, context: any) => ({
    docType: ocr.docType,
    documentGroup: context.documentGroup ?? "",
    fields: context.fields ?? {},
});

const buildInvoiceTaxPayload = (ocr: any, context: any) => ({
    docType: ocr.docType,
    documentGroup: context.documentGroup ?? "",
    fields: context.fields ?? {},
});

const buildOutturnPayload = (ocr: any, context?: any) => {
    const value = ocr.detail_table_1?.[27]?.properties?.column_2;
    const rawQuantity = value ? cleanValue(value.value) : "";
    const quantityWithComma = rawQuantity.replace(/\./g, ',');
    const valueQuantityNum = quantityWithComma ? Number(quantityWithComma.replace(/,/g, "")) : 0;

    const dateFormatted = typeof ocr.date === "string"
        ? ocr.date.replace(/[:,;]/g, ".")
        : ocr.date;

    const product = cleanValue(ocr.product);

    const name = ocr.detail_table_1?.[27]?.properties?.column_1;
    const nameQuantity = name ? cleanValue(name.value) : "";

    return {
        docType: ocr.docType,
        company: context?.company ?? ocr.company ?? "",
        factories: context?.factories ?? ocr.factories ?? "",
        documentGroup: ocr.documentGroup ?? "",
        fields: {
            date: cleanValue(dateFormatted),
            product,
            quality: nameQuantity || "LITRES @30 deg.C", // fallback
            quantity: valueQuantityNum,
        },
    };
};

const check0307Failed = (res: any) =>
    Array.isArray(res?.data) &&
    res.data.some((row: any) =>
        Object.values(row?.properties ?? {}).some((cell: any) => cell?.passed === false)
    );

const checkTaxFailed = (res: any) => {
    if (Array.isArray(res?.data)) {
        return res.data.some((row: any) => {
            return Object.values(row?.properties ?? {}).some((v: any) => v.passed === false);
        });
    }

    if (res?.data?.properties) {
        return Object.values(res?.data.properties).some((v: any) => v.passed === false);
    }

    return false;
};
const checkOilCompareFailed = (res: any) =>
    Array.isArray(res?.data) &&
    res.data.some(
        (item: any) =>
            (item.company && item.company.passed === false) ||
            (item.warehouse && item.warehouse.passed === false) ||
            (item.validations && Array.isArray(item.validations) && item.validations.some((v: any) => v.passed === false))
    );

// const checkOil0701Failed = (res: any) =>
//     Array.isArray(res?.data) &&
//     res.data.some((row: any) =>
//         Object.values(row?.properties ?? {}).some((cell: any) => cell?.passed === false)
//     );

export const checkOil0701Failed = (
    res: { data?: Validate0701Result } | Validate0701Result | null | undefined
): boolean => {
    const data: Validate0701Result | undefined =
        (res && "data" in res ? (res as any).data : res) as Validate0701Result | undefined;

    if (!data) return true;

    for (const key of Object.keys(data)) {
        if (key === "reports" || key === "total") continue;
        // @ts-ignore
        if (data[key]?.passed === false) {
            return true;
        }
    }

    if (Array.isArray(data.reports)) {
        for (let i = 0; i < data.reports.length; i++) {
            const report = data.reports[i];
            for (const rKey of Object.keys(report)) {
                if (rKey === "products") continue;
                // @ts-ignore
                if (report[rKey]?.passed === false) {
                    return true;
                }
            }
            if (Array.isArray(report.products)) {
                for (let p = 0; p < report.products.length; p++) {
                    const prod = report.products[p];
                    for (const prodKey of Object.keys(prod)) {
                        // @ts-ignore
                        if (prod[prodKey]?.passed === false) {
                            return true;
                        }
                    }
                }
            }
        }
    }

    if (data.total) {
        for (const tKey of Object.keys(data.total)) {
            // @ts-ignore
            if (data.total[tKey]?.passed === false) {
                return true;
            }
        }
    }

    return false;
};

const checkOil0704Failed = (res: any) => {
    const d = res?.data;
    if (!d) return true;
    if (
        Object.values(d).some((f: any) => typeof f === "object" && f?.passed === false)
    ) return true;

    if (Array.isArray(d.materials)) {
        for (const mat of d.materials) {
            if (Object.values(mat).some((cell: any) => cell?.passed === false)) return true;
        }
    }
    if (Array.isArray(d.products)) {
        for (const prod of d.products) {
            if (Object.values(prod).some((cell: any) => cell?.passed === false)) return true;
        }
    }
    return false;
};

export const checkIncomeExpenseFailed = (
    res: { data?: ReceiptPaymentValidateResult } | null | undefined
): boolean => {
    const d = res?.data;
    if (!d) return true;

    // เช็คฟิลด์ header (FieldValidation ทั้งหลาย)
    const headerFields: Array<FieldValidation<any> | undefined> = [
        d.materialName,
        d.factoryName,
        d.period
    ];

    if (headerFields.some(field => field && field.passed === false)) {
        return true;
    }

    // เช็ค transactions (FieldValidation เฉพาะ field, ข้าม boolean/number)
    for (const tx of d.transactions ?? []) {
        // กำหนดคีย์ที่เป็น FieldValidation
        const keysToCheck: (keyof ReceiptPaymentTransactionValidation)[] = [
            "date",
            "recieptFromFactoryLabel",
            "recieptInvoice",
            "recieptQuantity",
            "consumeQuantity",
            "consumeInvoice",
            "transferToFactoryLabel",
            "transferInvoice",
            "transferQuantity",
            "totalInvoiceQuantity",
            "totalQuantity"
        ];

        for (const key of keysToCheck) {
            const cell = tx[key];
            if (cell && typeof cell === "object" && "passed" in cell) {
                if (cell.passed === false) {
                    return true;
                }
            }
        }
    }

    return false;
};

const checkFormularApprovFailed = (res: { data?: ValidateFormularApprovData } | null | undefined): boolean => {
    const data = res?.data;
    if (!data || !Array.isArray(data.items)) return true;

    for (const item of data.items) {
        if (item.no && item.no.passed === false) return true;
        if (item.total && item.total.passed === false) return true;

        if (item.product) {
            if (item.product.name && item.product.name.passed === false) return true;
            if (item.product.type && item.product.type.passed === false) return true;
            if (item.product.unit && item.product.unit.passed === false) return true;

            if (Array.isArray(item.product.materials)) {
                for (const mat of item.product.materials) {
                    if (mat.name && mat.name.passed === false) return true;
                    if (mat.quantity && mat.quantity.passed === false) return true;
                    if (mat.unit && mat.unit.passed === false) return true;
                    if (mat.remark && mat.remark.passed === false) return true;
                }
            }
        }
    }

    return false;
};

const checkAttachment0307Failed = (res: { data?: ValidationResult0307 }): boolean => {
    const data = res?.data;
    const failedFields: string[] = [];

    if (!data) {
        console.log("Failed: ไม่พบข้อมูล data");
        return true;
    }

    if (data.header?.passed === false) failedFields.push("header");
    if (data.from_date?.passed === false) failedFields.push("from_date");
    if (data.to_date?.passed === false) failedFields.push("to_date");
    if (data.product_name?.passed === false) failedFields.push("product_name");

    if (Array.isArray(data.details)) {
        data.details.forEach((detail, idx) => {
            if (detail.date?.passed === false) failedFields.push(`details[${idx}].date`);
            if (detail.total?.passed === false) failedFields.push(`details[${idx}].total`);
            if (detail.tax_rate?.passed === false) failedFields.push(`details[${idx}].tax_rate`);
            if (detail.tax_discount_rate?.passed === false) failedFields.push(`details[${idx}].tax_discount_rate`);
            if (detail.raw_tax?.passed === false) failedFields.push(`details[${idx}].raw_tax`);
            if (detail.discount_105?.passed === false) failedFields.push(`details[${idx}].discount_105`);
            if (detail.total_tax?.paid?.passed === false) failedFields.push(`details[${idx}].total_tax.paid`);
            if (detail.total_tax?.retrived?.passed === false) failedFields.push(`details[${idx}].total_tax.retrived`);

            if (Array.isArray(detail.materials)) {
                detail.materials.forEach((mat, matIdx) => {
                    if (mat.material_name?.passed === false) failedFields.push(`details[${idx}].materials[${matIdx}].material_name`);
                    if (mat.quantity?.passed === false) failedFields.push(`details[${idx}].materials[${matIdx}].quantity`);
                });
            }
        });
    }

    if (data.taxes) {
        Object.keys(data.taxes).forEach((tKey) => {
            const tax = (data.taxes as any)[tKey];
            if (tax.raw_tax?.passed === false) failedFields.push(`taxes[${tKey}].raw_tax`);
            if (tax.discount_105?.passed === false) failedFields.push(`taxes[${tKey}].discount_105`);
            if (tax.total_tax?.paid?.passed === false) failedFields.push(`taxes[${tKey}].total_tax.paid`);
            if (tax.total_tax?.retrived?.passed === false) failedFields.push(`taxes[${tKey}].total_tax.retrived`);
        });
    }

    if (failedFields.length > 0) {
        // console.log("Fields failed:", failedFields);
        return true;
    }
    return false;
};


const checkOutturnFailed = (res: any): boolean => {
    const d = res?.data;
    if (!d) return true;
    return Object.values(d).some((cell: any) => cell?.passed === false);
};

const check0503Page1Failed = (res: { data?: Validate0503Page1Result } | null | undefined): boolean => {
    const data = res?.data;
    if (!data) return true;

    for (const key of [
        "form_name", "ref_no", "request_no", "request_date", "request_officer", "company_name", "factory_name",
        "excise_no", "address_no", "village_no", "soi", "street", "sub_district", "district",
        "province", "zipcode", "tel_no", "form_0503a_ref", "form_0503b_ref", "total_tax"
    ] as const) {
        if (data[key]?.passed === false) return true;
    }

    if (Array.isArray(data.products)) {
        for (const prod of data.products) {
            for (const prodKey of [
                "product_name", "quantity", "tax_by_value_baht", "tax_by_value_satang",
                "tax_by_volumn_baht", "tax_by_volumn_satang", "discount_baht", "discount_satang"
            ] as const) {
                if (prod[prodKey]?.passed === false) return true;
            }
        }
    }

    return false;
};

const check0503Page2Failed = (res: { data?: Validate0503Page2Result } | null | undefined): boolean => {
    const data = res?.data;
    if (!data) return true;

    for (const key of [
        "ref_no", "excise_tax", "health_fund", "radio_fund", "sport_fund", "elder_fund", "interior_tax", "total_tax"
    ] as const) {
        if (data[key]?.passed === false) return true;
    }
    return false;
};

const checkValidate0502Failed = (res: { data?: Validate0502Result } | Validate0502Result | null | undefined): boolean => {
    const d = (res && 'data' in res) ? (res as any).data : res;
    if (!d) return true;

    for (const key of Object.keys(d)) {
        if (key !== "products" && (d as any)[key]?.passed === false) {
            return true;
        }
    }

    if (Array.isArray(d.products)) {
        for (const prod of d.products) {
            for (const prodKey of ["productType", "productName", "productUnit"]) {
                if ((prod as any)[prodKey]?.passed === false) return true;
            }
            if (Array.isArray(prod.materialsPerUnit)) {
                for (const mat of prod.materialsPerUnit) {
                    for (const matKey of ["materialType", "materialUnit", "materialQuantity", "note"]) {
                        if ((mat as any)[matKey]?.passed === false) return true;
                    }
                }
            }
        }
    }

    return false;
}

const checkValidateInvoiceFailed = (
    res: { data?: ValidateInvoiceTaxResult } | ValidateInvoiceTaxResult | null | undefined
): boolean => {
    const data: ValidateInvoiceTaxResult | undefined =
        (res && "data" in res ? (res as any).data : res) as ValidateInvoiceTaxResult | undefined;

    if (!data) return true;

    for (const key of Object.keys(data)) {
        if (key === "items") continue;
        // @ts-ignore
        if (data[key]?.passed === false) {
            // console.log(`Failed main field: ${key}`, data[key]);
            return true;
        }
    }

    if (Array.isArray(data.items)) {
        for (let idx = 0; idx < data.items.length; idx++) {
            const item = data.items[idx];
            for (const itemKey of Object.keys(item)) {
                // @ts-ignore
                if (item[itemKey]?.passed === false) {
                    // console.log(`Failed item[${idx}] field: ${itemKey}`, item[itemKey]);
                    return true;
                }
            }
        }
    }

    return false;
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
        needsContext: true,
        needsAuth: true,
    },
    "oil-07-01-page-1": {
        buildPayload: buildOil0701Payload,
        api: validate0701New,
        checkFailed: checkOil0701Failed,
        needsContext: true,
        needsAuth: true,
    },
    "oil-07-01-page-1-attach": {
        buildPayload: buildOil0701Payload,
        api: validate0701New,
        checkFailed: checkOil0701Failed,
        needsContext: true,
        needsAuth: true,
    },
    "oil-03-07-page-1": {
        buildPayload: (ocr: any) => {
            const { selectedCompany } = useCompanyStore.getState();
            const factoriesNumber = localStorage.getItem("warehouse") ?? "";

            return {
                docType: ocr.docType,
                company: selectedCompany?.name ?? "",
                factories: factoriesNumber,
                documentGroup: ocr.documentGroup ?? "",
                fields: buildOcr0307FieldRows(ocr),
            };
        },
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
        api: validateReceitpPaymentNew,
        checkFailed: checkIncomeExpenseFailed,
        needsContext: true,
        needsAuth: true,
    },
    "oil-shore-tank-1": {
        buildPayload: buildOutturnPayload,
        api: validateOutturn,
        checkFailed: checkOutturnFailed,
    },
    "oil-formular-5": {
        buildPayload: buildFormularApprovPayload,
        api: validateFormularApprov,
        checkFailed: checkFormularApprovFailed,
        needsContext: true,
        needsAuth: true,
    },
    "oil-05-03-page-3": {
        buildPayload: build0503Page1Payload,
        api: validate0503Page1,
        checkFailed: check0503Page1Failed,
        needsContext: true,
        needsAuth: true,
    },
    "oil-05-03-page-4": {
        buildPayload: build0503Page2Payload,
        api: validate0503Page2,
        checkFailed: check0503Page2Failed,
        needsContext: true,
        needsAuth: true,
    },
    "oil-05-02-page-4": {
        buildPayload: build0502Payload,
        api: validateForm0502,
        checkFailed: checkValidate0502Failed,
        needsContext: true,
        needsAuth: true,
    },
    "oil-tax-invoice-or-1": {
        buildPayload: buildInvoiceTaxPayload,
        api: validateInvoiceTax,
        checkFailed: checkValidateInvoiceFailed,
        needsContext: true,
        needsAuth: true,
    },
};