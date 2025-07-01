
import { ProductFormula, RawMaterialPaymentItem } from "../../types/reportTypes";
import { AuthSchema } from "../../types/schema/auth";
import { getProductRatiosAndFormular, getRawMaterialPayments } from "../api/apiReport";
import { ReportParamProps } from "../function/buildParam";

export type MatchStepData =
    | { step: 1; data: ProductFormula[] | null }
    | { step: 2; data: RawMaterialPaymentItem[] | null }
    | { step: 3; data: any | null }
    | { step: 4; data: any | null }
    | { step: 5; data: any | null };

export const loadMatchStepData = async (
    step: number,
    params: ReportParamProps,
    auth: AuthSchema
): Promise<MatchStepData> => {
    switch (step) {
        case 1: {
            console.log("params", params);
            
            const res = await getProductRatiosAndFormular(params, auth);
            return { step, data: res?.data || null };
        }
        case 2: {
            const res = await getRawMaterialPayments(params, auth);
            return { step, data: res?.data || null };
        }
        case 3: {

            return { step, data: null };
        }
        case 4: {
            //   const res = await fetchOilReceive();
            return { step, data: null };
        }
        case 5: {
            //   const res = await fetchTaxRefund();
            return { step, data: null };
        }
        default:
            throw new Error(`Unhandled step number: ${step}`);
    }
};
