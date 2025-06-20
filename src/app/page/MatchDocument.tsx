import React, { useEffect, useState } from "react";
import StepProgress from "../reusable/StepProgress";
import { StepStatus } from "../../types/enum/stepStatus";
import AuditList from "../component/AuditList";
import { documentList } from "../../types/docList";
import AuditButton from "../component/AuditButton";
import { useNavigate } from "react-router-dom";
import MatchTable from "../component/MatchTable";
import VolumeCompareTable from "../component/VolumeCompareTable";
import DocumentCompareProgress from "../reusable/DocumentCompareProgress";
import { DocumentCompareStep } from "../../types/enum/docCompare";
import { OcrFields } from "../../types/ocrFileType";
import PdfPreviewMatch from "../component/PdfPreviewMatch";
import ChecklistMatch from "../component/ChecklistMatch";
import ProductionReport from "../reusable/ProductionReport";
import MatchPagination from "../reusable/MatchPagination";
import OilReceiveTable from "../component/OilReceiveTable";
import { oilReceiveData } from "../../types/oilReceiveTypes";
import TaxRefundCalculationTable from "../component/TaxRefundCalculationTable";
import { taxRefundData } from "../../types/taxRefundTypes";
import { loadMatchStepData, MatchStepData } from "../../utils/dataLoader/matchDataLoader";
import { mapAllProductFormulas, mapRawMaterialPayments } from "../../utils/dataLoader/matchTableMapper";

type UploadedFilesType = {
    [key: number]: { name: string; data: string; pageCount: number }[];
};

const MatchDocument: React.FC = () => {
    const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedOcrDocument, _setSelectedOcrDocument] = useState<{
        pages: { [page: number]: OcrFields };
        pageCount: number;
        pageFileKeyMap: { [page: number]: string };
    } | null>(null);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFilesType>({});
    const [selectedDocIndex, setSelectedDocIndex] = useState<number | null>(null);
    const [stepData, setStepData] = useState<MatchStepData | null>(null);
    const [currentStep, setCurrentStep] = useState<number>(1);

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
        loadMatchStepData(currentStep).then(setStepData);
    }, [currentStep]);

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


    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);

            const stepToDocIdMap: { [key: number]: number[] } = {
                1: [3, 6],
                2: [6, 7, 8],
                3: [6, 7, 10],
                4: [13, 17, 15, 24],
                5: [8, 19],
            };

            const previousStep = currentStep - 1;
            const prevDocs = stepToDocIdMap[previousStep] || [];

            if (prevDocs.length > 0) {
                setSelectedId(prevDocs[0]);
            } else {
                setSelectedId(null);
            }
        } else {
            navigate("/match-list");
        }
    };

    const handleSaveAudit = () => {
        console.log("บันทึกการตรวจสอบ");
    };

    const handleNextStep = () => {
        if (currentStep < 5) {
            setCurrentStep(prev => prev + 1);
            const stepToDocIdMap: { [key: number]: number[] } = {
                2: [6, 7, 8],
                3: [6, 7, 10],
                4: [13, 17, 15, 24],
                5: [8, 19],
            };
            const nextStep = currentStep + 1;
            const nextDocs = stepToDocIdMap[nextStep] || [];
            if (nextDocs.length > 0) {
                setSelectedId(nextDocs[0]);
            } else {
                setSelectedId(null);
            }
        }
    };

    const getFilteredDocumentList = () => {
        const stepToDocIdMap: { [key: number]: number[] } = {
            1: [3, 6],
            2: [6, 7, 8],
            3: [6, 7, 10],
            4: [13, 17, 15, 24],
            5: [8, 19],
        };

        const docIds = stepToDocIdMap[currentStep] || [];
        return documentList.filter(doc => docIds.includes(doc.id));
    };

    return (
        <div className="container-fluid mt-3 w-100" style={{ maxWidth: '1800px' }}>
            <p className="fw-bold mb-0" style={{ fontFamily: "IBM Plex Sans Thai", fontSize: "32px" }}>
                รายการลดหย่อนภาษี
            </p>
            <StepProgress status={StepStatus.MATCH} />

            <DocumentCompareProgress
                currentStep={currentStep}
                totalSteps={5}
                descriptions={[
                    DocumentCompareStep.STEP_1,
                    DocumentCompareStep.STEP_2,
                    DocumentCompareStep.STEP_3,
                    DocumentCompareStep.STEP_4,
                    DocumentCompareStep.STEP_5
                ]}
            />

            <div className="d-flex w-100 gap-2 mt-2">
                <div className="flex-grow-1">
                    <AuditList
                        selectedId={selectedId}
                        setSelectedId={setSelectedId}
                        documentList={getFilteredDocumentList()}
                        currentStep={currentStep}
                        selectedDocIndex={selectedDocIndex}
                        setSelectedDocIndex={setSelectedDocIndex}
                    />
                </div>
                <div className="d-flex flex-column flex-grow-1" style={{ width: "38.5%" }}>
                    <MatchPagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
            </div>

            <div className="d-flex w-100 gap-2 mt-2">
                <PdfPreviewMatch
                    ocrFields={selectedOcrDocument}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
                <ChecklistMatch
                    ocrDocument={selectedOcrDocument}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}                    
                />
            </div>

            {currentStep === 1 && stepData?.step === 1 && stepData.data && (
                <MatchTable data={mapAllProductFormulas(stepData.data)} />
            )}

            {currentStep === 2 && stepData?.step === 2 && stepData.data && (
                <VolumeCompareTable data={mapRawMaterialPayments(stepData.data)} />
            )}
            {currentStep === 3 && <ProductionReport />}
            {currentStep === 4 && <OilReceiveTable data={oilReceiveData} />}
            {currentStep === 5 && <TaxRefundCalculationTable data={taxRefundData} />}

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
