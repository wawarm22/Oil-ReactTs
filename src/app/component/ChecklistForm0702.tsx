import React from "react";
import { OcrDailyProductionDocument } from "../../types/ocrFileType";
import { Oil0702ValidationResult } from "../../types/validateResTypes";
import { Oil0702ReportRow, PreparedOil0702 } from "../../types/validateTypes";

interface Props {
    data: OcrDailyProductionDocument;
    validateResult: Oil0702ValidationResult | null
    context: PreparedOil0702 | null;
}

const fixedLabels: { key: keyof Oil0702ReportRow | string; label: string }[] = [
    { key: "date", label: "วันเดือนปี" },
    { key: "transaction_type", label: "รายการ" },
    { key: "evidence_number", label: "หลักฐานเลขที่" },
    { key: "received_produced", label: "ผลิตได้" },
    { key: "received_returned", label: "รับคืนจากคลังสินค้าทัณฑ์บน" },
    { key: "received_others", label: "อื่นๆ" },
    { key: "total_received", label: "รวมรับสินค้า" },
    { key: "__section_paid", label: "จำนวนจ่าย" }, 
    { key: "sold_domestic", label: "จำหน่ายในประเทศ" },
    { key: "sold_export", label: "จำหน่ายต่างประเทศ" },
    { key: "used_factory", label: "ใช้ในโรงงานอุตสาหกรรม" },
    { key: "warehouse_bonded", label: "คลังสินค้าทัณฑ์บน" },
    { key: "damaged", label: "เสียหาย" },
    { key: "others_dispatched", label: "อื่นๆ" },
    { key: "total_dispatched", label: "รวมจ่ายสินค้า" },
    { key: "remaining_balance", label: "ยอดคงเหลือ" },
    { key: "remarks", label: "หมายเหตุ" },
];

const headFields = [
    { label: "แบบฟอร์ม", value: "ภส.๐๗-๐๒", field: "form_type" },
    { label: "ประเภทสินค้า", value: "", field: "product_category" },
    { label: "ชนิด", value: "", field: "product_type" },
    { label: "ตราหรือเครื่องหมาย/เเบบ/รุ่น/ดีกรี/ความหวาน", value: "", field: "product_brand" },
    { label: "ขนาด", value: "", field: "product_size" },
    { label: "หน่วย", value: "", field: "product_unit" },
];

const ChecklistForm0702: React.FC<Props> = ({ context }) => {
    const ocrData = context?.fields;
    if (!ocrData) {
        return <div>ไม่พบข้อมูล</div>;
    }

    headFields.forEach(f => {
        if (f.field && f.field in ocrData) {
            f.value = (ocrData as any)[f.field];
        }
    });

    return (
        <div className="d-flex flex-column">
            {headFields.map((f, idx) => (
                <div key={idx}>
                    <div className="fw-bold">{f.label}</div>
                    <div
                        className="rounded-2 shadow-sm bg-white p-2 mb-1"
                        style={{
                            fontSize: "14px",
                            minHeight: "40px",
                            borderWidth: "2px",
                            borderStyle: "solid",
                            borderColor: "#22C659",
                        }}
                    >
                        {f.value || ""}
                    </div>
                </div>
            ))}

            {ocrData.reports && ocrData.reports.length > 0 && (
                <div className="mt-3">
                    {ocrData.reports.map((row, rowIdx) =>
                        fixedLabels.map(({ key, label }) => {
                            if (typeof key === "string" && key.startsWith("__")) {
                                return (
                                    <div key={label + rowIdx} className="mb-1">
                                        <div className="fw-bold">{label}</div>
                                    </div>
                                );
                            }
                            return (
                                <div key={label + rowIdx} className="mb-2">
                                    <div className="fw-bold">{label}</div>
                                    <div
                                        className="rounded-2 shadow-sm bg-white p-2"
                                        style={{
                                            fontSize: "14px",
                                            borderWidth: "2px",
                                            borderStyle: "solid",
                                            minHeight: "40px",
                                            borderColor: "#22C659",
                                        }}
                                    >
                                        {typeof row[key as keyof typeof row] === "number"
                                            ? row[key as keyof typeof row]?.toLocaleString()
                                            : row[key as keyof typeof row] || ""}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default ChecklistForm0702;
