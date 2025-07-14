export interface MatchTableItem {
    id: number;
    no?: string;
    title: string;
    transport?: "00" | "01";
    docCode?: string;
}

export const matchTableList: MatchTableItem[] = [
    {
        id: 1,
        title: "การตรวจสอบเอกสารตารางเปรียบเทียบอัตราส่วนกับสูตรการผลิตน้ำมัน",
    },
    {
        id: 2,
        title: "การตรวจสอบเอกสารบัญชีจากแบบ ภส. 07-01 ภส. 07-02 และ ภส. 03-07 (ถ้ามี)",
    },
    {
        id: 3,
        title: "การตรวจสอบเอกสารแบบ ภส. 07-04 แบบงบเดือนแสดงรายการวัตถุดิบ การผลิตการจำหน่ายและยอดคงเหลือสินค้า",
    },
    {
        id: 4,
        title: "การตรวจสอบการทำบัญชีสิทธิ",
    },
    {
        id: 5,
        title: "การตรวจสอบการชำระภาษีของบริษัท",
    },
]
