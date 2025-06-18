import React from "react";
import { OcrTaxDocument } from "../../types/ocrFileType";
import { formatAmount } from "../../utils/function/ocrValidateMap";
import { useCompanyStore } from "../../store/companyStore";

interface ChecklistTaxProps {
    data: OcrTaxDocument;
    validateResult?: {
        status: boolean;
        message: string;
        data: Array<{
            row?: number;
            properties: Record<string, { value: string; expected: string; passed: boolean }>;
        }>;
    } | null;
}

const ChecklistTax: React.FC<ChecklistTaxProps> = ({
    data,
    validateResult
}) => {
    const { selectedCompany } = useCompanyStore();

    const isShell = String(selectedCompany?.name ?? '').toLowerCase() === 'shell';

    const fields = [
        { key: "company_name", label: "บริษัท", value: data.company_name },
        !isShell ? { key: "branch_no", label: "คลังน้ำมัน", value: data.branch_no } : undefined,
        { key: "tax_date", label: "วันที่", value: data.tax_date },
        {
            key: "amount",
            label: "จำนวนเงินขอคืนภาษี",
            value: formatAmount(data.amount),
        },
    ].filter((f): f is { key: string; label: string; value: string } => !!f);


    const validationProperties =
        validateResult?.data?.[0]?.properties ?? {};

    return (
        <div className="d-flex flex-column gap-1">
            {fields.map((field, index) => {
                const validation = validationProperties[field.key];
                const isValid = validation ? validation.passed : true;
                const borderColor = isValid ? "#22C659" : "#FF0100";

                return (
                    <React.Fragment key={index}>
                        <div className="fw-bold">{field.label}</div>
                        <div
                            className="rounded-3 shadow-sm bg-white mb-1"
                            style={{
                                fontSize: "14px",
                                whiteSpace: "pre-line",
                                padding: "10px 10px",
                                minHeight: "42px",
                                border: `1.5px solid ${borderColor}`,
                            }}
                        >
                            {field.value}
                        </div>
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default ChecklistTax;
