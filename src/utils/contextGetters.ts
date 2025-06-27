import { useCompanyStore } from "../store/companyStore";
import { getPrepared0129, getPrepared0307, getPrepared0307Attachment, getPrepared0502, getPrepared0503, getPrepared0701, getPrepared0704, getPreparedFormularApprov, getPreparedInvoiceTax, getPreparedInvoiceThappline, getPreparedReceiptExcise, getPreparedReceitpPaymentNew, getPreparedTaxInvoice } from "./api/validateApi";
import { cleanCellValue } from "./function/ocrUtils";

export type ContextOptions = { auth?: any };

export const getContextForDocType: Record<
    string,
    (page1: any, options?: ContextOptions) => Promise<any>
> = {
    "oil-07-01-page-1": async (page1, options) => {
        const auth = options?.auth;
        if (!page1.id || !auth) return {};

        const resp = await getPrepared0701(page1.id, auth);
        if (!resp?.data) return {};

        return {
            documentGroup: resp.data.documentGroup,
            docType: resp.data.docType,
            fields: resp.data.fields,
            transport: resp.data.transport,
        };
    },
    "oil-07-01-page-1-attach": async (page1, options) => {
        const auth = options?.auth;
        if (!page1.id || !auth) return {};
        const resp = await getPrepared0701(page1.id, auth);
        if (!resp?.data) return {};
        return {
            documentGroup: resp.data.documentGroup,
            docType: resp.data.docType,
            fields: resp.data.fields,
            transport: resp.data.transport,
        };
    },
    "oil-07-02-page-1": async (page1) => {
        const company = useCompanyStore.getState().selectedCompany?.name ?? "";
        const factories = localStorage.getItem("warehouse") ?? "";
        const fixedLabels = [
            { key: "column_1", label: "วันเดือนปี" },
            { key: "column_2", label: "รายการ" },
            { key: "column_3", label: "หลักฐานเลขที่" },
            { key: "column_4", label: "ผลิตได้" },
            { key: "column_5", label: "รับคืนจากคลังสินค้าทัณฑ์บน" },
            { key: "column_6", label: "อื่นๆ" },
            { key: "column_7", label: "รวมรับสินค้า" },
            { key: "column_8", label: "จำหน่ายในประเทศ" },
            { key: "column_9", label: "จำหน่ายต่างประเทศ" },
            { key: "column_10", label: "ใช้ในโรงงานอุตสาหกรรม" },
            { key: "column_11", label: "คลังสินค้าทัณฑ์บน" },
            { key: "column_12", label: "เสียหาย" },
            { key: "column_13", label: "อื่นๆ" },
            { key: "column_14", label: "รวมจ่ายสินค้า" },
            { key: "column_15", label: "ยอดคงเหลือ" },
            { key: "column_16", label: "หมายเหตุ" },
        ];
        let tables = page1.detail_table ?? [];

        let startIdx = 2;
        while (true) {
            const props = tables[startIdx]?.properties as Record<string, any> | undefined;
            const col1 = props?.column_1?.value ?? "";
            const col2 = props?.column_2?.value ?? "";
            const isCol1Empty = !col1 || col1.trim() === "";
            const hasYodyok =
                (col1 && col1.replace(/\s+/g, "").toLowerCase().includes("ยอดยก")) ||
                (col2 && col2.replace(/\s+/g, "").toLowerCase().includes("ยอดยก"));

            if (isCol1Empty || hasYodyok) {
                startIdx++;
            } else {
                break;
            }
        }

        const ocrFieldRows = tables.slice(startIdx).map((row: any) => {
            const props = row.properties as Record<string, any>;
            const properties: Record<string, { value: string }> = {};
            fixedLabels.forEach(({ key, label }) => {
                let value = cleanCellValue(props?.[key]?.value ?? "");
                if (
                    (key === "column_4" || key === "column_8" || key === "column_14") &&
                    value === "049,88800"
                ) {
                    value = "0";
                }
                properties[label] = { value };
            });
            return { properties };
        });

        return {
            company,
            factories,
            fields: ocrFieldRows,
        };
    },

    "oil-tax-invoice-2": async (page1, options) => {
        const auth = options?.auth;
        if (!page1.id || !auth) return {};
        const resp = await getPreparedTaxInvoice(page1.id, auth);
        if (!resp?.data) return {};
        return resp.data;
    },
    "oil-tax-invoice-4": async (page1, options) => {
        const auth = options?.auth;
        if (!page1.id || !auth) return {};
        const resp = await getPreparedTaxInvoice(page1.id, auth);
        if (!resp?.data) return {};
        return resp.data;
    },
    "oil-tax-invoice-7": async (page1, options) => {
        const auth = options?.auth;
        if (!page1.id || !auth) return {};
        const resp = await getPreparedTaxInvoice(page1.id, auth);
        if (!resp?.data) return {};
        return resp.data;
    },
    "oil-tax-invoice-9": async (page1, options) => {
        const auth = options?.auth;
        if (!page1.id || !auth) return {};
        const resp = await getPreparedTaxInvoice(page1.id, auth);
        if (!resp?.data) return {};
        return resp.data;
    },

    "oil-formular-1": async (page1, options) => {
        const auth = options?.auth;
        if (!page1.id || !auth) return {};
        const res = await getPrepared0307Attachment(page1.id, auth);
        const preparedData = res?.data ?? null;

        const company = useCompanyStore.getState().selectedCompany?.name ?? "";
        const factories = localStorage.getItem("warehouse") ?? "";

        return {
            preparedData,
            company,
            factories,
            documentGroup: page1.documentGroup ?? "",
        };
    },
    "oil-formular-2": async (page1, options) => {
        const auth = options?.auth;
        if (!page1.id || !auth) return {};
        const res = await getPrepared0307Attachment(page1.id, auth);
        const preparedData = res?.data ?? null;

        const company = useCompanyStore.getState().selectedCompany?.name ?? "";
        const factories = localStorage.getItem("warehouse") ?? "";

        return {
            preparedData,
            company,
            factories,
            documentGroup: page1.documentGroup ?? "",
        };
    },
    "oil-formular-3": async (page1, options) => {
        const auth = options?.auth;
        if (!page1.id || !auth) return {};
        const res = await getPrepared0307Attachment(page1.id, auth);
        const preparedData = res?.data ?? null;

        const company = useCompanyStore.getState().selectedCompany?.name ?? "";
        const factories = localStorage.getItem("warehouse") ?? "";

        return {
            preparedData,
            company,
            factories,
            documentGroup: page1.documentGroup ?? "",
        };
    },
    "oil-07-04-page-1": async (page1, options) => {
        const auth = options?.auth;
        if (!page1.id || !auth) return {};
        const resp = await getPrepared0704(page1.id, auth);
        if (!resp?.data) return {};
        return {
            documentGroup: resp.data.documentGroup,
            fields: resp.data.fields
        };
    },

    "oil-income-n-expense-1": async (page1, options) => {
        const auth = options?.auth;
        if (!page1.id || !auth) return {};
        const resp = await getPreparedReceitpPaymentNew(page1.id, auth);
        if (!resp?.data) return {};
        return {
            documentGroup: resp.data.documentGroup,
            fields: resp.data.fields
        };
    },
    "oil-shore-tank-1": async (page1) => {
        const company = useCompanyStore.getState().selectedCompany?.name ?? "";
        const factories = localStorage.getItem("warehouse") ?? "";
        return {
            company,
            factories,
            documentGroup: page1.documentGroup ?? "",
        };
    },
    "oil-outturn-report-2": async (page1) => {
        const company = useCompanyStore.getState().selectedCompany?.name ?? "";
        const factories = localStorage.getItem("warehouse") ?? "";
        return {
            company,
            factories,
            documentGroup: page1.documentGroup ?? "",
        };
    },
    "oil-compare-1": async (page1) => {
        const company = useCompanyStore.getState().selectedCompany?.name ?? "";
        const factories = localStorage.getItem("warehouse") ?? "";

        return {
            company,
            factories,
            documentGroup: page1.documentGroup ?? "",
        };
    },
    "oil-formular-4": async (page1, options) => {
        const auth = options?.auth;
        if (!page1.id || !auth) return {};
        const resp = await getPreparedFormularApprov(page1.id, auth);
        if (!resp?.data) return {};
        return {
            documentGroup: resp.data.documentGroup,
            fields: resp.data.fields,
            ocrData: resp.data
        };
    },
    "oil-formular-5": async (page1, options) => {
        const auth = options?.auth;
        if (!page1.id || !auth) return {};
        const resp = await getPreparedFormularApprov(page1.id, auth);
        if (!resp?.data) return {};
        return {
            documentGroup: resp.data.documentGroup,
            fields: resp.data.fields,
            ocrData: resp.data
        };
    },
    "oil-05-03-page-1": async (page1, options) => {
        const auth = options?.auth;
        if (!page1.id || !auth) return {};
        const resp = await getPrepared0503(page1.id, auth);
        if (!resp?.data) return {};
        return {
            documentGroup: resp.data.documentGroup,
            docType: resp.data.docType,
            fields: resp.data.fields
        };
    },
    "oil-05-03-page-2": async (page1, options) => {
        const auth = options?.auth;
        if (!page1.id || !auth) return {};
        const resp = await getPrepared0503(page1.id, auth);
        if (!resp?.data) return {};
        return {
            documentGroup: resp.data.documentGroup,
            docType: resp.data.docType,
            fields: resp.data.fields
        };
    },
    "oil-05-03-page-3": async (page1, options) => {
        const auth = options?.auth;
        if (!page1.id || !auth) return {};
        const resp = await getPrepared0503(page1.id, auth);
        if (!resp?.data) return {};
        return {
            documentGroup: resp.data.documentGroup,
            docType: resp.data.docType,
            fields: resp.data.fields
        };
    },
    "oil-05-03-page-4": async (page1, options) => {
        const auth = options?.auth;
        if (!page1.id || !auth) return {};
        const resp = await getPrepared0503(page1.id, auth);
        if (!resp?.data) return {};
        return {
            documentGroup: resp.data.documentGroup,
            docType: resp.data.docType,
            fields: resp.data.fields
        };
    },
    "oil-05-02-page-4": async (page1, options) => {
        const auth = options?.auth;
        if (!page1.id || !auth) return {};
        const resp = await getPrepared0502(page1.id, auth);
        if (!resp?.data) return {};
        return {
            documentGroup: resp.data.documentGroup,
            docType: resp.data.docType,
            fields: resp.data.fields
        };
    },
    "oil-tax-invoice-or-1": async (page1, options) => {
        const auth = options?.auth;
        if (!page1.id || !auth) return {};
        const resp = await getPreparedInvoiceTax(page1.id, auth);
        if (!resp?.data) return {};
        return {
            documentGroup: resp.data.documentGroup,
            docType: resp.data.docType,
            fields: resp.data.fields
        };
    },
    "oil-tax-invoice-irpc-1": async (page1, options) => {
        const auth = options?.auth;
        if (!page1.id || !auth) return {};
        const resp = await getPreparedInvoiceTax(page1.id, auth);
        if (!resp?.data) return {};
        return {
            documentGroup: resp.data.documentGroup,
            docType: resp.data.docType,
            fields: resp.data.fields
        };
    },
    "oil-receipt-1": async (page1, options) => {
        const auth = options?.auth;
        if (!page1.id || !auth) return {};
        const resp = await getPreparedReceiptExcise(page1.id, auth);
        if (!resp?.data) return {};
        return {
            documentGroup: resp.data.documentGroup,
            docType: resp.data.docType,
            fields: resp.data.fields
        };
    },
    "oil-pipline-delivery-customer": async (page1, options) => {
        const auth = options?.auth;
        if (!page1.id || !auth) return {};
        const resp = await getPreparedInvoiceThappline(page1.id, auth);
        if (!resp?.data) return {};
        return {
            documentGroup: resp.data.documentGroup,
            docType: resp.data.docType,
            fields: resp.data.fields
        };
    },
    "oil-03-07-page-1": async (page1, options) => {
        const auth = options?.auth;        
        if (!page1.id || !auth) return {};
        const resp = await getPrepared0307(page1.id, auth);        
        if (!resp?.data) return {};
        return {
            documentGroup: resp.data.documentGroup,
            docType: resp.data.docType,
            fields: resp.data.fields
        };
    },
    "oil-01-29-page-1-1": async (page1, options) => {
        const auth = options?.auth;        
        if (!page1.id || !auth) return {};
        const resp = await getPrepared0129(page1.id, auth);        
        if (!resp?.data) return {};
        return {
            documentGroup: resp.data.documentGroup,
            docType: resp.data.docType,
            fields: resp.data.fields
        };
    },
    "default": async (_page1) => ({}),
};
