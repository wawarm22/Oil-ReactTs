import React, { useEffect, useState, useRef } from "react";
import StepProgress from "../reusable/StepProgress";
import { StepStatus } from "../../types/enum/stepStatus";
import AuditList from "../component/AuditList";
import SubDocumentList from "../component/SubDocumentList";
import AuditPagination from "../reusable/AuditPagination";
import { documentList } from "../../types/docList";
import AuditDetail from "../component/AuditDetail";
import AuditButton from "../component/AuditButton";
import { useNavigate } from "react-router-dom";

type UploadedFilesType = {
    [key: number]: { name: string; data: string; pageCount: number }[];
};

const DocumentAudit: React.FC = () => {
    const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFilesType>({});
    const [selectedDocIndex, setSelectedDocIndex] = useState<number | null>(null); 
    const [subDocHeight, setSubDocHeight] = useState<number>(0);
    const subDocRef = useRef<HTMLDivElement | null>(null);

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

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedId, selectedDocIndex]);

    useEffect(() => {
        if (selectedId !== null) {
            const selectedFiles = uploadedFiles[selectedId] || [];
            const total = selectedFiles.reduce((sum, file) => sum + (file.pageCount || 1), 0);
            setTotalPages(total || 1);
        }
    }, [selectedId, uploadedFiles]);

    useEffect(() => {
        if (subDocRef.current) {
            setSubDocHeight(subDocRef.current.clientHeight);
        }
    }, [selectedId, selectedDocIndex]);

    const handleUploadMore = () => {
        console.log("อัปโหลดเอกสารเพิ่มเติม");
    };

    const handleBack = () => {
        navigate('/confirm')
    };

    const handleSaveAudit = () => {
        console.log("บันทึกการตรวจสอบ");
    };

    const handleNextStep = () => {
        console.log("ขั้นตอนถัดไป");
    };

    return (
        <div className="container-fluid mt-3 w-100" style={{ maxWidth: '1800px' }}>
            <p className="fw-bold mb-0" style={{ fontFamily: "IBM Plex Sans Thai", fontSize: "32px" }}>
                รายการลดหย่อนภาษี
            </p>
            <StepProgress status={StepStatus.AUDIT} />

            <AuditList selectedId={selectedId} setSelectedId={setSelectedId} />

            <div className="d-flex justify-content-between align-items-center gap-2 w-100">
                <div ref={subDocRef} className="w-100">
                    <SubDocumentList selectedId={selectedId} setSelectedDocIndex={setSelectedDocIndex} />
                </div>
                <AuditPagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} customHeight={subDocHeight} />
            </div>
            
            <AuditDetail selectedId={selectedId} currentPage={currentPage} uploadedFiles={uploadedFiles} />
            
            <AuditButton
                onUploadMore={handleUploadMore}
                onBack={handleBack}
                onSaveAudit={handleSaveAudit}
                onNextStep={handleNextStep}
                disableSave={true} 
            />
        </div>
    );
};

export default DocumentAudit;
