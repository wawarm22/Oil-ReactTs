import React from "react";
import { OcrAttachment0704Document } from "../../types/ocrFileType";

interface Props {
    data: OcrAttachment0704Document;
}

const ChecklistAttachment0704: React.FC<Props> = ({ data }) => {
    const cleanValue = (val?: string | { value: string } | null): string => {
        const raw = typeof val === "object" ? val?.value : val;
        if (!raw || raw.trim() === "" || raw === ":unselected:") return "-";
        return raw.trim();
    };    

    const fields = [
        { label: "แบบฟอร์ม", value: data.form_type },
        { label: "เลขที่รับ", value: data.form_no },
        { label: "วัน เดือน ปี ที่รับ", value: data.form_date },
        { label: "เจ้าพนักงานผู้รับ", value: data.form_officer_1 },
        { label: "ชื่อโรงอุตสาหกรรม (คลัง)", value: data.company_name },
        { label: "ทะเบียนสรรพสามิตเลขที่", value: data.excise },
        { label: "ประจำเดือน ปี", value: data.date },
    ];

    const table1 = data.detail_table[0]?.rows ?? [];

    const tableMap = [
        { label: "รายการ/วัตถุดิบ (หน่วย)", index: 0 },
        { label: "คงเหลือยกมา", index: 1 },
        { label: "รับเดือนนี้", index: 2 },
        { label: "รวม", index: 3 },
        { label: "ผลิตสินค้าตามพิกัด ฯ", index: 4 },
        { label: "ผลิตสินค้าอื่น", index: 5 },
        { label: "เสียหาย", index: 6 },
        { label: "อื่น ๆ (จ่ายโอนคลัง)", index: 7 },
        { label: "ยอดคงเหลือตามบัญชี", index: 8 },
        { label: "คงเหลือยกไป", index: 9 },
    ];

    return (
        <div className="d-flex flex-column gap-3">
            {/* แสดง header fields */}
            {fields.map(({ label, value }) => (
                <div key={label}>
                    <div className="fw-bold">{label}</div>
                    <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
                        {cleanValue(value)}
                    </div>
                </div>
            ))}

            {/* แสดงข้อมูลที่ map จาก column_7 */}
            <hr className="border-top border-2 border-secondary my-2" />
            <div className="fw-bold">ข้อมูลวัตถุดิบ</div>
            {tableMap.map(({ label, index }) => {
                const row = table1[index];
                const value = row?.column_7 ?? "-";

                return (
                    <div key={label}>
                        <div className="fw-bold">{label}</div>
                        <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
                            {cleanValue(value)}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ChecklistAttachment0704;
