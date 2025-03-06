export interface DocumentItem {
    id: number;
    title: string;
    type: string;
    documents: string[];
}

export const documentList: DocumentItem[] = [
    {
        id: 1,
        title: "การตรวจตารางเปรียบเทียบอัตราส่วนและสูตรการผลิตน้ำมัน",
        type: "แบบ ภส. 05-02 ภส. 05-02/1 ภส. 07.01",
        documents: ["เอกสารแบบ ภส. 05-02", "เอกสารแบบ ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"]
    },
    {
        id: 2,
        title: "ตรวจสอบตารางเปรียบเทียบการจ่ายวัตถุดิบกับปริมาณการผลิต และจำหน่าย เปรียบเทียบกับการชำระภาษี",
        type: "แบบ ภส. 07-01 ภส. 07-02 ภส. 03-07",
        documents: ["เอกสารแบบ ภส. 03-07", "เอกสารแบบ ภส. 07-01", "เอกสารแบบ ภส. 07-02"]
    },
    {
        id: 3,
        title: "แบบงบเดือนแสดงรายการวัตถุดิบ การผลิต การจำหน่าย และ ยอดคงเหลือสินค้า",
        type: "แบบ ภส. 07-04",
        documents: ["เอกสารแบบ ภส. 07-04"]
    },
    {
        id: 4,
        title: "ตรวจการทำบัญชีสิทธิ",
        type: "",
        documents: ["บัญชีรับ-จ่ายน้ำมันที่นำมาใช้เป็นวัตถุดิบในการผลิต", "ใบกำกับภาษี", "เอกสาร Outturn", "เอกสารใบเสร็จ", "เอกสารประกอบต่างๆ ที่เกี่ยวข้อง"]
    },
    {
        id: 5,
        title: "ตรวจสอบปริมาณการขอลดหย่อนจำนวนเงินค่าภาษีสรรพสามิตที่ขอ ลดหย่อนชำระภาษีถูกต้องหรือไม่",
        type: "แบบ ภส. 03-07 ภส. 05-03",
        documents: ["เอกสารแบบ ภส. 03-07", "เอกสารแบบ ภส. 05-03"]
    }
];
