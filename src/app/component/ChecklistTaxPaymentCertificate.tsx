import React from "react";
import { OcrTaxPaymentCertificateDocument } from "../../types/ocrFileType";

interface Props {
    data: OcrTaxPaymentCertificateDocument;
}

const ChecklistTaxPaymentCertificate: React.FC<Props> = ({ data }) => {

    const cleanValue = (val?: any): string => {
        const v = typeof val === "object" && val !== null ? val.value : val;
        if (!v || typeof v !== "string" || v.trim() === "" || v === ":unselected:") return "-";
        return v.trim();
    };

    const fields = [
        { label: "ทะเบียนเลขที่", value: data.registration_no },
        { label: "ที่ตั้งตามทะเบียน", value: "" },
        { label: "ที่ตั้งบริษัท", value: data.address },
        { label: "เลขประจำตัวผู้เสียภาษีอากร", value: data.tax_id },
        { label: "ทะเบียนสรรพสามิตเลขที่", value: data.excise_id },
        { label: "ใบกำกับภาษีเลขที่", value: data.invoice_no },
        { label: "วันที่น้ำมันออกจากโรงกลั่นฯ", value: data.due_date },
        { label: "สาขาที่ออกใบกำกับภาษีคือ สาขาที่", value: data.branch_no },
        { label: "ชื่อโรงกลั่น", value: "" }
    ];

    return (
        <div className="d-flex flex-column gap-2">
            <p className="fw-bold m-0" style={{ fontSize: '16px' }}>ใบรับรองการชำระภาษีสรรพสามิต</p>
            {fields.map(({ label, value }, idx) => (
                <div key={idx} className="mb-1">
                    <div className="fw-bold">{label}</div>
                    <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
                        {cleanValue(value)}
                    </div>
                </div>
            ))}

            {data.detail_table.length > 0 && (
                <>
                    <hr className="border-top border-2 border-secondary mt-3" />
                    {(() => {
                        const props = data.detail_table[0]?.properties || {};
                        const detailFields = [
                            { label: "ชื่อผลิตภัณฑ์น้ำมัน", value: cleanValue(props.name) },
                            { label: "อัตราภาษี มูลค่า", value: cleanValue(props.value_tax) },
                            { label: "อัตราภาษี ปริมาณ", value: cleanValue(props.volume_tax) },
                            { label: "อัตราภาษี ลิตรละ(ลิตร)", value: cleanValue(props.liter_tax) },
                            { label: "Tanker", value: cleanValue(props.tanker) },
                            { label: "Trip No.", value: cleanValue(props.trip_no) },
                            { label: "ปลายทาง", value: cleanValue(props.destination) },
                        ];

                        return detailFields.map(({ label, value }, idx) => (
                            <div key={`detail-${idx}`} className="mb-1">
                                <div className="fw-bold">{label}</div>
                                <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
                                    {value}
                                </div>
                            </div>
                        ));
                    })()}
                </>
            )}
        </div>
    );
};

export default ChecklistTaxPaymentCertificate;
