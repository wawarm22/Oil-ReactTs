export type GenerateUploadUrlPayload = {
    fileNames: string[];
    targetPath: string;
};

export type SingleUploadMeta = {
    fileName: string;
    uploadUrl: string;
    blobPath: string;
};

export type GenerateUploadUrlResponse = {
    count: number;
    uploads: SingleUploadMeta[];
};

export type DeleteUploadResponse = {
    success: boolean;
    deletedCount: number;
    deleted: string[];
}

export type PdfFileItem = {
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