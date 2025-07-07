
import { OilUseInProductItem, ProductFormula, RawMaterialPaymentItem } from "../../types/reportTypes";
import { AuthSchema } from "../../types/schema/auth";
import { getOilUseInProducts, getProductRatiosAndFormular, getRawMaterialPayments } from "../api/apiReport";
import { ReportParamProps } from "../function/buildParam";

export type MatchStepData =
    | { step: 1; data: ProductFormula[] | null }
    | { step: 2; data: RawMaterialPaymentItem[] | null }
    | { step: 3; data: OilUseInProductItem[] | null }
    | { step: 4; data: any | null }
    | { step: 5; data: any | null };

export const loadMatchStepData = async (
    step: number,
    params: ReportParamProps,
    auth: AuthSchema
): Promise<MatchStepData> => {
    switch (step) {
        case 1: {
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
            if (params.material_id === undefined) {
                throw new Error("material_id is required for getOilUseInProducts");
            }
            const { factory_slug, company_id, month, year, material_id } = params;
            const res = await getOilUseInProducts({ factory_slug, company_id, month, year, material_id }, auth);
            return { step, data: res?.data || null };
        }
        case 5: {
            return { step, data: null };
        }
        default:
            throw new Error(`Unhandled step number: ${step}`);
    }
};
