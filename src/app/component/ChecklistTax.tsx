import React, { useEffect, useState } from "react";
import { OcrTaxDocument } from "../../types/ocrFileType";
import { useCompanyStore } from "../../store/companyStore";
import { validateSubmission } from "../../utils/api/validateApi";

interface ChecklistTaxProps {
    data: OcrTaxDocument;
    docId: number;
    subIdx: number;
    onValidationStatusChange?: (status: { docId: number; subIdx: number; failed: boolean }) => void;
}

const ChecklistTax: React.FC<ChecklistTaxProps> = ({
    data,
    docId,
    subIdx,
    onValidationStatusChange
}) => {
    const { selectedCompany } = useCompanyStore();
    const factoriesNumber = localStorage.getItem("warehouse") ?? null;

    const [validationResults, setValidationResults] = useState<
        Record<string, { value: string; expected: string; passed: boolean }>
        | null
    >(null);

    const payload = {
        docType: data.docType,
        company: selectedCompany?.name ?? "",
        factories: factoriesNumber ?? "",
        documentGroup: data.documentGroup,
        fields: {
            company_name: data.company_name,
            branch_no: data.branch_no,
            tax_date: data.tax_date,
            amount: data.amount,
            reference_no: data.tax_id,
        },
    };

    useEffect(() => {
        validateSubmission(payload).then((res) => {
            if (res?.status && Array.isArray(res.data) && res.data[0]?.properties) {
                setValidationResults(res.data[0].properties);

                const hasFailed = Object.values(res.data[0].properties).some(
                    (v: any) => v.passed === false
                );
                onValidationStatusChange?.({ docId, subIdx, failed: hasFailed });
            } else {
                onValidationStatusChange?.({ docId, subIdx, failed: false });
            }
        });
    }, [data]);

    const fields = [
        { key: "company_name", label: "บริษัท", value: data.company_name },
        { key: "branch_no", label: "คลังน้ำมัน", value: data.branch_no },
        { key: "tax_date", label: "วันที่", value: data.tax_date },
        {
            key: "amount",
            label: "จำนวนเงินขอคืนภาษี",
            value: data.amount,
        },
    ];

    return (
        <div className="d-flex flex-column gap-1">
            {fields.map((field, index) => {
                const validation = validationResults?.[field.key];
                const isValid = validation?.passed;
                const borderColor = validation
                    ? isValid
                        ? "#22C659"
                        : "#FF0100"
                    : "#CED4DA";

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
