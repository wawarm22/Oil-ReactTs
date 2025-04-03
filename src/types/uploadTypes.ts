export type GenerateUploadUrlPayload = {
    fileName: string;
    documentGroup: string;
}

export type GenerateUploadUrlResponse = {
    uploadUrl: string;
    fileName: string;
    documentGroup: string;
}

export type DeleteUploadResponse = {
    success: boolean;
    deletedCount: number;
    deleted: string[];
}

export type PdfFileItem ={
    fileName: string;
    previewUrl: string;
}

export type PdfListResponse = {
    count: number;
    files: PdfFileItem[];
}