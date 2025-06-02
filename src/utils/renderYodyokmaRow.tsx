export function renderYodyokmaRow(
    row: Record<string, any>,
    materialType: string,
    labelMap: Record<string, string>
) {
    console.log("materialType", materialType);
    
    const isHBase = materialType.includes("น้ำมันดีเซลพื้นฐาน (H-Base)");
    if (isHBase) {
        return (
            <div className="mb-2">
                <div className="fw-bold" style={{ fontSize: 14 }}>รายการ</div>
                <div className="rounded-2 shadow-sm bg-white mb-2 p-2" style={{border: `1.5px solid #22C659`}}>{row["column_2"] || "ยอดยกมา"}</div>
                <div className="fw-bold" style={{ fontSize: 14 }}>{labelMap["column_13"] || "ยอดคงเหลือ Stock"}</div>
                <div className="rounded-2 shadow-sm bg-white mb-2 p-2" style={{border: `1.5px solid #22C659`}}>{row["column_13"] ?? "-"}</div>
                <div className="fw-bold" style={{ fontSize: 14 }}>{labelMap["column_14"] || "ยอดคงเหลือตามบัญชีสิทธิ์"}</div>
                <div className="rounded-2 shadow-sm bg-white mb-2 p-2" style={{border: `1.5px solid #22C659`}}>{row["column_14"] ?? "-"}</div>
            </div>
        );
    } else {
        return (
            <div className="mb-2">
                <div className="fw-bold" style={{ fontSize: 14 }}>รายการ</div>
                <div className="rounded-2 shadow-sm bg-white mb-2 p-2" style={{border: `1.5px solid #22C659`}}>{row["column_2"] || "ยอดยกมา"}</div>
                <div className="fw-bold" style={{ fontSize: 14 }}>{labelMap["column_11"] || "ยอดคงเหลือ"}</div>
                <div className="rounded-2 shadow-sm bg-white mb-2 p-2" style={{border: `1.5px solid #22C659`}}>{row["column_11"] ?? "-"}</div>
            </div>
        );
    }
}
