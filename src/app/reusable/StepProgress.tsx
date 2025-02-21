import React from "react";
import "../../assets/css/step-progress.css";
import { StepStatus } from "../../types/enum/stepStatus";
import { StepItem, stepList } from "../../types/step";

interface StepProgressProps {
    status: StepStatus;
}

const StepProgress: React.FC<StepProgressProps> = ({ status }) => {
    const currentStepIndex = stepList.findIndex(step => step.status === status);
    
    return (
        <div className="container-fluid d-flex justify-content-center shadow-sm p-4 bg-white rounded-2 w-100" style={{ fontFamily: 'IBM Plex Sans Thai' }}>
            <div className="d-flex align-items-center" style={{ maxWidth: '1400px', fontSize: '22px' }}>
                {stepList.map((step: StepItem, index: number) => {
                    const isActive = index === currentStepIndex;
                    const isCompleted = index < currentStepIndex;

                    return (
                        <div key={step.id} className="d-flex align-items-center">
                            <div className={`step-circle ${isActive ? "active" : "me-2"} ${isCompleted ? "completed" : "me-2"}`}>
                                {step.id}
                            </div>
                            <span className={`step-text ${isActive ? "active-text" : ""} ${isCompleted ? "completed-text" : ""}`}>
                                {step.label}
                            </span>
                            {index !== stepList.length - 1 && <div className="step-line"></div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StepProgress;
