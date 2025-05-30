import React, { useEffect, useState } from "react";
import { OcrTaxForm0502Document } from "../../types/ocrFileType";
import { AuthSchema } from "../../types/schema/auth";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { getPrepared0502 } from "../../utils/api/validateApi";
import { Prepared0502 } from "../../types/preparedTypes";

interface Props {
    data: OcrTaxForm0502Document;
}

const ChecklistTaxForm0502: React.FC<Props> = ({ data }) => {
    const auth = useAuthUser<AuthSchema>();
    const [ocrData, setOcrData] = useState<Prepared0502 | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth || !auth.accessToken || !data.id) return;
        setLoading(true);
        getPrepared0502(data.id, auth)
            .then(res => setOcrData(res.data))
            .catch(() => setOcrData(null))
            .finally(() => setLoading(false));
    }, [data.id, auth]);

    if (loading || !ocrData) {
        return <div>กำลังโหลดข้อมูล...</div>;
    }

    const { fields } = ocrData;

    const mainFields = [
        { label: "แบบฟอร์ม", value: "ภส.05-02" },
        { label: "ทะเบียนรับอิเล็กทรอนิกส์เลขที่", value: fields.electronicRegisterNo },
        { label: "ทะเบียนรับเอกสารเลขที่", value: fields.documentRegisterNo },
        { label: "วัน เดือน ปี", value: fields.registerDate },
        { label: "เจ้าหน้าที่ผู้รับ", value: fields.receiverOfficer },
        { label: "บริษัท", value: fields.companyName },
        { label: "คลัง", value: fields.depotName },
        { label: "ทะเบียนสรรพสามิตเลขที่", value: fields.exciseNo ? String(fields.exciseNo).replace(/\D/g, "") : "" },
        { label: "สถานที่ตั้งเลขที่", value: fields.addressNo },
        { label: "ตรอก/ซอย", value: fields.alley },
        { label: "ถนน", value: fields.road },
        { label: "ตำบล/แขวง", value: fields.subdistrict },
        { label: "อำเภอ/เขต", value: fields.district },
        { label: "จังหวัด", value: fields.province },
        { label: "รหัสไปรษณีย์", value: fields.zipcode },
        { label: "โทรศัพท์", value: fields.phone1 },
    ];

    return (
        <div className="d-flex flex-column gap-1">
            {mainFields.map(({ label, value }, idx) =>
                value ? (
                    <React.Fragment key={idx}>
                        <div className="fw-bold" style={{ fontSize: "14px" }}>{label}</div>
                        <div
                            className="rounded-2 shadow-sm bg-white mb-2"
                            style={{
                                fontSize: "14px",
                                whiteSpace: "pre-line",
                                padding: "10px",
                                minHeight: "43px",
                                border: `1.5px solid #22C659`
                            }}
                        >
                            {value}
                        </div>
                    </React.Fragment>
                ) : null
            )}

            {fields.products && fields.products.length > 0 && (
                <div className="mt-3">
                    {fields.products.map((prod, idx) => {
                        const productFields = [
                            { label: "ลำดับที่", value: prod.itemNo },
                            { label: "ประเภทสินค้า", value: prod.productType },
                            { label: "ชื่อสินค้าที่ผลิต", value: prod.productName },
                            { label: "หน่วย", value: prod.productUnit },
                        ];

                        return (
                            <div key={idx} className="mb-3">
                                {productFields.map(({ label, value }) =>
                                    value ? (
                                        <div key={label}>
                                            <div className="fw-bold" style={{ fontSize: "14px" }}>{label}</div>
                                            <div className="rounded-2 shadow-sm bg-white mb-2 p-2" style={{ border: '1.5px solid #22C659' }}>
                                                {value}
                                            </div>
                                        </div>
                                    ) : null
                                )}

                                {Array.isArray(prod.materialsPerUnit) && prod.materialsPerUnit.length > 0 && (
                                    <div className="m-0">
                                        {(() => {
                                            let foundSummary = false;
                                            return prod.materialsPerUnit.map((mat, mIdx) => {
                                                if (!foundSummary && mat.materialType && mat.materialType.includes("รวม")) {
                                                    foundSummary = true;
                                                    return (
                                                        <div key={`sum-${mIdx}`}>
                                                            <hr className="m-0 mt-3 mb-1"/>
                                                            <div className="fw-bold" style={{ fontSize: "14px" }}>รวม</div>
                                                            <div className="rounded-2 shadow-sm bg-white mb-2 p-2" style={{ border: '1.5px solid #22C659' }}>
                                                                {mat.materialQuantity}
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                if (!foundSummary) {
                                                    const materialFields = [
                                                        { label: "วัตถุดิบ", value: mat.materialType },
                                                        { label: "หน่วย", value: mat.materialUnit },
                                                        { label: "ปริมาณ", value: mat.materialQuantity },
                                                        { label: "หมายเหตุ", value: mat.note }
                                                    ];
                                                    return (
                                                        <div key={mIdx}>
                                                            <hr className="m-0 my-3"/>
                                                            {materialFields.map(({ label, value }) =>
                                                                value ? (
                                                                    <div key={label}>
                                                                        <div className="fw-bold" style={{ fontSize: "14px" }}>{label}</div>
                                                                        <div className="rounded-2 shadow-sm bg-white mb-2 p-2" style={{ border: '1.5px solid #22C659' }}>
                                                                            {value}
                                                                        </div>
                                                                    </div>
                                                                ) : null
                                                            )}
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
