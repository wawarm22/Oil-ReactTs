import React, { useEffect, useState, useRef } from "react";
import { apiListPdfAfter } from "../../utils/api/uploadApi";
import { getPdfThumbnails } from "../../utils/function/pdfUtils";
import { DocumentItem } from "../../types/docList";
import { getTitleAndSubtitle } from "../../utils/function/getTitleAndSubtitle";

interface OcrPageData {
    documentGroup: string;
    fileKey?: string;
    pageNumber: string;
    pageCount: string;
    [key: string]: any;
}

interface PdfPreviewProps {
    documentList: DocumentItem[];
    ocrFields: {
        pages: { [page: number]: OcrPageData };
        pageCount: number;
    } | null;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    selectedDocMeta?: { docId: number; subtitleIdx: number } | null;
    isUploaded?: boolean;
}

type CacheKey = string;
type ThumbnailCache = Record<CacheKey, (string | null)[]>;

const PdfPreview: React.FC<PdfPreviewProps> = ({
    documentList,
    ocrFields,
    currentPage,
    setCurrentPage,
    selectedDocMeta,
    isUploaded
}) => {
    const [thumbnails, setThumbnails] = useState<(string | null)[]>([]);
    const [loading, setLoading] = useState(false);

    const thumbnailCache = useRef<ThumbnailCache>({});

    console.log("ocrFields", ocrFields);

    const getCacheKey = (ocrFields: PdfPreviewProps["ocrFields"]) => {
        if (!ocrFields) return "";
        const firstPage = ocrFields.pages[1];
        return firstPage?.documentGroup + "-" + ocrFields.pageCount;
    };

    useEffect(() => {
        const loadThumbnails = async () => {
            if (!ocrFields) {
                setThumbnails([]);
                return;
            }
            setLoading(true);

            const cacheKey = getCacheKey(ocrFields);

            if (cacheKey && thumbnailCache.current[cacheKey]) {
                setThumbnails(thumbnailCache.current[cacheKey]);
                setLoading(false);
                return;
            }

            const collectedThumbnails: (string | null)[] = [];
            const seenFileKeys = new Set<string>();

            for (let i = 1; i <= ocrFields.pageCount; i++) {
                const pageData = ocrFields.pages[i];
                const docGroup = pageData.documentGroup;
                if (!docGroup) continue;

                try {
                    const response = await apiListPdfAfter(docGroup);
                    const files = response.files || [];
                    for (const file of files) {
                        const fileKey = file.fileName?.replace(/\.pdf$/, "");
                        if (!fileKey || seenFileKeys.has(fileKey)) continue;

                        seenFileKeys.add(fileKey);

                        const res = await fetch(file.previewUrl);
                        const blob = await res.blob();

                        const base64 = await new Promise<string>((resolve) => {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result as string);
                            reader.readAsDataURL(blob);
                        });

                        const fileThumbnails = await getPdfThumbnails(base64);
                        collectedThumbnails.push(...fileThumbnails);
                    }
                } catch (err) {
                    console.error(`Failed to load thumbnails from ${docGroup}:`, err);
                }
            }

            setThumbnails(collectedThumbnails);
            if (cacheKey) thumbnailCache.current[cacheKey] = collectedThumbnails;
            setLoading(false);
            setCurrentPage(1);
        };

        loadThumbnails();
        // eslint-disable-next-line
    }, [ocrFields]);

    const currentThumbnail = thumbnails[currentPage - 1];

    const displayTitle = getTitleAndSubtitle(documentList, selectedDocMeta?.docId, selectedDocMeta?.subtitleIdx);
    let displayMsg = null;
    if (!ocrFields) {
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
            {loading ? (
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
