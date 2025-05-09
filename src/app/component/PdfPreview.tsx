import React, { useEffect, useState } from "react";
import { apiListPdfAfter } from "../../utils/api/uploadApi";
import Pagination from "../reusable/Pagination";
import { getPdfThumbnails } from "../../utils/function/pdfUtils";

interface OcrPageData {
    documentGroup: string;
    fileKey?: string;
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
                totalPages={thumbnails.length || 1}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default PdfPreview;
