import React from "react";
import { OcrDailyProductionDocument } from "../../types/ocrFileType";
import { cleanCellValue, renderLabel } from "../../utils/function/ocrUtils";
import { Oil0702ValidationResult } from "../../types/validateResTypes";

interface Props {
    data: OcrDailyProductionDocument;
    validateResult: Oil0702ValidationResult | null
}

const ChecklistForm0702: React.FC<Props> = ({ data, validateResult }) => {
    const tables = data.detail_table ?? [];

    if (tables.length === 0) return <p className="text-muted">ไม่พบข้อมูลตาราง</p>;

    const fixedLabels: { key: string; label: string }[] = [
        { key: "column_1", label: "วันเดือนปี" },
        { key: "column_2", label: "รายการ" },
        { key: "column_3", label: "หลักฐานเลขที่" },
        { key: "column_4", label: "ผลิตได้" },
        { key: "column_5", label: "รับคืนจากคลังสินค้าทัณฑ์บน" },
        { key: "column_6", label: "อื่นๆ" },
        { key: "column_7", label: "รวมรับสินค้า" },
        { key: "column_8", label: "จำหน่ายในประเทศ" },
        { key: "column_9", label: "จำหน่ายต่างประเทศ" },
        { key: "column_10", label: "ใช้ในโรงงานอุตสาหกรรม" },
        { key: "column_11", label: "คลังสินค้าทัณฑ์บน" },
        { key: "column_12", label: "เสียหาย" },
        { key: "column_13", label: "อื่นๆ" },
        { key: "column_14", label: "รวมจ่ายสินค้า" },
        { key: "column_15", label: "ยอดคงเหลือ" },
        { key: "column_16", label: "หมายเหตุ" },
    ];

    const summaryRow = tables.find((table) => {
        const values = Object.values(table?.properties ?? {}) as any[];
        return values.some((cell) => cleanCellValue(cell?.value).includes("รวมเดือนนี้"));
    });

    const replacements: [RegExp, string][] = [
        [/2 # # 63/g, "2 ส.ค. 63"],
        [/6 m\.A\. 63/gi, "6 ส.ค. 63"],
        [/31 A\.A\. 63/gi, "31 ส.ค. 63"],
    ];

    const summaryContent: { label: string; value: string }[] = [];
    if (summaryRow) {
        const props = summaryRow.properties as Record<string, any>;
        fixedLabels.forEach(({ key, label }) => {
            const value = cleanCellValue(props?.[key]?.value ?? "");
            if (key !== "column_1" && value && value !== "-") {
                summaryContent.push({ label, value });
            }
        });
    }

    let startIdx = 2;

    // วนหา index ถัดไปจนกว่าไม่เข้าเงื่อนไข
    while (true) {
        const props = tables[startIdx]?.properties as Record<string, any> | undefined;
        const col1 = props?.column_1?.value ?? "";
        const col2 = props?.column_2?.value ?? "";
        const isCol1Empty = !col1 || col1.trim() === "";
        const hasYodyok =
            (col1 && col1.replace(/\s+/g, "").toLowerCase().includes("ยอดยก")) ||
            (col2 && col2.replace(/\s+/g, "").toLowerCase().includes("ยอดยก"));

        if (isCol1Empty || hasYodyok) {
            startIdx++;
        } else {
            break;
        }
    }

    const ocrFieldRows = tables.slice(startIdx).map((row) => {
        const props = row.properties as Record<string, any>;
        const properties: Record<string, { value: string }> = {};
        fixedLabels.forEach(({ key, label }) => {
            const value = cleanCellValue(props?.[key]?.value ?? "");
            properties[label] = { value };
        });
        return { properties };
    });

    const extraLabelMap: Record<string, string | undefined> = {
        column_4: "จำนวนรับ",
        column_8: "จำนวนจ่าย",
    };

    const stopAtIdx = ocrFieldRows.findIndex(row =>
        Object.values(row.properties).some(cell => (cell.value ?? "").includes("รวมเดือนนี้"))
    );
    const rowsToDisplay =
        stopAtIdx === -1 ? ocrFieldRows : ocrFieldRows.slice(0, stopAtIdx);

    return (
        <div className="d-flex flex-column">
            <div>
                {renderLabel("แบบฟอร์ม")}
                <div className="rounded-2 shadow-sm bg-white p-2 mb-2" style={{ minHeight: "42px", border: `1.5px solid #22C659` }}>ภส.๐๗-๐๒</div>
            </div>
            <div>
                {renderLabel("ประเภทสินค้า")}
                <div className="rounded-2 shadow-sm bg-white p-2 mb-2" style={{ minHeight: "42px", border: `1.5px solid #22C659` }}>{cleanCellValue(data.product_cate)}</div>
            </div>
            <div>
                {renderLabel("ชนิด")}
                <div className="rounded-2 shadow-sm bg-white p-2 mb-2" style={{ minHeight: "42px", border: `1.5px solid #22C659` }}>{cleanCellValue(data.product_type)}</div>
            </div>
            <div>
                {renderLabel("ตราหรือเครื่องหมาย/เเบบ/รุ่น/ดีกรี/ความหวาน")}
                <div className="rounded-2 shadow-sm bg-white p-2 mb-2" style={{ minHeight: "42px", border: `1.5px solid #22C659` }}>{cleanCellValue(data.product_brand)}</div>
            </div>
            <div>
                {renderLabel("ขนาด")}
                <div className="rounded-2 shadow-sm bg-white p-2 mb-2" style={{ minHeight: "42px", border: `1.5px solid #22C659` }}>{cleanCellValue(data.product_size)}</div>
            </div>
            <div>
                {renderLabel("หน่วย")}
                <div className="rounded-2 shadow-sm bg-white p-2 mb-2" style={{ minHeight: "42px", border: `1.5px solid #22C659` }}>{cleanCellValue(data.product_unit)}</div>
            </div>

            {rowsToDisplay.map((row, idx) => {
                const validateRow = validateResult?.data?.find(v => v.row === idx);
                return (
                    <div key={idx} className="d-flex flex-column gap-1 pt-3 border-top mt-3">
                        {fixedLabels.map(({ key, label }) => {
                            const formatRawValue = (value: string) =>
                                replacements.reduce((acc, [pattern, replacement]) => acc.replace(pattern, replacement), value);
                            const raw = row.properties[label]?.value ?? "";
                            const cellValidation = validateRow?.properties?.[label];
                            const borderColor = cellValidation?.passed === true
                                ? "#22C659"
                                : cellValidation?.passed === false
                                    ? "#FF0100"
                                    : "#22C659";
                            return (
                                <React.Fragment key={`${idx}-${key}`}>
                                    {extraLabelMap[key] && renderLabel(extraLabelMap[key]!)}
                                    {renderLabel(label)}
                                    <div
                                        className="rounded-2 shadow-sm bg-white mb-2"
                                        style={{
                                            fontSize: "13px",
                                            whiteSpace: "pre-line",
                                            padding: "10px",
                                            minHeight: "42px",
                                            border: `1.5px solid ${borderColor}`,
                                        }}
                                    >
                                        {formatRawValue(raw)}
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </div>
                );
            })}

            {summaryContent.length > 0 && (
                <div className="pt-2 border-top mt-3">
                    <div className="fw-bold mb-1" style={{ fontSize: "18px" }}>รวมเดือนนี้</div>
                    {summaryContent.map(({ label, value }, idx) => {
                        const fixed = fixedLabels.find(fl => fl.label === label);
                        const summaryValidationRow = validateResult?.data?.[validateResult.data.length - 2];
                        console.log("summaryValidationRow", summaryValidationRow);

                        const cellValidation = summaryValidationRow?.properties?.[label];
                        const borderColor = cellValidation?.passed === true
                            ? "#22C659"
                            : cellValidation?.passed === false
                                ? "#FF0100"
                                : "#22C659";
                        return (
                            <React.Fragment key={`summary-${idx}`}>
                                {fixed && extraLabelMap[fixed.key] && renderLabel(extraLabelMap[fixed.key]!)}
                                <div className="mt-1">{renderLabel(label)}</div>
                                <div className="rounded-2 shadow-sm bg-white mb-2 mt-1" style={{
                                    fontSize: "13px",
                                    whiteSpace: "pre-line",
                                    padding: "10px",
                                    border: `1.5px solid ${borderColor}`,
                                }}>
                                    {value}
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ChecklistForm0702;
