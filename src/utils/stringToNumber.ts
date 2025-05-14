export const stringToNumber = (value: string): number => {
    if (!value) return 0;

    const cleaned = value.replace(/,/g, "").trim();
    const parsed = parseFloat(cleaned);

    return isNaN(parsed) ? 0 : parsed;
};
