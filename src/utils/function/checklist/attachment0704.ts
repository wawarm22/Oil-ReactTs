import { stringToNumber } from "../../../../utils/data";
import {
    checkMaterialMatchAI,
    checkProductMatchAI,
} from "../../../../utils/documentGroup";

export type Check<T = string> = {
    label: string;
    value: T;
    expected: T;
    passed: boolean;
};

export const genRequestObject = async (input: Record<string, any>) => {
    const materials: Material[] = [];
    const products: Product[] = [];

    const fields = input.fields;

    const detail_table_1 = (fields?.detail_table_1 as any[]) || [];
    for (let i = 0; i < detail_table_1.length; i++) {
        const row = detail_table_1[i];
        const col1 = row.properties?.column_1?.value || "";
        const col2 = row.properties?.column_2?.value || "";
        const col3 = row.properties?.column_3?.value || "";
        const col4 = row.properties?.column_4?.value || "";
        const col5 = row.properties?.column_5?.value || "";
        const col6 = row.properties?.column_6?.value || "";
        const col7 = row.properties?.column_7?.value || "";
        const col8 = row.properties?.column_8?.value || "";
        const col9 = row.properties?.column_9?.value || "";
        const col10 = row.properties?.column_10?.value || "";
        const col11 = row.properties?.column_11?.value || "";
        const col12 = row.properties?.column_12?.value || "";
        const col13 = row.properties?.column_13?.value || "";
        const col14 = row.properties?.column_14?.value || "";
        const col15 = row.properties?.column_15?.value || "";
        const col16 = row.properties?.column_16?.value || "";

        const is_title = await checkMaterialMatchAI(
            col1,
            "ประเภทวัตถุดิบ(หน่วย) รายการ"
        );
        const is_open = await checkMaterialMatchAI(col1, "(๔) คงเหลือยกมา");
        const is_getted = await checkMaterialMatchAI(col1, "(๕) รับเดือนนี้");
        const is_total = await checkMaterialMatchAI(col1, "(๖) รวม");
        const is_produce = await checkMaterialMatchAI(
            col1,
            "(๗) ผลิตสินค้าตามพิกัด ฯ"
        );
        const is_produce_other = await checkMaterialMatchAI(
            col1,
            "(๘) ผลิตสินค้าอิน"
        );
        const is_defected = await checkMaterialMatchAI(
            col1,
            "(๘) ส่วนขาด/ส่วนเกิน"
        );
        const is_etc = await checkMaterialMatchAI(col1, "(๑๐) อื่น ๆ");
        const is_loss_gain = await checkMaterialMatchAI(col1, "(๑๑) Loss/Gain");
        const is_forward = await checkMaterialMatchAI(col1, "(๑๒) คงเหลือยกไป");

        if (is_title || i == 0) {
            const cols = [
                col2,
                col3,
                col4,
                col5,
                col6,
                col7,
                col8,
                col9,
                col10,
                col11,
                col12,
                col13,
                col14,
                col15,
                col16,
            ];
            materials.push(...cols.map(emptyMaterial));
        } else {
            const columns = [
                stringToNumber(col2),
                stringToNumber(col3),
                stringToNumber(col4),
                stringToNumber(col5),
                stringToNumber(col6),
                stringToNumber(col7),
                stringToNumber(col8),
                stringToNumber(col9),
                stringToNumber(col10),
                stringToNumber(col11),
                stringToNumber(col12),
                stringToNumber(col13),
                stringToNumber(col14),
                stringToNumber(col15),
                stringToNumber(col16),
            ];

            const field = is_open
                ? "open"
                : is_getted
                    ? "getted"
                    : is_total
                        ? "total"
                        : is_produce
                            ? "produce"
                            : is_produce_other
                                ? "produce_other"
                                : is_loss_gain
                                    ? "loss_gain"
                                    : is_forward
                                        ? "forward"
                                        : is_defected
                                            ? "defected"
                                            : is_etc
                                                ? "etc"
                                                : null;

            if (field) {
                for (let j = 0; j < 16; j++) {
                    if (materials[j]?.[field] !== undefined) {
                        materials[j][field] = columns[j];
                    }
                }
            }
        }
    }

    const detail_table_2 = (fields?.detail_table_2 as any[]) || [];
    for (let i = 0; i < detail_table_2.length; i++) {
        const row = detail_table_2[i];
        const col1 = row.properties?.column_1?.value || "";
        const col2 = row.properties?.column_2?.value || "";
        const col3 = row.properties?.column_3?.value || "";
        const col4 = row.properties?.column_4?.value || "";
        const col5 = row.properties?.column_5?.value || "";
        const col6 = row.properties?.column_6?.value || "";
        const col7 = row.properties?.column_7?.value || "";
        const col8 = row.properties?.column_8?.value || "";
        const col9 = row.properties?.column_9?.value || "";
        const col10 = row.properties?.column_10?.value || "";
        const col11 = row.properties?.column_11?.value || "";
        const col12 = row.properties?.column_12?.value || "";
        const col13 = row.properties?.column_13?.value || "";
        const col14 = row.properties?.column_14?.value || "";

        const is_title = await checkProductMatchAI(
            col1,
            "ประเภทสินค้า ซนิด ตราหรือเครื่องหมาย/ แบบรุ่น/ตกรความหวาน ขนาด รายการ (หน่วย)"
        );
        const is_open = await checkProductMatchAI(col1, "(๑๓) คงเหลือยกมา");
        const is_produced = await checkProductMatchAI(col1, "");
        const is_bonded_return = await checkProductMatchAI(
            col1,
            "(๑๕) รับคืนจากคลังสินค้าทัณฑ์บน"
        );
        const is_etc = await checkProductMatchAI(col1, "(๑๖) อิน ๆ");
        const is_total = await checkProductMatchAI(col1, "(๑๗) รวม");
        const is_domestic_sales = await checkProductMatchAI(
            col1,
            "(๑๘) จำหน่ายในประเทศ"
        );
        const is_overseas_sales = await checkProductMatchAI(
            col1,
            "(๑๙) จำหน่ายต่างประเทศ"
        );
        const is_used_in_industrial_plans = await checkProductMatchAI(
            col1,
            "(๒๐) ใช้ในโรงอุตสาหกรรม"
        );
        const is_bonded = await checkProductMatchAI(col1, "(๒๑) คลังสินค้าทัณฑ์บน");
        const is_defected = await checkProductMatchAI(col1, "(๒๒) เสียหาย");
        const is_etc_used = await checkProductMatchAI(col1, "๒๓) อัน ๆ");
        const is_forward = await checkProductMatchAI(col1, "(๒๕) คงเหลือยกไป");

        if (is_title || i == 0) {
            const cols = [
                col2,
                col3,
                col4,
                col5,
                col6,
                col7,
                col8,
                col9,
                col10,
                col11,
                col12,
                col13,
                col14,
            ];
            products.push(...cols.map(emptyProduct));
        } else {
            const columns = [
                stringToNumber(col2),
                stringToNumber(col3),
                stringToNumber(col4),
                stringToNumber(col5),
                stringToNumber(col6),
                stringToNumber(col7),
                stringToNumber(col8),
                stringToNumber(col9),
                stringToNumber(col10),
                stringToNumber(col11),
                stringToNumber(col12),
                stringToNumber(col13),
                stringToNumber(col14),
            ];

            const field = is_open
                ? "open"
                : is_produced
                    ? "produced"
                    : is_bonded_return
                        ? "bonded_return"
                        : is_etc
                            ? "etc"
                            : is_total
                                ? "total"
                                : is_domestic_sales
                                    ? "domestic_sales"
                                    : is_overseas_sales
                                        ? "overseas_sales"
                                        : is_used_in_industrial_plans
                                            ? "used_in_industrial_plans"
                                            : is_bonded
                                                ? "bonded"
                                                : is_defected
                                                    ? "defected"
                                                    : is_etc_used
                                                        ? "etc_used"
                                                        : is_forward
                                                            ? "forward"
                                                            : null;

            if (field) {
                for (let j = 0; j < 16; j++) {
                    if (products[j]?.[field] !== undefined) {
                        products[j][field] = columns[j];
                    }
                }
            }
        }
    }

    return {
        form_type: fields?.form_type ?? null,
        request_number: null,
        received_at: fields?.date ?? null,
        form_officer_name: fields?.form_officer_name ?? null,
        company_name: fields?.company_name ?? null,
        excise_id: fields?.excise_id ?? null,
        date: fields?.date ?? null,
        materials: materials,
        products: products,
    };
};

type Product = {
    product_name: string;
    open: number;
    produced: number;
    bonded_return: number;
    etc_getted: number;
    total: number;
    domestic_sales: number;
    overseas_sales: number;
    used_in_industrial_plans: number;
    bonded: number;
    defected: number;
    forward: number;
    etc_used: number;
};

type Material = {
    material_name: string;
    open: number;
    getted: number;
    total: number;
    produce: number;
    produce_other: number;
    defected: number;
    etc: number;
    loss_gain: number;
    forward: number;
};

const emptyMaterial = (name: string) =>
({
    material_name: name,
    open: 0,
    getted: 0,
    total: 0,
    produce: 0,
    produce_other: 0,
    defected: 0,
    etc: 0,
    loss_gain: 0,
    forward: 0,
} as Material);

const emptyProduct = (name: string) =>
({
    product_name: name,
    open: 0,
    produced: 0,
    bonded_return: 0,
    etc_getted: 0,
    total: 0,
    domestic_sales: 0,
    overseas_sales: 0,
    used_in_industrial_plans: 0,
    bonded: 0,
    defected: 0,
    forward: 0,
    etc_used: 0,
} as Product);