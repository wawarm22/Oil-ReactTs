import React, { useEffect, useState, useMemo } from "react";
import StepProgress from "../reusable/StepProgress";
import { StepStatus } from "../../types/enum/stepStatus";
import AuditList from "../component/AuditList";
import { documentList } from "../../types/docList";
import { useNavigate, useSearchParams } from "react-router-dom";
import MatchTable from "../component/MatchTable";
import VolumeCompareTable from "../component/VolumeCompareTable";
import DocumentCompareProgress from "../reusable/DocumentCompareProgress";
import { DocumentCompareStep } from "../../types/enum/docCompare";
import PdfPreviewMatch from "../component/PdfPreviewMatch";
import ChecklistMatch from "../component/ChecklistMatch";
import ProductionReport from "../reusable/ProductionReport";
import OilReceiveTable from "../component/OilReceiveTable";
import TaxRefundCalculationTable from "../component/TaxRefundCalculationTable";
import { taxRefundData } from "../../types/taxRefundTypes";
import { loadMatchStepData, MatchStepData } from "../../utils/dataLoader/matchDataLoader";
import { mapAllProductFormulas, mapMaterialUsageTable, mapOilUseInProductsToOilReceive, mapProductionTable, mapRawMaterialPayments } from "../../utils/dataLoader/matchTableMapper";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { AuthSchema } from "../../types/schema/auth";
import { parseUploadedStatus } from "../../utils/function/parseUploadedStatus";
import { useOcrStore } from "../../store/useOcrStore";
import MatchPagination from "../reusable/MatchPagination";
import { getSubtitleIndexMap } from "../../utils/function/getSubtitleIndexMap";
import { useCompanyStore } from "../../store/companyStore";
import { getInitialSubtitleIdx } from "../../utils/function/getInitialSubtitleIdx";
import { ReportParamProps } from "../../utils/function/buildParam";
import MatchTableButton from "../component/MatchTableButton";

const folders = JSON.parse(localStorage.getItem("folders") || "[]") as string[];

const stepToDocIdMapShip: { [key: number]: number[] } = {
    1: [3, 6],
    2: [6, 7, 8],
    3: [6, 7, 10],
    4: [13, 15, 17, 24],
    5: [8, 19],
};
const stepToDocIdMapPipe: { [key: number]: number[] } = {
    1: [28, 31],
    2: [31, 32, 33],
    3: [31, 32, 35],
    4: [38, 40, 42],
    5: [33, 44],
};

