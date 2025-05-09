import React, { useEffect, useState } from "react";
import { DocumentItem } from "../../types/docList";
import { apiGetAllOcr } from "../../utils/api/OcrListApi";
import { OcrFields } from "../../types/ocrFileType";
import MotionCard from "../reusable/MotionCard";
import { useSocket } from "../../hook/socket";

interface Props {
    documentList: DocumentItem[];
    folders: string[];
    onSelectDocument: (
        singlePageOcr: OcrFields | null,
        fullOcrPages: {
            pages: { [page: number]: OcrFields };
            pageCount: number;
            pageFileKeyMap: { [page: number]: string }; // ✅ เพิ่มตรงนี้
        } | null
    ) => void;
}

const DocumentChecklist: React.FC<Props> = ({ documentList, folders, onSelectDocument }) => {
    const [ocrByDocId, setOcrByDocId] = useState<{
        [docId: number]: {
            [subtitleIndex: number]: {
                [fileKey: string]: {
                    pages: { [pageNum: number]: OcrFields };
                    pageCount: number;
                };
            };
        };
    }>({});

    const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
    const [selectedSubtitleIdx, setSelectedSubtitleIdx] = useState<number | null>(null);
    const { addCallbacks, removeCallbacks } = useSocket();

    const transportFilter = localStorage.getItem("transport");

    const filteredList = documentList.filter(item =>
        !transportFilter || item.transport === transportFilter
    );

    const fetchOcrData = async () => {
        const results: {
            [docId: number]: {
                [subtitleIndex: number]: {
                    [fileKey: string]: {
                        pages: { [pageNum: number]: OcrFields },
                        pageCount: number
                    }
                }
            }
        } = {};

        for (const folder of folders) {
            try {
                const data = await apiGetAllOcr(folder);
                const documents = data?.documents ?? [];

                for (const document of documents) {
                    const fileName = document.plainOriginalFileName ?? '';
                    const fileKey = fileName.replace(/\.pdf_page\d+$/, '');

                    const groupParts = fileName.split('/');
                    const len = groupParts.length;

                    let docId = 0;
                    let subtitleIndex = 0;

                    if (len >= 2 && !isNaN(Number(groupParts[len - 2]))) {
                        docId = parseInt(groupParts[len - 2]);
                    }

                    if (len >= 3 && !isNaN(Number(groupParts[len - 3])) && !isNaN(Number(groupParts[len - 2]))) {
                        docId = parseInt(groupParts[len - 3]);
                        subtitleIndex = parseInt(groupParts[len - 2]) - 1;
                    }

                    const pageNumber = parseInt(document.pageNumber ?? "1");
                    const pageCount = parseInt(document.pageCount ?? "1");

                    if (!results[docId]) results[docId] = {};
                    if (!results[docId][subtitleIndex]) results[docId][subtitleIndex] = {};
                    if (!results[docId][subtitleIndex][fileKey]) {
                        results[docId][subtitleIndex][fileKey] = {
                            pages: {},
                            pageCount
                        };
                    }

                    results[docId][subtitleIndex][fileKey].pages[pageNumber] = {
                        ...document.fields,
                        fileKey,
                        documentGroup: document.documentGroup,
                    };
                }

            } catch (err) {
                console.error("OCR fetch failed:", err);
            }
        }

        console.log("results", results);
        setOcrByDocId(results);
    };

    useEffect(() => {
        if (folders.length > 0) {
            fetchOcrData();
        }
    }, [folders]);

    useEffect(() => {
        const handleSocketUpdate = () => {
            console.log("orc");

            if (folders.length > 0) {
                fetchOcrData();
            }
        };

        addCallbacks("ocr-refresh-checklist", handleSocketUpdate);
        return () => removeCallbacks("ocr-refresh-checklist");
    }, [folders]);

    const handleSelect = (docId: number, subtitleIndex = 0) => {
        const docGroup = ocrByDocId[docId]?.[subtitleIndex];
        if (!docGroup) {
            onSelectDocument(null, null);
            return;
        }

        // ✅ เรียง fileKeys ตามเลขท้าย -1, -2, -3...
        const fileKeys = Object.keys(docGroup).sort((a, b) => {
            const numA = parseInt(a.match(/-(\d+)$/)?.[1] || "0", 10);
            const numB = parseInt(b.match(/-(\d+)$/)?.[1] || "0", 10);
            return numA - numB;
        });

        const combinedPages: { [page: number]: OcrFields } = {};
        const pageFileKeyMap: { [page: number]: string } = {};
        let pageOffset = 0;

        fileKeys.forEach((fileKey) => {
            const fileData = docGroup[fileKey];
            const pages = fileData.pages;
            const pageCount = fileData.pageCount;

            for (let p = 1; p <= pageCount; p++) {
                const logicalPage = pageOffset + p;
                combinedPages[logicalPage] = pages[p];
                pageFileKeyMap[logicalPage] = fileKey;
            }

            pageOffset += pageCount;
        });

        const currentPage = 1;
        const selectedFields = combinedPages[currentPage];

        onSelectDocument(selectedFields, {
            pages: combinedPages,
            pageCount: pageOffset,
            pageFileKeyMap, // ✅ ส่ง map นี้ไปด้วย
        });

        setSelectedDocId(docId);
        setSelectedSubtitleIdx(subtitleIndex);
    };

    return (
        <div className="shadow-sm bg-white rounded-2 p-3" style={{ width: "25%", overflowY: "auto" }}>
            {filteredList.map((item, index) => {
                const defaultSubIdx = 0;
                const group = ocrByDocId[item.id]?.[defaultSubIdx];
                const hasOcr = group && Object.values(group).some(file => Object.keys(file.pages || {}).length > 0);

                return (
                    <div key={index} className="mb-1 d-flex">
                        <div
                            className="me-2 rounded-2"
                            style={{
                                width: "4px",
                                height: "38px",
                                backgroundColor: hasOcr ? "green" : "#BDBDBD"
                            }}
                        />
                        <div className="flex-grow-1">
                            <MotionCard
                                onClick={() => handleSelect(item.id)}
                                isSelected={selectedDocId === item.id && selectedSubtitleIdx === 0}
                                width="100%"
                                height="auto"
                                textSize="14px"
                                container="d-flex align-items-center justify-content-between p-2 mb-2 shadow-sm rounded-2"
                                style={{
                                    border: '1px solid #dee2e6',
                                    borderLeft: hasOcr ? '6px solid green' : '6px solid #BDBDBD',
                                }}
                            >
                                {item.title}
                            </MotionCard>

                            {item.subtitle && (
                                <div className="ps-4">
                                    {item.subtitle.map((subItem, subIdx) => {
                                        const subGroup = ocrByDocId[item.id]?.[subIdx];
                                        const hasOcrSub = subGroup && Object.values(subGroup).some(file => Object.keys(file.pages || {}).length > 0);

                                        return (
                                            <div key={subIdx} className="d-flex">
                                                <div
                                                    className="me-2 rounded-2"
                                                    style={{
                                                        width: "4px",
                                                        height: "38px",
                                                        backgroundColor: hasOcrSub ? "green" : "#BDBDBD"
                                                    }}
                                                />
                                                <MotionCard
                                                    onClick={() => handleSelect(item.id, subIdx)}
                                                    isSelected={selectedDocId === item.id && selectedSubtitleIdx === subIdx}
                                                    width="100%"
                                                    height="auto"
                                                    textSize="12px"
                                                    container="d-flex align-items-center justify-content-between p-2 mb-2 shadow-sm rounded-2"
                                                    style={{
                                                        border: '1px solid #dee2e6',
                                                        borderLeft: hasOcrSub ? '6px solid green' : '6px solid #BDBDBD',
                                                    }}
                                                >
                                                    {subItem}
                                                </MotionCard>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}

        </div>
    );
};

export default DocumentChecklist;
