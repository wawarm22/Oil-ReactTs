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
        subItems: ["ตรวจสอบหน่วยนับ", "ตรวจสอบค่ามาตรฐาน"],
    },
    {
        name: "วันเดือนปีเกิด",
        status: "red",
        subItems: ["ตรวจสอบรูปแบบวันที่", "ตรวจสอบข้อมูลในระบบ"],
    },
    {
        name: "รายการ",
        status: "green",
        subItems: ["ตรวจสอบรายละเอียดสินค้า", "ตรวจสอบหมายเลขอ้างอิง"],
    },
    {
        name: "ยอดยกมา",
        status: "green",
        subItems: ["ตรวจสอบยอดยกมาถูกต้อง", "เปรียบเทียบกับยอดก่อนหน้า"],
    },
    {
        name: "หลักฐานเลขที่",
        status: "green",
        subItems: ["ตรวจสอบเลขที่เอกสาร", "ตรวจสอบความครบถ้วน"],
    },
    {
        name: "จำนวนรับ",
        status: "red",
        subItems: ["ตรวจสอบยอดรับ", "ตรวจสอบเอกสารกำกับ"],
    },
    {
        name: "จำนวนจ่าย",
        status: "red",
        subItems: ["ตรวจสอบยอดจ่าย", "ตรวจสอบเอกสารประกอบ"],
    },
    {
        name: "ผลิตสินค้าสำเร็จ อัตราภาษีสรรพสามิต",
        status: "green",
        subItems: ["ตรวจสอบการคิดภาษี", "ตรวจสอบอัตราภาษี"],
    },
    {
        name: "ผลิตสินค้าอื่นๆ",
        status: "green",
        subItems: ["ตรวจสอบการผลิต", "ตรวจสอบรายการสินค้าทั้งหมด"],
    },
];
