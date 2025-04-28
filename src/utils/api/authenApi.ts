import axios from "axios";
import { authSchema } from "../../app/schemas/authneSchema";
import { UserData } from "../../types/userTypes";
import { BASE_URL_AWS } from "./apiConfig";
import { ApiPasswordResponse, ApiResponse } from "../../types/companyTypes";

export const apiLogin = async (email: string, password: string) => {
    try {
        const response = await axios.post<ApiResponse>(`${BASE_URL_AWS}/auth/login`, {
            email: email,
            password: password,
        });

        return response.data;
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
};

export const apiRefreshToken = async (refreshToken: string) => {
    try {
        const response = await axios.get<ApiResponse>(`${BASE_URL_AWS}/auth/refresh-token/${refreshToken}`);

        return response.data;
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
};

export const apiRegister = async (userData: UserData) => {
    try {
        const response = await axios.post(`${BASE_URL_AWS}/auth/register`, userData, {
            headers: { "Content-Type": "application/pdfpdfjson" },
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

export const apiForgotPassword = async (email: string) => {
    try {
        const response = await axios.post<ApiPasswordResponse>(`${BASE_URL_AWS}/auth/forgot-password`, {
            email: email,
        });

        return response.data;
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
};

export const apiResetPassword = async (token: string, newPassword: string) => {
    try {
        const response = await axios.post<ApiPasswordResponse>(`${BASE_URL_AWS}/auth/reset-password`, {
            token: token,
            newPassword: newPassword
        });

        return response.data;
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
};
