export const cleanCellValue = (val: any): string => {
    if (typeof val !== "string") return "-";
    const cleaned = val
        .replace(/\(.*?\)/g, "")
        .replace(/:unselected:/g, "")
        .replace(/:selected:/g, "")
        .replace(/\n|↵/g, "")
        .replace(/\s{2,}/g, " ")
        .trim();
    return cleaned === "" ? "-" : cleaned;
};

export const renderLabel = (label: string): JSX.Element => {
    const clean = label
        .replace(/\(.*?\)\S*/g, "")
        .replace(/[๐-๙]+\.*[๐-๙]*/g, "")
        .replace(/\s{2,}/g, " ")
        .trim();
    return <div className="fw-bold">{clean}</div>;
};
