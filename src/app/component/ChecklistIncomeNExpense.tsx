import React from "react";
import { OcrIncomeNExpenseDocument } from "../../types/ocrFileType";

interface Props {
    data: OcrIncomeNExpenseDocument;
}

const cleanValue = (val?: string | null): string => {
    if (!val || val.trim() === "" || val === ":unselected:") return "-";
    return val.trim();
};

const numberOrText = (val: any) => {
    if (val === null || val === undefined) return "-";
    if (!isNaN(Number(val)) && val !== "") return Number(val).toLocaleString();
    return String(val);
};

const sectionMap = [
    {
        title: "ยอดคงเหลือยกมา",
        col: "column_1",
        columns: [
            { key: "column_1", label: "วันที่รับ" },
            { key: "column_2", label: "โรงกลั่น / คลังต้นทาง" },
            { key: "column_3", label: "เลขที่ใบกำกับภาษี" },
            { key: "column_4", label: "ปริมาณ" },
            { key: "column_15", label: "ยอดคงเหลือตามใบกำกับภาษี" },
            { key: "column_16", label: "ยอดคงเหลือรวม" },
        ],
    },
    {
        title: "การรับ",
        col: "column_5",
        columns: [
            { key: "column_5", label: "วันที่รับ" },
            { key: "column_6", label: "โรงกลั่น / คลังต้นทาง" },
            { key: "column_7", label: "เลขที่ใบกำกับภาษี" },
            { key: "column_8", label: "ปริมาณ" },
            { key: "column_15", label: "ยอดคงเหลือตามใบกำกับภาษี" },
            { key: "column_16", label: "ยอดคงเหลือรวม" },
        ],
    },
    {
        title: "การจ่าย",
        col: "column_9",
        columns: [
            { key: "column_9", label: "วันที่จ่าย" },
            { key: "column_10", label: "จ่ายขายในประเทศ (ปริมาณ)" },
            { key: "column_11", label: "เลขที่ใบกำกับภาษี (ขายในประเทศ)" },
            { key: "column_12", label: "คลังปลายทาง" },
            { key: "column_13", label: "โอนคลัง (ปริมาณ)" },
            { key: "column_14", label: "เลขที่ใบกำกับภาษี (โอนคลัง)" },
            { key: "column_15", label: "ยอดคงเหลือตามใบกำกับภาษี" },
            { key: "column_16", label: "ยอดคงเหลือรวม" },
        ],
    },
];

const ChecklistIncomeNExpense: React.FC<Props> = ({ data }) => {
    const detailRows = (data.detail_table ?? []).slice(3);

    return (
        <div className="d-flex flex-column gap-2">
            <div>
                <div className="fw-bold">บัญชีรับ-จ่ายน้ำมันที่นำมาใช้เป็นวัตถุดิบในการผลิต</div>
                <div className="border rounded-2 shadow-sm bg-white p-2 mb-2">{cleanValue(data.header)}</div>
            </div>

            {detailRows.map((row, idx) => {
                const properties: Record<string, any> = row.properties ?? {};

                return (
                    <React.Fragment key={`row-${idx}`}>
                        {sectionMap.map((section, secIdx) => {
                            const mainValue = properties[section.col]?.value;
                            if (!mainValue || mainValue.trim() === "") return null;
                            const sectionHasValue = section.columns.some(col => {
                                const value = properties[col.key]?.value;
                                return value && value.trim() !== "";
                            });
                            if (!sectionHasValue) return null;

                            return (
                                <React.Fragment key={`section-${secIdx}-${idx}`}>
                                    <hr className="border-2 border-secondary m-0" />
                                    <div className="mb-2">
                                        <div className="fw-bold">{section.title}</div>
                                        {section.columns.map((col) => {
                                            const value = properties[col.key]?.value;
                                            if (!value || value.trim() === "") return null;
                                            return (
                                                <div key={col.key} className="mb-1">
                                                    <div className="fw-bold">{col.label}</div>
                                                    <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
                                                        {numberOrText(value)}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </React.Fragment>
                );
            })}

            {/* --- สรุป summary_table --- */}
            {data.summary_table && data.summary_table.length > 0 && (
                <div className="mt-3">
                    <hr className="border-2 border-secondary" />
                    <div className="fw-bold">สิ้นเดือน</div>
                    {data.summary_table.map((item, idx) => {
                        const label = item.properties?.label?.value;
                        const value = item.properties?.value?.value;
                        if (!label && !value) return null;
                        return (
                            <div key={idx} className="mb-1">
                                <div className="fw-bold">{label || "-"}</div>
                                <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
                                    {numberOrText(value)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ChecklistIncomeNExpense;
