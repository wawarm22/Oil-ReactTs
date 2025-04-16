export interface DocumentItem {
    id: number;
    no?: string;
    title: string;
    documents?: string[];
    subtitle?: string[];
    transport?: "00" | "01";
    docCode?: string;
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
            "เอกสาร ภ.ษ 01-29 (ถ้ามี)",
            "เอกสาร ภส.05-02",
            "เอกสาร ภส. 05-02/1 (ถ้ามี)"
        ],
        transport: "00",
    },
    {
        id: 4,
        title: "เอกสาร การเปลี่ยนแปลงสารเติมแต่ง (ถ้ามี)",
        documents: ["บัญชีรับ-จ่ายน้ำมันที่นำมาใช้เป็นวัตถุดิบในการผลิต", "ใบกำกับภาษี", "เอกสาร Outturn", "เอกสารใบเสร็จ", "เอกสารประกอบต่างๆ ที่เกี่ยวข้อง"],
        transport: "00",
    },
    {
        id: 5,
        title: "เอกสารการรับรองการให้ความเห็นชอบการเติมสารเติมแต่งในน้ำมัน (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 03-07", "เอกสารแบบ ภส. 05-03"],
        transport: "00"
    },
    {
        id: 6,
        title: "แบบ ภส.07-01 บัญชีประจำวันแสดงการรับและการจ่ายวัตถุดิบ",
        documents: ["เอกสารแบบ ภส. 03-07", "เอกสารแบบ ภส. 05-03"],
        transport: "00"
    },
    {
        id: 7,
        title: "แบบ ภส.07-02 บัญชีประจำวันแสดงการผลิตและการจำหน่าย",
        documents: ["เอกสารแบบ ภส. 03-07", "เอกสารแบบ ภส. 05-03"],
        transport: "00"
    },
    {
        id: 8,
        title: "แบบ ภส.03-07 แบบชำระภาษีในแบบรายการภาษีสรรพสามิต",
        documents: ["เอกสารแบบ ภส. 03-07", "เอกสารแบบ ภส. 05-03"],
        transport: "00"
    },
    {
        id: 9,
        title: "เอกสารแนบแบบ ภส. 03-07 แบบชำระภาษีในแบบรายการภาษีสรรพสามิต",
        documents: ["เอกสารแบบ ภส. 03-07", "เอกสารแบบ ภส. 05-03"],
        transport: "00"
    },
    {
        id: 10,
        title: "แบบ ภส.07-04 แบบงบเดือนแสดงรายการวัตถุดิบ การผลิต การจำหน่ายและยอดคงเหลือสินค้า",
        documents: ["เอกสารแบบ ภส. 03-07", "เอกสารแบบ ภส. 05-03"],
        transport: "00"
    },
    {
        id: 11,
        title: "แบบรายงานข้อมูลการใช้สารเติมแต่งในน้ำมัน (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 03-07", "เอกสารแบบ ภส. 05-03"],
        transport: "00"
    },
    {
        id: 12,
        title: "ตารางเปรียบเทียบการจ่ายวัตถุดิบ แบบ ภส.07-01 เทียบ ปริมาณการผลิตและจำหน่าย แบบ ภส.07-02และเทียบแบบชำระภาษีในแบบรายการภาษีสรรพสามิต แบบ ภส.03-07 (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 03-07", "เอกสารแบบ ภส. 05-03"],
        transport: "00"
    },
    {
        id: 13,
        title: "บัญชีรับ-จ่ายน้ำมันที่นำมาใช้เป็นวัตถุดิบในการผลิต",
        documents: ["เอกสารแบบ ภส. 03-07", "เอกสารแบบ ภส. 05-03"],
        transport: "00"
    },
    {
        id: 14,
        title: "เอกสาร ใบกำกับภาษี (โรงกลั่น)",
        documents: ["เอกสารแบบ ภส. 03-07", "เอกสารแบบ ภส. 05-03"],
        transport: "00"
    },
    {
        id: 15,
        title: "เอกสารใบเสร็จ จากกรมศุลกากร (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 03-07", "เอกสารแบบ ภส. 05-03"],
        transport: "00"
    },
    {
        id: 16,
        title: "แบบรายงานข้อมูลการใช้สารเติมแต่งในน้ำมัน (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 03-07", "เอกสารแบบ ภส. 05-03"],
        transport: "00"
    },
    {
        id: 17,
        title: "0409 ใบขนขาเข้า (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 03-07", "เอกสารแบบ ภส. 05-03"],
        transport: "00"
    },
    {
        id: 18,
        title: "เอกสาร ใบกำกับภาษี / ใบแจ้งหนี้ / ใบส่งของ / ใบกำกับการขนส่ง / เอกสารโอนคลัง",
        documents: ["เอกสารแบบ ภส. 03-07", "เอกสารแบบ ภส. 05-03"],
        transport: "00"
    },
    {
        id: 19,
        title: "แบบ ภส 05-03 แบบคำขอหักลดหย่อนภาษีสรรพสามิต",
        documents: ["เอกสารแบบ ภส. 03-07", "เอกสารแบบ ภส. 05-03"],
        transport: "00"
    },
    {
        id: 20,
        title: "หนังสือหักคืน (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 03-07", "เอกสารแบบ ภส. 05-03"],
        transport: "00"
    },
    {
        id: 21,
        title: "เอกสารใบรับรองการชำระภาษีสรรพสามิต (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 03-07", "เอกสารแบบ ภส. 05-03"],
        transport: "00"
    },
    {
        id: 22,
        title: "เอกสาร สรุปรายการใบกำกับภาษีซื้อน้ำมัน (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "00"
    },
    {
        id: 23,
        title: "เอกสารสรุปการจ่ายภาษี จากโรงกลั่น (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "00"
    },
    {
        id: 24,
        title: "ใบกำกับภาษีกรมสรรพสามิต (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "00"
    },
    {
        id: 25,
        title: "ตารางเปรียบเทียบเอกสาร ภส.05-03 แบบคำขอหักลดหย่อนภาษี และเอกสาร ภส.03-07 แบบขอคืนภาษีสรรพสามิต (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "00"
    },
    {
        id: 26,
        title: "หนังสือนำส่งเอกสารขอคืนภาษีสรรพสามิต",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 27,
        title: "ตารางเปรียบเทียบอัตราส่วนกับสูตรการผลิตน้ำมัน",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 28,
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
        id: 29,
        title: "เอกสาร การเปลี่ยนแปลงสารเติมแต่ง (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },

    {
        id: 30,
        title: "เอกสารการรับรองการให้ความเห็นชอบการเติมสารเติมแต่งในน้ำมัน (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 31,
        title: "แบบ ภส.07-01 บัญชีประจำวันแสดงการรับและการจ่ายวัตถุดิบ",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 32,
        title: "แบบ ภส.07-02 บัญชีประจำวันแสดงการผลิตและการจำหน่าย",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 33,
        title: "แบบ ภส.03-07 แบบชำระภาษีในแบบรายการภาษีสรรพสามิต",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 34,
        title: "เอกสารแนบแบบ ภส. 03-07 แบบชำระภาษีในแบบรายการภาษีสรรพสามิต",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 35,
        title: "แบบ ภส.07-04 แบบงบเดือนแสดงรายการวัตถุดิบ การผลิต การจำหน่ายและยอดคงเหลือสินค้า",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 36,
        title: "แบบรายงานข้อมูลการใช้สารเติมแต่งในน้ำมัน (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 37,
        title: "ตารางเปรียบเทียบการจ่ายวัตถุดิบ แบบ ภส.07-01 เทียบ ปริมาณการผลิตและจำหน่าย แบบ ภส.07-02และเทียบแบบชำระภาษีในแบบรายการภาษีสรรพสามิต แบบ ภส.03-07 (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 38,
        title: "บัญชีรับ-จ่ายน้ำมันที่นำมาใช้เป็นวัตถุดิบในการผลิต",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 39,
        title: "เอกสาร ใบกำกับภาษี (โรงกลั่น)",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 40,
        title: "เอกสารใบเสร็จ จากกรมศุลกากร (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 41,
        title: "0409 ใบขนขาเข้า (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 42,
        title: "เอกสาร Outturn Statement รายงานปริมาณน้ำมันที่ได้รับจริง",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 43,
        title: "เอกสาร ใบกำกับภาษี / ใบแจ้งหนี้ / ใบส่งของ / ใบกำกับการขนส่ง / เอกสารโอนคลัง",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 44,
        title: "แบบ ภส 05-03 แบบคำขอหักลดหย่อนภาษีสรรพสามิต",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 45,
        title: "หนังสือหักคืน (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 46,
        title: "เอกสารใบรับรองการชำระภาษีสรรพสามิต (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 47,
        title: "เอกสาร สรุปรายการใบกำกับภาษีซื้อน้ำมัน (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 48,
        title: "เอกสารสรุปการจ่ายภาษี จากโรงกลั่น (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    {
        id: 49,
        title: "เอกสารจาก 3PL",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        subtitle: [
            "Thappline",
            "FPT"
        ],
        transport: "01"
    },
    {
        id: 50,
        title: "ตารางเปรียบเทียบเอกสาร ภส.05-03 แบบคำขอหักลดหย่อนภาษี และเอกสาร ภส.03-07 แบบขอคืนภาษีสรรพสามิต (ถ้ามี)",
        documents: ["เอกสารแบบ ภส. 05-02 ภส. 05-02/1", "เอกสารแบบ ภส. 07-01"],
        transport: "01"
    },
    // {
    //     id: 51,
    //     title: "ถ้าเป็นนำเข้า",
    //     subtitle: [
    //         "เอกสารใบเสร็จ จากกรมศุลกากร (ถ้ามี)",
    //         "ใบขนขาเข้า Satus 0409  หรือ outturn เข้าเก็บเอกสารใหม่ (ถ้ามี)"
    //     ],
    //     transport: "01",
    // },
    // {
    //     id: 52,
    //     title: "Thappline",
    //     transport: "01"
    // }
];
