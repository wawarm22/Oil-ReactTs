export type OcrFieldsBase = {
    pageCount: string;
    pageNumber: string;
    documentGroup: string;
};

export type OcrTaxDocument = OcrFieldsBase & {
    type: "tax";
    amount: string;
    amount_in_word: string;
    attach_form: string;
    branch_no: string;
    company_name: string;
    date: string;
    name: string;
    position: string;
    tax_date: string;
    tax_id: string;
};

export type OcrDetailTableDocument = OcrFieldsBase & {
    type: "table";
    header: string;
    detail_table: Record<string, any>[];
};

export type OcrGroupedProductDocument = OcrFieldsBase & {
    type: "grouped_product";
    detail_table: Record<string, any>[];
};

export type OcrOilProductDocument = OcrFieldsBase & {
    type: "product_document";
    address_no?: string;
    attach_1_no?: string;
    attach_2_no?: string;
    company_name?: string;
    district?: string;
    documentGroup: string;
    excise_id?: string;
    form_type?: string;
    name?: string;
    pageCount?: string;
    pageNumber?: string;
    phone_number?: string;
    postcode?: string;
    province?: string;
    request_date?: string;
    request_name?: string;
    request_signature?: string;
    road?: string;
    soi?: string;
    sub_district?: string;
    detail_table: Record<string, any>[];
};

export type OcrStockOilDocument = OcrFieldsBase & {
    type: "stock_oil";
    form_type?: string;
    oil_type: string;
    oil_unit?: string;
    branch?: string;
    detail_table: {
        rowCount: number;
        columnCount: number;
        rows: Array<Record<string, string>>;
    }[];
};

export type OcrDailyProductionDocument = OcrFieldsBase & {
    type: "daily_production";
    documentGroup: string;
    form_header: string;
    form_type: string;
    pageCount: string;
    pageNumber: string;
    product_cate: string;
    product_type: string;
    product_unit: string;
    detail_table: {
        kind: string;
        properties: Array<Record<string, any>>;
        confidence: number;
    }[];
};

export type OcrTaxForm0307Document = {
    type: "tax_form_0307";
    reference_no: string;
    form_type: string;
    excise_name: string;
    company_name: string;
    excise_no: string;
    email?: string | null;
    address_no: string;
    moo: string;
    soi: string;
    sub_district: string;
    district: string;
    province: string;
    postcode: string;
    phone_number?: string | null;
    tax_type_1_check: string;
    tax_type_2_check: string;
    tax_type_3_check: string;
    tax_type_4_check: string;
    tax_type_date: string;
    tax_sum_1: string;
    tax_sum_2: string;
    road?: string | null; 
    refund_1: string;
    refund_2: string;
    reciept_no?: string | null;
    reciept_date?: string | null;
    reciept_officer?: string | null;
    exp_refund_1?: string | null; 
    exp_refund_2: string;
    fine_1?: string | null;
    fine_2?: string | null;
    extra_per_date: string;
    extra_1?: string | null;
    extra_2?: string | null;
    sum_1_1: string;
    sum_1_2: string;
    deduct_2: string;
    sum_2_1: string;
    sum_2_2: string;
    sum_tax_1?: string | null;
    sum_tax_2?: string | null;
    sum_all_txt: string;
    officer_name: string;
    officer_position: string;
    other_person?: string | null; 
    confirm_date: string;
    detail_table: {
        kind: string;        
        confidence: number;
        properties: Array<Record<string, any>>;
    }[];
    pageNumber: string;
    pageCount: string;
    documentGroup: string;
};

export type OcrFields =
    | OcrTaxDocument
    | OcrDetailTableDocument
    | OcrGroupedProductDocument
    | OcrOilProductDocument
    | OcrStockOilDocument
    | OcrDailyProductionDocument
    | OcrTaxForm0307Document
    | (OcrFieldsBase & Record<string, any>); 
