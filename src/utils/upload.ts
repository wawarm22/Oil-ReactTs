import { documentList } from "../types/docList";
import { apiListPdfFiles, apiUpload, generateUploadUrl } from "./api/uploadApi";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra);

let lastParamsKey = "";
let currentRunning = 0;

const pad = (val: number, len: number) => String(val).padStart(len, "0");

export const getDocSequenceNumber = (docId: number, subtitleIndex?: number): string => {
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
    files: File[],
    companyName: string,
    warehouseCode: string,
    transportCode: string,
    periodDateStr: string,
    docId: number,
    subtitleIndex?: number,
    mainCode?: string,
): Promise<{ name: string; data: string; blobPath: string }[]> => {
    if (!files.length) {
        alert("กรุณาเลือกไฟล์ก่อน!");
        return [];
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
        const prefix = mainCode ?? `${uploadDateStr}-${runningStr}`;
        const baseName = `${prefix}-${warehouseCode}-${transportCode}-${periodDateStr}-${docSequence}`;

        const targetPath = subtitleIndex !== undefined
            ? `${companyName}/${baseName}/${docId}/${subtitleIndex + 1}`
            : `${companyName}/${baseName}/${docId}`;

        let listCount = 0;

        const checkList = await apiListPdfFiles(targetPath);
        listCount = checkList.count || 0;

        const fileNames = files.map((_, i) => {
            const suffix = `-${listCount + i + 1}`;
            return `${baseName}${suffix}.pdf`;
        });

        const uploadMeta = await generateUploadUrl({ fileNames, targetPath });

        if (!uploadMeta?.uploads?.length || uploadMeta.uploads.length !== files.length) {
            throw new Error("จำนวน URL ที่ได้ไม่ตรงกับไฟล์ที่เลือก");
        }

        const uploadedResults: { name: string; data: string; blobPath: string }[] = [];

        for (let i = 0; i < files.length; i++) {
            const uploadInfo = uploadMeta.uploads[i];
            const file = files[i];

            const success = await apiUpload(file, uploadInfo.uploadUrl, targetPath);
            if (!success) {
                console.warn(`อัปโหลดไฟล์ล้มเหลว: ${file.name}`);
                continue;
            }

            uploadedResults.push({
                name: file.name,
                data: uploadInfo.uploadUrl,
                blobPath: uploadInfo.blobPath,
            });
        }

        return uploadedResults;
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการอัปโหลดหลายไฟล์", error);
        alert("อัปโหลดไฟล์ล้มเหลว");
        return [];
    }
};

