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
