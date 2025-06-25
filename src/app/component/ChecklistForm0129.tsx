import React from "react";
import { OcrTaxForm0129Document } from "../../types/ocrFileType";

interface Props {
    data: OcrTaxForm0129Document;
}

const ChecklistForm0129: React.FC<Props> = ({ data }) => {
    const cleanValue = (val?: any): string => {
        const v = typeof val === "object" && val !== null ? val.value : val;
        if (
            !v ||
            typeof v !== "string" ||
            v.trim() === "" ||
            v.trim() === ":unselected:" ||
            v.trim() === "," ||
            v.trim() === "-"
        ) return "";
        return v.trim();
    };

    const fields = [
        { label: "แบบฟอร์ม", value: "ภ.ษ. 01-29" },
        { label: "ทะเบียนรับเลขที่", value: cleanValue(data.form_no) },
        { label: "วัน เดือน ปี", value: cleanValue(data.form_date) },
        { label: "เจ้าหน้าที่ผู้รับ", value: cleanValue(data.form_officer) },
        { label: "บริษัท", value: cleanValue(data.name) },
        { label: "คลัง", value: cleanValue(data.company_name) },
        { label: "ทะเบียนสรรพสามิตเลขที่", value: cleanValue(data.excise_id) },
        { label: "สถานที่ตั้งเลขที่", value: cleanValue(data.address_no) },
        { label: "ตรอก/ซอย", value: cleanValue(data.soi) },
        { label: "ถนน", value: cleanValue(data.road) },
        { label: "ตำบล/เเขวง", value: cleanValue(data.sub_district) },
        { label: "อำเภอ/เขต", value: cleanValue(data.district) },
        { label: "จังหวัด", value: cleanValue(data.province) },
        { label: "รหัสไปรษณีย์", value: cleanValue(data.postcode) },
        { label: "โทรศัพท์", value: cleanValue(data.phone_number) },
    ];

    const detailTableColumns = [
        { label: "ลำดับ", key: "column_1" },
        { label: "ประเภทสินค้า", key: "column_2" },
        { label: "ชื่อสินค้าที่ผลิต", key: "column_3" },
        { label: "แบบหรือขนาด", key: "column_4" },
        { label: "ประเภทวัตถุดิบ", key: "column_5" },
        { label: "แบบหรือขนาด (วัตถุดิบ)", key: "column_6" },
        { label: "ปริมาณหรือจำนวน", key: "column_7" },
        { label: "หมายเหตุ", key: "column_8" },
    ];

    const footer = [
        { label: "ปริมาณส่วนผสมหรือจำนวนวัตถุดิบหรือส่วนประกอบ เเละวิธีการผลิตสินค้า จำนวน (เเผ่น)", value: cleanValue(data.attach_1_no) },
        { label: "เอกสารอื่นๆ(รายชื่อคลังน้ำมันที่ขออนุมัติใช้สูตร จำนวน (เเผ่น)", value: cleanValue(data.attach_2_no) },
        { label: "ชื่อผู้ลงนาม", value: cleanValue(data.request_name) },
        { label: "วันที่ลงนาม", value: cleanValue(data.request_date) },
    ]

    const first4Keys = detailTableColumns.slice(0, 4).map(col => col.key);

    return (
        <div className="d-flex flex-column gap-2">
            {fields.map(({ label, value }, idx) => (
                <div key={idx} className="mb-1">
                    <div className="fw-bold">{label}</div>
                    <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px", minHeight: "40px" }}>
                        {value}
                    </div>
                </div>
            ))}

            {data.detail_table?.slice(2).map((row, rowIdx) => {
                const col1Value = row.properties?.["column_1"]?.value?.trim?.();
                return (
                    <React.Fragment key={rowIdx}>
                        {detailTableColumns.map((col) => (
                            (!col1Value && first4Keys.includes(col.key))
                                ? null
                                : (
                                    <div key={col.key} className="mb-1">
                                        <div className="fw-bold">{col.label}</div>
                                        <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px", minHeight: "40px" }}>
                                            {row.properties?.[col.key]?.value ?? ""}
                                        </div>
                                    </div>
                                )
                        ))}
                    </React.Fragment>
                );
            })}

            {footer.map(({ label, value }, idx) => (
                <div key={idx} className="mb-1">
                    <div className="fw-bold">{label}</div>
                    <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px", minHeight: "40px" }}>
                        {value}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ChecklistForm0129;
