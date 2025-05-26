import React from "react";
import { PreparedTaxData } from "../../types/validateTypes";
import { ValidationResult0307 } from "../../types/validateResTypes";
import { getPassedColor } from "../../utils/function/passedColor";
import { formatNumber } from "../../utils/function/format";

type TaxSummaryFieldKey = "raw_tax" | "discount_105";
type TaxSummaryTotalTaxKey = "paid" | "retrived";

interface TaxSummarySectionProps {
    taxKey: keyof PreparedTaxData["taxes"];
    taxLabel: string;
    taxes: PreparedTaxData["taxes"];
    validationResult?: ValidationResult0307["taxes"];
    taxSubFields: Array<{ key: TaxSummaryFieldKey | TaxSummaryTotalTaxKey; label: string }>;
}

export const TaxSummarySection: React.FC<TaxSummarySectionProps> = ({
    taxKey, taxLabel, taxes, validationResult, taxSubFields
}) => {
    const getTaxPassedColor = (
        taxType: keyof PreparedTaxData["taxes"],
        field: TaxSummaryFieldKey | TaxSummaryTotalTaxKey
    ) => {
        if (!validationResult) return "#22C659";
        if (field === "paid" || field === "retrived") {
            return getPassedColor(
                validationResult[taxType]?.total_tax?.[field]?.passed
            );
        } else if (field === "raw_tax" || field === "discount_105") {
            return getPassedColor(
                validationResult[taxType]?.[field]?.passed
            );
        }
        return "#22C659";
    };

    return (
        <div className="mb-2">
            <div className="fw-bold fs-6 mb-1">{taxLabel}</div>
            {taxSubFields.map((field) => {
                let value;
                if (field.key === "paid" || field.key === "retrived") {
                    value = taxes[taxKey]?.total_tax?.[field.key as TaxSummaryTotalTaxKey];
                } else {
                    value = taxes[taxKey]?.[field.key as TaxSummaryFieldKey];
                }
                return (
                    <div key={field.key} className="mb-1">
                        <div className="fw-bold">{field.label}</div>
                        <div
                            className="rounded-2 shadow-sm bg-white p-2"
                            style={{
                                border: `1.5px solid ${getTaxPassedColor(taxKey, field.key)}`
                            }}
                        >
                            {formatNumber(value)}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
