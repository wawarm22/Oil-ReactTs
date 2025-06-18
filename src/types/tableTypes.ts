export type TableItem = {
    type?: string; 
    name: string;
    quantity: number;
    ratio: number;
    productionFormula: string;
    approvalNumber?: string; 
    remark?: string;
}

export type TableData = {
    productName: string;
    headers?: string[]; 
    items: TableItem[];
}


