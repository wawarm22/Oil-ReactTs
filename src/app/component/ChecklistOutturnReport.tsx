import React from "react";
import { OcrOutturnReportDocument } from "../../types/ocrFileType";
import { mapLossGainToGroup } from "../../utils/function/mapLossGainToGroup";
import { cleanAndFormatNumber } from "../../utils/function/format";

interface Props {
    data: OcrOutturnReportDocument;
    validateResult: any;
}

const borderColor = (passed?: boolean) =>
    `1.5px solid ${passed === true ? "#22C659" : passed === false ? "#FF0100" : "#CED4DA"}`;

const ChecklistOutturnReport: React.FC<Props> = ({ data }) => {
    const groups = mapLossGainToGroup(
        data["total-loss-gain-table-1"] ?? [],
        data["total-loss-gain-table-2"] ?? []
    );

    return (
        <div>
            {groups.map((group, idx) => (
                <div key={idx} className="mb-3" style={{fontSize: "14px"}}>
                    {/* วนแต่ละแถว */}
                    {group.rows.map((row, i) =>
                        "subLabel" in row ? (
                            <React.Fragment key={i}>
                                <div className="mb-2">
                                    <div className="fw-bold">{row.label}</div>
                                    <div
                                        className="rounded-2 shadow-sm bg-white p-2 mb-1"
                                        style={{
                                            border: borderColor(),
                                        }}
                                    >
                                        {cleanAndFormatNumber(row.value) || row.value}
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <div className="fw-bold">{row.subLabel}</div>
                                    <div
                                        className="rounded-2 shadow-sm bg-white p-2 mb-1"
                                        style={{
                                            border: borderColor(),
                                        }}
                                    >
                                        {cleanAndFormatNumber(row.subValue) || row.subValue}
                                    </div>
                                </div>
                            </React.Fragment>
                        ) : (
                            <div key={i} className="mb-1">
                                <div className="fw-bold">{row.label}</div>
                                <div
                                    className="rounded-2 shadow-sm bg-white p-2 mb-1"
                                    style={{                                        
                                        minHeight: "40px",
                                        border: borderColor(),
                                    }}
                                >
                                    {cleanAndFormatNumber(row.value) || row.value}
                                </div>
                            </div>
                        )
                    )}
                </div>
            ))}
        </div>
    );
};

export default ChecklistOutturnReport;
