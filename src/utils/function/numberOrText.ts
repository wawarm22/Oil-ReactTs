export const numberOrText = (val: any) => {
    if (val === null || val === undefined) return "";
    if (typeof val === "number" && !isNaN(val)) {
        return val.toLocaleString();
    }
    return String(val);
};
