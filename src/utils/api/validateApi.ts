import axios from "axios";
import { BASE_URL_AWS } from "./apiConfig";
import { OCRValidationPayload, Validate0503Page1Payload, Validate0503Page2Payload, ValidateOil0307Payload, ValidateOil0704Payload, ValidateSubmissionPayload, ValidationCompare } from "../../types/validateTypes";
import { AuthSchema } from "../../types/schema/auth";

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

export const validate0503Page1 = async (validateData: Validate0503Page1Payload) => {
    try {
        const response = await axios.post(`${BASE_URL_AWS}/ocr/ocr-validate/05-03`, validateData, {
            headers: { "Content-Type": "application/json" },
        });            

        return response.data;
    } catch (error) {
        console.error("An error occurred during the registration process", error);
        return undefined;
    }
};

export const validate0503Page2 = async (validateData: Validate0503Page2Payload) => {
    try {
        const response = await axios.post(`${BASE_URL_AWS}/ocr/ocr-validate/05-03`, validateData, {
            headers: { "Content-Type": "application/json" },
        });            

        return response.data;
    } catch (error) {
        console.error("An error occurred during the registration process", error);
        return undefined;
    }
};

export const getPrepared0503 = async (id: string, auth: AuthSchema): Promise<any | undefined> => {
  try {
    const response = await axios.get(`${BASE_URL_AWS}/ocr/ocr-prepared/05-03/${id}`, {
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("An error occurred while fetching OCR prepared data", error);
    return undefined;
  }
};

export const getPrepared0307 = async (documentId: string, auth: AuthSchema): Promise<any | undefined> => {
  try {
    const response = await axios.get(`${BASE_URL_AWS}/ocr/ocr-prepared/03-07-attachment/${documentId}`, {
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("An error occurred while fetching OCR prepared data", error);
    return undefined;
  }
};

