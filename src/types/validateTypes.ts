import { Material, Product } from "../utils/function/checklist/attachment0704";
import { PreparedData } from "./preparedTypes";

export type OCRFieldProperty = {
    value: string;
};

export type OCRFieldRow = {
    properties: {
        [column: string]: OCRFieldProperty;
    };
};

export type OCRValidationPayload = {
    docType: string;
    fields: OCRFieldRow[];
};

export type ValidationCompare = {
    docType: string;
    company: string;
    factories: string;
    documentGroup: string;
    fields: Array<{
        data?: Record<string, { value: string }>;
        detail_table?: Record<string, { value: string }>[];
    }>;
};


// export type ValidationCompare = {
//     docType: string;
//     company: string;
//     factories: string;
//     documentGroup: string;
//     fields: FieldCompare[];
// };

export type ValidateSubmissionPayload = {
    docType: string;
    company: string | null;
    factories: string | null;
    documentGroup: string;
    fields: {
        company_name: string;
        branch_no: string;
        tax_date: string;
        amount: string;
        reference_no: string;
    };
};

export type Validate0704Payload = {
    docType: string;
    documentGroup: string;
    fields: {
        form_type: string;
        request_number: string | null;
        received_at: string;
        form_officer_name: string;
        company_name: string;
        excise_id: string;
        date: string;
        materials: Material[];
        products: Product[];
    };
};

export type ValidationEntry = {
    field: string;
    value: number | string;
    expected: number | string;
    passed: boolean;
    product: string;
    type: string;
};

export type ValidationGroup = {
    product: string;
    validations: ValidationEntry[];
};

export type ValidationResponse = {
    data: ValidationGroup[];
    message: string;
    status: boolean;
};

export type Oil0704Material = {
    material_name: string;
    open: number | null;
    getted: number | null;
    total: number | null;
    produce: number | null;
    produce_other: number | null;
    defected: number | null;
    etc: number | null;
    loss_gain: number | null;
    forward: number | null;
}

export type Oil0704Product = {
    product_name: string;
    open: number | null;
    produced: number | null;
    bonded_return: number | null;
    etc_getted: number | null;
    total: number | null;
    domestic_sales: number | null;
    overseas_sales: number | null;
    used_in_industrial_plans: number | null;
    bonded: number | null;
    defected: number | null;
    forward: number | null;
    etc_used: number | null;
}

export type Oil0704Fields = {
    form_type: string;
    request_number: string | null;
    received_at: string;
    form_officer_name: string;
    company_name: string;
    excise_id: string;
    date: string;
    materials: Oil0704Material[];
    products: Oil0704Product[];
}

export type ValidateOil0704Payload = {
    docType: string;
    documentGroup: string;
    fields: Oil0704Fields;
}

export type ValidateOil0307Payload = {
    docType: string;
    company: string;
    factories: string | null;
    documentGroup: string;
    fields: Array<{
        properties: {
            [key: string]: {
                value: string;
            };
        };
    }>;
}

export type ValidateProduct = {
    index: number;
    product_name: string;
    product_id: number;
    quantity: number;
    tax_by_value_baht: number;
    tax_by_value_satang: number;
    tax_by_volumn_baht: number;
    tax_by_volumn_satang: number;
    discount_baht: number;
    discount_satang: number;
}

export type Validate0503Page1Payload = {
    docType: string;
    documentGroup: string;
    fields: {
        form_name: string;
        ref_no: string;
        request_no: string;
        request_date: string;
        request_officer: string;
        company_name: string;
        factory_name: string;
        excise_no: string;
        address_no: string;
        village_no: string;
        soi: string;
        street: string;
        sub_district: string;
        district: string;
        province: string;
        zipcode: string;
        tel_no: string;
        form_0503a_ref: string;
        form_0503b_ref: string;
        products: ValidateProduct[];
        total_tax: number;
    };
}

export type Validate0503Page2Payload = {
    docType: string;
    documentGroup: string;
    fields: {
        ref_no: string;
        excise_tax: number;
        health_fund: number;
        radio_fund: number;
        sport_fund: number;
        elder_fund: number;
        interior_tax: number;
        total_tax: number;
    }
}

export type ValidateOutturnFields = {
    date: string;
    product: string;
    quality: string;
    quantity: number;
}

export type ValidateOutturnPayload = {
    docType: string;
    company: string;
    factories: string | null;
    documentGroup: string;
    // materialType: string;     
    fields: ValidateOutturnFields;
}

export type MaterialDetail = {
    material_name: string;
    material_id: number;
    quantity: number;
}

export type TaxDetailRow = {
    date: string;
    materials: MaterialDetail[];
    total: number;
    tax_rate: number;
    tax_discount_rate: number;
    raw_tax: number;
    discount_105: number;
    total_tax: {
        paid: number;
        retrived: number;
    };
}

export type TaxSummary = {
    raw_tax: number;
    discount_105: number;
    total_tax: {
        paid: number;
        retrived: number;
    };
}

export type PreparedTaxData = {
    header: string;
    from_date: string;
    to_date: string;
    product_name: string;
    product_id: number;
    details: TaxDetailRow[];
    taxes: {
        excise_tax: TaxSummary;
        interior_tax: TaxSummary;
        total_tax: TaxSummary;
    };
}

export type validateAttachment0307Payload = {
    docType: string;
    company: string;
    factories: string;
    documentGroup: string;
    fields: PreparedTaxData;
}

export type validateReceitpPaymentPayload = {
    docType: string;
    documentGroup: string;
    fields: PreparedData;
}

