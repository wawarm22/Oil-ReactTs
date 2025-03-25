import axios from 'axios';
import { BASE_URL } from './apiConfig';

export const apiProvince = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/provinces`, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        return response.data;

    } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : error);
        throw error;
    }
};

export const apiDistrict = async (provinceId: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/ampur?provinceId=${provinceId}`, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        return response.data;

    } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : error);
        throw error;
    }
};

export const apiSubDistrict = async (amphureId: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/tambon?amphureId=${amphureId}`, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        return response.data;

    } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : error);
        throw error;
    }
};
