export const formatNumber = (value: any) =>
    typeof value === "number"
        ? value.toLocaleString()
        : !isNaN(Number(value)) && value !== "" && value !== null
            ? Number(value).toLocaleString()
            : value;
