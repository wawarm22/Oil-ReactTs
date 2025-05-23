export const numberOrText = (val: any) => {
    if (val === null || val === undefined) return "";
    if (!isNaN(Number(val)) && val !== "") return Number(val).toLocaleString();
    return String(val);
};
