export interface TableItem {
    type?: string; // ประเภทวัตถุดิบ เช่น "เนื้อน้ำมัน", "เอทานอล"
    name: string;
    quantity: number;
    unitValue: number;
    productionFormula: string;
    approvalNumber?: string; // เลขที่หนังสืออนุมัติ
    note?: string;
}

export interface TableData {
    productName: string;
    headers: string[]; 
    items: TableItem[];
}

export const sampleTableData: TableData = {
    productName: "HSD EURO V 0.001%s with Add. (Premium)",
    headers: [
        "ลำดับ",
        "ชื่อผลิตภัณฑ์",
        "รายการวัตถุดิบหรือส่วนประกอบที่ใช้ในการผลิต",
        "ปริมาณและจำนวน (ลิตร)",
        "สินค้าต่อ 1 หน่วย",
        "สูตรการผลิต",
        "เลขที่หนังสืออนุมัติ",
        "หมายเหตุ"
    ],
    items: [
        {
            type: "เนื้อน้ำมัน",
            name: "น้ำมันดีเซลหมุนเร็วพื้นฐาน",
            quantity: 3096360,
            unitValue: 0.931705,
            productionFormula: "0.929591-0.969591",
            approvalNumber: "กค.0605.1000/3420 ภส.05-02 เลขทะเบียน รับ 12096 (มีผลตั้งแต่ 27 พ.ย. 62)",
            note: "-"
        },
        {
            type: "เอทานอล",
            name: "ไบโอดีเซลประเภทเมทิลเอสเตอร์ของกรดไขมัน",
            quantity: 225606,
            unitValue: 0.067886,
            productionFormula: "0.030000-0.070000",
            approvalNumber: "",
            note: "-"
        },
        {
            type: "สารเติมแต่ง",
            name: "สารเติมแต่ง DIESEL PR-902J",
            quantity: 1362,
            unitValue: 0.000410,
            productionFormula: "0.000409000",
            approvalNumber: "",
            note: "-"
        },
        {
            type: "",
            name: "ปริมาณรวม",
            quantity: 3323328,
            unitValue: 1.000000,
            productionFormula: "1.000000000",
            approvalNumber: "-",
            note: "-"
        }
    ]
};
