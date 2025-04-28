import React, { useEffect, useState } from "react";
import { apiListPdfAfter } from "../../utils/api/uploadApi";
import { getPdfThumbnail } from "../../utils/function/pdfUtils";
import Pagination from "../reusable/Pagination";

interface OcrPageData {
    documentGroup: string;
    pageNumber: string;
    pageCount: string;
    [key: string]: any;
}

interface PdfPreviewProps {
    ocrFields: {
        pages: {
            [page: number]: OcrPageData;
        };
        pageCount: number;
    } | null;
}

const PdfPreview: React.FC<PdfPreviewProps> = ({ ocrFields }) => {
    const [thumbnails, setThumbnails] = useState<(string | null)[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        if (!ocrFields) return;

        const preloadAllThumbnails = async () => {
            const pageCount = ocrFields.pageCount;
            const newThumbnails: (string | null)[] = [];

            for (let i = 1; i <= pageCount; i++) {
                const pageData = ocrFields.pages[i];
                if (!pageData?.documentGroup) {
                    newThumbnails[i - 1] = null;
                    continue;
                }

                try {
                    const response = await apiListPdfAfter(pageData.documentGroup);
                    const previewUrl = response.files?.[0]?.previewUrl;
                    if (!previewUrl) {
                        newThumbnails[i - 1] = null;
                        continue;
                    }

                    const res = await fetch(previewUrl);
                    const blob = await res.blob();

                    const base64 = await new Promise<string>((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result as string);
                        reader.readAsDataURL(blob);
                    });

                    const thumbnail = await getPdfThumbnail(base64, i);
                    newThumbnails[i - 1] = thumbnail;
                } catch (err) {
                    console.error(`Failed to load thumbnail for page ${i}:`, err);
                    newThumbnails[i - 1] = null;
                }
            }

            setThumbnails(newThumbnails);
            setCurrentPage(1);
        };

        preloadAllThumbnails();
    }, [ocrFields]);

    const currentThumbnail = thumbnails[currentPage - 1];

    return (
        <div
            className="shadow-sm pt-3 d-flex flex-column align-items-center"
            style={{ width: "50%", background: "#E0E0E0", borderRadius: "8px", height: "800px" }}
        >
            {currentThumbnail ? (
                <img
                    src={currentThumbnail}
                    alt={`Page ${currentPage}`}
                    style={{ maxWidth: "100%", height: "740px", objectFit: "contain", borderRadius: "6px" }}
                />
            ) : (
                <p className="text-muted">ไม่มีหน้าที่ {currentPage}</p>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={ocrFields?.pageCount || 1}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default PdfPreview;
