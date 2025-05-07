import React from "react";
import { OcrOutturnStatementDocument } from "../../types/ocrFileType";

interface Props {
    data: OcrOutturnStatementDocument;
}

const ChecklistOutturnStatement: React.FC<Props> = ({ data }) => {

    const cleanValue = (val?: string | null): string => {
        if (!val || val.trim() === "" || val === ":unselected:") return "";
        return val.trim();
    };

    const fields = [
        { label: "Date", value: cleanValue(data.date) },
        { label: "PRODUCT", value: cleanValue(data.product) },
    ];

    const row29 = data.detail_table?.[0]?.rows?.[29] || {};
    const quantity = cleanValue(row29.column_1); 

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

            {quantity && (
                <>
                    <hr className="border-top border-2 border-secondary m-0 mt-2" />
                    <div className="fw-bold">QUANTITY</div>
                    <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
                        {quantity}
                    </div>
                </>
            )}

        </div>
    );
};

export default ChecklistOutturnStatement;
