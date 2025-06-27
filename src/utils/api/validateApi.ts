import axios from "axios";
import { BASE_URL_AWS } from "./apiConfig";
import { InvoiceThappline, OcrInvoiceTaxData, OcrReceiptExciseData, OcrTaxInvoiceData, OCRValidationPayload, PrepaedTaxForm0129Document, Prepared0307Payload, Prepared0701, Validate0503Page1Payload, Validate0503Page2Payload, validateAttachment0307Payload, ValidateOil0702Data, validateReceitpPaymentPayload, ValidateSubmissionPayload, ValidationCompare } from "../../types/validateTypes";
import { AuthSchema } from "../../types/schema/auth";
import { OcrReceiptPaymentPreparedData, Prepared0502, Prepared0704, PreparedFormularApprovResponse } from "../../types/preparedTypes";

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

export const validateOil0702 = async (validateData: ValidateOil0702Data) => {
    try {
        const response = await axios.post(`${BASE_URL_AWS}/ocr/ocr-validate/07-02`, validateData, {
            headers: { "Content-Type": "application/json" },
        });

        return response.data;
    } catch (error) {
        console.error("An error occurred during the registration process", error);
        return undefined;
    }
};

// export const validateOil0704 = async (validateData: ValidateOil0704Payload) => {
//     try {
//         const response = await axios.post(`${BASE_URL_AWS}/ocr/ocr-validate/07-04`, validateData, {
//             headers: { "Content-Type": "application/json" },
//         });

//         return response.data;
//     } catch (error) {
//         console.error("An error occurred during the registration process", error);
//         return undefined;
//     }
// };

