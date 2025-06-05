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

    const value = data.detail_table_1?.[27]?.properties?.column_2;
    const rawQuantity = value ? cleanValue(value.value) : "";
    const quantityWithComma = rawQuantity.replace(/\./g, ',');
    const valueQuantityNum = quantityWithComma ? Number(quantityWithComma.replace(/,/g, "")) : 0;


    useEffect(() => {
        if (!data) return;

        const validateFields = {
            date: cleanValue(data.date),
            product: cleanValue(data.product),
            quality: "LITRES @30 deg.C",
            quantity: valueQuantityNum,
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

    const formatWithComma = (val: string | number) => {
        if (typeof val === "number") return val.toLocaleString();
        if (typeof val === "string") {
            const withComma = val.replace(/\./g, ',');
            const num = Number(withComma.replace(/,/g, ""));
            if (!isNaN(num)) {
                return num.toLocaleString();
            }
            return withComma;
        }
        return val ?? "";
    };


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
            {rawQuantity && renderValidateBox("ปริมาณ", "quantity", formatWithComma(rawQuantity))}
        </div>
    );
};

export default ChecklistOutturnStatement;
