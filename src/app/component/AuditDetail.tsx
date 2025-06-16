import React, { useEffect, useRef, useState } from "react";
import { documentList } from "../../types/docList";
import DocumentChecklist from "./DocumentChecklist";
import ChecklistPanel from "./ChecklistPanel";
import { OcrFields } from "../../types/ocrFileType";
import PdfPreview from "./PdfPreview";
import { OCR_VALIDATE_MAP } from "../../utils/function/ocrValidateMap";
import { useSocket } from "../../hook/socket";
import { getContextForDocType } from "../../utils/contextGetters";
import { AuthSchema } from "../../types/schema/auth";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { apiGetAllOcr } from "../../utils/api/OcrListApi";
import { OcrByDocIdType, ValidateResultsByDoc } from "../../types/checkList";

interface AuditDetailProps {
    selectedId: number | null;
    currentPage: number;
    uploadedFiles: { [key: number]: { name: string; data: string; pageCount: number }[] };
    folders: string[];
    onValidationStatusChange?: (status: Record<string, boolean>) => void;
}

const AuditDetail: React.FC<AuditDetailProps> = ({ folders, onValidationStatusChange }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const { addCallbacks, removeCallbacks } = useSocket();
    const [selectedOcrDocument, setSelectedOcrDocument] = useState<{
        pages: { [page: number]: OcrFields };
        pageCount: number;
        pageFileKeyMap: { [page: number]: string };
    } | null>(null);

    const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
    const [selectedSubtitleIdx, setSelectedSubtitleIdx] = useState<number | null>(null);

    const [ocrByDocId, setOcrByDocId] = useState<OcrByDocIdType>({});
    const [validateResultsByDoc, setValidateResultsByDoc] = useState<ValidateResultsByDoc>({});
    const [validationFailStatus, setValidationFailStatus] = useState<Record<string, boolean>>({});
    const auth = useAuthUser<AuthSchema>();
    const validationRanRef = useRef(false);

    // ดึง OCR
    const fetchOcrData = async () => {
        const results: OcrByDocIdType = {};

        for (const folder of folders) {
            try {
                const data = await apiGetAllOcr(folder);
                const documents = data?.documents ?? [];
                for (const document of documents) {
                    const fileName = document.plainOriginalFileName ?? '';
                    const fileKey = fileName.replace(/\.pdf_page\d+$/, '');
                    const groupParts = fileName.split('/');
                    const len = groupParts.length;

                    let docId = 0;
                    let subtitleIndex = 0;
                    if (len >= 2 && !isNaN(Number(groupParts[len - 2]))) {
                        docId = parseInt(groupParts[len - 2]);
                    }
                    if (len >= 3 && !isNaN(Number(groupParts[len - 3])) && !isNaN(Number(groupParts[len - 2]))) {
                        docId = parseInt(groupParts[len - 3]);
                        subtitleIndex = parseInt(groupParts[len - 2]) - 1;
                    }
                    const pageNumber = parseInt(document.pageNumber ?? "1");
                    const pageCount = parseInt(document.pageCount ?? "1");

                    if (!results[docId]) results[docId] = {};
                    if (!results[docId][subtitleIndex]) results[docId][subtitleIndex] = {};
                    if (!results[docId][subtitleIndex][fileKey]) {
                        results[docId][subtitleIndex][fileKey] = {
                            pages: {},
                            pageCount
                        };
                    }

                    results[docId][subtitleIndex][fileKey].pages[pageNumber] = {
                        ...document.fields,
                        fileKey,
                        documentGroup: document.documentGroup,
                        docType: document.docType,
                        id: document.id
                    };
                }
            } catch (err) {
                console.error("OCR fetch failed:", err);
            }
        }
        setOcrByDocId(results);
    };

    useEffect(() => {
        if (folders.length > 0) {
            fetchOcrData();
        }
    }, [folders]);

    useEffect(() => {
        const refreshOCR = () => {
            fetchOcrData();
        };
        addCallbacks("ocr-refresh-checklist", refreshOCR);
        return () => removeCallbacks("ocr-refresh-checklist");
    }, [folders]);

    // Batch Validate ทีละ doc/subtitle/page → อัปเดตสถานะทีละอัน (real-time)
    useEffect(() => {
        async function batchValidateAll() {
            if (validationRanRef.current) return;
            validationRanRef.current = true;
            if (!ocrByDocId || Object.keys(ocrByDocId).length === 0) return;

            const results: ValidateResultsByDoc = {};
            const statusMap: Record<string, boolean> = {};

            for (const doc of documentList) {
                const docId = doc.id;
                const subtitleLength = doc.subtitle?.length ?? 1;

                for (let subIdx = 0; subIdx < subtitleLength; subIdx++) {
                    const docGroup = ocrByDocId[docId]?.[subIdx];
                    if (!docGroup) continue;

                    const fileKeys = Object.keys(docGroup);
                    if (fileKeys.length === 0) continue;

                    let allPages: { pageNum: number; docType: string; page: OcrFields }[] = [];
                    for (const fileKey of fileKeys) {
                        const pagesObj = docGroup[fileKey]?.pages;
                        if (!pagesObj) continue;
                        Object.entries(pagesObj).forEach(([p, page]) => {
                            if (page && page.docType) {
                                allPages.push({
                                    pageNum: Number(p),
                                    docType: page.docType,
                                    page
                                });
                            }
                        });
                    }
                    if (allPages.length === 0) continue;

                    for (const { pageNum, docType, page } of allPages) {
                        if (!OCR_VALIDATE_MAP[docType]) continue;
                        const validateConfig = OCR_VALIDATE_MAP[docType];
                        const getContext = getContextForDocType[docType] ?? getContextForDocType["default"];

                        let context;
                        if (validateConfig.needsAuth) {
                            context = await getContext(page, { auth });
                        } else {
                            context = await getContext(page);
                        }
                        const payload = await validateConfig.buildPayload(page, context);
                        let res;
                        try {
                            res = await validateConfig.api(payload);
                        } catch (e) {
                            res = null;
                        }

                        // -- Real-time: อัปเดต validate ทีละ doc/subtitle/page --
                        results[docId] = results[docId] || {};
                        results[docId][subIdx] = results[docId][subIdx] || {};
                        results[docId][subIdx][pageNum] = { docType, validateResult: res };

                        // Update validationFailStatus ทันที
                        if (validateConfig.checkFailed(res)) {
                            statusMap[`${docId}-${subIdx}`] = true;
                        } else if (!statusMap[`${docId}-${subIdx}`]) {
                            statusMap[`${docId}-${subIdx}`] = false;
                        }
                        // Trigger React re-render
                        setValidateResultsByDoc((prev) => ({ ...prev, [docId]: { ...prev[docId], [subIdx]: { ...prev[docId]?.[subIdx], [pageNum]: { docType, validateResult: res } } } }));
                        setValidationFailStatus((prev) => ({ ...prev, ...statusMap }));
                    }
                }
            }

            // สุดท้าย set ค่า full map (กัน edge case)
            setValidateResultsByDoc(results);
            setValidationFailStatus(statusMap);
        }

        if (Object.keys(ocrByDocId).length > 0) {
            validationRanRef.current = false;
            batchValidateAll();
        }
    }, [ocrByDocId, auth]);

    useEffect(() => {
        if (typeof onValidationStatusChange === "function") {
            onValidationStatusChange(validationFailStatus);
        }
    }, [validationFailStatus, onValidationStatusChange]);

    return (
        <div className="d-flex w-100 gap-3 mt-3" style={{ maxHeight: "800px" }}>
            <DocumentChecklist
                documentList={documentList}
                folders={folders}
                validationFailStatus={validationFailStatus}
                onSelectDocument={(_singlePage, fullDoc, docId, subtitleIdx) => {
                    setSelectedOcrDocument(fullDoc);
                    setSelectedDocId(docId);
                    setSelectedSubtitleIdx(subtitleIdx);
                }}
                ocrByDocId={ocrByDocId}
            />

            <PdfPreview
                ocrFields={selectedOcrDocument}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />

            <ChecklistPanel
                ocrDocument={selectedOcrDocument}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                selectedDocId={selectedDocId}
                selectedSubtitleIdx={selectedSubtitleIdx}
                validateResultsByDoc={validateResultsByDoc}
            />
        </div>
    );
};

export default AuditDetail;