export const validateOil0704 = async (validateData: Prepared0704) => {
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

export const validateOil0307 = async (validateData: Prepared0307Payload) => {
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

export const validateAttachment0307 = async (validateData: validateAttachment0307Payload) => {
    try {
        const response = await axios.post(`${BASE_URL_AWS}/ocr/ocr-validate/03-07-attachment`, validateData, {
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

export const validateOutturn = async (validateData: any) => {
    try {
        const response = await axios.post(`${BASE_URL_AWS}/ocr/ocr-validate/outturn`, validateData, {
            headers: { "Content-Type": "application/json" },
        });

        return response.data;
    } catch (error) {
        console.error("An error occurred during the registration process", error);
        return undefined;
    }
};

export const validateReceitpPayment = async (validateData: validateReceitpPaymentPayload) => {
    try {
        const response = await axios.post(`${BASE_URL_AWS}/ocr/ocr-validate/receitp-payment`, validateData, {
            headers: { "Content-Type": "application/json" },
        });

        return response.data;
    } catch (error) {
        console.error("An error occurred during the registration process", error);
        return undefined;
    }
};

export const validateReceitpPaymentNew = async (validateData: OcrReceiptPaymentPreparedData) => {
    try {
        const response = await axios.post(`${BASE_URL_AWS}/ocr/ocr-validate/receitp-payment-new`, validateData, {
            headers: { "Content-Type": "application/json" },
        });

        return response.data;
    } catch (error) {
        console.error("An error occurred during the registration process", error);
        return undefined;
    }
};

export const validateFormularApprov = async (validateData: PreparedFormularApprovResponse) => {
    try {
        const response = await axios.post(`${BASE_URL_AWS}/ocr/ocr-validate/formular-approv`, validateData, {
            headers: { "Content-Type": "application/json" },
        });

        return response.data;
    } catch (error) {
        console.error("An error occurred during the registration process", error);
        return undefined;
    }
};

export const validateForm0502 = async (validateData: Prepared0502) => {
    try {
        const response = await axios.post(`${BASE_URL_AWS}/ocr/ocr-validate/05-02`, validateData, {
            headers: { "Content-Type": "application/json" },
        });

        return response.data;
    } catch (error) {
        console.error("An error occurred during the registration process", error);
        return undefined;
    }
};

export const validateReceiptExcise = async (validateData: OcrReceiptExciseData) => {
    try {
        const response = await axios.post(`${BASE_URL_AWS}/ocr/ocr-validate/receipt-excise`, validateData, {
            headers: { "Content-Type": "application/json" },
        });

        return response.data;
    } catch (error) {
        console.error("An error occurred during the registration process", error);
        return undefined;
    }
};

export const validateTaxInvoice = async (validateData: OcrTaxInvoiceData) => {
    try {
        const response = await axios.post(`${BASE_URL_AWS}/ocr/ocr-validate/tax-invoice`, validateData, {
            headers: { "Content-Type": "application/json" },
        });

        return response.data;
    } catch (error) {
        console.error("An error occurred during the registration process", error);
        return undefined;
    }
};

export const validateInvoiceTax = async (validateData: OcrInvoiceTaxData) => {
    try {
        const response = await axios.post(`${BASE_URL_AWS}/ocr/ocr-validate/invoice-tax`, validateData, {
            headers: { "Content-Type": "application/json" },
        });

        return response.data;
    } catch (error) {
        console.error("An error occurred during the registration process", error);
        return undefined;
    }
};

export const validateInvoiceThappline = async (validateData: InvoiceThappline) => {
    try {
        const response = await axios.post(`${BASE_URL_AWS}/ocr/ocr-validate/invoice-thappline`, validateData, {
            headers: { "Content-Type": "application/json" },
        });

        return response.data;
    } catch (error) {
        console.error("An error occurred during the registration process", error);
        return undefined;
    }
};

export const validate0701New = async (validateData: Prepared0701) => {
    try {
        const response = await axios.post(`${BASE_URL_AWS}/ocr/ocr-validate/07-01-new`, validateData, {
            headers: { "Content-Type": "application/json" },
        });

        return response.data;
    } catch (error) {
        console.error("An error occurred during the registration process", error);
        return undefined;
    }
};

export const validateForm0129 = async (validateData: PrepaedTaxForm0129Document) => {
    try {
        const response = await axios.post(`${BASE_URL_AWS}/ocr/ocr-validate/01-29`, validateData, {
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

export const getPrepared0307Attachment = async (documentId: string, auth: AuthSchema): Promise<any | undefined> => {
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

export const getPreparedReceitpPayment = async (docId: string, auth: AuthSchema): Promise<any | undefined> => {
    try {
        const response = await axios.get(`${BASE_URL_AWS}/ocr/ocr-prepared/receitp-payment/${docId}`, {
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

export const getPreparedReceitpPaymentNew = async (docId: string, auth: AuthSchema): Promise<any | undefined> => {
    try {
        const response = await axios.get(`${BASE_URL_AWS}/ocr/ocr-prepared/receitp-payment-new/${docId}`, {
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

export const getPreparedFormularApprov = async (docId: string, auth: AuthSchema): Promise<any | undefined> => {
    try {
        const response = await axios.get(`${BASE_URL_AWS}/ocr/ocr-prepared/formular-approv/${docId}`, {
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

export const getPreparedTaxInvoice = async (docId: string, auth: AuthSchema): Promise<any | undefined> => {
    try {
        const response = await axios.get(`${BASE_URL_AWS}/ocr/ocr-prepared/taxinvoice/${docId}`, {
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

export const getPrepared0502 = async (docId: string, auth: AuthSchema): Promise<any | undefined> => {
    try {
        const response = await axios.get(`${BASE_URL_AWS}/ocr/ocr-prepared/05-02/${docId}`, {
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

export const getPreparedReceiptExcise = async (docId: string, auth: AuthSchema): Promise<any | undefined> => {
    try {
        const response = await axios.get(`${BASE_URL_AWS}/ocr/ocr-prepared/receipt-excise/${docId}`, {
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

export const getPreparedInvoiceTax = async (docId: string, auth: AuthSchema): Promise<any | undefined> => {
    try {
        const response = await axios.get(`${BASE_URL_AWS}/ocr/ocr-prepared/invoice-tax/${docId}`, {
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

export const getPreparedInvoiceThappline = async (docId: string, auth: AuthSchema): Promise<any | undefined> => {
    try {
        const response = await axios.get(`${BASE_URL_AWS}/ocr/ocr-prepared/invoice-thappline/${docId}`, {
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

export const getPrepared0701 = async (docId: string, auth: AuthSchema): Promise<any | undefined> => {
    try {
        const response = await axios.get(`${BASE_URL_AWS}/ocr/ocr-prepared/07-01/${docId}`, {
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

export const getPrepared0704 = async (docId: string, auth: AuthSchema): Promise<any | undefined> => {
    try {
        const response = await axios.get(`${BASE_URL_AWS}/ocr/ocr-prepared/07-04/${docId}`, {
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

export const getPrepared0307 = async (docId: string, auth: AuthSchema): Promise<any | undefined> => {
    try {
        const response = await axios.get(`${BASE_URL_AWS}/ocr/ocr-prepared/03-07/${docId}`, {
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

export const getPrepared0702 = async (docId: string, auth: AuthSchema): Promise<any | undefined> => {
    try {
        const response = await axios.get(`${BASE_URL_AWS}/ocr/ocr-prepared/07-02/${docId}`, {
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

export const getPrepared0129 = async (docId: string, auth: AuthSchema): Promise<any | undefined> => {
    try {
        const response = await axios.get(`${BASE_URL_AWS}/ocr/ocr-prepared/01-29/${docId}`, {
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
