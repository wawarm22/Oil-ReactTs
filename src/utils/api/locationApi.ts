import axios from 'axios';

export const apiProvince = async () => {
    try {
        const response = await axios.get("https://asia-southeast1-tbit-excise.cloudfunctions.net/apiv4-FtLocations/Province", {
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

export const apiDistrict = async (pvCode: string) => {
    try {
        const response = await axios.get(`https://asia-southeast1-tbit-excise.cloudfunctions.net/apiv4-FtLocations/District?PvCode=${pvCode}`, {
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

export const apiSubDistrict = async (pvCode: string, distCode: string) => {
    try {
        const response = await axios.get(`https://asia-southeast1-tbit-excise.cloudfunctions.net/apiv4-FtLocations/SubDistrict?PvCode=${pvCode}&DistCode=${distCode}`, {
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
