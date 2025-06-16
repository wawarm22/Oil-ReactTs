import { OcrFields } from "./ocrFileType";

export interface ChecklistItem {
    name: string;
    status: "green" | "red";
    subItems?: string[];
}

export const checklistData: ChecklistItem[] = [
    {
        name: "เอกสารแบบ",
        status: "green",
        subItems: ["ภส. 07-01"],
    },
    {
        name: "ประเภทวัตถุดิบ",
        status: "green",
        subItems: ["Ethanol"],
    },
    {
        name: "หน่วย",
        status: "red",
        subItems: ["ลิตร"],
    },
    {
        name: "รายการ",
        status: "green",
    },
    {
        name: "ยอดยกมา",
        status: "green",
    },
    {
        name: "หลักฐานเลขที่",
        status: "green",
    },
    {
        name: "จำนวนรับ",
        status: "red",
    },
    {
        name: "จำนวนจ่าย",
        status: "red",
    },
    {
        name: "ผลิตสินค้าสำเร็จ อัตราภาษีสรรพสามิต",
        status: "green",
    },
    {
        name: "ผลิตสินค้าอื่นๆ",
        status: "green",
    },
];

export type OcrByDocIdType = {
    [docId: number]: {
        [subtitleIndex: number]: {
            [fileKey: string]: {
                pages: { [pageNum: number]: OcrFields };
                pageCount: number;
            };
        };
    };
};

export type ValidateResultsByDoc = {
    [docId: number]: {
        [subtitleIdx: number]: {
            [pageNum: number]: {
                docType: string;
                validateResult: any;
            };
        };
    };
};
