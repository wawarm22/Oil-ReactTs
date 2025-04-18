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
        fullOcrPages: { pages: { [page: number]: OcrFields }; pageCount: number } | null
    ) => void

}

const DocumentChecklist: React.FC<Props> = ({ documentList, folders, onSelectDocument }) => {
    const [ocrByDocId, setOcrByDocId] = useState<{ [docId: number]: any }>({});
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
                    pages: { [pageNum: number]: OcrFields },
                    pageCount: number
                }
            }
        } = {};

        for (const folder of folders) {
            try {
                const data = await apiGetAllOcr(folder);
                const documents = data?.documents ?? [];

                for (const document of documents) {
                    const groupParts = document.documentGroup.split('/');
                    const len = groupParts.length;

                    let docId = 0;
                    let subtitleIndex = 0;

                    if (len >= 2 && !isNaN(Number(groupParts[len - 1]))) {
                        docId = parseInt(groupParts[len - 1]);
                    }

                    if (len >= 3 && !isNaN(Number(groupParts[len - 2])) && !isNaN(Number(groupParts[len - 1]))) {
                        docId = parseInt(groupParts[len - 2]);
                        subtitleIndex = parseInt(groupParts[len - 1]) - 1;
                    }

                    const pageNumber = parseInt(document.pageNumber ?? "1");
                    const pageCount = parseInt(document.pageCount ?? "1");

                    if (!results[docId]) results[docId] = {};
                    if (!results[docId][subtitleIndex]) {
                        results[docId][subtitleIndex] = {
                            pages: {},
                            pageCount: pageCount
                        };
                    }

                    results[docId][subtitleIndex].pages[pageNumber] = document.fields;
                }

            } catch (err) {
                console.error("OCR fetch failed:", err);
            }
        }

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

        const pages = docGroup.pages;
        const pageCount = docGroup.pageCount;

        const currentPage = 1;
        const selectedFields = pages[currentPage];

        onSelectDocument(selectedFields, { pages, pageCount });
        setSelectedDocId(docId);
        setSelectedSubtitleIdx(subtitleIndex);
    };

    return (
        <div className="shadow-sm bg-white rounded-2 p-3" style={{ width: "30%", overflowY: "auto" }}>
            {filteredList.map((item, index) => (
                <div key={index} className="mb-1 d-flex">
                    <div
                        className="me-2 rounded-2"
                        style={{
                            width: "4px",
                            height: "38px",
                            backgroundColor: ocrByDocId[item.id]?.[0]?.pages ? "green" : "#BDBDBD"
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
                                borderLeft: ocrByDocId[item.id]?.[0]?.pages ? '6px solid green' : '6px solid #BDBDBD',
                            }}
                        >
                            {item.title}
                        </MotionCard>


                        {item.subtitle && (
                            <div className="ps-4">
                                {item.subtitle.map((subItem, subIdx) => (
                                    <div key={subIdx} className="d-flex">
                                        <div
                                            className="me-2 rounded-2"
                                            style={{
                                                width: "4px",
                                                height: "38px",
                                                backgroundColor: ocrByDocId[item.id]?.[subIdx]?.pages ? "green" : "#BDBDBD"
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
                                                borderLeft: ocrByDocId[item.id]?.[subIdx]?.pages ? '6px solid green' : '6px solid #BDBDBD',
                                            }}
                                        >
                                            {subItem}
                                        </MotionCard>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DocumentChecklist;
