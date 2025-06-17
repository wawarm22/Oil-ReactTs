import { ValidateResultsByDoc } from "../../types/checkList";

// สามารถปรับปรุงให้รองรับ validateResult หลาย format ได้
export function isPageFailed(
  validateResultsByDoc: ValidateResultsByDoc,
  selectedDocId: number | null,
  selectedSubtitleIdx: number | null,
  pageNum: number
): boolean {
  if (
    selectedDocId == null ||
    selectedSubtitleIdx == null ||
    !validateResultsByDoc[selectedDocId]?.[selectedSubtitleIdx]?.[pageNum]?.validateResult
  ) return false;

  const validateResult = validateResultsByDoc[selectedDocId][selectedSubtitleIdx][pageNum]?.validateResult;
  if (validateResult?.status === false) return true;
  if (Array.isArray(validateResult?.data)) {
    if (validateResult.data.some((row: any) => {
      if (row?.passed === false) return true;
      if (row?.properties) {
        return Object.values(row.properties).some((cell: any) => cell?.passed === false);
      }
      return false;
    })) return true;
  }
  return false;
}
