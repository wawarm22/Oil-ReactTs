import { ValidationDetail } from "../../types/validateResTypes";

export const getPassedColor = (passed?: boolean) =>
    passed === true ? "#22C659" : passed === false ? "#FF0100" : "#dee2e6";

export const safePassedColor = (detailValidation: ValidationDetail, itemKey: string) => {
    if (!detailValidation) return "#dee2e6";
    if (itemKey.startsWith("material_")) {
        const matIdx = parseInt(itemKey.split("_")[1]);
        return getPassedColor(detailValidation.materials?.[matIdx]?.quantity?.passed);
    }
    if (itemKey === "paid") {
        return getPassedColor(detailValidation.total_tax?.paid?.passed);
    }
    if (itemKey === "retrived") {
        return getPassedColor(detailValidation.total_tax?.retrived?.passed);
    }
    // สำหรับ field อื่นๆ ที่อยู่ใน ValidationDetail (ยกเว้น materials/total_tax)
    if (
        [
            "date",
            "total",
            "tax_rate",
            "tax_discount_rate",
            "raw_tax",
            "discount_105"
        ].includes(itemKey)
    ) {
        return getPassedColor(
            detailValidation[itemKey as keyof Omit<ValidationDetail, "materials" | "total_tax">]?.passed
        );
    }
    return "#dee2e6";
};

