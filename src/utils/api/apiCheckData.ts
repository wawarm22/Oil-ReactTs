import axios from "axios";
import { CheckProductTypeResponse } from "../../types/checkData";

export const checkProdustType = async (QueryText: string): Promise<CheckProductTypeResponse | undefined> => {
    try {
        const response = await axios.post<CheckProductTypeResponse>(
            "https://iddqipn8l2.execute-api.us-east-1.amazonaws.com/oil-stage/parseKendraResults",
            {
                IndexId: "86d820ac-1b5a-492f-9a2c-6ceec8b885a8",
                QueryText,
            },
            {
                headers: { "Content-Type": "application/json" },
            }
        );

        return response.data;
    } catch (error) {
        console.error("An error occurred during product type check", error);
        return undefined;
    }
};
