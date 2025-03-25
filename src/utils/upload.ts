import { BlobServiceClient } from "@azure/storage-blob";

const accountName = import.meta.env.VITE_AZURE_STORAGE_ACCOUNT!;
const containerName = import.meta.env.VITE_AZURE_STORAGE_CONTAINER!;
const sasToken = import.meta.env.VITE_AZURE_STORAGE_SAS!;

if (!accountName || !containerName || !sasToken) {
    console.error("Missing Azure Storage configuration. Check your .env file.");
}

export const uploadFile = async (file: File): Promise<string | null> => {
    if (!file) {
        alert("กรุณาเลือกไฟล์ก่อน!");
        return null;
    }
    
    try {
        const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net?${sasToken}`);
        const containerClient = blobServiceClient.getContainerClient(containerName);

        const blobName = `${new Date().getTime()}-${file.name}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        await blockBlobClient.uploadData(file, {
            blobHTTPHeaders: {
                blobContentType: file.type || "application/pdf"
            }
        });
        const fileUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
        return fileUrl;
    } catch (error: any) {
        if (error.statusCode === 403) {
            alert("SAS Token อาจหมดอายุแล้ว กรุณาขอ Token ใหม่");
        } else {
            console.error("เกิดข้อผิดพลาดในการอัปโหลดไฟล์", error);
            alert("อัปโหลดไฟล์ล้มเหลว");
        }
        return null;
    }
};
