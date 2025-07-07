export interface MaterialUsageItem {
    item: string;
    values: number[];
}

export interface ProductionItem {
    item: string;
    values: number[];
}

export interface MaterialUsageData {
    headers: string[];
    items: MaterialUsageItem[];
}

export interface ProductionData {
    headers: string[];
    items: ProductionItem[];
}

export const materialUsageData: MaterialUsageData = {
    headers: ["รายการ", "Denatured Ethanol", "Dyeguare Brown", "NEMO 6164", "RBOB 91", "RBOB 99", "ULG 95"],
    items: [
        { item: "คงเหลือยกมา", values: [179269, 711, 10973, 2908417, 1470772, 661176] },
        { item: "รับเดือนนี้", values: [2179725, 0, 14295, 9718744, 6355095, 705152] },
        { item: "รวม", values: [2358964, 711, 25268, 12527161, 7825867, 1366328] },
        { item: "ผลิตลินค้าตามพิกัด ฯ", values: [600091, 0, 2875, 5919594, 0, 0] },
        { item: "ผลิตสินค้าอื่น", values: [0, 0, 0, 700000, 350000, 0] },
        { item: "ส่วนขาด/ส่วนเกิน", values: [-2278, 12, -353, -12302, 2920, 51] },
        { item: "อื่น ๆ (จ่ายโอนคลัง)", values: [0, 0, 0, 0, 0, 0] },
        { item: "Loss/Gain", values: [0, 0, 0, 0, 0, 0]},
        { item: "คงเหลือตกไป", values: [442180, 578, 12687, 3065900, 1386294, 818347] },
    ]
};

export const productionData: ProductionData = {
    headers: ["รายการ", "Gasohol 91", "Gasohol 95", "Shell Advance", "Shell E20 Gasohol", "V-Power Gasohol 95"],
    items: [
        { item: "คงเหลือยกมา", values: [0, 0, 0, 0, 0] },
        { item: "รับจากการผลิต", values: [6522560, 3157119, 548286, 3627632, 3560796] },
        { item: "รับคืนคืนจากคลังสินค้าทัณฑ์บน", values: [0, 0, 0, 0, 0] },
        { item: "อื่น ๆ", values: [0, 0, 0, 0, 0] },
        { item: "รวม", values: [0, 0, 0, 0, 0] },
        { item: "จำหน่ายในประเทศ", values: [0, 0, 0, 0, 0] },
        { item: "จำหน่ายต่างประเทศ", values: [0, 0, 0, 0, 0] },
        { item: "ใช้ในโรงอุตสาหกรรม", values: [0, 0, 0, 0, 0] },
        { item: "คลังลินค้าทัณฑ์บน", values: [0, 0, 0, 0, 0] },
        { item: "เสียหาย", values: [0, 0, 0, 0, 0] },
        { item: "คงเหลือยกไป", values: [0, 0, 0, 0, 0] },
        { item: "อื่น ๆ", values: [0, 0, 0, 0, 0] },        
    ]
};
