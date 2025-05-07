import React from "react";
import { OcrCustomsReceiptDocument } from "../../types/ocrFileType";

interface Props {
    data: OcrCustomsReceiptDocument;
}

const ChecklistCustomsReceipt: React.FC<Props> = ({ data }) => {

    const cleanValue = (val?: any): string => {
        const v = typeof val === "object" && val !== null ? val.value : val;
        if (!v || typeof v !== "string" || v.trim() === "" || v === ":unselected:") return "";
        return v.trim();
    };

    const fields = [
        { label: "ใบเสร็จรับเงิน", value: cleanValue(data.receipt_type) },
        { label: "เลขประจำผู้เสียภาษีอากร", value: cleanValue(data.tax_id) },
        { label: "ชื่อผู้นำของเข้า/ผู้ส่งของออก", value: cleanValue(data.company_name) },
        { label: "เลขที่ใบขนสินค้า", value: cleanValue(data.shipping_slip) },
        { label: "เลขที่ชำระอากร/วันเดือนปี", value: cleanValue(data.duty_payment) }
    ];

    return (
        <div className="d-flex flex-column gap-2">
            {/* ส่วนข้อมูลหัวเอกสาร */}
            {fields.map(({ label, value }, idx) => (
                value ? (
                    <div key={idx} className="mb-1">
                        <div className="fw-bold">{label}</div>
                        <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
                            {value}
                        </div>
                    </div>
                ) : null
            ))}

            {/* ส่วนข้อมูลตาราง detail_table */}
            {data.detail_table && data.detail_table.length > 0 && (
                <>
                    <hr className="border-top border-2 border-secondary mt-2 m-0" />
                    {data.detail_table.map((row, idx) => {
                        const props = row.properties || {};
                        const detail = cleanValue(props.detail);

                        // ถ้าเป็น "รวมเงินทั้งสิ้น" ให้หยุด loop และแสดงผลรวม
                        if (detail.includes("รวมเงินทั้งสิ้น")) {
                            return (
                                <div key={`total-${idx}`} className="mb-1">
                                    <div className="fw-bold">รวมเงินทั้งสิ้น (บาท)</div>
                                    <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
                                        {cleanValue(props.declared_amount)}
                                    </div>
                                </div>
                            );
                        }

                        // รายการธรรมดา
                        const detailFields = [
                            { label: "ได้รับเงินตามรายการข้างล่างนี้ไว้แล้ว", value: cleanValue(props.detail) },
                            { label: "ที่ชำระตามสำแดง(บาท)", value: cleanValue(props.declared_amount) },
                            { label: "ที่วางประกัน(บาท)", value: cleanValue(props.insurance_amount) }
                        ];

                        return (
                            <div key={`row-${idx}`} className="mb-1 pb-2 border-bottom border-2">
                                {detailFields.map(({ label, value }, subIdx) => (
                                    value ? (
                                        <div key={`${idx}-${subIdx}`} className="mb-1">
                                            <div className="fw-bold">{label}</div>
                                            <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
                                                {value}
                                            </div>
                                        </div>
                                    ) : null
                                ))}
                            </div>
                        );
                    })}
                </>
            )}
            <hr className="border-top border-2 border-secondary mt-2 m-0" />
            {[
                { label: "จำนวนเงินตัวอักษร", value: cleanValue(data.amount_in_word) },
                { label: "ลงชื่อ", value: cleanValue(data.name) },
                { label: "ตำแหน่ง", value: cleanValue(data.position) },
                { label: "สำนักด่าน/กรมศุลกากร", value: cleanValue(data.office) },
                { label: "วันที่", value: cleanValue(data.date) }
            ].map(({ label, value }, idx) => (
                value ? (
                    <div key={`footer-${idx}`} className="mb-1">
                        <div className="fw-bold">{label}</div>
                        <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
                            {value}
                        </div>
                    </div>
                ) : null
            ))}
        </div>
    );
};

export default ChecklistCustomsReceipt;
