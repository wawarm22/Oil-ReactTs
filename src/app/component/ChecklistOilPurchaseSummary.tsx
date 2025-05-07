import React from "react";
import { OcrOilPurchaseSummaryDocument } from "../../types/ocrFileType";

interface Props {
    data: OcrOilPurchaseSummaryDocument;
}

const ChecklistOilPurchaseSummary: React.FC<Props> = ({ data }) => {
    const cleanValue = (val?: any): string => {
        const v = typeof val === "object" && val !== null ? val.value : val;
        if (!v || typeof v !== "string" || v.trim() === "" || v === ":unselected:") return "";
        return v.trim();
    };

    const staticFields = [
        { label: "บริษัท", value: data.company_name },
        { label: "เริ่มต้น - สิ้นสุด เดือน ปี", value: data.date },
    ];

    const detailLabels: { [key: string]: string } = {
        no: "ลำดับที่",
        tax_no: "เลขที่ใบกำกับภาษี",
        date_tax: "วันที่ใบกำกับภาษี",
        oil_type: "ประเภทน้ำมันพื้นฐาน",
        oil_value: "ปริมาณน้ำมัน (ลิตร)",
    };

    return (
        <div className="d-flex flex-column gap-2">
            {staticFields.map(({ label, value }, idx) => (
                <div key={`static-${idx}`} className="mb-1">
                    <div className="fw-bold">{label}</div>
                    <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
                        {cleanValue(value)}
                    </div>
                </div>
            ))}

            <hr className="border-top border-2 border-secondary mt-2 m-0" />

            {data.detail_table.map((row, rowIdx) => (
                <div key={`row-${rowIdx}`} className="pb-2 border-bottom border-2">
                    {Object.entries(detailLabels).map(([key, label]) => {
                        const value = cleanValue(row.properties?.[key]);
                        if (!value) return null;
                        return (
                            <div key={`${rowIdx}-${key}`} className="mb-2">
                                <div className="fw-bold">{label}</div>
                                <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
                                    {value}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default ChecklistOilPurchaseSummary;
