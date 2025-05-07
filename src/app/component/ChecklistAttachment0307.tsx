import React, { useEffect, useMemo, useState } from "react";
import { OcrAttachment0307Document } from "../../types/ocrFileType";
import { cleanCellValue, renderLabel } from "../../utils/function/ocrUtils";
import { validateOil0701 } from "../../utils/api/validateApi";
import { useCompanyStore } from "../../store/companyStore";

interface Props {
    data: OcrAttachment0307Document;
}

const ChecklistAttachment0307: React.FC<Props> = ({ data }) => {
    const { selectedCompany } = useCompanyStore();
    const factoriesNumber = localStorage.getItem("warehouse") ?? null;
    const [_validationResult, setValidationResult] = useState<any>(null);

    const tables = data.detail_table ?? [];
    if (tables.length < 3) return <p className="text-muted">ไม่พบข้อมูลตาราง</p>;

    const labelMap: Record<string, string> = {};
    const propsRow1 = tables[1]?.properties || {};
    const propsRow2 = tables[2]?.properties || {};

    for (let col = 1; col <= 11; col++) {
        const key = `column_${col}`;
        let label = "";

        if (col >= 10) {
            label = cleanCellValue(propsRow2[key]?.value);
        } else {
            label = cleanCellValue(propsRow1[key]?.value);
        }

        if (label) labelMap[key] = label;
    }

    const normalRows: typeof tables = [];
    const summaryRows: typeof tables = [];

    let foundSummary = false;
    for (const row of tables.slice(3)) {
        const col1 = cleanCellValue(row.properties?.column_1?.value ?? "");
        if (!foundSummary && col1.includes("รวม")) {
            foundSummary = true;
        }

        if (foundSummary) {
            summaryRows.push(row);
        } else {
            normalRows.push(row);
        }
    }

    const ocrFieldRows = useMemo(() => {
        const rows: { properties: Record<string, { value: string }> }[] = [];
    
        const headerProps: Record<string, { value: string }> = {
            "เอกสาร": { value: cleanCellValue(data.header) },
            "วันที่": { value: cleanCellValue(data.date) },
            "น้ำมัน": { value: cleanCellValue(data.oil) },
        };
        rows.push({ properties: headerProps });
    
        normalRows.forEach((row, rowIndex) => {
            const rowProps: Record<string, { value: string }> = {};
    
            Object.entries(labelMap).forEach(([colKey, label]) => {
                const value = cleanCellValue(row.properties?.[colKey]?.value);
                if (value && value !== "-") {
                    rowProps[`${label} (แถว ${rowIndex + 4})`] = { value };
                }
            });
    
            rows.push({ properties: rowProps });
        });
    
        summaryRows.forEach((row, sIdx) => {
            const rowProps: Record<string, { value: string }> = {};
    
            Object.entries(labelMap).forEach(([colKey, label]) => {
                const props = row.properties || {};
                const value = cleanCellValue(props?.[colKey]?.value);
    
                if (colKey === "column_1") return;     
                if (colKey === "column_7") {
                    const customLabel = cleanCellValue(props?.[colKey]?.value);
                    if (customLabel) {
                        rowProps[customLabel] = { value: "-" };
                    }
                    return;
                }
    
                if (!value || value === "-") return;
    
                rowProps[`${label} (รวม แถว ${sIdx + 4 + normalRows.length})`] = { value };
            });
    
            if (Object.keys(rowProps).length > 0) {
                rows.push({ properties: rowProps });
            }
        });
    
        const footerProps: Record<string, { value: string }> = {
            "ลงชื่อ ผู้ประกอบอุตสาหกรรม": { value: cleanCellValue(data.name) },
            "ตำแหน่ง": { value: cleanCellValue(data.position) },
        };
        rows.push({ properties: footerProps });
    
        return rows;
    }, [data, labelMap, normalRows, summaryRows]);    

    useEffect(() => {
        if (ocrFieldRows.length > 0 && selectedCompany) {
            const payload = {
                docType: "attachment_0307",
                company: selectedCompany.name,
                factories: factoriesNumber,
                fields: ocrFieldRows
            };    
            validateOil0701(payload).then((res) => {
                console.log("ผลลัพธ์ Validate:", res);
                setValidationResult(res);
            });
        }
    }, [ocrFieldRows, selectedCompany]);    


    return (
        <div className="d-flex flex-column gap-2">
            <div>
                {renderLabel("เอกสาร")}
                <div className="border rounded-2 shadow-sm bg-white p-2">{cleanCellValue(data.header)}</div>
            </div>
            <div>
                {renderLabel("วันที่")}
                <div className="border rounded-2 shadow-sm bg-white p-2">{cleanCellValue(data.date)}</div>
            </div>
            <div>
                {renderLabel("น้ำมัน")}
                <div className="border rounded-2 shadow-sm bg-white p-2">{cleanCellValue(data.oil)}</div>
            </div>

            {normalRows.map((row, idx) => (
                <div key={`row-${idx}`} className="border-top pt-2">
                    {Object.entries(labelMap).map(([colKey, label]) => {
                        const value = cleanCellValue(row.properties?.[colKey]?.value);
                        if (!value) return null;

                        return (
                            <div key={`${idx}-${colKey}`} className="mb-1">
                                {renderLabel(label)}
                                <div className="border rounded-2 shadow-sm bg-white p-2">{value}</div>
                            </div>
                        );
                    })}
                </div>
            ))}

            {summaryRows.length > 0 && (
                <>
                    <div className="fw-bold fs-5 text-primary border-top pt-3">รวม</div>
                    {summaryRows.map((row, sIdx) => (
                        <div key={`summary-${sIdx}`} className="border-top pt-2">
                            {Object.entries(labelMap).map(([colKey, label]) => {
                                const props = row.properties || {};
                                const value = cleanCellValue(props?.[colKey]?.value);

                                if (colKey === "column_1") return null;

                                if (colKey === "column_7") {
                                    const customLabel = cleanCellValue(props?.[colKey]?.value);
                                    if (customLabel) {
                                        return (
                                            <div key={`summary-${sIdx}-${colKey}`} className="mb-1">
                                                {renderLabel(customLabel)}
                                            </div>
                                        );
                                    } else {
                                        return null;
                                    }
                                }

                                if (!value || value === "-") return null;
                                return (
                                    <div key={`summary-${sIdx}-${colKey}`} className="mb-1">
                                        {renderLabel(label)}
                                        <div className="border rounded-2 shadow-sm bg-white p-2 mb-2">{value}</div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </>
            )}
            <div className="m-0">
                {renderLabel("ลงชื่อ ผู้ประกอบอุตสาหกรรม")}
                <div className="border rounded-2 shadow-sm bg-white p-2">
                    {cleanCellValue(data.name)}
                </div>
            </div>
            <div>
                {renderLabel("ตำแหน่ง")}
                <div className="border rounded-2 shadow-sm bg-white p-2">
                    {cleanCellValue(data.position)}
                </div>
            </div>
        </div>
    );
};

export default ChecklistAttachment0307;
