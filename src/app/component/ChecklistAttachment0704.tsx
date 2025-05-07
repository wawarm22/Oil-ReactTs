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
    const table2 = data.detail_table[1]?.rows ?? [];

    const tableMap1 = [
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

    const tableMap2 = [
        { label: "รายการ/ประเภทสินค้า ชนิด ตราหรือเครื่องหมาย/แบบ/รุ่น/ดีกรี/ความหวาน ขนาด (หน่วย)", index: 0 },
        { label: "คงเหลือยกมา", index: 1 },
        { label: "รับจากการผลิต", index: 2 },
        { label: "รับคืนจากคลังสินค้าทัณฑ์บน", index: 3 },
        { label: "อื่น ๆ", index: 4 },
        { label: "รวม", index: 5 },
        { label: "จำหน่ายในประเทศ", index: 6 },
        { label: "จำหน่ายต่างประเทศ", index: 7 },
        { label: "ใช้ในโรงอุตสาหกรรม", index: 8 },
        { label: "คลังสินค้าทัณฑ์บน", index: 9 },
        { label: "เสียหาย", index: 10 },
        { label: "คงเหลือยกไป", index: 11 },
        { label: "อื่น ๆ", index: 12 },
    ];

    return (
        <div className="d-flex flex-column gap-3">
            {/* Header fields */}
            {fields.map(({ label, value }) => (
                <div key={label}>
                    <div className="fw-bold">{label}</div>
                    <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
                        {cleanValue(value)}
                    </div>
                </div>
            ))}

            {/* Section 1: ข้อมูลวัตถุดิบ */}
            <hr className="border-top border-2 border-secondary my-2" />
            <div className="fw-bold">๑. ข้อมูลวัตถุดิบ</div>
            {tableMap1.map(({ label, index }) => {
                const row = table1[index];
                const value = row?.column_7;
                return (
                    <div key={label}>
                        <div className="fw-bold">{label}</div>
                        <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
                            {cleanValue(value)}
                        </div>
                    </div>
                );
            })}

            {/* Section 2: งบการผลิต */}
            <hr className="border-top border-2 border-secondary my-2" />
            <div className="fw-bold">๒. งบการผลิต</div>
            {tableMap2.map(({ label, index }) => {
                const row = table2[index];
                const value = row?.column_9;
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
