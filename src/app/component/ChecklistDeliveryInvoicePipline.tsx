import React, { useEffect, useState } from "react";
import { OcrDeliveryInvoicePipline } from "../../types/ocrFileType";
import { AuthSchema } from "../../types/schema/auth";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { getPreparedInvoiceThappline, validateInvoiceThappline } from "../../utils/api/validateApi";
import { InvoiceThappline } from "../../types/validateTypes";
import { ValidateInvoiceThapplineData } from "../../types/validateResTypes";

interface Props {
    data: OcrDeliveryInvoicePipline;
}

const ChecklistDeliveryInvoicePipline: React.FC<Props> = ({ data }) => {
    const auth = useAuthUser<AuthSchema>();
    const [ocrData, setOcrData] = useState<InvoiceThappline | null>(null);
    const [validateData, setValidateData] = useState<ValidateInvoiceThapplineData | null>(null);
    const [loading, setLoading] = useState(true);

    const cleanValue = (val?: string | null): string => {
        if (!val || val.trim() === "" || val === ":unselected:" || val === ":selected:") return "";
        return val.trim();
    };

    const borderColor = (passed?: boolean) =>
        `1.5px solid ${passed === true ? "#22C659" : passed === false ? "#FF0100" : "#CED4DA"}`;

    useEffect(() => {
        if (!auth || !auth.accessToken || !data.id) return;
        setLoading(true);
        getPreparedInvoiceThappline(data.id, auth)
            .then(res => setOcrData(res.data))
            .catch(() => setOcrData(null))
            .finally(() => setLoading(false));
    }, [data.id, auth]);

    useEffect(() => {
        if (!ocrData) return;
        validateInvoiceThappline(ocrData)
            .then(res => {
                if (res?.data) setValidateData(res.data);
            });
    }, [ocrData]);

    const fields = [
        {
            label: "เอกสาร",
            value: "THAI PETROLEUM PLPLINE CO.,LTD. PRODUCT DELIVERIED TO CUSTOMER DEPOT",
            passed: true
        },
        {
            label: "ชื่อผลิตภัณฑ์ (PRODUCT)",
            value: cleanValue(validateData?.product_name.value),
            passed: validateData?.product_name.passed
        },
        {
            label: "เลขที่เอกสาร (DOC NO.)",
            value: cleanValue(validateData?.doc_no.value),
            passed: validateData?.doc_no.passed
        },
        {
            label: "หมายเลขของผู้ประกอบอุตสาหกรรม (CUSTOMER TANK NO.)",
            value: cleanValue(validateData?.customer_tank_no.value),
            passed: validateData?.customer_tank_no.passed
        },
        {
            label: "หมายเลขการผลิต (BATCH NO.)",
            value: cleanValue(validateData?.batch_no.value),
            passed: validateData?.batch_no.passed
        },
        {
            label: "สถานที่เก็บสินค้า (DEPOT)",
            value: cleanValue(validateData?.depot.value),
            passed: validateData?.depot.passed
        },
        {
            label: "วันที่ (DATE)",
            value: cleanValue(validateData?.date.value),
            passed: validateData?.date.passed
        },
        {
            label: "เวลา (TIME)",
            value: cleanValue(validateData?.time.value),
            passed: validateData?.time.passed
        }
    ];

    const footer = [
        { label: "NOTE", value: cleanValue(validateData?.note.value), passed: validateData?.note.passed },
        { label: "BOOK ON", value: cleanValue(validateData?.book_on.value), passed: validateData?.book_on.passed },
    ];

    const table: any[] = Array.isArray(ocrData?.fields.details) ? ocrData.fields.details : [];
    const validateDetails = Array.isArray(validateData?.details) ? validateData.details : [];

    if (loading) {
        return <div>กำลังโหลดข้อมูล...</div>;
    }

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
