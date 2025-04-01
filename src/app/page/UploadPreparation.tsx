import React, { useState } from "react";
import StepProgress from "../reusable/StepProgress";
import Button from "../reusable/Button";
import { useNavigate } from "react-router-dom";
import { StepStatus } from "../../types/enum/stepStatus";
import CustomSelect from "../reusable/CustomSelect";
import { OptionType } from "../../types/selectTypes";

const UploadPreparation: React.FC = () => {
    const navigate = useNavigate();
    const [selectedYear, setSelectedYear] = useState<OptionType | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<OptionType | null>(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState<OptionType | null>(null);

    const yearOptions: OptionType[] = [
        { value: "2567", label: "2567" },
        { value: "2566", label: "2566" },
    ];

    const monthOptions: OptionType[] = [
        { value: "01", label: "ม.ค." },
        { value: "02", label: "ก.พ." },
        { value: "03", label: "มี.ค." }
    ];

    const warehouseOptions: OptionType[] = [
        { value: "คลังที่1", label: "คลังที่ 1" },
        { value: "คลังที่2", label: "คลังที่ 2" },
    ];

    return (
        <div className="container-fluid mt-3 w-100" style={{ maxWidth: '1800px' }}>
            <p className="fw-bold mb-0" style={{ fontFamily: "IBM Plex Sans Thai", fontSize: "32px" }}>
                ขั้นตอนการดำเนินงาน
            </p>
            <StepProgress status={StepStatus.UPLOAD} />

            <div className="bg-white p-5 rounded shadow-sm rounded-3 mt-3">
                <div className="d-flex justify-content-center gap-4 flex-wrap" style={{ fontSize: '18px' }}>
                    <p className="fw-bold mb-0" style={{ fontFamily: "IBM Plex Sans Thai", fontSize: "32px" }}>
                        เอกสาร
                    </p>
                    <div className="d-flex flex-wrap gap-3 mt-1" >
                        <CustomSelect label="เลือกคลัง" value={selectedWarehouse} onChange={setSelectedWarehouse} options={warehouseOptions} />
                        <CustomSelect label="เลือกปี" value={selectedYear} onChange={setSelectedYear} options={yearOptions} />
                        <CustomSelect label="เลือกเดือน" value={selectedMonth} onChange={setSelectedMonth} options={monthOptions} />
                    </div>
                </div>

                <div className="d-flex justify-content-center mt-4">
                    <Button
                        className="me-3"
                        type="button"
                        label="ย้อนกลับ"
                        onClick={() => navigate("/")}
                        bgColor="#717171"
                        variant="bg-hide"
                    />
                    <Button
                        type="button"
                        label="จัดทำ"
                        bgColor="#2C3E50"
                        color="#fff"
                        onClick={() => navigate("/upload")}
                        variant="bg-hide"
                    />
                </div>
            </div>
        </div>
    );
};

export default UploadPreparation;
