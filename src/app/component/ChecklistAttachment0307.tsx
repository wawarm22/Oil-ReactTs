import React, { useEffect, useState } from "react";
import { OcrAttachment0307Document } from "../../types/ocrFileType";
import { cleanCellValue, renderLabel } from "../../utils/function/ocrUtils";
import { getPrepared0307, validateAttachment0307 } from "../../utils/api/validateApi";
import { useCompanyStore } from "../../store/companyStore";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { AuthSchema } from "../../types/schema/auth";
import { PreparedTaxData, validateAttachment0307Payload } from "../../types/validateTypes";
import { ValidationResult0307 } from "../../types/validateResTypes";
import { DailyDetailSection } from "./DailyDetailSection";
import { TaxSummarySection } from "./TaxSummarySection";

interface Props {
    data: OcrAttachment0307Document;
}

type TaxSummaryFieldKey = "raw_tax" | "discount_105";
type TaxSummaryTotalTaxKey = "paid" | "retrived";

const taxMap = [
    { key: "excise_tax", label: "ภาษีสรรพสามิต" },
    { key: "interior_tax", label: "ภาษีมหาดไทย" },
    { key: "total_tax", label: "รวมทั้งสิน" },
];

const taxSubFields: Array<{ key: TaxSummaryFieldKey | TaxSummaryTotalTaxKey; label: string }> = [
    { key: "raw_tax", label: "ภาษีสรรพสามิต" },
    { key: "discount_105", label: "ค่าลดหย่อน มาตรา 105" },
    { key: "paid", label: "นำส่ง" },
    { key: "retrived", label: "ขอคืน" },
];

const buildDetailFields = (row: any, _idx: number) => {
    if (row.date === "รวม") {
        return [
            { label: "รวม" },
            { label: "เนื้อน้ำมัน (ลิตร)", value: row.materials[0]?.quantity, key: "material_0" },
            { label: "ไบโอดีเชล", value: row.materials[1]?.quantity, key: "material_1" },
            { label: "สารเติมแต่ง", value: row.materials[2]?.quantity, key: "material_2" },
        ];
    } else {
        return [
            { label: "วันที่", value: row.date, key: "date" },
            { label: "เนื้อน้ำมัน (ลิตร)", value: row.materials[0]?.quantity, key: "material_0" },
            { label: "ไบโอดีเชล", value: row.materials[1]?.quantity, key: "material_1" },
            { label: "สารเติมแต่ง", value: row.materials[2]?.quantity, key: "material_2" },
            { label: "ปริมาณรวมสารเติมแต่ง", value: row.total, key: "total" },
            { label: "อัตราภาษีสรรสามิต", value: row.tax_rate, key: "tax_rate" },
            { label: "อัตราภาษีหักลดหย่อน", value: row.tax_discount_rate, key: "tax_discount_rate" },
            { label: "ภาษีสรรพสามิต", value: row.raw_tax, key: "raw_tax" },
            { label: "ค่าลดหย่อน มาตรา 105", value: row.discount_105, key: "discount_105" },
            { label: "นำส่ง", value: row.total_tax?.paid, key: "paid" },
            { label: "ขอคืน", value: row.total_tax?.retrived, key: "retrived" },
        ];
    }
};

const ChecklistAttachment0307: React.FC<Props> = ({ data }) => {
    const auth = useAuthUser<AuthSchema>();
    const { selectedCompany } = useCompanyStore();
    const factoriesNumber = localStorage.getItem("warehouse") ?? "";
    const [preparedData, setPreparedData] = useState<PreparedTaxData | null>(null);
    const [validationResult, setValidationResult] = useState<ValidationResult0307 | null>(null);

    useEffect(() => {
        if (data.id && auth) {
            getPrepared0307(data.id, auth).then((res) => {
                if (res && res.data) {
                    setPreparedData(res.data);
                } else {
                    setPreparedData(null);
                }
            });
        }
    }, [data.id, auth]);

    useEffect(() => {
        if (
            preparedData &&
            selectedCompany &&
            data.documentGroup
        ) {
            const payload: validateAttachment0307Payload = {
                docType: data.docType,
                company: selectedCompany.name,
                factories: factoriesNumber,
                documentGroup: data.documentGroup,
                fields: preparedData
            };
            validateAttachment0307(payload).then((res) => {
                setValidationResult(res?.data ?? null);
            });
        }
    }, [preparedData, selectedCompany, data]);

    return (
        <div className="d-flex flex-column gap-2">
            {/* Header */}
            <div>
                {renderLabel("เอกสาร")}
                <div
                    className="rounded-2 shadow-sm bg-white p-2"
                    style={{
                        border: `1.5px solid ${validationResult?.header?.passed === true ? "#22C659" : validationResult?.header?.passed === false ? "#FF0100" : "#22C659"}`
                    }}
                >
                    {preparedData?.header}
                </div>
            </div>
            <div>
                {renderLabel("วันที่")}
                <div
                    className="rounded-2 shadow-sm bg-white p-2"
                    style={{
                        border: `1.5px solid ${validationResult?.from_date?.passed === true ? "#22C659" : validationResult?.from_date?.passed === false ? "#FF0100" : "#22C659"}`
                    }}
                >
                    {cleanCellValue(preparedData?.from_date)} - {cleanCellValue(preparedData?.to_date)}
                </div>
            </div>
            <div>
                {renderLabel("น้ำมัน")}
                <div
                    className="rounded-2 shadow-sm bg-white p-2"
                    style={{
                        border: `1.5px solid ${validationResult?.product_name?.passed === true ? "#22C659" : validationResult?.product_name?.passed === false ? "#FF0100" : "#22C659"}`
                    }}
                >
                    {preparedData?.product_name}
                </div>
            </div>

            {preparedData && preparedData.details && preparedData.details.length > 0 && (
                <div className="mt-3">
                    {preparedData.details.map((row, idx) => (
                        <DailyDetailSection
                            key={idx}
                            row={row}
                            idx={idx}
                            detailValidation={validationResult?.details?.[idx]}
                            buildDetailFields={buildDetailFields}
                        />
                    ))}
                </div>
            )}

            {preparedData?.taxes && (
                <div className="m-0">
                    {taxMap.map((taxType) => (
                        <TaxSummarySection
                            key={taxType.key}
                            taxKey={taxType.key as keyof PreparedTaxData["taxes"]}
                            taxLabel={taxType.label}
                            taxes={preparedData.taxes}
                            validationResult={validationResult?.taxes}
                            taxSubFields={taxSubFields}
                        />
                    ))}
                </div>
            )}

            <hr className="border-top border-2 border-secondary my-1" />
            <div className="m-0">
                {renderLabel("ลงชื่อ ผู้ประกอบอุตสาหกรรม")}
                <div className="rounded-2 shadow-sm bg-white p-2" style={{border: '1.5px solid #22C659'}}>
                    {cleanCellValue(data.name)}
                </div>
            </div>
            <div>
                {renderLabel("ตำแหน่ง")}
                <div className="rounded-2 shadow-sm bg-white p-2" style={{border: '1.5px solid #22C659'}}>
                    {cleanCellValue(data.position)}
                </div>
            </div>
        </div>
    );
};

export default ChecklistAttachment0307;
