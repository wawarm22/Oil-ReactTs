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

export function formatMonthToBE(date: Date | null): string | null {
    if (!date) return null;
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const yyyyBE = (date.getFullYear() + 543).toString();
    return `${mm}-${yyyyBE}`;
}

export function formatDateToThai(date: Date | null): string {
    if (!date) return "";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = (date.getFullYear() + 543).toString();
    return `${day}-${month}-${year}`;
}
