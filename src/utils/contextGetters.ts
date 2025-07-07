import { useCompanyStore } from "../store/companyStore";
import { getPrepared0129, getPrepared0307, getPrepared0307Attachment, getPrepared0502, getPrepared0503, getPrepared0701, getPrepared0702, getPrepared0704, getPreparedFormularApprov, getPreparedInvoiceTax, getPreparedInvoiceThappline, getPreparedReceiptExcise, getPreparedReceitpPaymentNew, getPreparedTaxInvoice } from "./api/validateApi";

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
    "oil-07-02-page-1": async (page1, options) => {
        const auth = options?.auth;
        if (!page1.id || !auth) return {};
        const resp = await getPrepared0702(page1.id, auth);
        if (!resp?.data) return {};
        return {
            documentGroup: resp.data.documentGroup,
            docType: resp.data.docType,
            fields: resp.data.fields,
            transport: resp.data.transport,
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
            docType: resp.data.docType,
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
            docType: resp.data.docType,
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
