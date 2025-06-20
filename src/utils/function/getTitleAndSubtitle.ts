import { DocumentItem } from "../../types/docList";

export function getTitleAndSubtitle(
    documentList: DocumentItem[],
    docId?: number | null,
    subtitleIdx?: number | null
): string {
    if (docId == null) return "";
    const docItem = documentList.find(d => d.id === docId);
    if (!docItem) return "";
    if (docItem.subtitle && docItem.subtitle.length > 0 && subtitleIdx != null) {
        // subtitleIdx อาจเป็น 0 ด้วย
        return docItem.subtitle[subtitleIdx] || docItem.title;
    }
    return docItem.title;
}
