import React, { useEffect, useRef, useState } from "react";
import { OcrDetailTableDocument } from "../../types/ocrFileType";
import { validateOilCompare } from "../../utils/api/validateApi";
import { OilCompareProductValidation, ValidateOilCompareResponse } from "../../types/validateTypes";
import { useCompanyStore } from "../../store/companyStore";
import { buildValidationMap, ValidationStatus } from "../../utils/function/validationMap";

type HeaderValidationMap = {
    company?: ValidationStatus;
    warehouse?: ValidationStatus;
};

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
    const [headerValidation, setHeaderValidation] = useState<HeaderValidationMap>({});

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

    const [validationMap, setValidationMap] = useState<Record<string, ValidationStatus>>({});

    let startIndex = 1;
    const checkRow = allRows[1]?.properties;
    const firstRowHasChue = Object.values(checkRow || {}).some((cell: any) => cell?.value?.includes("ชื่อ"));
    if (firstRowHasChue) startIndex = 2;

    const cleanedDataFields: Record<string, { value: string }> = fields.reduce((acc, { label, value }) => {
        acc[label] = { value: cleanValue(value) };
        return acc;
    }, {} as Record<string, { value: string }>);

    const detailTableArray: Array<{ properties: Record<string, { value: string }> }> = [];
    allRows.forEach((row, rowIdx) => {
        if (rowIdx < startIndex) return;
        const props = row.properties ?? {};
        const cleanedRow: Record<string, { value: string }> = {};
        Object.keys(COLUMN_LABELS).forEach((colKey) => {
            const rawValue = props[colKey]?.value;
            const cleanedVal = typeof rawValue === "string" ? rawValue.replace(/^[,<>\/]/, "").trim() : rawValue;
            cleanedRow[colKey] = { value: cleanedVal };
        });
        if (Object.keys(cleanedRow).length > 0) {
            detailTableArray.push({ properties: cleanedRow });
        }
    });

    cleanedFieldsRef.current = [];
    cleanedFieldsRef.current.push({ data: cleanedDataFields });
    if (detailTableArray.length > 0) cleanedFieldsRef.current.push({ detail_table: detailTableArray.map(r => r.properties) });

    useEffect(() => {
        if (cleanedFieldsRef.current.length > 1) {
            const payload = {
                docType: "oil-compare-1",
                company: selectedCompany?.name || "",
                factories: factoriesNumber || "",
                documentGroup: data.documentGroup,
                fields: cleanedFieldsRef.current,
            };

            validateOilCompare(payload).then((res: ValidateOilCompareResponse) => {
                const firstGroup = Array.isArray(res.data) && res.data.length > 0 && !("product" in res.data[0]) ? res.data[0] : undefined;

                function getStatus(fieldObj: { passed?: boolean, status?: string } | undefined): ValidationStatus | undefined {
                    if (!fieldObj) return undefined;
                    if (typeof fieldObj.status === "string") return fieldObj.status as ValidationStatus;
                    if (typeof fieldObj.passed === "boolean") return fieldObj.passed ? "passed" : "failed";
                    return undefined;
                }

                setHeaderValidation({
                    company: getStatus(firstGroup?.company),
                    warehouse: getStatus(firstGroup?.warehouse),
                });

                const productValidationArray = res.data.filter(
                    (item): item is OilCompareProductValidation =>
                        "product" in item && "validations" in item
                );
                const map = buildValidationMap(productValidationArray, detailTableArray);
                setValidationMap(map);
            });
        }
    }, [data]);


    if (allRows.length === 0) return <p className="text-muted">ไม่มีข้อมูลตาราง</p>;

    const getBorderColor = (status?: ValidationStatus) =>
        status === "failed" ? "#FF0100" :
            status === "warning" ? "#FFCA04" :
                status === "passed" ? "#22C659" : "#22C659";

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
