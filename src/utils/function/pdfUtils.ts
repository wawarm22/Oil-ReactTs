// @ts-ignore: Ignore TypeScript errors for missing declarations
import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs"; 
// @ts-ignore
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.mjs",
    import.meta.url
).toString();

export const getPdfThumbnail = async (pdfUrl: string): Promise<string> => {
    try {
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

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
        console.error("Error generating PDF thumbnail:", error);
        return "/default-pdf-thumbnail.png";
    }
};