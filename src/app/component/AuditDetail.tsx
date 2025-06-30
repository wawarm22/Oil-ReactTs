import React, { useEffect, useMemo, useState } from "react";
import { documentList } from "../../types/docList";
import DocumentChecklist from "./DocumentChecklist";
import ChecklistPanel from "./ChecklistPanel";
import PdfPreview from "./PdfPreview";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { AuthSchema } from "../../types/schema/auth";
import { useOcrStore } from "../../store/useOcrStore";
import { parseUploadedStatus } from "../../utils/function/parseUploadedStatus";
import { useOcrSocketRefresh } from "../../hook/useOcrSocketRefresh";

interface AuditDetailProps {
    folders: string[];
    onValidationStatusChange?: (status: Record<string, boolean>) => void;
}

const AuditDetail: React.FC<AuditDetailProps> = ({
    folders,
    onValidationStatusChange
}) => {
    const auth = useAuthUser<AuthSchema>();

    const {
        ocrByDocId,
        validateResultsByDoc,
        contextByDoc,
        validationFailStatus,
        fetchOcrData,
        batchValidateAll,
        setFolders,
    } = useOcrStore();

    const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
    const [selectedSubtitleIdx, setSelectedSubtitleIdx] = useState<number | null>(null);
    const [selectedOcrDocument, setSelectedOcrDocument] = useState<{
        pages: { [page: number]: any };
        pageCount: number;
        pageFileKeyMap: { [page: number]: string };
    } | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedDocMeta, setSelectedDocMeta] = useState<{ docId: number, subtitleIdx: number } | null>(null);
    const uploadedStatus = useMemo(() => parseUploadedStatus(folders), [folders]);

    useOcrSocketRefresh();
    
    useEffect(() => {
        setFolders(folders || []);
        if (folders.length > 0) {
            fetchOcrData(folders, auth);
        }
    }, [folders]);

    useEffect(() => {
        if (ocrByDocId && Object.keys(ocrByDocId).length > 0) {
            batchValidateAll(auth);
        }
    }, [ocrByDocId, auth]);

    useEffect(() => {
        if (typeof onValidationStatusChange === "function") {
            onValidationStatusChange(validationFailStatus);
        }
    }, [validationFailStatus, onValidationStatusChange]);

    useEffect(() => {
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
            setSelectedOcrDocument({
                pages: combinedPages,
                pageCount: pageOffset,
                pageFileKeyMap,
            });
            setCurrentPage(1);
        }
    }, [ocrByDocId, selectedDocId, selectedSubtitleIdx]);

    const getIsUploaded = (meta?: { docId: number, subtitleIdx: number } | null) => {
        if (!meta) return false;
        const { docId, subtitleIdx } = meta;
        return uploadedStatus[docId]?.has(subtitleIdx ?? 0) ?? false;
    };

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
                validateResultsByDoc={validateResultsByDoc}
                onSelectDocumentMeta={(docId, subtitleIdx) => setSelectedDocMeta({ docId, subtitleIdx })}
            />

            <PdfPreview
                documentList={documentList}
                folders={folders}
                ocrFields={selectedOcrDocument}
                currentPage={currentPage}
                ocrByDocId={ocrByDocId}
                setCurrentPage={setCurrentPage}
                selectedDocMeta={selectedDocMeta}
                isUploaded={getIsUploaded(selectedDocMeta)}
            />

            <ChecklistPanel
                documentList={documentList}
                ocrDocument={selectedOcrDocument}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                selectedDocId={selectedDocId}
                selectedSubtitleIdx={selectedSubtitleIdx}
                validateResultsByDoc={validateResultsByDoc}
                contextByDoc={contextByDoc}
                selectedDocMeta={selectedDocMeta}
                isUploaded={getIsUploaded(selectedDocMeta)}
            />
        </div>
    );
};

export default AuditDetail;
