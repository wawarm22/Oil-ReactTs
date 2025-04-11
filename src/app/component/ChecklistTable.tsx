import React from "react";
import { OcrDetailTableDocument } from "../../types/ocrFileType";

const COLUMN_LABELS: { [key: string]: string } = {
    column_1: "ชื่อผลิตภัณฑ์",
    column_2: "รายการวัตถุดิบหรือหรือส่วนประกอบที่ใช้ในการผลิต",
    column_3: "ปริมาณ",
    column_4: "สินค้าต่อ 1 หน่วย",
    column_5: "สูตรการผลิต",
    column_6: "หมายเหตุ",
};

const ChecklistTable: React.FC<{ data: OcrDetailTableDocument }> = ({ data }) => {
    const allRows = Array.isArray(data.detail_table) ? data.detail_table : [];

    if (allRows.length === 0) {
        return <p className="text-muted">ไม่มีข้อมูลตาราง</p>;
    }

    return (
        <div className="d-flex flex-column gap-1">
            {allRows.map((row, rowIdx) => {
                if (rowIdx === 0 && data.pageNumber === "1") return null;

                const props = row.properties ?? {};

                const visibleColumns = Object.keys(COLUMN_LABELS).filter((key) => {
                    const value = props[key]?.value;
                    return typeof value === "string" && value.trim() !== "";
                });

                return (
                    <React.Fragment key={rowIdx}>
                        {visibleColumns.map((colKey) => {
                            const rawValue = props[colKey]?.value;
                            const cleanedValue = typeof rawValue === "string"
                                ? rawValue.replace(/^[,<>\/]/, "").trim()
                                : rawValue;

                            return (
                                <React.Fragment key={colKey}>
                                    <div className="fw-bold" style={{ fontSize: "14px" }}>
                                        {COLUMN_LABELS[colKey]}
                                    </div>
                                    <div
                                        className="border rounded-2 shadow-sm bg-white mb-1"
                                        style={{ fontSize: "14px", whiteSpace: "pre-line", padding: "10px 10px" }}
                                    >
                                        {cleanedValue}
                                    </div>
                                </React.Fragment>
                            );
                        })}
                        {visibleColumns.length > 0 && rowIdx < allRows.length - 1 && (
                            <hr className="my-2" />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default ChecklistTable;
