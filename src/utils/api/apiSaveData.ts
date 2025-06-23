import axios from "axios";
import { BASE_URL_AWS } from "./apiConfig";
import { Save0701 } from "../../types/validateTypes";

export const saveData0701 = async (saveData: Save0701) => {
    try {
        const response = await axios.post(`${BASE_URL_AWS}/data/ocr/07-01`, saveData, {
            headers: { "Content-Type": "application/json" },
        });

        return response.data;
    } catch (error) {
        console.error("An error occurred during the registration process", error);
        return undefined;
    }
};