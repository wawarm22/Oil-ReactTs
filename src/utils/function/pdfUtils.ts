// @ts-ignore: Ignore TypeScript errors for missing declarations
import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs"; 
// @ts-ignore
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.mjs",
    import.meta.url
).toString();

export const getPdfThumbnails = async (pdfData: string): Promise<string[]> => {
    try {
        const loadingTask = pdfjsLib.getDocument({ data: atob(pdfData.split(",")[1]) });
        const pdf = await loadingTask.promise;

        const thumbnails: string[] = [];

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const scale = 1.5;
            const viewport = page.getViewport({ scale });

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            if (!context) throw new Error("Cannot get canvas context");

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({ canvasContext: context, viewport }).promise;
            thumbnails.push(canvas.toDataURL("image/png"));
        }

        return thumbnails;
    } catch (error) {
        console.error("Error generating PDF thumbnails:", error);
        return [];
    }
};

