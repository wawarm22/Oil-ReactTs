// สร้าง ApiResponse type สำหรับส่วนที่ใช้ซ้ำ
export type ApiResponse = {
    code: number;
    message: string;
    status: boolean;
};

export type Province = {
    Id: number;
    PvCode: string;
    NameEn: string | null;
    NameTh: string;
    IsActive: boolean;
    CreatedDate: string; 
    CreatedBy: number;
    UpdatedDate: string; 
    UpdatedBy: number;
};

export type ProvinceResponse = ApiResponse & {
    data: Province[];
};

export type District = {
    Id: number;
    PvCode: string;
    DistCode: string;
    NameEn: string | null;
    NameTh: string;
    IsActive: boolean;
    CreatedDate: string;
    CreatedBy: number;
    UpdatedDate: string;
    UpdatedBy: number;
};

export type DistrictResponse = ApiResponse & {
    data: District[];
};

export type SubDistrict = {
    Id: number;
    PvCode: string;
    DistCode: string;
    SubdistCode: string;
    NameEn: string | null;
    NameTh: string;
    PostCode: string;
    IsActive: boolean;
    CreatedDate: string; 
    CreatedBy: number;
    UpdatedDate: string; 
    UpdatedBy: number;
};

export type SubDistrictResponse = ApiResponse & {
    data: SubDistrict[];
};
