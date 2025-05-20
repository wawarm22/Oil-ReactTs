import React, { useEffect, useState } from "react";
import { OcrAttachment0704Document } from "../../types/ocrFileType";
import { useCompanyStore } from "../../store/companyStore";
import { genRequestObject } from "../../utils/function/checklist/attachment0704";
import { validateOil0704 } from "../../utils/api/validateApi";
import { ValidateOil0704Payload } from "../../types/validateTypes";

interface Props {
    data: OcrAttachment0704Document;
}

const ChecklistAttachment0704: React.FC<Props> = ({ data }) => {
    const { selectedCompany } = useCompanyStore();
    const factoriesNumber = localStorage.getItem("warehouse") ?? null;
    const [validationResult, setValidationResult] = useState<any>(null);

    const cleanValue = (val?: string | { value: string } | null): string => {
        const raw = typeof val === "object" ? val?.value : val;
        if (!raw || raw.trim() === "" || raw === ":unselected:") return "-";
        return raw.trim();
    };

    const renderBox = (label: string, value: any, passed?: boolean) => (
        <div key={label}>
            <div className="fw-bold">{label}</div>
            <div
                className="rounded-2 shadow-sm bg-white p-2"
                style={{
                    fontSize: "14px",
                    whiteSpace: "pre-line",
                    border: `1.5px solid ${passed === true ? "green" : passed === false ? "red" : "#dee2e6"}`,
                }}
            >
                {cleanValue(value)}
            </div>
        </div>
    );

    const fieldsToDisplay = [
        { key: "form_type", label: "แบบฟอร์ม", value: data.form_type },
        { key: "form_no", label: "เลขที่รับ", value: data.form_no },
        { key: "form_date", label: "วัน เดือน ปี ที่รับ", value: data.form_date },
        { key: "form_officer_1", label: "เจ้าพนักงานผู้รับ", value: data.form_officer_1 },
        { key: "company_name", label: "ชื่อโรงอุตสาหกรรม (คลัง)", value: data.company_name },
        { key: "excise_id", label: "ทะเบียนสรรพสามิตเลขที่", value: data.excise_id },
        { key: "date", label: "ประจำเดือน ปี", value: data.date },
    ];

    useEffect(() => {
        if (data && selectedCompany) {
            genRequestObject({ fields: data })
                .then((genFields) => {
                    const payload: ValidateOil0704Payload = {
                        docType: "oil-07-04-page-1",
                        documentGroup: data.documentGroup,
                        fields: {
                            ...genFields,
                            company_name: selectedCompany.name,
                            form_officer_name: factoriesNumber || "",
                        },
                    };

                    return validateOil0704(payload);
                })
                .then((res) => {
                    if (res) {
                        setValidationResult(res);
                    }
                })
                .catch((err) => console.error("Error generating payload or validating:", err));
        }
    }, [data, selectedCompany]);

    const table1 = data.detail_table_1 ?? [];
    const table2 = data.detail_table_2 ?? [];

    const tableMap1 = [
        { label: "รายการ/วัตถุดิบ (หน่วย)", field: "material_name" },
        { label: "คงเหลือยกมา", field: "open" },
        { label: "รับเดือนนี้", field: "getted" },
        { label: "รวม", field: "total" },
        { label: "ผลิตสินค้าตามพิกัด ฯ", field: "produce" },
        { label: "ผลิตสินค้าอื่น", field: "produce_other" },
        { label: "เสียหาย", field: "defected" },
        { label: "อื่น ๆ (จ่ายโอนคลัง)", field: "etc" },
        { label: "ยอดคงเหลือตามบัญชี", field: "loss_gain" },
        { label: "คงเหลือยกไป", field: "forward" },
    ];

    const tableMap2 = [
        { label: "ชื่อสินค้า", field: "product_name" },
        { label: "คงเหลือยกมา", field: "open" },
        { label: "รับจากการผลิต", field: "produced" },
        { label: "รับคืนจากคลังสินค้าทัณฑ์บน", field: "bonded_return" },
        { label: "อื่น ๆ", field: "etc_getted" },
        { label: "รวม", field: "total" },
        { label: "จำหน่ายในประเทศ", field: "domestic_sales" },
        { label: "จำหน่ายต่างประเทศ", field: "overseas_sales" },
        { label: "ใช้ในโรงอุตสาหกรรม", field: "used_in_industrial_plans" },
        { label: "คลังสินค้าทัณฑ์บน", field: "bonded" },
        { label: "เสียหาย", field: "defected" },
        { label: "คงเหลือยกไป", field: "forward" },
        { label: "อื่น ๆ", field: "etc_used" },
    ];

    return (
        <div className="d-flex flex-column gap-3">
            {fieldsToDisplay.map(({ key, label, value }) =>
                renderBox(label, value, validationResult?.data?.[key]?.passed)
            )}

            <hr className="border-top border-2 border-secondary my-2" />
            <div className="fw-bold">๑. ข้อมูลวัตถุดิบ</div>
            {[6, 7, 8, 9].map((colIdx) =>
                tableMap1.map(({ label, field }, i) => {
                    const val = table1[i]?.properties?.[`column_${colIdx}`]?.value;
                    const passed = validationResult?.data?.materials?.[i]?.[field]?.passed;
                    return renderBox(label, val, passed);
                })
            )}

            <hr className="border-top border-2 border-secondary my-2" />
            <div className="fw-bold">๒. งบการผลิต</div>
            {tableMap2.map(({ label, field }, i) => {
                const val = table2[i]?.properties?.column_9?.value;
                const passed = validationResult?.data?.products?.[i]?.[field]?.passed;
                return renderBox(label, val, passed);
            })}
        </div>
    );
};

export default ChecklistAttachment0704;
