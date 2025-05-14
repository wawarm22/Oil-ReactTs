export interface OilReceiveItem {
    receiveDate?: string;
    receiveDocNo: string;
    taxDocNo?: string;
    jvNo?: string;
    vendorCode?: string;
    vendorName?: string;
    quantityBeforeTax: number;
    quantityActual?: number;
    taxRate?: string;
    sellDate?: string;
    sellDomTaxDocNo?: string;
    sellDomTaxQty?: number;
    sellDomNonTaxDocNo?: string;
    sellDomNonTaxQty?: number;
    sellWhTaxDocNo?: string;
    sellWhTaxQty?: number;
    sellWhNonTaxDocNo?: string;
    sellWhNonTaxQty?: number;
    other?: string;
    totalUsed: number;
    permissionDocNo?: string;
    permissionQty?: number;
    usedQty: number;
    usedQtyBalance: number;
    remark?: string;
}

export const oilReceiveData: OilReceiveItem[] = [
    {
        receiveDate: "ยอดยกมา",
        receiveDocNo: "5066024106",
        quantityBeforeTax: 1924076,
        quantityActual: 5910049,
        totalUsed: 1924076,
        usedQty: 1924076,
        usedQtyBalance: 5910049,
    },
    {
        receiveDate: "ยอดยกมา",
        receiveDocNo: "5066024166",
        quantityBeforeTax: 1990153,
        quantityActual: 5910049,
        totalUsed: 1924076,
        usedQty: 1924076,
        usedQtyBalance: 5910049,
    },
    {
        receiveDate: "ยอดยกมา",
        receiveDocNo: "5066024198",
        quantityBeforeTax: 1995820,
        quantityActual: 5910049,
        totalUsed: 1924076,
        usedQty: 1924076,
        usedQtyBalance: 5910049,
    },
    {
        receiveDate: "01/09/2020",
        receiveDocNo: "5066024273",
        quantityBeforeTax: 2000344,
        sellDate: "01/09/2020",
        sellDomTaxDocNo: "5066024106",
        sellDomTaxQty: 543348,
        totalUsed: 1924076,
        usedQty: 1924076,
        usedQtyBalance: 7910393,
    },
    {
        receiveDate: "03/09/2020",
        receiveDocNo: "5066024285",
        quantityBeforeTax: 2005107,
        sellDate: "02/09/2020",
        sellDomTaxDocNo: "5066024106",
        sellDomTaxQty: 593605,
        totalUsed: 1380728,
        usedQty: 787123,
        usedQtyBalance: 8778547,
    }
];
