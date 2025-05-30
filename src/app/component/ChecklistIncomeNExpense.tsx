import React, { useEffect, useState } from "react";
import { OcrIncomeNExpenseDocument } from "../../types/ocrFileType";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { AuthSchema } from "../../types/schema/auth";
import { getPreparedReceitpPayment, validateReceitpPayment } from "../../utils/api/validateApi";
import { PreparedData } from "../../types/preparedTypes";
import { validateReceitpPaymentPayload } from "../../types/validateTypes";
import { ValidationHeader, ValidationResultData } from "../../types/validateResTypes";
import SectionRenderer from "./SectionRenderer";
import EndOfMonthRenderer from "./EndOfMonthRenderer";
import { getBorderColor } from "../../utils/function/getBorderColor";

interface Props {
    data: OcrIncomeNExpenseDocument;
}
const sectionMap = [
    {
        title: "ยอดคงเหลือยกมา",
        type: "openingBalance",
        columns: [
            { key: "receivedDate", label: "วันที่รับ" },
            { key: "sourceDepot", label: "โรงกลั่น / คลังต้นทาง" },
            { key: "invoiceNo", label: "เลขที่ใบกำกับภาษี" },
            { key: "quantity", label: "ปริมาณ" },
            { key: "invoiceBalance", label: "ยอดคงเหลือตามใบกำกับภาษี" },
            { key: "totalBalance", label: "ยอดคงเหลือรวม" },
        ],
    },
    {
        title: "การรับ",
        type: "receipt",
        columns: [
            { key: "receivedDate", label: "วันที่รับ" },
            { key: "sourceDepot", label: "โรงกลั่น / คลังต้นทาง" },
            { key: "invoiceNo", label: "เลขที่ใบกำกับภาษี" },
            { key: "quantity", label: "ปริมาณ" },
            { key: "invoiceBalance", label: "ยอดคงเหลือตามใบกำกับภาษี" },
            { key: "totalBalance", label: "ยอดคงเหลือรวม" },
        ],
    },
    {
        title: "การจ่าย",
        type: "disbursement",
        columns: [
            { key: "paidDate", label: "วันที่จ่าย" },
            { key: "localSale.quantity", label: "จ่ายขายในประเทศ (ปริมาณ)" },
            { key: "localSale.invoiceNo", label: "เลขที่ใบกำกับภาษี (ขายในประเทศ)" },
            { key: "transfer", label: "โอนคลัง" },
            { key: "invoiceBalance", label: "ยอดคงเหลือตามใบกำกับภาษี" },
            { key: "totalBalance", label: "ยอดคงเหลือรวม" },
        ],
    },
];

const ChecklistIncomeNExpense: React.FC<Props> = ({ data }) => {
    const auth = useAuthUser<AuthSchema>();
    const [preparedData, setPreparedData] = useState<PreparedData | null>(null);
    const [validationResult, setValidationResult] = useState<ValidationResultData | null>(null);

    useEffect(() => {
        if (data.id && auth) {
            getPreparedReceitpPayment(data.id, auth).then((res) => {
                if (res && res.data) {
                    setPreparedData(res.data);

                    const payload: validateReceitpPaymentPayload = {
                        docType: data.docType,
                        documentGroup: res.data.documentGroup,
                        fields: res.data.fields,
                    };
                    validateReceitpPayment(payload).then(result => {
                        setValidationResult(result.data);
                    });
                } else {
                    setPreparedData(null);
                    setValidationResult(null);
                }
            });
        }
    }, [data.id, auth]);

    if (!preparedData) return <div>กำลังโหลดข้อมูล...</div>;

    const fields = preparedData.fields;
    const header = [
        { key: "productName", label: "บัญชีรับ-จ่ายน้ำมันที่นำมาใช้เป็นวัตถุดิบในการผลิต", value: fields.header.productName },
        { key: "factories", label: "ผู้ประกอบการอุตสาหกรรม", value: fields.header.factories },
        { key: "period", label: "ประจำเดือน/ปี", value: fields.header.period },
    ];
    const headerValidation = validationResult?.header;

    return (
        <div className="d-flex flex-column gap-2">
            {header.map(({ key, label, value }, idx) => {
                const headerValid = headerValidation?.[key as keyof ValidationHeader];

                return value ? (
                    <div key={idx} className="mb-1">
                        <div className="fw-bold">{label}</div>
                        <div
                            style={{
                                fontSize: "14px",
                                border: getBorderColor(headerValid),
                                borderRadius: "0.375rem",
                                boxShadow: "0 .5rem 1rem rgba(33,37,41,.03)",
                                background: "#fff",
                                padding: "0.5rem 1rem"
                            }}
                        >
                            {value || ""}
                        </div>
                    </div>
                ) : null;
            })}

            {sectionMap.map(section => {
                const validateSection: any[] | undefined =
                    validationResult && validationResult[section.type as keyof ValidationResultData]
                        ? (validationResult[section.type as keyof ValidationResultData] as any[])
                        : undefined;
                return (
                    <SectionRenderer
                        key={section.type}
                        section={section}
                        rows={fields[section.type as keyof typeof fields] as any[]}
                        validationRows={validateSection}
                    />
                );
            })}

            {fields.endOfMonth && (
                <EndOfMonthRenderer endOfMonth={fields.endOfMonth} validation={validationResult?.endOfMonth} />
            )}
        </div>
    );
};

export default ChecklistIncomeNExpense;
