import React, { useEffect, useState } from "react";
import { OcrDailyProductionDocument } from "../../types/ocrFileType";
import { cleanCellValue, renderLabel } from "../../utils/function/ocrUtils";
import { useCompanyStore } from "../../store/companyStore";
import { validateOil0701 } from "../../utils/api/validateApi";

interface Props {
    data: OcrDailyProductionDocument;
}

const ChecklistDailyProduction: React.FC<Props> = ({ data }) => {
    const { selectedCompany } = useCompanyStore();
    const tables = data.detail_table ?? [];
    const factoriesNumber = localStorage.getItem("warehouse") ?? null;
    const [_validationResult, setValidationResult] = useState<any>(null);

    if (tables.length === 0) return <p className="text-muted">ไม่พบข้อมูลตาราง</p>;

    const fixedLabels: { key: string; label: string }[] = [
        { key: "column_1", label: "วันเดือนปี" },
        { key: "column_2", label: "รายการ" },
        { key: "column_3", label: "หลักฐานเลขที่" },
        { key: "column_4", label: "จำนวนรับ\nผลิตได้" },
        { key: "column_5", label: "รับคืนจากคลังสินค้าทัณฑ์บน" },
        { key: "column_6", label: "อื่นๆ" },
        { key: "column_7", label: "รวมรับสินค้า" },
        { key: "column_8", label: "จำนวนจ่าย\nจำหน่ายในประเทศ" },
        { key: "column_9", label: "จำหน่ายต่างประเทศ" },
        { key: "column_10", label: "ใช้ในโรงงานอุตสาหกรรม" },
        { key: "column_11", label: "คลังสินค้าทัณฑ์บน" },
        { key: "column_12", label: "เสียหาย" },
        { key: "column_13", label: "อื่นๆ" },
        { key: "column_14", label: "รวมจ่ายสินค้า" },
        { key: "column_15", label: "ยอดคงเหลือ" },
        { key: "column_16", label: "หมายเหตุ" },
    ];

    const summaryRow = tables.find((table) => {
        const values = Object.values(table?.properties ?? {}) as any[];
        return values.some((cell) => cleanCellValue(cell?.value).includes("รวมเดือนนี้"));
    });

    const summaryContent: { label: string; value: string }[] = [];
    if (summaryRow) {
        const props = summaryRow.properties as Record<string, any>;
        fixedLabels.forEach(({ key, label }) => {
            const value = cleanCellValue(props?.[key]?.value ?? "");
            if (value && value !== "-") {
                summaryContent.push({ label, value });
            }
        });
    }

    const ocrFieldRows = tables.map((row) => {
        const props = row.properties as Record<string, any>;
        const properties: Record<string, { value: string }> = {};
        fixedLabels.forEach(({ key, label }) => {
            const value = cleanCellValue(props?.[key]?.value ?? "");
            properties[label] = { value };
        });
        return { properties };
    });

    useEffect(() => {
        if (ocrFieldRows.length > 0 && selectedCompany) {
            const payload = {
                docType: "oil-07-02-page-1",
                company: selectedCompany.name,
                factories: factoriesNumber,
                fields: ocrFieldRows
            };

            // validateOil0701(payload).then((res) => {
            //     console.log("ผลลัพธ์ Validate:", res);
            //     setValidationResult(res);
            // });
        }
    }, [ocrFieldRows, selectedCompany]);

    return (
        <div className="d-flex flex-column">
            <div>
                {renderLabel("แบบฟอร์ม")}
                <div className="rounded-2 shadow-sm bg-white p-2 mb-2" style={{ minHeight: "42px", border: `1.5px solid #22C659` }}>{cleanCellValue(data.form_type)}</div>
            </div>
            <div>
                {renderLabel("ประเภทสินค้า")}
                <div className="rounded-2 shadow-sm bg-white p-2 mb-2" style={{ minHeight: "42px", border: `1.5px solid #22C659` }}>{cleanCellValue(data.product_cate)}</div>
            </div>
            <div>
                {renderLabel("ชนิด")}
                <div className="rounded-2 shadow-sm bg-white p-2 mb-2" style={{ minHeight: "42px", border: `1.5px solid #22C659` }}>{cleanCellValue(data.product_type)}</div>
            </div>
            <div>
                {renderLabel("ตราหรือเครื่องหมาย/เเบบ/รุ่น/ดีกรี/ความหวาน")}
                <div className="rounded-2 shadow-sm bg-white p-2 mb-2" style={{ minHeight: "42px", border: `1.5px solid #22C659` }}>{cleanCellValue(data.product_brand)}</div>
            </div>
            <div>
                {renderLabel("ขนาด")}
                <div className="rounded-2 shadow-sm bg-white p-2 mb-2" style={{ minHeight: "42px", border: `1.5px solid #22C659` }}>{cleanCellValue(data.product_size)}</div>
            </div>
            <div>
                {renderLabel("หน่วย")}
                <div className="rounded-2 shadow-sm bg-white p-2 mb-2" style={{ minHeight: "42px", border: `1.5px solid #22C659` }}>{cleanCellValue(data.product_unit)}</div>
            </div>

            {tables.slice(3).map((row, idx) => {
                const props = row.properties as Record<string, any>;
                return (
                    <div key={idx} className="d-flex flex-column gap-1 pt-3 border-top mt-3">
                        {fixedLabels.map(({ key, label }) => {
                            const raw = cleanCellValue(props?.[key]?.value ?? "");
                            return (
                                <React.Fragment key={`${idx}-${key}`}>
                                    {renderLabel(label)}
                                    <div
                                        className="rounded-2 shadow-sm bg-white mb-2"
                                        style={{
                                            fontSize: "13px",
                                            whiteSpace: "pre-line",
                                            padding: "10px",
                                            minHeight: "42px",
                                            border: `1.5px solid #22C659`
                                        }}
                                    >
                                        {raw}
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </div>
                );
            })}

            {summaryContent.length > 0 && (
                <div className="pt-2 border-top mt-3">
                    {/* <div className="fw-bold mb-1" style={{ fontSize: "18px"}}>รวมเดือนนี้</div> */}
                    {summaryContent.map(({ label, value }, idx) => (
                        <React.Fragment key={`summary-${idx}`}>
                            {renderLabel(label)}
                            <div className="rounded-2 shadow-sm bg-white mb-2" style={{ fontSize: "13px", whiteSpace: "pre-line", padding: "10px", border: `1.5px solid #22C659` }}>
                                {value}
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChecklistDailyProduction;
