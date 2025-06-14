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

type OcrByDocIdType = {
    [docId: number]: {
        [subtitleIndex: number]: {
            [fileKey: string]: {
                pages: { [pageNum: number]: OcrFields };
                pageCount: number;
            };
        };
    };
};

interface AuditDetailProps {
    selectedId: number | null;
    currentPage: number;
    uploadedFiles: { [key: number]: { name: string; data: string; pageCount: number }[] };
    folders: string[];
}

const AuditDetail: React.FC<AuditDetailProps> = ({ folders }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const { addCallbacks, removeCallbacks } = useSocket();
    const [selectedOcrDocument, setSelectedOcrDocument] = useState<{
        pages: { [page: number]: OcrFields };
        pageCount: number;
        pageFileKeyMap: { [page: number]: string };
    } | null>(null);

    const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
    const [selectedSubtitleIdx, setSelectedSubtitleIdx] = useState<number | null>(null);

    // เก็บ OCR ทั้งหมดไว้ตรงนี้ เพื่อส่ง prop ให้ DocumentChecklist
    const [ocrByDocId, setOcrByDocId] = useState<OcrByDocIdType>({});
    const [validationFailStatus, setValidationFailStatus] = useState<Record<string, boolean>>({});
    const auth = useAuthUser<AuthSchema>();
    const validationRanRef = useRef(false);

    // ดึง OCR จากทุก folder
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
        console.log("results", results);
        
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

    useEffect(() => {
        async function batchValidateAll() {
            if (validationRanRef.current) return;
            validationRanRef.current = true;
            if (!ocrByDocId || Object.keys(ocrByDocId).length === 0) return;

            const validatePromises: Promise<{ docId: number, subIdx: number, failed: boolean } | null>[] = [];

            for (const doc of documentList) {
                const docId = doc.id;
                const subtitleLength = doc.subtitle?.length ?? 1;

                for (let subIdx = 0; subIdx < subtitleLength; subIdx++) {
                    const docGroup = ocrByDocId[docId]?.[subIdx];
                    if (!docGroup) continue;

                    const fileKeys = Object.keys(docGroup);
                    if (fileKeys.length === 0) continue;

                    const allPages: OcrFields[] = [];
                    for (const fileKey of fileKeys) {
                        const pagesObj = docGroup[fileKey]?.pages;
                        if (!pagesObj) continue;
                        Object.values(pagesObj).forEach(page => {
                            if (page && page.docType) allPages.push(page);
                        });
                    }
                    if (allPages.length === 0) continue;

                    validatePromises.push(
                        (async () => {
                            try {
                                let hasFailed = false;
                                for (const page of allPages) {
                                    const docType = page.docType as string;
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
                                    const res = await validateConfig.api(payload);

                                    if (validateConfig.checkFailed(res)) {
                                        hasFailed = true;
                                        break;
                                    }
                                }
                                return { docId, subIdx, failed: hasFailed };
                            } catch (e) {
                                return { docId, subIdx, failed: true };
                            }
                        })()
                    );
                }
            }

            const results = await Promise.all(validatePromises);
            let statusMap: Record<string, boolean> = {};

            for (const r of results) {
                if (!r) continue;
                statusMap[`${r.docId}-${r.subIdx}`] = r.failed;
            }

            setValidationFailStatus(statusMap);
        }

        if (Object.keys(ocrByDocId).length > 0) {
            batchValidateAll();
        }
    }, [ocrByDocId, auth]);

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
                ocrByDocId={ocrByDocId}  // <-- ส่งไปเป็น prop
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
            />
        </div>
    );
};

export default AuditDetail;
