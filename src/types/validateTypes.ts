import { Material, Product } from "../utils/function/checklist/attachment0704";

export type OCRFieldProperty = {
    value: string;
};

export type OCRFieldRow = {
    properties: {
        [column: string]: OCRFieldProperty;
    };
};

export interface FieldCompare {
    properties?: { [key: string]: { value: string } };
    detail_table?: { [column: string]: OCRFieldProperty };
}

export type OCRValidationPayload = {
    docType: string;
    fields: OCRFieldRow[];
};

export type ValidationCompare = {
    docType: string;
    company: string;
    factories: string;
    documentGroup: string;
    fields: FieldCompare[];
};

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

