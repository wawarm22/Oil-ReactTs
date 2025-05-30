import React from "react";
import { OcrTaxReceiptExciseDocument } from "../../types/ocrFileType";

interface Props {
    data: OcrTaxReceiptExciseDocument;
}

const ChecklistTaxReceiptExcise: React.FC<Props> = ({ data }) => {

    const cleanValue = (val?: any): string => {
        const v = typeof val === "object" && val !== null ? val.value : val;
        if (!v || typeof v !== "string" || v.trim() === "" || v === ":unselected:") return "";
        return v.trim();
    };

    const fields = [
        { label: "เลขที่ใบเสร็จ", value: data.receipt_no },
        { label: "เลขที่คุมเอกสาร", value: data.doc_no },
        { label: "วันที่ เดือน ปี", value: data.submit_date },
        { label: "เวลา", value: data.submit_time },
        { label: "ที่ทำการ", value: data.office },
        { label: "เดือน/ปี", value: data.date },
        { label: "ได้รับเงิน", value: data.received_from },
        { label: "ผู้ประกอบการ", value: data.tycoon },
        { label: "เลขประจำตัวผู้เสียภาษี", value: data.tax_id },
        { label: "เลขทะเบียนสรรพสามิต", value: data.excise_id },
    ];

    return (
        <div className="d-flex flex-column gap-2">
            {fields.map(({ label, value }, idx) => (
                <div key={idx} className="mb-1">
                    <div className="fw-bold">{label}</div>
                    <div
                        className="rounded-2 shadow-sm bg-white p-2"
                        style={{ fontSize: "14px", border: `1.5px solid #22C659` }}
                    >
                        {cleanValue(value)}
                    </div>
                </div>
            ))}

            {data.detail_table?.length > 0 && (
                <>
                    <hr className="border-top border-2 border-secondary mt-2 mb-2" />
                    {(() => {
                        const details = [];
                        let foundSummary = false;
                        console.log(foundSummary);
                        
                        for (let i = 1; i < data.detail_table.length; i++) {
                            const row = data.detail_table[i]?.properties || {};
                            const label = cleanValue(row.column_1);
                            const amount = cleanValue(row.column_2);

                            if (!label) continue;

                            if (label.includes("รวม")) {
                                details.push(
                                    <div key={`total-${i}`} className="mb-2">
                                        <div className="fw-bold">รวม</div>
                                        <div className="rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px", border: `1.5px solid #22C659` }}>{amount}</div>
                                    </div>
                                );
                                foundSummary = true;
                                break;
                            }

                            details.push(
                                <div key={`row-${i}`} className="mb-2">
                                    <div className="fw-bold">รายละเอียด</div>
                                    <span className="fw-bold">รายการ</span>
                                    <div className="rounded-2 shadow-sm bg-white p-2 mb-1" style={{ fontSize: "14px", border: `1.5px solid #22C659` }}>{label}</div>
                                    <div className="fw-bold">จำนวนเงิน</div>
                                    <div className="rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px", border: `1.5px solid #22C659` }}>{amount}</div>
                                </div>
                            );
                        }

                        return details;
                    })()}
                </>
            )}

            {cleanValue(data.name) && (
                <>
                    <hr className="border-top border-2 border-secondary mt-2 mb-2" />
                    <div className="fw-bold">ลงชื่อผู้รับเงิน</div>
                    <div className="rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px", border: `1.5px solid #22C659` }}>
                        {cleanValue(data.name)}
                    </div>
                </>
            )}
        </div>
    );
};

export default ChecklistTaxReceiptExcise;
