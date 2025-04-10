import React, { useEffect, useState } from "react";
import { apiListPdfFiles } from "../../utils/api/uploadApi";
import { OcrFields } from "../../types/ocrFileType";
import { PdfListResponse } from "../../types/uploadTypes";
import { getPdfThumbnail } from "../../utils/function/pdfUtils";
import Pagination from "../reusable/Pagination";

interface Props {
    imageSrc: string | null;
    currentPage: number;
    ocrFields: OcrFields | null;
}

const PdfPreview: React.FC<Props> = ({ ocrFields }) => {
    const [thumbnails, setThumbnails] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        if (!ocrFields) return;

        const fetchPdfThumbnails = async () => {
            try {
                const response: PdfListResponse = await apiListPdfFiles(ocrFields.documentGroup);
                const urls = response.files.map(item => item.previewUrl);

                const thumbnails: string[] = [];

                for (let i = 0; i < urls.length; i++) {
                    const res = await fetch(urls[i]);
                    const blob = await res.blob();

                    const reader = new FileReader();
                    const base64: string = await new Promise((resolve) => {
                        reader.onloadend = () => resolve(reader.result as string);
                        reader.readAsDataURL(blob);
                    });

                    const thumbnail = await getPdfThumbnail(base64, 1); // หน้า 1 ของแต่ละไฟล์
                    thumbnails.push(thumbnail);
                }

                setThumbnails(thumbnails);
                setCurrentPage(1); // reset หน้าเมื่อมีข้อมูลใหม่
            } catch (err) {
                console.error("Failed to fetch PDF thumbnails:", err);
            }
        };

        fetchPdfThumbnails();
    }, [ocrFields]);

    const currentThumbnail = thumbnails[currentPage - 1];

    return (
        <div
            className="shadow-sm rounded-2 p-3 d-flex flex-column align-items-center gap-3"
            style={{ width: "45%", background: "#E0E0E0", borderRadius: "8px", height: "700px" }}
        >
            {currentThumbnail ? (
                <img
                    src={currentThumbnail}
                    alt={`Page ${currentPage}`}
                    style={{ maxWidth: "100%", maxHeight: "600px", objectFit: "contain", borderRadius: "6px" }}
                />
            ) : (
                <p className="text-muted">ไม่มีหน้าที่ {currentPage}</p>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={thumbnails.length}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default PdfPreview;
