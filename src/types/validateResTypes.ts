export type ValidationField<T = any> = {
    value: T;
    expected: T;
    passed: boolean;
};

export type ValidationMaterial = {
    material_id: number;
    material_name: ValidationField<string>;
    quantity: ValidationField<number>;
};

export type ValidationDetail = {
    date: ValidationField<string>;
    materials: ValidationMaterial[];
    total: ValidationField<number>;
    tax_rate: ValidationField<number>;
    tax_discount_rate: ValidationField<number>;
    raw_tax: ValidationField<number>;
    discount_105: ValidationField<number>;
    total_tax: {
        paid: ValidationField<number>;
        retrived: ValidationField<number>;
    };
};

export type ValidationTaxBlock = {
    raw_tax: ValidationField<number>;
    discount_105: ValidationField<number>;
    total_tax: {
        paid: ValidationField<number>;
        retrived: ValidationField<number>;
    };
};

export type ValidationResult0307 = {
    header: ValidationField<string>;
    from_date: ValidationField<string>;
    to_date: ValidationField<string>;
    product_name: ValidationField<string>;
    details: ValidationDetail[];
    taxes: {
        excise_tax: ValidationTaxBlock;
        interior_tax: ValidationTaxBlock;
        total_tax: ValidationTaxBlock;
    };
};

export type FieldValidation<T = any> = {
    value: T;
    expected: T | string;
    passed: boolean;
};

export type ValidationHeader = {
    formTitle: FieldValidation<string>;
    productName: FieldValidation<string>;
    factories: FieldValidation<string>;
    period: FieldValidation<string>;
};

export type ValidationOpeningBalance = {
    receivedDate: FieldValidation<string>;
    sourceDepot: FieldValidation<string>;
    invoiceNo: FieldValidation<string>;
    quantity: FieldValidation<number>;
    invoiceBalance: FieldValidation<number>;
    totalBalance: FieldValidation<number>;
};

export type ValidationReceipt = ValidationOpeningBalance;

export type ValidationDisbursement = {
    paidDate: FieldValidation<string>;
    localSale: {
        quantity: FieldValidation<number>;
        invoiceNo: FieldValidation<string>;
    };
    transfer: {
        destinationDepot: FieldValidation<string>;
        quantity: FieldValidation<number>;
        invoiceNo: FieldValidation<string>;
    }[];
    invoiceBalance: FieldValidation<number>;
    totalBalance: FieldValidation<number>;
};

export type ValidationEndOfMonth = {
    tankMeasurement: FieldValidation<number>;
    lossGainQuantity: FieldValidation<number>;
    lossGainPercentage: FieldValidation<number>;
    carriedForwardBalance: FieldValidation<number>;
};

export type ValidationResultData = {
    header: ValidationHeader;
    openingBalance: ValidationOpeningBalance[];
    receipt: ValidationReceipt[];
    disbursement: ValidationDisbursement[];
    endOfMonth: ValidationEndOfMonth;
};

export type ValidateReceitpPaymentResult = {
    status: boolean;
    message: string;
    data: ValidationResultData;
};


export type Oil0702ValidationCell = {
    value?: string;
    expected?: string | number;
    passed: boolean;
    reason?: string;
};

export type Oil0702ValidationRow = {
    row: number;
    properties: {
        [label: string]: Oil0702ValidationCell;
    };
};

export type Oil0702ValidationResult = {
    status: boolean;
    message: string;
    data: Oil0702ValidationRow[];
};

export type ValidateFormularApprovCell = {
    value: string | number;
    expected: string | number | string[];
    passed: boolean;
};

export type ValidateFormularApprovMaterial = {
    name: ValidateFormularApprovCell;
    quantity: ValidateFormularApprovCell;
    unit: ValidateFormularApprovCell;
    remark: ValidateFormularApprovCell;
};

export type ValidateFormularApprovProduct = {
    name: ValidateFormularApprovCell;
    type: ValidateFormularApprovCell;
    unit: ValidateFormularApprovCell;
    materials: ValidateFormularApprovMaterial[];
};

export type ValidateFormularApprovItem = {
    no: ValidateFormularApprovCell;
    product: ValidateFormularApprovProduct;
    total: ValidateFormularApprovCell;
};

export type ValidateFormularApprovData = {
    items: ValidateFormularApprovItem[];
};

