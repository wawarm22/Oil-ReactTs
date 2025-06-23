export const shellTaxInvoiceFields: Array<{ label: string; key: string | string[] }> = [
    { label: "เอกสารเลขที่", key: "documentNo" },
    { label: "วันที่", key: "date" },
    { label: "เลขประจำตัวเสียภาษีอากร/ทะเบียนนิติบุคคลเลขที่", key: "shellTaxOrRegisterNo" },
    { label: "สถานที่เรียกเก็บหนี้", key: ["internalRef", "shipTo"] },
    { label: "เอกสารอ้างอิง/เลขที่บัญชีลูกหนี้", key: "poNo" },
    { label: "ชื่อเเละที่อยู่ผู้ซื้อ", key: "internalRef" },
    { label: "บริษัท", key: "invoiceBranch" },
    { label: "เลขประจำตัวผู้เสียภาษี", key: "taxId" },
    { label: "วิธีการจัดส่ง", key: "paymentTerm" },
    { label: "วันที่ครบกำหนดชำระหนี้", key: "dueDate" },
    { label: "ฝ่ายบริการลูกค้า", key: "receiptBy" },
    { label: "โทรศัพท์", key: "shellPhone" },
    { label: "เวลาที่ออกเอกสาร", key: "shellDocTime" },
];

export const shellTaxInvoiceColumnLabelMap: Record<string, string> = {
    productName: "ชื่อผลิตภัณฑ์",
    poNo: "เลขที่ใบสั่งซื้อ",
    quantity: "ปริมาณ",
};
