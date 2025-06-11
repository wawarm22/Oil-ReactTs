export const getBorderColor = (validation: { passed?: boolean } | undefined) => {
    if (validation === undefined) return "1px solid #dee2e6";
    if (validation.passed === true) return "2px solid #22C659";
    if (validation.passed === false) return "2px solid #FF0100";
    return "1px solid #dee2e6";
};

export const borderColor = (passed?: boolean): string => {
    return `1.5px solid ${passed === true ? "#22C659" : passed === false ? "#FF0100" : "#CED4DA"}`;
}
