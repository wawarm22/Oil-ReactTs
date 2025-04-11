import React, { useEffect, useState } from "react";
import { DocumentItem } from "../../types/docList";
import { apiGetAllOcr } from "../../utils/api/OcrListApi";
import { OcrFields } from "../../types/ocrFileType";

interface Props {
    documentList: DocumentItem[];
    folders: string[];
    ocrTrigger: number;
    onSelectDocument: (
        singlePageOcr: OcrFields | null,
        fullOcrPages: { pages: { [page: number]: OcrFields }; pageCount: number } | null
    ) => void

}

const DocumentChecklist: React.FC<Props> = ({ documentList, folders, onSelectDocument, ocrTrigger }) => {
    const [ocrByDocId, setOcrByDocId] = useState<{ [docId: number]: any }>({});

    useEffect(() => {
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

            console.log("Final OCR by page:", results);
            setOcrByDocId(results);
        };

        if (folders.length > 0) {
            fetchOcrData();
        }
    }, [folders, ocrTrigger]);

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
    };


    return (
        <div className="shadow-sm bg-white rounded-2 p-3" style={{ width: "30%", overflowY: "auto" }}>
            {documentList.map((item, index) => (
                <div key={index} className="mb-1 d-flex">
                    <div className="me-2 rounded-2" style={{ width: "4px", height: "38px", backgroundColor: "#BDBDBD" }} />
                    <div className="flex-grow-1">
                        <div
                            className="d-flex align-items-center justify-content-between p-2 mb-2 border shadow-sm rounded-2"
                            onClick={() => handleSelect(item.id)}
                            style={{ cursor: "pointer" }}
                        >
                            <span className="fw-bold" style={{ fontSize: "14px" }}>{item.title}</span>
                        </div>

                        {item.subtitle && (
                            <div className="ps-4">
                                {item.subtitle.map((subItem, subIdx) => (
                                    <div key={subIdx} className="d-flex">
                                        <div className="me-2 rounded-2" style={{ width: "4px", height: "38px", backgroundColor: "#BDBDBD", fontSize: '14px' }} />
                                        <div
                                            className="flex-grow-1 d-flex align-items-center justify-content-between p-2 mb-2 border shadow-sm rounded-2"
                                            onClick={() => handleSelect(item.id, subIdx)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <span className="fw-bold" style={{ fontSize: "12px" }}>{subItem}</span>
                                        </div>
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
