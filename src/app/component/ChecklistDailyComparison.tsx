import React from "react";
import { borderColor } from "../../utils/function/getBorderColor";
import { OilCompareValidationDataV2 } from "../../types/validateResTypes";
import { OilCompare0701020307ResultV2 } from "../../types/validateTypes";
import { OcrDailyComparisonDocument } from "../../types/ocrFileType";
import { readableNumber, safeNumber } from "../../utils/function/format";

interface Props {
    data: OcrDailyComparisonDocument;
    context: OilCompare0701020307ResultV2;
    validateResult: OilCompareValidationDataV2;
}

const ChecklistDailyComparison: React.FC<Props> = ({ context, validateResult }) => {
    const ocrData = context.fields;
    if (!ocrData) return <div>ไม่พบข้อมูล</div>;

    const materialKeys = Object.keys(ocrData.materialName);

    const headerField = [
        { label: "สำหรับสินค้า", value: ocrData.productName, passed: validateResult?.productName?.passed },
        { label: "บริษัท", value: ocrData.company, passed: validateResult?.company?.passed },
        { label: "คลัง", value: ocrData.factory, passed: validateResult?.factory?.passed },
        { label: "สำหรับน้ำมันออกจากคลังวันที่ เดือน ปี", value: ocrData.oilOutDate, passed: validateResult?.oilOutDate?.passed },
    ];

    const getFieldRows = (
        item: typeof ocrData.items[number],
        vItem: typeof validateResult.items[number]
    ) => {
        const materialFields = materialKeys.map((matKey) => ({
            label: ocrData.materialName[matKey] || matKey,
            value: item.materials[matKey] ?? "-",
            passed: vItem?.materials?.[0]?.[matKey]?.passed,
        }));

        return [
            { label: "วันที่", value: item.date, passed: vItem?.date?.passed },
            ...materialFields,
            { label: "ปริมาณรวม", value: item.totalVolume, passed: vItem?.totalVolume?.passed },
            { label: "แบบ ภส.07-02 ปริมาณการผลิตและจำหน่าย(ลิตร)", value: item.producedAndSoldVolume, passed: vItem?.producedAndSoldVolume?.passed },
            { label: "แบบ ภส.03-07 ปริมาณการชำระภาษี(ลิตร)", value: item.taxPaidVolume, passed: vItem?.taxPaidVolume?.passed },
            { label: "ผลต่าง", value: item.difference, passed: vItem?.difference?.passed },
        ];
    };

    const getSummaryRows = (
        summary: typeof ocrData.summary,
        vSummary: typeof validateResult.summary
    ) => {
        const materialFields = materialKeys.map((matKey) => ({
            label: ocrData.materialName[matKey] || matKey,
            value: summary.materials[matKey] ?? "-",
            passed: vSummary?.materials?.[0]?.[matKey]?.passed,
        }));

        return [
            ...materialFields,
            { label: "ปริมาณรวม", value: summary.totalVolume, passed: vSummary?.totalVolume?.passed },
            { label: "แบบ ภส.07-02 ปริมาณการผลิตและจำหน่าย(ลิตร)", value: summary.producedAndSoldVolume, passed: vSummary?.producedAndSoldVolume?.passed },
            { label: "แบบ ภส.03-07 ปริมาณการชำระภาษี(ลิตร)", value: summary.taxPaidVolume, passed: vSummary?.taxPaidVolume?.passed },
            { label: "ผลต่าง", value: summary.difference, passed: vSummary?.difference?.passed },
        ];
    };

    return (
        <div className="d-flex flex-column gap-2">
            {headerField.map((item, idx) => (
                <div key={idx} className="m-0">
                    <div className="fw-bold">{item.label}</div>
                    <div className="rounded-2 shadow-sm bg-white p-2 mb-2"
                        style={{ fontSize: "14px", border: borderColor(item.passed) }}>
                        {item.value}
                    </div>
                </div>
            ))}
            <hr className="border-top border-2 border-secondary mb-2 m-0" />

            {ocrData.items.map((item, idx) => {
                const vItem = validateResult?.items?.[idx];
                return (
                    <div key={idx} className="pb-1">
                        {getFieldRows(item, vItem).map((f, i) => (
                            <div key={i}>
                                <div className="fw-bold mb-1">{f.label}</div>
                                <div className="rounded-2 shadow-sm bg-white p-2 mb-2"
                                    style={{ fontSize: "14px", border: borderColor(f.passed) }}>
                                    {readableNumber(safeNumber(f.value))}
                                </div>
                            </div>
                        ))}
                        <hr className="border-top border-2 border-secondary m-0 mt-3" />
                    </div>
                );
            })}

            <div>
                <div className="fw-bold mb-2">ผลรวม</div>
                {getSummaryRows(ocrData.summary, validateResult?.summary).map((f, i) => (
                    <div key={i}>
                        <div className="fw-bold">{f.label}</div>
                        <div className="rounded-2 shadow-sm bg-white p-2 mb-2"
                            style={{ fontSize: "14px", border: borderColor(f.passed) }}>
                            {readableNumber(f.value)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChecklistDailyComparison;
