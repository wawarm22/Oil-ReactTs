import React, { useEffect, useState } from "react";
import { OcrStockOilDocument } from "../../types/ocrFileType";
import { validateOil0701 } from "../../utils/api/validateApi";
import { cleanCellValue, renderLabel } from "../../utils/function/ocrUtils";
import { useUser } from "../../hook/useUser";
import { useCompanyStore } from "../../store/companyStore";

interface ChecklistStockOilFormattedProps {
    data: OcrStockOilDocument;
}

type OCRValidationPayload = {
    docType: string;
    oil_type: string;
    company?: string;
    factories: string | null;
    fields: OCRFieldRow[];
};

type OCRFieldRow = {
    properties: Record<string, { value: string }>;
};

const ChecklistOilStock: React.FC<ChecklistStockOilFormattedProps> = ({ data }) => {
    const { user } = useUser();
    const [allRowsState, setAllRowsState] = useState<Record<string, any>[]>([]);
    const [labelMap, setLabelMap] = useState<Record<string, string>>({});
    const { selectedCompany, fetchCompanyById } = useCompanyStore();
    // const [validationMap, setValidationMap] = useState<Record<string, boolean>>({});
    const factoriesNumber = localStorage.getItem("warehouse");

    useEffect(() => {
        if (user?.company_id) {            
            fetchCompanyById(user.company_id);
        }
    }, [user?.company_id]);

    useEffect(() => {
        const tableRows = data.detail_table?.[0]?.rows ?? [];
        if (tableRows.length === 0) return;
        const datePattern = new RegExp(
            [
                /^\d{1,2}\s?(ม\.ค\.|ก\.พ\.|มี\.ค\.|เม\.ย\.|พ\.ค\.|มิ\.ย\.|ก\.ค\.|ส\.ค\.|ก\.ย\.|ต\.ค\.|พ\.ย\.|ธ\.ค\.)\s?\d{2,4}$/,
                /^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/,
                /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/,
                /^\d{1,2}\s?[A-Za-zก-ฮ]+\.[A-Za-zก-ฮ]+\.\s?\d{2,4}$/
            ]
                .map((r) => r.source)
                .join("|")
        );
        
        const useColumn = data.oil_type === "Diesel PR - 902]" ? "column_2" : "column_1";
        const firstDataIndex = tableRows.findIndex((row) =>
            datePattern.test(row?.[useColumn]?.trim?.() ?? "")
        );        

        if (firstDataIndex === -1) return;

        const newLabelMap: Record<string, string> = {};
        for (let col = 1; col <= 17; col++) {            
            for (let row = firstDataIndex - 1; row >= 0; row--) {
                const currentRow = tableRows[row];
                const containsYodyokma = Object.values(currentRow).some(
                    (cell) => typeof cell === "string" && cell.includes("ยอดยกมา")
                );
                if (containsYodyokma) continue;

                const val = currentRow?.[`column_${col}`];
                if (val && val !== ":unselected:" && val.trim() !== "") {
                    newLabelMap[`column_${col}`] = val.trim();
                    break;
                }
            }
        }
        setLabelMap(newLabelMap);

        const rowsToRender: Record<string, any>[] = [];
        let summaryRow: Record<string, any> | null = null;

        for (let i = firstDataIndex; i < tableRows.length; i++) {
            const row = tableRows[i];

            const hasYodyokma = Object.values(row).some(
                (cell) => typeof cell === "string" && cell.includes("ยอดยกมา")
            );
            if (hasYodyokma) continue;

            const hasSummaryThisMonth = Object.values(row).some(
                (cell) => typeof cell === "string" && cell.includes("รวมเดือน")
            );
            if (hasSummaryThisMonth) {
                const summary: Record<string, any> = { __isSummary: true };
                for (const [key, val] of Object.entries(row)) {
                    if (key.startsWith("column_")) {
                        summary[key] = cleanCellValue(val);
                    }
                }
                summaryRow = summary;
                break;
            }

            const rawCol17 = row["column_17"];
            const hasValueInCol17 =
                rawCol17 &&
                rawCol17.trim() !== "" &&
                rawCol17.trim() !== ":unselected:" &&
                rawCol17.trim() !== "-";

            const rowCopy: Record<string, any> = {};
            for (const [key, val] of Object.entries(row)) {
                if (key.startsWith("column_")) {
                    rowCopy[key] = cleanCellValue(val);
                } else {
                    rowCopy[key] = val;
                }
            }

            if (hasValueInCol17) {
                rowCopy["column_17"] = "-";
                rowsToRender.push(rowCopy);
                break;
            }

            rowsToRender.push(rowCopy);
        }

        const all = [...rowsToRender];
        if (summaryRow) all.push(summaryRow);

        setAllRowsState(all);
    }, [data.detail_table]);

    const transformToOCRFieldRow = (row: Record<string, any>): OCRFieldRow => {
        const properties: Record<string, { value: string }> = {};

        Object.entries(row).forEach(([key, val]) => {
            if (key.startsWith("column_")) {
                properties[key] = { value: cleanCellValue(val) };
            }
        });

        return { properties };
    };

    useEffect(() => {
        if (allRowsState.length > 0 && selectedCompany) {
            const transformedFields = allRowsState.map(transformToOCRFieldRow);            
            
            const payload: OCRValidationPayload = {
                docType: "oil-07-01-page-1",
                oil_type: data.oil_type,
                company: selectedCompany?.name,
                factories: factoriesNumber,
                fields: transformedFields,
            };   
    
            validateOil0701(payload).then((res) => {
                console.log("validationMap:", res);
            });
        }
    }, [allRowsState, selectedCompany]);     

    if (allRowsState.length === 0) {
        return <p className="text-muted">ไม่พบข้อมูลตาราง</p>;
    }

    return (
        <div className="d-flex flex-column">
            {allRowsState.map((row, idx) => {
                const isSummary = row.__isSummary === true;
                return (
                    <div key={idx} className="d-flex flex-column gap-1 pt-1">
                        {isSummary && <div className="fw-bold fs-5 text-primary">รวมเดือนนี้</div>}

                        {Object.entries(labelMap).map(([colKey, label]) => {
                            if (
                                (data.oil_type === "Diesel PR - 902]" && colKey === "column_1") ||
                                (isSummary && (colKey === "column_1" || colKey === "column_2"))
                            ) return null;

                            const raw = row[colKey];
                            const isEmpty =
                                !raw || raw === "" || raw === ":unselected:" || raw.trim?.() === "";

                            if (isSummary && isEmpty) return null;

                            let display = raw?.trim?.() ?? "-";

                            if (isSummary) {
                                display = raw.replace(/[^\d.,]/g, "").trim();
                                if (!display) return null;
                            } else {
                                if (!raw || raw === ":unselected:" || raw.trim() === "") display = "-";
                            }

                            return (
                                <React.Fragment key={`${idx}-${colKey}`}>
                                    {renderLabel(label)}
                                    <div
                                        className="border rounded-2 shadow-sm bg-white mb-2"
                                        style={{ fontSize: "14px", whiteSpace: "pre-line", padding: "10px" }}
                                    >
                                        {display}
                                    </div>
                                </React.Fragment>
                            );
                        })}
                        {idx < allRowsState.length - 1 && <hr className="my-2" />}
                    </div>
                );
            })}
        </div>
    );
};

export default ChecklistOilStock;
