import React from "react";
import { OcrDetailTableDocument } from "../../types/ocrFileType";
import { ValidationStatus } from "../../utils/function/validationMap";

interface ChecklistTableProps {
    data: OcrDetailTableDocument;
    validateResult?: {
        headerValidation?: { company?: ValidationStatus; warehouse?: ValidationStatus; };
        validationMap?: Record<string, ValidationStatus>;
    };
}

const COLUMN_LABELS: { [key: string]: string } = {
    column_1: "ชื่อผลิตภัณฑ์",
    column_2: "ชื่อผลิตภัณฑ์ (ตามหนังสืออนุมัติ)",
    column_3: "รายการวัตถุดิบหรือส่วนประกอบที่ใช้ในการผลิต",
    column_4: "ปริมาณ",
    column_5: "สินค้าต่อ 1 หน่วย",
    column_6: "สูตรการผลิต",
    column_7: "หมายเหตุ",
};

const ChecklistTable: React.FC<ChecklistTableProps> = ({ data, validateResult }) => {
    const allRows = Array.isArray(data.detail_table) ? data.detail_table : [];
    const cleanValue = (val?: string | null): string =>
        !val || val.trim() === "" || val === ":unselected:" ? "-" : val.trim();

    const fields = [
        { label: "บริษัท", value: data.company },
        { label: "คลัง", value: data.depot },
        { label: "วันที่", value: data.date },
    ];

    let startIndex = 1;
    const checkRow = allRows[1]?.properties;
    const firstRowHasChue = Object.values(checkRow || {}).some((cell: any) => cell?.value?.includes("ชื่อ"));
    if (firstRowHasChue) startIndex = 2;

    const getBorderColor = (status?: ValidationStatus) =>
        status === "failed" ? "#FF0100" :
            status === "warning" ? "#FFCA04" :
                status === "passed" ? "#22C659" : "#22C659";

    // ใช้ validateResult ที่ส่งมาจาก parent
    const headerValidation = validateResult?.headerValidation ?? {};
    const validationMap = validateResult?.validationMap ?? {};

    const headerIndexMap = { "บริษัท": "company", "คลัง": "warehouse" } as const;
    return (
        <div className="d-flex flex-column gap-1">
            {fields.map(({ label, value }) => {
                const headerKey = headerIndexMap[label as keyof typeof headerIndexMap] as keyof typeof headerValidation;
                const status = headerValidation[headerKey];
                return (
                    <div key={label}>
                        <div className="fw-bold">{label}</div>
                        <div
                            className="rounded-2 shadow-sm bg-white p-2"
                            style={{
                                fontSize: "14px",
                                border: `1.5px solid ${getBorderColor(status)}`,
                            }}
                        >
                            {cleanValue(value)}
                        </div>
                    </div>
                );
            })}
            <hr className="border-top border-2 border-secondary my-2" />

            {allRows.map((row, rowIdx) => {
                if (rowIdx < startIndex) return null;
                const props = row.properties ?? {};
                const visibleColumns = Object.keys(COLUMN_LABELS).filter(
                    (key) => typeof props[key]?.value === "string" && props[key].value.trim() !== ""
                );

                return (
                    <React.Fragment key={rowIdx}>
                        {visibleColumns.map((colKey) => {
                            const rawValue = props[colKey]?.value;
                            const cleanedVal = typeof rawValue === "string" ? rawValue.replace(/^[,<>\/]/, "").trim() : rawValue;
                            const fieldKey = `${rowIdx - startIndex}-${colKey}`;
                            const validationStatus = validationMap[fieldKey];

                            return (
                                <React.Fragment key={colKey}>
                                    <div className="fw-bold" style={{ fontSize: "14px" }}>
                                        {COLUMN_LABELS[colKey]}
                                    </div>
                                    <div
                                        className="rounded-2 shadow-sm bg-white mb-1"
                                        style={{
                                            fontSize: "14px",
                                            whiteSpace: "pre-line",
                                            padding: "10px 10px",
                                            border: `1.5px solid ${getBorderColor(validationStatus)}`,
                                        }}
                                    >
                                        {cleanedVal}
                                    </div>
                                </React.Fragment>
                            );
                        })}
                        {visibleColumns.length > 0 && rowIdx < allRows.length - 1 && <hr className="my-2" />}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default ChecklistTable;
