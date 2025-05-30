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

    const normalize = (str: any) => {
        if (!str) return '';
        if (typeof str === 'string') return str.trim().replace(/\s+/g, '').toLowerCase();
        if (typeof str === 'object' && typeof str.value === 'string')
            return str.value.trim().replace(/\s+/g, '').toLowerCase();
        return String(str).trim().replace(/\s+/g, '').toLowerCase();
    };

    const isBracketPattern = (str: string | undefined | null) =>
        !!str && /^\(.*\)$/.test(str.trim());

    const cleanValue = (val?: string | { value: string } | null): string => {
        const raw = typeof val === "object" ? val?.value : val;
        if (!raw || raw.trim() === "" || raw === ":unselected:") return "";
        return raw.trim();
    };

    const renderBox = (label: string, value: any, passed?: boolean) => (
        <div key={label + (typeof value === "string" ? value : "")}>
            <div className="fw-bold">{label}</div>
            <div
                className="rounded-2 shadow-sm bg-white p-2"
                style={{
                    fontSize: "14px",
                    whiteSpace: "pre-line",
                    minHeight: "43px",
                    border: `1.5px solid ${passed === true ? "#22C659" : passed === false ? "#FF0100" : "#22C659"}`,
                }}
            >
                {cleanValue(value)}
            </div>
        </div>
    );

    const fieldsToDisplay = [
        { key: "form_type", label: "แบบฟอร์ม", value: "ภส.07-04" },
        { key: "form_no", label: "เลขที่รับ", value: data.form_no },
        { key: "form_date", label: "วัน เดือน ปี ที่รับ", value: data.form_date },
        { key: "form_officer_1", label: "เจ้าพนักงานผู้รับ", value: data.form_officer_name },
        { key: "company_name", label: "ชื่อโรงอุตสาหกรรม (คลัง)", value: data.company_name },
        { key: "excise_id", label: "ทะเบียนสรรพสามิตเลขที่", value: data.excise_id },
        { key: "date", label: "ประจำเดือน ปี", value: data.date },
    ];

    useEffect(() => {
        if (data && selectedCompany) {
            genRequestObject({ fields: data })
                .then((genFields) => {
                    const payload: ValidateOil0704Payload = {
                        docType: data.docType,
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
        // { label: "อื่น ๆ", field: "etc_getted" },
        { label: "รวม", field: "total" },
        { label: "จำหน่ายในประเทศ", field: "domestic_sales" },
        { label: "จำหน่ายต่างประเทศ", field: "overseas_sales" },
        { label: "ใช้ในโรงอุตสาหกรรม", field: "used_in_industrial_plans" },
        { label: "คลังสินค้าทัณฑ์บน", field: "bonded" },
        { label: "เสียหาย", field: "defected" },
        { label: "คงเหลือยกไป", field: "forward" },
        // { label: "อื่น ๆ", field: "etc_used" },
    ];

    const validMaterialNames = [6, 7, 8, 9, 10, 11]
        .map(colIdx => ({
            name: table1[0]?.properties?.[`column_${colIdx}`]?.value,
            colIdx
        }))
        .filter(({ name }) => name && !isBracketPattern(name));

    const validProductNames = Array.from({ length: 13 }, (_, i) => i + 2)
        .map(colIdx => ({
            name: table2[0]?.properties?.[`column_${colIdx}`]?.value,
            colIdx
        }))
        .filter(({ name }) => name && !isBracketPattern(name));

    return (
        <div className="d-flex flex-column gap-3">
            {fieldsToDisplay.map(({ key, label, value }) =>
                renderBox(label, value, validationResult?.data?.[key]?.passed)
            )}

            <hr className="border-top border-2 border-secondary my-2" />
            <div className="fw-bold">1. ข้อมูลวัตถุดิบ</div>
            {validMaterialNames.map(({ name, colIdx }) => {
                const validateObj = validationResult?.data?.materials?.find(
                    (m: { material_name: string }) =>
                        normalize(m.material_name) === normalize(name)
                );
                return tableMap1.map(({ label, field }, rowIdx) => {
                    const val = field === "material_name"
                        ? name
                        : table1[rowIdx]?.properties?.[`column_${colIdx}`]?.value;
                    const passed = validateObj?.[field]?.passed;
                    return renderBox(label, val, passed);
                });
            })}

            <hr className="border-top border-2 border-secondary my-2" />
            <div className="fw-bold">2. งบการผลิต</div>
            {validProductNames.map(({ name, colIdx }) => {
                const validateObj = validationResult?.data?.products?.find(
                    (p: { product_name: string }) =>
                        normalize(p.product_name) === normalize(name)
                );
                return tableMap2.map(({ label, field }, rowIdx) => {
                    const val = field === "product_name"
                        ? name
                        : table2[rowIdx]?.properties?.[`column_${colIdx}`]?.value;
                    const passed = validateObj?.[field]?.passed;
                    return renderBox(label, val, passed);
                });
            })}
        </div>
    );
};

export default ChecklistAttachment0704;
