import { saveData0307, saveData0503Page1, saveData0701, saveData0702 } from "../api/apiSaveData";
import { AuthSchema } from "../../types/schema/auth";
import { Save0503Schema } from "../../types/schema/save";

type SaveApiConfig = {
    docId: number;
    subIdx: number;
    api: (args: { data: any, auth: AuthSchema, docType?: string }) => Promise<any>;
    // docTypes?: string[];
};

export const SAVE_API_LIST: SaveApiConfig[] = [
    // ทางเรือ transport === 00
    {
        docId: 6,
        subIdx: 0,
        api: ({ data, auth }) => saveData0701(data, auth),
    },
    {
        docId: 7,
        subIdx: 0,
        api: ({ data, auth }) => saveData0702(data, auth),
    },
    {
        docId: 8,
        subIdx: 0,
        api: ({ data, auth }) => saveData0307(data, auth),
    },
    {
        docId: 19,
        subIdx: 0,
        api: ({ data, auth }) => {
            if (data.data.docType === 'oil-05-03-page-2' || data.data.docType === 'oil-05-03-page-4') {
                return Promise.resolve({ skipped: true });
            }
            const result = Save0503Schema.safeParse(data);
            if (result.success) {
                return saveData0503Page1(data, auth);
            }
            throw new Error(`Unknown or unsupported data structure for 0503`);
        },
    },

    // ทางท่อ transport === 11
    {
        docId: 31,
        subIdx: 0,
        api: ({ data, auth }) => saveData0701(data, auth),
    },
    {
        docId: 32,
        subIdx: 0,
        api: ({ data, auth }) => saveData0702(data, auth),
    },
    {
        docId: 33,
        subIdx: 0,
        api: ({ data, auth }) => saveData0307(data, auth),
    },
    {
        docId: 44,
        subIdx: 0,
        api: ({ data, auth }) => {
            if (data.data.docType === 'oil-05-03-page-2' || data.data.docType === 'oil-05-03-page-4') {
                return Promise.resolve({ skipped: true });
            }
            const result = Save0503Schema.safeParse(data);
            console.log("result error 0503", result.error);
            if (result.success) {
                return saveData0503Page1(data, auth);
            }
            throw new Error(`Unknown or unsupported data structure for 0503`);
        },
    },

];

export const SAVE_API_MAP: Record<
    string,
    (args: { data: any; auth: AuthSchema; docType?: string }) => Promise<any>
> = Object.fromEntries(
    SAVE_API_LIST.map(cfg => [`${cfg.docId}-${cfg.subIdx}`, cfg.api])
);

