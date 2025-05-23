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
