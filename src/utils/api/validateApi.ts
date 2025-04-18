import axios from "axios";
import { BASE_URL_AWS } from "./apiConfig";
import { OCRValidationPayload } from "../../types/validateTypes";

export const apiValidate = async (validateData: OCRValidationPayload) => {
    try {
        const response = await axios.post(`${BASE_URL_AWS}/ocr/ocr-validate`, validateData, {
            headers: { "Content-Type": "application/json" },
        });            

        return response.data;
    } catch (error) {
        console.error("An error occurred during the registration process", error);
        return undefined;
    }
};