import React from "react";

interface DocumentCompareProgressProps {
    currentStep: number;
    totalSteps: number;
    descriptions: string[];
}

const DocumentCompareProgress: React.FC<DocumentCompareProgressProps> = ({ currentStep, totalSteps, descriptions }) => {
    return (
        <div className="w-100 my-2 p-4 bg-white" style={{ fontFamily: "IBM Plex Sans Thai", fontSize: "18px" }}>
            <div className="d-flex align-items-start">
                {/* Current Step/Total - Left */}
                <div
                    className="rounded-circle bg-warning text-dark d-flex align-items-center justify-content-center fw-bold me-3"
                    style={{ width: "60px", height: "60px" }}
                >
                    {currentStep}/{totalSteps}
                </div>

                {/* Steps Progress + Description (Center) */}
                <div className="flex-grow-1 d-flex flex-column align-items-center">
                    {/* Step Circles */}
                    <div className="d-flex justify-content-center align-items-center">
                        {Array.from({ length: totalSteps }, (_, index) => {
                            const stepNumber = index + 1;
                            const isActive = stepNumber === currentStep;
                            const isCompleted = stepNumber < currentStep;

                            return (
                                <React.Fragment key={stepNumber}>
                                    <div
                                        className={`rounded-circle d-flex align-items-center justify-content-center fw-bold 
                                        ${isActive || isCompleted ? "bg-warning text-dark" : "text-dark border border-dark border-3"}`}
                                        style={{
                                            width: "60px",
                                            height: "60px",
                                            backgroundColor: isActive || isCompleted ? undefined : "#E8E8E8",
                                        }}
                                    >
                                        {stepNumber}
                                    </div>
                                    {stepNumber !== totalSteps && (
                                        <div className="bg-dark" style={{ width: "60px", height: "4px" }}></div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>

                    {/* Description */}
                    <p className="fw-bold mt-3 mb-0 text-center" style={{ fontSize: "18px" }}>
                        {`${currentStep} ${descriptions[currentStep - 1] || ""}`}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DocumentCompareProgress;
