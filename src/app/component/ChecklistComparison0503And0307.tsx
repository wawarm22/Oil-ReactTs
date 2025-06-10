import React from "react";
import { OcrComparison0503And0307Document } from "../../types/ocrFileType";

interface Props {
    data: OcrComparison0503And0307Document;
}

const ChecklistComparison0503And0307: React.FC<Props> = ({ data }) => {
    const cleanValue = (val?: any): string => {
        const v = typeof val === "object" && val !== null ? val.value : val;
        if (!v || typeof v !== "string" || v.trim() === "" || v === ":unselected:") return "";
        return v.trim();
    };

    const header = [
        { label: "สำหรับสินค้า", value: data.oil },
        { label: "บริษัท", value: data.company },
        { label: "คลัง", value: data.depot },
        { label: "สำหรับน้ำมันออกจากคลังวันที่ เดือน ปี", value: data.date },
    ];

    const detailLabels = [
        { type: "group-header", label: "แบบ ภส.03-07", col: "" },
        { label: "วันที่", col: "column_1" },
        { label: "น้ำมันสำเร็จรูป (ลิตร)", col: "column_2" },
        { label: "อัตราภาษี", col: "column_3" },
        { label: "ภาษีสรรพสามิต (บาท)", col: "column_4" },
        { label: "ภาษีส่วนท้องถิ่น (บาท)", col: "column_5" },
        { type: "group-header", label: "แบบ ภส.05-03", col: "" },
        { label: "น้ำมันสำเร็จรูป (ลิตร)", col: "column_6" },
        { label: "อัตราภาษี", col: "column_7" },
        { label: "ภาษีสรรพสามิต (บาท)", col: "column_8" },
        { label: "ภาษีส่วนท้องถิ่น (บาท)", col: "column_9" }
    ];

    return (
        <div className="d-flex flex-column gap-0">
            {header.map(({ label, value }) => (
                <div key={label}>
                    <div className="fw-bold">{label}</div>
                    <div className="border rounded-2 shadow-sm bg-white p-2 mb-1" style={{ fontSize: "14px" }}>
                        {value}
                    </div>
                </div>
            ))}
            {data.detail_table.slice(2).map((row, idx) => {
                const col1Value = cleanValue(row.properties?.["column_1"]);
                const isTotalRow = col1Value.includes("รวม");

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
                            const value = cleanValue(row.properties?.[col]);
                            if (!value) return null;
                            if (col === "column_1" && isTotalRow) {
                                return (
                                    <div key={`${col}-${idx}`} className="mb-2">
                                        <div className="fw-bold text-danger">ผลรวม</div>
                                        <div className="fw-bold">{value}</div>
                                    </div>
                                );
                            }
                            return (
                                <div key={`${col}-${idx}`} className="mb-2">
                                    <div className="fw-bold">{label}</div>
                                    <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
                                        {value}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

export default ChecklistComparison0503And0307;
