// volumeTableTypes.ts

export interface VolumeCompareItem {
    date: string;
    materials: { [name: string]: number }; // <== dynamic!
    totalVolume: number;
    productionVolume: number;
    taxVolume: number;
    compareWithProduction?: string;
    compareWithTax?: string;
}

export interface VolumeCompareData {
    headers: string[];
    items: VolumeCompareItem[];
    materialNames: string[]; // <== เพิ่มเพื่อช่วย render col
}


