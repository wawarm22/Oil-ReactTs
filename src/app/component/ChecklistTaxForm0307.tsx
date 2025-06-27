import React from "react";
import { OcrTaxForm0307Document } from "../../types/ocrFileType";
import { FaRegCheckSquare, FaRegSquare } from "react-icons/fa";
import { Prepared0307Payload, Prepared0307Product } from "../../types/validateTypes";
import { formatNumberOnly } from "../../utils/function/format";
import { ValidatedTaxes, ValidateResult0307 } from "../../types/validateResTypes";

interface Props {
    data: OcrTaxForm0307Document;
    validateResult: ValidateResult0307 | null;
    context: Prepared0307Payload | null;
}

const ChecklistTaxForm0307: React.FC<Props> = ({ validateResult, context }) => {
    const ocrData = context?.fields;
    if (!ocrData) return <div>ไม่พบข้อมูล</div>;

    const fields = [
        { label: "ชื่อประกอบอุตสาหกรรม/ผู้เสียภาษี", key: "company_name" },
        { label: "ชื่อโรงอุตสาหกรรม", key: "factory_name" },
        { label: "เลขทะเบียนสรรพสามิต", key: "excise_no" },
        { label: "สถานที่ตั้ง เลขที่", key: "address_no" },
        { label: "หมู่ที่", key: "village_no" },
        { label: "ตรอก/ซอย", key: "soi" },
        { label: "ถนน", key: "street" },
        { label: "ตำบล/แขวง", key: "sub_district" },
        { label: "อำเภอ/เขต", key: "district" },
        { label: "จังหวัด", key: "province" },
        { label: "รหัสไปรษณีย์", key: "zipcode" },
        { label: "โทรศัพท์", key: "tel_no" },
        { label: "E-mail", key: "email" },
        { label: "กรณีเป็นผู้อื่นโปรดระบุ (สถานะ)", key: "other_person" },
        { label: "ชำระภาษีสำหรับ", key: "tax_for" },
    ] as const;

    const productFields: { key: keyof Prepared0307Product; label: string }[] = [
        { key: "index", label: "ลำดับ" },
        { key: "product_type", label: "ประเภทที่" },
        { key: "product_name", label: "รายการสินค้า / ชื่อสินค้า" },
        { key: "model_info", label: "เเบบ/รุ่น/ดีกรี/CO2/ความหวาน" },
        { key: "size", label: "ขนาด" },
        { key: "quantity", label: "ปริมาณสินค้าที่เสียภาษี" },
        { key: "retail_price", label: "ราคาขายปลีกแนะนำไม่รวมภาษีมูลค่าเพิ่ม" },
        { key: "excise_tax_by_value", label: "ภาษีสรรพสามิต (บาท) ตามมูลค่า" },
        { key: "tax_rate", label: "ภาษีสรรพสามิต (บาท) ตามปริมาณ" },
        { key: "tax_per_total_by_value", label: "ภาษีต่อปริมาณสินค้าทั้งหมด ตามมูลค่า" },
        { key: "tax_per_total_by_vol", label: "ภาษีต่อปริมาณสินค้าทั้งหมด ตามปริมาณ" },
        { key: "excise_tax_baht", label: "รวมภาษีสรรพสามิต (บาท)" },
        { key: "excise_tax_satang", label: "รวมภาษีสรรพสามิต (สต.)" },
        { key: "interior_tax_baht", label: "ภาษีเก็บเพิ่มฯ (บาท)" },
        { key: "interior_tax_satang", label: "ภาษีเก็บเพิ่มฯ (สต.)" },
    ];

    const totalField: { section: string, key: keyof ValidatedTaxes }[] = [
        { section: "รวมภาษี", key: "base" },
        { section: "หักลดหย่อนภาษี", key: "discount" },
        { section: "คงเหลือภาษี", key: "remains" },
        { section: "เบี้ยปรับ", key: "fine" },
        { section: "เงินเพิ่มร้อยละ ต่อเดือน", key: "additional_percentage" },
        { section: "รวม(11)(12)(13)", key: "total" },
        { section: "หักคืนภาษีที่", key: "discount_at" },
        { section: "รวม", key: "balance" },
    ];

    const isValidatedTaxGroup = (group: any): group is { excise: any; interior: any } => {
        return group && typeof group === "object" && "excise" in group && "interior" in group;
    };

    const taxFor = ocrData.tax_for;
    const renderCheckbox = (checked: boolean, label: string, subtext?: string) => (
        <div className="d-flex flex-column">
            <div className="d-flex align-items-center gap-2 py-1" style={{ fontSize: "14px" }}>
                {checked ? <FaRegCheckSquare size={18} /> : <FaRegSquare size={18} />}
                {label}
            </div>
            {checked && subtext && (
                <div style={{ fontSize: "14px", paddingLeft: '26px' }}>{subtext}</div>
            )}
        </div>
    );

    const taxTypeSection = (() => {
        return (
            <div className="p-2">
                {renderCheckbox(taxFor?.check === "stamp", "แสตมป์สรรพสามิต/เครื่องหมายแสดงการเสียภาษี", undefined)}
                {renderCheckbox(taxFor?.check === "export", "สินค้านำออกจากโรงอุตสาหกรรม ตั้งแต่", taxFor?.description)}
                {renderCheckbox(taxFor?.check === "add", "ชำระเพิ่มเติม สำหรับใบเสร็จรับเงินเลขที่/เล่มที่", undefined)}
                {renderCheckbox(taxFor?.check === "etc", "อื่นๆ", undefined)}
            </div>
        );
    })();

    const taxesData = ocrData.taxes;

    return (
        <div className="d-flex flex-column gap-3">
            {fields.map(({ label, key }) => {
                let value = (ocrData as any)[key];

                if (key === "excise_no" && typeof value === "string") {
                    value = value.replace(/[\s-]/g, "");
                }

                let passed: boolean | null = null;
                if (validateResult) {
                    if (key === "tax_for") {
                        const taxForRes = (validateResult as any).tax_for;
                        if (
                            typeof taxForRes?.check?.passed === "boolean" &&
                            typeof taxForRes?.description?.passed === "boolean"
                        ) {
                            passed = taxForRes.check.passed && taxForRes.description.passed;
                        }
                    } else {
                        const validateField = (validateResult as any)[key];
                        if (validateField && typeof validateField.passed === "boolean") {
                            passed = validateField.passed;
                        }
                    }
                }
                if (key === "tax_for") {
                    return (
                        <div key={key}>
                            <div className="fw-bold">{label}</div>
                            <div
                                className="rounded-2 shadow-sm bg-white p-2"
                                style={{
                                    borderWidth: "2px",
                                    borderStyle: "solid",
                                    borderColor:
                                        passed === null
                                            ? "#CED4DA"
                                            : passed
                                                ? "#22C659"
                                                : "#FF0100",
                                }}
                            >
                                {taxTypeSection}
                            </div>
                        </div>
                    );
                }
                return (
                    <div key={key}>
                        <div className="fw-bold">{label}</div>
                        <div
                            className="rounded-2 shadow-sm bg-white p-2"
                            style={{
                                fontSize: "14px",
                                borderWidth: "2px",
                                borderStyle: "solid",
                                minHeight: "43px",
                                borderColor:
                                    passed === null
                                        ? "#CED4DA"
                                        : passed
                                            ? "#22C659"
                                            : "#FF0100",
                            }}
                        >
                            {value}
                        </div>
                    </div>
                );
            })}

            {ocrData.products && ocrData.products.length > 0 && (
                <div>
                    {ocrData.products.map((prod, idx) => (
                        <div key={idx} className="mb-0">
                            {productFields.map(({ key, label }) => {
                                let passed: boolean | null = null;
                                if (validateResult?.products?.[idx] && key in validateResult.products[idx]) {
                                    const valField = (validateResult.products[idx] as any)[key];
                                    if (valField && typeof valField.passed === "boolean") {
                                        passed = valField.passed;
                                    }
                                }

                                let displayValue = formatNumberOnly(prod[key]) ?? "";
                                if (key === "product_name") {
                                    displayValue = String(displayValue).replace(/\s/g, "");
                                }
                                return (
                                    <div key={key} className="mb-2">
                                        <div className="fw-bold">{label}</div>
                                        <div
                                            className="rounded-2 shadow-sm bg-white p-2"
                                            style={{
                                                fontSize: "14px",
                                                borderWidth: "2px",
                                                borderStyle: "solid",
                                                minHeight: "43px",
                                                borderColor:
                                                    passed === null
                                                        ? "#CED4DA"
                                                        : passed
                                                            ? "#22C659"
                                                            : "#FF0100",
                                            }}
                                        >
                                            {displayValue}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            )}

            {totalField.map(({ section, key }) => {
                const group = taxesData[key];
                const groupValidate = validateResult?.taxes?.[key];
                return (
                    <div key={section} className="mb-2">
                        <div className="fw-bold mb-1">{section}</div>
                        {isValidatedTaxGroup(group) && isValidatedTaxGroup(groupValidate) && (
                            [
                                { label: "รวมภาษีสรรพสามิต", field: "excise" as const },
                                { label: "ภาษีเก็บเพิ่มเพื่อราชการส่วนท้องถิ่นร้อยละ 10", field: "interior" as const },
                            ].map(({ label, field }) => {
                                let passed: boolean | null = null;
                                const vField = groupValidate[field];
                                if (vField && typeof vField.passed === "boolean") {
                                    passed = vField.passed;
                                }
                                return (
                                    <div className="mb-1" key={label}>
                                        <div className="fw-bold">{label}</div>
                                        <div
                                            className="rounded-2 shadow-sm bg-white p-2"
                                            style={{
                                                fontSize: "14px",
                                                minHeight: "40px",
                                                borderWidth: "2px",
                                                borderStyle: "solid",
                                                borderColor:
                                                    passed === null
                                                        ? "#CED4DA"
                                                        : passed
                                                            ? "#22C659"
                                                            : "#FF0100"
                                            }}
                                        >
                                            {formatNumberOnly(group[field])}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ChecklistTaxForm0307;
