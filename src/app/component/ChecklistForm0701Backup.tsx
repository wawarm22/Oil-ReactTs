import React, { useEffect, useState } from "react";
import { OcrStockOilDocument } from "../../types/ocrFileType";
import { validateOil0701 } from "../../utils/api/validateApi";
import { cleanCellValue, renderLabel } from "../../utils/function/ocrUtils";
import { useUser } from "../../hook/useUser";
import { useCompanyStore } from "../../store/companyStore";
import { checkProdustType } from "../../utils/api/apiCheckData";
import { findBestMatch } from "../../utils/function/fuzzySearch";
import { findBestMatchName } from "../../utils/function/fuzzySearchName";
import { renderYodyokmaRow } from "../../utils/renderYodyokmaRow";
import { getLabelMap } from "../../utils/labelMaps";

interface ChecklistStockOilFormattedProps {
    data: OcrStockOilDocument;
    oilTypeFromPrevPage?: string;
}

type OCRValidationPayload = {
    docType: string;
    documentGroup: string;
    company?: string;
    materialID: string;
    factories: string | null;
    fields: OCRFieldRow[];
};

type OCRFieldRow = {
    properties: Record<string, { value: string }>;
};

const ChecklistForm0701: React.FC<ChecklistStockOilFormattedProps> = ({ data, oilTypeFromPrevPage }) => {
    const { user } = useUser();
    const [allRowsState, setAllRowsState] = useState<Record<string, any>[]>([]);
    const [labelMap, setLabelMap] = useState<Record<string, string>>({});
    const [materialType, setMaterialType] = useState<string>("");
    const [materialName, setMaterialName] = useState<string>("");
    const [validationResult, setValidationResult] = useState<any>(null);
    const { selectedCompany, fetchCompanyById } = useCompanyStore();
    const factoriesNumber = localStorage.getItem("warehouse");
    const factoriesName = localStorage.getItem("nameWarehouse")    

    useEffect(() => {
        if (user?.company_id) {
            fetchCompanyById(user.company_id);
        }
    }, [user?.company_id]);

    useEffect(() => {
        const fetchMaterialType = async () => {
            const oilType = oilTypeFromPrevPage || data.oil_type;

            if (!oilType || !selectedCompany?.name || !factoriesName) return;

            const response = await checkProdustType(oilType);
            const resultItems = response?.ResultItems ?? [];

            const productNumber = findBestMatch(resultItems, selectedCompany.name, factoriesName);
            const productName = findBestMatchName(resultItems, selectedCompany.name, factoriesName);

            setMaterialName(productName);
            setMaterialType(productNumber);
        };

        fetchMaterialType();
    }, [oilTypeFromPrevPage, data.oil_type, selectedCompany?.name, factoriesName]);

    useEffect(() => {
        if (!materialType) return;

        const newLabelMap = getLabelMap(materialName);
        setLabelMap(newLabelMap);
    }, [materialType, materialName]);

    useEffect(() => {
        const tableRows = data.detail_table ?? [];
        if (tableRows.length === 0) return;

        let firstDataIndex = 2;
        if (data.docType === "oil-07-01-page-1-attach") {
            firstDataIndex = 0;
        }

        const rowsToRender: Record<string, any>[] = [];
        let summaryRow: Record<string, any> | null = null;

        for (let i = firstDataIndex; i < tableRows.length; i++) {
            const properties = tableRows[i]?.properties ?? {};
            const row: Record<string, any> = {};

            const isSummary = Object.values(properties).some(cell => {
                const val = (cell?.value ?? "").replace(/\s+/g, "");
                return val.includes("รวมเดือน");
            });

            if (isSummary) {
                summaryRow = { __isSummary: true };
                for (const [key, cell] of Object.entries(properties)) {
                    if (key.startsWith("column_")) {
                        summaryRow[key] = cleanCellValue(cell?.value);
                    }
                }
                break;
            }

            for (const [key, cell] of Object.entries(properties)) {
                if (key.startsWith("column_")) {
                    row[key] = cleanCellValue(cell?.value);
                }
            }

            rowsToRender.push(row);
        }

        const all = [...rowsToRender];
        if (summaryRow) all.push(summaryRow);
        setAllRowsState(all);
    }, [data.detail_table, data.docType]);

    function cleanDateDotSpacing(text: string): string {
        return text
            .replace(/\s+\./g, ".")
            .replace(/\. ?/g, ".")
            .replace(/\.([0-9]+)/g, ". $1")
            .replace(/\s{2,}/g, " ")
            .trim();
    }

    const transformToOCRFieldRow = (row: Record<string, any>): OCRFieldRow => {
        const properties: Record<string, { value: string }> = {};
        Object.entries(row).forEach(([key, val]) => {
            if (key.startsWith("column_")) {
                properties[key] = {
                    value: key === "column_1"
                        ? cleanDateDotSpacing(cleanCellValue(val))
                        : cleanCellValue(val)
                };
            }
        });
        return { properties };
    };

    useEffect(() => {
        const runValidation = async () => {
            if (!selectedCompany || !materialType || allRowsState.length === 0) return;
            const transformedFields = allRowsState.map(transformToOCRFieldRow);
            const payload: OCRValidationPayload = {
                docType: data.docType,
                documentGroup: data.documentGroup,
                materialID: materialType,
                company: selectedCompany.name,
                factories: factoriesNumber,
                fields: transformedFields,
            };

            validateOil0701(payload).then(res => {
                setValidationResult(res);
            });
        };

        if (allRowsState.length > 0) {
            runValidation();
        }
    }, [allRowsState, selectedCompany, materialType]);

    if (allRowsState.length === 0) {
        return <p className="text-muted">ไม่พบข้อมูลตาราง</p>;
    }

    return (
        <div className="d-flex flex-column">

            {data.docType !== "oil-07-01-page-1-attach" && (
                <>
                    <div>
                        {renderLabel("แบบฟอร์ม")}
                        <div className="rounded-2 shadow-sm bg-white p-2 mb-2" style={{ minHeight: "42px", border: `1.5px solid #22C659` }}>ภส.๐๗-๐๑</div>
                    </div>
                    <div>
                        {renderLabel("ประเภทวัตถุดิบ")}
                        <div className="rounded-2 shadow-sm bg-white p-2 mb-2" style={{ minHeight: "42px", border: `1.5px solid #22C659` }}>{(data.oil_type)}</div>
                    </div>
                    <div>
                        {renderLabel("หน่วย")}
                        <div className="rounded-2 shadow-sm bg-white p-2 mb-2" style={{ minHeight: "42px", border: `1.5px solid #22C659` }}>{cleanCellValue(data.oil_unit)}</div>
                    </div>
                </>
            )}

            {allRowsState.map((row, idx) => {
                if (row["column_2"] && row["column_2"].includes("ยอดยกมา")) {
                    return renderYodyokmaRow(row, materialName, labelMap);
                }
                const isSummary = row.__isSummary === true;
                const validationRow = validationResult?.data?.find((vRow: any) => vRow.row === idx);
                const col1 = row["column_1"];
                if (!col1 || col1 === "" || col1 === ":unselected:" || (typeof col1 === "string" && col1.trim() === "")) {
                    if (!isSummary) return null;
                }
                return (
                    <div key={idx} className="d-flex flex-column gap-1 pt-1">
                        {isSummary && <div className="fw-bold" style={{ fontSize: "18px" }}>รวมเดือนนี้</div>}

                        {Object.entries(labelMap).flatMap(([colKey, label]) => {
                            const elements: React.ReactNode[] = [];

                            if (label === "B/L") {
                                elements.push(
                                    <div key={`${idx}-${colKey}-label-จำนวนรับ`} className="fw-semibold">จำนวนรับ</div>
                                );
                            }
                            if (label === "ผลิตสินค้าพิกัด อัตราภาษีสรรพามิต") {
                                elements.push(
                                    <div key={`${idx}-${colKey}-label-จำนวนจ่าย`} className="fw-semibold">จำนวนจ่าย</div>
                                );
                            }

                            if (isSummary && (colKey === "column_1" || colKey === "column_2")) return elements;

                            const raw = row[colKey];
                            const isEmpty = !raw || raw === "" || raw === ":unselected:" || raw.trim?.() === "";

                            if (isSummary && isEmpty) return elements;

                            let display = raw?.trim?.() ?? "";
                            if (colKey === "column_1") {
                                display = cleanDateDotSpacing(display);
                            }
                            if (isSummary) {
                                display = raw.replace(/[^\d.,]/g, "").trim();
                                if (!display) return elements;
                            } else if (!raw || raw === ":unselected:" || raw.trim() === "") {
                                display = "";
                            }

                            const passed = validationRow?.properties?.[colKey]?.passed;

                            elements.push(
                                <React.Fragment key={`${idx}-${colKey}`}>
                                    {renderLabel(label)}
                                    <div
                                        className="rounded-2 shadow-sm bg-white mb-2"
                                        style={{
                                            fontSize: "14px",
                                            whiteSpace: "pre-line",
                                            padding: "10px",
                                            minHeight: "42px",
                                            borderColor: passed === true ? "#22C659" : passed === false ? "#FF0100" : "#22C659",
                                            borderWidth: "2px",
                                            borderStyle: "solid",
                                        }}
                                    >
                                        {display}
                                    </div>
                                </React.Fragment>
                            );

                            return elements;
                        })}

                        {idx < allRowsState.length - 1 && <hr className="my-2" />}
                    </div>
                );
            })}
        </div>
    );
};

export default ChecklistForm0701;
