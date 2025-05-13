import React, { useEffect, useState, useRef } from "react";
import StepProgress from "../reusable/StepProgress";
import { StepStatus } from "../../types/enum/stepStatus";
import AuditList from "../component/AuditList";
import SubDocumentList from "../component/SubDocumentList";
import AuditPagination from "../reusable/AuditPagination";
import { documentList } from "../../types/docList";
import AuditButton from "../component/AuditButton";
import { useNavigate } from "react-router-dom";
import MatchTable from "../component/MatchTable";
import { sampleTableData } from "../../types/tableTypes";
import VolumeCompareTable from "../component/VolumeCompareTable";
import { volumeCompareData } from "../../types/volumeTableTypes";

type UploadedFilesType = {
    [key: number]: { name: string; data: string; pageCount: number }[];
};

const MatchDocument: React.FC = () => {
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

    const handleBack = () => {
        navigate('/match-list')
    };

    const handleSaveAudit = () => {
        console.log("บันทึกการตรวจสอบ");
    };

    const handleNextStep = () => {
        console.log("บันทึกการตรวจสอบ");
    };

    return (
        <div className="container-fluid mt-3 w-100" style={{ maxWidth: '1800px' }}>
            <p className="fw-bold mb-0" style={{ fontFamily: "IBM Plex Sans Thai", fontSize: "32px" }}>
                รายการลดหย่อนภาษี
            </p>
            <StepProgress status={StepStatus.MATCH} />

            <AuditList selectedId={selectedId} setSelectedId={setSelectedId} />

            <div className="d-flex justify-content-between align-items-center gap-2 w-100">
                <div ref={subDocRef} className="w-100">
                    <SubDocumentList selectedId={selectedId} setSelectedDocIndex={setSelectedDocIndex} />
                </div>
                <AuditPagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} customHeight={subDocHeight} />
            </div>

            {selectedId === 1 && <MatchTable data={sampleTableData} />}
            {selectedId === 2 && <VolumeCompareTable data={volumeCompareData} />}

            <AuditButton
                stepStatus={StepStatus.MATCH}
                onBack={handleBack}
                onSaveAudit={handleSaveAudit}
                onNextStep={handleNextStep}
                disableSave={false}
            />
        </div>
    );
};

export default MatchDocument;
