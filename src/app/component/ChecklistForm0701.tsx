import React from "react";
import { OcrStockOilDocument } from "../../types/ocrFileType";
import { Prepared0701, Prepared0701Report } from "../../types/validateTypes";
import { getFieldLabelMap } from "../../utils/fieldLabelMaps";
import { Validate0701Result } from "../../types/validateResTypes";

interface ChecklistStockOilFormattedProps {
    data: OcrStockOilDocument;
    oilTypeFromPrevPage?: string;
    validateResult: Validate0701Result | null;
    context?: Prepared0701 | null
}

type TotalFieldKey = "bl" | "outturn" | "for_deduction" | "use" | "overall";

const totalFieldMap: Record<TotalFieldKey, string> = {
    bl: "B/L",
    outturn: "Outturn",
    for_deduction: "ปริมาณสิทธิ์หักลดหย่อน",
    use: "ผลิตสินค้าพิกัด อัตราภาษีสรรพามิต",
    overall: "รวมจ่าย",
};

const borderColor = (passed?: boolean) =>
    `1.5px solid ${passed === true ? "#22C659" : passed === false ? "#FF0100" : "#CED4DA"}`;

// เพิ่มฟังก์ชัน formatNumber
const formatNumber = (value: any) => {
    if (typeof value === "number" && !isNaN(value)) return value.toLocaleString("en-US");
    if (typeof value === "string" && !isNaN(Number(value)) && value.trim() !== "") return Number(value).toLocaleString("en-US");
    return value ?? "";
};

const ChecklistForm0701: React.FC<ChecklistStockOilFormattedProps> = ({
    validateResult,
    context
}) => {
    const ocrData = context;

    if (!ocrData) {
        return <div>ไม่พบข้อมูล</div>;
    }    

    const fieldLabelMap = getFieldLabelMap(ocrData.fields.material_type);

    const hasValue = (val: any) => val !== undefined && val !== null && val !== "" && val !== 0;

    const getFieldPassed = (field?: string) =>
        field && validateResult && validateResult[field as keyof Validate0701Result]
            ? (validateResult[field as keyof Validate0701Result] as any).passed
            : undefined;

    const getReportPassed = (idx: number, field: string) => {
        if (field === "main_product") return true;
        return validateResult?.reports &&
            validateResult.reports[idx] &&
            validateResult.reports[idx][field as keyof typeof validateResult.reports[0]]
            ? (validateResult.reports[idx][field as keyof typeof validateResult.reports[0]] as any).passed
            : undefined;
    };

    const getReportProductsQuantityPassed = (idx: number) =>
        validateResult?.reports?.[idx]?.products?.map((prod: any) => prod.quantity?.passed);

    const getTotalPassed = (field: string) =>
        validateResult?.total && validateResult.total[field as keyof typeof validateResult.total]
            ? (validateResult.total[field as keyof typeof validateResult.total] as any).passed
            : undefined;

    const headFields = [
        { label: "แบบฟอร์ม", value: "ภส.๐๗-๐๑", field: "form_type" },
        { label: "ประเภทวัตถุดิบ", value: ocrData.fields.material_type, field: "material_type" },
        { label: "หน่วย", value: ocrData.fields.unit, field: "unit" },
        { label: "ยอดคงเหลือ", value: ocrData.fields.report_open, field: "report_open" },
        { label: "ยอดคงเหลือตามบัญชีสิทธิ", value: ocrData.fields.physical_open, field: "physical_open" },
    ].filter(f =>
        !["report_open", "physical_open"].includes(f.field as string)
        || hasValue(f.value)
    );

    const total = ocrData.fields.total as Partial<Record<TotalFieldKey, number>>;
    const shownTotalFields = Object.entries(totalFieldMap).filter(
        ([field]) =>
            total && typeof total[field as TotalFieldKey] === "number" && total[field as TotalFieldKey]! > 0
    ) as [TotalFieldKey, string][];

    return (
        <div className="d-flex flex-column gap-3">
            {/* ส่วนหัวฟอร์ม */}
            {headFields.map((f, idx) => (
                <div key={idx}>
                    <div className="fw-bold">{f.label}</div>
                    <div
                        className="rounded-2 shadow-sm bg-white p-2 mb-1"
                        style={{
                            minHeight: "38px",
                            border: borderColor(getFieldPassed(f.field)),
                        }}
                    >
                        {/* ถ้าเป็น field ที่ต้องการ format number */}
                        {["report_open", "physical_open"].includes(f.field)
                            ? formatNumber(f.value)
                            : f.value}
                    </div>
                </div>
            ))}

            <hr className="my-2" />

            {/* ส่วนรายการรายวัน */}
            {ocrData.fields.reports && ocrData.fields.reports.length > 0 &&
                ocrData.fields.reports.map((report, idx) =>
                    Object.entries(fieldLabelMap).map(([field, label]) => {
                        if (field === "quantity") {
                            const prodsPassed = getReportProductsQuantityPassed(idx);
                            const passed =
                                prodsPassed && prodsPassed.length > 0
                                    ? prodsPassed.every(Boolean)
                                        ? true
                                        : prodsPassed.some(v => v === false)
                                            ? false
                                            : undefined
                                    : undefined;
                            return (
                                report.products && report.products.length > 0
                                    ? report.products.map((prod, pidx) =>
                                        <div key={`${idx}-${field}-${pidx}`} className="mb-2">
                                            <div className="fw-bold">{label} : {prod.product_name}</div>
                                            <div className="rounded-2 shadow-sm bg-white p-2"
                                                style={{ minHeight: "38px", border: borderColor(passed) }}>
                                                {formatNumber(prod.quantity)}
                                            </div>
                                        </div>
                                    ) : null
                            );
                        }

                        if (field === "products") return null;

                        const value = report[field as keyof Prepared0701Report];
                        if (Array.isArray(value)) return null;
                        const passed = getReportPassed(idx, field);

                        return (
                            <div key={`${idx}-${field}`} className="mb-2">
                                <div className="fw-bold">{label}</div>
                                <div
                                    className="rounded-2 shadow-sm bg-white p-2"
                                    style={{
                                        minHeight: "38px",
                                        border: borderColor(passed),
                                    }}
                                >
                                    {field === "evidence_number"
                                        ? (value ?? "")
                                        : (typeof value === "number" ? formatNumber(value) : value ?? "")}

                                </div>
                            </div>
                        );
                    })
                )
            }

            {/* ส่วน Total */}
            {shownTotalFields.length > 0 && (
                <>
                    <hr className="m-0" />
                    <div className="fw-bold mb-2">รวมเดือนนี้</div>
                    {shownTotalFields.map(([field, label]) => {
                        const passed = getTotalPassed(field);
                        return (
                            <div key={field} className="mb-2">
                                <div className="fw-bold">{label}</div>
                                <div
                                    className="rounded-2 shadow-sm bg-white p-2"
                                    style={{
                                        minHeight: "38px",
                                        border: borderColor(passed),
                                    }}
                                >
                                    {formatNumber(total[field])}
                                </div>
                            </div>
                        );
                    })}
                </>
            )}
        </div>
    );
};

export default ChecklistForm0701;
