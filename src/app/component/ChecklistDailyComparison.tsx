import React from "react";
import { OcrDailyComparisonDocument } from "../../types/ocrFileType";

interface Props {
    data: OcrDailyComparisonDocument;
}

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
                    <div className="fw-bold">สำหรับน้ำมันออกจากคลังวันที่ เดือน ปี </div>
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

                    if (dateVal.includes("รวม")) {
                        foundSummary = true;

                        const summaryFields = [
                            { label: "น้ำมันพื้นฐาน", value: cleanValue(props.column_2) },
                            { label: "เอทานอล", value: cleanValue(props.column_3) },
                            { label: "สารเติมเเต่ง", value: cleanValue(props.column_4) },
                            { label: "ปริมาณรวม", value: cleanValue(props.column_5) },
                            { label: "เเบบ ภส.07-02 ปริมาณการผลิตเเละจำหน่าย(ลิตร)", value: cleanValue(props.column_6) },
                            { label: "เเบบ ภส.03-07 ปริมาณการชำระภาษี(ลิตร)", value: cleanValue(props.column_7) },
                            { label: "ผลต่าง", value: cleanValue(props.column_8) },
                        ];

                        return (
                            <div key={`summary-row`} className="p-0 m-0">
                                <div className="fw-bold">ผลรวม</div>
                                {summaryFields.map(({ label, value }, i) => (
                                    value && (
                                        <div key={`sum-${i}`}>
                                            <div className="fw-bold">{label}</div>
                                            <div className="border rounded-2 shadow-sm bg-white p-2 mb-2">{value}</div>
                                        </div>
                                    )
                                ))}
                            </div>
                        );
                    }

                    const normalFields = [
                        { label: "วันที่", value: dateVal },
                        { label: "น้ำมันพื้นฐาน", value: cleanValue(props.column_2) },
                        { label: "เอทานอล", value: cleanValue(props.column_3) },
                        { label: "สารเติมเเต่ง", value: cleanValue(props.column_4) },
                        { label: "ปริมาณรวม", value: cleanValue(props.column_5) },
                        { label: "เเบบ ภส.07-02 ปริมาณการผลิตเเละจำหน่าย(ลิตร)", value: cleanValue(props.column_6) },
                        { label: "เเบบ ภส.03-07 ปริมาณการชำระภาษี(ลิตร)", value: cleanValue(props.column_7) },
                        { label: "ผลต่าง", value: cleanValue(props.column_8) },
                    ];

                    return (
                        <div key={`row-${idx}`} className="pb-2">
                            {normalFields.map(({ label, value }, i) => (
                                value && (
                                    <div key={`field-${i}`}>
                                        <div className="fw-bold">{label}</div>
                                        <div className="border rounded-2 shadow-sm bg-white p-2">{value}</div>
                                    </div>
                                )
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
