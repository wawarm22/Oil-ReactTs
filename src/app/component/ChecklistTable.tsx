import React, { useEffect, useRef, useState } from "react";
import { OcrDetailTableDocument } from "../../types/ocrFileType";
import { validateOilCompare } from "../../utils/api/validateApi";
import { OCRValidationPayload } from "../../types/validateTypes";
import { buildValidationMap } from "../../utils/function/validationMap";
import { ValidationResponse } from "../../types/validateTypes";

const COLUMN_LABELS: { [key: string]: string } = {
    column_1: "ชื่อผลิตภัณฑ์",
    column_2: "ชื่อผลิตภัณฑ์ (ตามหนังสืออนุมัติ)",
    column_3: "รายการวัตถุดิบหรือหรือส่วนประกอบที่ใช้ในการผลิต",
    column_4: "ปริมาณ",
    column_5: "สินค้าต่อ 1 หน่วย",
    column_6: "สูตรการผลิต",
    column_7: "หมายเหตุ",
};

const ChecklistTable: React.FC<{ data: OcrDetailTableDocument }> = ({ data }) => {
    const allRows = Array.isArray(data.detail_table) ? data.detail_table : [];

    const cleanedRowsRef = useRef<OCRValidationPayload>({
        docType: "oil-compare-1",
        fields: [],
    });

    const [validationMap, setValidationMap] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (cleanedRowsRef.current.fields.length > 0) {
            console.log("cleanedRowsRef", cleanedRowsRef);

            validateOilCompare(cleanedRowsRef.current).then((res: ValidationResponse) => {
                const map = buildValidationMap(res.data, cleanedRowsRef.current.fields);
                setValidationMap(map);
            });
        }
    }, []);

    if (allRows.length === 0) {
        return <p className="text-muted">ไม่มีข้อมูลตาราง</p>;
    }

    let startIndex = 1;
    const checkRow = allRows[1]?.properties;
    const firstRowHasChue = Object.values(checkRow || {}).some(
        (cell: any) => cell?.value?.includes("ชื่อ")
    );

    if (firstRowHasChue) startIndex = 2;

    return (
        <div className="d-flex flex-column gap-1">
            {(() => {
                cleanedRowsRef.current.fields = [];
                return null;
            })()}
            {allRows.map((row, rowIdx) => {
                if (rowIdx < startIndex) return null;

                const props = row.properties ?? {};
                const visibleColumns = Object.keys(COLUMN_LABELS).filter((key) => {
                    const value = props[key]?.value;
                    return typeof value === "string" && value.trim() !== "";
                });

                const cleanedRow: { [key: string]: { value: string } } = {};

                return (
                    <React.Fragment key={rowIdx}>
                        {visibleColumns.map((colKey) => {
                            const rawValue = props[colKey]?.value;
                            const cleanedValue =
                                typeof rawValue === "string" ? rawValue.replace(/^[,<>\/]/, "").trim() : rawValue;

                            cleanedRow[colKey] = { value: cleanedValue };

                            const fieldKey = `${rowIdx}-${colKey}`;
                            const isValid = validationMap[fieldKey];

                            return (
                                <React.Fragment key={colKey}>
                                    <div className="fw-bold" style={{ fontSize: "14px" }}>
                                        {COLUMN_LABELS[colKey]}
                                    </div>
                                    <div
                                        className={`border rounded-2 shadow-sm bg-white mb-1 ${isValid === false ? "border-danger" : ""}`}
                                        style={{
                                            fontSize: "14px",
                                            whiteSpace: "pre-line",
                                            padding: "10px 10px",
                                        }}
                                    >
                                        {cleanedValue}
                                    </div>
                                </React.Fragment>
                            );
                        })}
                        {visibleColumns.length > 0 && rowIdx < allRows.length - 1 && <hr className="my-2" />}
                        {(() => {
                            if (Object.keys(cleanedRow).length > 0) {
                                cleanedRowsRef.current.fields.push({ properties: cleanedRow });
                            }
                            return null;
                        })()}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default ChecklistTable;
