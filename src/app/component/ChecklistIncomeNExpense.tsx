import React, { useEffect, useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { getPreparedReceitpPaymentNew, validateReceitpPaymentNew } from "../../utils/api/validateApi";
import { OcrIncomeNExpenseDocument } from "../../types/ocrFileType";
import { useCompanyStore } from "../../store/companyStore";
import { AuthSchema } from "../../types/schema/auth";
import { OcrReceiptPaymentPreparedData } from "../../types/preparedTypes";
import { ReceiptPaymentValidateResult } from "../../types/validateResTypes";
import ShellIncomeNExpense from "./ShellIncomeNExpense";
import DefaultIncomeNExpense from "./IncomeNExpense";

interface Props {
    data: OcrIncomeNExpenseDocument; 
}

const ChecklistIncomeNExpense: React.FC<Props> = ({ data }) => {
    const auth = useAuthUser<AuthSchema>();
    const { selectedCompany } = useCompanyStore();
    const [ocrData, setOcrData] = useState<OcrReceiptPaymentPreparedData | null>(null);
    const [loading, setLoading] = useState(true);
    const [validateResult, setValidateResult] = useState<any>(null);

    useEffect(() => {
        if (!auth || !data.id) return;
        setLoading(true);
        getPreparedReceitpPaymentNew(data.id, auth)
            .then(res => setOcrData(res.data))
            .catch(() => setOcrData(null))
            .finally(() => setLoading(false));
    }, [data.id, auth]);

    useEffect(() => {
        if (!ocrData) return;
        validateReceitpPaymentNew(ocrData)
            .then(res => setValidateResult(res.data))
            .catch(() => setValidateResult(null));
    }, [ocrData]);

    if (loading) return <div>กำลังรอข้อมูล...</div>;
    if (!ocrData || !validateResult) return <div className="text-muted">ไม่พบข้อมูล</div>;

    // เลือก component ตามบริษัท
    if (selectedCompany?.name === "SHELL") {
        return <ShellIncomeNExpense validateResult={validateResult} />;
    }
    return <DefaultIncomeNExpense validateResult={validateResult as ReceiptPaymentValidateResult} />;
};

export default ChecklistIncomeNExpense;
