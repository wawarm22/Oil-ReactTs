import React from "react";

const shellHeader = [
    { label: "ผู้ประกอบการอุตสาหกรรม", key: "operator" },
    { label: "คลัง", key: "factoryName" },
    { label: "ชนิดสินค้า", key: "materialName" },
    { label: "ประจำเดือน/ปี", key: "period" },
];

const shellFieldGroups: Array<
    | { groupLabel: string; fields: Array<{ label: string; key: string }> }
    | { label: string; key: string }
> = [
        {
            groupLabel: "หลักฐานการซื้อขายน้ำมันจากโรงกลั่น (ใบกำกับภาษี)",
            fields: [
                { label: "เลขที่", key: "taxInvoiceNo" },
                { label: "วันเดือนปี", key: "taxInvoiceDate" },
                { label: "Vendor Code", key: "vendorCode" },
                { label: "ปริมาณน้ำมัน(ใบกำกับภาษี)", key: "taxInvoiceQty" },
                { label: "ปริมาณน้ำมันที่คลังรับจริง", key: "actualReceivedQty" },
                { label: "อัตราภาษี", key: "taxRate" },
            ]
        },
        {
            groupLabel: "หลักฐานการซื้อน้ำมันที่คลังรับจากการโอนสต๊อก",
            fields: [
                { label: "เลขที่", key: "stockTransferNo" },
                { label: "วันเดือนปี", key: "stockTransferDate" },
                { label: "Vendor Code", key: "stockTransferVendor" },
                { label: "ปริมาณน้ำมัน", key: "stockTransferQty" },
                { label: "อัตราภาษี", key: "stockTransferTaxRate" },
            ]
        },
        { label: "ปริมาณน้ำมันที่คลังสามารถลดหย่อนภาษี", key: "finalRemainQty" },
        {
            groupLabel: "ปริมาณน้ำมันที่จำหน่ายแบบผสมสารเพิ่มคุณภาพ",
            fields: [
                { label: "ปริมาณที่ขอหัก ลดหย่อนภาษี", key: "qualityMixedQty" },
            ]
        },
        {
            groupLabel: "ปริมาณน้ำมันที่จำหน่ายแบบไม่ผสมสารเพิ่มคุณภาพ",
            fields: [
                { label: "การขายส่งให้คลังต่างจังหวัดหรือจ่ายทางท่อ", key: "provincePipeQty" },
            ]
        },
        { label: "น้ำมันลดคุณค่าหรืออื่นๆ", key: "lowQualityQty" },
        {
            groupLabel: "ปริมาณน้ำมันที่มีสิทธิหักลดหย่อนคงเหลือตามใบกำกับภาษีแต่ละฉบับ",
            fields: [
                { label: "เลขที่", key: "remainInvoiceNo" },
                { label: "ปริมาณที่ใช้ลดหย่อน", key: "usedQty" },
                { label: "ปริมาณคงเหลือ", key: "remainQty" },

            ]
        },
        { label: "ปริมาณน้ำมันที่มีสิทธิหักลดหย่อนคงเหลือ", key: "finalRemainQty" },
    ];

const getBorderColor = (value: any) => {
    if (value === undefined || value === null || value === "") return "#FF0100";
    if (value === false) return "#FF0100";
    if (value === true) return "#22C659";
    return "#FF0100";
};

const getDisplayValue = (raw: any): React.ReactNode => {
    if (raw == null) return "";
    if (typeof raw === "object") {
        if ("value" in raw) return raw.value ?? "";
        return JSON.stringify(raw);
    }
    return raw;
};

const ShellIncomeNExpense: React.FC<{ validateResult: any }> = ({ validateResult }) => (
    <div className="d-flex flex-column gap-2" style={{ fontSize: "14px" }}>
        <div className="fw-bold" style={{ fontSize: "16px" }}>บัญชีรับ-จ่ายน้ำมันที่นำมาใช้เป็นวัตถุดิบในการผลิต</div>
        {shellHeader.map(({ label, key }) => (
            <div key={key} className="mb-1">
                <div className="fw-bold">{label}</div>
                <div
                    className="rounded-2 shadow-sm bg-white p-2"
                    style={{ minHeight: "42px", border: `1.5px solid ${getBorderColor(validateResult[key])}` }}
                >
                    {getDisplayValue(validateResult[key])}
                </div>
            </div>
        ))}

        {shellFieldGroups.map((item, _idx) => {
            if ("groupLabel" in item) {
                return (
                    <div key={item.groupLabel}>
                        <div className="fw-bold my-2" style={{ fontSize: "16px" }}>{item.groupLabel}</div>
                        {item.fields.map(field => (
                            <div key={field.key} className="mb-2">
                                <div className="fw-bold">{field.label}</div>
                                <div
                                    className="rounded-2 shadow-sm bg-white p-2"
                                    style={{
                                        minHeight: "42px",
                                        border: "1.5px solid #FF0100"
                                    }}
                                >
                                    {getDisplayValue(validateResult[field.key])}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            }
            return (
                <div key={item.key} className="mb-2">
                    <div className="fw-bold">{item.label}</div>
                    <div
                        className="rounded-2 shadow-sm bg-white p-2"
                        style={{ minHeight: "42px", border: "1.5px solid #FF0100" }}>
                        {getDisplayValue(validateResult[item.key])}
                    </div>
                </div>
            );
        })}
    </div>
);

export default ShellIncomeNExpense;
