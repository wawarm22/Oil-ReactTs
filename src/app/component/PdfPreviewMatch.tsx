import React, { useEffect } from "react";
import { apiListPdfAfter } from "../../utils/api/uploadApi";
import { getPdfThumbnails } from "../../utils/function/pdfUtils";
import { DocumentItem } from "../../types/docList";
import { getTitleAndSubtitle } from "../../utils/function/getTitleAndSubtitle";
import { OcrByDocIdType } from "../../types/checkList";
import { usePdfThumbnailStore } from "../../store/usePdfThumbnailStore"; // <-- import store

interface OcrPageData {
    documentGroup: string;
    fileKey?: string;
    pageNumber: string;
    pageCount: string;
    [key: string]: any;
}

interface PdfPreviewProps {
    documentList: DocumentItem[];
    folders: string[];
    ocrFields: {
        pages: { [page: number]: OcrPageData };
        pageCount: number;
    } | null;
    ocrByDocId: OcrByDocIdType;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    selectedDocMeta?: { docId: number; subtitleIdx: number } | null;
    isUploaded?: boolean;
}

const PdfPreviewMatch: React.FC<PdfPreviewProps> = ({
    documentList,
    ocrByDocId,
    currentPage,
    selectedDocMeta,
    isUploaded,
}) => {
    const {
        thumbnailCache,
        loadingState,
        preloadThumbnails,
    } = usePdfThumbnailStore();

    useEffect(() => {
        preloadThumbnails(ocrByDocId, apiListPdfAfter, getPdfThumbnails);
    }, [ocrByDocId]);

    let currentThumbnails: (string | null)[] = [];
    let displayTitle = "";

    if (selectedDocMeta) {
        displayTitle = getTitleAndSubtitle(documentList, selectedDocMeta.docId, selectedDocMeta.subtitleIdx);
        if (
            ocrByDocId[selectedDocMeta.docId] &&
            ocrByDocId[selectedDocMeta.docId][selectedDocMeta.subtitleIdx]
        ) {
            const group = ocrByDocId[selectedDocMeta.docId][selectedDocMeta.subtitleIdx];
            Object.keys(group).forEach((fileKey) => {
                const key = `${selectedDocMeta.docId}-${selectedDocMeta.subtitleIdx}-${fileKey}`;
                const thumbs = thumbnailCache[key] || [];
                currentThumbnails = currentThumbnails.concat(thumbs);
            });
        }
    }

    const currentThumbnail = currentThumbnails[currentPage - 1] || null;

    const isLoading = Object.values(loadingState).some(Boolean) && !currentThumbnail;

    let displayMsg = null;
    if (!currentThumbnails.length) {
        if (isUploaded) {
            displayMsg = (
                <p className="text-muted text-center" style={{ fontFamily: "IBM Plex Sans Thai" }}>
                    กำลังประมวลผล OCR กรุณารอ... <br />
                    ("{displayTitle}")
                </p>
            );
        } else {
            displayMsg = (
                <p className="text-muted text-center">
                    ไม่พบข้อมูลเอกสาร "{displayTitle}" <br />
                    เนื่องจากไม่มีการอัพโหลดเอกสาร
                </p>
            );
        }
    }

    return (
        <div
            className="shadow-sm d-flex flex-column align-items-center justify-content-center"
            style={{ width: "50%", background: "#E0E0E0", borderRadius: "8px", height: "800px" }}
        >
            {isLoading ? (
                <div style={{ height: 740, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : currentThumbnail ? (
                <img
                    src={currentThumbnail}
                    alt={`Page ${currentPage}`}
                    style={{ maxWidth: "100%", height: "740px", objectFit: "contain", borderRadius: "6px" }}
                />
            ) : displayMsg}
        </div>
    );
};

export default PdfPreviewMatch;
