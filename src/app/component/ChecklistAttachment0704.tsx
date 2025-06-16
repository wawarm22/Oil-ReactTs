import React, { useEffect, useState } from "react";
import { OcrAttachment0704Document } from "../../types/ocrFileType";
import { getPrepared0704, validateOil0704 } from "../../utils/api/validateApi";
import { AuthSchema } from "../../types/schema/auth";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { Prepared0704 } from "../../types/preparedTypes";
import { ValidateOil0704Result } from "../../types/validateResTypes";
import { borderColor } from "../../utils/function/getBorderColor";

interface Props {
    data: OcrAttachment0704Document;
}

const formatNumber = (val: any) => {
    if (typeof val === "number" && !isNaN(val)) {
        return val.toLocaleString("en-US");
    }
    if (typeof val === "string") {
        const num = Number(val.replace(/,/g, ""));
        if (!isNaN(num) && val.trim() !== "") {
            return num.toLocaleString("en-US");
        }
    }
    return val;
};

const ChecklistAttachment0704: React.FC<Props> = ({ data }) => {
    const auth = useAuthUser<AuthSchema>();
    const [ocrData, setOcrData] = useState<Prepared0704 | null>(null);
    const [loading, setLoading] = useState(true);
    const [validateResult, setValidateResult] = useState<ValidateOil0704Result | null>(null);

    useEffect(() => {
        if (!auth || !data.id) return;
        setLoading(true);
        getPrepared0704(data.id, auth)
            .then(res => setOcrData(res.data))
            .catch(() => setOcrData(null))
            .finally(() => setLoading(false));
    }, [data.id, auth]);

    useEffect(() => {
        if (!ocrData) return;
        validateOil0704(ocrData)
            .then(res => setValidateResult(res.data))
            .catch(() => setValidateResult(null));
    }, [ocrData]);

    const renderBox = (label: string, value: any, passed?: boolean, key?: React.Key) => {
        let displayValue = value === undefined || value === null || value === "" ? "" : value;
        if (
            (typeof displayValue === "number" && isFinite(displayValue)) ||
            (typeof displayValue === "string" && /^\d{1,3}(,\d{3})*(\.\d+)?$|^\d+(\.\d+)?$/.test(displayValue.replace(/,/g, "")))
        ) {
            displayValue = formatNumber(displayValue);
        }
        return (
            <div key={key || label}>
                <div className="fw-bold">{label}</div>
                <div
                    className="rounded-2 shadow-sm bg-white p-2"
                    style={{
                        fontSize: "14px",
                        whiteSpace: "pre-line",
                        minHeight: "43px",
                        border: borderColor(passed),
                    }}
                >
                    {displayValue}
                </div>
            </div>
        );
    };

    if (loading) return <div>กำลังรอข้อมูล...</div>;
    if (!ocrData) return <div className="text-muted">ไม่พบข้อมูล</div>;

    const { fields } = ocrData;

    const infoFields = [
        { label: "แบบฟอร์ม", key: "formType" },
        { label: "เลขที่รับ", key: "requestNumber" },
        { label: "วัน เดือน ปี ที่รับ", key: "receivedAt" },
        { label: "เจ้าหน้าที่ผู้รับ", key: "formOfficerName" },
        { label: "ชื่อโรงอุตสาหกรรม (คลัง)", key: "companyName" },
        { label: "ทะเบียนสรรพสามิตเลขที่", key: "exciseId" },
        { label: "ประจำเดือน ปี", key: "period" },
    ];

    const materialFields = [
        { label: "รายการ/วัตถุดิบ (หน่วย)", key: "materialName" },
        { label: "คงเหลือยกมา", key: "open" },
        { label: "รับเดือนนี้", key: "getted" },
        { label: "รวม", key: "total" },
        { label: "ผลิตสินค้าตามพิกัด ฯ", key: "produce" },
        { label: "ผลิตสินค้าอื่น", key: "produceOther" },
        { label: "เสียหาย", key: "defected" },
        { label: "อื่น ๆ (จ่ายโอนคลัง)", key: "etc" },
        { label: "ยอดคงเหลือตามบัญชี", key: "lossGain" },
        { label: "คงเหลือยกไป", key: "forward" },
    ];

    const productFields = [
        { label: "ชื่อสินค้า", key: "productName" },
        { label: "คงเหลือยกมา", key: "open" },
        { label: "รับจากการผลิต", key: "produced" },
        { label: "รับคืนจากคลังสินค้าทัณฑ์บน", key: "bondedReturn" },
        { label: "อื่น ๆ (รับ)", key: "etcGetted" },
        { label: "รวม", key: "total" },
        { label: "จำหน่ายในประเทศ", key: "domesticSales" },
        { label: "จำหน่ายต่างประเทศ", key: "overseasSales" },
        { label: "ใช้ในโรงอุตสาหกรรม", key: "usedInIndustrialPlants" },
        { label: "คลังสินค้าทัณฑ์บน", key: "bonded" },
        { label: "เสียหาย", key: "defected" },
        { label: "อื่น ๆ (ใช้)", key: "etcUsed" },
        { label: "คงเหลือยกไป", key: "forward" },
    ];

    // ฟังก์ชันดึง value จาก FieldValidation หรือปกติ
    const getFieldValue = (val: any) => {
        if (val && typeof val === "object" && "value" in val) return val.value;
        return val;
    };
    // ฟังก์ชันดึง passed จาก FieldValidation
    const getPassed = (val: any) => {
        if (val && typeof val === "object" && "passed" in val) return val.passed;
        return undefined;
    };

    return (
        <div className="d-flex flex-column gap-3">
            {/* ข้อมูลหลัก */}
            {infoFields.map(({ label, key }) =>
                renderBox(
                    label,
                    getFieldValue(fields[key as keyof typeof fields]),
                    getPassed(validateResult?.[key as keyof typeof validateResult]),
                    label
                )
            )}
            <hr className="border-top border-2 border-secondary my-2" />
            <div className="fw-bold">1. ข้อมูลวัตถุดิบ</div>
            {(fields.materials || []).map((mat, i) => (
                <div key={i} className="mb-2 p-2 rounded-2">
                    {materialFields.map(({ label, key }) =>
                        renderBox(
                            label,
                            getFieldValue(mat[key as keyof typeof mat]),
                            getPassed(validateResult?.materials?.[i]?.[key as keyof typeof mat]),
                            label + i
                        )
                    )}
                </div>
            ))}
            <hr className="border-top border-2 border-secondary my-2" />
            <div className="fw-bold">2. งบการผลิต</div>
            {(fields.products || []).map((prod, i) => (
                <div key={i} className="mb-2 p-2 rounded-2">
                    {productFields.map(({ label, key }) =>
                        renderBox(
                            label,
                            getFieldValue(prod[key as keyof typeof prod]),
                            getPassed(validateResult?.products?.[i]?.[key as keyof typeof prod]),
                            label + i
                        )
                    )}
                </div>
            ))}
        </div>
    );
};

export default ChecklistAttachment0704;
