import React from "react";
import StepProgress from "../reusable/StepProgress";
import Button from "../reusable/Button";
import "../../assets/css/dropdown-icon.css";
import "../../assets/css/dropdown-animation.css";
import "../../assets/css/table.css";
import { useNavigate } from "react-router-dom";
import { StepStatus } from "../../types/enum/stepStatus";

const TaxSubmission: React.FC = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/audit');
    }    

    return (
        <div className="container-fluid mt-3 w-100" style={{ maxWidth: '1800px' }}>
            <p className="fw-bold mb-0" style={{ fontFamily: "IBM Plex Sans Thai", fontSize: "32px", }}>
                ขั้นตอนการดำเนินงาน
            </p>
            <StepProgress status={StepStatus.SUBMIT} />
            <div className="mt-3 d-flex justify-content-between align-items-end">
                <p className="fw-bold mb-0" style={{ fontFamily: "IBM Plex Sans Thai", fontSize: "32px", }}>
                    รายงานสรุปการคืนภาษี
                </p>
            </div>
            <div className="table-responsive bg-white p-4 rounded shadow-sm rounded-3" style={{ fontSize: '16spx' }}>
                <table className="table table-bordered border-dark">
                    <thead>
                        
                    </thead>
                    <tbody>
                        
                    </tbody>
                </table>
                <div className="d-flex justify-content-center mt-4">
                    <Button
                        className="me-3"
                        type="button"
                        label="ย้อนกลับ"
                        onClick={handleBack}
                        bgColor="#717171"
                        variant="bg-hide"
                    />
                    <Button
                        type="button"
                        label="ยืนยันรายการ"
                        maxWidth="235px"
                        bgColor="#FFCB02"
                        color="#1E2329"
                        variant="bg-hide"
                        onClick={() => navigate("/")}
                    />
                </div>
            </div>
        </div>
    );
};

export default TaxSubmission;
