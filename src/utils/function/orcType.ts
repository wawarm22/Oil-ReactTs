import { OcrFields } from "../../types/ocrFileType";

export const detectOcrType = (fields: Record<string, any>): OcrFields["type"] => {
    if ("amount" in fields && "tax_id" in fields) return "tax";
    if ("detail_table" in fields) return "table";
    return "unknown";
};
