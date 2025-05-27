import { OcrTaxForm0307Document } from "../../types/ocrFileType";

const columnLabelMap: Record<string, string> = {
    column_1: "ลำดับ",
    column_2: "ประเภทที่",
    column_3: "รายการสินค้า / ชื่อสินค้า",
    column_4: "เเบบ/รุ่น/ดีกรี/CO2/ความหวาน",
    column_5: "ขนาด",
    column_6: "ปริมาณสินค้าที่เสียภาษี",
    column_7: "ราคาขายปลีกแนะนำไม่รวมภาษีมูลค่าเพิ่ม",
    column_8: "ภาษีสรรพสามิต (บาท) ตามมูลค่า",
    column_9: "ภาษีสรรพสามิต (บาท) ตามปริมาณ",
    column_10: "ภาษีต่อปริมาณสินค้าทั้งหมด ตามมูลค่า",
    column_11: "ภาษีต่อปริมาณสินค้าทั้งหมด ตามปริมาณ",
    column_12: "รวมภาษีสรรพสามิต (บาท)",
    column_13: "รวมภาษีสรรพสามิต (สต.)",
    column_14: "ภาษีเก็บเพิ่มฯ (บาท)",
    column_15: "ภาษีเก็บเพิ่มฯ (สต.)",
};

function cleanValue(val?: string | null): string {
    if (!val || val.trim() === "" || val === ":unselected:") return "";
    return val.replace(/:selected:/g, "").trim();
}

function cleanExciseNo(val?: string | null): string {
    if (!val) return "";
    const digitsOnly = val.replace(/\D/g, "");
    return digitsOnly || "";
}

function cleanTaxTypeDate(val?: string | null): string {
    if (!val) return "";
    return val
        .replace(/_/g, " ")
        .replace(/\s*-\s*/g, "-")
        .replace(/\s+/g, " ")
        .trim();
}

export function buildOcr0307FieldRows(data: OcrTaxForm0307Document) {
    const fields = [
        { label: "ชื่อประกอบอุตสาหกรรม/ผู้เสียภาษี", value: data.excise_name },
        { label: "ชื่อโรงอุตสาหกรรม", value: data.company_name },
        { label: "เลขทะเบียนสรรพสามิต", value: cleanExciseNo(data.excise_no) },
        { label: "สถานที่ตั้ง เลขที่", value: data.address_no },
        { label: "หมู่ที่", value: data.moo },
        { label: "ตรอก/ซอย", value: data.soi },
        { label: "ถนน", value: data.road },
        { label: "ตำบล/แขวง", value: data.sub_district },
        { label: "อำเภอ/เขต", value: data.district },
        { label: "จังหวัด", value: data.province },
        { label: "รหัสไปรษณีย์", value: data.postcode },
        { label: "โทรศัพท์", value: data.phone_number },
        { label: "E-mail", value: data.email },
        { label: "กรณีเป็นผู้อื่นโปรดระบุ (สถานะ)", value: data.other_person },
        { label: "ชำระภาษีสำหรับ", value: "" },
    ];

    const rows: { properties: Record<string, { value: string; passed: boolean }> }[] = [];
    const headerProps: Record<string, { value: string; passed: boolean }> = {};

    fields.forEach(({ label, value }) => {
        if (label === "ชำระภาษีสำหรับ") {
            if (data.tax_type_1_check === ":selected:") {
                headerProps["ประเภทภาษี"] = { value: "แสตมป์สรรพสามิต/เครื่องหมายแสดงการเสียภาษี", passed: true };
            }
            if (data.tax_type_2_check === ":selected:") {
                headerProps["ประเภทภาษี"] = { value: `สินค้านำออกตั้งแต่ ${cleanTaxTypeDate(data.tax_type_date)}`, passed: true };
            }
            if (data.tax_type_3_check === ":selected:") {
                headerProps["ประเภทภาษี"] = { value: "ชำระเพิ่มเติม สำหรับใบเสร็จ", passed: true };
            }
            if (data.tax_type_4_check === ":selected:") {
                headerProps["ประเภทภาษี"] = { value: "อื่น", passed: true };
            }
        } else {
            headerProps[label] = { value: cleanValue(value), passed: true };
        }
    });

    rows.push({ properties: headerProps });

    // สร้าง row สำหรับแต่ละแถวในตาราง detail_table (เริ่มที่ row 3)
    (data.detail_table || []).slice(3).forEach((row, rowIndex) => {
        const rawProps = row.properties;
        const properties: Record<string, any> =
            Array.isArray(rawProps) ? rawProps[0] : typeof rawProps === "object" && rawProps !== null ? rawProps : {};

        const rowProps: Record<string, { value: string; passed: boolean }> = {};

        Object.entries(columnLabelMap).forEach(([key, colLabel]) => {
            const value = cleanValue(properties?.[key]?.value ?? "");
            rowProps[`${colLabel} (แถว ${rowIndex + 4})`] = {
                value,
                passed: properties?.[key]?.passed ?? false,
            };
        });

        rows.push({ properties: rowProps });
    });

    return rows;
}
