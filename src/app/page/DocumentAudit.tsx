import React, { useEffect, useState } from "react";
import StepProgress from "../reusable/StepProgress";
import { StepStatus } from "../../types/enum/stepStatus";
import { documentList } from "../../types/docList";
import AuditDetail from "../component/AuditDetail";
import AuditButton from "../component/AuditButton";
import { useLocation, useNavigate } from "react-router-dom";
import { ContextByDocType } from "../../types/checkList";
import { SAVE_API_MAP } from "../../utils/function/saveApiMap";
import { useCompanyStore } from "../../store/companyStore";
import { AuthSchema } from "../../types/schema/auth";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

type UploadedFilesType = {
    [key: number]: { name: string; data: string; pageCount: number }[];
};

const DocumentAudit: React.FC = () => {
    const navigate = useNavigate();
    const auth = useAuthUser<AuthSchema>();
    const { selectedCompany } = useCompanyStore();
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [currentPage, _setCurrentPage] = useState<number>(1);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFilesType>({});
    const [folders, setFolders] = useState<string[]>([]);
    const [disableNext, setDisableNext] = useState(true);
    const [contextByDoc, setContextByDoc] = useState<ContextByDocType>({});
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const from = searchParams.get("from");

    useEffect(() => {
        const localFolders = localStorage.getItem("folders");
        if (localFolders) {
            try {
                setFolders(JSON.parse(localFolders));
            } catch {
                setFolders([]);
            }
        }
    }, []);

    useEffect(() => {
        try {
            const storedFiles = localStorage.getItem("uploadedFiles");
            if (storedFiles) {
                const parsedFiles: UploadedFilesType = JSON.parse(storedFiles);
                setUploadedFiles(parsedFiles);
            }
        } catch (error) {
            console.error("Error parsing uploadedFiles from localStorage:", error);
            setUploadedFiles({});
        }
    }, []);

    useEffect(() => {
        if (documentList.length > 0) {
            setSelectedId(documentList[0].id);
        }
    }, []);

    const handleUploadMore = () => {
        console.log("อัปโหลดเอกสารเพิ่มเติม");
    };

    const handleBack = () => {
        localStorage.removeItem("folders");
        localStorage.removeItem("transport");
        localStorage.removeItem("warehouse");
        if (from === "search-file") {
            navigate('/search-file');
        } else {
            navigate('/pre-upload');
        }
    };

    const handleSaveAudit = async () => {
        if (!auth) {
            alert("กรุณาเข้าสู่ระบบใหม่");
            return;
        }

        const month = localStorage.getItem("month") ?? "";
        const from_date = localStorage.getItem("dateStart") ?? "";
        const to_date = localStorage.getItem("dateEnd") ?? "";
        const periot = localStorage.getItem("periodValue") ?? "";
        const factory_slug = localStorage.getItem("warehouse") ?? "";
        const company_id = selectedCompany?.id ?? 0;

        let hasError = false;
        for (const key in SAVE_API_MAP) {
            const [docIdStr, subIdxStr] = key.split("-");
            const docId = Number(docIdStr);
            const subIdx = Number(subIdxStr);
            const context = contextByDoc[docId]?.[subIdx];

            if (!context) continue;

            const pageNums = Object.keys(context).map(Number).sort((a, b) => a - b);

            for (const pageNum of pageNums) {
                const pageData = context[pageNum];
                const docType = pageData?.docType; 

                const savePayload = {
                    month,
                    from_date,
                    to_date,
                    periot,
                    factory_slug,
                    company_id,
                    data: pageData,
                };

                const saveApi = SAVE_API_MAP[key];
                try {
                    await saveApi({ data: savePayload, auth, docType });
                } catch (err) {
                    hasError = true;
                    console.error(`บันทึก ${key} (หน้า ${pageNum}) ผิดพลาด`, err);
                }
            }
        }

        if (hasError) {
            alert("มีบางรายการบันทึกผิดพลาด");
        } else {
            alert("บันทึกสำเร็จ!");
        }
    };

    const handleValidationStatus = (status: Record<string, boolean>) => {
        if (!status || Object.keys(status).length === 0) {
            setDisableNext(true);
            return;
        }
        const someFail = Object.values(status).some(Boolean);
        setDisableNext(someFail);
    };

    const handleNextStep = () => {
        navigate('/match-document')
    };

    return (
        <div className="container-fluid mt-3 w-100" style={{ maxWidth: '1800px' }}>
            <p className="fw-bold mb-0" style={{ fontFamily: "IBM Plex Sans Thai", fontSize: "32px" }}>
                รายการลดหย่อนภาษี
            </p>
            <StepProgress status={StepStatus.AUDIT} />

            <AuditDetail
                selectedId={selectedId}
                currentPage={currentPage}
                uploadedFiles={uploadedFiles}
                folders={folders}
                onValidationStatusChange={handleValidationStatus}
                contextByDoc={contextByDoc}
                setContextByDoc={setContextByDoc}
            />

            <AuditButton
                onUploadMore={handleUploadMore}
                onBack={handleBack}
                onSaveAudit={handleSaveAudit}
                onNextStep={handleNextStep}
                disableSave={disableNext}
            />
        </div>
    );
};

export default DocumentAudit;
