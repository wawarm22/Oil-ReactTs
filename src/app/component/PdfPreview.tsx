import React, { useEffect, useState, useRef } from "react";
import { apiListPdfAfter } from "../../utils/api/uploadApi";
import { getPdfThumbnails } from "../../utils/function/pdfUtils";
import { DocumentItem } from "../../types/docList";
import { getTitleAndSubtitle } from "../../utils/function/getTitleAndSubtitle";
import { OcrByDocIdType } from "../../types/checkList";

interface OcrPageData {
    documentGroup: string;
    fileKey?: string;
    pageNumber: string;
    pageCount: string;
    [key: string]: any;
}

type ThumbnailCache = Record<string, (string | null)[]>;

interface PdfPreviewProps {
    documentList: DocumentItem[];
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

const PdfPreview: React.FC<PdfPreviewProps> = ({
    documentList,
    ocrByDocId,
    currentPage,
    setCurrentPage,
    selectedDocMeta,
    isUploaded,
}) => {
    const [loading, setLoading] = useState(false);
    const [cacheReady, setCacheReady] = useState(false);
    const thumbnailCache = useRef<ThumbnailCache>({});

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setCacheReady(false);

        const preloadAllThumbnails = async () => {
            const promises: Promise<void>[] = [];
            for (const docId in ocrByDocId) {
                for (const subIdx in ocrByDocId[docId]) {
                    const group = ocrByDocId[docId][subIdx];
                    for (const fileKey in group) {
                        const ocrFields = group[fileKey];
                        const key = `${docId}-${subIdx}-${fileKey}`;
                        const firstPage = ocrFields.pages[1];
                        const documentGroup = firstPage?.documentGroup;

                        if (documentGroup && !thumbnailCache.current[key]) {
                            promises.push(
                                (async () => {
                                    try {
                                        const response = await apiListPdfAfter(documentGroup);
                                        const files = response.files || [];
                                        const matched = files.find(
                                            (f: any) => f.fileName?.replace(/\.pdf$/, "") === fileKey
                                        );
                                        if (!matched) {
                                            thumbnailCache.current[key] = [];
                                            return;
                                        }

                                        const res = await fetch(matched.previewUrl);
                                        const blob = await res.blob();
                                        const base64 = await new Promise<string>((resolve) => {
                                            const reader = new FileReader();
                                            reader.onloadend = () => resolve(reader.result as string);
                                            reader.readAsDataURL(blob);
                                        });

                                        const thumbs = await getPdfThumbnails(base64);
                                        thumbnailCache.current[key] = thumbs;
                                    } catch (e) {
                                        console.error("Thumbnail preload error:", e);
                                        thumbnailCache.current[key] = [];
                                    }
                                })()
                            );
                        }
                    }
                }
            }
            await Promise.all(promises);
            if (isMounted) {
                setCacheReady(true);
                setLoading(false);
                setCurrentPage(1);
            }
        };
        preloadAllThumbnails();

        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line
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
                const thumbs = thumbnailCache.current[key] || [];
                currentThumbnails = currentThumbnails.concat(thumbs);
            });
        }
    }

    const currentThumbnail = currentThumbnails[currentPage - 1] || null;

    let displayMsg = null;
    if (!currentThumbnails.length) {
        if (isUploaded) {
            displayMsg = (
                <p className="text-muted text-center">
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
            {loading || !cacheReady ? (
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

export default PdfPreview;
