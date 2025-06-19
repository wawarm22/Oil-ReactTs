import React from "react";
import { OcrDeliveryInvoicePipline } from "../../types/ocrFileType";
import { InvoiceThappline } from "../../types/validateTypes";
import { ValidateInvoiceThapplineData } from "../../types/validateResTypes";

interface Props {
    data: OcrDeliveryInvoicePipline;
    validateResult: ValidateInvoiceThapplineData | null;
    context: InvoiceThappline | null;
}

const ChecklistDeliveryInvoicePipline: React.FC<Props> = ({ validateResult, context }) => {
    const ocrData = context;

    if (!ocrData) {
        return <div>ไม่พบข้อมูล</div>;
    }

    const cleanValue = (val?: string | null): string => {
        if (!val || val.trim() === "" || val === ":unselected:" || val === ":selected:") return "";
        return val.trim();
    };

    const borderColor = (passed?: boolean) =>
        `1.5px solid ${passed === true ? "#22C659" : passed === false ? "#FF0100" : "#CED4DA"}`;

    const fields = [
        {
            label: "เอกสาร",
            value: "THAI PETROLEUM PLPLINE CO.,LTD. PRODUCT DELIVERIED TO CUSTOMER DEPOT",
            passed: true
        },
        {
            label: "ชื่อผลิตภัณฑ์ (PRODUCT)",
            value: cleanValue(validateResult?.product_name.value),
            passed: validateResult?.product_name.passed
        },
        {
            label: "เลขที่เอกสาร (DOC NO.)",
            value: cleanValue(validateResult?.doc_no.value),
            passed: validateResult?.doc_no.passed
        },
        {
            label: "หมายเลขของผู้ประกอบอุตสาหกรรม (CUSTOMER TANK NO.)",
            value: cleanValue(validateResult?.customer_tank_no.value),
            passed: validateResult?.customer_tank_no.passed
        },
        {
            label: "หมายเลขการผลิต (BATCH NO.)",
            value: cleanValue(validateResult?.batch_no.value),
            passed: validateResult?.batch_no.passed
        },
        {
            label: "สถานที่เก็บสินค้า (DEPOT)",
            value: cleanValue(validateResult?.depot.value),
            passed: validateResult?.depot.passed
        },
        {
            label: "วันที่ (DATE)",
            value: cleanValue(validateResult?.date.value),
            passed: validateResult?.date.passed
        },
        {
            label: "เวลา (TIME)",
            value: cleanValue(validateResult?.time.value),
            passed: validateResult?.time.passed
        }
    ];

    const footer = [
        { label: "NOTE", value: cleanValue(validateResult?.note.value), passed: validateResult?.note.passed },
        { label: "BOOK ON", value: cleanValue(validateResult?.book_on.value), passed: validateResult?.book_on.passed },
    ];

    const table: any[] = Array.isArray(ocrData?.fields.details) ? ocrData.fields.details : [];
    const validateDetails = Array.isArray(validateResult?.details) ? validateResult.details : [];

    return (
        <div className="d-flex flex-column gap-2">
            {fields.map(({ label, value, passed }) => (
                <div key={label}>
                    <div className="fw-bold">{label}</div>
                    <div
                        className="rounded-2 shadow-sm bg-white p-2"
                        style={{ fontSize: "14px", minHeight: "40px", border: borderColor(passed) }}
                    >
                        {value}
                    </div>
                </div>
            ))}

            {table.length > 1 && (
                <>
                    <hr className="m-0 mt-2" />
                    {table.slice(1).map((item, idx) => {
                        const valDetail = validateDetails[idx + 1]; // +1 เพราะ slice(1)
                        return [
                            {
                                label: "รายละเอียด (DESCRIPTION)",
                                value: cleanValue(item.description),
                                passed: valDetail?.description?.passed
                            },
                            {
                                label: "(BEFORE)",
                                value: cleanValue(item.before),
                                passed: valDetail?.before?.passed
                            },
                            {
                                label: "(AFTER)",
                                value: cleanValue(item.after),
                                passed: valDetail?.after?.passed
                            }
                        ].map(({ label, value, passed }) => (
                            <div key={label + idx}>
                                <div className="fw-bold">{label}</div>
                                <div
                                    className="rounded-2 shadow-sm bg-white p-2"
                                    style={{
                                        fontSize: "14px",
                                        minHeight: "40px",
                                        border: borderColor(passed)
                                    }}
                                >
                                    {value}
                                </div>
                            </div>
                        ));
                    })}
                </>
            )}

            <hr className="m-0 mt-1" />
            {footer.map(({ label, value, passed }) => (
                <div key={label}>
                    <div className="fw-bold">{label}</div>
                    <div
                        className="rounded-2 shadow-sm bg-white p-2"
                        style={{ fontSize: "14px", minHeight: "40px", border: borderColor(passed) }}
                    >
                        {value}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ChecklistDeliveryInvoicePipline;
