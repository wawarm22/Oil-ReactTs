import React, { useEffect, useState } from "react";
import { DocumentItem } from "../../types/docList";
import { apiGetAllOcr } from "../../utils/api/OcrListApi";
import { OcrFields } from "../../types/ocrFileType";
import MotionCard from "../reusable/MotionCard";
import { useSocket } from "../../hook/socket";
import { FaCheckCircle } from "react-icons/fa";
import { MdDownloading } from "react-icons/md";
import { parseUploadedStatus } from "../../utils/function/parseUploadedStatus";

interface Props {
    documentList: DocumentItem[];
    folders: string[];
    onSelectDocument: (
        singlePageOcr: OcrFields | null,
        fullOcrPages: {
            pages: { [page: number]: OcrFields };
            pageCount: number;
            pageFileKeyMap: { [page: number]: string };
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
    const uploadedStatus = parseUploadedStatus(folders);

    // หา doc/subtitle ตัวแรกที่อัปโหลดแล้ว
    const findFirstUploadedDoc = () => {
        for (const item of filteredList) {
            if (item.subtitle && item.subtitle.length > 0) {
                for (let subIdx = 0; subIdx < item.subtitle.length; subIdx++) {
                    if (uploadedStatus[item.id]?.has(subIdx)) {
                        return { docId: item.id, subtitleIdx: subIdx };
                    }
                }
            }
            if (uploadedStatus[item.id]?.has(0)) {
                return { docId: item.id, subtitleIdx: 0 };
            }
        }
        return null;
    };

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
                console.log("data", data);
                
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
                        docType: document.docType,
                        id: document.id
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
            if (folders.length > 0) {
                fetchOcrData();
            }
        };
        addCallbacks("ocr-refresh-checklist", handleSocketUpdate);
        return () => removeCallbacks("ocr-refresh-checklist");
    }, [folders]);

    // ตั้งค่าเลือก doc/subtitle ที่ isUploaded อัตโนมัติ
    useEffect(() => {
        if (selectedDocId === null && selectedSubtitleIdx === null) {
            const firstUploaded = findFirstUploadedDoc();
            if (firstUploaded) {
                handleSelect(firstUploaded.docId, firstUploaded.subtitleIdx);
            }
        }
        // eslint-disable-next-line
    }, [ocrByDocId, filteredList]);

    // --- ฟังก์ชันสถานะ/สี ---
    const getStatus = (
        isSelected: boolean,
        hasOcr: boolean,
        isUploaded: boolean
    ) => {
        if (isSelected && !hasOcr && isUploaded) {
            return { Icon: MdDownloading, iconColor: "#000000", bg: "#FFCA04", textColor: "#000000", bar: "#FFCA04" };
        }
        if (isSelected && hasOcr) {
            return { Icon: FaCheckCircle, iconColor: "#ffffff", bg: "#22C659", textColor: "#ffffff", bar: "#22C659" };
        }
        if (hasOcr) {
            return { Icon: FaCheckCircle, iconColor: "#22C659", bg: "#ffffff", textColor: "#000000", bar: "#22C659" };
        }
        if (isUploaded) {
            return { Icon: MdDownloading, iconColor: "#FFCA04", bg: "#ffffff", textColor: "#000000", bar: "#FFCA04" };
        }
        return { Icon: MdDownloading, iconColor: "#BDBDBD", bg: "#ffffff", textColor: "#000000", bar: "#BDBDBD" };
    };

    // ----
    const handleSelect = (docId: number, subtitleIndex = 0) => {
        const docGroup = ocrByDocId[docId]?.[subtitleIndex];
        if (!docGroup) {
            onSelectDocument(null, null);
            setSelectedDocId(docId);
            setSelectedSubtitleIdx(subtitleIndex);
            return;
        }

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
            pageFileKeyMap,
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
                const isSelected = selectedDocId === item.id && selectedSubtitleIdx === 0;
                const isUploaded = uploadedStatus[item.id]?.has(defaultSubIdx) ?? false;
                const { Icon, iconColor, bg, textColor, bar } = getStatus(isSelected, hasOcr, isUploaded);

                return (
                    <div key={index} className="d-flex mb-1">
                        <div className="flex-grow-1">
                            <div className="position-relative">
                                <MotionCard
                                    onClick={() => handleSelect(item.id)}
                                    isSelected={isSelected}
                                    width="100%"
                                    minHeight="48px"
                                    textSize="14px"
                                    container="d-flex align-items-center justify-content-between py-1 pe-2 mb-2 shadow-sm rounded-2 position-relative"
                                    backgroundColor={bg}
                                    color={textColor}
                                    style={{
                                        border: '1px solid #dee2e6',
                                        paddingLeft: "45px"
                                    }}
                                >
                                    <Icon
                                        size={25}
                                        className="position-absolute"
                                        style={{
                                            left: "10px", top: "50%", transform: "translateY(-50%)", color: iconColor
                                        }}
                                    />
                                    <div
                                        className="rounded-2 position-absolute top-0 bottom-0"
                                        style={{ width: "3px", backgroundColor: bar, left: "-10px" }}
                                    />
                                    {item.title}
                                </MotionCard>
                            </div>
                            {item.subtitle && (
                                <div className="ps-4">
                                    {item.subtitle.map((subItem, subIdx) => {
                                        const subGroup = ocrByDocId[item.id]?.[subIdx];
                                        const hasOcrSub = subGroup && Object.values(subGroup).some(file => Object.keys(file.pages || {}).length > 0);
                                        const isSelectedSub = selectedDocId === item.id && selectedSubtitleIdx === subIdx;
                                        const isUploadedSub = uploadedStatus[item.id]?.has(subIdx) ?? false;
                                        const { Icon, iconColor, bg, textColor, bar } = getStatus(isSelectedSub, hasOcrSub, isUploadedSub);

                                        return (
                                            <div key={subIdx} className="d-flex">
                                                <MotionCard
                                                    onClick={() => handleSelect(item.id, subIdx)}
                                                    isSelected={isSelectedSub}
                                                    width="100%"
                                                    minHeight="45px"
                                                    textSize="12px"
                                                    container="d-flex align-items-center justify-content-between py-1 pe-2 mb-2 shadow-sm rounded-2 position-relative"
                                                    backgroundColor={bg}
                                                    color={textColor}
                                                    style={{
                                                        border: '1px solid #dee2e6',
                                                        paddingLeft: "42px",
                                                    }}
                                                >
                                                    <Icon
                                                        size={25}
                                                        className="position-absolute"
                                                        style={{
                                                            left: "10px", top: "50%", transform: "translateY(-50%)", color: iconColor
                                                        }}
                                                    />
                                                    <div
                                                        className="rounded-2 position-absolute top-0 bottom-0"
                                                        style={{ width: "3px", backgroundColor: bar, left: "-10.5px" }}
                                                    />
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
