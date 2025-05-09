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
    const factoriesNumber = localStorage.getItem("warehouse");

    useEffect(() => {
        if (user?.company_id) {
            fetchCompanyById(user.company_id);
        }
    }, [user?.company_id]);

    useEffect(() => {
        const tableRows = data.detail_table ?? [];
        if (tableRows.length === 0) return;

        let firstDataIndex = 2;
        const checkRow = tableRows[2]?.properties ?? {};
        const values = Object.values(checkRow).map(cell => cell?.value ?? "");
        const isYodyokmaRow = values.some(text => text.includes("ยอดยก") || text.includes("ยอดยกมา"));
        if (isYodyokmaRow) firstDataIndex = 3;

        let newLabelMap: Record<string, string> = {};
        if (data.oil_type.includes("H-Base")) {
            newLabelMap = {
                column_1: "วัน เดือน ปี",
                column_2: "รายการ",
                column_3: "หลักฐานเลขที่",
                column_4: "B/L",
                column_5: "Outturn",
                column_6: "ปริมาณสิทธิ์หักลดหย่อน",
                column_7: "อัตราภาษี",
                column_8: "ผลิตสินค้าพิกัด อัตราภาษีสรรพามิต",
                column_9: "ผลิตสินค้าอื่น",
                column_10: "เสียหาย",
                column_11: "อื่นๆ",
                column_12: "รวมจ่าย",
                column_13: "ยอดคงเหลือ Stock",
                column_14: "ยอดคงเหลือตามบัญชีสิทธิ์",
                column_15: "น้ำมัน Gain",
                column_16: "หมายเหตุ",
            };
        } else {
            newLabelMap = {
                column_1: "วัน เดือน ปี",
                column_2: "รายการ",
                column_3: "หลักฐานเลขที่",
                column_4: "B/L",
                column_5: "Outturn",
                column_6: "ผลิตสินค้าพิกัด อัตราภาษีสรรพามิต",
                column_7: "ผลิตสินค้าอื่น",
                column_8: "เสียหาย",
                column_9: "อื่นๆ",
                column_10: "รวมจ่าย",
                column_11: "ยอดคงเหลือ",
                column_12: "หมายเหตุ",
            };
        }

        setLabelMap(newLabelMap);

        const rowsToRender: Record<string, any>[] = [];
        let summaryRow: Record<string, any> | null = null;

        for (let i = firstDataIndex; i < tableRows.length; i++) {
            const properties = tableRows[i]?.properties ?? {};
            const row: Record<string, any> = {};

            const isYodyokma = Object.values(properties).some(cell => cell?.value?.includes("ยอดยกมา"));
            if (isYodyokma) continue;

            const isSummary = Object.values(properties).some(cell => cell?.value?.includes("รวมเดือน"));
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

                            let display = raw?.trim?.() ?? "-";
                            if (isSummary) {
                                display = raw.replace(/[^\d.,]/g, "").trim();
                                if (!display) return elements;
                            } else if (!raw || raw === ":unselected:" || raw.trim() === "") {
                                display = "-";
                            }

                            elements.push(
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

                            return elements;
                        })}

                        {idx < allRowsState.length - 1 && <hr className="my-2" />}
                    </div>
                );
            })}
        </div>
    );
};

export default ChecklistOilStock;
