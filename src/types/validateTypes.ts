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






