import axios from "axios";
import { authSchema } from "../../app/schemas/authneSchema";
import { UserData } from "../../types/userTypes";
import { BASE_URL } from "./apiConfig";

export const apiLogin = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/login`, {
            email: email,
            password: password,
        });

        return response.data;
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
};

export const apiRegister = async (userData: UserData) => {
    try {
        const response = await axios.post(`${BASE_URL}/register`, userData, {
            headers: { "Content-Type": "application/json" },
        });

        if (response.status !== 200) {
            console.error(`Failed to register user: ${response.statusText}`);
            return undefined;
        }

        const safe = authSchema.safeParse(response.data);
        if (!safe.success) {
            console.error("Failed to validate API response against authSchema", safe.error);
            return undefined;
        }

        return safe.data;
    } catch (error) {
        console.error("An error occurred during the registration process", error);
        return undefined;
    }
};
