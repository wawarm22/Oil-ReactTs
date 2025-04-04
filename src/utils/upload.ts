import { documentList } from "../types/docList";
import { GenerateUploadUrlResponse } from "../types/uploadTypes";
import { apiDeleteBlob, apiUpload, generateUploadUrl } from "./api/uploadApi";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra);

let lastParamsKey = "";
let currentRunning = 0;

const pad = (val: number, len: number) => String(val).padStart(len, "0");

const getDocSequenceNumber = (docId: number, subtitleIndex?: number): string => {
    let sequence = 0;
    let start = 1;
    const target = documentList.find((d) => d.id === docId);
    const transport = target?.transport ?? "00";

    for (const doc of documentList) {
        if (doc.transport !== transport) continue;

        if (doc.id === docId) {
            sequence += subtitleIndex !== undefined ? subtitleIndex + 1 : 1;
            break;
        }

        if (doc.subtitle?.length) {
            sequence += doc.subtitle.length;
        } else {
            sequence += 1;
        }
    }

    const offset = transport === "01" ? 100 : 0;
    return `DOC${String(start + sequence + offset - 1).padStart(4, "0")}`;
};

export const uploadFile = async (
    file: File,
    targetPath: string,
    warehouseCode: string,
    transportCode: string,
    periodDateStr: string,
    docId: number,
    subtitleIndex?: number
): Promise<{ url: string; blobPath: string } | null> => {
    if (!file) {
        alert("กรุณาเลือกไฟล์ก่อน!");
        return null;
    }

    try {
        const now = dayjs();
        const uploadDateStr = `${pad(now.date(), 2)}${pad(now.month() + 1, 2)}${String(now.year() + 543).slice(-2)}`;
        const currentKey = `${warehouseCode}-${transportCode}-${periodDateStr}`;

        if (currentKey !== lastParamsKey) {
            currentRunning++;
            lastParamsKey = currentKey;
        }

        const runningStr = pad(currentRunning - 1, 12);
        const docSequence = getDocSequenceNumber(docId, subtitleIndex);
        const fileNameWithoutExt = `${uploadDateStr}-${runningStr}-${warehouseCode}-${transportCode}-${periodDateStr}-${docSequence}`;
        const finalFileName = `${fileNameWithoutExt}.pdf`;

        const prefixToDelete = `${targetPath}/${fileNameWithoutExt}/`;

        try {
            await apiDeleteBlob(prefixToDelete);
        } catch (deleteError: any) {
            const message = deleteError?.response?.data?.error || deleteError.message;
            console.log(message);

            if (message && message.includes("No blobs found to delete")) {
                console.warn("ไม่มี blob เดิมให้ลบ ถือว่าไม่เป็นปัญหา");
            } else {
                console.error("เกิดข้อผิดพลาดระหว่างลบ blob:", message);
                throw new Error("การลบ blob เก่าไม่สำเร็จ");
            }
        }

        const uploadMeta: GenerateUploadUrlResponse | undefined = await generateUploadUrl({
            fileName: finalFileName,
            targetPath,
        });

        if (!uploadMeta?.uploadUrl) {
            throw new Error("ไม่สามารถสร้าง URL สำหรับอัปโหลดได้");
        }

        const success = await apiUpload(file, uploadMeta.uploadUrl, targetPath);
        if (!success) {
            throw new Error("อัปโหลดไฟล์ล้มเหลว");
        }

        return { url: uploadMeta.uploadUrl, blobPath: uploadMeta.blobPath };
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการอัปโหลดไฟล์", error);
        alert("อัปโหลดไฟล์ล้มเหลว");
        return null;
    }
};