import React, { useState } from "react";
import StepProgress from "../reusable/StepProgress";
import { StepStatus } from "../../types/enum/stepStatus";
import AuditList from "../component/AuditList";
import SubDocumentList from "../component/SubDocumentList";

const DocumentAudit: React.FC = () => {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    return (
        <div className="container-fluid mt-3 w-100" style={{ maxWidth: '1800px' }}>
            <p className="fw-bold mb-0" style={{ fontFamily: "IBM Plex Sans Thai", fontSize: "32px" }}>
                รายการลดหย่อนภาษี
            </p>
            <StepProgress status={StepStatus.AUDIT} />

            <AuditList selectedId={selectedId} setSelectedId={setSelectedId} />
            <SubDocumentList selectedId={selectedId} />
        </div>
    );
};

export default DocumentAudit;
