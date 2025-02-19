import React from "react";
import { useLocation } from "react-router-dom";
import "../../assets/css/step-progress.css";

const steps = [
    { label: "อัปโหลดเอกสาร", path: "/upload" },
    { label: "ยืนยันการอัปโหลดเอกสาร", path: "/confirm-upload" },
    { label: "ตรวจสอบเอกสาร", path: "/review" },
    { label: "ยื่นแบบคำขอ", path: "/submit" }
];

const StepProgress: React.FC = () => {
    const location = useLocation();
    const currentStep = steps.findIndex(step => step.path === location.pathname) + 1;

    return (
        <div className="container-fluid d-flex justify-content-center shadow-sm p-4 bg-white rounded-2 w-100" style={{ fontFamily: 'IBM Plex Sans Thai' }}>
            <div className="d-flex align-items-center" style={{ maxWidth: '1400px', fontSize: '22px' }}>
                {steps.map((step, index) => {
                    const isActive = index + 1 === currentStep;
                    const isCompleted = index + 1 < currentStep;

                    return (
                        <div key={index} className="d-flex align-items-center">
                            <div className={`step-circle ${isActive ? "active" : "me-2"} ${isCompleted ? "completed" : "me-2"}`}>
                                {index + 1}
                            </div>
                            <span className={`step-text ${isActive ? "active-text" : ""} ${isCompleted ? "completed-text" : ""}`}>
                                {step.label}
                            </span>
                            {index !== steps.length - 1 && <div className="step-line"></div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StepProgress;
