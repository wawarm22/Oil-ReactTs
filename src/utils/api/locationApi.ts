import axios from 'axios';

export const apiProvince = async () => {
    try {
        const response = await axios.get("https://oil-revenue.azurewebsites.net/api/provinces", {
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
        const response = await axios.get(`https://oil-revenue.azurewebsites.net/api/ampur?provinceId=${provinceId}`, {
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
        const response = await axios.get(`https://oil-revenue.azurewebsites.net/api/tambon?amphureId=${amphureId}`, {
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
