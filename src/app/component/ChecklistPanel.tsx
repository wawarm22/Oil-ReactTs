import React, { useState } from "react";
import AuditPagination from "../reusable/AuditPagination";
import { OcrFields } from "../../types/ocrFileType";

interface Props {
    ocrFields: OcrFields | null;
}

const ChecklistPanel: React.FC<Props> = ({ ocrFields }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);

    const renderFields = () => {
        if (!ocrFields) return <p className="text-muted">ไม่มีข้อมูล OCR</p>;

        const fieldsToRender = [
            {
                label: "บริษัท",
                value: ocrFields.company_name,
            },
            {
                label: "คลังน้ำมัน",
                value: ocrFields.branch_no,
            },
            {
                label: "วันที่",
                value: ocrFields.tax_date,
            },
            {
                label: "สิ่งที่ส่งมาด้วย",
                value: ocrFields.attach_form,
            },
            {
                label: "สำหรับสินค้าที่ผลิตขึ้นจากสินค้าที่ได้เสียภาษีไว้แล้วรวมเป็นเงิน",
                value: `${ocrFields.amount} บาท`,
            },
        ];

        return (
            <div className="d-flex flex-column gap-3">
                {fieldsToRender.map((item, index) => (
                    item.value && (
                        <div
                            key={index}
                            className="border rounded-2 shadow-sm p-3 bg-white"
                            style={{ fontSize: "15px", whiteSpace: "pre-line" }} // รองรับ \n
                        >
                            <div className="fw-bold mb-1">{item.label}</div>
                            <div>{item.value}</div>
                        </div>
                    )
                ))}
            </div>
        );
    };

    return (
        <div className="d-flex flex-column gap-2" style={{ width: "50%" }}>
            <div className="border-0 rounded-2 shadow-sm bg-white">
                <AuditPagination
                    totalPages={1}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </div>

            <div className="shadow-sm bg-white rounded-2 p-3 h-100" style={{ overflowY: "auto" }}>
                {renderFields()}
            </div>
        </div>
    );
};

export default ChecklistPanel;
