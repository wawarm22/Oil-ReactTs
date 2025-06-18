import axios from "axios";
import { BASE_URL_AWS } from "./apiConfig";
import { ProductFormulaResponse } from "../../types/reportTypes";

export const getProductRatiosAndFormular = async (): Promise<ProductFormulaResponse  | undefined> => {
    try {
        const response = await axios.get(`${BASE_URL_AWS}/report/product-ratios-and-formular`);
        return response.data;
    } catch (error) {
        console.error("An error occurred while fetching OCR prepared data", error);
        return undefined;
    }
};

export const getRawMaterialPayments = async (): Promise<any | undefined> => {
    try {
        const response = await axios.get(`${BASE_URL_AWS}/report/raw-material-payments`);
        return response.data;
    } catch (error) {
        console.error("An error occurred while fetching OCR prepared data", error);
        return undefined;
    }
};