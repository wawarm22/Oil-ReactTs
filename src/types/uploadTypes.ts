export type GenerateUploadUrlPayload = {
    fileName: string;
    targetPath: string;
}

export type GenerateUploadUrlResponse = {
    uploadUrl: string;
    blobPath: string;
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

export type ComfirmUploadResponse = {
    message: string;
    files: string[];
}