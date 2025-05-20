import React from "react";
import { OcrOutturnStatementDocument } from "../../types/ocrFileType";

interface Props {
    data: OcrOutturnStatementDocument;
}

const ChecklistOutturnStatement: React.FC<Props> = ({ data }) => {

    const cleanValue = (val?: any): string => {
        if (val === null || val === undefined) return "";
        const str = String(val);
        if (str.trim() === "" || str === ":unselected:") return "";
        return str.trim();
    };

    const fields = [
        { label: "Date", value: cleanValue(data.date) },
        { label: "PRODUCT", value: cleanValue(data.product) },
    ];

    const value = data.detail_table_1[27].properties.column_2 || {};
    const name = data.detail_table_1[27].properties.column_1 || {};
    const valueQuantity = cleanValue(value.value);
    const nameQuantity = cleanValue(name.value);

    return (
        <div className="d-flex flex-column gap-2">

            {fields.map(({ label, value }) => (
                value ? (
                    <div key={label}>
                        <div className="fw-bold">{label}</div>
                        <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
                            {value}
                        </div>
                    </div>
                ) : null
            ))}

            {valueQuantity && (
                <>
                    <hr className="border-top border-2 border-secondary m-0 mt-2" />
                    <div className="fw-bold">Quantity</div>
                    <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
                        {nameQuantity}
                    </div>
                    <div className="fw-bold m-0">ปริมาณ</div>
                    <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
                        {valueQuantity}
                    </div>
                </>
            )}

        </div>
    );
};

export default ChecklistOutturnStatement;
