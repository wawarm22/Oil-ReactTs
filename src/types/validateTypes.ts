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

