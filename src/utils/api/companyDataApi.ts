import axios from 'axios';
import { BASE_URL_AWS } from './apiConfig';
import { ApiResponse, Company, CompanyById } from '../../types/companyTypes';

export const apiCompanyAll = async (): Promise<ApiResponse<Company[]>> => {
    try {
        const response = await axios.get<ApiResponse<Company[]>>(`${BASE_URL_AWS}/master/company`);
        return response.data;
    } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : error);
        throw error;
    }
};

export const apiCompanyById = async (id: number): Promise<CompanyById> => {
    try {
        const response = await axios.get<ApiResponse<CompanyById>>(`${BASE_URL_AWS}/master/company/${id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching company by ID:', error instanceof Error ? error.message : error);
        throw error;
    }
};
