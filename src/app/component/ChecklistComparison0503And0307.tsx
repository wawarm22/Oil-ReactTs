import React from "react";
import { CompareOcrDoc03070503 } from "../../types/validateTypes";
import { ComparisonForm0307Validation, ComparisonForm0503Validation, ValidateComparison03070503Result } from "../../types/validateResTypes";
import { OcrComparison0503And0307Document } from "../../types/ocrFileType";
import { readableNumber } from "../../utils/function/format";
import { borderColor } from "../../utils/function/getBorderColor";

interface Props {
    data: OcrComparison0503And0307Document;
    validateResult: ValidateComparison03070503Result;
    context: CompareOcrDoc03070503;
}

function isFieldValidation(obj: any): obj is { value: any } {
    return typeof obj === "object" && obj !== null && "value" in obj;
}

const ChecklistComparison0503And0307: React.FC<Props> = ({ context, validateResult }) => {
    const ocrData = context.fields;
    if (!ocrData) return <div>ไม่พบข้อมูล</div>;

    // เพิ่ม key ที่ตรงกับ validateResult
    const header = [
        { label: "สำหรับสินค้า", value: ocrData.product, key: "product" },
        { label: "บริษัท", value: ocrData.company, key: "company" },
        { label: "คลัง", value: ocrData.factory, key: "factory" },
        { label: "สำหรับน้ำมันออกจากคลังวันที่ เดือน ปี", value: ocrData.issuedDate, key: "issuedDate" },
    ];

    const detailLabels = [
        { type: "group-header", label: "แบบ ภส.03-07", col: "" },
        { label: "วันที่", col: "date" },
        { label: "น้ำมันสำเร็จรูป (ลิตร)", col: "form0307.refined_oil_volume" },
        { label: "อัตราภาษี", col: "form0307.tax_rate" },
        { label: "ภาษีสรรพสามิต (บาท)", col: "form0307.excise_tax_baht" },
        { label: "ภาษีส่วนท้องถิ่น (บาท)", col: "form0307.local_tax_baht" },
        { type: "group-header", label: "แบบ ภส.05-03", col: "" },
        { label: "น้ำมันสำเร็จรูป (ลิตร)", col: "form0503.base_oil_volume" },
        { label: "อัตราภาษี", col: "form0503.tax_rate" },
        { label: "ภาษีสรรพสามิต (บาท)", col: "form0503.excise_tax_baht" },
        { label: "ภาษีส่วนท้องถิ่น (บาท)", col: "form0503.local_tax_baht" }
    ];

    const summaryFields0307 = [
        { key: "refined_oil_volume", label: "น้ำมันสำเร็จรูป (ลิตร)" },
        { key: "tax_rate", label: "อัตราภาษี" },
        { key: "excise_tax_baht", label: "ภาษีสรรพสามิต (บาท)" },
        { key: "local_tax_baht", label: "ภาษีส่วนท้องถิ่น (บาท)" },
    ];
    const summaryFields0503 = [
        { key: "base_oil_volume", label: "น้ำมันสำเร็จรูป (ลิตร)" },
        { key: "tax_rate", label: "อัตราภาษี" },
        { key: "excise_tax_baht", label: "ภาษีสรรพสามิต (บาท)" },
        { key: "local_tax_baht", label: "ภาษีส่วนท้องถิ่น (บาท)" },
    ];

    return (
        <div className="d-flex flex-column gap-0">
            {header.map(({ label, value, key }) => {
                const validation = (validateResult as any)?.[key];
                const passed = validation?.passed;
                const displayValue = isFieldValidation(value) ? value.value : value;
                return (
                    <div key={label}>
                        <div className="fw-bold">{label}</div>
                        <div
                            className="rounded-2 shadow-sm bg-white p-2 mb-1"
                            style={{
                                fontSize: "14px",
                                border: borderColor(passed)
                            }}
                        >
                            {displayValue}
                        </div>
                    </div>
                );
            })}
            {/* --- detail table --- */}
            {ocrData.items.map((row, idx) => {
                const col1Value = row.date;
                const isTotalRow = typeof col1Value === "string" && col1Value.includes("รวม");

                return (
                    <div key={`data-row-${idx}`} className="mb-0 pb-0 border-2">
                        {detailLabels.map(({ label, col, type }, i) => {
                            if (type === "group-header") {
                                return (
                                    <div key={`group-header-${i}`} className="mb-2 mt-3">
                                        <div className="fw-bold" style={{ fontSize: 16 }}>{label}</div>
                                    </div>
                                );
                            }

                            let value: any, validation: any, passed: boolean | undefined;
                            if (col.startsWith("form0307.")) {
                                const key = col.split(".")[1] as keyof typeof row.form0307;
                                value = row.form0307[key];
                                validation = validateResult?.items?.[idx]?.form0307?.[key];
                            } else if (col.startsWith("form0503.")) {
                                const key = col.split(".")[1] as keyof typeof row.form0503;
                                value = row.form0503[key];
                                validation = validateResult?.items?.[idx]?.form0503?.[key];
                            } else {
                                value = row[col as keyof typeof row];
                                validation = validateResult?.items?.[idx]?.[col as keyof typeof row];
                            }
                            passed = validation?.passed;

                            if (value === undefined || value === null || value === "") return null;

                            if (col === "date" && isTotalRow) {
                                return (
                                    <div key={`${col}-${idx}`} className="mb-2">
                                        <div className="fw-bold text-danger">ผลรวม</div>
                                        <div className="fw-bold">{value}</div>
                                    </div>
                                );
                            }

                            const displayValue = typeof value === "object" && value !== null && "value" in value ? value.value : value;

                            return (
                                <div key={`${col}-${idx}`} className="mb-2">
                                    <div className="fw-bold">{label}</div>
                                    <div
                                        className="rounded-2 shadow-sm bg-white p-2"
                                        style={{ fontSize: "14px", border: borderColor(passed) }}
                                    >
                                        {readableNumber(displayValue)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
            <div className="mt-1">
                <div className="fw-bold mb-0">ผลรวม</div>
                <div>
                    <div className="fw-bold my-1">แบบ ภส.03-07</div>
                    {summaryFields0307.map(({ key, label }) => {
                        const k = key as keyof ComparisonForm0307Validation;
                        return (
                            <div key={key} className="mb-2">
                                <div className="fw-bold">{label}</div>
                                <div
                                    className="rounded-2 shadow-sm bg-white p-2"
                                    style={{
                                        fontSize: "14px",
                                        border: borderColor(validateResult.summary?.form0307?.[k]?.passed),
                                    }}
                                >
                                    {readableNumber(
                                        isFieldValidation(ocrData.summary?.form0307?.[k])
                                            ? ocrData.summary.form0307[k].value
                                            : ocrData.summary.form0307[k]
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div>
                    <div className="fw-bold mt-3">แบบ ภส.05-03</div>
                    {summaryFields0503.map(({ key, label }) => {
                        const k = key as keyof ComparisonForm0503Validation;
                        return (
                            <div key={key} className="mb-2">
                                <div className="fw-bold">{label}</div>
                                <div
                                    className="rounded-2 shadow-sm bg-white p-2"
                                    style={{
                                        fontSize: "14px",
                                        border: borderColor(validateResult.summary?.form0503?.[k]?.passed),
                                    }}
                                >
                                    {readableNumber(
                                        isFieldValidation(ocrData.summary?.form0503?.[k])
                                            ? ocrData.summary.form0503[k].value
                                            : ocrData.summary.form0503[k]
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
};

export default ChecklistComparison0503And0307;
