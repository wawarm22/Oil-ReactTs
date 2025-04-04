export type Factory = {
    id: number;
    company_id: number;
    excise_id: string;
    name: string;
}

export type Company = {
    id: number;
    excise_id: string;
    name: string;
    factories: Factory[];
}

export interface CompanyById {
    id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    excise_id: string;
    name: string;
    name_th: string | null;
    name_en: string | null;
    factories: Factory[];
}

export type ApiResponse<T = unknown> = {
    message: string;
    status: boolean;
    data: T;
};