export type Validate0503Page1Cell = {
    value: string | number;
    expected: string | number;
    passed: boolean;
};

export type Validate0503Page1Product = {
    index: number;
    product_name: Validate0503Page1Cell;
    quantity: Validate0503Page1Cell;
    tax_by_value_baht: Validate0503Page1Cell;
    tax_by_value_satang: Validate0503Page1Cell;
    tax_by_volumn_baht: Validate0503Page1Cell;
    tax_by_volumn_satang: Validate0503Page1Cell;
    discount_baht: Validate0503Page1Cell;
    discount_satang: Validate0503Page1Cell;
};

export type Validate0503Page1Result = {
    form_name: Validate0503Page1Cell;
    ref_no: Validate0503Page1Cell;
    request_no: Validate0503Page1Cell;
    request_date: Validate0503Page1Cell;
    request_officer: Validate0503Page1Cell;
    company_name: Validate0503Page1Cell;
    factory_name: Validate0503Page1Cell;
    excise_no: Validate0503Page1Cell;
    address_no: Validate0503Page1Cell;
    village_no: Validate0503Page1Cell;
    soi: Validate0503Page1Cell;
    street: Validate0503Page1Cell;
    sub_district: Validate0503Page1Cell;
    district: Validate0503Page1Cell;
    province: Validate0503Page1Cell;
    zipcode: Validate0503Page1Cell;
    tel_no: Validate0503Page1Cell;
    form_0503a_ref: Validate0503Page1Cell;
    form_0503b_ref: Validate0503Page1Cell;
    products: Validate0503Page1Product[];
    total_tax: Validate0503Page1Cell;
};

export type Validate0503Page2Cell = {
    value: string | number;
    expected: string | number;
    passed: boolean;
};

export type Validate0503Page2Result = {
    ref_no: Validate0503Page2Cell;
    excise_tax: Validate0503Page2Cell;
    health_fund: Validate0503Page2Cell;
    radio_fund: Validate0503Page2Cell;
    sport_fund: Validate0503Page2Cell;
    elder_fund: Validate0503Page2Cell;
    interior_tax: Validate0503Page2Cell;
    total_tax: Validate0503Page2Cell;
};

export type Validate0502Field = {
    value: string | number | boolean;
    expected: string | number | boolean;
    passed: boolean;
};

export type Validate0502Material = {
    materialType: Validate0502Field;
    materialUnit: Validate0502Field;
    materialQuantity: Validate0502Field;
    note: Validate0502Field;
};

export type Validate0502Product = {
    productType: Validate0502Field;
    productName: Validate0502Field;
    productUnit: Validate0502Field;
    materialsPerUnit: Validate0502Material[];
};

export type Validate0502Result = {
    status: boolean;
    message: string;
    data: {
        formName: Validate0502Field;
        forOfficer: Validate0502Field;
        electronicRegisterNo: Validate0502Field;
        documentRegisterNo: Validate0502Field;
        registerDate: Validate0502Field;
        receiverOfficer: Validate0502Field;
        companyName: Validate0502Field;
        depotName: Validate0502Field;
        exciseNo: Validate0502Field;
        addressNo: Validate0502Field;
        alley: Validate0502Field;
        road: Validate0502Field;
        subdistrict: Validate0502Field;
        district: Validate0502Field;
        province: Validate0502Field;
        zipcode: Validate0502Field;
        phone1: Validate0502Field;
        phone2: Validate0502Field;
        products: Validate0502Product[];
    };
};

type ValidateField = {
    value: string | number;
    expected: string | number;
    passed: boolean;
};

type ValidateItem = {
    description: ValidateField;
    amount: ValidateField;
};

export type ValidateReceiptExciseResult = {
    receipt_no: ValidateField;
    doc_no: ValidateField;
    submit_date: ValidateField;
    submit_time: ValidateField;
    office: ValidateField;
    period: ValidateField;
    received_from: ValidateField;
    operator: ValidateField;
    tax_id: ValidateField;
    excise_id: ValidateField;
    items: ValidateItem[];
    total_amount: ValidateField;
};

export type ValidateTaxInvoiceItem = {
    itemNo: ValidateField;
    description: ValidateField;
    quantity: ValidateField;
    unit: ValidateField;
    unitPrice: ValidateField;
    amount: ValidateField;
    note: ValidateField;
};

