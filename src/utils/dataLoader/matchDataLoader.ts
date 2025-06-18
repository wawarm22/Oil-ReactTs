
import { ProductFormula, RawMaterialPaymentItem } from "../../types/reportTypes";
import { getProductRatiosAndFormular, getRawMaterialPayments } from "../api/apiReport";

export type MatchStepData =
    | { step: 1; data: ProductFormula[] | null }
    | { step: 2; data: RawMaterialPaymentItem[] | null }
    | { step: 3; data: any | null }
    | { step: 4; data: any | null }
    | { step: 5; data: any | null };

export const loadMatchStepData = async (step: number): Promise<MatchStepData> => {
    switch (step) {
        case 1: {
            const res = await getProductRatiosAndFormular();
            return { step, data: res?.data || null };
        }
        case 2: {
            const res = await getRawMaterialPayments();
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
