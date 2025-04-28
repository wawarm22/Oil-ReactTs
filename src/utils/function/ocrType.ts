import { OcrFields } from "../../types/ocrFileType";

export const detectOcrType = (fields: Record<string, any>): OcrFields["type"] => {
    if (!fields || typeof fields !== "object") return "unknown";

    if ("amount" in fields && "tax_id" in fields) return "tax";

    if ("form_type" in fields && typeof fields.form_type === "string") {
        const formType = fields.form_type.trim();
        if (formType.includes("ภส.03-07") || formType.includes("กส.๐๓-๐๗")) {
            return "tax_form_0307";
        }
    }

    if ("detail_table" in fields && Array.isArray(fields.detail_table)) {
        const firstTable = fields.detail_table[0];
        if (firstTable && Array.isArray(firstTable.rows)) {
            const thaiDatePattern = /^\d{1,2}\s?(ม\.ค\.|ก\.พ\.|มี\.ค\.|เม\.ย\.|พ\.ค\.|มิ\.ย\.|ก\.ค\.|ส\.ค\.|ก\.ย\.|ต\.ค\.|พ\.ย\.|ธ\.ค\.)\s?\d{2,4}$/;
            const slashDatePattern = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/;

            const hasStockOilPattern = firstTable.rows.some((row: any, idx: number) => {
                const raw = row?.column_0 ?? "";
                const value = raw.trim?.() ?? "";
                const match = thaiDatePattern.test(value) || slashDatePattern.test(value);
                if (value !== "") {
                    console.log(`row[${idx}].column_0 = "${value}" → match: ${match}`);
                }
                return match;
            });

            if (hasStockOilPattern) return "stock_oil";
        }

        const thaiDatePattern = /^\d{1,2}\s?(ม\.ค\.|ก\.พ\.|มี\.ค\.|เม\.ย\.|พ\.ค\.|มิ\.ย\.|ก\.ค\.|ส\.ค\.|ก\.ย\.|ต\.ค\.|พ\.ย\.|ธ\.ค\.)\s?\d{2,4}$/;
        const hasDailyProductionPattern = fields.detail_table.some((entry: any) => {
            const val = entry?.properties?.column_1?.value?.trim?.() ?? "";
            return thaiDatePattern.test(val);
        });

        if (hasDailyProductionPattern) return "daily_production";

        const hasGroupedRow = fields.detail_table.some(
            (row: any) => row?.properties?.material_per_liter?.value === "รวม"
        );

        if (hasGroupedRow) return "grouped_product";

        const hasOilProductPattern = fields.detail_table.some((row: any) => {
            const props = row?.properties ?? {};
            return (
                "column_5" in props &&
                "column_6" in props &&
                "column_7" in props &&
                typeof props.column_5?.value === "string" &&
                props.column_5?.value.includes("\n")
            );
        });

        if (hasOilProductPattern) return "product_document";

        return "table";
    }

    return "unknown";
};
