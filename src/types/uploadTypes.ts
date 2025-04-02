export type GenerateUploadUrlPayload = {
    fileName: string;
    documentGroup: string;
}

export type GenerateUploadUrlResponse = {
    uploadUrl: string;
    fileName: string;
    documentGroup: string;
}