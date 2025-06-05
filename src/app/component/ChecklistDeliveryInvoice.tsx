import React, { useEffect, useState } from "react";
import { OcrDeliveryInvoiceDocument } from "../../types/ocrFileType";
import { getPreparedInvoiceTax, validateInvoiceTax } from "../../utils/api/validateApi";
import { AuthSchema } from "../../types/schema/auth";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { OcrInvoiceTaxData } from "../../types/validateTypes";
import { ValidateInvoiceTaxItem, ValidateInvoiceTaxResult } from "../../types/validateResTypes";
import { isValidateFieldTax } from "../../utils/function/isValidateFieldTax";

interface Props {
    data: OcrDeliveryInvoiceDocument;
}

const ChecklistDeliveryInvoice: React.FC<Props> = ({ data }) => {
    const auth = useAuthUser<AuthSchema>();
    const [ocrData, setOcrData] = useState<OcrInvoiceTaxData | null>(null);
    const [validateData, setValidateData] = useState<ValidateInvoiceTaxResult | null>(null);
    const [loading, setLoading] = useState(true);

    const cleanValue = (val?: string | number | null): string => {
        if (val === null || val === undefined) return "";
        if (typeof val === "number") {
            return val === 0 ? "" : val.toLocaleString();
        }
        if (val.trim() === "" || val === ":unselected:" || val === ":selected:") return "";
        return val.trim();
    };

    const borderColor = (passed?: boolean) =>
        `1.5px solid ${passed === true ? "#22C659" : passed === false ? "#FF0100" : "#CED4DA"}`;

    useEffect(() => {
        if (!auth || !auth.accessToken || !data.id) return;
        setLoading(true);
        getPreparedInvoiceTax(data.id, auth)
            .then(res => setOcrData(res.data))
            .catch(() => setOcrData(null))
            .finally(() => setLoading(false));
    }, [data.id, auth]);

    useEffect(() => {
        if (!ocrData) return;
        validateInvoiceTax(ocrData)
            .then(res => {
                if (res?.data) setValidateData(res.data);
            });
    }, [ocrData]);

    if (loading) {
        return <div>กำลังโหลดข้อมูล...</div>;
    }

    const fields: { key: keyof ValidateInvoiceTaxResult, label: string, fallback?: any }[] = [
        { key: "tax_invoice_no", label: "ใบกำกับภาษีเลขที่", fallback: data.tax_invoice_no },
        { key: "invoice_no", label: "ใบแจ้งหนี้เลขที่", fallback: ocrData?.fields.invoice_no },
        { key: "sales_order_no", label: "ใบอนุมัติขายเลขที่", fallback: data.sales_order_no },
        { key: "purchase_order_no", label: "ใบสั่งซื้อเลขที่", fallback: ocrData?.fields.purchase_order_no },
        { key: "delivery_no", label: "ใบกำกับการขนส่ง(เอกสารโอนคลัง)/ใบจัดส่งเลขที่", fallback: ocrData?.fields.delivery_no },
        { key: "business_place", label: "สาขาที่ออกใบกำกับภาษี", fallback: ocrData?.fields.business_place },
        { key: "created_by", label: "ผู้จัดทำ", fallback: data.created_by },
        { key: "plant", label: "คลังจ่าย", fallback: ocrData?.fields.plant ?? data.loading_pot_no },
        { key: "excise_no", label: "เลขที่ ภษ.", fallback: ocrData?.fields.excise_no },
        { key: "due_date", label: "วันครบกำหนดชำระเงิน", fallback: ocrData?.fields.due_date ?? data.due_date },
        { key: "incoterms", label: "เงื่อนไขการขาย", fallback: ocrData?.fields.incoterms ?? data.incoterms },
        { key: "contract_no", label: "เลขที่สัญญา Contract no.", fallback: ocrData?.fields.contract_no ?? data.contact_no },
        { key: "shipment_date", label: "Shipment date", fallback: ocrData?.fields.shipment_date },
        { key: "customer_code", label: "รหัสลูกค้า", fallback: ocrData?.fields.customer_code },
        { key: "customer_name", label: "ชื่อลูกค้า", fallback: ocrData?.fields.customer_name },
        { key: "customer_address", label: "ที่อยู่", fallback: ocrData?.fields.customer_address },
        { key: "delivery_place", label: "สถานที่ส่ง", fallback: ocrData?.fields.delivery_place },
        { key: "bill_place", label: "สถานที่วางบิล", fallback: ocrData?.fields.bill_place ?? data.bill_address },
        { key: "payment_terms", label: "เงื่อนไขการชำระเงิน", fallback: ocrData?.fields.payment_terms ?? data.term_of_payment },
    ];

    const itemFields: { key: keyof ValidateInvoiceTaxItem; label: string }[] = [
        { key: "no", label: "ลำดับที่" },
        { key: "product_code", label: "รหัสสินค้า" },
        { key: "product_name", label: "ชื่อสินค้า" },
        { key: "quantity", label: "ปริมาณ" },
        { key: "unit", label: "หน่วย" },
        { key: "unit_price", label: "ราคาต่อหน่วย (บาท)" },
        { key: "amount", label: "จำนวนเงิน (บาท)" },
        { key: "quantity_received", label: "ปริมาณรับปลายทาง" },
        { key: "api", label: "API" },
    ];

    const totalFields: { key: keyof ValidateInvoiceTaxResult, label: string, fallback?: any }[] = [
        { key: "subtotal", label: "จำนวนเงินรวมก่อนภาษีมูลค่าเพิ่ม", fallback: ocrData?.fields.subtotal },
        { key: "vat", label: "ภาษีมูลค่าเพิ่ม", fallback: ocrData?.fields.vat },
        { key: "total_vat", label: "จำนวนรวมภาษีมูลค่าเพิ่ม", fallback: ocrData?.fields.total_vat },
        { key: "fx_difference", label: "เพิ่ม/(ลด)จากอัตราแลกเปลี่ยนตามสัญญา และตามคำสั่งกรมสรรพากร", fallback: ocrData?.fields.fx_difference },
        { key: "total_amount", label: "จำนวนเงินรวมทั้งสิ้น Total amount", fallback: ocrData?.fields.total_amount }
    ];

    const extraFields: { key: keyof ValidateInvoiceTaxResult, label: string, fallback?: any }[] = [
        { key: "total_amount_text", label: "รวมเงินทั้งสิ้นเป็นตัวอักษร", fallback: ocrData?.fields.total_amount_text ?? data.total_amount_word },
        { key: "vat_rate", label: "อัตราภาษีมูลค่าเพิ่ม", fallback: ocrData?.fields.vat_rate ?? data.vat_rate },
        { key: "fx_rate", label: "อัตราแลกเปลี่ยน", fallback: ocrData?.fields.fx_rate ?? data.exchange_rate },
        { key: "check_time", label: "เวลาออก ตรวจสอบเอกสาร", fallback: ocrData?.fields.check_time ?? data.time_out },
        { key: "confirm_date", label: "วันที่ (ผู้ออกเอกสาร)", fallback: ocrData?.fields.confirm_date ?? data.issuer_date },
        { key: "check_date", label: "วันที่ (ตรวจสอบเอกสาร)", fallback: ocrData?.fields.check_date ?? data.verify_date },
        { key: "note", label: "หมายเหตุ", fallback: ocrData?.fields.note ?? data.remark },
        // { key: "paper_no", label: "No.", fallback: ocrData?.fields.paper_no ?? data.paper_no }
    ];

    return (
        <div className="d-flex flex-column gap-2">

            {/* Main fields */}
            {fields.map(({ key, label, fallback }) => {
                const validField = validateData?.[key];
                const border = isValidateFieldTax(validField)
                    ? borderColor(validField.passed)
                    : borderColor(undefined);
                const showValue = isValidateFieldTax(validField)
                    ? validField.value
                    : fallback;

                return (
                    <div key={label}>
                        <div className="fw-bold">{label}</div>
                        <div
                            className="rounded-2 shadow-sm bg-white p-2"
                            style={{
                                fontSize: "14px",
                                minHeight: "40px",
                                border
                            }}
                        >
                            {cleanValue(showValue)}
                        </div>
                    </div>
                );
            })}

            {/* รายการสินค้า */}
            {Array.isArray(validateData?.items) && validateData.items.length > 0 && (
                <>
                    <hr />
                    {validateData.items.map((item, idx) => (
                        <div key={idx} className="d-flex flex-column gap-2 mb-3">
                            {itemFields.map(({ key, label }) => {
                                const validItem = item[key];
                                return (
                                    <div key={label}>
                                        <div className="fw-bold">{label}</div>
                                        <div
                                            className="rounded-2 shadow-sm bg-white p-2"
                                            style={{
                                                fontSize: "14px",
                                                minHeight: "40px",
                                                border: borderColor(validItem?.passed)
                                            }}
                                        >
                                            {cleanValue(validItem?.value)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </>
            )}

            {/* ยอดรวมและอื่นๆ */}
            <hr />
            {totalFields.map(({ key, label, fallback }) => {
                const validField = validateData?.[key];
                const showValue = isValidateFieldTax(validField)
                    ? validField.value
                    : fallback;
                return (
                    <div key={label}>
                        <div className="fw-bold">{label}</div>
                        <div
                            className="rounded-2 shadow-sm bg-white p-2"
                            style={{
                                fontSize: "14px",
                                minHeight: "40px",
                                border: borderColor(isValidateFieldTax(validField) ? validField.passed : undefined)
                            }}
                        >
                            {cleanValue(showValue)}
                        </div>
                    </div>
                );
            })}

            {/* ฟิลด์เสริม */}
            <hr />
            {extraFields.map(({ key, label, fallback }) => {
                const validField = validateData?.[key];
                const showValue = isValidateFieldTax(validField)
                    ? validField.value
                    : fallback;
                return (
                    <div key={label}>
                        <div className="fw-bold">{label}</div>
                        <div
                            className="rounded-2 shadow-sm bg-white p-2"
                            style={{
                                fontSize: "14px",
                                minHeight: "40px",
                                border: borderColor(isValidateFieldTax(validField) ? validField.passed : undefined)
                            }}
                        >
                            {cleanValue(showValue)}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ChecklistDeliveryInvoice;
