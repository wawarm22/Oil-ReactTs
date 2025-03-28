export interface VolumeCompareRow {
    date: number;
    baseOil: number;
    ethanol: number;
    additive: number;
    total_07_01: number;
    total_07_02: number;
    total_03_07: number;
}

export interface VolumeCompareData {
    title: string;
    headers: string[][];
    rows: VolumeCompareRow[];
}

export const volumeCompareData: VolumeCompareData = {
    title: "ปริมาณการจ่ายวัตถุดิบ ภส. 07-01",
    headers: [
        ["วันที่", "ปริมาณการจ่ายวัตถุดิบ ภส. 07-01", "", "", "", "ภส.07-02", "ภส.03-07", "ผลต่าง"],
        ["", "น้ำมันพื้นฐาน", "เอทานอล", "สารเติมแต่ง", "ปริมาณรวม(ลิตร)", "ปริมาณรวม(ลิตร)", "ปริมาณรวม(ลิตร)", ""]
    ],
    rows: [
        { date: 1, baseOil: 186088, ethanol: 18864, additive: 90, total_07_01: 205042, total_07_02: 205042, total_03_07: 205042 },
        { date: 2, baseOil: 159750, ethanol: 16194, additive: 77, total_07_01: 176021, total_07_02: 176021, total_03_07: 176021 },
        { date: 3, baseOil: 275865, ethanol: 27965, additive: 134, total_07_01: 303964, total_07_02: 303964, total_03_07: 303964 },
        { date: 4, baseOil: 175168, ethanol: 17757, additive: 85, total_07_01: 193010, total_07_02: 193010, total_03_07: 193010 },
    ],
};
