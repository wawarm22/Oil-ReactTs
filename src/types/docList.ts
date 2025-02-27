export interface DocumentItem {
    id: number;
    title: string;
    pages: number;
    type: string; 
}

export const documentList: DocumentItem[] = [
    { id: 1, title: "การตรวจตารางเปรียบเทียบอัตราส่วนและสูตรการผลิตน้ำมัน", pages: 6, type: "แบบ ภส. 05-02 ภส. 05-02/1 ภส. 07.01" },
    { id: 2, title: "การตรวจบัญชีจากแบบภส. 07-01 ภส. 07-02 และ ภส. 03-07", pages: 9, type: "แบบภส. 07-01 ภส. 07-02 และ ภส. 03-07" },
    { id: 3, title: "ตรวจแบบ ภส. 07-01 ภส. 07-02 เเละ ภส. 07-04", pages: 4, type: "แบบ ภส. 07-01 ภส. 07-02 เเละ ภส. 07-04" },
    { id: 4, title: "ตรวจการทำบัญชีสิทธิ", pages: 0, type: "" },
    { id: 5, title: "การตรวจการชำระภาษีของบริษัทว่าจ่ายภาษีถูกต้องหรือไม่", pages: 0, type: "แบบ ภส. 03-07 ภส. 05-03" }
];
