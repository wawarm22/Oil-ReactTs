export const shellTaxInvoiceFields: Array<{ label: string; key: string }> = [
    { label: "เอกสารเลขที่", key: "shellDocNo" },
    { label: "วันที่", key: "shellDate" },
    { label: "เลขประจำตัวเสียภาษีอากร/ทะเบียนนิติบุคคลเลขที่", key: "shellTaxOrRegisterNo" },
    { label: "สถานที่เรียกเก็บหนี้", key: "shellBillingPlace" },
    { label: "เอกสารอ้างอิง/เลขที่บัญชีลูกหนี้", key: "shellReferenceOrAccountNo" },
    { label: "ชื่อเเละที่อยู่ผู้ซื้อ", key: "shellBuyerNameAddress" },
    { label: "บริษัท", key: "shellCompany" },
    { label: "เลขประจำตัวผู้เสียภาษี", key: "shellTaxId" },
    { label: "วิธีการจัดส่ง", key: "shellDeliveryMethod" },
    { label: "วันที่ครบกำหนดชำระหนี้", key: "shellDueDate" },
    { label: "ฝ่ายบริการลูกค้า", key: "shellCustomerService" },
    { label: "โทรศัพท์", key: "shellPhone" },
    { label: "เวลาที่ออกเอกสาร", key: "shellDocTime" },
];

export const shellTaxInvoiceColumnLabelMap: Record<string, string> = {
    productName: "ชื่อผลิตภัณฑ์",
    poNo: "เลขที่ใบสั่งซื้อ",
    quantity: "ปริมาณ",
};
