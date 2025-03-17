export type Province = {
    id: number;
    name_th: string;
    name_en: string;
    geography_id: number;
};

export type District = {
    id: number;
    name_th: string;
    name_en: string;
    province_id: number;
};

export type SubDistrict = {
    id: number;
    zip_code: number;
    name_th: string;
    name_en: string;
    amphure_id: number;
};


