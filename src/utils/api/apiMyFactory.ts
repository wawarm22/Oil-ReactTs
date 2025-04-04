import axios from "axios";
import { ApiResponse } from "../../types/companyTypes";
import { BASE_URL_AWS } from "./apiConfig";
import { AuthSchema } from "../../types/schema/auth";

const apiMyFactory = async (auth: AuthSchema) => {
    try {
        const response = await axios.get<ApiResponse>(`${BASE_URL_AWS}/my/factory`, {
            headers: {
                Authorization: `Bearer ${auth.accessToken}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
};

export default apiMyFactory;