import axios from "axios";
import { BASE_URL_AWS } from "./apiConfig";
import { Prepared0307Payload, Save0701, Validate0503Page1Payload } from "../../types/validateTypes";
import { AuthSchema } from "../../types/schema/auth";

export const saveData0701 = async (saveData: Save0701, auth: AuthSchema) => {
    try {
        const response = await axios.post(`${BASE_URL_AWS}/data/ocr/07-01`, saveData, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.accessToken}`
            },
        });

        return response.data;
    } catch (error) {
        console.error("An error occurred during the registration process", error);
        return undefined;
    }
};

export const saveData0503Page1 = async (saveData: Validate0503Page1Payload, auth: AuthSchema) => {
    try {
        const response = await axios.post(`${BASE_URL_AWS}/data/ocr/05-03`, saveData, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.accessToken}`
            },
        });

        return response.data;
    } catch (error) {
        console.error("An error occurred during the registration process", error);
        return undefined;
    }
};

export const saveData0307 = async (saveData: Prepared0307Payload, auth: AuthSchema) => {
    try {
        const response = await axios.post(`${BASE_URL_AWS}/data/ocr/03-07`, saveData, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.accessToken}`
            },
        });

        return response.data;
    } catch (error) {
        console.error("An error occurred during the registration process", error);
        return undefined;
    }
};