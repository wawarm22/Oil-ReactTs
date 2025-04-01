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

// types/locationTypes.ts
export interface SubDistrictNew {
    id: number;
    name: string;
    zip_code: string;
    district_id: number;
}

export interface DistrictNew {
    id: number;
    name: string;
    province_id: number;
    sub_districts: SubDistrictNew[];
}

export interface ProvinceNew {
    id: number;
    name: string;
    districts: DistrictNew[];
}

export interface LocationResponse {
    status: boolean;
    message: string;
    data: ProvinceNew[];
}



