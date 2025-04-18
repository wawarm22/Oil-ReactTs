import React from "react";
import { OcrTaxDocument } from "../../types/ocrFileType";

const ChecklistTax: React.FC<{ data: OcrTaxDocument }> = ({ data }) => {
    
    const fields = [
        { label: "บริษัท", value: data.company_name },
        { label: "คลังน้ำมัน", value: data.branch_no },
        { label: "วันที่", value: data.tax_date },
        {
            label: "สำหรับสินค้าที่ผลิตขึ้นจากสินค้าที่ได้เสียภาษีไว้แล้วรวมเป็นเงิน",
            value: data.amount,
        },
    ];

    return (
        <div className="d-flex flex-column gap-1">
            {fields.map((field, index) => (
                <React.Fragment key={index}>
                    <div className="fw-bold">{field.label}</div>
                    <div
                        className="border rounded-2 shadow-sm bg-white mb-1"
                        style={{ fontSize: "14px", whiteSpace: "pre-line", padding: "10px 10px" }}
                    >
                        {field.value}
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
};

export default ChecklistTax;
