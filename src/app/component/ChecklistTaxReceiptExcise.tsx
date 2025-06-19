import React from "react";
import { OcrTaxReceiptExciseDocument } from "../../types/ocrFileType";
import { OcrReceiptExciseData } from "../../types/validateTypes";
import { ValidateReceiptExciseResult } from "../../types/validateResTypes";

interface Props {
    data: OcrTaxReceiptExciseDocument;
    validateResult: ValidateReceiptExciseResult | null;
    context: OcrReceiptExciseData | null;
}

const ChecklistTaxReceiptExcise: React.FC<Props> = ({ validateResult, context }) => {
    const ocrData = context; 
    
    const cleanValue = (val?: any): string => {
        const v = typeof val === "object" && val !== null ? val.value : val;
        if (!v || typeof v !== "string" || v.trim() === "" || v === ":unselected:") return "";
        return v.trim();
    };

    const fieldDefs = [
        { label: "เลขที่ใบเสร็จ", key: "receipt_no" },
        { label: "เลขที่คุมเอกสาร", key: "doc_no" },
        { label: "วันที่ เดือน ปี", key: "submit_date" },
        { label: "เวลา", key: "submit_time" },
        { label: "ที่ทำการ", key: "office" },
        { label: "เดือน/ปี", key: "period" },
        { label: "ได้รับเงิน", key: "received_from" },
        { label: "ผู้ประกอบการ", key: "operator" },
        { label: "เลขประจำตัวผู้เสียภาษี", key: "tax_id" },
        { label: "เลขทะเบียนสรรพสามิต", key: "excise_id" },
    ];

    const getItemColor = (field?: { passed?: boolean }) =>
        field?.passed === false
            ? "#FF0100"
            : field?.passed === true
                ? "#22C659"
                : "#CED4DA";

    return (
        <div className="d-flex flex-column gap-2">
            {fieldDefs.map(({ label, key }, idx) => {
                const value = ocrData?.fields[key as keyof OcrReceiptExciseData["fields"]];
                const validateField = validateResult?.[key as keyof ValidateReceiptExciseResult];
                const borderColor = getItemColor(
                    !Array.isArray(validateField) && typeof validateField === "object"
                        ? (validateField as { passed?: boolean })
                        : undefined
                );

                let showValue: any = value;
                if (
                    validateField &&
                    !Array.isArray(validateField) &&
                    typeof validateField === "object" &&
                    "value" in validateField
                ) {
                    showValue = validateField.value;
                }

                return (
                    <div key={idx} className="mb-1">
                        <div className="fw-bold">{label}</div>
                        <div
                            className="rounded-2 shadow-sm bg-white p-2"
                            style={{
                                fontSize: "14px",
                                border: `1.5px solid ${borderColor}`
                            }}
                        >
                            {cleanValue(showValue)}
                        </div>
                    </div>
                );
            })}

            {Array.isArray(ocrData?.fields.items) && ocrData.fields.items.length > 0 && (
                <>
                    <hr className="border-top border-2 border-secondary mt-2 mb-2" />
                    {ocrData.fields.items.map((item, i) => (
                        <div key={`item-${i}`} className="mb-2">
                            <div className="fw-bold">รายละเอียด</div>
                            <span className="fw-bold">รายการ</span>
                            <div
                                className="rounded-2 shadow-sm bg-white p-2 mb-1"
                                style={{
                                    fontSize: "14px",
                                    border: `1.5px solid ${getItemColor(validateResult?.items?.[i]?.description)}`
                                }}
                            >
                                {cleanValue(
                                    Array.isArray(validateResult?.items)
                                        ? validateResult.items[i]?.description?.value
                                        : item.description
                                )}
                            </div>
                            <div className="fw-bold">จำนวนเงิน</div>
                            <div
                                className="rounded-2 shadow-sm bg-white p-2"
                                style={{
                                    fontSize: "14px",
                                    border: `1.5px solid ${getItemColor(validateResult?.items?.[i]?.amount)}`
                                }}
                            >
                                {Array.isArray(validateResult?.items)
                                    ? validateResult.items[i]?.amount?.value
                                    : item.amount}
                            </div>
                        </div>
                    ))}
                    <div className="mb-2">
                        <div className="fw-bold">รวม</div>
                        <div
                            className="rounded-2 shadow-sm bg-white p-2"
                            style={{
                                fontSize: "14px",
                                border: `1.5px solid ${getItemColor(
                                    !Array.isArray(validateResult?.total_amount) &&
                                        typeof validateResult?.total_amount === "object"
                                        ? validateResult?.total_amount
                                        : undefined
                                )}`
                            }}
                        >
                            {validateResult?.total_amount &&
                                !Array.isArray(validateResult.total_amount) &&
                                "value" in validateResult.total_amount
                                ? validateResult.total_amount.value
                                : ocrData.fields.total_amount}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ChecklistTaxReceiptExcise;
