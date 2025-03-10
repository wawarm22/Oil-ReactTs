export interface ChecklistItem {
    name: string;
    status: "green" | "red";
    subItems?: string[];
}

export const checklistData: ChecklistItem[] = [
    {
        name: "ประเภทวัตถุดิบ",
        status: "green",
        subItems: ["ตรวจสอบประเภทสินค้า", "ตรวจสอบหมวดหมู่สินค้า"],
    },
    {
        name: "หน่วย",
        status: "green",
        subItems: ["ตรวจสอบหน่วยนับ"],
    },
    {
        name: "วันเดือนปีเกิด",
        status: "red",
        subItems: ["ตรวจสอบรูปแบบวันที่", "ตรวจสอบข้อมูลในระบบ"],
    },
    {
        name: "รายการ",
        status: "green",
        subItems: ["ตรวจสอบรายละเอียดสินค้า"],
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
