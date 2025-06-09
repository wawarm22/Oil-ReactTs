export type LabelMap = Record<string, string>;

const commonMapDefault: LabelMap = {
    column_1: "วัน เดือน ปี",
    column_2: "รายการ",
    column_3: "หลักฐานเลขที่",
    column_4: "B/L",
    column_5: "Outturn",
    column_6: "ผลิตสินค้าพิกัด อัตราภาษีสรรพามิต",
    column_7: "ผลิตสินค้าอื่น",
    column_8: "เสียหาย",
    column_9: "อื่นๆ",
    column_10: "รวมจ่าย",
    column_11: "ยอดคงเหลือ",
    column_12: "หมายเหตุ",
};

const labelMapsByMaterialType: { [key: string]: LabelMap } = {
    "น้ำมันดีเซลพื้นฐาน (H-Base)": {
        column_1: "วัน เดือน ปี",
        column_2: "รายการ",
        column_3: "หลักฐานเลขที่",
        column_4: "B/L",
        column_5: "Outturn",
        column_6: "ปริมาณสิทธิ์หักลดหย่อน",
        column_7: "อัตราภาษี",
        column_8: "ผลิตสินค้าพิกัด อัตราภาษีสรรพามิต",
        column_9: "ผลิตสินค้าอื่น",
        column_10: "เสียหาย",
        column_11: "อื่นๆ",
        column_12: "รวมจ่าย",
        column_13: "ยอดคงเหลือ Stock",
        column_14: "ยอดคงเหลือตามบัญชีสิทธิ์",
        column_15: "น้ำมัน Gain",
        column_16: "หมายเหตุ",
    },

    "ไบโอดีเซลประเภทเมทิลเอสเตอร์ของกรดไขมัน (500038)": {
        column_1: "วัน เดือน ปี",
        column_2: "รายการ",
        column_3: "หลักฐานเลขที่",
        column_4: "B/L",
        column_5: "Outturn",
        column_6: "ผลิตสินค้าพิกัด อัตราภาษีสรรพามิต",
        column_7: "ผลิตสินค้าอื่น",
        column_8: "เสียหาย",
        column_9: "อื่นๆ",
        column_10: "รวมจ่าย",
        column_11: "ยอดคงเหลือ",
        column_12: "คงเหลือจริงตามรายงาน T/L",
        column_13: "GAIN/(LOSS)",
        column_14: "หมายเหตุ",
    },

    "Diesel RE-901J (100991)": {
        column_1: "วัน เดือน ปี",
        column_2: "รายการ",
        column_3: "หลักฐานเลขที่",
        column_4: "B/L",
        column_5: "Outturn",
        column_6: "ผลิตสินค้าพิกัด อัตราภาษีสรรพามิต",
        column_7: "ผลิตสินค้าอื่น",
        column_8: "เสียหาย",
        column_9: "อื่นๆ",
        column_10: "รวมจ่าย",
        column_11: "ยอดคงเหลือ",
        column_12: "คงเหลือจริงตามรายงาน T/L",
        column_13: "GAIN/(LOSS)",
        column_14: "หมายเหตุ",
    },

    "Denatured Ethanol (500029)": {
        column_1: "วัน เดือน ปี",
        column_2: "รายการ",
        column_3: "หลักฐานเลขที่",
        column_4: "B/L",
        column_5: "Outturn",
        column_6: "GSH91",
        column_7: "GSH95",
        column_8: "E20",
        column_9: "ผลิตสินค้าอื่น",
        column_10: "เสียหาย",
        column_11: "อื่นๆ",
        column_12: "รวมจ่าย",
        column_13: "ยอดคงเหลือ",
        column_14: "คงเหลือจริงตามรายงาน T/L",
        column_15: "GAIN/(LOSS)",
        column_16: "หมายเหตุ",
    },

    "Keropur R 3726 (100355)": {
        column_1: "วัน เดือน ปี",
        column_2: "รายการ",
        column_3: "หลักฐานเลขที่",
        column_4: "B/L",
        column_5: "Outturn",
        column_6: "ULG",
        column_7: "GSH91",
        column_8: "GSH95",
        column_9: "GSH95",
        column_10: "ผลิตสินค้าอื่น",
        column_11: "เสียหาย",
        column_12: "อื่นๆ",
        column_13: "รวมจ่าย",
        column_14: "ยอดคงเหลือ",
        column_15: "คงเหลือจริงตามรายงาน T/L",
        column_16: "GAIN/(LOSS)",
        column_17: "หมายเหตุ",
    },

    "น้ำมันเบนซิน ออกเทน 95 (500014)": {
        column_1: "วัน เดือน ปี",
        column_2: "รายการ",
        column_3: "หลักฐานเลขที่",
        column_4: "B/L",
        column_5: "Outturn",
        column_6: "จำนวนรับตามบัญชีสิทธิ์ฯ",
        column_7: "อัตราภาษี",
        column_8: "ผลิตสินค้าพิกัด อัตราภาษีสรรพามิต",
        column_9: "ผลิตสินค้าอื่น",
        column_10: "เสียหาย",
        column_11: "อื่นๆ",
        column_12: "รวมจ่าย",
        column_13: "ยอดคงเหลือ",
        column_14: "ยอดคงเหลือบัญชีสิทธิหักลดหย่อน",
        column_15: "หมายเหตุ",
    },
};

export function getLabelMap(materialType: string): LabelMap {
    // console.log("materialType", materialType);
    
    for (const key in labelMapsByMaterialType) {
        if (materialType.includes(key)) {
            return labelMapsByMaterialType[key];
        }
    }
    return commonMapDefault;
}
