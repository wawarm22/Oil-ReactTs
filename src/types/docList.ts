export interface DocumentItem {
    id: number;
    title: string;
    documents: string[];
    subtitle?: string[];
    transport?: "00" | "01";
}

export const documentList: DocumentItem[] = [
    {
        id: 1,
        title: "หนังสือนำส่งเอกสารขอคืนภาษีสรรพสามิต",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "00",
    },
    {
        id: 2,
        title: "ตารางเปรียบเทียบอัตราส่วนกับสูตรการผลิตน้ำมัน",
        documents: ["เอกสารแบบ ภส. 03-07", "เอกสารแบบ ภส. 07-01", "เอกสารแบบ ภส. 07-02"],
        transport: "00",
    },
    {
        id: 3,
        title: "เอกสารสูตรน้ำมัน",
        documents: ["เอกสารแบบ ภส. 07-04"],
        subtitle: [
            "เอกสารหนังสือตราครุฑ (อนุมัติให้ใช้สูตร)",
            "เอกสาร ภ.ษ 01-29",
            "เอกสาร ภส.05-02",
            "เอกสาร ภส. 05-02/1"
        ],
        transport: "00"
    },
    {
        id: 4,
        title: "เอกสาร การเปลี่ยนเเปลงสารเติมเเต่ง (ถ้ามี)",
        documents: ["บัญชีรับ-จ่ายน้ำมันที่นำมาใช้เป็นวัตถุดิบในการผลิต", "ใบกำกับภาษี", "เอกสาร Outturn", "เอกสารใบเสร็จ", "เอกสารประกอบต่างๆ ที่เกี่ยวข้อง"],
        transport: "00"
    },
    {
        id: 5,
        title: "เอกสารการรับรองการให้ความเห็นชอบการเติมสารเติมเเต่งในน้ำมัน (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 03-07", "เอกสารแบบ ภส. 05-03"],
        transport: "00"        
    },
    {
        id: 6,
        title: "เเบบ ภส.07-01 บัญชีประจำวันเเสดงการรับเเละการจ่ายวัตถุดิบ",
        documents: ["เอกสารแบบ ภส. 03-07", "เอกสารแบบ ภส. 05-03"],
        transport: "00"        
    },
    {
        id: 7,
        title: "แบบ ภส.07-02 บัญชีประจำวันเเสดงการผลิตเเละการจำหน่าย",
        documents: ["เอกสารแบบ ภส. 03-07", "เอกสารแบบ ภส. 05-03"],  
        transport: "00"      
    },
    {
        id: 8,
        title: "เเบบ ภส.03-07 เเบบชำระภาษีในเเบบรายการภาษีสรรพสามิต",
        documents: ["เอกสารแบบ ภส. 03-07", "เอกสารแบบ ภส. 05-03"],   
        transport: "00"     
    },
    {
        id: 9,
        title: "เอกสารเเนบ 03-07",
        documents: ["เอกสารแบบ ภส. 03-07", "เอกสารแบบ ภส. 05-03"],        
        transport: "00"
    },
    {
        id: 10,
        title: "เเบบ ภส.07-04 เเบบงบเดือนเเสดงรายการวัตถุดิบ การผลิต การจำหน่ายเเละยอดคงเหลือสินค้า",
        documents: ["เอกสารแบบ ภส. 03-07", "เอกสารแบบ ภส. 05-03"],        
        transport: "00"
    },
    {
        id: 11,
        title: "เเบบรายงานข้อมูลการใช้สารเติมเเต่งในน้ำมัน (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 03-07", "เอกสารแบบ ภส. 05-03"],        
        transport: "00"
    },
    {
        id: 12,
        title: "ตารางเปรียบเทียบการจ่ายวัตถุดิบ เเบบ ภส.07-01 เทียบ ปริมาณการผลิตเเละจำหน่าย เเบบ ภส.07-02เเละเทียบเเบบชำระภาษีในเเบบรายการภาษีสรรพสามิต เเบบ ภส.03-07",
        documents: ["เอกสารแบบ ภส. 03-07", "เอกสารแบบ ภส. 05-03"],      
        transport: "00"  
    },
    {
        id: 13,
        title: "เอกสาร ใบกำกับภาษี (โรงกลั่น)",
        documents: ["เอกสารแบบ ภส. 03-07", "เอกสารแบบ ภส. 05-03"],        
        transport: "00"
    },
    {
        id: 14,
        title: "เอกสารใบเสร็จ จากกรมศุลกากร",
        documents: ["เอกสารแบบ ภส. 03-07", "เอกสารแบบ ภส. 05-03"],   
        transport: "00"     
    },
    {
        id: 15,
        title: "เเบบรายงานข้อมูลการใช้สารเติมเเต่งในน้ำมัน (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 03-07", "เอกสารแบบ ภส. 05-03"],   
        transport: "00"     
    },
    {
        id: 16,
        title: "0409 ใบขนขาเข้า",
        documents: ["เอกสารแบบ ภส. 03-07", "เอกสารแบบ ภส. 05-03"],    
        transport: "00"    
    },
    {
        id: 17,
        title: "เอกสาร ใบกำกับภาษี / ใบเเจ้งหนี้ / ใบส่งของ / ใบกำกับการขนส่ง / เอกสารโอนคลัง",
        documents: ["เอกสารแบบ ภส. 03-07", "เอกสารแบบ ภส. 05-03"],    
        transport: "00"    
    },
    {
        id: 18,
        title: "แบบ ภส 05-03",
        documents: ["เอกสารแบบ ภส. 03-07", "เอกสารแบบ ภส. 05-03"],       
        transport: "00" 
    },
    {
        id: 19,
        title: "หนังสือหักคืน (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 03-07", "เอกสารแบบ ภส. 05-03"],       
        transport: "00" 
    },
    {
        id: 20,
        title: "เอกสารใบรับรองการชำระภาษีสรรพสามิต (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 03-07", "เอกสารแบบ ภส. 05-03"],     
        transport: "00"   
    },
    {
        id: 21,
        title: "เอกสาร สรุปรายการใบกำกับภาษีซื้อน้ำมัน (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "00"
    },
    {
        id: 22,
        title: "เอกสารสรุปการจ่ายภาษี จากโรงกลั่น (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "00"
    },
    {
        id: 23,
        title: "ใบกำกับภาษีกรมสรรพสามิต (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "00"
    },
    {
        id: 24,
        title: "ตารางเปรียบเทียบเอกสาร ภส.05-03 เเบบคำขอหักลดหย่อนภาษี เเละเอกสาร ภส.03-07 เเบบขอคืนภาษีสรรพสามิต",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "00"
    },
    {
        id: 25,
        title: "หนังสือนำส่งเอกสารขอคืนภาษีสรรพสามิต",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 26,
        title: "ตารางเปรียบเทียบอัตราส่วนกับสูตรการผลิตน้ำมัน",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 27,
        title: "เอกสารสูตรน้ำมัน",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        subtitle: [
            "เอกสารหนังสือตราครุฑ (อนุมัติให้ใช้สูตร)",
            "เอกสาร ภ.ษ 01-29",
            "เอกสาร ภส.05-02",
            "เอกสาร ภส. 05-02/1"
        ],
        transport: "01"
    },
    {
        id: 28,
        title: "เอกสาร การเปลี่ยนเเปลงสารเติมเเต่ง (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    
    {
        id: 29,
        title: "เอกสารการรับรองการให้ความเห็นชอบการเติมสารเติมเเต่งในน้ำมัน (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 30,
        title: "เเบบ ภส.07-01 บัญชีประจำวันเเสดงการรับเเละการจ่ายวัตถุดิบ",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 31,
        title: "แบบ ภส.07-02 บัญชีประจำวันเเสดงการผลิตเเละการจำหน่าย",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 32,
        title: "เเบบ ภส.03-07 เเบบชำระภาษีในเเบบรายการภาษีสรรพสามิต",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 33,
        title: "เอกสารเเนบ 03-07",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 34,
        title: "เเบบ ภส.07-04 เเบบงบเดือนเเสดงรายการวัตถุดิบ การผลิต การจำหน่ายเเละยอดคงเหลือสินค้า",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 35,
        title: "เเบบรายงานข้อมูลการใช้สารเติมเเต่งในน้ำมัน (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 36,
        title: "ตารางเปรียบเทียบการจ่ายวัตถุดิบ เเบบ ภส.07-01 เทียบ ปริมาณการผลิตเเละจำหน่าย เเบบ ภส.07-02เเละเทียบเเบบชำระภาษีในเเบบรายการภาษีสรรพสามิต เเบบ ภส.03-07",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 37,
        title: "เอกสาร ใบกำกับภาษี (โรงกลั่น)",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 38,
        title: "เอกสารใบเสร็จ จากกรมศุลกากร",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 39,
        title: "0409 ใบขนขาเข้า",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 40,
        title: "เอกสาร Outturn Statement รายงานปริมาณน้ำมันที่ได้รับจริง",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 41,
        title: "เอกสาร ใบกำกับภาษี / ใบเเจ้งหนี้ / ใบส่งของ / ใบกำกับการขนส่ง / เอกสารโอนคลัง",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 42,
        title: "แบบ ภส 05-03",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 43,
        title: "หนังสือหักคืน (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 44,
        title: "เอกสารใบรับรองการชำระภาษีสรรพสามิต (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 45,
        title: "เอกสาร สรุปรายการใบกำกับภาษีซื้อน้ำมัน (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 46,
        title: "เอกสารสรุปการจ่ายภาษี จากโรงกลั่น (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 47,
        title: "เอกสารจาก 3PL",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        subtitle: [
            "Thappline",
            "FPT"
        ],
        transport: "01"
    },
    {
        id: 48,
        title: "ตารางเปรียบเทียบเอกสาร ภส.05-03 เเบบคำขอหักลดหย่อนภาษี เเละเอกสาร ภส.03-07 เเบบขอคืนภาษีสรรพสามิต",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
];
