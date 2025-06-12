export type LocalSale = {
    quantity: number;
    invoiceNo: string;
};

export type Transfer = {
    destinationDepot: string;
    quantity: number;
    invoiceNo: string;
};

export type Receipt = {
    receivedDate: string;
    sourceDepot: string;
    invoiceNo: string;
    quantity: number;
    invoiceBalance: number;
    totalBalance: number;
};

export type OpeningBalance = {
    receivedDate: string;
    sourceDepot: string;
    invoiceNo: string;
    quantity: string;
    invoiceBalance: number;
    totalBalance: number;
}

export type Disbursement = {
    paidDate: string;
    localSale: LocalSale;
    transfer: Transfer[];
    invoiceBalance: number;
    totalBalance: number;
};

export type EndOfMonth = {
    tankMeasurement: number;
    lossGainQuantity: number;
    lossGainPercentage: number;
    carriedForwardBalance: number;
};

export type Fields = {
    header: {
        formTitle: string;
        productName: string;
        factories: string;
        period: string;
    };
    openingBalance: OpeningBalance[];
    receipt: Receipt[];
    disbursement: Disbursement[];
    endOfMonth: EndOfMonth;
};

export type PreparedData = {
    documentGroup: string;
    fields: Fields;
};

export type PreparedFormularApprovResponse = {
    docType: string;
    documentGroup: string;
    fields: {
        items: PreparedFormularProductItem[];
    };
};

export type PreparedFormularProductItem = {
    index: number;
    no: string;
    product: {
        name: string;
        type: string;
        unit: string;
        materials: PreparedFormularMaterial[];
    };
    total: number;
};

export type PreparedFormularMaterial = {
    name: string;
    unit: string;
    quantity: string;
};

export type Oil0502Material = {
    materialType: string;
    materialUnit: string;
    materialQuantity: string;
    note: string;
};

export type Oil0502Product = {
    itemNo: number;
    productType: string;
    productName: string;
    productUnit: string;
    materialsPerUnit: Oil0502Material[];
};

export type Oil0502Fields = {
    formName: string;
    forOfficer: boolean;
    electronicRegisterNo: string;
    documentRegisterNo: string;
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
    phone1: string;
    phone2: string;
    products: Oil0502Product[];
};

export type Prepared0502 = {
    docType: string;
    documentGroup: string;
    fields: Oil0502Fields;
};

export type ReceiptPaymentTransaction = {
    date: string;
    isRecieptFromOtherMonth: boolean;
    isReciept: boolean;
    isConsume: boolean;
    recieptFromFactoryLabel: string;
    recieptFromFactoryId: number;
    recieptInvoice: string;
    recieptQuantity: number;
    consumeQuantity: number;
    consumeInvoice: string;
    transferToFactoryLabel: string;
    transferToFactoryId: number;
    transferInvoice: string;
    transferQuantity: number;
    totalInvoiceQuantity: number;
    totalQuantity: number;
};

export type OcrReceiptPaymentFields = {
    materialName: string;
    materialId: number;
    factoryName: string;
    factoryId: number;
    period: string;
    transactions: ReceiptPaymentTransaction[];
};

export type OcrReceiptPaymentPreparedData = {
    docType: string;
    documentGroup: string;
    fields: OcrReceiptPaymentFields;
};

export type Material0704 = {
    materialName: string;
    open: number;
    getted: number;
    total: number;
    produce: number;
    produceOther: number;
    defected: number;
    etc: number;
    lossGain: number;
    forward: number;
};

export type Product0704 = {
    productName: string;
    open: number;
    produced: number;
    bondedReturn: number;
    etcGetted: number;
    total: number;
    domesticSales: number;
    overseasSales: number;
    usedInIndustrialPlants: number;
    bonded: number;
    defected: number;
    forward: number;
    etcUsed: number;
};

export type Prepared0704Fields = {
    formType: string;
    requestNumber: string;
    receivedAt: string;
    formOfficerName: string;
    companyName: string;
    exciseId: string;
    period: string;
    materials: Material0704[];
    products: Product0704[];
};

export type Prepared0704 = {
    docType: string;
    documentGroup: string;
    fields: Prepared0704Fields;
};



