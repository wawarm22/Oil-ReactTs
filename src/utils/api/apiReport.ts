import axios from "axios";
import { BASE_URL_AWS } from "./apiConfig";
import { ProductFormulaResponse, RawMaterialPaymentsResponse } from "../../types/reportTypes";
import { AuthSchema } from "../../types/schema/auth";

export const getProductRatiosAndFormular = async (
    params: {
        factory_slug: string,
        company_id: number,
        month: number,
        year: number,
    },
    auth: AuthSchema
): Promise<ProductFormulaResponse | undefined> => {
    try {
        const response = await axios.get(
            `${BASE_URL_AWS}/report/product-ratios-and-formular`,
            {
                params,
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("An error occurred while fetching OCR prepared data", error);
        return undefined;
    }
};

export const getRawMaterialPayments = async (
    params: {
        factory_slug: string,
        company_id: number,
        month: number,
        year: number,
    },
    auth: AuthSchema
): Promise<RawMaterialPaymentsResponse | undefined> => {
    try {
        const response = await axios.get(`${BASE_URL_AWS}/report/raw-material-payments`,
            {
                params,
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("An error occurred while fetching OCR prepared data", error);
        return undefined;
    }
};

export const getOilUseInProducts = async (
    params: {
        factory_slug: string,
        company_id: number,
        month: number,
        year: number,
        material_id: number
    },
    auth: AuthSchema
): Promise<RawMaterialPaymentsResponse | undefined> => {
    try {
        const response = await axios.get(`${BASE_URL_AWS}/report/oil-use-in-products`,
            {
                params,
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("An error occurred while fetching OCR prepared data", error);
        return undefined;
    }
};