export type OilCompareFieldValidation = {
    value: string;
    expected: string;
    passed: boolean;
};

export type OilCompareRowValidation = {
    product: string;
    field: string;
    value: number | string;
    expected: string | number;
    passed: boolean;
    status?: "passed" | "failed" | "warning";
    type: string;
    calculated?: number;
    normalized?: number;
    tolerance?: string;
};

export type OilCompareProductValidation = {
    product: string;
    validations: OilCompareRowValidation[];
};

export type ValidateOilCompareResponse = {
    status: boolean;
    message: string;
    data: (
        | {
            company: OilCompareFieldValidation;
            warehouse: OilCompareFieldValidation;
        }
        | OilCompareProductValidation
    )[];
};

export type Oil0702Property = {
    label?: string;
    value: string;
};

export type Oil0702Properties = {
    [key: string]: Oil0702Property;
};

export type Oil0702Field = {
    properties: Oil0702Properties;
};

export type ValidateOil0702Data = {
    docType: string;
    documentGroup: string;
    company: string;
    factories: string;
    fields: Oil0702Field[];
};

export type OcrReceiptExciseItem = {
    description: string;
    amount: number;
};

export type OcrReceiptExciseFields = {
    receipt_no: string;
    doc_no: string;
    submit_date: string;
    submit_time: string;
    office: string;
    period: string;
    received_from: string;
    operator: string;
    tax_id: string;
    excise_id: string;
    items: OcrReceiptExciseItem[];
    total_amount: number;
};

export type OcrReceiptExciseData = {
    docType: string;
    documentGroup: string;
    fields: OcrReceiptExciseFields;
};

export type OcrReceiptExciseResponse = {
    status: boolean;
    message: string;
    data: OcrReceiptExciseData;
};

export interface TaxInvoiceItem {
    itemNo: number;
    description: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    amount: number;
    note: string;
}

export interface OcrTaxInvoiceData {
    docType: string;
    documentGroup: string;
    fields: {
        invoiceBranch: string;
        customerInfo: string;
        taxId: string;
        shipTo: string;
        documentNo: string;
        date: string;
        paymentTerm: string;
        dueDate: string;
        poNo: string;
        incoTerm: string;
        items: TaxInvoiceItem[];
        subTotal: number;
        vat7: number;
        totalAmount: number;
        inWords: string;
        internalRef: string;
        receiptBy: string;
        receivedDate: string;
    };
}

export interface InvoiceTaxItem {
    no: string;
    product_code: string;
    product_name: string;
    quantity: number;
    unit: string;
    unit_price: number;
    amount: number;
    quantity_received: number;
    api: string;
}

export interface InvoiceTaxFields {
    invoice_no: string;
    purchase_order_no: string;
    delivery_no: string;
    business_place: string;
    plant: string;
    shipment_date: string;
    customer_code: string;
    customer_name: string;
    customer_address: string;
    delivery_place: string;
    excise_no: string;
    due_date: string;
    incoterms: string;
    bill_place: string;
    payment_terms: string;
    contract_no: string;
    vehicle: string;
    vehicle_no: string;
    seal_no: string;
    items: InvoiceTaxItem[];
    subtotal: number;
    vat: number;
    total_vat: number;
    fx_difference: number;
    total_amount: number;
    total_amount_text: string;
    vat_rate: number;
    fx_rate: number;
    check_time: string;
    check_date: string;
    confirm_text: string;
    confirm_date: string;
    note: string;
    paper_no: string;
}

export interface OcrInvoiceTaxData {
    docType: string;
    documentGroup: string;
    fields: InvoiceTaxFields;
}

export type InvoiceThappline = {
    docType: string;
    documentGroup: string;
    fields: {
        product_name: string;
        doc_no: string;
        customer_tank_no: string;
        batch_no: string;
        depot: string;
        date: string;              
        time: string;              
        details: ThapplineDetail[];
        total_ptt_tank_receive_86f: number;
        sump: number;
        thappline_line_content: number;
        customer_line: number;
        extra_vol1: number;
        extra_vol2: number;
        b100_e100_volume: number;
        net_received_volume: number;
        note: string;
        book_on: string;
    };
};

export type ThapplineDetail = {
    description: string;
    before: string;
    after: string;
};

// ชื่อ type หลัก
export type Prepared0701 = {
    docType: string;
    documentGroup: string;
    transport: string;
    fields: Prepared0701Fields;
};

export type Save0701 = {
    month: string,
    from_date: string,
    to_date: string,
    periot: string,
    factory_id: number,
    company_id: number,
    data: Prepared0701
};

// โครงสร้าง fields
export type Prepared0701Fields = {
    form_type: string;
    material_type: string;
    material_id: number;
    unit: string;
    physical_open: number;
    report_open: number;
    reports: Prepared0701Report[];
    total: Prepared0701Total;
};

// แต่ละ report ใน fields.reports
export type Prepared0701Report = {
    date: string;
    main_product: string;
    evidence_number: number;
    outturn: number;
    bl: number;
    discount: number;
    other_product: number;
    other_loss: number;
    tax_rate: number;
    broken: number;
    total: number;
    remains_physical: number;
    remains_report: number;
    diff: number;
    products: Prepared0701Product[];
};

// สินค้าในแต่ละ report
export type Prepared0701Product = {
    product_name: string;
    product_id: number;
    quantity: number;
};

// total summary ใน fields
export type Prepared0701Total = {
    bl?: number;
    outturn?: number;
    for_deduction?: number;
    use?: number;
    overall?: number;
};










