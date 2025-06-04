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
    data: {
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
};

export type Validate0503Page2Cell = {
    value: string | number;
    expected: string | number;
    passed: boolean;
};

export type Validate0503Page2Result = {
    data: {
        ref_no: Validate0503Page2Cell;
        excise_tax: Validate0503Page2Cell;
        health_fund: Validate0503Page2Cell;
        radio_fund: Validate0503Page2Cell;
        sport_fund: Validate0503Page2Cell;
        elder_fund: Validate0503Page2Cell;
        interior_tax: Validate0503Page2Cell;
        total_tax: Validate0503Page2Cell;
    };
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




