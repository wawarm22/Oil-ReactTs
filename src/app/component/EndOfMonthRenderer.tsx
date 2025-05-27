import React from "react";
import { EndOfMonth } from "../../types/preparedTypes";
import { getBorderColor } from "../../utils/function/getBorderColor";
import { numberOrText } from "../../utils/function/numberOrText";

interface Props {
    endOfMonth: EndOfMonth;
    validation?: any;
}

const endOfMonthMap: { key: keyof EndOfMonth, label: string }[] = [
    { key: "tankMeasurement", label: "ยอดวัดถัง ณ สิ้นเดือน" },
    { key: "lossGainQuantity", label: "ปริมาณ Loss / Gain" },
    { key: "lossGainPercentage", label: "เปอร์เซ็นต์ Loss / Gain" },
    { key: "carriedForwardBalance", label: "ยอดคงเหลือยกไปเดือนถัดไป" },
];

const EndOfMonthRenderer: React.FC<Props> = ({ endOfMonth, validation }) => {
    const allZeroOrFalsy = endOfMonthMap.every(
        f => {
            const val = endOfMonth[f.key];
            return !val || Number(val) === 0;
        }
    );
    if (allZeroOrFalsy) return null;
    return (
        <div className="m-0">
            <hr className="border-2 border-secondary mt-0" />
            <div className="fw-bold mb-2">สิ้นเดือน</div>
            {endOfMonthMap.map((f, _idx) => {
                const val = endOfMonth[f.key];
                const valid = validation?.[f.key];
                if (!val || Number(val) === 0) return null;
                return (
                    <div key={f.key} className="mb-1">
                        <div className="fw-bold">{f.label}</div>
                        <div style={{
                            fontSize: "14px",
                            border: getBorderColor(valid),
                            borderRadius: "0.375rem",
                            boxShadow: "0 .5rem 1rem rgba(33,37,41,.03)",
                            background: "#fff",
                            padding: "0.5rem 1rem"
                        }}>
                            {numberOrText(val)}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default EndOfMonthRenderer;
