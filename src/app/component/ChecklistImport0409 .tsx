import React from "react";
import { OcrImport0409Document } from "../../types/ocrFileType";

interface Props {
    data: OcrImport0409Document;
}

const ChecklistImport0409: React.FC<Props> = ({ data }) => {

    const fields = [
        { label: "สั่งการตรวจ", value: data.observe },
        {
            label: "ผู้นำของเข้า (ชื่อ ที่อยู่ โทรศัพท์)",
            value: `${data.company_name_th} ${data.company_name_en} ${data.company_address}`
        },
        { label: "เลขประจำตัวผู้เสียภาษีอากร", value: data.tax_id },
        { label: "สาขา", value: data.branch_no },
        { label: "เลขที่ใบขนสินค้า", value: data.form_no_1 },
        { label: "ประเภทใบขนสินค้า", value: `${data.form_type_1} ${data.form_type_2}` },
    ];

    const taxRows = (data.tax_table ?? []).map((item) => ({
        label: item.properties?.tax_label?.value ?? "",
        taxAmount: item.properties?.tax_amount?.value ?? "",
        securityDeposit: item.properties?.security_deposit?.value ?? ""
    }));

    const footerFields = [
        { label: "ชื่อเเละเลขที่บัตรผ่านพิธีการ", value: data.clearance_crad },
        { label: "ตัวแทนออกของ", value: data.license },
        { label: "เลขที่บัญชีราคาสินค้า", value: `${data.product_no}: ${data.product_date}` },
        { label: "ใบตราส่งเลขที่", value: data.bl_no },
        { label: "นำเข้าทาง", value: data.bl_date },
        { label: "ชื่อยานพาหนะ", value: data.vehicle },
        { label: "วันที่นำเข้า", value: data.import_date },
        { label: "เครื่องหมายและเลขหมายหีบห่อ", value: data.package_id },
        { label: "จำนวนและลักษณะหีบห่อ", value: `${data.package_no} ${data.package_type}` },
        { label: "ประเทศกำเนิด", value: data.origin_country },
        { label: "รหัสประเทศนำเข้า", value: data.origin_code },
        { label: "ประเทศต้นทางที่บรรทุก", value: data.cargo_country },
        { label: "รหัสประเทศต้นทางที่บรรทุก", value: data.cargo_code },
        { label: "ท่าเรือที่นำเข้า", value: data.import_at },
        { label: "รหัสท่าเรือที่นำเข้า", value: data.import_code },
        { label: "สถานที่ตรวจปล่อย", value: data.check_at },
        { label: "รหัสสถานที่ตรวจปล่อย", value: data.check_code },
        { label: "จำนวนหีบห่อ", value: `${data.sum_package_no} ${data.sum_package_unit}` },
        { label: "ตัวอักษร", value: data.sum_package_word },
        { label: "อัตราแลกเปลี่ยน", value: data.change_rate },
    ];

    const totalTax = [
        { label: "รวม/ยกไป", value: data.sum_des },
        { label: "รวมค่าภาษีอากรทั้งสิ้น", value: data.sum_table_2[2].properties.column_2.value }
    ]

    return (
        <div className="d-flex flex-column gap-2" style={{ fontSize: "14px" }}>
            {fields.map(({ label, value }) => (
                <div className="mb-1" key={label}>
                    <div className="fw-bold">{label}</div>
                    <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
                        {value}
                    </div>
                </div>
            ))}

            {(data.tax_table ?? []).length > 0 && (
                <div className="mb-0">
                    <div className="fw-bold mb-1" style={{ fontSize: "16px" }}>ภาษีอากรที่ชำระ</div>
                    {taxRows.map((row, i) => (
                        <React.Fragment key={i}>
                            <div className="fw-bold">{row.label}</div>
                            <div className="fw-bold">ค่าภาษีอากร (บาท)</div>
                            <div className="border rounded-2 shadow-sm bg-white p-2 mb-2" style={{ fontSize: "14px" }}>
                                {row.taxAmount}
                            </div>
                            <div className="fw-bold">เงินประกัน (บาท)</div>
                            <div className="border rounded-2 shadow-sm bg-white p-2 mb-2" style={{ fontSize: "14px" }}>
                                {row.securityDeposit}
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            )}

            {footerFields.map(({ label, value }) => (
                <div className="mb-1" key={label}>
                    <div className="fw-bold">{label}</div>
                    <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
                        {value}
                    </div>
                </div>
            ))}

            {totalTax.map(({ label, value }) => (
                <div className="mb-1" key={label}>
                    <div className="fw-bold">{label}</div>
                    <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
                        {value}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ChecklistImport0409;
