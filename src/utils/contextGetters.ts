import { useCompanyStore } from "../store/companyStore";
import { checkProdustType } from "./api/apiCheckData";
import { findBestMatch } from "./function/fuzzySearch";

export const getContextForDocType: Record<string, (page1: any) => Promise<any>> = {
    "oil-07-01-page-1": async (page1) => {
        // ดึงค่า context ที่จำเป็น
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
    "some-other-docType": async (_page1) => {
        const company = useCompanyStore.getState().selectedCompany?.name ?? "";
        const factoriesName = localStorage.getItem("nameWarehouse") ?? "";
        return { company, factoriesName };
    },
    "default": async (_page1) => ({}),
};
