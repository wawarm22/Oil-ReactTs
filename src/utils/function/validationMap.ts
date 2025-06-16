// utils/function/buildValidationMap.ts

import { OilCompareProductValidation, OilCompareRowValidation } from "../../types/validateTypes";

export type ValidationStatus = "passed" | "failed" | "warning";

export const buildValidationMap = (
  productValidations: OilCompareProductValidation[],
  cleanedRows: Array<{ properties: Record<string, { value: string }> }>
): Record<string, ValidationStatus> => {
  const validationMap: Record<string, ValidationStatus> = {};

  let currentProduct = "";
  let currentProductValidation: OilCompareProductValidation | undefined = undefined;

  cleanedRows.forEach((row, rowIdx) => {
    const thisProduct = row.properties.column_1?.value?.trim() || currentProduct;
    if (thisProduct !== currentProduct && thisProduct) {
      currentProductValidation = productValidations.find(pv => pv.product === thisProduct);
      currentProduct = thisProduct;
    }

    Object.keys(row.properties).forEach(colKey => {
      if (!currentProductValidation) return;

      const validations = currentProductValidation.validations.filter(v => v.field === colKey);

      if (validations.length > 0) {
        const v: OilCompareRowValidation = validations[0];
        let status: ValidationStatus;
        if (typeof v.status === "string" && ["passed", "failed", "warning"].includes(v.status)) {
          status = v.status as ValidationStatus;
        } else {
          status = v.passed ? "passed" : "failed";
        }
        validationMap[`${rowIdx}-${colKey}`] = status;
      }
    });
  });

  return validationMap;
};
