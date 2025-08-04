export type LossGainTableEntry = {
    kind: string;
    properties: Record<string, any>;
    confidence?: number;
};

type MainRowGroup = {
    label: string;
    value: string;
    subLabel: string;
    subValue: string;
};

export const mapLossGainToGroup = (table1: LossGainTableEntry[], table2: LossGainTableEntry[]) => {
    // table1
    const mainRows = table1.slice(1, table1.length - 2);
    const loadingRow = table1[table1.length - 2] ?? {};
    const percentRow = table1[table1.length - 1] ?? {};

    // table2
    const t2row0 = table2[0] ?? {};
    const t2row1 = table2[1] ?? {};

    // --- MAINROWS: แยกเลขคี่/เลขคู่ ---
    // ค้นหา key ทั้งหมด แล้วจับคู่ column_1 กับ column_2, column_3 กับ column_4, ...
    const mainRowGroups = mainRows.flatMap(row => {
        const propertyKeys = Object.keys(row.properties || {});
        const columnKeys = propertyKeys.filter(k => /^column_\d+$/.test(k));
        const sortedKeys = columnKeys.sort((a, b) => {
            const numA = parseInt(a.split("_")[1]);
            const numB = parseInt(b.split("_")[1]);
            return numA - numB;
        });

        // *** เพิ่ม type ให้ result ตรงนี้ ***
        const result: MainRowGroup[] = [];
        for (let i = 0; i < sortedKeys.length; i += 2) {
            const oddKey = sortedKeys[i];
            const evenKey = sortedKeys[i + 1];
            result.push({
                label: "รายการ",
                value: row.properties?.[oddKey]?.value ?? "",
                subLabel: "LTS.@86 F/MTONS",
                subValue: evenKey ? (row.properties?.[evenKey]?.value ?? "") : ""
            });
        }
        return result;
    });

    const groups = [
        {
            groupLabel: "TOTAL LOSS/GAIN",
            rows: mainRowGroups
        },
        {
            groupLabel: "LOADING Loss/Gain",
            rows: [
                { label: "LOADING Loss/Gain", value: loadingRow.properties?.column_2?.value ?? "" },
                { label: "%", value: percentRow.properties?.column_2?.value ?? "" }
            ]
        },
        {
            groupLabel: "TRANSIT Loss/Gain",
            rows: [
                { label: "TRANSIT Loss/Gain", value: loadingRow.properties?.column_4?.value ?? "" },
                { label: "%", value: percentRow.properties?.column_4?.value ?? "" }
            ]
        },
        {
            groupLabel: "UNLOADING Loss/Gain",
            rows: [
                { label: "UNLOADING Loss/Gain", value: loadingRow.properties?.column_6?.value ?? "" },
                { label: "%", value: percentRow.properties?.column_6?.value ?? "" }
            ]
        },
        {
            groupLabel: "ถังปลายทาง - ถังต้นทาง (Tank Receive - Tank Supply)",
            rows: [
                { label: "ถังปลายทาง -ถังต้นทาง", value: t2row0.properties?.column_2?.value ?? "" },
                { label: "%", value: t2row1.properties?.column_2?.value ?? "" },
                { label: "หมายเหตุ", value: t2row1.properties?.column_3?.value ?? "" }
            ]
        }
    ];

    return groups;
};
