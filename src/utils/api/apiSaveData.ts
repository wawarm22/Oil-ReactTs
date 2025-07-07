import axios from "axios";
import { BASE_URL_AWS } from "./apiConfig";
import { Save0307, Save0503Page1, Save0701, Save0702, SaveData0704, SaveReceitpPayment } from "../../types/validateTypes";
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

export const saveData0702 = async (saveData: Save0702, auth: AuthSchema) => {
    try {
        const response = await axios.post(`${BASE_URL_AWS}/data/ocr/07-02`, saveData, {
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

export const saveData0503Page1 = async (saveData: Save0503Page1, auth: AuthSchema) => {
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

export const saveData0307 = async (saveData: Save0307, auth: AuthSchema) => {
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

export const saveDataReceitpPayment = async (saveData: SaveReceitpPayment, auth: AuthSchema) => {
    try {
        const response = await axios.post(`${BASE_URL_AWS}/data/ocr/rp`, saveData, {
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

export const saveData0704 = async (saveData: SaveData0704, auth: AuthSchema) => {
    try {
        const response = await axios.post(`${BASE_URL_AWS}/data/ocr/07-04`, saveData, {
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