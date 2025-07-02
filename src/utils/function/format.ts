export const formatNumber = (value: any) =>
    typeof value === "number"
        ? value.toLocaleString()
        : !isNaN(Number(value)) && value !== "" && value !== null
            ? Number(value).toLocaleString()
            : value;

export const formatNumberOnly = (value: any) =>
    typeof value === "number" ? value.toLocaleString() : value;

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

// export const formatToNumber = (value: any) => {
//     if (typeof value === "number" && !isNaN(value)) return value.toLocaleString("en-US");
//     if (typeof value === "string" && !isNaN(Number(value)) && value.trim() !== "") return Number(value).toLocaleString("en-US");
//     return value ?? "";
// };

export const formatDate = (iso: string) => {
  if (!iso) return '-';
  const d = new Date(iso);
  return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth()+1)
    .toString().padStart(2, '0')}-${d.getFullYear().toString().slice(-2)}`;
};
