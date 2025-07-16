import React from "react";
import { OilCompare0701020307Result } from "../../types/validateTypes";
import { OilCompareValidationData } from "../../types/validateResTypes";
import { OcrDailyComparisonDocument } from "../../types/ocrFileType";
import { borderColor } from "../../utils/function/getBorderColor";

interface Props {
    data: OcrDailyComparisonDocument;
    context: OilCompare0701020307Result;
    validateResult: OilCompareValidationData;
}

const ChecklistDailyComparison: React.FC<Props> = ({ context, validateResult }) => {
    const ocrData = context.fields;
    if (!ocrData) return <div>ไม่พบข้อมูล</div>;

    const materialKeys = Array.from(new Set(
        ocrData.items.flatMap(i => Object.keys(i.form0701.materials))
    ));

    const getFieldRows = (item: typeof ocrData.items[number], vItem: any) => [
        {
            label: "วันที่",
            value: item.date,
            passed: vItem?.date?.passed,
        },
        ...materialKeys.map(mat => ({
            label: mat,
            value: item.form0701.materials[mat] ?? "-",
            passed: vItem?.form0701?.materials?.[mat]?.passed,
        })),
        {
            label: "ปริมาณรวม",
            value: item.form0701.totalVolume,
            passed: vItem?.form0701?.totalVolume?.passed,
        },
        {
            label: "แบบ ภส.07-02 ปริมาณการผลิตและจำหน่าย(ลิตร)",
            value: item.form0702.producedAndSoldVolume,
            passed: vItem?.form0702?.producedAndSoldVolume?.passed,
        },
        {
            label: "แบบ ภส.03-07 ปริมาณการชำระภาษี(ลิตร)",
            value: item.form0307.taxPaidVolume,
            passed: vItem?.form0307?.taxPaidVolume?.passed,
        },
        {
            label: "ผลต่าง",
            value: item.difference,
            passed: vItem?.difference?.passed,
        },
    ];

    const getSummaryRows = (summary: typeof ocrData.summary, vSummary: any) => [
        ...materialKeys.map(mat => ({
            label: mat,
            value: summary.totalMaterials[mat] ?? "-",
            passed: vSummary?.totalMaterials?.[mat]?.passed,
        })),
        {
            label: "ปริมาณรวม",
            value: summary.total0701Volume,
            passed: vSummary?.total0701Volume?.passed,
        },
        {
            label: "แบบ ภส.07-02 ปริมาณการผลิตและจำหน่าย(ลิตร)",
            value: summary.total0702Volume,
            passed: vSummary?.total0702Volume?.passed,
        },
        {
            label: "แบบ ภส.03-07 ปริมาณการชำระภาษี(ลิตร)",
            value: summary.total0307Volume,
            passed: vSummary?.total0307Volume?.passed,
        },
        {
            label: "ผลต่าง",
            value: summary.totalDifference,
            passed: vSummary?.totalDifference?.passed,
        },
    ];

    const headerField = [
        { label: "สำหรับสินค้า", key: "productName", value: ocrData.productName, passed: validateResult?.productName?.passed },
        { label: "บริษัท", key: "company", value: ocrData.company, passed: validateResult?.company?.passed },
        { label: "คลัง", key: "factory", value: ocrData.factory, passed: validateResult?.factory?.passed },
        { label: "สำหรับน้ำมันออกจากคลังวันที่ เดือน ปี", key: "oilOutDate", value: ocrData.oilOutDate, passed: validateResult?.oilOutDate?.passed },
    ];

    return (
        <div className="d-flex flex-column gap-2">
            {headerField.map((item, idx) => (
                <div className="m-0" key={idx}>
                    <div className="fw-bold">{item.label}</div>
                    <div
                        className={`rounded-2 shadow-sm bg-white p-2 mb-2`}
                        style={{ fontSize: "14px", border: borderColor(item.passed) }}
                    >
                        {item.value}
                    </div>
                </div>
            ))}
            <hr className="border-top border-2 border-secondary mb-2" />
            {ocrData.items.map((item, idx) => {
                const vItem = validateResult?.items?.[idx];
                return (
                    <div key={idx} className="pb-1">
                        {getFieldRows(item, vItem).map((f, i) => (
                            <div key={i}>
                                <div className="fw-bold mb-1">{f.label}</div>
                                <div
                                    className={`rounded-2 shadow-sm bg-white p-2 mb-2`}
                                    style={{ fontSize: "14px", border: borderColor(f.passed) }}
                                >
                                    {f.value}
                                </div>
                            </div>
                        ))}
                        <hr className="border-top border-2 border-secondary m-0 mt-3" />
                    </div>
                );
            })}
            <div>
                <div className="fw-bold">ผลรวม</div>
                {getSummaryRows(ocrData.summary, validateResult?.summary).map((f, i) => (
                    <div key={i}>
                        <div className="fw-bold">{f.label}</div>
                        <div
                            className={`rounded-2 shadow-sm bg-white p-2 mb-2`}
                            style={{ fontSize: "14px", border: borderColor(f.passed)}}
                        >
                            {f.value}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChecklistDailyComparison;
