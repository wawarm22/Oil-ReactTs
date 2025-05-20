import axios from "axios";
import { BASE_URL_AWS } from "./apiConfig";
import { OCRValidationPayload, ValidateOil0307Payload, ValidateOil0704Payload, ValidateSubmissionPayload, ValidationCompare } from "../../types/validateTypes";

export const validateOilCompare = async (validateData: ValidationCompare) => {
    try {
        const response = await axios.post(`${BASE_URL_AWS}/ocr/ocr-validate/oil-compare-1`, validateData, {
            headers: { "Content-Type": "application/json" },
        });            

        return response.data;
    } catch (error) {
        console.error("An error occurred during the registration process", error);
        return undefined;
    }
};

export const validateOil0701 = async (validateData: OCRValidationPayload) => {
    try {
        const response = await axios.post(`${BASE_URL_AWS}/ocr/ocr-validate/07-01`, validateData, {
            headers: { "Content-Type": "application/json" },
        });            

        return response.data;
    } catch (error) {
        console.error("An error occurred during the registration process", error);
        return undefined;
    }
};

export const validateOil0704 = async (validateData: ValidateOil0704Payload) => {
    try {
        const response = await axios.post(`${BASE_URL_AWS}/ocr/ocr-validate/07-04`, validateData, {
            headers: { "Content-Type": "application/json" },
        });            

        return response.data;
    } catch (error) {
        console.error("An error occurred during the registration process", error);
        return undefined;
    }
};

export const validateOil0307 = async (validateData: ValidateOil0307Payload) => {
    try {
        const response = await axios.post(`${BASE_URL_AWS}/ocr/ocr-validate/03-07`, validateData, {
            headers: { "Content-Type": "application/json" },
        });            

        return response.data;
    } catch (error) {
        console.error("An error occurred during the registration process", error);
        return undefined;
    }
};

export const validateSubmission = async (validateData: ValidateSubmissionPayload) => {
    try {
        const response = await axios.post(`${BASE_URL_AWS}/ocr/ocr-validate/submission`, validateData, {
            headers: { "Content-Type": "application/json" },
        });            

        return response.data;
    } catch (error) {
        console.error("An error occurred during the registration process", error);
        return undefined;
    }
};

export const validate0704 = async (validateData: any) => {
    try {
        const response = await axios.post(`${BASE_URL_AWS}/ocr/ocr-validate/07-04`, validateData, {
            headers: { "Content-Type": "application/json" },
        });            

        return response.data;
    } catch (error) {
        console.error("An error occurred during the registration process", error);
        return undefined;
    }
};