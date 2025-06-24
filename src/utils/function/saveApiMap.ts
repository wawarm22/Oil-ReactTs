import { saveData0503Page1, saveData0701 } from "../api/apiSaveData";
import { AuthSchema } from "../../types/schema/auth";

type SaveApiConfig = {
    docId: number;
    subIdx: number;
    api: (args: { data: any, auth: AuthSchema, docType?: string }) => Promise<any>;
    // docTypes?: string[];
};

export const SAVE_API_LIST: SaveApiConfig[] = [
    {
        docId: 6,
        subIdx: 0,
        api: ({ data, auth }) => saveData0701(data, auth),
    },
    {
        docId: 19,
        subIdx: 0,
        api: ({ data, auth, docType }) => {
            if (docType === "oil-05-03-page-1" || docType === "oil-05-03-page-3") {
                return saveData0503Page1(data, auth);
            }
            // if (docType === "oil-05-03-page-2") {
            //     return saveData0503Page2(data, auth);
            // }
            // fallback
            throw new Error(`Unknown docType for 0503: ${docType}`);
        },
        // docTypes: ["oil-05-03-page-1", "oil-05-03-page-2"],
    },
];

export const SAVE_API_MAP: Record<
    string,
    (args: { data: any; auth: AuthSchema; docType?: string }) => Promise<any>
> = Object.fromEntries(
    SAVE_API_LIST.map(cfg => [`${cfg.docId}-${cfg.subIdx}`, cfg.api])
);

