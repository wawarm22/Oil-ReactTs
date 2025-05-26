import React from "react";
import { OcrTaxForm0502Document } from "../../types/ocrFileType";

interface Props {
    data: OcrTaxForm0502Document;
}

const ChecklistTaxForm0502: React.FC<Props> = ({ data }) => {
    const fields = [
        { label: "ในแบบฟอร์ม", value: data.form_type },
        { label: "ทะเบียนรับอิเล็กทรอนิกส์เลขที่", value: data.electronics_id },
        { label: "ทะเบียนรับเอกสารเลขที่", value: data.form_id },
        { label: "วัน เดือน ปี", value: data.date },
        { label: "เจ้าหน้าที่ผู้รับ", value: data.officer_signature },
        { label: "บริษัท", value: data.name },
        { label: "คลัง", value: data.company_name },
        { label: "ทะเบียนสรรพสามิตเลขที่", value: data.excise_id },
        { label: "สถานที่ตั้งเลขที่", value: data.address },
        { label: "ตรอก/ซอย", value: data.soi },
        { label: "ถนน", value: data.road },
        { label: "ตำบล/แขวง", value: data.sub_district },
        { label: "อำเภอ/เขต", value: data.district },
        { label: "จังหวัด", value: data.province },
        { label: "รหัสไปรษณีย์", value: data.postcode },
        { label: "โทรศัพท์", value: data.phone_number },
    ];

    const detailFieldMapping = [
        { label: "ลำดับ", key: "column_1" },
        { label: "ประเภทสินค้า", key: "column_2" },
        { label: "ชื่อสินค้าที่ผลิต", key: "column_3" },
        { label: "แบบหรือขนาด", key: "column_4" },
        { label: "ประเภท", key: "column_5" },
        { label: "เเบบหรือขนาด", key: "column_6" },
        { label: "ปริมาณหรือจำนวน", key: "column_7" },
        { label: "หมายเหตุ", key: "column_8" },
    ];

    // ไม่ต้อง filter อะไรพิเศษแล้ว! ให้เริ่มที่ index 1 แล้ววนทุก row ได้เลย
    const detailRows = (data.detail_table || []).slice(1);

    return (
        <div className="d-flex flex-column gap-1">
            {/* Fields หลัก */}
            {fields.map(({ label, value }, idx) => (
                <React.Fragment key={idx}>
                    <div className="fw-bold" style={{ fontSize: "14px" }}>
                        {label}
                    </div>
                    <div
                        className="rounded-2 shadow-sm bg-white mb-2"
                        style={{
                            fontSize: "14px",
                            whiteSpace: "pre-line",
                            padding: "10px",
                            minHeight: "43px",
                            border: `1.5px solid #22C659`
                        }}
                    >
                        {value?.trim() || ""}
                    </div>
                </React.Fragment>
            ))}

            {/* Detail Table Fields */}
            {detailRows.length > 0 && (
                <div className="mt-3">
                    {detailRows.map((row, idx) => (
                        <React.Fragment key={idx}>
                            {detailFieldMapping.map(({ label, key }) => {
                                const value = row.properties?.[key]?.value?.trim();
                                // เฉพาะ column_1-4: โชว์เฉพาะถ้ามีค่า, อื่นๆ (5-8) โชว์หมด
                                if (
                                    (["column_1", "column_2", "column_3", "column_4"].includes(key) && value) ||
                                    (!["column_1", "column_2", "column_3", "column_4"].includes(key))
                                ) {
                                    return (
                                        <div key={key} className="mb-1">
                                            <span className="fw-bold" style={{ fontSize: "14px" }}>
                                                {label}
                                            </span>
                                            <div
                                                className="rounded-2 shadow-sm bg-white mb-2"
                                                style={{
                                                    fontSize: "14px",
                                                    padding: "10px",
                                                    minHeight: "43px",
                                                    border: "1.5px solid #22C659"
                                                }}
                                            >
                                                {value || "-"}
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChecklistTaxForm0502;
