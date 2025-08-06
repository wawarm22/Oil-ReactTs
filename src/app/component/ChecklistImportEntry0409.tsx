import React from "react";
import { OcrImportEntry0409Document } from "../../types/ocrFileType";

interface Props {
    data: OcrImportEntry0409Document;
}

const ChecklistImportEntry0409: React.FC<Props> = ({ data }) => {

    const cleanValue = (val?: string | null): string => {
        if (!val || val.trim() === "" || val === ":unselected:") return "";
        return val.trim();
    };

    const fields = [
        { label: "สั่งการตรวจ", value: data.observe },
        {
            label: "ผู้นำของเข้า (ชื่อ ที่อยู่ โทรศัพท์)",
            value: `${cleanValue(data.company_name_th)} ${cleanValue(data.company_name_en)} ${cleanValue(data.company_address)}`
        },
        { label: "เลขประจำตัวผู้เสียภาษีอากร", value: data.tax_id },
        { label: "สาขา", value: data.branch_no },
        { label: "เลขที่ใบขนสินค้า", value: data.form_no },
        { label: "ประเภทใบขนสินค้า", value: data.form_type },
    ];

    const footerFields = [
        { label: "ชื่อเเละเลขที่บัตรผ่านพิธีการ", value: data.clearance_crad },
        { label: "ตัวแทนออกของ", value: data.agent_of },
        { label: "เลขที่บัญชีราคาสินค้า", value: data.product_account },
        { label: "ใบตราส่งเลขที่", value: data.bl_no },
        { label: "นำเข้าทาง", value: data.vehicle_type },
        { label: "ชื่อยานพาหนะ", value: data.vehicle_name },
        { label: "วันที่นำเข้า", value: data.import_date },
        { label: "เครื่องหมายและเลขหมายหีบห่อ", value: data.package_id },
        { label: "จำนวนและลักษณะหีบห่อ", value: `${cleanValue(data.package_no)} ${cleanValue(data.package_type)}` },
        { label: "ประเทศกำเนิด", value: data.origin_country },
        { label: "รหัสประเทศนำเข้า", value: data.origin_code },
        { label: "ประเทศต้นทางที่บรรทุก", value: data.cargo_country },
        { label: "รหัสประเทศต้นทางที่บรรทุก", value: data.cargo_code },
        { label: "ท่าเรือที่นำเข้า", value: data.import_at },
        { label: "รหัสท่าเรือที่นำเข้า", value: data.import_code },
        { label: "สถานที่ตรวจปล่อย", value: data.check_at },
        { label: "รหัสสถานที่ตรวจปล่อย", value: data.check_code },
        { label: "จำนวนหีบห่อ", value: `${cleanValue(data.sum_package)} ${cleanValue(data.unit_package)}` },
        { label: "ตัวอักษร", value: data.sum_package_word },
        { label: "อัตราแลกเปลี่ยน", value: data.change_rate },
    ];

    return (
        <div className="d-flex flex-column gap-2">
            {fields.map(({ label, value }) => (
                <div className="mb-1" key={label}>
                    <div className="fw-bold">{label}</div>
                    <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
                        {cleanValue(value)}
                    </div>
                </div>
            ))}

            {data.detail_table.length > 0 && (
                <>
                    <hr className="border-top border-2 border-secondary m-0" />
                    {(data.detail_table?.[0]?.rows?.slice(1) ?? []).map((row, rowIndex, arr) => {
                        const isLastRow = rowIndex === arr.length - 1;
                        return (
                            <div key={`tax-row-${rowIndex}`}>
                                {["column_1", "column_2", "column_3"].map((colKey, _colIdx) => (
                                    <div key={colKey}>
                                        <div className="fw-bold">
                                            {colKey === "column_1" && isLastRow
                                                ? "รวมทั้งสิ้น"
                                                : cleanValue(data.detail_table[0].rows[0][colKey])}
                                        </div>
                                        <div className="border rounded-2 shadow-sm bg-white p-2 mb-2" style={{ fontSize: "14px" }}>
                                            {cleanValue(row[colKey])}
                                        </div>
                                    </div>
                                ))}
                                <hr className="border-top border-2 border-secondary m-0 mt-3" />
                            </div>
                        );
                    })}
                </>
            )}

            {footerFields.map(({ label, value }) => (
                <div key={label}>
                    <div className="fw-bold">{label}</div>
                    <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
                        {cleanValue(value)}
                    </div>
                </div>
            ))}

            {data.detail_table.length > 2 && (
                <>
                    <hr className="border-top border-2 border-secondary m-0 mt-2" />
                    {(() => {
                        const rows2 = data.detail_table?.[2]?.rows ?? [];
                        const row1 = rows2[1] || {};
                        const row2 = rows2[2] || {};

                        const labels = [
                            { label: "ลำดับ", value: cleanValue(data.detail_table[2]?.rows[0]?.column_1) },
                            { label: "ประเภทพิกัด", value: cleanValue(data.detail_table[2]?.rows[0]?.column_2) },
                            { label: "ราคาของ", value: `${cleanValue(row1.column_3)} ${cleanValue(row2.column_3)}` },
                            { label: "อัตราอากรขาเข้า", value: `${cleanValue(row1.column_4)} ${cleanValue(row2.column_4)}` },
                            { label: "ค่าธรรมเนียม", value: `${cleanValue(row1.column_5)} ${cleanValue(row2.column_5)}` },
                            { label: "รหัสสินค้าสรรพสามิต", value: `${cleanValue(row1.column_6)} ${cleanValue(row2.column_6)}` },
                            { label: "ภาษีสรรพสามิต", value: `${cleanValue(row1.column_7)} ${cleanValue(row2.column_7)}` },
                            { label: "ฐานภาษีมูลค่าเพิ่ม", value: `${cleanValue(row1.column_8)} ${cleanValue(row2.column_8)}` },
                        ];

                        return (
                            <div>
                                {labels.map(({ label, value }) => (
                                    value ? (
                                        <div key={label}>
                                            <div className="fw-bold">{label}</div>
                                            <div className="border rounded-2 shadow-sm bg-white p-2 mb-2">{value}</div>
                                        </div>
                                    ) : null
                                ))}
                                <hr className="mt-3 mb-1" />
                            </div>
                        );
                    })()}

                    {(() => {
                        const row4 = data.detail_table[2].rows[4] || {};
                        const row5 = data.detail_table[2].rows[5] || {};

                        const labels = [
                            { label: "รหัสหน่วยสถิติ", value: `${cleanValue(row4.column_2)} ${cleanValue(row5.column_2)}` },
                            { label: "ราคาของ (บาท)", value: `${cleanValue(row4.column_3)} ${cleanValue(row5.column_3)}` },
                            { label: "อากรขาเข้าที่ชำระ", value: `${cleanValue(row4.column_4)} ${cleanValue(row5.column_4)}` },
                            { label: "ภาษีอื่นๆ", value: `${cleanValue(row4.column_5)} ${cleanValue(row5.column_5)}` },
                            { label: "อัตราภาษีสรรพสามิต", value: `${cleanValue(row4.column_6)} ${cleanValue(row5.column_6)}` },
                            { label: "ภาษีเพื่อมหาดไทย", value: `${cleanValue(row4.column_7)} ${cleanValue(row5.column_7)}` },
                            { label: "ภาษีมูลค่าเพิ่ม", value: `${cleanValue(row4.column_8)} ${cleanValue(row5.column_8)}` },
                        ];

                        return (
                            <div className="m-0">
                                {labels.map(({ label, value }) => (
                                    value ? (
                                        <div key={label}>
                                            <div className="fw-bold">{label}</div>
                                            <div className="border rounded-2 shadow-sm bg-white p-2 mb-2">{value}</div>
                                        </div>
                                    ) : null
                                ))}
                            </div>
                        );
                    })()}
                </>
            )}
            {/* ---------- detail_table[3] ---------- */}
            {data.detail_table.length > 3 && (() => {
                const row = data.detail_table[3].rows[1] || {};
                const labels = [
                    { label: "รหัสสิทธิพิเศษ", value: cleanValue(row.column_1) },
                    { label: "น้ำหนักสุทธิ", value: cleanValue(row.column_2) },
                    { label: "ปริมาณ", value: cleanValue(row.column_3) },
                ];
                return (
                    <>
                        <hr className="border-top border-2 border-secondary m-0" />
                        {labels.map(({ label, value }) =>
                            value ? (
                                <div key={label}>
                                    <div className="fw-bold">{label}</div>
                                    <div className="border rounded-2 shadow-sm bg-white p-2 mb-2">{value}</div>
                                </div>
                            ) : null
                        )}
                    </>
                );
            })()}

            {/* ---------- detail_table[4] ---------- */}
            {data.detail_table.length > 4 && (() => {
                const row0 = data.detail_table[4].rows[0] || {};
                const row1 = data.detail_table[4].rows[1] || {};
                const labels = [
                    { label: "ใบอนุญาตนำเข้าหรือหนังสือรับรอง", value: cleanValue(row0.column_2) },
                    { label: "ชนิดของ", value: cleanValue(row0.column_4) },
                    { label: "หมายเหตุ", value: cleanValue(row1.column_4) },
                ];
                return (
                    <>
                        <hr className="border-top border-2 border-secondary m-0 mt-2" />
                        {labels.map(({ label, value }) =>
                            value ? (
                                <div key={label}>
                                    <div className="fw-bold">{label}</div>
                                    <div className="border rounded-2 shadow-sm bg-white p-2 mb-2">{value}</div>
                                </div>
                            ) : null
                        )}
                    </>
                );
            })()}
        </div>
    );
};

export default ChecklistImportEntry0409;
