import React, { useEffect, useState } from "react";
import { OcrTaxReceiptExciseDocument } from "../../types/ocrFileType";
import { getPreparedReceiptExcise, validateReceiptExcise } from "../../utils/api/validateApi";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { AuthSchema } from "../../types/schema/auth";
import { OcrReceiptExciseData } from "../../types/validateTypes";
import { ValidateReceiptExciseResult } from "../../types/validateResTypes";

interface Props {
    data: OcrTaxReceiptExciseDocument;
}

const ChecklistTaxReceiptExcise: React.FC<Props> = ({ data }) => {
    const auth = useAuthUser<AuthSchema>();
    const [ocrData, setOcrData] = useState<OcrReceiptExciseData | null>(null);
    const [validateData, setValidateData] = useState<ValidateReceiptExciseResult | null>(null);
    const [loading, setLoading] = useState(true);

    const cleanValue = (val?: any): string => {
        const v = typeof val === "object" && val !== null ? val.value : val;
        if (!v || typeof v !== "string" || v.trim() === "" || v === ":unselected:") return "";
        return v.trim();
    };

    useEffect(() => {
        if (!auth || !auth.accessToken || !data.id) return;
        setLoading(true);
        getPreparedReceiptExcise(data.id, auth)
            .then(res => {
                setOcrData(res.data);
            })
            .catch(() => {
                setOcrData(null);
            })
            .finally(() => setLoading(false));
    }, [data.id, auth]);

    useEffect(() => {
        if (!ocrData) return;
        validateReceiptExcise(ocrData)
            .then(res => {
                if (res?.data) {
                    setValidateData(res.data);
                }
            });
    }, [ocrData]);

    if (loading) {
        return <div>กำลังโหลดข้อมูล...</div>;
    }

    const fieldDefs = [
        { label: "เลขที่ใบเสร็จ", key: "receipt_no" },
        { label: "เลขที่คุมเอกสาร", key: "doc_no" },
        { label: "วันที่ เดือน ปี", key: "submit_date" },
        { label: "เวลา", key: "submit_time" },
        { label: "ที่ทำการ", key: "office" },
        { label: "เดือน/ปี", key: "period" },
        { label: "ได้รับเงิน", key: "received_from" },
        { label: "ผู้ประกอบการ", key: "operator" },
        { label: "เลขประจำตัวผู้เสียภาษี", key: "tax_id" },
        { label: "เลขทะเบียนสรรพสามิต", key: "excise_id" },
    ];

    const getFieldColor = (key: string) => {
        const value = validateData?.[key as keyof ValidateReceiptExciseResult];
        if (Array.isArray(value)) {
            return "#22C659";
        }
        if (value && typeof value === "object" && "passed" in value) {
            if (value.passed === true) return "#22C659";
            if (value.passed === false) return "#FF0100";
        }
        return "#22C659";
    };

    return (
        <div className="d-flex flex-column gap-2">
            {fieldDefs.map(({ label, key }, idx) => {
                const value = ocrData?.fields[key as keyof OcrReceiptExciseData["fields"]];
                const validateField = validateData?.[key as keyof ValidateReceiptExciseResult];
                const borderColor = getFieldColor(key);

                let showValue: any = value;
                if (validateField && !Array.isArray(validateField) && typeof validateField === "object" && "value" in validateField) {
                    showValue = validateField.value;
                }

                return (
                    <div key={idx} className="mb-1">
                        <div className="fw-bold">{label}</div>
                        <div
                            className="rounded-2 shadow-sm bg-white p-2"
                            style={{
                                fontSize: "14px",
                                border: `1.5px solid ${borderColor}`
                            }}
                        >
                            {cleanValue(showValue)}
                        </div>
                    </div>
                );
            })}

            {Array.isArray(ocrData?.fields.items) && ocrData.fields.items.length > 0 && (
                <>
                    <hr className="border-top border-2 border-secondary mt-2 mb-2" />
                    {ocrData.fields.items.map((item, i) => (
                        <div key={`item-${i}`} className="mb-2">
                            <div className="fw-bold">รายละเอียด</div>
                            <span className="fw-bold">รายการ</span>
                            <div className="rounded-2 shadow-sm bg-white p-2 mb-1" style={{
                                fontSize: "14px",
                                border: `1.5px solid ${Array.isArray(validateData?.items) && validateData.items[i]?.description?.passed === false
                                    ? "#FF0100"
                                    : "#22C659"
                                    }`
                            }}>
                                {cleanValue(
                                    Array.isArray(validateData?.items)
                                        ? validateData.items[i]?.description?.value
                                        : item.description
                                )}
                            </div>
                            <div className="fw-bold">จำนวนเงิน</div>
                            <div className="rounded-2 shadow-sm bg-white p-2" style={{
                                fontSize: "14px",
                                border: `1.5px solid ${Array.isArray(validateData?.items) && validateData.items[i]?.amount?.passed === false
                                    ? "#FF0100"
                                    : "#22C659"
                                    }`
                            }}>
                                {Array.isArray(validateData?.items)
                                    ? validateData.items[i]?.amount?.value
                                    : item.amount}
                            </div>
                        </div>
                    ))}
                    <div className="mb-2">
                        <div className="fw-bold">รวม</div>
                        <div className="rounded-2 shadow-sm bg-white p-2" style={{
                            fontSize: "14px",
                            border: `1.5px solid ${validateData?.total_amount && !Array.isArray(validateData.total_amount) && validateData.total_amount.passed === false
                                ? "#FF0100"
                                : "#22C659"
                                }`
                        }}>
                            {validateData?.total_amount && !Array.isArray(validateData.total_amount)
                                ? validateData.total_amount.value
                                : ocrData.fields.total_amount}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};


export default ChecklistTaxReceiptExcise;
