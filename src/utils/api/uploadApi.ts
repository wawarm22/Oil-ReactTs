import axios from "axios";
import { BASE_URL } from "./apiConfig";
import { GenerateUploadUrlPayload, GenerateUploadUrlResponse } from "../../types/uploadTypes";

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
        console.log("response",response);
        
        return response.data;
    } catch (error) {
        console.error("Error generating upload URL:", error instanceof Error ? error.message : error);
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

