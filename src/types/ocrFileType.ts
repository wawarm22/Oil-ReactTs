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
    detail_table: Record<string, any>[];
};

export type OcrFields =
    | OcrTaxDocument
    | OcrDetailTableDocument
    | (OcrFieldsBase & Record<string, any>); 
