import React, { useEffect } from "react";
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
    onMaterialIdChange?: (id: number | undefined) => void;
}

const ChecklistIncomeNExpense: React.FC<Props> = ({ validateResult, context, onMaterialIdChange }) => {
    const { selectedCompany } = useCompanyStore();
    const lastMaterialId = React.useRef<number | undefined>(undefined);

    useEffect(() => {
        if (context?.fields?.materialId !== undefined && context.fields.materialId !== lastMaterialId.current) {
            lastMaterialId.current = context.fields.materialId;
            onMaterialIdChange?.(context.fields.materialId);
        }
    }, [context, onMaterialIdChange]);

    const ocrData = context;
    if (!ocrData) return <div className="text-muted">ไม่พบข้อมูล</div>;

    if (selectedCompany?.name === "SHELL") {
        return <ShellIncomeNExpense validateResult={validateResult} />;
    }
    return <DefaultIncomeNExpense validateResult={validateResult as ReceiptPaymentValidateResult} />;
};

export default ChecklistIncomeNExpense;
