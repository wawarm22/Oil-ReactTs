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
  const mm = (date.getMonth() + 1).toString().padStart(2, "0");
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
  if (!iso) return "-";
  const d = new Date(iso);
  const yearBE = d.getFullYear() + 543;
  return `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${yearBE}`;
};

export const readableNumber = (value: number, fractions = 0) => {
  return value.toLocaleString("th-TH", {
    style: "decimal",
    minimumFractionDigits: fractions,
    maximumFractionDigits: fractions,
  });
};

export const safeNumber = (input: any, initial: number = 0) => {
  try {
    const num = parseFloat(`${input}`.replace(/,/g, ""));

    return isNaN(num) || num == 0 ? initial : num;
  } catch {
    return initial;
  }
};

const productNameMap: Record<string, string> = {
  "1,990;153": "1,990,153"
};

export const mapNameTrue = (name: string): string => {
  const trimmed = name.trim();
  return productNameMap[trimmed] ?? trimmed;
};

export const cleanAndFormatNumber = (input: string): string => {
  if (!input) return "";
  const cleaned = input.replace(/[.,\-\s]/g, "");
  if (!/^\d+$/.test(cleaned)) return "";
  const padded = cleaned.padStart(5, "0");
  const intPart = padded.slice(0, padded.length - 4);
  const decimalPart = padded.slice(-4);
  const intNumber = intPart ? parseInt(intPart, 10) : 0;

  return `${intNumber.toLocaleString("en-US")}.${decimalPart}`;
};

