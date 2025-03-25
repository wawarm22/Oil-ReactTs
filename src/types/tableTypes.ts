export interface TableItem {
    name: string;
    quantity: number;
    unitValue: number;
    productionFormula: string;
    note?: string;
}

export interface TableData {
    productName: string;
    headers: string[]; 
    items: TableItem[];
}

export const sampleTableData: TableData = {
    productName: "Gasohol 95 E10",
    headers: [
        "ชื่อผลิตภัณฑ์",
        "รายการวัตถุดิบหรือส่วนประกอบ",
        "ปริมาณ",
        "สินค้าต่อ 1 หน่วย",
        "สูตรการผลิต",
        "หมายเหตุ"
    ],
    items: [
        { name: "เนื้อน้ำมัน", quantity: 13671064, unitValue: 90.7659204279, productionFormula: "0.899661-0.909661", note: "ที่ คก. 0612.01/2160" },
        { name: "ETHANOL", quantity: 1385706, unitValue: 9.2000798572, productionFormula: "0.090000-0.100000", note: "ลว. 28 ส.ค.2561" },
        { name: "สารเติมแต่ง", quantity: 5121, unitValue: 0.0339997149, productionFormula: "0.000339", note: "ลำดับที่ 6" },
        { name: "ปริมาณรวม", quantity: 15061891, unitValue: 100.0000000000, productionFormula: "100.000000", note: "-" },
    ],
};
