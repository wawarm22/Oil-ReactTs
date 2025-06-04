import React, { useEffect, useState } from "react";
import StepProgress from "../reusable/StepProgress";
import { StepStatus } from "../../types/enum/stepStatus";
import { documentList } from "../../types/docList";
import AuditDetail from "../component/AuditDetail";
import AuditButton from "../component/AuditButton";
import { useLocation, useNavigate } from "react-router-dom";

type UploadedFilesType = {
    [key: number]: { name: string; data: string; pageCount: number }[];
};

const DocumentAudit: React.FC = () => {
    const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [currentPage, _setCurrentPage] = useState<number>(1);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFilesType>({});
    const [folders, setFolders] = useState<string[]>([]);
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

    const handleSaveAudit = () => {
        console.log("บันทึกการตรวจสอบ");
    };

    const handleNextStep = () => {
        // navigate('/match-list')
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
            />

            <AuditButton
                onUploadMore={handleUploadMore}
                onBack={handleBack}
                onSaveAudit={handleSaveAudit}
                onNextStep={handleNextStep}
                disableSave={false}
            />
        </div>
    );
};

export default DocumentAudit;
