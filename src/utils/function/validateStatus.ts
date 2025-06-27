import { OcrByDocIdType, ValidateResultsByDoc } from "../../types/checkList";
import { OCR_VALIDATE_MAP } from "../../utils/function/ocrValidateMap";

export function getFirstDocType(docGroup: any): string | undefined {
    if (!docGroup) return undefined;
    const fileKeys = Object.keys(docGroup);
    if (!fileKeys.length) return undefined;
    const firstFile = docGroup[fileKeys[0]];
    if (!firstFile) return undefined;
    const pageKeys = Object.keys(firstFile.pages);
    if (!pageKeys.length) return undefined;
    return firstFile.pages[pageKeys[0]]?.docType;
}

export function getOverallValidateStatus(
    docId: number,
    subtitleIdx: number,
    validateResultsByDoc: ValidateResultsByDoc,
    ocrByDocId: OcrByDocIdType
): "waiting" | "failed" | "passed" {
    let validatedPages = 0;
    let hasFailed = false;
    let totalValidatePages = 0;
    const docGroup = validateResultsByDoc[docId]?.[subtitleIdx];
    const ocrGroup = ocrByDocId[docId]?.[subtitleIdx];
    if (!docGroup || !ocrGroup) return "waiting";

    for (const fileKey of Object.keys(ocrGroup)) {
        const file = ocrGroup[fileKey];
        for (const p of Object.keys(file.pages)) {
            const page = (file.pages as Record<string, any>)[p];
            const docType = page?.docType;
            if (OCR_VALIDATE_MAP[docType]) {
                totalValidatePages++;
                const pageObj = docGroup[Number(p)];
                if (!pageObj || pageObj.validateResult === undefined) continue;
                validatedPages++;
                const checkFailed = OCR_VALIDATE_MAP[docType]?.checkFailed;
                if (typeof checkFailed === "function" && checkFailed(pageObj.validateResult)) {
                    hasFailed = true;
                }
            } 
            // else {
            //     // Alert dev: log warning for unknown docType
            //     if (process.env.NODE_ENV === "development") {
            //         // หรือจะใช้ Sentry, toast หรือ alert dev tool อื่นๆ ก็ได้
            //         // eslint-disable-next-line no-console
            //         // console.warn(`[DEV] Unrecognized docType "${docType}" for page:`, {
            //         //     docId,
            //         //     subtitleIdx,
            //         //     fileKey,
            //         //     pageNumber: p,
            //         // });
            //     }
            // }
        }
    }
    if (hasFailed) return "failed";
    if (validatedPages === totalValidatePages && totalValidatePages > 0) return "passed";
    return "waiting";
}