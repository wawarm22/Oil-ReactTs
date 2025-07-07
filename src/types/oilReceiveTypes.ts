export interface OilReceiveItem {
    receiveDate?: string;
    receiveDocNo: string;
    taxDocNo?: string;
    jvNo?: string;
    vendorCode?: string;
    vendorName?: string;
    vendorFullName?: string;
    quantityBeforeTax: number;
    quantityActual?: number;
    taxRate?: string;
    sellDate?: string;
    sellDomTaxDocNo?: string;
    sellDomTaxQty?: number;
    sellDomNonTaxDocNo?: string;
    sellDomNonTaxQty?: number;
    transferToFactory?: string;
    transferTaxNo?: string;
    transferTaxQty?: number;
    transferNonTaxDocNo?: string;
    transferNonTaxQty?: number;
    other?: string;
    totalUsed?: number;
    permissionDocNo?: string;
    permissionQty?: number;
    usedQty?: number;
    usedQtyBalance?: number;
    remark?: string;
}

