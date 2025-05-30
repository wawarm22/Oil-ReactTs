import React, { useEffect, useState } from "react";
import { OcrOutturnStatementDocument } from "../../types/ocrFileType";
import { validateOutturn } from "../../utils/api/validateApi";
import { useCompanyStore } from "../../store/companyStore";

interface Props {
    data: OcrOutturnStatementDocument;
}

const ChecklistOutturnStatement: React.FC<Props> = ({ data }) => {
    const [validationResult, setValidationResult] = useState<any>(null);
    const { selectedCompany } = useCompanyStore();
    const factoriesNumber = localStorage.getItem("warehouse") ?? null;
    
    const cleanValue = (val?: any): string => {
        if (val === null || val === undefined) return "";
        const str = String(val);
        if (str.trim() === "" || str === ":unselected:") return "";
        return str.trim();
    };

    const value = data.detail_table_1[27]?.properties?.column_2 || {};
    // const name = data.detail_table_1[27]?.properties?.column_1 || {};
    const valueQuantity = cleanValue(value.value);
    const formattedQuantity = valueQuantity.includes('.') ? valueQuantity.replace(/\./g, ',') : valueQuantity;
    // const nameQuantity = cleanValue(name.value);

    useEffect(() => {
        if (!data) return;

        const validateFields = {
            date: cleanValue(data.date),
            product: cleanValue(data.product),
            quality: "LITRES @30 deg.C",
            quantity: Number(valueQuantity) || 0,
        };

        const validateData = {
            docType: data.docType,
            company: selectedCompany?.name,
            factories: factoriesNumber,
            documentGroup: data.documentGroup || "",
            fields: validateFields,
        };

        validateOutturn(validateData).then((result) => {
            setValidationResult(result);
        });
    }, [data]);

    const borderColor = (passed?: boolean) =>
        `1.5px solid ${passed === true ? "#22C659" : passed === false ? "#FF0100" : "#22C659"}`;

    const renderValidateBox = (
        label: string,
        fieldKey: string,
        value: any
    ) => {
        const v = validationResult?.data?.[fieldKey];
        return (
            <div className="mb-2" key={fieldKey}>
                <div className="fw-bold">{label}</div>
                <div
                    className="rounded-2 shadow-sm bg-white p-2"
                    style={{
                        fontSize: "14px",
                        border: borderColor(v?.passed),
                    }}
                >
                    {cleanValue(value)}
                    
                </div>
            </div>
        );
    };

    return (
        <div className="d-flex flex-column gap-2">
            {renderValidateBox("Date", "date", data.date)}
            {renderValidateBox("PRODUCT", "product_name", data.product)}
            {renderValidateBox("Quantity", "quality", "LITRES @30 deg.C")}
            {valueQuantity && renderValidateBox("ปริมาณ", "quantity", formattedQuantity)}
        </div>
    );
};

export default ChecklistOutturnStatement;
