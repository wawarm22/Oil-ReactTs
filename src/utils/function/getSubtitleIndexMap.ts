// utils/getSubtitleIndexMap.ts (หรือจะวางบนสุดของ MatchDocument.tsx ก็ได้)
export function getSubtitleIndexMap(
    documentList: { id: number; subtitle?: string[] }[],
    ocrByDocId: any,
    transport: string,
    currentStep: number
): { [docId: number]: number[] } {
    if (currentStep !== 1) return {};

    const map: { [docId: number]: number[] } = {};

    documentList.forEach(doc => {
        if (
            transport === "01" &&
            doc.id === 28 &&
            Array.isArray(doc.subtitle) &&
            doc.subtitle.length > 0
        ) {
            const indices: number[] = [];
            doc.subtitle.forEach((_, idx) => {
                const docGroup = ocrByDocId?.[28]?.[idx];
                if (!docGroup) return;
                for (const fileKey in docGroup) {
                    const pages = docGroup[fileKey].pages;
                    const pageNums = Object.keys(pages);
                    if (pageNums.length > 0) {
                        const firstPage = pages[Number(pageNums[0])];
                        const documentGroup = firstPage?.documentGroup;
                        if (documentGroup) {
                            const parts = documentGroup.split("/");
                            const subtitleRealIdx = parseInt(parts[parts.length - 1], 10) - 1;
                            if (!isNaN(subtitleRealIdx)) indices.push(subtitleRealIdx);
                        }
                        break;
                    }
                }
            });
            map[doc.id] = indices;
        }
        if (
            transport === "00" &&
            doc.id === 3 &&
            Array.isArray(doc.subtitle) &&
            doc.subtitle.length > 0
        ) {
            const indices: number[] = [];
            doc.subtitle.forEach((_, idx) => {
                const docGroup = ocrByDocId?.[3]?.[idx];
                if (!docGroup) return;
                for (const fileKey in docGroup) {
                    const pages = docGroup[fileKey].pages;
                    const pageNums = Object.keys(pages);
                    if (pageNums.length > 0) {
                        const firstPage = pages[Number(pageNums[0])];
                        const documentGroup = firstPage?.documentGroup;
                        if (documentGroup) {
                            const parts = documentGroup.split("/");
                            const subtitleRealIdx = parseInt(parts[parts.length - 1], 10) - 1;
                            if (!isNaN(subtitleRealIdx)) indices.push(subtitleRealIdx);
                        }
                        break;
                    }
                }
            });
            map[doc.id] = indices;
        }
    });
    return map;
}
