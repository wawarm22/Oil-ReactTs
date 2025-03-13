import axios from "axios";

const API_URL = "https://oil-revenue.azurewebsites.net/api/login";

export const apiLogin = async (username: string, password: string) => {
    try {
        const response = await axios.post(API_URL, {
            username: username,
            password: password,
        });

        return response.data;
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
};
