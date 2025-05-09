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

    return (
        <div className="d-flex flex-column gap-1">
            {fields.map(({ label, value }, idx) => (
                <React.Fragment key={idx}>
                    <div className="fw-bold" style={{ fontSize: "14px" }}>
                        {label}
                    </div>
                    <div
                        className="border rounded-2 shadow-sm bg-white mb-2"
                        style={{ fontSize: "14px", whiteSpace: "pre-line", padding: "10px" }}
                    >
                        {value?.trim() || "-"}
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
};

export default ChecklistTaxForm0502;
