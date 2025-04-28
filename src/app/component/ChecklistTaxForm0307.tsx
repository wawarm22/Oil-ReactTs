import React from "react";
import { OcrTaxForm0307Document } from "../../types/ocrFileType";
import { FaRegCheckSquare, FaRegSquare } from "react-icons/fa";

interface Props {
    data: OcrTaxForm0307Document;
}

const ChecklistTaxForm0307: React.FC<Props> = ({ data }) => {
    const cleanValue = (val?: string | null): string => {
        if (!val || val.trim() === "" || val === ":unselected:") return "-";
        return val.replace(/:selected:/g, "").trim();
    };

    const renderCheckbox = (checked: boolean, label: string, subtext?: string) => (
        <div className="d-flex flex-column">
            <div className="d-flex align-items-center gap-2 py-1" style={{ fontSize: "14px" }}>
                {checked ? <FaRegCheckSquare size={18} /> : <FaRegSquare size={18} />}
                {label}
            </div>
            {checked && subtext && (
                <div className="" style={{ fontSize: "14px", paddingLeft: '26px' }}>
                    วันที่ {subtext}
                </div>
            )}
        </div>
    );

    const taxTypeSection = (
        <div className="border rounded-2 shadow-sm bg-white p-2">
            {renderCheckbox(data.tax_type_1_check === ":selected:", "แสตมป์สรรพสามิต/เครื่องหมายแสดงการเสียภาษี")}
            {renderCheckbox(
                data.tax_type_2_check === ":selected:",
                "สินค้านำออกจากโรงอุตสาหกรรม ตั้งแต่",
                cleanValue(data.tax_type_date)
            )}
            {renderCheckbox(data.tax_type_3_check === ":selected:", "ชำระเพิ่มเติม สำหรับใบเสร็จรับเงินเลขที่/เล่มที่")}
            {renderCheckbox(data.tax_type_4_check === ":selected:", "อื่น")}
        </div>
    );

    const fields = [
        { label: "ชื่อประกอบอุตสาหกรรม/ผู้เสียภาษี", value: data.excise_name },
        { label: "ชื่อโรงอุตสาหกรรม", value: data.company_name },
        { label: "เลขทะเบียนสรรพสามิต", value: data.excise_no },
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
                            <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
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
                        {Object.entries(columnLabelMap).map(([key, label]) => {
                            const value = properties?.[key]?.value ?? "-";
                            return (
                                <div key={`${rowIndex}-${key}`}>
                                    <div className="fw-bold">{label}</div>
                                    <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
                                        {cleanValue(value)}
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
