import React from "react";
import { OcrAttachment0307Document } from "../../types/ocrFileType";
import { cleanCellValue, renderLabel } from "../../utils/function/ocrUtils";

interface Props {
    data: OcrAttachment0307Document;
}

const ChecklistAttachment0307: React.FC<Props> = ({ data }) => {
    const tables = data.detail_table ?? [];
    if (tables.length < 3) return <p className="text-muted">ไม่พบข้อมูลตาราง</p>;

    // ✅ 1. Map Label
    const labelMap: Record<string, string> = {};
    const propsRow1 = tables[1]?.properties || {};
    const propsRow2 = tables[2]?.properties || {};

    for (let col = 1; col <= 11; col++) {
        const key = `column_${col}`;
        let label = "";

        if (col >= 10) {
            // column_10 และ column_11 ใช้ label จาก row 2
            label = cleanCellValue(propsRow2[key]?.value);
        } else {
            label = cleanCellValue(propsRow1[key]?.value);
        }

        if (label) labelMap[key] = label;
    }

    // ✅ 2. Filter rows ที่ไม่ใช่ summary
    const dataRows = tables.slice(3).filter((row) => {
        const col1 = cleanCellValue(row.properties?.column_1?.value ?? "");
        return !col1.includes("รวม");
    });

    return (
        <div className="d-flex flex-column gap-2">
            {/* Header fields */}
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

            {/* Data rows */}
            {dataRows.map((row, idx) => (
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
        </div>
    );
};

export default ChecklistAttachment0307;
