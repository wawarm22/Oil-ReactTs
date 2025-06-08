
export type FieldLabelMap = Record<string, string>;

export const fieldLabelMapsByMaterialType: Record<string, FieldLabelMap> = {
    "น้ำมันดีเซลหมุนเร็วพื้นฐาน": {
        date: "วัน เดือน ปี",
        main_product: "รายการ",
        evidence_number: "หลักฐานเลขที่",
        bl: "B/L",
        outturn: "Outturn",
        discount: "ปริมาณสิทธิ์หักลดหย่อน",
        tax_rate: "อัตราภาษี",
        quantity: "ผลิตสินค้าพิกัด อัตราภาษีสรรพามิต",
        other_product: "ผลิตสินค้าอื่น",
        broken: "เสียหาย",
        other_loss: "อื่นๆ",
        total: "รวมจ่าย",
        remains_physical: "ยอดคงเหลือ Stock",
        remains_report: "ยอดคงเหลือตามบัญชีสิทธิ์",
        diff: "น้ำมัน Gain",
        // "": "หมายเหตุ",        
    },    

};

export const commonFieldLabelMap: FieldLabelMap = {
    date: "วัน เดือน ปี",
    main_product: "รายการ",
    evidence_number: "หลักฐานเลขที่",
    bl: "B/L",
    outturn: "Outturn",
    quantity: "ผลิตสินค้าพิกัด อัตราภาษีสรรพามิต",
    other_product: "ผลิตสินค้าอื่น",
    broken: "เสียหาย",
    other_loss: "อื่นๆ",
    total: "รวมจ่าย",
    remains_physical: "ยอดคงเหลือ",
    // "": "หมายเหตุ",
};

export function getFieldLabelMap(materialType: string): FieldLabelMap {
    for (const key in fieldLabelMapsByMaterialType) {
        if (materialType.includes(key)) {
            return fieldLabelMapsByMaterialType[key];
        }
    }
    return commonFieldLabelMap;
}