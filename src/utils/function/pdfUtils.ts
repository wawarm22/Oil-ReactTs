// @ts-ignore: Ignore TypeScript errors for missing declarations
import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs"; 
// @ts-ignore
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.mjs",
    import.meta.url
).toString();

export const getPdfThumbnail = async (pdfData: string, pageNum: number): Promise<string> => {
    try {
        const loadingTask = pdfjsLib.getDocument({ data: atob(pdfData.split(",")[1]) });
        const pdf = await loadingTask.promise;

        // ป้องกันการเรียกหน้าที่เกินจากจำนวนหน้าที่มี
        const validPageNum = Math.max(1, Math.min(pageNum, pdf.numPages));
        const page = await pdf.getPage(validPageNum);

        const scale = 1.5;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
            throw new Error("Cannot get canvas context");
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        return canvas.toDataURL("image/png");
    } catch (error) {
        console.error(`Error generating PDF thumbnail for page ${pageNum}:`, error);
        return "/default-pdf-thumbnail.png";
    }
};
