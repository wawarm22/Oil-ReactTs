import { ValidationResponse } from "../../types/validateTypes";

export type CleanedFieldRow = {
    properties: {
        [key: string]: { value: string };
    };
};

export const buildValidationMap = (
    validationResult: ValidationResponse["data"],
    cleanedData: CleanedFieldRow[]
): Record<string, boolean> => {
    const validationMap: Record<string, boolean> = {};
    let fieldPointer = 0;

    for (const productGroup of validationResult) {
        for (const validation of productGroup.validations) {
            const { type, passed } = validation;

            if (type === "ปริมาณรวม" || type === "เปอร์เซ็นต์รวม") {
                const targetColumn = type === "ปริมาณรวม" ? "column_3" : "column_4";

                const targetIndex = cleanedData.findIndex(
                    (row) => row.properties?.column_2?.value.trim() === "ปริมาณรวม"
                );

                if (targetIndex !== -1) {
                    validationMap[`${targetIndex}-${targetColumn}`] = passed;
                }
            } else {
                // ข้าม field ที่ไม่มี column_4 (ระวัง null/undefined)
                while (
                    fieldPointer < cleanedData.length &&
                    !cleanedData[fieldPointer]?.properties?.column_4?.value
                ) {
                    fieldPointer++;
                }

                if (fieldPointer < cleanedData.length) {
                    validationMap[`${fieldPointer}-column_4`] = passed;
                    fieldPointer++;
                }
            }
        }
    }

    return validationMap;
};

