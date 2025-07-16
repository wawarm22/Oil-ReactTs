import { Material, Product } from "../utils/function/checklist/attachment0704";
import { OcrReceiptPaymentPreparedData, Prepared0704, PreparedData } from "./preparedTypes";

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

export type TaxInvoiceItem = {
    itemNo: number;
    description: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    amount: number;
    note: string;
}

export type OcrTaxInvoiceData = {
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

export type InvoiceTaxItem = {
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

export type InvoiceTaxFields = {
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

export type OcrInvoiceTaxData = {
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

export type Save0701 = {
    month: string,
    from_date: string,
    to_date: string,
    periot: string,
    factory_slug: string,
    company_id: number,
    data: Prepared0701
};

export type Prepared0701 = {
    docType: string;
    documentGroup: string;
    transport: string;
    fields: Prepared0701Fields;
};

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

export type Prepared0701Product = {
    product_name: string;
    product_id: number;
    quantity: number;
};

export type Prepared0701Total = {
    bl?: number;
    outturn?: number;
    for_deduction?: number;
    use?: number;
    overall?: number;
};

export type Prepared0307Product = {
    index: number;
    product_type: string;
    product_name: string;
    product_id: number;
    quantity: number;
    model_info: number;
    size: string;
    retail_price: number;
    excise_tax_by_value: number;
    tax_rate: number;
    tax_per_total_by_value: number;
    tax_per_total_by_vol: number;
    excise_tax_baht: number;
    excise_tax_satang: number;
    interior_tax_baht: number;
    interior_tax_satang: number;
};

export type Prepared0307CheckTax = {
    check: string;
    description: string;
};

export type Prepared0307Taxes = {
    base: {
        excise: number;
        interior: number;
    };
    discount: {
        excise: number;
        interior: number;
    };
    remains: {
        excise: number;
        interior: number;
    };
    fine: {
        excise: number;
        interior: number;
    };
    additional_percentage: {
        description: string;
        excise: number;
        interior: number;
    };
    total: {
        excise: number;
        interior: number;
    };
    discount_at: {
        description: string;
        excise: number;
        interior: number;
    };
    balance: {
        excise: number;
        interior: number;
    };
    should_paid: number;
    should_paid_txt: string;
};

export type Prepared0307Payload = {
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
        email: string;
        address_no: string;
        village_no: string;
        soi: string;
        street: string;
        sub_district: string;
        district: string;
        province: string;
        zipcode: string;
        tel_no: string;
        other_person: string;
        products: Prepared0307Product[];
        tax_for: Prepared0307CheckTax;
        taxes: Prepared0307Taxes;
    };
};

export type MaterialPerUnit0129 = {
    materialType: string;
    materialModel: string;
    materialQuantity: string;
    note: string;
};

export type Product0129 = {
    itemNo: number;
    productType: string;
    productName: string;
    productModel: string;
    materialsPerUnit: MaterialPerUnit0129[];
};

export type Oil0129Fields = {
    formName: string;
    forOfficer: boolean;
    registerNo: string;
    registerDate: string;
    receiverOfficer: string;
    companyName: string;
    depotName: string;
    exciseNo: string;
    addressNo: string;
    alley: string;
    road: string;
    subdistrict: string;
    district: string;
    province: string;
    zipcode: string;
    phone: string;
    products: Product0129[];
    productionMethodDocuments: number;
    otherDocuments: number;
    operatorSignature: string;
    operatorName: string;
    signatureDate: string;
};

export type PrepaedTaxForm0129Document = {
    docType: string;
    documentGroup: string;
    fields: Oil0129Fields;
};

export type Oil0702ReportRow = {
    date: string;
    transaction_type: string;
    evidence_number: string;
    received_produced: number;
    received_returned: number;
    received_others: number;
    total_received: number;
    sold_domestic: number;
    sold_export: number;
    used_factory: number;
    warehouse_bonded: number;
    damaged: number;
    others_dispatched: number;
    total_dispatched: number;
    remaining_balance: number;
    remarks: string;
};

export type Oil0702MonthlyTotal = {
    total_received_produced: number;
    total_received_returned: number;
    total_received_others: number;
    total_received_all: number;
    total_sold_domestic: number;
    total_sold_export: number;
    total_used_factory: number;
    total_warehouse_bonded: number;
    total_damaged: number;
    total_others_dispatched: number;
    total_dispatched_all: number;
    final_balance: number;
};

export type Oil0702YearToDate = {
    ytd_received_all: number;
    ytd_dispatched_all: number;
    ytd_balance: number;
};

export type Oil0702Fields = {
    form_type: string;
    form_header: string;
    product_category: string;
    product_id: number;
    product_type: string;
    product_unit: string;
    product_brand: string;
    product_size: string;
    branch: string;
    balance_carried: number;
    reports: Oil0702ReportRow[];
    monthly_total: Oil0702MonthlyTotal;
    year_to_date: Oil0702YearToDate;
};

export type PreparedOil0702 = {
    docType: string;
    documentGroup: string;
    transport: string;
    fields: Oil0702Fields;
};

export type Save0702 = {
    month: string,
    from_date: string,
    to_date: string,
    periot: string,
    factory_slug: string,
    company_id: number,
    data: PreparedOil0702
};


export type Save0503Page1 = {
    month: string,
    from_date: string,
    to_date: string,
    periot: string,
    factory_slug: string,
    company_id: number,
    data: Validate0503Page1Payload
};

export type Save0307 = {
    month: string,
    from_date: string,
    to_date: string,
    periot: string,
    factory_slug: string,
    company_id: number,
    data: Prepared0307Payload
};

export type SaveReceitpPayment = {
    month: string,
    from_date: string,
    to_date: string,
    periot: string,
    factory_slug: string,
    company_id: number,
    data: OcrReceiptPaymentPreparedData
};

export type SaveData0704 = {
    month: string,
    from_date: string,
    to_date: string,
    periot: string,
    factory_slug: string,
    company_id: number,
    data: Prepared0704
};

export type OilCompareMaterial = {
    name: string;
    quantity: number;
    perUnit: number;
    ratio: string;
};

export type OilCompareField = {
    company: string;
    factory: string;
    date: string;
    productName: string;
    materials: OilCompareMaterial[];
    totalQuantity: number;
    totalPerUnit: number;
    totalRatio: string;
    remark: string;
};

export type PreparedOilCompare = {
    docType: string;
    documentGroup: string;
    fields: OilCompareField[];
};

export type Materials = Record<string, number>;

export type Form0701 = {
  materials: Materials;
  totalVolume: number;
}
export type Form0702 = {
  producedAndSoldVolume: number;
}
export type Form0307 = {
  taxPaidVolume: number;
}

export type OilCompareItem = {
  date: string;
  form0701: Form0701;
  form0702: Form0702;
  form0307: Form0307;
  difference: number;
}

export type OilCompareSummary = {
  totalMaterials: Materials;
  total0701Volume: number;
  total0702Volume: number;
  total0307Volume: number;
  totalDifference: number;
}

export type OilCompareFields = {
  company: string;
  factory: string;
  oilOutDate: string;
  productName: string;
  items: OilCompareItem[];
  summary: OilCompareSummary;
}

export type OilCompare0701020307Result = {
  docType: string;
  documentGroup: string;
  fields: OilCompareFields;
}

















