import React from "react";
import { OcrDailyProductionDocument } from "../../types/ocrFileType";
import { cleanCellValue, renderLabel } from "../../utils/function/ocrUtils";

interface Props {
    data: OcrDailyProductionDocument;
}

const ChecklistDailyProduction: React.FC<Props> = ({ data }) => {
    const tables = data.detail_table ?? [];
    if (tables.length === 0) return <p className="text-muted">ไม่พบข้อมูลตาราง</p>;

    const datePattern = new RegExp(
        [
            /^\d{1,2}\s?(ม\.ค\.|ก\.พ\.|มี\.ค\.|เม\.ย\.|พ\.ค\.|มิ\.ย\.|ก\.ค\.|ส\.ค\.|ก\.ย\.|ต\.ค\.|พ\.ย\.|ธ\.ค\.)\s?\d{2,4}$/,
            /^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/,
            /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/
        ]
            .map((r) => r.source)
            .join("|")
    );

    const labelMap: Record<string, string> = {};
    const rowsToRender: typeof data.detail_table = [];

    let monthCount: Record<string, number> = {};
    let monthOfRow: string[] = [];

    // 1. เก็บ label จาก rows ก่อนเจอวันที่
    for (let i = 0; i < tables.length; i++) {
        const props = tables[i]?.properties as Record<string, any>;
        const col1Value = cleanCellValue(props?.column_1?.value ?? "");
        if (datePattern.test(col1Value)) break;

        Object.entries(props).forEach(([colKey, obj]) => {
            const value = cleanCellValue(obj?.value);
            if (value !== "-") labelMap[colKey] = value;
        });
    }

    // 2. เก็บแถวที่เจอวันที่และนับเดือน
    let collecting = false;
    for (let i = 0; i < tables.length; i++) {
        const row = tables[i];
        const props = row?.properties as Record<string, any>;
        const col1Value = cleanCellValue(props?.column_1?.value ?? "");

        if (datePattern.test(col1Value)) collecting = true;
        if (!collecting) continue;

        let monthKey = "-";
        const thaiMonth = col1Value.match(/(ม\.ค\.|ก\.พ\.|มี\.ค\.|เม\.ย\.|พ\.ค\.|มิ\.ย\.|ก\.ค\.|ส\.ค\.|ก\.ย\.|ต\.ค\.|พ\.ย\.|ธ\.ค\.)/);
        if (thaiMonth) {
            monthKey = thaiMonth[0];
        } else {
            const slashDate = col1Value.match(/^\d{1,2}[\/\-](\d{1,2})[\/\-]/);
            if (slashDate) {
                monthKey = slashDate[1];
            }
        }

        monthCount[monthKey] = (monthCount[monthKey] || 0) + 1;
        monthOfRow.push(monthKey);
        rowsToRender.push(row);
    }

    const mostFrequentMonth = Object.entries(monthCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-";
    const filteredRows = rowsToRender.filter((_, idx) => monthOfRow[idx] === mostFrequentMonth);

    // 3. หาค่า "รวมเดือนนี้"
    // หาค่า "รวมเดือนนี้"
    const summaryRow = tables.find((table) => {
        const values = Object.values(table?.properties ?? {}) as any[];
        return values.some((cell) => cleanCellValue(cell?.value).includes("รวมเดือนนี้"));
    });

    const summaryContent: { label: string; value: string }[] = [];
    if (summaryRow) {
        const props = summaryRow.properties as Record<string, any>;
        Object.entries(props).forEach(([colKey, cell]) => {
            const value = cleanCellValue(cell?.value);
            const label = labelMap[colKey];
            if (
                label &&
                value !== "-" &&
                !label.includes("วันเดือนปี")
            ) {
                summaryContent.push({ label, value });
            }
        });
    }


    return (
        <div className="d-flex flex-column">
            {filteredRows.map((row, idx) => (
                <div key={idx} className="d-flex flex-column gap-1 pt-2">
                    {Object.entries(labelMap).map(([colKey, label]) => {
                        const props = row.properties as Record<string, any>;
                        const raw = cleanCellValue(props?.[colKey]?.value);
                        return (
                            <React.Fragment key={`${idx}-${colKey}`}>
                                {renderLabel(label)}
                                <div className="border rounded-2 shadow-sm bg-white mb-2" style={{ fontSize: "13px", whiteSpace: "pre-line", padding: "10px" }}>
                                    {raw}
                                </div>
                            </React.Fragment>
                        );
                    })}
                    {idx < filteredRows.length - 1 && <hr className="my-2" />}
                </div>
            ))}

            {summaryContent.length > 0 && (
                <div className="pt-2 border-top mt-3">
                    <div className="fw-bold fs-5 text-primary mb-1">รวมเดือนนี้</div>
                    {summaryContent.map(({ label, value }, idx) => (
                        <React.Fragment key={`summary-${idx}`}>
                            {renderLabel(label)}
                            <div className="border rounded-2 shadow-sm bg-white mb-2" style={{ fontSize: "13px", whiteSpace: "pre-line", padding: "10px" }}>
                                {value}
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChecklistDailyProduction;
