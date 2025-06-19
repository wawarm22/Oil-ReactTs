import React from "react";
import { OcrGroupedProductDocument } from "../../types/ocrFileType";
import { PreparedFormularApprovResponse } from "../../types/preparedTypes";
import { ValidateFormularApprovData } from "../../types/validateResTypes";

interface ChecklistGroupedProductProps {
    data: OcrGroupedProductDocument;
    validateResult: ValidateFormularApprovData | null;
    context?: PreparedFormularApprovResponse | null;
}

const ChecklistGroupedProduct: React.FC<ChecklistGroupedProductProps> = ({
    validateResult,
    context,
}) => {
    const ocrData = context;  
    if (!ocrData || !ocrData.fields?.items?.length) {
        return <p className="text-muted">ไม่พบข้อมูล</p>;
    }    

    return (
        <div className="d-flex flex-column gap-4">
            {ocrData.fields.items.map((item, idx) => {
                const itemValidate = validateResult?.items?.[idx];
                return (
                    <div key={idx} className="d-flex flex-column gap-0 border-bottom mb-0">
                        {item.no && (
                            <div>
                                <div className="fw-bold">ลำดับ</div>
                                <div
                                    className="rounded-2 shadow-sm bg-white p-2"
                                    style={{
                                        minHeight: "42px",
                                        border: itemValidate?.no?.passed === false
                                            ? "1.5px solid #FF0100"
                                            : itemValidate?.no?.passed === true
                                                ? "1.5px solid #22C659"
                                                : "1.5px solid #CED4DA"
                                    }}
                                >
                                    {item.no}
                                </div>
                            </div>
                        )}
                        {item.product.type && (
                            <div>
                                <div className="fw-semibold">ประเภทสินค้า</div>
                                <div
                                    className="rounded-2 shadow-sm bg-white p-2"
                                    style={{
                                        minHeight: "42px",
                                        border: itemValidate?.product?.type?.passed === false
                                            ? "1.5px solid #FF0100"
                                            : itemValidate?.product?.type?.passed === true
                                                ? "1.5px solid #22C659"
                                                : "1.5px solid #CED4DA"
                                    }}
                                >
                                    {item.product.type}
                                </div>
                            </div>
                        )}
                        {item.product.name && (
                            <div>
                                <div className="fw-bold">ชื่อสินค้าที่ผลิต</div>
                                <div
                                    className="rounded-2 shadow-sm bg-white p-2"
                                    style={{
                                        minHeight: "42px",
                                        border: itemValidate?.product?.name?.passed === false
                                            ? "1.5px solid #FF0100"
                                            : itemValidate?.product?.name?.passed === true
                                                ? "1.5px solid #22C659"
                                                : "1.5px solid #CED4DA"
                                    }}
                                >
                                    {item.product.name}
                                </div>
                            </div>
                        )}
                        {(item.product.unit !== undefined) && (
                            <div>
                                <div className="fw-semibold">แบบหรือขนาด</div>
                                <div
                                    className="rounded-2 shadow-sm bg-white p-2"
                                    style={{
                                        minHeight: "42px",
                                        border: itemValidate?.product?.unit?.passed === false
                                            ? "1.5px solid #FF0100"
                                            : itemValidate?.product?.unit?.passed === true
                                                ? "1.5px solid #22C659"
                                                : "1.5px solid #CED4DA"
                                    }}
                                >
                                    {item.product.unit && item.product.unit.trim() !== "" ? item.product.unit : "ลิตร"}
                                </div>
                            </div>
                        )}

                        {item.product.materials?.length > 0 && (
                            <div className="m-0">
                                {item.product.materials.map((mat, midx) => {
                                    const matValidate = itemValidate?.product?.materials?.[midx];
                                    return (
                                        <div key={midx} className="mb-0">
                                            <hr className="m-0 mb-2 mt-3" />
                                            {mat.name && (
                                                <div>
                                                    <div className="fw-semibold mb-2">วัตถุดิบ/ส่วนประกอบที่นำมาใช้ (ต่อสินค้า 1 หน่วย)</div>
                                                    <div className="fw-semibold">ประเภท</div>
                                                    <div
                                                        className="rounded-2 shadow-sm bg-white p-2"
                                                        style={{
                                                            minHeight: "42px",
                                                            border: matValidate?.name?.passed === false
                                                                ? "1.5px solid #FF0100"
                                                                : matValidate?.name?.passed === true
                                                                    ? "1.5px solid #22C659"
                                                                    : "1.5px solid #CED4DA"
                                                        }}
                                                    >
                                                        {mat.name}
                                                    </div>
                                                </div>
                                            )}
                                            {mat.unit && (
                                                <div>
                                                    <div className="fw-semibold">หน่วย</div>
                                                    <div
                                                        className="rounded-2 shadow-sm bg-white p-2"
                                                        style={{
                                                            minHeight: "42px",
                                                            border: matValidate?.unit?.passed === false
                                                                ? "1.5px solid #FF0100"
                                                                : matValidate?.unit?.passed === true
                                                                    ? "1.5px solid #22C659"
                                                                    : "1.5px solid #CED4DA"
                                                        }}
                                                    >
                                                        {mat.unit}
                                                    </div>
                                                </div>
                                            )}
                                            {mat.quantity && (
                                                <div>
                                                    <div className="fw-semibold">ปริมาณหรือจำนวน</div>
                                                    <div
                                                        className="rounded-2 shadow-sm bg-white p-2 mb-2"
                                                        style={{
                                                            minHeight: "42px",
                                                            border: matValidate?.quantity?.passed === false
                                                                ? "1.5px solid #FF0100"
                                                                : matValidate?.quantity?.passed === true
                                                                    ? "1.5px solid #22C659"
                                                                    : "1.5px solid #CED4DA"
                                                        }}
                                                    >
                                                        {mat.quantity}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {idx === ocrData.fields.items.length - 1 && (item.total || item.total === 0) && (
                            <div>
                                <div className="fw-semibold">รวม</div>
                                <div
                                    className="rounded-2 shadow-sm bg-white p-2"
                                    style={{
                                        minHeight: "42px",
                                        border: itemValidate?.total?.passed === false
                                            ? "1.5px solid #FF0100"
                                            : itemValidate?.total?.passed === true
                                                ? "1.5px solid #22C659"
                                                : "1.5px solid #CED4DA"
                                    }}
                                >
                                    {item.total}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ChecklistGroupedProduct;
