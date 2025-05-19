import React, { useEffect, useRef, useState } from "react";
import { OcrDetailTableDocument } from "../../types/ocrFileType";
import { validateOilCompare } from "../../utils/api/validateApi";
import { buildValidationMap } from "../../utils/function/validationMap";
import { ValidationResponse } from "../../types/validateTypes";
import { useCompanyStore } from "../../store/companyStore";

const COLUMN_LABELS: { [key: string]: string } = {
    column_1: "ชื่อผลิตภัณฑ์",
    column_2: "ชื่อผลิตภัณฑ์ (ตามหนังสืออนุมัติ)",
    column_3: "รายการวัตถุดิบหรือส่วนประกอบที่ใช้ในการผลิต",
    column_4: "ปริมาณ",
    column_5: "สินค้าต่อ 1 หน่วย",
    column_6: "สูตรการผลิต",
    column_7: "หมายเหตุ",
};

const ChecklistTable: React.FC<{ data: OcrDetailTableDocument }> = ({ data }) => {
    const { selectedCompany } = useCompanyStore();
    const factoriesNumber = localStorage.getItem("warehouse") ?? null;

    const allRows = Array.isArray(data.detail_table) ? data.detail_table : [];
    const cleanValue = (val?: string | null): string =>
        !val || val.trim() === "" || val === ":unselected:" ? "-" : val.trim();

    const fields = [
        { label: "บริษัท", value: data.company },
        { label: "คลัง", value: data.depot },
        { label: "วันที่", value: data.date },
    ];

    const cleanedFieldsRef = useRef<
        Array<{
            data?: Record<string, { value: string }>;
            detail_table?: Record<string, { value: string }>[];
        }>
    >([]);

    const [validationMap, setValidationMap] = useState<Record<string, boolean>>({});

    useEffect(() => {
        console.log(cleanedFieldsRef.current.length);

        if (cleanedFieldsRef.current.length > 1) {
            const payload = {
                docType: "oil-compare-1",
                company: selectedCompany?.name || "",
                factories: factoriesNumber || "",
                documentGroup: data.documentGroup,
                fields: cleanedFieldsRef.current,
            };

            validateOilCompare(payload).then((res: ValidationResponse) => {
                const detailRows = cleanedFieldsRef.current.find(f => f.detail_table)?.detail_table || [];

                const cleanedFieldsForValidation = detailRows.map((row) => ({
                    properties: row,
                }));

                const map = buildValidationMap(res.data, cleanedFieldsForValidation);
                setValidationMap(map);
            });
        }
    }, [data]);

    if (allRows.length === 0) return <p className="text-muted">ไม่มีข้อมูลตาราง</p>;

    let startIndex = 1;
    const checkRow = allRows[1]?.properties;
    const firstRowHasChue = Object.values(checkRow || {}).some((cell: any) => cell?.value?.includes("ชื่อ"));
    if (firstRowHasChue) startIndex = 2;

    cleanedFieldsRef.current = [];

    const cleanedDataFields: Record<string, { value: string }> = fields.reduce((acc, { label, value }) => {
        acc[label] = { value: cleanValue(value) };
        return acc;
    }, {} as Record<string, { value: string }>);

    cleanedFieldsRef.current.push({ data: cleanedDataFields });

    const detailTableArray: Record<string, { value: string }>[] = [];

    return (
        <div className="d-flex flex-column gap-1">
            {fields.map(({ label, value }) => (
                <div key={label}>
                    <div className="fw-bold">{label}</div>
                    <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
                        {cleanValue(value)}
                    </div>
                </div>
            ))}
            <hr className="border-top border-2 border-secondary my-2" />

            {allRows.map((row, rowIdx) => {
                if (rowIdx < startIndex) return null;
                const props = row.properties ?? {};
                const visibleColumns = Object.keys(COLUMN_LABELS).filter(
                    (key) => typeof props[key]?.value === "string" && props[key].value.trim() !== ""
                );

                const cleanedRow: Record<string, { value: string }> = {};

                const content = visibleColumns.map((colKey) => {
                    const rawValue = props[colKey]?.value;
                    const cleanedVal = typeof rawValue === "string" ? rawValue.replace(/^[,<>\/]/, "").trim() : rawValue;

                    cleanedRow[colKey] = { value: cleanedVal };

                    const fieldKey = `${rowIdx}-${colKey}`;
                    const isValid = validationMap[fieldKey];
                    const borderColor = isValid === false ? "#FF0100" : isValid === true ? "#22C659" : "#dee2e6";

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
                                    border: `1.5px solid ${borderColor}`,
                                }}
                            >
                                {cleanedVal}
                            </div>
                        </React.Fragment>
                    );
                });

                if (Object.keys(cleanedRow).length > 0) {
                    detailTableArray.push(cleanedRow);
                }

                return (
                    <React.Fragment key={rowIdx}>
                        {content}
                        {visibleColumns.length > 0 && rowIdx < allRows.length - 1 && <hr className="my-2" />}
                    </React.Fragment>
                );
            })}

            {detailTableArray.length > 0 && cleanedFieldsRef.current.push({ detail_table: detailTableArray })}
        </div>
    );
};

export default ChecklistTable;
