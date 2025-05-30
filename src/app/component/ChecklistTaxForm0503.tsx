import React, { useEffect, useState } from "react";
import { OcrTaxForm0503Document } from "../../types/ocrFileType";
import { AuthSchema } from "../../types/schema/auth";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { getPrepared0503, validate0503Page1 } from "../../utils/api/validateApi";
import { Validate0503Page1Payload } from "../../types/validateTypes";

interface Props {
    data: OcrTaxForm0503Document;
}

const ChecklistTaxForm0503: React.FC<Props> = ({ data }) => {
    const auth = useAuthUser<AuthSchema>();
    const [ocrData, setOcrData] = useState<Validate0503Page1Payload | null>(null);
    const [validateData, setValidateData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const cleanValue = (val?: string | null): string => {
        if (!val || val.toString().trim() === "" || val === ":unselected:") return "";
        let str = val.toString().trim();
        str = str.replace(/[_\.]/g, "");
        return str;
    };

    useEffect(() => {
        if (!auth || !auth.accessToken || !data.id) return;

        setLoading(true);
        getPrepared0503(data.id, auth)
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

        validate0503Page1(ocrData)
            .then(res => {
                if (res?.data) {
                    setValidateData(res.data);
                }
            });
    }, [ocrData]);

    if (loading) {
        return <div>กำลังโหลดข้อมูล...</div>;
    }

    const getBorderColor = (fieldKey: string): string => {
        if (!validateData || !validateData[fieldKey]) return "1px solid #22C659";
        return validateData[fieldKey].passed ? "1px solid #22C659" : "1px solid #FF0100";
    };

    const fields = [
        { key: "company_name", label: "ชื่อผู้ประกอบอุตสาหกรรม", value: cleanValue(ocrData?.fields.company_name) },
        { key: "factory_name", label: "ชื่อโรงอุตสาหกรรม", value: cleanValue(ocrData?.fields.factory_name) },
        { key: "excise_no", label: "ทะเบียนสรรพสามิตเลขที่", value: cleanValue(ocrData?.fields.excise_no) },
        { key: "address_no", label: "สถานที่ตั้งเลขที่", value: cleanValue(ocrData?.fields.address_no) },
        { key: "soi", label: "ตรอก/ซอย", value: cleanValue(ocrData?.fields.soi) },
        { key: "street", label: "ถนน", value: cleanValue(ocrData?.fields.street) },
        { key: "sub_district", label: "ตำบล/แขวง", value: cleanValue(ocrData?.fields.sub_district) },
        { key: "district", label: "อำเภอ/เขต", value: cleanValue(ocrData?.fields.district) },
        { key: "province", label: "จังหวัด", value: cleanValue(ocrData?.fields.province) },
        { key: "zipcode", label: "รหัสไปรษณีย์", value: cleanValue(ocrData?.fields.zipcode) },
        { key: "tel_no", label: "โทรศัพท์", value: cleanValue(ocrData?.fields.tel_no) },
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
                            className={`rounded-2 shadow-sm bg-white p-2 mb-2`}
                            style={{ fontSize: "14px", border: getBorderColor(key) }}
                        >
                            {value}
                        </div>
                    </div>
                ) : null
            )}

            {ocrData?.fields?.products && validateData?.products && (
                <>
                    {ocrData.fields.products.map((product, index) => {
                        // const validationProduct = validateData.products[index];

                        const productFields = [
                            { label: "ลำดับที่", value: product.index.toString() },
                            { key: "product_name", label: "รายการวัตถุดิบ", value: product.product_name },
                            { key: "quantity", label: "ปริมาณที่ใช้ผลิต", value: product.quantity.toString() },
                            { key: "tax_by_value_baht", label: "อัตราภาษีตามมูลค่า (บาท)", value: product.tax_by_value_baht.toString() },
                            { key: "tax_by_value_satang", label: "อัตราภาษีตามมูลค่า (สต.)", value: product.tax_by_value_satang.toString() },
                            { key: "tax_by_volumn_baht", label: "อัตราภาษีตามปริมาณ (บาท)", value: product.tax_by_volumn_baht.toString() },
                            { key: "tax_by_volumn_satang", label: "อัตราภาษีตามปริมาณ (สต.)", value: product.tax_by_volumn_satang.toString() },
                            { key: "discount_baht", label: "จำนวนเงินลดหย่อน (บาท)", value: product.discount_baht.toString() },
                            { key: "discount_satang", label: "จำนวนเงินลดหย่อน (สต.)", value: product.discount_satang.toString() },
                        ];

                        const getProductBorderColor = (key: string): string => {
                            if (!validateData?.products) return "1px solid #22C659";
                            const product = validateData.products.find((p: any) => p[key]);
                            if (!product || !product[key]) return "1px solid #22C659";
                            return product[key].passed ? "1px solid #22C659" : "1px solid #FF0100";
                        };

                        return (
                            <div key={`product-${index}`}>
                                <hr className="border-top border-2 border-secondary mt-2 mb-1" />
                                {productFields.map(({ key, label, value }) => (
                                    <div key={label}>
                                        <div className="fw-bold">{label}</div>
                                        <div
                                            className={`rounded-2 shadow-sm bg-white p-2 mb-2`}
                                            style={{ fontSize: "14px", border: key ? getProductBorderColor(key) : "1px solid #22C659" }}
                                        >
                                            {formatNumber(value)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </>
            )}
        </div>
    );
};

export default ChecklistTaxForm0503;
