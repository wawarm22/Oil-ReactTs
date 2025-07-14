import React from "react";
import Button from "../reusable/Button";
import { StepStatus } from "../../types/enum/stepStatus";
import { Spinner } from "react-bootstrap";

interface MatchTableButtonContainerProps {
    stepStatus?: StepStatus;
    onUploadMore?: () => void;
    onBack?: () => void;
    onSaveAudit?: () => void;
    onNextStep?: () => void;
    disableSave?: boolean;
    saving?: boolean;
}

const MatchTableButton: React.FC<MatchTableButtonContainerProps> = ({
    stepStatus,
    // onUploadMore,
    onBack,
    onSaveAudit,
    onNextStep,
    disableSave = false,
    saving = false
}) => {
    return (
        <div className="d-flex justify-content-between align-items-center shadow-sm bg-white rounded-2 p-4 mt-3 w-100">
            <div
                className="flex-grow-1 d-flex justify-content-start w-100"
                style={{ visibility: stepStatus === StepStatus.MATCH ? "hidden" : "visible" }}
            >
                {/* <Button
                    type="button"
                    label="อัปโหลดเอกสารเพิ่มเติม"
                    bgColor="#1E2329"
                    color="#FFF"
                    maxWidth="300px"
                    hoverBgColor="#FFFF"
                    hoverBorderColor="#1E2329"
                    hoverColor="#1E2329"
                    variant="bg-hide"
                    onClick={onUploadMore}
                /> */}
            </div>

            <div className="d-flex gap-2 w-100">
                <Button
                    type="button"
                    label="ย้อนกลับ"
                    bgColor="#717171"
                    color="#FFF"
                    maxWidth="300px"
                    hoverBgColor="#FFFF"
                    hoverBorderColor="#717171"
                    hoverColor="#717171"
                    variant="bg-hide"
                    onClick={onBack}
                />

                <Button
                    type="button"
                    label={
                        saving ? (
                            <>
                                <Spinner
                                    animation="border"
                                    size="sm"
                                    className="me-2"
                                    style={{ verticalAlign: "middle" }}
                                />
                                กำลังบันทึกข้อมูล...
                            </>
                        ) : "บันทึกการเปรียบเทียบ"
                    }
                    bgColor="#FFCB02"
                    color="#1E2329"
                    hoverBgColor="#FFFF"
                    hoverColor="#FFCB02"
                    hoverBorderColor="#FFCB02"
                    variant="bg-hide"
                    maxWidth="300px"
                    onClick={onSaveAudit}
                    disabled={disableSave || saving}
                />
            </div>

            <div className="flex-grow-1 d-flex justify-content-end w-100">
                <Button
                    type="button"
                    label="ขั้นตอนถัดไป"
                    bgColor="#3D4957"
                    color="#FFF"
                    maxWidth="300px"
                    hoverBgColor="#FFFF"
                    hoverBorderColor="#3D4957"
                    hoverColor="#3D4957"
                    variant="bg-hide"
                    onClick={onNextStep}
                    disabled={disableSave}
                />
            </div>
        </div>
    );
};

export default MatchTableButton;
