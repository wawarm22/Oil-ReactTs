import React from "react";
import { OcrTaxForm0503Page2Document } from "../../types/ocrFileType";
import { Validate0503Page2Payload } from "../../types/validateTypes";

interface Props {
    data: OcrTaxForm0503Page2Document;
    validateResult: any;
    context: Validate0503Page2Payload | null;
}

const ChecklistTaxForm0503Page2: React.FC<Props> = ({ data, validateResult, context }) => {
    const ocrData = context;

    if (!ocrData) {
        return <div>ไม่พบข้อมูล</div>;
    }

    const cleanValue = (val?: string | null): string => {
        if (!val || val.trim() === "" || val === ":unselected:") return "-";
        return val.trim();
    };

    const getBorderColor = (fieldKey: string): string => {
        if (!validateResult || !validateResult[fieldKey]) return "1px solid #22C659";
        return validateResult[fieldKey].passed ? "1px solid #22C659" : "1px solid #FF0100";
    };

    const fields = [
        { key: "ref_no", label: "เลขที่/เลขที่อ้างอิงการยื่นเเบบ", value: cleanValue(ocrData?.fields.ref_no) },
        { key: "excise_tax", label: "ขอคืนเงินภาษิสรรพสามิต กรณีได้รับสิทธิลดหย่อนเกินกว่าจำนวนภาษีที่จะต้องเสีย", value: cleanValue(ocrData?.fields.excise_tax.toString()) },
        { key: "health_fund", label: "เงินบำรุงกองทุนสนับสนุนการสร้างเสริมสุขภาพ", value: cleanValue(ocrData?.fields.health_fund.toString()) },
        { key: "radio_fund", label: "เงินบำรุงองค์การกระจายเสียงและแพร่ภาพสาธารณะแห่งประเทศไทย", value: cleanValue(ocrData?.fields.radio_fund.toString()) },
        { key: "sport_fund", label: "เงินบำรุงกองทุนพัฒนาการกีฬาแห่งชาติ", value: cleanValue(ocrData?.fields.sport_fund.toString()) },
        { key: "elder_fund", label: "เงินบำรุงกองทุนผู้สูงอายุ", value: cleanValue(ocrData?.fields.elder_fund.toString()) },
        { key: "interior_tax", label: "เงินภาษีเพิ่มขึ้นเพื่อราชการส่วนท้องถิ่น", value: cleanValue(ocrData?.fields.interior_tax.toString()) },
        { key: "total_tax", label: "รวมทั้งสิ้น", value: cleanValue(ocrData?.fields.total_tax.toString()) },
        { key: "request_name", label: "ชื่อผู้ยื่นคำขอ", value: cleanValue(data.request_name) },
        { key: "request_date", label: "วันที่ยื่นคำขอ", value: cleanValue(data.request_date) },
        // { key: "officer_comment", label: "ความเห็นเจ้าพนักงาน", value: cleanValue(data.officer_comment) },
        // { key: "officer_name", label: "ชื่อ เจ้าพนักงานสรรพสามิต", value: cleanValue(data.officer_name) },
        // { key: "officer_date", label: "วันที่ลงความเห็น", value: cleanValue(data.officer_date) },
        // { label: "อนุมัติ /ไม่อนุมัติ", value: cleanValue(data.phone_number) },
        // { key: "approve_2", label: "รายละเอียด", value: cleanValue(data.approve_2) },
        // { key: "validate_name", label: "ชื่อ เจ้าพนักงานสรรพสามิต", value: cleanValue(data.validate_name) },
        // { key: "validate_name", label: "วันที่อนุมัติ", value: cleanValue(data.validate_name) },
    ];

    const formatNumber = (val: any) => {
        if (typeof val === "number" && !isNaN(val)) return val.toLocaleString();
        if (typeof val === "string" && val.trim() !== "" && !isNaN(Number(val))) {
            return Number(val).toLocaleString();
        }
        return val;
    };

    return (
        <div className="d-flex flex-column gap-2">
            {fields.map(({ key, label, value }) =>
                value ? (
                    <div key={label}>
                        <div className="fw-bold">{label}</div>
                        <div
                            className="rounded-2 shadow-sm bg-white p-2 mb-2"
                            style={{ fontSize: "14px", border: getBorderColor(key) }}
                        >
                            {formatNumber(value)}
                        </div>
                    </div>
                ) : null
            )}
        </div>
    );
};

export default ChecklistTaxForm0503Page2;
