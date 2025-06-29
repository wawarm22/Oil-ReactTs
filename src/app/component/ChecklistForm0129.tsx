import React from "react";
import { OcrTaxForm0129Document } from "../../types/ocrFileType";
import { PrepaedTaxForm0129Document } from "../../types/validateTypes";
import { ValidateResult0129 } from "../../types/validateResTypes";

interface Props {
    data: OcrTaxForm0129Document;
    validateResult: ValidateResult0129 | null;
    context: PrepaedTaxForm0129Document | null;
}

const ChecklistForm0129: React.FC<Props> = ({ validateResult, context }) => {
    const ocrData = context?.fields;

    if (!ocrData) {
        return <div>ไม่พบข้อมูล</div>;
    }

    const fields = [
        { label: "แบบฟอร์ม", key: "formName", value: "ภ.ษ. 01-29" },
        // { label: "ทะเบียนรับเลขที่", key: "registerNo", value: data.form_no },
        // { label: "วัน เดือน ปี", key: "registerDate", value: data.form_date },
        // { label: "เจ้าหน้าที่ผู้รับ", key: "receiverOfficer", value: data.form_officer },
        { label: "บริษัท", key: "companyName", value: ocrData?.companyName },
        { label: "คลัง", key: "depotName", value: ocrData?.depotName },
        { label: "ทะเบียนสรรพสามิตเลขที่", key: "exciseNo", value: ocrData?.exciseNo },
        { label: "สถานที่ตั้งเลขที่", key: "addressNo", value: ocrData?.addressNo },
        { label: "ตรอก/ซอย", key: "alley", value: ocrData?.alley },
        { label: "ถนน", key: "road", value: ocrData?.road },
        { label: "ตำบล/เเขวง", key: "subdistrict", value: ocrData?.subdistrict },
        { label: "อำเภอ/เขต", key: "district", value: ocrData?.district },
        { label: "จังหวัด", key: "province", value: ocrData?.province },
        { label: "รหัสไปรษณีย์", key: "zipcode", value: ocrData?.zipcode },
        { label: "โทรศัพท์", key: "phone", value: ocrData?.phone?.replace(/,/g, "") },
    ];

    const productColumns = [
        { label: "ลำดับ", key: "itemNo" },
        { label: "ประเภทสินค้า", key: "productType" },
        { label: "ชื่อสินค้าที่ผลิต", key: "productName" },
        { label: "แบบหรือขนาด", key: "productModel" },
    ];

    const materialColumns = [
        { label: "ประเภทวัตถุดิบ", key: "materialType" },
        { label: "แบบหรือขนาด (วัตถุดิบ)", key: "materialModel" },
        { label: "ปริมาณหรือจำนวน", key: "materialQuantity" },
        { label: "หมายเหตุ", key: "note" },
    ];

    const footer = [
        { label: "ปริมาณส่วนผสมหรือจำนวนวัตถุดิบหรือส่วนประกอบ เเละวิธีการผลิตสินค้า จำนวน (เเผ่น)", key: "productionMethodDocuments", value: ocrData?.productionMethodDocuments },
        { label: "เอกสารอื่นๆ(รายชื่อคลังน้ำมันที่ขออนุมัติใช้สูตร จำนวน (เเผ่น)", key: "otherDocuments", value: ocrData?.otherDocuments },
        { label: "ชื่อผู้ลงนาม", key: "operatorName", value: ocrData?.operatorName },
        { label: "วันที่ลงนาม", key: "signatureDate", value: ocrData?.signatureDate },
    ]

    const getBorderColor = (passed: boolean | null | undefined) => {
        if (passed === true) return "#22C659";
        if (passed === false) return "#FF0100";
        return "#CED4DA";
    };

    return (
        <div className="d-flex flex-column gap-2">
            {fields.map(({ label, key, value }, idx) => {
                // map ค่า validateResult สำหรับ field นี้
                let passed: boolean | null = null;
                if (validateResult && key && (validateResult as any)[key]) {
                    const val = (validateResult as any)[key];
                    if (typeof val.passed === "boolean") passed = val.passed;
                }
                return (
                    <div key={idx} className="mb-1">
                        <div className="fw-bold">{label}</div>
                        <div
                            className="rounded-2 shadow-sm bg-white p-2"
                            style={{
                                fontSize: "14px",
                                minHeight: "40px",
                                borderWidth: "2px",
                                borderStyle: "solid",
                                borderColor: getBorderColor(passed)
                            }}
                        >
                            {value}
                        </div>
                    </div>
                );
            })}

            {ocrData.products && ocrData.products.length > 0 && (
                <>
                    {ocrData.products.map((prod, prodIdx) => (
                        <div key={prodIdx} className="mb-2">
                            {productColumns.map(({ label, key }) => {
                                let passed: boolean | null = null;
                                if (
                                    validateResult?.products &&
                                    validateResult.products[prodIdx] &&
                                    (validateResult.products[prodIdx] as any)[key]
                                ) {
                                    const val = (validateResult.products[prodIdx] as any)[key];
                                    if (typeof val.passed === "boolean") passed = val.passed;
                                }
                                return (
                                    <div key={key} className="mb-1">
                                        <div className="fw-bold">{label}</div>
                                        <div
                                            className="rounded-2 shadow-sm bg-white p-2"
                                            style={{
                                                fontSize: "14px",
                                                minHeight: "40px",
                                                borderWidth: "2px",
                                                borderStyle: "solid",
                                                borderColor: getBorderColor(passed)
                                            }}
                                        >
                                            {(prod as any)[key] ?? ""}
                                        </div>
                                    </div>
                                );
                            })}
                            {prod.materialsPerUnit && prod.materialsPerUnit.length > 0 && (
                                <div className="my-2">
                                    <div className="fw-bold">รายการวัตถุดิบหรือส่วนประกอบที่นำมาใช้ในการผลิตสินค้า (ต่อสินค้า1หน่วย)(ลิตร)</div>
                                    {prod.materialsPerUnit.map((mat, matIdx) => (
                                        <div key={matIdx} className="my-1">
                                            {materialColumns.map(({ label, key }) => {
                                                let passed: boolean | null = null;
                                                if (
                                                    validateResult?.products &&
                                                    validateResult.products[prodIdx] &&
                                                    validateResult.products[prodIdx].materialsPerUnit &&
                                                    validateResult.products[prodIdx].materialsPerUnit[matIdx] &&
                                                    (validateResult.products[prodIdx].materialsPerUnit[matIdx] as any)[key]
                                                ) {
                                                    const val = (validateResult.products[prodIdx].materialsPerUnit[matIdx] as any)[key];
                                                    if (typeof val.passed === "boolean") passed = val.passed;
                                                }
                                                return (
                                                    <div key={key} className="mb-1">
                                                        <div className="fw-bold">{label}</div>
                                                        <div
                                                            className="rounded-2 shadow-sm bg-white p-2"
                                                            style={{
                                                                fontSize: "14px",
                                                                minHeight: "36px",
                                                                borderWidth: "2px",
                                                                borderStyle: "solid",
                                                                borderColor: getBorderColor(passed)
                                                            }}
                                                        >
                                                            {(mat as any)[key] ?? ""}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </>
            )}

            {footer.map(({ label, key, value }, idx) => {
                let passed: boolean | null = null;
                if (validateResult && key && (validateResult as any)[key]) {
                    const val = (validateResult as any)[key];
                    if (typeof val.passed === "boolean") passed = val.passed;
                }
                return (
                    <div key={idx} className="mb-1">
                        <div className="fw-bold">{label}</div>
                        <div
                            className="rounded-2 shadow-sm bg-white p-2"
                            style={{
                                fontSize: "14px",
                                minHeight: "40px",
                                borderWidth: "2px",
                                borderStyle: "solid",
                                borderColor: getBorderColor(passed)
                            }}
                        >
                            {value}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ChecklistForm0129;