export type ValidateTaxInvoiceResult = {
    invoiceBranch: ValidateField;
    customerInfo: ValidateField;
    taxId: ValidateField;
    shipTo: ValidateField;
    documentNo: ValidateField;
    date: ValidateField;
    paymentTerm: ValidateField;
    dueDate: ValidateField;
    poNo: ValidateField;
    incoTerm: ValidateField;
    items: ValidateTaxInvoiceItem[];
    subTotal: ValidateField;
    vat7: ValidateField;
    totalAmount: ValidateField;
    inWords: ValidateField;
    internalRef: ValidateField;
    receiptBy: ValidateField;
    receivedDate: ValidateField;
};

export type ValidateFieldTax<T = string | number> = {
    value?: T;
    expected: T;
    passed: boolean;
};

export type ValidateInvoiceTaxItem = {
    no: ValidateFieldTax<string>;
    product_code: ValidateFieldTax<string>;
    product_name: ValidateFieldTax<string>;
    quantity: ValidateFieldTax<number>;
    unit: ValidateFieldTax<string>;
    unit_price: ValidateFieldTax<number>;
    amount: ValidateFieldTax<number>;
    quantity_received: ValidateFieldTax<number>;
    api: ValidateFieldTax<string>;
};

export type ValidateInvoiceTaxResult = {
    tax_invoice_no: ValidateFieldTax<string>;
    invoice_no: ValidateFieldTax<string>;
    sales_order_no: ValidateFieldTax<string>;
    purchase_order_no: ValidateFieldTax<string>;
    delivery_no: ValidateFieldTax<string>;
    business_place: ValidateFieldTax<string>;
    created_by: ValidateFieldTax<string>;
    plant: ValidateFieldTax<string>;
    excise_no: ValidateFieldTax<string>;
    due_date: ValidateFieldTax<string>;
    incoterms: ValidateFieldTax<string>;
    contract_no: ValidateFieldTax<string>;
    shipment_date: ValidateFieldTax<string>;
    customer_code: ValidateFieldTax<string>;
    customer_name: ValidateFieldTax<string>;
    customer_address: ValidateFieldTax<string>;
    delivery_place: ValidateFieldTax<string>;
    bill_place: ValidateFieldTax<string>;
    payment_terms: ValidateFieldTax<string>;
    shipping_method: ValidateFieldTax<string>;
    vehicle: ValidateFieldTax<string>;
    vehicle_no: ValidateFieldTax<string>;
    driver_name: ValidateFieldTax<string>;
    seal_no: ValidateFieldTax<string>;
    trip_no: ValidateFieldTax<string>;
    transporter: ValidateFieldTax<string>;
    items: ValidateInvoiceTaxItem[];
    subtotal: ValidateFieldTax<number>;
    vat: ValidateFieldTax<number>;
    total_vat: ValidateFieldTax<number>;
    fx_difference: ValidateFieldTax<number>;
    total_amount: ValidateFieldTax<number>;
    total_amount_text: ValidateFieldTax<string>;
    vat_rate: ValidateFieldTax<number>;
    fx_rate: ValidateFieldTax<number>;
    check_time: ValidateFieldTax<string>;
    check_date: ValidateFieldTax<string>;
    confirm_text: ValidateFieldTax<string>;
    confirm_date: ValidateFieldTax<string>;
    note: ValidateFieldTax<string>;
    paper_no: ValidateFieldTax<string>;
};

export type ValidationResult<T = string> = {
    value: T;
    expected: T;
    passed: boolean;
};

export type ValidationDetailThappline = {
    description: ValidationResult<string>;
    before: ValidationResult<string>;
    after: ValidationResult<string>;
};

export type ValidateInvoiceThapplineData = {
    product_name: ValidationResult<string>;
    doc_no: ValidationResult<string>;
    customer_tank_no: ValidationResult<string>;
    batch_no: ValidationResult<string>;
    depot: ValidationResult<string>;
    date: ValidationResult<string>;
    time: ValidationResult<string>;
    details: ValidationDetailThappline[];
    total_ptt_tank_receive_86f: ValidationResult<number>;
    sump: ValidationResult<number>;
    thappline_line_content: ValidationResult<number>;
    customer_line: ValidationResult<number>;
    extra_vol1: ValidationResult<number>;
    extra_vol2: ValidationResult<number>;
    b100_e100_volume: ValidationResult<number>;
    net_received_volume: ValidationResult<number>;
    note: ValidationResult<string>;
    book_on: ValidationResult<string>;
};

