import { ValidateResultsByDoc } from "../../types/checkList";
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
    pageCount: number,
    validateResultsByDoc: ValidateResultsByDoc
): "waiting" | "failed" | "passed" {
    let validatedPages = 0;
    let hasFailed = false;
    const docGroup = validateResultsByDoc[docId]?.[subtitleIdx];
    if (!docGroup) return "waiting";

    for (let p = 1; p <= pageCount; p++) {
        const pageObj = docGroup[p];
        if (!pageObj || pageObj.validateResult === undefined) continue;
        validatedPages++;
        const docType = pageObj.docType;
        const checkFailed = OCR_VALIDATE_MAP[docType]?.checkFailed;
        if (typeof checkFailed === "function" && checkFailed(pageObj.validateResult)) {
            hasFailed = true;
        }
    }
    if (hasFailed) return "failed";
    if (validatedPages === pageCount && pageCount > 0) return "passed";
    return "waiting";
}