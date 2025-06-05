import React, { useEffect, useState } from "react";
import { OcrDeliveryInvoiceDocument } from "../../types/ocrFileType";
import { getPreparedInvoiceTax, validateInvoiceTax } from "../../utils/api/validateApi";
import { AuthSchema } from "../../types/schema/auth";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { OcrInvoiceTaxData } from "../../types/validateTypes";

interface Props {
    data: OcrDeliveryInvoiceDocument;
}

const ChecklistDeliveryInvoice: React.FC<Props> = ({ data }) => {
    const auth = useAuthUser<AuthSchema>();
    const [ocrData, setOcrData] = useState<OcrInvoiceTaxData | null>(null);
    const [_validateData, setValidateData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const cleanValue = (val?: string | number | null): string => {
        if (val === null || val === undefined) return "";
        if (typeof val === "number") {
            return val === 0 ? "" : val.toLocaleString();
        }
        if (val.trim() === "" || val === ":unselected:" || val === ":selected:") return "";
        return val.trim();
    };

    useEffect(() => {
        if (!auth || !auth.accessToken || !data.id) return;

        setLoading(true);
        getPreparedInvoiceTax(data.id, auth)
            .then(res => {
                setOcrData(res.data);
            })
            .catch(() => {
                setOcrData(null);
            })
            .finally(() => setLoading(false));
    }, [data.id, auth]);

    useEffect(() => {
        if (!ocrData) return;

        validateInvoiceTax(ocrData)
            .then(res => {
                if (res?.data) {
                    setValidateData(res.data);
                }
            });
    }, [ocrData]);

    const fields = [
        { label: "ใบกำกับภาษีเลขที่", value: data.tax_invoice_no },
        { label: "ใบแจ้งหนี้เลขที่", value: ocrData?.fields.invoice_no },
        { label: "ใบอนุมัติขายเลขที่", value: data.sales_order_no },
        { label: "ใบสั่งซื้อเลขที่", value: ocrData?.fields.purchase_order_no },
        { label: "ใบกำกับการขนส่ง(เอกสารโอนคลัง)/ใบจัดส่งเลขที่", value: ocrData?.fields.delivery_no },
        { label: "สาขาที่ออกใบกำกับภาษี", value: ocrData?.fields.business_place },
        { label: "ผู้จัดทำ", value: data.created_by },
        { label: "คลังจ่าย", value: data.loading_pot_no },
        { label: "เลขที่ ภษ.", value: data.loading_pot_no },
        { label: "วันครบกำหนดชำระเงิน", value: data.due_date },
        { label: "เงื่อนไขการขาย", value: data.incoterms },
        { label: "เลขที่สัญญา Contract no.", value: data.contact_no },
        { label: "Shipment date", value: ocrData?.fields.shipment_date },
        { label: "รหัสลูกค้า", value: ocrData?.fields.customer_code },
        { label: "ชื่อลูกค้า", value: ocrData?.fields.customer_name },
        { label: "ที่อยู่", value: ocrData?.fields.customer_address },
        { label: "สถานที่ส่ง", value: ocrData?.fields.delivery_place },
        { label: "สถานที่วางบิล", value: data.bill_address },
        { label: "เงื่อนไขการชำระเงิน", value: data.term_of_payment },
    ];

    if (loading) {
        return <div>กำลังโหลดข้อมูล...</div>;
    }

    const shipmentDetails = data.shipment_detail ?? [];
    return (
        <div className="d-flex flex-column gap-2">
            {fields.map(({ label, value }) => (
                <div key={label}>
                    <div className="fw-bold">{label}</div>
                    <div className="rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px", minHeight: "40px", border: `1.5px solid #22C659` }}>
                        {cleanValue(value)}
                    </div>
                </div>
            ))}

            {shipmentDetails.length > 0 && (
                <>
                    <hr />
                    {shipmentDetails.map((item, idx) => {
                        const props = (item.properties ?? {}) as Record<string, any>;
                        return (
                            <div key={idx} className="d-flex flex-column gap-2 mb-2">
                                {[
                                    { label: "การส่งสินค้า", value: props.shipping_condition?.value },
                                    { label: "โดยพาหนะ", value: ocrData?.fields.vehicle ?? props.carrier_by?.value },
                                    { label: "เลขที่/ชื่อพาหนะ", value: ocrData?.fields.vehicle_no ?? props.carrier?.value },
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

            {Array.isArray(ocrData?.fields.items) && ocrData.fields.items.length > 0 && (
                <>
                    <hr />
                    {ocrData.fields.items.map((item, idx) => (
                        <div key={idx} className="d-flex flex-column gap-2 mb-3">
                            {[
                                { label: "ลำดับที่", value: item.no },
                                { label: "รหัสสินค้า", value: item.product_code },
                                { label: "ชื่อสินค้า", value: item.product_name },
                                { label: "ปริมาณ", value: item.quantity },
                                { label: "หน่วย", value: item.unit },
                                { label: "ราคาต่อหน่วย (บาท)", value: item.unit_price },
                                { label: "จำนวนเงิน (บาท)", value: item.amount },
                                { label: "ปริมาณรับปลายทาง", value: item.quantity_received },
                                { label: "API", value: item.api },
                            ].map(({ label, value }) => (
                                <div key={label}>
                                    <div className="fw-bold">{label}</div>
                                    <div className="rounded-2 shadow-sm bg-white p-2" style={{
                                        fontSize: "14px",
                                        minHeight: "40px",
                                        border: `1.5px solid #22C659`
                                    }}>
                                        {cleanValue(value)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </>
            )}

            {ocrData && (
                <>
                    <hr />
                    {[
                        { label: "จำนวนเงินรวมก่อนภาษีมูลค่าเพิ่ม", value: ocrData.fields.subtotal },
                        { label: "ภาษีมูลค่าเพิ่ม", value: ocrData.fields.vat },
                        { label: "จำนวนรวมภาษีมูลค่าเพิ่ม", value: ocrData.fields.total_vat },
                        { label: "เพิ่ม/(ลด)จากอัตราแลกเปลี่ยนตามสัญญา และตามคำสั่งกรมสรรพากร", value: ocrData.fields.fx_difference },
                        { label: "จำนวนเงินรวมทั้งสิ้น Total amount", value: ocrData.fields.total_amount },
                    ].map(({ label, value }) => (
                        <div key={label}>
                            <div className="fw-bold">{label}</div>
                            <div className="rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px", minHeight: "40px", border: `1.5px solid #22C659` }}>
                                {cleanValue(value)}
                            </div>
                        </div>
                    ))}
                </>
            )}

            <>
                <hr />
                {[
                    { label: "รวมเงินทั้งสิ้นเป็นตัวอักษร", value: ocrData?.fields.total_amount_text ?? data.total_amount_word },
                    { label: "อัตราภาษีมูลค่าเพิ่ม", value: ocrData?.fields.vat_rate ?? data.vat_rate },
                    { label: "อัตราแลกเปลี่ยน", value: ocrData?.fields.fx_rate ?? data.exchange_rate },
                    { label: "เวลาออก ตรวจสอบเอกสาร", value: ocrData?.fields.check_time ?? data.time_out },
                    { label: "วันที่ (ผู้ออกเอกสาร)", value: ocrData?.fields.confirm_date ?? data.issuer_date },
                    // { label: "ตรวจรับสินค้าข้างบนนี้ในสภาพเรียบร้อยถูกต้องครบถ้วนเเล้ว", value: ocrData?.fields.confirm_text },
                    { label: "วันที่ (ตรวจสอบเอกสาร)", value: ocrData?.fields.check_date ?? data.verify_date },
                    { label: "หมายเหตุ", value: ocrData?.fields.note ?? data.remark },
                    { label: "No.", value: ocrData?.fields.paper_no ?? data.paper_no },
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
