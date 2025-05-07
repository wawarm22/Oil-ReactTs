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

    const labelMap: { [key: string]: { label1: string; label2: string } } = {};
    const colCount = 11;

    for (let col = 1; col <= colCount; col++) {
        const key = `column_${col}`;
        const label1 = cleanValue(data.detail_table[0]?.properties?.[key]);
        const label2 = cleanValue(data.detail_table[1]?.properties?.[key]);

        if (label1 || label2) {
            labelMap[key] = { label1, label2 };
        }
    }

    return (
        <div className="d-flex flex-column gap-2">
            {data.detail_table.slice(2).map((row, idx) => {
                const col1Value = cleanValue(row.properties?.["column_1"]);
                const isTotalRow = col1Value.includes("รวม");

                return (
                    <div key={`data-row-${idx}`} className="mb-3 pb-2 border-bottom border-2">
                        {Object.entries(labelMap).map(([colKey, { label1, label2 }]) => {
                            const value = cleanValue(row.properties?.[colKey]);

                            // ถ้าเป็น column_1 และเป็นแถวรวม → ไม่ต้องแสดงค่า column_1
                            if (colKey === "column_1" && isTotalRow) {
                                return (
                                    <div key={`${colKey}-${idx}`} className="mb-2">
                                        <div className="fw-bold text-danger">ผลรวม</div>
                                        <div className="fw-bold">{label1}</div>
                                    </div>
                                );
                            }

                            // ถ้าไม่มี value ใน cell นี้ → ไม่ต้องแสดง
                            if (!value) return null;

                            return (
                                <div key={`${colKey}-${idx}`} className="mb-2">
                                    <div className="fw-bold">
                                        {/* ถ้าเป็น column_1 ของผลรวม → label2 ไม่ต้องแสดง */}
                                        {isTotalRow && colKey === "column_1" ? null : (
                                            <>
                                                {label1 && <div>{label1}</div>}
                                                {label2 && <div style={{ fontSize: "14px", color: "#555" }}>{label2}</div>}
                                            </>
                                        )}
                                    </div>
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
