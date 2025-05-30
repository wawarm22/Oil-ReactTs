import { useCompanyStore } from "../store/companyStore";
import { checkProdustType } from "./api/apiCheckData";
import { getPrepared0307, getPreparedFormularApprov, getPreparedReceitpPayment } from "./api/validateApi";
import { genRequestObject } from "./function/checklist/attachment0704";
import { findBestMatch } from "./function/fuzzySearch";

export type ContextOptions = { auth?: any };

export const getContextForDocType: Record<
    string,
    (page1: any, options?: ContextOptions) => Promise<any>
> = {
    "oil-07-01-page-1": async (page1) => {
        const companyName = useCompanyStore.getState().selectedCompany?.name ?? "";
        const factoriesName = localStorage.getItem("nameWarehouse") ?? "";
        const factories = localStorage.getItem("warehouse") ?? "";
        let materialID = "";

        if (page1.oil_type && companyName && factoriesName) {
            const resp = await checkProdustType(page1.oil_type);
            const resultItems = resp?.ResultItems ?? [];
            materialID = findBestMatch(resultItems, companyName, factoriesName);
        }

        return {
            materialID,
            company: companyName,
            factories,
            fields: page1.detail_table,
            documentGroup: page1.documentGroup ?? "",
        };
    },
    "oil-formular-2": async (page1, options) => {
        const auth = options?.auth;
        if (!page1.id || !auth) return {};
        const res = await getPrepared0307(page1.id, auth);
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
    "oil-07-04-page-1": async (page1) => {
        const company = useCompanyStore.getState().selectedCompany?.name ?? "";
        const factories = localStorage.getItem("warehouse") ?? "";
        const documentGroup = page1.documentGroup ?? "";

        // genFields = await genRequestObject({ fields: page1 })
        const genFields = await genRequestObject({ fields: page1 });
        return {
            company,
            factories,
            documentGroup,
            genFields,
        };
    },
    "oil-income-n-expense-1": async (page1, options) => {
        const auth = options?.auth;
        if (!page1.id || !auth) return {};
        const resp = await getPreparedReceitpPayment(page1.id, auth);
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
    "oil-formular-5": async (page1, options) => {
        const auth = options?.auth;
        if (!page1.id || !auth) return {};
        const resp = await getPreparedFormularApprov(page1.id, auth);
        if (!resp?.data) return {};
        return {
            documentGroup: resp.data.documentGroup,
            fields: resp.data.fields
        };
    },
    "default": async (_page1) => ({}),
};
