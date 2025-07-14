import React from "react";
import { OcrDetailTableDocument } from "../../types/ocrFileType";
import { PreparedOilCompare } from "../../types/validateTypes";
import { OilCompareValidationItem } from "../../types/validateResTypes";
import { getValidationStatus } from "../../utils/function/getValidateProps";

interface ChecklistTableProps {
    data: OcrDetailTableDocument;
    validateResult: OilCompareValidationItem[];
    context: PreparedOilCompare;
}

const ChecklistTable: React.FC<ChecklistTableProps> = ({ validateResult, context }) => {
    const ocrData = context?.fields;
    if (!ocrData?.length) return <div>ไม่พบข้อมูล</div>;

    const headerFields = [
        { label: "บริษัท", ...validateResult?.[0]?.company },
        { label: "คลัง", ...validateResult?.[0]?.factory },
        { label: "วันที่", ...validateResult?.[0]?.date },
    ];

    const allFieldLists = ocrData.map((field) => {
        const result: { label: string; value: any; matIdx?: number }[] = [
            { label: "ชื่อผลิตภัณฑ์", value: field.productName },
        ];
        field.materials.forEach((mat, matIdx) => {
            result.push(
                { label: "รายการวัตถุดิบหรือส่วนประกอบที่ใช้ในการผลิต", value: mat.name, matIdx },
                { label: "ปริมาณ", value: mat.quantity, matIdx },
                { label: "สินค้าต่อ 1 หน่วย", value: mat.perUnit, matIdx },
                { label: "สูตรการผลิต", value: mat.ratio, matIdx },
                { label: "หมายเหตุ", value: field.remark },
            );
        });
        result.push(
            { label: "ปริมาณรวม", value: field.totalQuantity },
            { label: "สินค้าต่อ 1 หน่วย", value: field.totalPerUnit },
            { label: "สูตรการผลิต", value: field.totalRatio }
        );
        return result;
    });

    const getBorderColor = (status?: "passed" | "failed") =>
        status === "passed" ? "#22C659"
            : status === "failed" ? "#FF0100"
                : "#E0E0E0";

    return (
        <div className="d-flex flex-column gap-2">
            {headerFields.map((f, i) => (
                <div key={i} className="mb-2">
                    <b>{f.label}</b>
                    <div
                        className="bg-white rounded-2 shadow-sm p-2"
                        style={{
                            minHeight: "42px",
                            border: `2px solid ${f.passed === true ? "#22C659" :
                                    f.passed === false ? "#FF0100" : "#E0E0E0"
                                }`
                        }}
                    >
                        {f.value}
                    </div>
                </div>
            ))}

            {allFieldLists.map((fieldList, fieldIdx) => (
                <div key={fieldIdx} className="mb-3">
                    {/* {allFieldLists.length > 1 && (
                        <div className="fw-bold mb-2" style={{ fontSize: 18 }}>
                            ผลิตภัณฑ์ {fieldIdx + 1}
                        </div>
                    )} */}
                    {fieldList.map((item, idx) => {
                        const status = getValidationStatus(
                            validateResult,
                            fieldIdx,
                            item,
                            item.matIdx
                        );
                        return (
                            <div key={idx} className="mb-3">
                                <b>{item.label}</b>
                                <div
                                    className="bg-white rounded-2 shadow-sm p-2"
                                    style={{
                                        border: `2px solid ${getBorderColor(status)}`
                                    }}
                                >
                                    {item.value ?? "-"}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default ChecklistTable;
