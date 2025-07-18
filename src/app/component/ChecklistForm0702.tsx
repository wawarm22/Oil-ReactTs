import React from "react";
import { OcrDailyProductionDocument } from "../../types/ocrFileType";
import { Oil0702ValidationResult } from "../../types/validateResTypes";
import { Oil0702ReportRow, PreparedOil0702 } from "../../types/validateTypes";
import { getBorderColor, getValidatePropsForDailyRow, getValidatePropsForSummary } from "../../utils/function/getValidateProps";

interface Props {
    data: OcrDailyProductionDocument;
    validateResult: Oil0702ValidationResult | null
    context: PreparedOil0702 | null;
}

const fixedLabels: { key: keyof Oil0702ReportRow | string; label: string }[] = [
    { key: "date", label: "วันเดือนปี" },
    { key: "transaction_type", label: "รายการ" },
    { key: "evidence_number", label: "หลักฐานเลขที่" },
    { key: "received_produced", label: "ผลิตได้" },
    { key: "received_returned", label: "รับคืนจากคลังสินค้าทัณฑ์บน" },
    { key: "received_others", label: "อื่นๆ" },
    { key: "total_received", label: "รวมรับสินค้า" },
    { key: "__section_paid", label: "จำนวนจ่าย" },
    { key: "sold_domestic", label: "จำหน่ายในประเทศ" },
    { key: "sold_export", label: "จำหน่ายต่างประเทศ" },
    { key: "used_factory", label: "ใช้ในโรงงานอุตสาหกรรม" },
    { key: "warehouse_bonded", label: "คลังสินค้าทัณฑ์บน" },
    { key: "damaged", label: "เสียหาย" },
    { key: "others_dispatched", label: "อื่นๆ" },
    { key: "total_dispatched", label: "รวมจ่ายสินค้า" },
    { key: "remaining_balance", label: "ยอดคงเหลือ" },
    { key: "remarks", label: "หมายเหตุ" },
];

const headFields = [
    { label: "แบบฟอร์ม", value: "ภส.๐๗-๐๒" },
    { label: "ประเภทสินค้า", value: "", field: "product_category" },
    { label: "ชนิด", value: "", field: "product_type" },
    { label: "ตราหรือเครื่องหมาย/เเบบ/รุ่น/ดีกรี/ความหวาน", value: "", field: "product_brand" },
    { label: "ขนาด", value: "", field: "product_size" },
    { label: "หน่วย", value: "", field: "product_unit" },
];

const totalField = [
    { label: "ผลิตได้", value: "", field: "total_received_produced" },
    { label: "รับคืนจากคลังสินค้าทัณฑ์บน", value: "", field: "total_received_returned" },
    { label: "อื่นๆ", value: "", field: "total_received_others" },
    { label: "รวมรับสินค้า", value: "", field: "total_received_all" },
    { label: "จำหน่ายในประเทศ", value: "", field: "total_sold_domestic" },
    { label: "จำหน่ายต่างประเทศ", value: "", field: "total_sold_export" },
    { label: "ใช้ในโรงงานอุตสาหกรรม", value: "", field: "total_used_factory" },
    { label: "คลังสินค้าทัณฑ์บน", value: "", field: "total_warehouse_bonded" },
    { label: "เสียหาย", value: "", field: "total_damaged" },
    { label: "อื่นๆ", value: "", field: "total_others_dispatched" },
    { label: "รวมจ่ายสินค้า", value: "", field: "total_dispatched_all" },
    { label: "ยอดคงเหลือ", value: "", field: "final_balance" },
]

const ChecklistForm0702: React.FC<Props> = ({ context, validateResult  }) => {
    console.log("validateResult", validateResult);
    
    const ocrData = context?.fields;
    if (!ocrData) {
        return <div>ไม่พบข้อมูล</div>;
    }

    headFields.forEach(f => {
        if (f.field && f.field in ocrData) {
            f.value = (ocrData as any)[f.field];
        }
    });

    return (
        <div className="d-flex flex-column">
            {headFields.map((f, idx) => (
                <div key={idx}>
                    <div className="fw-bold">{f.label}</div>
                    <div
                        className="rounded-2 shadow-sm bg-white p-2 mb-1"
                        style={{
                            fontSize: "14px",
                            minHeight: "40px",
                            borderWidth: "2px",
                            borderStyle: "solid",
                            borderColor: "#22C659",
                        }}
                    >
                        {f.value || ""}
                    </div>
                </div>
            ))}

            {ocrData.reports && ocrData.reports.length > 0 && (
                <div className="mt-3">
                    {ocrData.reports.map((row, rowIdx) => {
                        const validateProps = getValidatePropsForDailyRow(rowIdx, validateResult);

                        return fixedLabels.map(({ key, label }) => {
                            if (typeof key === "string" && key.startsWith("__")) {
                                return (
                                    <div key={label + rowIdx} className="mb-1">
                                        <div className="fw-bold">{label}</div>
                                    </div>
                                );
                            }
                            let validateItem;
                            if (key === "total_received") validateItem = validateProps.total_received;
                            else if (key === "remaining_balance") validateItem = validateProps.remaining_balance;
                            else if (key === "total_dispatched") validateItem = validateProps.total_dispatched;

                            const passed = validateItem?.passed;

                            return (
                                <div key={label + rowIdx} className="mb-2">
                                    <div className="fw-bold">{label}</div>
                                    <div
                                        className="rounded-2 shadow-sm bg-white p-2"
                                        style={{
                                            fontSize: "14px",
                                            minHeight: "40px",
                                            border: getBorderColor(passed),
                                        }}
                                    >
                                        {typeof row[key as keyof typeof row] === "number"
                                            ? row[key as keyof typeof row]?.toLocaleString()
                                            : row[key as keyof typeof row] || ""}
                                    </div>
                                    {validateItem?.passed === false && validateItem?.reason && (
                                        <div className="text-danger small mt-1">{validateItem.reason}</div>
                                    )}
                                </div>
                            );
                        });
                    })}
                </div>
            )}

            {/* Render summary */}
            {ocrData.monthly_total && (
                <div className="mt-3">
                    <div className="fw-bold mb-2" style={{ fontSize: "18px" }}>
                        รวมเดือนนี้
                    </div>
                    {(() => {
                        const summaryValidateProps = getValidatePropsForSummary(validateResult) || {};
                        return totalField.map((f) => {
                            const value = (ocrData.monthly_total as any)[f.field];
                            const validateItem = summaryValidateProps[f.field as keyof typeof summaryValidateProps];
                            if (value === 0 || value === null || value === undefined) return null;
                            return (
                                <div key={f.field} className="mb-2">
                                    <div className="fw-bold">{f.label}</div>
                                    <div
                                        className="rounded-2 shadow-sm bg-white p-2"
                                        style={{
                                            fontSize: "14px",
                                            minHeight: "40px",
                                            border: getBorderColor(validateItem?.passed),
                                        }}
                                    >
                                        {typeof value === "number" ? value.toLocaleString() : value}
                                    </div>
                                    {validateItem?.passed === false && validateItem?.reason && (
                                        <div className="text-danger small mt-1">{validateItem.reason}</div>
                                    )}
                                </div>
                            );
                        });
                    })()}
                </div>
            )}
        </div>
    );
};

export default ChecklistForm0702;