const MatchDocument: React.FC = () => {
    const navigate = useNavigate();
    const auth = useAuthUser<AuthSchema>();
    const [searchParams] = useSearchParams();
    const from = searchParams.get('from');

    const {
        ocrByDocId,
        validateResultsByDoc,
        contextByDoc,
        fetchOcrData,
        batchValidateAll,
        setFolders,
        isBatchValidated,
    } = useOcrStore();
    const [selectedMaterialId, setSelectedMaterialId] = useState<number | undefined>(undefined);
    const [materialIdByPage, setMaterialIdByPage] = useState<{ [page: number]: number | undefined }>({});
    const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
    const [selectedSubtitleIdx, setSelectedSubtitleIdx] = useState<number | null>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [stepData, setStepData] = useState<MatchStepData | null>(null);
    const [stepDataMap, setStepDataMap] = useState<{ [step: number]: MatchStepData }>({});
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [isOcrDataLoaded, setIsOcrDataLoaded] = useState(false);
    const uploadedStatus = useMemo(() => parseUploadedStatus(folders), [folders]);
    const { selectedCompany } = useCompanyStore();
    const monthYear = localStorage.getItem("month") || "";
    const [monthStr, yearStr] = monthYear.split("-");
    const month = monthStr ? Number(monthStr) : 0;
    const year = yearStr ? Number(yearStr) : 0;
    const factory_slug = localStorage.getItem("warehouse") || "";
    const company_id = selectedCompany?.id || 0;

    const transport = useMemo(() => localStorage.getItem("transport") || "00", []);
    const stepToDocIdMap = useMemo(() => {
        return transport === "01" ? stepToDocIdMapPipe : stepToDocIdMapShip;
    }, [transport]);

    const subtitleIndexMap = useMemo(
        () => getSubtitleIndexMap(documentList, ocrByDocId, transport, currentStep),
        [ocrByDocId, currentStep, transport]
    );

    const params: ReportParamProps = {
        factory_slug,
        company_id,
        month,
        year,
        ...(selectedMaterialId ? { material_id: selectedMaterialId } : {})
    };

    useEffect(() => {
        if (folders.length > 0) {
            if (!ocrByDocId || Object.keys(ocrByDocId).length === 0) {
                setIsOcrDataLoaded(false);
                setFolders(folders);
                fetchOcrData(folders, auth).then(() => {
                    setIsOcrDataLoaded(true);
                });
            } else {
                setIsOcrDataLoaded(true);
            }
        }
    }, [folders, ocrByDocId, fetchOcrData, auth, setFolders]);

    useEffect(() => {
        setStepDataMap({});
        setStepData(null);
    }, [params.factory_slug, params.company_id, params.month, params.year]);

    useEffect(() => {
        if (currentStep === 4) {
            const pageMaterialId = materialIdByPage[currentPage];
            if (
                pageMaterialId !== undefined &&
                pageMaterialId !== selectedMaterialId
            ) {
                setSelectedMaterialId(pageMaterialId);
            }
        }
    }, [currentStep, currentPage, materialIdByPage]);

    useEffect(() => {
        if (!auth) return;

        const fullParams = { ...params };
        if (currentStep === 4 && selectedMaterialId) {
            fullParams.material_id = selectedMaterialId;
        }

        if (currentStep === 4) {
            loadMatchStepData(currentStep, fullParams, auth).then(data => {
                setStepData(data);
            });
        } else {
            if (stepDataMap[currentStep]) {
                setStepData(stepDataMap[currentStep]);
            } else {
                loadMatchStepData(currentStep, fullParams, auth).then(data => {
                    setStepDataMap(prev => ({ ...prev, [currentStep]: data }));
                    setStepData(data);
                });
            }
        }
    }, [currentStep, auth, params.factory_slug, params.company_id, params.month, params.year, stepDataMap, selectedMaterialId, currentPage,]);

    const handleMaterialIdChange = (materialId?: number) => {
        if (currentStep === 4 && currentPage) {
            setMaterialIdByPage(prev => ({ ...prev, [currentPage]: materialId }));
        }
    };

    useEffect(() => {
        if (ocrByDocId && Object.keys(ocrByDocId).length > 0 && !isBatchValidated) {
            batchValidateAll(auth);
        }
    }, [ocrByDocId, auth, batchValidateAll, isBatchValidated]);

    useEffect(() => {
        if (selectedDocId === null && Object.keys(ocrByDocId).length > 0) {
            const filtered = getFilteredDocumentList();
            for (const doc of filtered) {
                const docGroup = ocrByDocId[doc.id];
                if (!docGroup) continue;
                const subtitleIndex = Array.isArray(doc.subtitle) && doc.subtitle.length > 0
                    ? Number(Object.keys(docGroup)[0])
                    : 0;
                setSelectedDocId(doc.id);
                setSelectedSubtitleIdx(subtitleIndex);
                setCurrentPage(1);
                return;
            }
        }
    }, [ocrByDocId, currentStep]);

    let ocrDocument: {
        pages: { [page: number]: any };
        pageCount: number;
        pageFileKeyMap: { [page: number]: string };
    } | null = null;
    if (
        selectedDocId !== null &&
        selectedSubtitleIdx !== null &&
        ocrByDocId &&
        ocrByDocId[selectedDocId]?.[selectedSubtitleIdx]
    ) {
        const docGroup = ocrByDocId[selectedDocId][selectedSubtitleIdx];
        const fileKeys = Object.keys(docGroup).sort((a, b) => {
            const numA = parseInt(a.match(/-(\d+)$/)?.[1] || "0", 10);
            const numB = parseInt(b.match(/-(\d+)$/)?.[1] || "0", 10);
            return numA - numB;
        });
        const combinedPages: { [page: number]: any } = {};
        const pageFileKeyMap: { [page: number]: string } = {};
        let pageOffset = 0;
        fileKeys.forEach((fileKey) => {
            const fileData = docGroup[fileKey];
            const pages = fileData.pages;
            const pageCount = fileData.pageCount;
            for (let p = 1; p <= pageCount; p++) {
                const logicalPage = pageOffset + p;
                combinedPages[logicalPage] = pages[p];
                pageFileKeyMap[logicalPage] = fileKey;
            }
            pageOffset += pageCount;
        });
        ocrDocument = {
            pages: combinedPages,
            pageCount: pageOffset,
            pageFileKeyMap,
        };
    }

    const getFilteredDocumentList = () => {
        const docIds = stepToDocIdMap[currentStep] || [];
        let filteredDocs = documentList.filter(doc => docIds.includes(doc.id));

        if (currentStep === 1) {
            filteredDocs = filteredDocs.map(doc => {
                if (transport === "01" && doc.id === 28 && Array.isArray(doc.subtitle) && doc.subtitle.length > 0) {
                    const trueSubtitleIdxList = subtitleIndexMap[28] || [];
                    const subtitles = doc.subtitle || [];
                    const filteredSubtitle = trueSubtitleIdxList
                        .map(realIdx => subtitles[realIdx])
                        .filter(text => !!text);
                    return { ...doc, subtitle: filteredSubtitle };
                }
                if (transport === "00" && doc.id === 3 && Array.isArray(doc.subtitle) && doc.subtitle.length > 0) {
                    const trueSubtitleIdxList = subtitleIndexMap[3] || [];
                    const subtitles = doc.subtitle || [];
                    const filteredSubtitle = trueSubtitleIdxList
                        .map(realIdx => subtitles[realIdx])
                        .filter(text => !!text);
                    return { ...doc, subtitle: filteredSubtitle };
                }
                return doc;
            });
        }

        return filteredDocs;
    };

    useEffect(() => {
        const filteredDocs = getFilteredDocumentList();
        if (
            filteredDocs.length > 0 &&
            (selectedDocId === null ||
                !filteredDocs.some(doc => doc.id === selectedDocId))
        ) {
            const firstDoc = filteredDocs[0];
            const subtitleIdx = getInitialSubtitleIdx(firstDoc.id, currentStep, subtitleIndexMap);
            setSelectedDocId(firstDoc.id);
            setSelectedSubtitleIdx(subtitleIdx);
            setCurrentPage(1);
        } else if (selectedDocId !== null) {
            const doc = filteredDocs.find(d => d.id === selectedDocId);
            if (doc) {
                let subtitleIdxList: number[] = [];
                if (subtitleIndexMap && subtitleIndexMap[selectedDocId]) {
                    subtitleIdxList = subtitleIndexMap[selectedDocId];
                } else if (doc.subtitle && doc.subtitle.length > 0) {
                    subtitleIdxList = doc.subtitle.map((_, idx) => idx);
                }
                if (
                    subtitleIdxList.length > 0 &&
                    (selectedSubtitleIdx === null ||
                        !subtitleIdxList.includes(selectedSubtitleIdx))
                ) {
                    setSelectedSubtitleIdx(subtitleIdxList[0]);
                    setCurrentPage(1);
                }
            }
        }
    }, [currentStep, ocrByDocId, subtitleIndexMap]);

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
            const previousStep = currentStep - 1;
            const prevDocs = stepToDocIdMap[previousStep] || [];
            if (prevDocs.length > 0) {
                const firstDocId = prevDocs[0];
                const subtitleIdx = getInitialSubtitleIdx(firstDocId, previousStep, subtitleIndexMap);
                setSelectedDocId(firstDocId);
                setSelectedSubtitleIdx(subtitleIdx);
                setCurrentPage(1);
            } else {
                setSelectedDocId(null);
                setSelectedSubtitleIdx(null);
            }
        } else {
            if (from === "search-file") {
                navigate('/audit?from=search-file');
            } else {
                navigate('/audit');
            }
        }
    };

    const handleSaveAudit = () => {
        console.log("บันทึกการตรวจสอบ");
    };

    const handleNextStep = () => {
        if (currentStep >= 5) {
            if (from === "search-file") {
                navigate('/match-list?from=search-file');
            } else {
                navigate('/match-list');
            }            
            return;
        }
        setCurrentStep(prev => prev + 1);

        const nextStep = currentStep + 1;

        if (nextStep <= 4) {
            const nextDocs = stepToDocIdMap[nextStep] || [];
            if (nextDocs.length > 0) {
                const firstDocId = nextDocs[0];
                const subtitleIdx = getInitialSubtitleIdx(firstDocId, nextStep, subtitleIndexMap);
                setSelectedDocId(firstDocId);
                setSelectedSubtitleIdx(subtitleIdx);
                setCurrentPage(1);
            } else {
                setSelectedDocId(null);
                setSelectedSubtitleIdx(null);
            }
        }
    };

    const isReadyForNextStep = isOcrDataLoaded && isBatchValidated;

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
                <div className="flex-grow-1" style={{ width: "100%" }}>
                    <AuditList
                        selectedId={selectedDocId}
                        setSelectedId={(id) => {
                            setSelectedDocId(id);
                            setSelectedSubtitleIdx(0);
                            setCurrentPage(1);
                        }}
                        documentList={getFilteredDocumentList()}
                        selectedDocIndex={selectedSubtitleIdx ?? 0}
                        setSelectedDocIndex={(idx) => setSelectedSubtitleIdx(idx ?? 0)}
                        currentStep={currentStep}
                        subtitleIndexMap={subtitleIndexMap}
                    />
                </div>
                <div className="d-flex flex-column flex-grow-1" style={{ width: "99%" }}>
                    <MatchPagination
                        totalPages={ocrDocument?.pageCount ?? 1}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        validateResultsByDoc={validateResultsByDoc}
                        selectedDocId={selectedDocId}
                        selectedSubtitleIdx={selectedSubtitleIdx}
                    />
                </div>
            </div>

            <div className="d-flex w-100 gap-2 mt-2" style={{ maxHeight: "800px" }}>
                <PdfPreviewMatch
                    documentList={documentList}
                    ocrFields={ocrDocument}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    selectedDocMeta={
                        selectedDocId !== null && selectedSubtitleIdx !== null
                            ? { docId: selectedDocId, subtitleIdx: selectedSubtitleIdx }
                            : null
                    }
                    isUploaded={uploadedStatus[selectedDocId ?? 0]?.has(selectedSubtitleIdx ?? 0) ?? false}
                    ocrByDocId={ocrByDocId}
                    folders={folders}
                />
                <ChecklistMatch
                    documentList={documentList}
                    ocrDocument={ocrDocument}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    selectedDocId={selectedDocId}
                    selectedSubtitleIdx={selectedSubtitleIdx}
                    validateResultsByDoc={validateResultsByDoc}
                    contextByDoc={contextByDoc}
                    selectedDocMeta={
                        selectedDocId !== null && selectedSubtitleIdx !== null
                            ? { docId: selectedDocId, subtitleIdx: selectedSubtitleIdx }
                            : null
                    }
                    isUploaded={uploadedStatus[selectedDocId ?? 0]?.has(selectedSubtitleIdx ?? 0) ?? false}
                    onMaterialIdChange={handleMaterialIdChange}
                />
            </div>

            {currentStep === 1 && stepData?.step === 1 && stepData.data && (
                <MatchTable data={mapAllProductFormulas(stepData.data)} />
            )}

            {currentStep === 2 && stepData?.step === 2 && stepData.data && (
                <VolumeCompareTable data={mapRawMaterialPayments(stepData.data)} />
            )}
            {currentStep === 3 && stepData?.step === 3 && stepData.data && (
                <ProductionReport
                    materialUsageData={mapMaterialUsageTable(stepData.data)}
                    productionData={mapProductionTable(stepData.data)}
                />
            )}
            {currentStep === 4 && stepData?.step === 4 && stepData.data && (
                <OilReceiveTable data={mapOilUseInProductsToOilReceive(stepData.data)} />
            )}
            {currentStep === 5 && <TaxRefundCalculationTable data={factory_slug === "K148" ? taxRefundData : []} />}

            <MatchTableButton
                stepStatus={StepStatus.MATCH}
                onBack={handleBack}
                onSaveAudit={handleSaveAudit}
                onNextStep={handleNextStep}
                disableSave={!isReadyForNextStep}
            />
        </div>
    );
};

export default MatchDocument;
