import { BlobServiceClient } from "@azure/storage-blob";

// ดึงค่าจาก .env
const accountName = import.meta.env.REACT_APP_AZURE_STORAGE_ACCOUNT!;
const containerName = import.meta.env.REACT_APP_AZURE_STORAGE_CONTAINER!;
const sasToken = import.meta.env.REACT_APP_AZURE_STORAGE_SAS!;

// ตรวจสอบว่าตัวแปรถูกต้อง
if (!accountName || !containerName || !sasToken) {
    console.error("Missing Azure Storage configuration. Check your .env file.");
}

export const uploadFile = async (file: File): Promise<void> => {
    if (!file) {
        alert("กรุณาเลือกไฟล์ก่อน!");
        return;
    }

    try {
        // เชื่อมต่อไปยัง Azure Storage
        const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net?${sasToken}`);
        const containerClient = blobServiceClient.getContainerClient(containerName);
        
        // ตั้งชื่อไฟล์ไม่ให้ซ้ำ
        const blobName = `${new Date().getTime()}-${file.name}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // อัปโหลดไฟล์
        await blockBlobClient.uploadBrowserData(file);
        alert(`อัปโหลดไฟล์ "${file.name}" สำเร็จ!`);
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการอัปโหลดไฟล์", error);
        alert("อัปโหลดไฟล์ล้มเหลว");
    }
};
