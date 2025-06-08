import React, { useEffect, useState } from "react";
import { OcrStockOilDocument } from "../../types/ocrFileType";
import { getPrepared0701, validate0701New } from "../../utils/api/validateApi";
import { AuthSchema } from "../../types/schema/auth";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { Prepared0701, Prepared0701Report } from "../../types/validateTypes";
import { getFieldLabelMap } from "../../utils/fieldLabelMaps";
import { Validate0701Result } from "../../types/validateResTypes";

interface ChecklistStockOilFormattedProps {
    data: OcrStockOilDocument;
    oilTypeFromPrevPage?: string;
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

const ChecklistForm0701: React.FC<ChecklistStockOilFormattedProps> = ({
    data,
}) => {
    const auth = useAuthUser<AuthSchema>();
    const [ocrData, setOcrData] = useState<Prepared0701 | null>(null);
    const [validateData, setValidateData] = useState<Validate0701Result | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth || !auth.accessToken || !data.id) return;
        setLoading(true);
        getPrepared0701(data.id, auth)
            .then((res) => setOcrData(res.data))
            .catch(() => setOcrData(null))
            .finally(() => setLoading(false));
    }, [data.id, auth]);

    useEffect(() => {
        if (!ocrData) return;
        validate0701New(ocrData)
            .then(res => {
                if (res) setValidateData(res.data);
            });
    }, [ocrData]);

    if (loading) {
        return <div>กำลังโหลดข้อมูล...</div>;
    }

    if (!ocrData) {
        return <div>ไม่พบข้อมูล</div>;
    }

    const fieldLabelMap = getFieldLabelMap(ocrData.fields.material_type);

    // Helper สำหรับเช็ค "มีค่า"
    const hasValue = (val: any) => val !== undefined && val !== null && val !== "" && val !== 0;

    // Helper ดึงค่า passed (field บนหัวฟอร์ม)
    const getFieldPassed = (field?: string) =>
        field && validateData && validateData[field as keyof Validate0701Result]
            ? (validateData[field as keyof Validate0701Result] as any).passed
            : undefined;

    // ดึงค่า passed ในแต่ละ report
    const getReportPassed = (idx: number, field: string) =>
        validateData?.reports &&
        validateData.reports[idx] &&
        validateData.reports[idx][field as keyof typeof validateData.reports[0]]
            ? (validateData.reports[idx][field as keyof typeof validateData.reports[0]] as any).passed
            : undefined;

    // ดึงค่า passed ใน products (ใช้กรณีพิเศษกับ quantity)
    const getReportProductsQuantityPassed = (idx: number) =>
        validateData?.reports?.[idx]?.products?.map((prod: any) => prod.quantity?.passed);

    // ดึงค่า passed ใน total
    const getTotalPassed = (field: string) =>
        validateData?.total && validateData.total[field as keyof typeof validateData.total]
            ? (validateData.total[field as keyof typeof validateData.total] as any).passed
            : undefined;

    // Head fields ที่จะ filter เฉพาะ "report_open" และ "physical_open" ให้ไม่แสดงถ้าไม่มีค่า
    const headFields = [
        { label: "แบบฟอร์ม", value: ocrData.fields.form_type || "ภส.๐๗-๐๑", field: "form_type" },
        { label: "ประเภทวัตถุดิบ", value: ocrData.fields.material_type, field: "material_type" },
        { label: "หน่วย", value: ocrData.fields.unit, field: "unit" },
        { label: "ยอดคงเหลือ", value: ocrData.fields.report_open, field: "report_open" },
        { label: "ยอดคงเหลือตามบัญชีสิทธิ", value: ocrData.fields.physical_open, field: "physical_open" },
    ].filter(f =>
        !["report_open", "physical_open"].includes(f.field as string)
            || hasValue(f.value)
    );

    // เตรียม total fields ที่มีค่ามากกว่า 0
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
                        {f.value}
                    </div>
                </div>
            ))}

            <hr className="my-2" />

            {/* ส่วนรายการรายวัน */}
            {ocrData.fields.reports && ocrData.fields.reports.length > 0 &&
                ocrData.fields.reports.map((report, idx) =>
                    Object.entries(fieldLabelMap).map(([field, label]) => {
                        // ช่อง "ผลิตสินค้าพิกัด อัตราภาษีสรรพามิต" ต้องดึงจาก products[].quantity
                        if (field === "quantity") {
                            const prodsPassed = getReportProductsQuantityPassed(idx);
                            // ถ้าทุกตัวผ่าน ให้ passed=true, ถ้ามี false ให้ false, ถ้า undefined หมด ให้ undefined
                            const passed =
                                prodsPassed && prodsPassed.length > 0
                                    ? prodsPassed.every(Boolean)
                                        ? true
                                        : prodsPassed.some(v => v === false)
                                            ? false
                                            : undefined
                                    : undefined;
                            return (
                                <div key={`${idx}-${field}`} className="mb-2">
                                    <div className="fw-bold">{label}</div>
                                    <div className="rounded-2 shadow-sm bg-white p-2"
                                        style={{ minHeight: "38px", border: borderColor(passed) }}>
                                        {report.products && report.products.length > 0
                                            ? report.products.map((prod, pidx) =>
                                                <div key={pidx}>{prod.quantity}</div>
                                            )
                                            : "-"}
                                    </div>
                                </div>
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
                                    {value ?? ""}
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
                                    {total[field]}
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
