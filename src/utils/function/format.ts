export const formatNumber = (value: any) =>
    typeof value === "number"
        ? value.toLocaleString()
        : !isNaN(Number(value)) && value !== "" && value !== null
            ? Number(value).toLocaleString()
            : value;

export function cleanExciseId(value?: string | number | null): string {
    if (!value) return "";
    return String(value).replace(/[-\s]/g, "");
}

export function extractDigits(value?: string | number | null): string {
    if (!value) return "";
    return String(value).replace(/\D/g, "");
}

