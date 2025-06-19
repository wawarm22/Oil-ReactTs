import React from "react";
import { OcrIncomeNExpenseDocument } from "../../types/ocrFileType";
import { useCompanyStore } from "../../store/companyStore";
import { OcrReceiptPaymentPreparedData } from "../../types/preparedTypes";
import { ReceiptPaymentValidateResult } from "../../types/validateResTypes";
import ShellIncomeNExpense from "./ShellIncomeNExpense";
import DefaultIncomeNExpense from "./IncomeNExpense";

interface Props {
    data: OcrIncomeNExpenseDocument;
    validateResult: any;
    context: OcrReceiptPaymentPreparedData | null;
}

const ChecklistIncomeNExpense: React.FC<Props> = ({ validateResult, context }) => {
    const { selectedCompany } = useCompanyStore();    
    const ocrData = context;
    if (!ocrData) return <div className="text-muted">ไม่พบข้อมูล</div>;

    // เลือก component ตามบริษัท
    if (selectedCompany?.name === "SHELL") {
        return <ShellIncomeNExpense validateResult={validateResult} />;
    }
    return <DefaultIncomeNExpense validateResult={validateResult as ReceiptPaymentValidateResult} />;
};

export default ChecklistIncomeNExpense;
