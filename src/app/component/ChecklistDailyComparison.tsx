import React from "react";
import { OcrDailyComparisonDocument } from "../../types/ocrFileType";

interface Props {
    data: OcrDailyComparisonDocument;
}

// ฟังก์ชัน formatNumber
const formatNumber = (value: string): string => {
    if (!value) return "-";
    // ลบคอมม่าทิ้งก่อน parse
    const num = Number(value.replace(/,/g, ""));
    if (isNaN(num)) return value;
    // กำหนดทศนิยม 2 ตำแหน่ง
    return num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

// ดึงเฉพาะตัวเลข จุด ทศนิยม และคอมม่า
const extractNumber = (str: string): string => {
    if (!str) return "-";
    // ถ้าไม่มีตัวเลขเลย คืนค่าเดิม
    const match = str.match(/[\d,.]+/g);
    return match ? match.join("") : "-";
};

const ChecklistDailyComparison: React.FC<Props> = ({ data }) => {
    const cleanValue = (val?: any): string => {
        const v = typeof val === "object" && val !== null ? val.value : val;
        if (!v || typeof v !== "string" || v.trim() === "" || v === ":unselected:") return "-";
        return v.trim();
    };

    return (
        <div className="d-flex flex-column gap-2">
            {data.date && (
                <div>
                    <div className="fw-bold">สำหรับน้ำมันออกจากคลังวันที่ เดือน ปี</div>
                    <div className="border rounded-2 shadow-sm bg-white p-2">{data.date}</div>
                </div>
            )}
            <hr className="border-top border-2 border-secondary mb-2" />
            {(() => {
                let foundSummary = false;

                return data.detail_table.slice(2).map((row, idx) => {
                    if (foundSummary) return null;

                    const props = row.properties || {};
                    const dateVal = cleanValue(props.column_1);

                    // ฟิลด์ชื่อ/label ต่างๆที่ต้องแยก
                    const numberFields = [
                        { label: "น้ำมันพื้นฐาน", value: cleanValue(props.column_2) },
                        { label: "เอทานอล", value: cleanValue(props.column_3) },
                        { label: "สารเติมเเต่ง", value: cleanValue(props.column_4) },
                        { label: "ปริมาณรวม", value: cleanValue(props.column_5) },
                        { label: "เเบบ ภส.07-02 ปริมาณการผลิตเเละจำหน่าย(ลิตร)", value: cleanValue(props.column_6) },
                        { label: "เเบบ ภส.03-07 ปริมาณการชำระภาษี(ลิตร)", value: cleanValue(props.column_7) },
                        { label: "ผลต่าง", value: cleanValue(props.column_8) },
                    ];

                    if (dateVal.includes("รวม")) {
                        foundSummary = true;

                        return (
                            <div key={`summary-row`} className="p-0 m-0">
                                <div className="fw-bold">ผลรวม</div>
                                {numberFields.map(({ label, value }, i) => {
                                    const onlyNumber = extractNumber(value);
                                    return (
                                        <div key={`sum-${i}`}>
                                            <div className="fw-bold">{label}</div>
                                            <div className="border rounded-2 shadow-sm bg-white p-2 mb-2">
                                                {onlyNumber !== "-" ? formatNumber(onlyNumber) : "-"}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    }

                    // Normal rows
                    const normalFields = [
                        { label: "วันที่", value: dateVal, isDate: true },
                        ...numberFields.map(field => ({ ...field, isDate: false })),
                    ];

                    return (
                        <div key={`row-${idx}`} className="pb-2">
                            {normalFields.map(({ label, value, isDate }, i) => (
                                <div key={`field-${i}`}>
                                    <div className="fw-bold">{label}</div>
                                    <div className="border rounded-2 shadow-sm bg-white p-2">
                                        {isDate
                                            ? value
                                            : (extractNumber(value) !== "-" ? formatNumber(extractNumber(value)) : "-")}
                                    </div>
                                </div>
                            ))}
                            <hr className="border-top border-2 border-secondary m-0 mt-3" />
                        </div>
                    );
                });
            })()}
        </div>
    );
};

export default ChecklistDailyComparison;
