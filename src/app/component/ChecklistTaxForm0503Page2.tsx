import React from "react";
import { OcrTaxForm0503Page2Document } from "../../types/ocrFileType";

interface Props {
    data: OcrTaxForm0503Page2Document;
}

const ChecklistTaxForm0503Page2: React.FC<Props> = ({ data }) => {

    const cleanValue = (val?: string | null): string => {
        if (!val || val.trim() === "" || val === ":unselected:") return "-";
        return val.trim();
    };

    const fields = [
        { label: "เลขที่/เลขที่อ้างอิงการยื่นเเบบ", value: cleanValue(data.reference_no) },
        { label: "ขอคืนเงินภาษิสรรพสามิต กรณีได้รับสิทธิลดหย่อนเกินกว่าจำนวนภาษีที่จะต้องเสีย", value: cleanValue(data.refund_tax_1) },
        { label: "เงินบำรุงกองทุนสนับสนุนการสร้างเสริมสุขภาพ", value: cleanValue(data.refund_tax_2) },
        { label: "เงินบำรุงองค์การกระจายเสียงและแพร่ภาพสาธารณะแห่งประเทศไทย", value: cleanValue(data.refund_tax_3) },
        { label: "เงินบำรุงกองทุนพัฒนาการกีฬาแห่งชาติ", value: cleanValue(data.refund_tax_4) },
        { label: "เงินบำรุงกองทุนผู้สูงอายุ", value: cleanValue(data.refund_tax_5) },
        { label: "เงินภาษีเพิ่มขึ้นเพื่อราชการส่วนท้องถิ่น", value: cleanValue(data.refund_tax_6) },
        { label: "รวมทั้งสิ้น", value: cleanValue(data.refund_tax_sum) },
        { label: "ชื่อผู้ยื่นคำขอ", value: cleanValue(data.request_name) },
        { label: "วันที่ยื่นคำขอ", value: cleanValue(data.request_date) },
        { label: "ความเห็นเจ้าพนักงาน", value: cleanValue(data.officer_comment) },
        { label: "ชื่อ เจ้าพนักงานสรรพสามิต", value: cleanValue(data.officer_name) },
        { label: "วันที่ลงความเห็น", value: cleanValue(data.officer_date) },
        // { label: "อนุมัติ /ไม่อนุมัติ", value: cleanValue(data.phone_number) },
        { label: "รายละเอียด", value: cleanValue(data.approve_2) },
        { label: "ชื่อ เจ้าพนักงานสรรพสามิต", value: cleanValue(data.validate_name) },
        { label: "วันที่อนุมัติ", value: cleanValue(data.validate_date) },
    ];

    return (
        <div className="d-flex flex-column gap-2">
            {/* Header */}
            {fields.map(({ label, value }) =>
                value ? (
                    <div key={label}>
                        <div className="fw-bold">{label}</div>
                        <div className="border rounded-2 shadow-sm bg-white p-2 mb-2" style={{ fontSize: "14px" }}>
                            {value}
                        </div>
                    </div>
                ) : null
            )}
        </div>
    );
};

export default ChecklistTaxForm0503Page2;
