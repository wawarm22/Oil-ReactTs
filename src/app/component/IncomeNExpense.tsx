import React from "react";
import { borderColor } from "../../utils/function/getBorderColor";
import { ReceiptPaymentValidateResult } from "../../types/validateResTypes";

const DefaultIncomeNExpense: React.FC<{ validateResult: ReceiptPaymentValidateResult }> = ({ validateResult }) => {
    const { materialName, factoryName, period, transactions = [] } = validateResult;

    const header = [
        { label: "บัญชีรับ-จ่ายน้ำมันที่นำมาใช้เป็นวัตถุดิบในการผลิต", value: materialName.value, passed: materialName.passed },
        { label: "คลัง", value: factoryName.value, passed: factoryName.passed },
        { label: "ประจำเดือน/ปี", value: period.value, passed: period.passed },
    ];

    const typeMap: {
        [key: string]: {
            label: string;
            fields: Array<{ key: keyof (typeof transactions)[number], label: string }>;
        };
    } = {
        isRecieptFromOtherMonth: {
            label: "ยอดคงเหลือยกมา",
            fields: [
                { key: "date", label: "วันที่" },
                { key: "recieptFromFactoryLabel", label: "โรงกลั่น/คลังต้นทาง" },
                { key: "recieptInvoice", label: "เลขที่ใบกำกับภาษี" },
                { key: "recieptQuantity", label: "ปริมาณ" },
                { key: "totalInvoiceQuantity", label: "ยอดคงเหลือตามใบกำกับภาษี" },
                { key: "totalQuantity", label: "ยอดคงเหลือรวม" },
            ]
        },
        isReciept: {
            label: "การรับ",
            fields: [
                { key: "date", label: "วันที่" },
                { key: "recieptFromFactoryLabel", label: "โรงกลั่น/คลังต้นทาง" },
                { key: "recieptInvoice", label: "เลขที่ใบกำกับภาษี" },
                { key: "recieptQuantity", label: "ปริมาณ" },
                { key: "totalInvoiceQuantity", label: "ยอดคงเหลือตามใบกำกับภาษี" },
                { key: "totalQuantity", label: "ยอดคงเหลือรวม" },
            ]
        },
        isConsume: {
            label: "การจ่าย",
            fields: [
                { key: "date", label: "วันที่" },
                { key: "consumeQuantity", label: "ปริมาณ" },
                { key: "consumeInvoice", label: "เลขที่ใบจ่าย" },
                { key: "totalInvoiceQuantity", label: "ยอดคงเหลือตามใบกำกับภาษี" },
                { key: "totalQuantity", label: "ยอดคงเหลือรวม" },
            ]
        },
    };

    const getTransactionType = (row: typeof transactions[number]) => {
        return Object.keys(typeMap).find(type => (row as any)[type] === true);
    };

    function getValueAndPassed(val: any): { value: string | number, passed?: boolean } {
        if (val && typeof val === "object" && "value" in val && "passed" in val) {
            return { value: val.value, passed: val.passed };
        }
        return { value: val };
    }

    return (
        <div className="d-flex flex-column gap-2">
            {/* Header */}
            {header.map(({ label, value, passed }) => (
                <div key={label} className="mb-1">
                    <div className="fw-bold">{label}</div>
                    <div
                        style={{
                            fontSize: "14px",
                            border: borderColor(passed),
                            borderRadius: "0.375rem",
                            boxShadow: "0 .5rem 1rem rgba(33,37,41,.03)",
                            background: "#fff",
                            minHeight: "42px",
                            padding: "0.5rem 1rem"
                        }}
                    >
                        {value ?? "-"}
                    </div>
                </div>
            ))}

            <hr className="m-0" />
            {/* Transaction blocks */}
            {transactions.map((row, idx) => {
                const type = getTransactionType(row);
                if (!type || !typeMap[type]) return null;

                return (
                    <div key={idx} className="mb-1">
                        <div className="fw-bold mb-2" style={{ fontSize: "16px" }}>
                            {typeMap[type].label}
                        </div>
                        {typeMap[type].fields.map(({ key, label }) => {
                            const raw = (row as any)[key];
                            if (
                                raw === undefined ||
                                raw === null ||
                                raw === "" ||
                                raw === false
                            ) {
                                return null;
                            }
                            const { value, passed } = getValueAndPassed(raw);
                            let showValue: React.ReactNode = value;
                            if (typeof value === "number") {
                                showValue = value.toLocaleString();
                            }
                            return (
                                <div key={String(key)} className="mb-2">
                                    <div className="fw-bold">{label}</div>
                                    <div
                                        style={{
                                            fontSize: "14px",
                                            border: borderColor(passed),
                                            borderRadius: "0.375rem",
                                            background: "#fff",
                                            padding: "0.5rem 1rem",
                                            minHeight: "42px",
                                        }}
                                    >
                                        {showValue}
                                    </div>
                                </div>
                            );
                        })}
                        <hr className="m-0 mt-3" />
                    </div>
                );
            })}
        </div>
    );
};

export default DefaultIncomeNExpense;