export type Validate0701Cell<T = string | number> = {
    value: T;
    expected: T;
    passed: boolean;
};

export type Validate0701ProductCell = {
    product_id: number;
    product_name: Validate0701Cell<string>;
    quantity: Validate0701Cell<number>;
};

export type Validate0701ReportCell = {
    date: Validate0701Cell<string>;
    evidence_number: Validate0701Cell<number>;
    bl: Validate0701Cell<number>;
    outturn: Validate0701Cell<number>;
    discount: Validate0701Cell<number>;
    products: Validate0701ProductCell[];
    main_product: Validate0701Cell<string>;
    other_product: Validate0701Cell<number>;
    other_loss: Validate0701Cell<number>;
    tax_rate: Validate0701Cell<number>;
    broken: Validate0701Cell<number>;
    total: Validate0701Cell<number>;
    remains_physical: Validate0701Cell<number>;
    remains_report: Validate0701Cell<number>;
    diff: Validate0701Cell<number>;
};

export type Validate0701TotalCell = {
    bl: Validate0701Cell<number>;
    outturn: Validate0701Cell<number>;
    for_deduction: Validate0701Cell<number>;
    use?: Validate0701Cell<number>;
    overall?: Validate0701Cell<number>;
};

export type Validate0701Result = {
    form_type: Validate0701Cell<string>;
    material_type: Validate0701Cell<string>;
    material_id: Validate0701Cell<number>;
    unit: Validate0701Cell<string>;
    physical_open: Validate0701Cell<number>;
    report_open: Validate0701Cell<number>;
    reports: Validate0701ReportCell[];
    total: Validate0701TotalCell;
};

export type ReceiptPaymentTransactionValidation = {
    date: FieldValidation<string>;
    isRecieptFromOtherMonth: boolean;
    isReciept: boolean;
    isConsume: boolean;
    recieptFromFactoryLabel: FieldValidation<string>;
    recieptFromFactoryId: number;
    recieptInvoice: FieldValidation<string>;
    recieptQuantity: FieldValidation<number>;
    consumeQuantity: FieldValidation<number>;
    consumeInvoice: FieldValidation<string>;
    transferToFactoryLabel: FieldValidation<string>;
    transferToFactoryId: number;
    transferInvoice: FieldValidation<string>;
    transferQuantity: FieldValidation<number>;
    totalInvoiceQuantity: FieldValidation<number>;
    totalQuantity: FieldValidation<number>;
}

export type ReceiptPaymentValidateResult = {
    materialName: FieldValidation<string>;
    materialId: number;
    factoryName: FieldValidation<string>;
    factoryId: number;
    period: FieldValidation<string>;
    transactions: ReceiptPaymentTransactionValidation[];
}

// สำหรับวัสดุ (วัตถุดิบ)
export type Oil0704MaterialValidation = {
    materialName: FieldValidation<string>;
    open: FieldValidation<number>;
    getted: FieldValidation<number>;
    total: FieldValidation<number>;
    produce: FieldValidation<number>;
    produceOther: FieldValidation<number>;
    defected: FieldValidation<number>;
    etc: FieldValidation<number>;
    lossGain: FieldValidation<number>;
    forward: FieldValidation<number>;
};

// สำหรับสินค้า (งบการผลิต)
export type Oil0704ProductValidation = {
    productName: FieldValidation<string>;
    open: FieldValidation<number>;
    produced: FieldValidation<number>;
    bondedReturn: FieldValidation<number>;
    etcGetted: FieldValidation<number>;
    total: FieldValidation<number>;
    domesticSales: FieldValidation<number>;
    overseasSales: FieldValidation<number>;
    usedInIndustrialPlants: FieldValidation<number>;
    bonded: FieldValidation<number>;
    defected: FieldValidation<number>;
    forward: FieldValidation<number>;
    etcUsed: FieldValidation<number>;
};

// validateResult หลัก
export type ValidateOil0704Result = {
    formType: FieldValidation<string>;
    requestNumber: FieldValidation<string>;
    receivedAt: FieldValidation<string>;
    formOfficerName: FieldValidation<string>;
    companyName: FieldValidation<string>;
    exciseId: FieldValidation<string>;
    period: FieldValidation<string>;
    materials: Oil0704MaterialValidation[];
    products: Oil0704ProductValidation[];
};



