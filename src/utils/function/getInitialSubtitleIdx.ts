export function getInitialSubtitleIdx(
    docId: number,
    step: number,
    subtitleIndexMap?: { [docId: number]: number[] }
) {
    if (
        step === 1 &&
        (docId === 3 || docId === 28) &&
        subtitleIndexMap &&
        subtitleIndexMap[docId] &&
        subtitleIndexMap[docId].length > 0
    ) {
        return subtitleIndexMap[docId][0];
    }
    return 0;
}
