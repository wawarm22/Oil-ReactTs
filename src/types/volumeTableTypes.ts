export interface VolumeCompareItem {
    date: number;
    baseOil: number;
    ethanol: number;
    additive: number;
    totalVolume: number;
    productionVolume: number;
    taxVolume: number;
    compareWithProduction?: string;
    compareWithTax?: string;
}

export interface VolumeCompareData {
    headers: string[];
    items: VolumeCompareItem[];
}

export const volumeCompareData: VolumeCompareData = {
    headers: [
        "วันที่",
        "น้ำมันพื้นฐาน",
        "เอทานอล",
        "สารเติมแต่ง (ใส่ชื่อสารเติมแต่งที่ใช้ผลิต)",
        "ปริมาณรวม (ลิตร) (1+2+3)",
        "ปริมาณการผลิตและจำหน่าย (ภส.07-02)",
        "ปริมาณการชำระภาษี (ภส.03-07)",
        "เปรียบเทียบผลต่าง ภส.07-01 กับ ภส.07-02 (4-5)",
        "เปรียบเทียบผลต่าง ภส.07-01 กับ ภส.03-07 (5-6)"
    ],
    items: [
        { date: 1, baseOil: 186088, ethanol: 18864, additive: 90, totalVolume: 205042, productionVolume: 205042, taxVolume: 205042, compareWithProduction: "-", compareWithTax: "-" },
        { date: 2, baseOil: 159750, ethanol: 16194, additive: 77, totalVolume: 176021, productionVolume: 176021, taxVolume: 176021, compareWithProduction: "-", compareWithTax: "-" },
        { date: 3, baseOil: 275865, ethanol: 27965, additive: 134, totalVolume: 303964, productionVolume: 303964, taxVolume: 303964, compareWithProduction: "-", compareWithTax: "-" },
        { date: 4, baseOil: 175168, ethanol: 17757, additive: 85, totalVolume: 193010, productionVolume: 193010, taxVolume: 193010, compareWithProduction: "-", compareWithTax: "-" },
        { date: 5, baseOil: 101570, ethanol: 10297, additive: 49, totalVolume: 111916, productionVolume: 111916, taxVolume: 111916, compareWithProduction: "-", compareWithTax: "-" },
    ]
};

