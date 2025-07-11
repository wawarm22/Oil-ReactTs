// import React, { useEffect, useState } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import { apiListPdfAfter } from "../../utils/api/uploadApi";
// import { getTitleAndSubtitle } from "../../utils/function/getTitleAndSubtitle";
// import { DocumentItem } from "../../types/docList";
// import { OcrByDocIdType } from "../../types/checkList";
// import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

// interface OcrPageData {
//     documentGroup: string;
//     fileKey?: string;
//     pageNumber: string;
//     pageCount: string;
//     [key: string]: any;
// }
// interface PdfPreviewProps {
//     documentList: DocumentItem[];
//     folders: string[];
//     ocrFields: {
//         pages: { [page: number]: OcrPageData };
//         pageCount: number;
//     } | null;
//     ocrByDocId: OcrByDocIdType;
//     currentPage: number;
//     setCurrentPage: (page: number) => void;
//     selectedDocMeta?: { docId: number; subtitleIdx: number } | null;
//     isUploaded?: boolean;
// }

// // cache สำหรับ blob url หลาย doc/group
// const pdfBlobCache: Record<string, string> = {};

// const PdfPreview: React.FC<PdfPreviewProps> = ({
//     documentList,
//     ocrByDocId,
//     selectedDocMeta,
//     isUploaded,
//     currentPage,
// }) => {
//     const [loading, setLoading] = useState(false);
//     const [cacheReady, setCacheReady] = useState(false);
//     const [scale, setScale] = useState(1);
//     const [activeBlobUrl, setActiveBlobUrl] = useState<string | null>(null);

//     // preload pdf blobs ทุก doc/group/fileKey ที่มีใน ocrByDocId
//     useEffect(() => {
//         let isMounted = true;
//         setLoading(true);
//         setCacheReady(false);

//         const preloadAllPdfBlobs = async () => {
//             const promises: Promise<void>[] = [];
//             console.log("ocrByDocId", ocrByDocId);
            
//             for (const docId in ocrByDocId) {
//                 for (const subIdx in ocrByDocId[docId]) {
//                     const group = ocrByDocId[docId][subIdx];
//                     for (const fileKey in group) {
//                         const firstPage = group[fileKey]?.pages[1];
//                         const documentGroup = firstPage?.documentGroup;
//                         const cacheKey = `${docId}-${subIdx}-${fileKey}`;
//                         if (documentGroup && !pdfBlobCache[cacheKey]) {
//                             promises.push(
//                                 (async () => {
//                                     try {
//                                         const response = await apiListPdfAfter(documentGroup);
//                                         const files = response.files || [];
//                                         const matched = files.find(
//                                             (f: any) => f.fileName?.replace(/\.pdf$/, "") === fileKey
//                                         );
//                                         if (!matched) {
//                                             pdfBlobCache[cacheKey] = "";
//                                             return;
//                                         }
//                                         const res = await fetch(matched.previewUrl);
//                                         const blob = await res.blob();
//                                         const url = URL.createObjectURL(blob);
//                                         pdfBlobCache[cacheKey] = url;
//                                     } catch (e) {
//                                         console.error("Blob preload error:", e);
//                                         pdfBlobCache[cacheKey] = "";
//                                     }
//                                 })()
//                             );
//                         }
//                     }
//                 }
//             }
//             await Promise.all(promises);
//             if (isMounted) {
//                 setCacheReady(true);
//                 setLoading(false);
//             }
//         };
//         preloadAllPdfBlobs();

//         return () => { isMounted = false; };
//     }, [ocrByDocId]);

//     // ตั้งค่าตาม doc/group ที่เลือก
//     useEffect(() => {
//         if (!selectedDocMeta) {
//             setActiveBlobUrl(null);
//             return;
//         }
//         const { docId, subtitleIdx } = selectedDocMeta;
//         const group = ocrByDocId[docId]?.[subtitleIdx];
//         if (!group) {
//             setActiveBlobUrl(null);
//             return;
//         }
//         // สมมติใช้แค่ fileKey แรก
//         const fileKey = Object.keys(group)[0];
//         const cacheKey = `${docId}-${subtitleIdx}-${fileKey}`;
//         setActiveBlobUrl(pdfBlobCache[cacheKey] || null);
//     }, [selectedDocMeta, ocrByDocId, cacheReady]);

//     const displayTitle = selectedDocMeta
//         ? getTitleAndSubtitle(documentList, selectedDocMeta.docId, selectedDocMeta.subtitleIdx)
//         : "";

//     const handleZoom = (inOrOut: 1 | -1) => {
//         setScale(s => Math.max(0.5, Math.min(3, s + inOrOut * 0.2)));
//     };

//     const displayMsg = (
//         <p className="text-muted text-center" style={{ fontFamily: "IBM Plex Sans Thai" }}>
//             {!isUploaded ? (
//                 <>ไม่พบข้อมูลเอกสาร "{displayTitle}" <br />เนื่องจากไม่มีการอัพโหลดเอกสาร</>
//             ) : (
//                 <>กำลังประมวลผล OCR กรุณารอ... <br />"{displayTitle}"</>
//             )}
//         </p>
//     );

//     return (
//         <div
//             className="shadow-sm d-flex flex-column align-items-center justify-content-center"
//             style={{ width: "50%", background: "#E0E0E0", borderRadius: "8px", height: "800px" }}
//         >
//             {loading || !cacheReady ? (
//                 <div style={{ height: 740, display: "flex", alignItems: "center", justifyContent: "center" }}>
//                     <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
//                         <span className="visually-hidden">Loading...</span>
//                     </div>
//                 </div>
//             ) : activeBlobUrl ? (
//                 <div style={{ width: "100%", height: "740px", overflow: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
//                     <div style={{ marginBottom: 8, fontWeight: 500 }}>{displayTitle}</div>
//                     <div style={{ marginBottom: 8 }}>
//                         <button className="btn btn-outline-secondary btn-sm mx-1" onClick={() => handleZoom(1)}>+</button>
//                         <button className="btn btn-outline-secondary btn-sm mx-1" onClick={() => handleZoom(-1)}>-</button>
//                     </div>
//                     <Document
//                         file={activeBlobUrl}
//                         error={<div>ไม่สามารถโหลด PDF ได้</div>}
//                     >
//                         <Page
//                             pageNumber={currentPage}
//                             scale={scale}
//                             renderAnnotationLayer={false}
//                             renderTextLayer={false}
//                         />
//                     </Document>
//                 </div>
//             ) : (
//                 displayMsg
//             )}
//         </div>
//     );
// };

// export default PdfPreview;
