import React from "react";
import { OcrDeliveryInvoiceDocument } from "../../types/ocrFileType";

interface Props {
    data: OcrDeliveryInvoiceDocument;
}

const ChecklistDeliveryInvoice: React.FC<Props> = ({ data }) => {

    const cleanValue = (val?: string | null): string => {
        if (!val || val.trim() === "" || val === ":unselected:" || val === ":selected:") return "-";
        return val.trim();
    };

    const fields = [
        { label: "ชื่อลูกค้า", value: cleanValue(data.customer_name) },
        { label: "รหัสลูกค้า", value: cleanValue(data.customer_code) },
        { label: "ที่อยู่", value: cleanValue(data.send_address) },
        { label: "สถานที่ส่ง", value: cleanValue(data.bill_address) },
        { label: "ใบกำกับภาษีเลขที่", value: cleanValue(data.tax_invoice_no) },
        { label: "ใบแจ้งหนี้เลขที่", value: cleanValue(data.invoice_no) },
        { label: "ใบอนุมัติขายเลขที่", value: cleanValue(data.sales_order_no) },
        { label: "ใบสั่งซื้อเลขที่", value: cleanValue(data.purchase_no) },
        { label: "ใบกำกับการขนส่ง/ใบจัดส่งเลขที่", value: cleanValue(data.delivery_no) },
        { label: "สาขาที่ออกใบกำกับภาษี", value: cleanValue(data.business_place) },
        { label: "คลังจ่าย Plant/Loading port", value: cleanValue(data.loading_pot) },
    ];

    return (
        <div className="d-flex flex-column gap-2">
            {fields.map(({ label, value }) =>
                value ? (
                    <div key={label}>
                        <div className="fw-bold">{label}</div>
                        <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
                            {value}
                        </div>
                    </div>
                ) : null
            )}

            {data.detail_table.length > 2 && data.detail_table[2].rows.length > 1 && (
                <>
                    <hr className="border-top border-2 border-secondary mt-3 mb-2" />
                    {data.detail_table[2].rows.slice(1).map((row, rowIndex) => (
                        <div key={`product-row-${rowIndex}`} className="mb-3">
                            {[
                                { label: "ลำดับ", value: cleanValue(row.column_1) },
                                { label: "รหัสสินค้า", value: cleanValue(row.column_2) },
                                { label: "ชื่อสินค้า", value: cleanValue(row.column_3) },
                                { label: "ปริมาณ", value: cleanValue(row.column_4) },
                                { label: "หน่วย", value: cleanValue(row.column_5) },
                            ].map(({ label, value }) =>
                                value ? (
                                    <div key={label}>
                                        <div className="fw-bold">{label}</div>
                                        <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
                                            {value}
                                        </div>
                                    </div>
                                ) : null
                            )}
                        </div>
                    ))}
                </>
            )}

        </div>
    );
};

export default ChecklistDeliveryInvoice;
