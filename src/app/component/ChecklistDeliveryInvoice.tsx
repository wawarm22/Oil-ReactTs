import React from "react";
import { OcrDeliveryInvoiceDocument } from "../../types/ocrFileType";

interface Props {
    data: OcrDeliveryInvoiceDocument;
}

const ChecklistDeliveryInvoice: React.FC<Props> = ({ data }) => {
    const cleanValue = (val?: string | null): string => {
        if (!val || val.trim() === "" || val === ":unselected:" || val === ":selected:") return "";
        return val.trim();
    };

    const fields = [
        { label: "ใบกำกับภาษีเลขที่", value: cleanValue(data.tax_invoice_no) },
        { label: "ใบแจ้งหนี้เลขที่", value: cleanValue(data.invoice_no) },
        { label: "ใบอนุมัติขายเลขที่", value: cleanValue(data.sales_order_no) },
        { label: "ใบสั่งซื้อเลขที่", value: cleanValue(data.purchase_date) },
        { label: "ใบกำกับการขนส่ง(เอกสารโอนคลัง)/ใบจัดส่งเลขที่", value: cleanValue(data.delivery_no) },
        { label: "สาขาที่ออกใบกำกับภาษี", value: cleanValue(data.business_place) },
        { label: "ผู้จัดทำ", value: cleanValue(data.created_by) },
        { label: "คลังจ่าย", value: cleanValue(data.loading_pot_no) },
        { label: "เลขที่ ภษ.", value: cleanValue(data.loading_pot_no) },
        { label: "วันครบกำหนดชำระเงิน", value: cleanValue(data.due_date) },
        { label: "เงื่อนไขการขาย", value: cleanValue(data.incoterms) },
        { label: "เลขที่สัญญา Contract no.", value: cleanValue(data.contact_no) },
        { label: "Shipment date", value: cleanValue(data.shipment_date) },
        { label: "รหัสลูกค้า", value: cleanValue(data.customer_code) },
        { label: "ชื่อลูกค้า", value: cleanValue(data.customer_name) },
        { label: "ที่อยู่", value: cleanValue(data.customer_address) },
        { label: "สถานที่ส่ง", value: cleanValue(data.sent_address) },
        { label: "สถานที่วางบิล", value: cleanValue(data.bill_address) },
        { label: "เงื่อนไขการชำระเงิน", value: cleanValue(data.term_of_payment) },
    ];

    const shipmentDetails = data.shipment_detail ?? [];
    const productDetails = data["detail-table-1"] ?? [];
    const amountNTax = data.amount_n_tax ?? [];

    return (
        <div className="d-flex flex-column gap-2">
            {/* Fields Section */}
            {fields.map(({ label, value }) => (
                <div key={label}>
                    <div className="fw-bold">{label}</div>
                    <div className="rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px", minHeight: "40px", border: `1.5px solid #22C659` }}>
                        {value}
                    </div>
                </div>
            ))}

            {/* Shipment Details Section */}
            {shipmentDetails.length > 0 && (
                <>
                    <hr />
                    {shipmentDetails.map((item, idx) => {
                        const props = (item.properties ?? {}) as Record<string, any>;
                        return (
                            <div key={idx} className="d-flex flex-column gap-2 mb-2">
                                {[
                                    { label: "การส่งสินค้า", value: props.shipping_condition?.value },
                                    { label: "โดยพาหนะ", value: props.carrier_by?.value },
                                    { label: "เลขที่/ชื่อพาหนะ", value: props.carrier?.value },
                                    { label: "ชื่อผู้ขับขี่", value: props.driver_name?.value },
                                    { label: "ซิลเลขที่ Seal no.", value: props.seal_no?.value },
                                    { label: "เที่ยวที่ Trip no.", value: props.trip_na?.value },
                                ].map(({ label, value }) => (
                                    <div key={label}>
                                        <div className="fw-bold m-o">{label}</div>
                                        <div className="rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px", minHeight: "40px", border: `1.5px solid #22C659` }}>
                                            {cleanValue(value)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </>
            )}

            {/* Product Details Section */}
            {productDetails.length > 0 && (
                <>
                    <hr />
                    {productDetails.map((item, idx) => {
                        const props = (item.properties ?? {}) as Record<string, any>;
                        return (
                            <div key={idx} className="d-flex flex-column gap-2 mb-3">
                                {[
                                    { label: "ลำดับที่", value: props.no?.value },
                                    { label: "รหัสสินค้า", value: props.product_code?.value },
                                    { label: "ชื่อสินค้า", value: props.product_name?.value },
                                    { label: "ปริมาณ", value: props.quantity?.value },
                                    { label: "หน่วย", value: props.unit?.value },
                                    { label: "ราคาต่อหน่วย (บาท)", value: props.unit_price?.value },
                                    { label: "จำนวนเงิน (บาท)", value: props.amount?.value },
                                    { label: "ปริมาณรับปลายทาง", value: props.volumn_at?.value },
                                    { label: "API", value: props.api?.value },
                                ].map(({ label, value }) => (
                                    <div key={label}>
                                        <div className="fw-bold">{label}</div>
                                        <div className="rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px", minHeight: "40px", border: `1.5px solid #22C659` }}>
                                            {cleanValue(value)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </>
            )}
            {amountNTax.length > 0 && (
                <>
                    <hr />
                    {[
                        "จำนวนเงินรวมก่อนภาษีมูลค่าเพิ่ม",
                        "ภาษีมูลค่าเพิ่ม",
                        "จำนวนรวมภาษีมูลค่าเพิ่ม",
                        "เพิ่ม/(ลด)จากอัตราแลกเปลี่ยนตามสัญญา และตามคำสั่งกรมสรรพากร",
                        "จำนวนเงินรวมทั้งสิ้น Total amount",
                    ].map((label, idx) => {
                        const properties = amountNTax[idx]?.properties;
                        const value = properties?.[0]?.value ?? "-";
                        return (
                            <div key={label}>
                                <div className="fw-bold">{label}</div>
                                <div className="rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px", minHeight: "40px", border: `1.5px solid #22C659` }}>
                                    {cleanValue(value)}
                                </div>
                            </div>
                        );
                    })}
                </>
            )}
            <>
                <hr />
                {[
                    { label: "รวมเงินทั้งสิ้นเป็นตัวอักษร", value: data.total_amount_word },
                    { label: "อัตราภาษีมูลค่าเพิ่ม", value: data.vat_rate },
                    { label: "อัตราแลกเปลี่ยน", value: data.exchange_rate },
                    { label: "เวลาออก ตรวจสอบเอกสาร", value: data.time_out },
                    { label: "วันที่ (ผู้ออกเอกสาร)", value: data.issuer_date },
                    { label: "วันที่ (ตรวจสอบเอกสาร)", value: data.verify_date },
                    { label: "หมายเหตุ", value: data.remark },
                    { label: "No.", value: data.paper_no },                    
                ].map(({ label, value }) => (
                    <div key={label}>
                        <div className="fw-bold">{label}</div>
                        <div className="rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px", minHeight: "40px", border: `1.5px solid #22C659` }}>
                            {cleanValue(value)}
                        </div>
                    </div>
                ))}
            </>
        </div>
    );
};

export default ChecklistDeliveryInvoice;
