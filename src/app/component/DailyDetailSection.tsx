import React from "react";
import { safePassedColor } from "../../utils/function/passedColor";
import { formatNumber } from "../../utils/function/format";

export interface DailyDetailSectionProps {
    row: any;
    idx: number;
    detailValidation?: any;
    buildDetailFields: (row: any, idx: number) => any[];
}

export const DailyDetailSection: React.FC<DailyDetailSectionProps> = ({
    row, idx, detailValidation, buildDetailFields
}) => {
    const fields = buildDetailFields(row, idx);

    return (
        <div className="border-top pt-2 mb-3">
            {fields.map((item, i) =>
                item.value !== undefined && item.value !== null && item.value !== ""
                    ? (
                        <div key={i} className="mb-1">
                            <div className="fw-bold mb-1">{item.label}</div>
                            <div
                                className="rounded-2 shadow-sm bg-white p-2 mb-2"
                                style={{
                                    border: `1.5px solid ${item.key && detailValidation
                                        ? safePassedColor(detailValidation, item.key)
                                        : "#dee2e6"}`
                                }}
                            >
                                {formatNumber(item.value)}
                            </div>
                        </div>
                    )
                    : item.label === "รวม"
                        ? <div key={i} className="fw-bold mb-2">รวม</div>
                        : null
            )}
        </div>
    );
};
