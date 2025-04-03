import axios from "axios";
import { BASE_URL } from "./apiConfig";
import { DeleteUploadResponse, GenerateUploadUrlPayload, GenerateUploadUrlResponse, PdfListResponse } from "../../types/uploadTypes";

export const generateUploadUrl = async (
    payload: GenerateUploadUrlPayload
): Promise<GenerateUploadUrlResponse> => {
    try {
        const response = await axios.post<GenerateUploadUrlResponse>(
            `${BASE_URL}/generate-upload-url`, payload, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log("response", response);

        return response.data;
    } catch (error) {
        console.error("Error generating upload URL:", error instanceof Error ? error.message : error);
        throw error;
    }
};

export const apiDeleteBlob = async (prefix: string): Promise<DeleteUploadResponse> => {
    try {
        const response = await axios.post(
            `${BASE_URL}/delete-blobs`,
            { prefix }, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error deleting blob:", error instanceof Error ? error.message : error);
        throw error;
    }
};

export const apiPreviewPdf = async (path: string): Promise<string> => {
    try {
        const response = await axios.get(`${BASE_URL}/preview-url`, {
            params: { path },
        });

        if (response.data?.previewUrl) {
            return response.data.previewUrl;
        } else {
            throw new Error("ไม่พบ previewUrl ใน response");
        }
    } catch (error) {
        console.error("Error fetching preview URL:", error instanceof Error ? error.message : error);
        throw error;
    }
};

export const apiListPdfFiles = async (prefix: string): Promise<PdfListResponse> => {
    try {
        const response = await axios.get(`${BASE_URL}/list-files`, {
            params: { prefix },
        });

        return response.data as PdfListResponse;
    } catch (error) {
        console.error("Error fetching PDF list:", error instanceof Error ? error.message : error);
        throw error;
    }
};

export const apiUpload = async (
    file: File,
    url: string,
    documentGroup: string
): Promise<boolean> => {
    try {
        const response = await axios.put(url, file, {
            headers: {
                "x-ms-blob-type": "BlockBlob",
                "x-ms-meta-documentgroup": documentGroup,
                "Content-Type": "application/pdf",
            },
        });

        return response.status === 201 || response.status === 200;
    } catch (error) {
        console.error("Upload Error:", error instanceof Error ? error.message : error);
        return false;
    }
};

