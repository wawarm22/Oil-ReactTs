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
    company: string;
    date: string;
    depot: string;
    oil: string;
    pageCount: string;
    pageNumber: string;
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
        confidence: number;
        kind: string;
        properties: Array<Record<string, string>>;
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
    product_brand?: string;
    product_size?: string;
    oil_type: string;
    oil_unit: string;
    detail_table: {
        kind: string;
        properties: Array<Record<string, any>>;
        confidence: number;
    }[];
};

export type OcrTaxForm0307Document = OcrFieldsBase & {
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

export type OcrRefineryTaxInvoiceDocument = OcrFieldsBase & {
    type: "refinery_tax_invoice";
    header_tax_id: string;
    issued_at: string;
    customer_name: string;
    customer_address: string;
    tax_id: string;
    branch: string;
    ship_to: string;
    doc_no: string;
    date: string;
    payment_terms: string;
    due_date: string;
    po_no: string;
    inco_term: string;
    price_in_word: string;
    sales_order_no: string;
    auth_by_name: string;
    auth_by_signature: string;
    detail_table: {
        kind: string;
        confidence: number;
        properties: Array<Record<string, any>>;
    }[];
};

export type OcrImportEntry0409Document = OcrFieldsBase & {
    type: "import_entry_0409";
    agent_of: string;
    bank_account_no: string;
    bank_account_type: string;
    bl_no: string;
    branch_no: string;
    cargo_code: string;
    cargo_country: string;
    change_rate: string;
    check_at: string;
    check_code: string;
    clearance_crad: string;
    company_address: string;
    company_name_en: string;
    company_name_th: string;
    customs_bank_code: string;
    detail_table: Array<{
        rowCount: number;
        columnCount: number;
        rows: Array<Record<string, string>>;
    }>;
    electronics_sign: string;
    form_no: string;
    form_type: string;
    import_at: string;
    import_code: string;
    import_date: string;
    observe: string;
    officer_name: string;
    origin_code: string;
    origin_country: string;
    package_id: string;
    package_no: string;
    package_type: string;
    product_account: string;
    submission_date: string;
    submission_time: string;
    sum_package: string;
    sum_package_word: string;
    tax_id: string;
    tax_number: string;
    unit_package: string;
    vehicle_name: string;
    vehicle_type: string;
    write_address: string;
    write_date: string;
    write_time: string;
};

export type OcrOutturnStatementDocument = OcrFieldsBase & {
    type: "outturn_statement";
    approve_signature: string;
    calculated_signature: string;
    date: string;
    detail_table: {
        kind: string;
        properties: Record<string, any>;
        confidence?: number;
    }[];
    detail_table_1: {
        kind: string;
        properties: Record<string, any>;
        confidence?: number;
    }[];
    detail_table_2: {
        kind: string;
        properties: Record<string, any>;
        confidence?: number;
    }[];
    dip_number: string;
    page: string;
    pageCount: string;
    pageNumber: string;
    product: string;
    surveyor_signature: string;
};

export type OcrDeliveryInvoiceDocument = OcrFieldsBase & {
    type: "delivery_invoice";
    bill_address?: string;
    business_place?: string;
    contractor?: string;
    customer_address?: string;
    customer_code?: string;
    customer_name?: string;
    delivery_date?: string;
    delivery_no?: string;
    invoice_no?: string;
    issuer_date?: string;
    issuer_signature?: string;
    loading_pot?: string;
    pageCount?: string;
    pageNumber?: string;
    paper_no?: string;
    purchase_date?: string;
    purchase_no?: string;
    sales_order_no?: string;
    send_address?: string;
    shipment_date?: string;
    tax_invoice_no?: string;
    time_out?: string;
    verify_signature?: string;
    verify_date?: string;
    created_by?: string;
    term_of_payment?: string;
    sent_address?: string;
    contact_no?: string;
    incoterms?: string;
    due_date?: string;
    loading_pot_no?: string;
    total_amount_word?: string;
    remark?: string;
    exchange_rate?: string;
    vat_rate?: string;
    detail_table?: {
        kind: string;
        confidence: number;
        properties: Array<Record<string, any>>;
    }[];
    "detail-table-1": {
        kind: string;
        confidence: number;
        properties: Array<Record<string, any>>;
    }[];
    amount_n_tax?: {
        kind: string;
        confidence: number;
        properties: Array<Record<string, any>>;
    }[];
    shipment_detail?: {
        kind: string;
        confidence: number;
        properties: Array<Record<string, any>>;
    }[];
    test_temp_table?: {
        kind: string;
        confidence: number;
        properties: Array<Record<string, any>>;
    }[];
    documentGroup?: string;
    fileKey?: string;
};

export type OcrTaxForm0503Document = OcrFieldsBase & {
    type: "tax_form_0503";
    reference_no: string;
    form_type: string;
    excise_name: string;
    company_name: string;
    excise_no: string;
    address_no: string;
    soi: string;
    road: string;
    sub_district: string;
    district: string;
    docType: string;
    province: string;
    postcode: string;
    date: string;
    approve_1_check: string;
    approve_2_check: string;
    approve_signature: string;
    signature: string;
    validate_signature: string;
    name: string;
    detail_table: {
        kind: string;
        properties: Record<string, any>;
    }[];
    officer_date?: string;
    officer_name?: string;
    pageNumber: string;
    pageCount: string;
    phone_number: string;
    documentGroup: string;
};

export type OcrTaxForm0503Page2Document = OcrFieldsBase & {
    type: "tax_form_0503_page2";
    approve_1_check: string;
    approve_2_check: string;
    approve_2: string;
    docType: string;
    documentGroup: string;
    fileKey: string;
    pageCount: string;
    pageNumber: string;
    reference_no: string;
    refund_check: string;
    refund_tax_1: string;
    refund_tax_2: string;
    refund_tax_3: string;
    refund_tax_4: string;
    refund_tax_5: string;
    refund_tax_6: string;
    refund_tax_sum: string;
    request_date: string;
    request_name: string;
    request_signature: string;
    officer_comment: string;
    officer_name: string;
    officer_signature: string;
    officer_date: string;
    validate_name: string;
    validate_signature: string;
    validate_date: string;
};

export type OcrComparison0503And0307Document = OcrFieldsBase & {
    type: "comparison_0503_0307";
    date: string;
    header: string;
    pageCount: string;
    pageNumber: string;
    documentGroup: string;
    detail_table: {
        kind: string;
        confidence?: number;
        properties: Record<string, any>;
    }[];
};

export type OcrTaxPaymentCertificateDocument = OcrFieldsBase & {
    type: "tax_payment_certificate";
    address: string;
    auth_signature?: string | null;
    branch_no?: string | null;
    due_date?: string | null;
    excise_id?: string | null;
    invoice_no?: string | null;
    registration_no?: string | null;
    tax_id?: string | null;
    detail_table: Array<{
        kind: string;
        confidence: number;
        properties: {
            name?: { kind: string; value?: string };
            destination?: { kind: string; value?: string };
            trip_no?: { kind: string; value?: string };
            volume_tax?: { kind: string; value?: string };
            liter_tax?: { kind: string; value?: string };
            value_tax?: { kind: string; value?: string };
            tanker?: { kind: string; value?: string };
            [key: string]: any;
        };
    }>;
    pageNumber: string;
    pageCount: string;
    documentGroup: string;
};

export type OcrOilPurchaseSummaryDocument = OcrFieldsBase & {
    type: "oil_purchase_summary";
    company_from: string;
    company_name: string;
    date: string;
    pageCount: string;
    pageNumber: string;
    documentGroup: string;
    detail_table: {
        kind: string;
        confidence: number;
        properties: Record<string, any>;
    }[];
};

export type OcrTaxForm0704Document = OcrFieldsBase & {
    type: "tax_form_0704";
    documentGroup: string;
    pageCount: string;
    pageNumber: string;
    detail_table: Array<{
        rowCount: number;
        columnCount: number;
        rows: Array<Record<string, string>>;
    }>;
};

export type OcrAdditiveApprovalCertificateDocument = OcrFieldsBase & {
    type: "additive_approval_certificate";
    documentGroup: string;
    pageCount: string;
    pageNumber: string;
    reference?: string;
    detail_table: {
        kind: string;
        confidence: number;
        properties: Record<string, any>;
    }[];
};

export type OcrCustomsReceiptDocument = OcrFieldsBase & {
    type: "customs_receipt";
    documentGroup: string;
    pageCount: string;
    pageNumber: string;
    receipt_type?: string;
    duty_payment?: string;
    shipping_slip?: string;
    company_name?: string;
    tax_id?: string;
    date?: string;
    amount_in_word?: string;
    name?: string;
    position?: string;
    office?: string;
    detail_table: {
        kind: string;
        confidence: number;
        properties: Record<string, any>;
    }[];
};

export type OcrDailyComparisonDocument = OcrFieldsBase & {
    type: "daily_comparison";
    documentGroup: string;
    pageNumber: string;
    pageCount: string;
    header?: string;
    date?: string;
    detail_table: {
        kind: string;
        confidence: number;
        properties: Record<string, any>;
    }[];
};

export type OcrTaxReceiptExciseDocument = OcrFieldsBase & {
    type: "tax_receipt_excise";
    header: string;
    receipt_no?: string;
    doc_no?: string;
    date?: string;
    submit_date?: string;
    submit_time?: string;
    excise_id?: string;
    tax_id?: string;
    received_from?: string;
    tycoon?: string;
    office?: string;
    condition_1?: string;
    amount_in_word?: string;
    name?: string;
    position?: string;
    signature?: string;
    detail_table: {
        kind: string;
        confidence: number;
        properties: Record<string, any>;
    }[];
    pageNumber: string;
    pageCount: string;
    documentGroup: string;
};

export type OcrAttachment0307Document = OcrFieldsBase & {
    type: "attachment_0307";
    documentGroup: string;
    header: string;
    date?: string;
    name?: string;
    position?: string;
    oil?: string;
    pageNumber: string;
    pageCount: string;
    detail_table: {
        kind: string;
        confidence: number;
        properties: Record<string, any>;
    }[];
};

export type OcrAttachment0704Document = OcrFieldsBase & {
    type: "attachment_0704";
    form_type?: string;
    form_no?: string;
    form_date?: string;
    form_officer_1?: string;
    form_officer_2?: string;
    form_officer_name?: string;
    company_name?: string;
    excise_id?: string;
    date?: string;
    remark?: string;
    detail_table: Array<{
        confidence: number;
        kind: string;
        properties: Record<string, { value: string }>;
    }>
    detail_table_1: Array<{
        confidence: number;
        kind: string;
        properties: Record<string, { value: string }>;
    }>
    detail_table_2: Array<{
        confidence: number;
        kind: string;
        properties: Record<string, { value: string }>;
    }>
};

export type OcrTaxForm0502Document = OcrFieldsBase & {
    type: "tax_form_0502";
    address: string;
    applicant_date: string;
    applicant_name: string;
    applicant_signature: string;
    approve_1_check: string;
    approve_2: string;
    approve_2_check: string;
    approve_date: string;
    approve_name: string;
    approve_signature: string;
    attach_2: string;
    company_name: string;
    date: string;
    detail_table: Array<{
        kind: string;
        properties: Record<string, { value?: string; }>;
    }>;
    district: string;
    documentGroup: string;
    electronics_id: string;
    excise_id: string;
    fileKey: string;
    form_id: string;
    form_type: string;
    name: string;
    officer_comment: string;
    officer_signature: string;
    pageCount: string;
    pageNumber: string;
    phone_number: string;
    postcode: string;
    province: string;
    road: string;
    soi?: string;
    sub_district: string;
    validate_date: string;
    validate_name: string;
};


export type OcrFields =
    | OcrTaxDocument
    | OcrDetailTableDocument
    | OcrGroupedProductDocument
    | OcrOilProductDocument
    | OcrStockOilDocument
    | OcrDailyProductionDocument
    | OcrTaxForm0307Document
    | OcrAttachment0307Document
    | OcrRefineryTaxInvoiceDocument
    | OcrImportEntry0409Document
    | OcrOutturnStatementDocument
    | OcrDeliveryInvoiceDocument
    | OcrTaxForm0503Document
    | OcrComparison0503And0307Document
    | OcrTaxPaymentCertificateDocument
    | OcrOilPurchaseSummaryDocument
    | OcrTaxForm0704Document
    | OcrAdditiveApprovalCertificateDocument
    | OcrCustomsReceiptDocument
    | OcrDailyComparisonDocument
    | OcrTaxReceiptExciseDocument
    | OcrAttachment0704Document
    | OcrTaxForm0502Document
    | OcrTaxForm0503Page2Document
    | (OcrFieldsBase & Record<string, any>); 
