import { Oil0702ValidationResult, Oil0702RowProperties } from "../../types/validateResTypes";

export const getValidatePropsForDailyRow = (
    rowIdx: number,
    validateResult: Oil0702ValidationResult | null
): Partial<Record<'total_received' | 'remaining_balance' | 'total_dispatched', Oil0702RowProperties[keyof Oil0702RowProperties]>> => {
    if (!validateResult) return {};

    const vrRow = validateResult.find(row => row.row === rowIdx);
    if (!vrRow) return {};

    const result: any = {};
    if (vrRow.properties.total_received_validation) {
        result.total_received = vrRow.properties.total_received_validation;
    }
    if (vrRow.properties.balance_validation) {
        result.remaining_balance = vrRow.properties.balance_validation;
    }
    if (vrRow.properties.total_dispatched_validation) {
        result.total_dispatched = vrRow.properties.total_dispatched_validation;
    }
    return result;
}

export const getValidatePropsForSummary = (
    validateResult: Oil0702ValidationResult | null
): Oil0702RowProperties | undefined => {
    if (!validateResult) return undefined;
    const vrRow = validateResult.find(row => row.row === "monthly_summary");
    return vrRow?.properties;
}

export const getBorderColor = (passed?: boolean) =>
  `1.5px solid ${passed === true ? "#22C659" : passed === false ? "#FF0100" : "#22C659"}`;
