import React from "react";
import { OcrDeliveryInvoicePipline } from "../../types/ocrFileType";

interface Props {
    data: OcrDeliveryInvoicePipline;
}

const ChecklistDeliveryInvoicePipline: React.FC<Props> = ({ data }) => {
    const cleanValue = (val?: string | null): string => {
        if (!val || val.trim() === "" || val === ":unselected:" || val === ":selected:") return "";
        return val.trim();
    };

    const fields = [
        { label: "เอกสาร", value: "THAI PETROLEUM PLPLINE CO.,LTD. PRODUCT DELIVERIED TO CUSTOMER DEPOT" },
        { label: "ชื่อผลิตภัณฑ์ (PRODUCT)", value: cleanValue(data.product) },
        { label: "เลขที่เอกสาร (DOC NO.)", value: cleanValue(data.doc_no) },
        { label: "หมายเลขของผู้ประกอบอุตสาหกรรม (CUSTOMER TANK NO.)", value: cleanValue(data.customer_tank_no) },
        { label: "หมายเลขการผลิต (BATCH NO.)", value: cleanValue(data.batch_no) },
        { label: "สถานที่เก็บสินค้า (DEPOT)", value: cleanValue(data.depot) },
        { label: "วันที่ (DATE)", value: cleanValue(data.date) },
        { label: "เวลา (TIME)", value: cleanValue(data.time) },
    ];

    const footer = [
        { label: "NOTE", value: cleanValue(data.note) },
        { label: "BOOK ON", value: cleanValue(data.book_no) },
    ]

    const table = Array.isArray(data.detail_table) ? data.detail_table.slice(1) : [];

    const totalPttTankIndex = table.findIndex(item => item.properties?.column_1?.value?.includes("TOTAL PTT TANK"));

    const tableBeforeTotalPttTank = totalPttTankIndex !== -1 ? table.slice(0, totalPttTankIndex) : [];
    const tableAfterTotalPttTank = totalPttTankIndex !== -1 ? table.slice(totalPttTankIndex) : [];

    const labelValuePairs = [
        { label: "TOTAL PTT TANK RECEIVE @ 86'F", value: "column_2" },
        { label: "SUMP", value: "column_2" },
        { label: "THAPPLINE LINE CONTENT", value: "column_2" },
        { label: "CUSTOMER LINE", value: "column_2" },
        { label: "EXTRA VOL1", value: "column_2" },
        { label: "EXTRA VOL2", value: "column_2" },
        { label: "B100/E100 VOLUME", value: "column_2" },
        { label: "NET RECEIVED VOLUME", value: "column_2" },
    ];

    return (
        <div className="d-flex flex-column gap-2">
            {fields.map(({ label, value }) => (
                <div key={label}>
                    <div className="fw-bold">{label}</div>
                    <div className="rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px", minHeight: "40px", border: `1.5px solid #22C659` }}>
                        {value}
                    </div>
                </div>
            ))}
            <hr className="m-0 mt-2" />

            {tableBeforeTotalPttTank.length > 0 && (
                <>
                    {tableBeforeTotalPttTank.map((item, idx) => {
                        const props = (item.properties ?? {}) as Record<string, any>;
                        return (
                            <div key={idx} className="d-flex flex-column gap-2 mb-2">
                                {[
                                    { label: "รายละเอียด (DESCRIPTION)", value: props.column_1?.value },
                                    { label: "(BEFORE)", value: props.column_2?.value },
                                    { label: "(AFTER)", value: props.column_3?.value },
                                ].map(({ label, value }) => (
                                    <div key={label}>
                                        <div className="fw-bold m-o">{label}</div>
                                        <div className="rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px", minHeight: "40px", border: `1.5px solid #22C659` }}>
                                            {cleanValue(value)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </>
            )}

            {tableAfterTotalPttTank.length > 0 && (
                <>
                    {labelValuePairs.map(({ label, value }, idx) => {
                        const item = tableAfterTotalPttTank[idx];
                        const props = (item.properties ?? {}) as Record<string, any>;

                        if (label === "NET RECEIVED VOLUME") {
                            return (
                                <div key={idx} className="d-flex flex-column gap-2 mb-2">
                                    <div>
                                        <div className="fw-bold m-o">{label}</div>
                                        <div className="rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px", minHeight: "40px", border: `1.5px solid #22C659` }}>
                                            {cleanValue(props.column_2?.value)} {cleanValue(props.column_3?.value)} {/* แสดง column_2 และ column_3 ต่อกัน */}
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div key={idx} className="d-flex flex-column gap-2 mb-2">
                                <div>
                                    <div className="fw-bold m-o">{label}</div>
                                    <div className="rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px", minHeight: "40px", border: `1.5px solid #22C659` }}>
                                        {cleanValue(props[value]?.value)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </>
            )}
            
            <hr className="m-0 mt-1" />
            {footer.map(({ label, value }) => (
                <div key={label}>
                    <div className="fw-bold">{label}</div>
                    <div className="rounded-2 shadow-sm bg-white p-2" style={{ fontSize: "14px", minHeight: "40px", border: `1.5px solid #22C659` }}>
                        {value}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ChecklistDeliveryInvoicePipline;
