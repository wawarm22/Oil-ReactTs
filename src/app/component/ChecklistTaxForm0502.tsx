import React, { useEffect, useState } from "react";
import { OcrTaxForm0502Document } from "../../types/ocrFileType";
import { AuthSchema } from "../../types/schema/auth";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { getPrepared0502, validateForm0502 } from "../../utils/api/validateApi";
import { Prepared0502 } from "../../types/preparedTypes";
import { Validate0502Result } from "../../types/validateResTypes";

interface Props {
    data: OcrTaxForm0502Document;
}

const ChecklistTaxForm0502: React.FC<Props> = ({ data }) => {
    const auth = useAuthUser<AuthSchema>();
    const [ocrData, setOcrData] = useState<Prepared0502 | null>(null);
    const [validateResult, setValidateResult] = useState<Validate0502Result["data"] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth || !auth.accessToken || !data.id) return;
        setLoading(true);
        getPrepared0502(data.id, auth)
            .then(res => setOcrData(res.data))
            .catch(() => setOcrData(null))
            .finally(() => setLoading(false));
    }, [data.id, auth]);

    useEffect(() => {
        if (!ocrData) return;
        validateForm0502(ocrData)
            .then(res => setValidateResult(res?.data ?? null))
            .catch(() => setValidateResult(null));
    }, [ocrData]);

    if (loading || !ocrData) {
        return <div>กำลังโหลดข้อมูล...</div>;
    }

    const getFieldValidation = (key: string) =>
        validateResult && !Array.isArray(validateResult[key as keyof typeof validateResult])
            ? (validateResult[key as keyof typeof validateResult] as { passed?: boolean } | null)
            : null;

    const borderColor = (passed?: boolean) =>
        `1.5px solid ${passed === true ? "#22C659" : passed === false ? "#FF0100" : "#22C659"}`;

    const mainFields = [
        { key: "formName", label: "แบบฟอร์ม", value: "ภส.05-02" },
        // { key: "electronicRegisterNo", label: "ทะเบียนรับอิเล็กทรอนิกส์เลขที่", value: ocrData.fields.electronicRegisterNo },
        // { key: "documentRegisterNo", label: "ทะเบียนรับเอกสารเลขที่", value: ocrData.fields.documentRegisterNo },
        // { key: "registerDate", label: "วัน เดือน ปี", value: ocrData.fields.registerDate },
        // { key: "receiverOfficer", label: "เจ้าหน้าที่ผู้รับ", value: ocrData.fields.receiverOfficer },
        { key: "companyName", label: "บริษัท", value: ocrData.fields.companyName },
        { key: "depotName", label: "คลัง", value: ocrData.fields.depotName },
        { key: "exciseNo", label: "ทะเบียนสรรพสามิตเลขที่", value: ocrData.fields.exciseNo ? String(ocrData.fields.exciseNo).replace(/\D/g, "") : "" },
        { key: "addressNo", label: "สถานที่ตั้งเลขที่", value: ocrData.fields.addressNo },
        { key: "alley", label: "ตรอก/ซอย", value: ocrData.fields.alley },
        { key: "road", label: "ถนน", value: ocrData.fields.road },
        { key: "subdistrict", label: "ตำบล/แขวง", value: ocrData.fields.subdistrict },
        { key: "district", label: "อำเภอ/เขต", value: ocrData.fields.district },
        { key: "province", label: "จังหวัด", value: ocrData.fields.province },
        { key: "zipcode", label: "รหัสไปรษณีย์", value: ocrData.fields.zipcode },
        { key: "phone1", label: "โทรศัพท์", value: ocrData.fields.phone1 },
    ];

    return (
        <div className="d-flex flex-column gap-1">
            {mainFields.map(({ key, label, value }, idx) => {
                const fieldValid = getFieldValidation(key);
                return value ? (
                    <React.Fragment key={idx}>
                        <div className="fw-bold" style={{ fontSize: "14px" }}>{label}</div>
                        <div
                            className="rounded-2 shadow-sm bg-white mb-2"
                            style={{
                                fontSize: "14px",
                                whiteSpace: "pre-line",
                                padding: "10px",
                                minHeight: "43px",
                                border: borderColor(fieldValid?.passed),
                            }}
                        >
                            {value}
                        </div>
                    </React.Fragment>
                ) : null;
            })}

            {ocrData.fields.products && ocrData.fields.products.length > 0 && (
                <div className="mt-3">
                    {ocrData.fields.products.map((prod, idx) => {
                        const validateProd = Array.isArray(validateResult?.products) ? validateResult.products[idx] : undefined;
                        const productFields = [
                            { key: "productType", label: "ประเภทสินค้า", value: prod.productType },
                            { key: "productName", label: "ชื่อสินค้าที่ผลิต", value: prod.productName },
                            { key: "productUnit", label: "หน่วย", value: prod.productUnit },
                        ];
                        return (
                            <div key={idx} className="mb-3">
                                {productFields.map(({ key, label, value }) => {
                                    const prodValid = validateProd?.[key as keyof typeof validateProd];
                                    const passed = prodValid && typeof prodValid === "object" && !Array.isArray(prodValid)
                                        ? (prodValid as { passed?: boolean }).passed
                                        : undefined;
                                    return value ? (
                                        <div key={label}>
                                            <div className="fw-bold" style={{ fontSize: "14px" }}>{label}</div>
                                            <div className="rounded-2 shadow-sm bg-white mb-2 p-2" style={{ border: borderColor(passed) }}>
                                                {value}
                                            </div>
                                        </div>
                                    ) : null;
                                })}

                                {Array.isArray(prod.materialsPerUnit) && prod.materialsPerUnit.length > 0 && (
                                    <div className="m-0">
                                        {(() => {
                                            let foundSummary = false;
                                            return prod.materialsPerUnit.map((mat, mIdx) => {
                                                const matValid = Array.isArray(validateProd?.materialsPerUnit) ? validateProd.materialsPerUnit[mIdx] : undefined;
                                                if (!foundSummary && mat.materialType && mat.materialType.includes("รวม")) {
                                                    foundSummary = true;
                                                    return (
                                                        <div key={`sum-${mIdx}`}>
                                                            <hr className="m-0 mt-3 mb-1" />
                                                            <div className="fw-bold" style={{ fontSize: "14px" }}>รวม</div>
                                                            <div className="rounded-2 shadow-sm bg-white mb-2 p-2"
                                                                style={{ border: borderColor(matValid?.materialQuantity?.passed) }}>
                                                                {mat.materialQuantity}
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                if (!foundSummary) {
                                                    const materialFields = [
                                                        { key: "materialType", label: "วัตถุดิบ", value: mat.materialType },
                                                        { key: "materialUnit", label: "หน่วย", value: mat.materialUnit },
                                                        { key: "materialQuantity", label: "ปริมาณ", value: mat.materialQuantity },
                                                        { key: "note", label: "หมายเหตุ", value: mat.note }
                                                    ];
                                                    return (
                                                        <div key={mIdx}>
                                                            <hr className="m-0 my-3" />
                                                            {materialFields.map(({ key, label, value }) => {
                                                                const matFieldValid = matValid?.[key as keyof typeof matValid];
                                                                return value ? (
                                                                    <div key={label}>
                                                                        <div className="fw-bold" style={{ fontSize: "14px" }}>{label}</div>
                                                                        <div className="rounded-2 shadow-sm bg-white mb-2 p-2"
                                                                            style={{ border: borderColor(matFieldValid?.passed) }}>
                                                                            {value}
                                                                        </div>
                                                                    </div>
                                                                ) : null;
                                                            })}
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            });
                                        })()}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ChecklistTaxForm0502;
