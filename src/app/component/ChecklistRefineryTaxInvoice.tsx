import React from "react";
import { OcrRefineryTaxInvoiceDocument } from "../../types/ocrFileType";

interface Props {
    data: OcrRefineryTaxInvoiceDocument;
}

const ChecklistRefineryTaxInvoice: React.FC<Props> = ({ data }) => {
    const cleanValue = (val?: string | null): string => {
        if (!val || val.trim() === "" || val === ":unselected:") return "-";
        return val.trim();
    };

    const fields = [
        {
            label: "ชื่อและที่อยู่ลูกค้า Customer Name and Address",
            value: `${cleanValue(data.customer_name)} ${cleanValue(data.customer_address)}`
        },
        { label: "เลขที่ประจำตัวผู้เสียภาษีอากร TAX ID", value: data.tax_id },
        { label: "สำนักงานใหญ่", value: data.branch },
        { label: "สถานที่จัดส่ง Ship to", value: data.ship_to },
        { label: "เลขที่เอกสาร Document No.", value: data.doc_no },
        { label: "วันที่ Date", value: data.date },
        { label: "เงื่อนไขในการชำระเงิน Payment", value: data.payment_terms },
        { label: "วันครบกำหนดชำระ Due Date", value: data.due_date },
        { label: "เลขที่เอกสารการสั่งซื้อ PO No.", value: data.po_no },
        { label: "เงื่อนไขการขนส่ง Inco.Term", value: data.inco_term },
    ];

    const columnLabelMap: Record<string, string> = {
        item_no: "ลำดับ",
        description: "รายการ",
        quantity: "จำนวน",
        unit: "หน่วย",
        unit_price: "ราคาต่อหน่วย",
        amount: "จำนวนเงิน"
    };

    return (
        <div className="d-flex flex-column gap-3">

            {/* ส่วนหัว */}
            {fields.map(({ label, value }) => (
                <div key={label}>
                    <div className="fw-bold">{label}</div>
                    <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
                        {cleanValue(value)}
                    </div>
                </div>
            ))}

            {/* ตาราง detail_table */}
            {data.detail_table.map((row, rowIndex) => {
                const rawProps = row.properties;
                const properties: Record<string, any> =
                    Array.isArray(rawProps) ? rawProps[0] : typeof rawProps === "object" && rawProps !== null ? rawProps : {};

                return (
                    <React.Fragment key={`row-${rowIndex}`}>
                        <hr className="border-top border-2 border-secondary m-0 mt-1" />
                        {Object.entries(columnLabelMap).map(([key, label]) => {
                            const value = properties?.[key]?.value ?? "-";
                            return (
                                <div key={`${rowIndex}-${key}`}>
                                    <div className="fw-bold">{label}</div>
                                    <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
                                        {cleanValue(value)}
                                    </div>
                                </div>
                            );
                        })}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default ChecklistRefineryTaxInvoice;
