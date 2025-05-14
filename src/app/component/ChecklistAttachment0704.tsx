import React, { useEffect, useMemo, useState } from "react";
import { OcrAttachment0704Document } from "../../types/ocrFileType";
import { validateOil0701 } from "../../utils/api/validateApi";
import { useCompanyStore } from "../../store/companyStore";
import { genRequestObject } from "../../utils/function/checklist/attachment0704";

interface Props {
    data: OcrAttachment0704Document;
}

const ChecklistAttachment0704: React.FC<Props> = ({ data }) => {
    const { selectedCompany } = useCompanyStore();
    const factoriesNumber = localStorage.getItem("warehouse") ?? null;
    const [_validationResult, setValidationResult] = useState<any>(null);

    const cleanValue = (val?: string | { value: string } | null): string => {
        const raw = typeof val === "object" ? val?.value : val;
        if (!raw || raw.trim() === "" || raw === ":unselected:") return "-";
        return raw.trim();
    };

    const fields = [
        { label: "แบบฟอร์ม", value: data.form_type },
        { label: "เลขที่รับ", value: data.form_no },
        { label: "วัน เดือน ปี ที่รับ", value: data.form_date },
        { label: "เจ้าพนักงานผู้รับ", value: data.form_officer_1 },
        { label: "ชื่อโรงอุตสาหกรรม (คลัง)", value: data.company_name },
        { label: "ทะเบียนสรรพสามิตเลขที่", value: data.excise_id },
        { label: "ประจำเดือน ปี", value: data.date },
    ];

    const table1 = data.detail_table_1 ?? [];
    const table2 = data.detail_table_2 ?? [];

    const tableMap1 = [
        { label: "รายการ/วัตถุดิบ (หน่วย)", index: 0 },
        { label: "คงเหลือยกมา", index: 1 },
        { label: "รับเดือนนี้", index: 2 },
        { label: "รวม", index: 3 },
        { label: "ผลิตสินค้าตามพิกัด ฯ", index: 4 },
        { label: "ผลิตสินค้าอื่น", index: 5 },
        { label: "เสียหาย", index: 6 },
        { label: "อื่น ๆ (จ่ายโอนคลัง)", index: 7 },
        { label: "ยอดคงเหลือตามบัญชี", index: 8 },
        { label: "คงเหลือยกไป", index: 9 },
    ];

    const tableMap2 = [
        { label: "รายการ/ประเภทสินค้า ชนิด ตราหรือเครื่องหมาย/แบบ/รุ่น/ดีกรี/ความหวาน ขนาด (หน่วย)", index: 0 },
        { label: "คงเหลือยกมา", index: 1 },
        { label: "รับจากการผลิต", index: 2 },
        { label: "รับคืนจากคลังสินค้าทัณฑ์บน", index: 3 },
        { label: "อื่น ๆ", index: 4 },
        { label: "รวม", index: 5 },
        { label: "จำหน่ายในประเทศ", index: 6 },
        { label: "จำหน่ายต่างประเทศ", index: 7 },
        { label: "ใช้ในโรงอุตสาหกรรม", index: 8 },
        { label: "คลังสินค้าทัณฑ์บน", index: 9 },
        { label: "เสียหาย", index: 10 },
        { label: "คงเหลือยกไป", index: 11 },
        { label: "อื่น ๆ", index: 12 },
    ];

    // const ocrFieldRows = useMemo(() => {
    //     const rows: any[] = [];

    //     const headerProps: Record<string, { value: string }> = {};
    //     fields.forEach(({ label, value }) => {
    //         headerProps[label] = { value: cleanValue(value) };
    //     });
    //     rows.push({ properties: headerProps });

    //     const detailTable1Rows = [6, 7, 8, 9].map((col) => {
    //         const props: Record<string, { value: string }> = {};

    //         tableMap1.forEach(({ label, index }) => {
    //             const rawValue = table1[index]?.properties?.[`column_${col}`]?.value;
    //             props[label] = { value: cleanValue(rawValue) };
    //         });

    //         return { properties: props };
    //     });

    //     rows.push({ detail_table_1: detailTable1Rows });

    //     const detailTable2Props: Record<string, { value: string }> = {};
    //     tableMap2.forEach(({ label, index }) => {
    //         const value = table2[index]?.properties?.column_9?.value;
    //         detailTable2Props[label] = { value: cleanValue(value) };
    //     });

    //     rows.push({ detail_table_2: { properties: detailTable2Props } });

    //     return rows;
    // }, [data]);

    // useEffect(() => {
    //     if (ocrFieldRows.length > 0 && selectedCompany) {
    //         const payload = {
    //             docType: "oil-07-04-page-1",
    //             company: selectedCompany.name,
    //             factories: factoriesNumber,
    //             fields: ocrFieldRows
    //         };
    //         validateOil0701(payload).then((res) => {
    //             console.log("ผลลัพธ์ Validate:", res);
    //             setValidationResult(res);
    //         });
    //     }
    // }, [ocrFieldRows, selectedCompany]);

    useEffect(() => {
        if (data && selectedCompany) { 

            
            console.log("data", data);
            
            genRequestObject({ fields: data })
                .then(payload => {
                    payload.company_name = selectedCompany.name;
                    payload.form_officer_name = factoriesNumber;  

                    console.log("payload", payload);
                    
                    // validateOil0701(payload).then((res) => {
                    //     console.log("ผลลัพธ์ Validate:", res);
                    //     setValidationResult(res);
                    // });
                })
                .catch(err => console.error("Error generating payload:", err));
        }
    }, [data, selectedCompany]);

    return (
        <div className="d-flex flex-column gap-3">
            {fields.map(({ label, value }) => (
                <div key={label}>
                    <div className="fw-bold">{label}</div>
                    <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
                        {cleanValue(value)}
                    </div>
                </div>
            ))}

            <hr className="border-top border-2 border-secondary my-2" />
            <div className="fw-bold">๑. ข้อมูลวัตถุดิบ</div>
            {tableMap1.map(({ label, index }) => {
                const value = table1[index]?.properties?.column_6?.value;
                return (
                    <div key={label}>
                        <div className="fw-bold">{label}</div>
                        <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
                            {cleanValue(value)}
                        </div>
                    </div>
                );
            })}
            <hr className="border-top border-2 border-secondary my-2" />
            {tableMap1.map(({ label, index }) => {
                const value = table1[index]?.properties?.column_7?.value;
                return (
                    <div key={label}>
                        <div className="fw-bold">{label}</div>
                        <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
                            {cleanValue(value)}
                        </div>
                    </div>
                );
            })}
            <hr className="border-top border-2 border-secondary my-2" />
            {tableMap1.map(({ label, index }) => {
                const value = table1[index]?.properties?.column_8?.value;
                return (
                    <div key={label}>
                        <div className="fw-bold">{label}</div>
                        <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
                            {cleanValue(value)}
                        </div>
                    </div>
                );
            })}
            <hr className="border-top border-2 border-secondary my-2" />
            {tableMap1.map(({ label, index }) => {
                const value = table1[index]?.properties?.column_9?.value;
                return (
                    <div key={label}>
                        <div className="fw-bold">{label}</div>
                        <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
                            {cleanValue(value)}
                        </div>
                    </div>
                );
            })}

            <hr className="border-top border-2 border-secondary my-2" />
            <div className="fw-bold">๒. งบการผลิต</div>
            {tableMap2.map(({ label, index }) => {
                const value = table2[index]?.properties?.column_9?.value;
                return (
                    <div key={label}>
                        <div className="fw-bold">{label}</div>
                        <div className="border rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px" }}>
                            {cleanValue(value)}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ChecklistAttachment0704;
