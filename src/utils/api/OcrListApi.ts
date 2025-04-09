import axios from "axios";
import { BASE_URL } from "./apiConfig";

export const apiGetAllOcr = async (documentGroup: string, limit: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/documents`, {
            params: { limit, documentGroup },
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching PDF list:", error instanceof Error ? error.message : error);
        throw error;
    }
};