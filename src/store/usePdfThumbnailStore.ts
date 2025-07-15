import { create } from "zustand";

type ThumbnailCache = Record<string, (string | null)[]>;
type LoadingState = Record<string, boolean>;

interface PdfThumbnailStoreState {
    thumbnailCache: ThumbnailCache;
    loadingState: LoadingState;
    setThumbnail: (key: string, thumbs: (string | null)[]) => void;
    setLoading: (key: string, loading: boolean) => void;
    preloadThumbnails: (
        ocrByDocId: any,
        apiListPdfAfter: any,
        getPdfThumbnails: any
    ) => Promise<void>;
}

export const usePdfThumbnailStore = create<PdfThumbnailStoreState>((set, get) => ({
    thumbnailCache: {},
    loadingState: {},
    setThumbnail: (key, thumbs) =>
        set((state) => ({
            thumbnailCache: { ...state.thumbnailCache, [key]: thumbs },
        })),
    setLoading: (key, loading) =>
        set((state) => ({
            loadingState: { ...state.loadingState, [key]: loading },
        })),
    preloadThumbnails: async (ocrByDocId, apiListPdfAfter, getPdfThumbnails) => {
        const promises: Promise<void>[] = [];
        for (const docId in ocrByDocId) {
            for (const subIdx in ocrByDocId[docId]) {
                const group = ocrByDocId[docId][subIdx];
                for (const fileKey in group) {
                    const ocrFields = group[fileKey];
                    const key = `${docId}-${subIdx}-${fileKey}`;
                    if (get().thumbnailCache[key]) continue;
                    get().setLoading(key, true);
                    const firstPage = ocrFields.pages[1];
                    const documentGroup = firstPage?.documentGroup;
                    if (!documentGroup) continue;
                    promises.push(
                        (async () => {
                            try {
                                const response = await apiListPdfAfter(documentGroup);
                                const files = response.files || [];
                                const matched = files.find(
                                    (f: any) => f.fileName?.replace(/\.pdf$/, "") === fileKey
                                );
                                if (!matched) {
                                    get().setThumbnail(key, []);
                                    get().setLoading(key, false);
                                    return;
                                }
                                const res = await fetch(matched.previewUrl);
                                const blob = await res.blob();
                                const base64 = await new Promise<string>((resolve) => {
                                    const reader = new FileReader();
                                    reader.onloadend = () => resolve(reader.result as string);
                                    reader.readAsDataURL(blob);
                                });
                                const thumbs = await getPdfThumbnails(base64);
                                get().setThumbnail(key, thumbs);
                            } catch (e) {
                                console.error("Thumbnail preload error:", e);
                                get().setThumbnail(key, []);
                            } finally {
                                get().setLoading(key, false);
                            }
                        })()
                    );
                }
            }
        }
        await Promise.all(promises);
    },
}));
