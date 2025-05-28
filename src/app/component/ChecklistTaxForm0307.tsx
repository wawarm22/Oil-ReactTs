import React, { useEffect, useMemo, useState } from "react";
import { OcrTaxForm0307Document } from "../../types/ocrFileType";
import { FaRegCheckSquare, FaRegSquare } from "react-icons/fa";
import { validateOil0307 } from "../../utils/api/validateApi";
import { useCompanyStore } from "../../store/companyStore";

interface Props {
    data: OcrTaxForm0307Document;
}

const ChecklistTaxForm0307: React.FC<Props> = ({ data }) => {
    const { selectedCompany } = useCompanyStore();
    const factoriesNumber = localStorage.getItem("warehouse") ?? null;
    const [_validationResult, setValidationResult] = useState<any>(null);

    const cleanValue = (val?: string | null): string => {
        if (!val || val.trim() === "" || val === ":unselected:") return "";
        return val.replace(/:selected:/g, "").replace(/_/g, "").replace(/-/g, "").trim();
    };

    const cleanExciseNo = (val?: string | null): string => {
        if (!val) return "";
        const digitsOnly = val.replace(/\D/g, "");
        return digitsOnly || "";
    };

    const cleanTaxTypeDate = (val?: string | null): string => {
        if (!val) return "";
        return val
            .replace(/_/g, " ")
            .replace(/\s*-\s*/g, "-")
            .replace(/\s+/g, " ")
            .trim();
    };

    const renderCheckbox = (checked: boolean, label: string, subtext?: string) => (
        <div className="d-flex flex-column">
            <div className="d-flex align-items-center gap-2 py-1" style={{ fontSize: "14px" }}>
                {checked ? <FaRegCheckSquare size={18} /> : <FaRegSquare size={18} />}
                {label}
            </div>
            {checked && subtext && (
                <div className="" style={{ fontSize: "14px", paddingLeft: '26px' }}>
                    {subtext}
                </div>
            )}
        </div>
    );

    const taxTypePassed = (() => {
        const props = _validationResult?.data?.[0]?.properties;
        if (!props) return null;
        const key = "ประเภทภาษี";
        if (typeof props[key]?.passed === "boolean") return props[key].passed;
        return null;
    })();

    const taxTypeSection = (
        <div
            className="rounded-2 shadow-sm bg-white p-2"
            style={{
                borderWidth: "2px",
                borderStyle: "solid",
                borderColor:
                    taxTypePassed === null
                        ? "#22C659"
                        : taxTypePassed
                            ? "#22C659"
                            : "#FF0100"
            }}
        >
            {renderCheckbox(data.tax_type_1_check === ":selected:", "แสตมป์สรรพสามิต/เครื่องหมายแสดงการเสียภาษี")}
            {renderCheckbox(
                data.tax_type_2_check === ":selected:",
                "สินค้านำออกจากโรงอุตสาหกรรม ตั้งแต่",
                cleanTaxTypeDate(data.tax_type_date)
            )}
            {renderCheckbox(data.tax_type_3_check === ":selected:", "ชำระเพิ่มเติม สำหรับใบเสร็จรับเงินเลขที่/เล่มที่")}
            {renderCheckbox(data.tax_type_4_check === ":selected:", "อื่น")}
        </div>
    );

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

    const getApiPropertyKey = (columnKey: string, rowIndex: number) => {
        const actualRow = rowIndex + 4;
        const baseLabel = columnLabelMap[columnKey];
        return `${baseLabel} (แถว ${actualRow})`;
    };

    const ocrFieldRows = useMemo(() => {
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

        data.detail_table.slice(3).forEach((row, rowIndex) => {
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
    }, [data]);

    useEffect(() => {
        if (ocrFieldRows.length > 0 && selectedCompany) {
            const payload = {
                docType: "oil-03-07-page-1",
                company: selectedCompany.name,
                factories: factoriesNumber ?? "",
                documentGroup: data.documentGroup,
                fields: ocrFieldRows,
            };

            validateOil0307(payload).then((res) => {
                console.log("ผลลัพธ์ Validate:", res);
                setValidationResult(res);
            });
        }
    }, [ocrFieldRows, selectedCompany]);

    return (
        <div className="d-flex flex-column gap-3">
            {fields.map(({ label, value }) => (
                <React.Fragment key={label}>
                    {label === "ชำระภาษีสำหรับ" ? (
                        <div>
                            <div className="fw-bold">{label}</div>
                            {taxTypeSection}
                        </div>
                    ) : (
                        <div>
                            <div className="fw-bold">{label}</div>
                            <div
                                className="rounded-2 shadow-sm bg-white p-2"
                                style={{
                                    fontSize: "14px",
                                    borderWidth: "2px",
                                    borderStyle: "solid",
                                    minHeight: "43px",
                                    borderColor:
                                        typeof _validationResult?.data[0]?.properties?.[label]?.passed === "boolean"
                                            ? _validationResult.data[0].properties[label].passed
                                                ? "#22C659"
                                                : "#FF0100"
                                            : "#22C659",
                                }}
                            >
                                {cleanValue(value)}
                            </div>
                        </div>
                    )}
                </React.Fragment>
            ))}

            {data.detail_table.slice(3).map((row, rowIndex) => {
                const rawProps = row.properties;
                const properties: Record<string, any> =
                    Array.isArray(rawProps) ? rawProps[0] : typeof rawProps === "object" && rawProps !== null ? rawProps : {};

                return (
                    <React.Fragment key={`row-${rowIndex}`}>
                        <hr className="border-top border-2 border-secondary m-0 mt-1" />
                        {Object.entries(columnLabelMap).map(([columnKey, label]) => {
                            const value = properties?.[columnKey]?.value ?? "";
                            const apiKey = getApiPropertyKey(columnKey, rowIndex);
                            const passed = _validationResult?.data?.[rowIndex + 1]?.properties?.[apiKey]?.passed;

                            return (
                                <div key={`${rowIndex}-${columnKey}`}>
                                    <div className="fw-bold">{label}</div>
                                    <div
                                        className="rounded-2 shadow-sm bg-white p-2"
                                        style={{
                                            fontSize: "14px",
                                            borderWidth: "2px",
                                            borderStyle: "solid",
                                            minHeight: "43px",
                                            borderColor:
                                                typeof passed === "boolean"
                                                    ? passed
                                                        ? "#22C659"
                                                        : "#FF0100"
                                                    : "#22C659",
                                        }}
                                    >
                                        {value}
                                    </div>
                                </div>
                            );
                        })}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default ChecklistTaxForm0307;
