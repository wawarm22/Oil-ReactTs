import React, { useEffect, useState } from "react";
import { DocumentItem } from "../../types/docList";
import { OcrFields } from "../../types/ocrFileType";
import MotionCard from "../reusable/MotionCard";
import { FaCircleExclamation } from "react-icons/fa6";
import { MdDownloading } from "react-icons/md";
import { parseUploadedStatus } from "../../utils/function/parseUploadedStatus";
import { FaCheckCircle } from "react-icons/fa";
import { OCR_VALIDATE_MAP } from "../../utils/function/ocrValidateMap";
import { OcrByDocIdType, ValidateResultsByDoc } from "../../types/checkList";
import { getFirstDocType, getOverallValidateStatus } from "../../utils/function/validateStatus";

interface Props {
    documentList: DocumentItem[];
    folders: string[];
    validationFailStatus?: Record<string, boolean>;
    onSelectDocument: (
        singlePageOcr: OcrFields | null,
        fullOcrPages: {
            pages: { [page: number]: OcrFields };
            pageCount: number;
            pageFileKeyMap: { [page: number]: string };
        } | null,
        docId: number,
        subtitleIdx: number
    ) => void;
    ocrByDocId: OcrByDocIdType;
    validateResultsByDoc: ValidateResultsByDoc;
    onSelectDocumentMeta?: (docId: number, subtitleIdx: number) => void;
}

const DocumentChecklist: React.FC<Props> = ({
    documentList,
    folders,
    onSelectDocument,
    ocrByDocId,
    validateResultsByDoc,
    onSelectDocumentMeta
}) => {
    const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
    const [selectedSubtitleIdx, setSelectedSubtitleIdx] = useState<number | null>(null);

    const transportFilter = localStorage.getItem("transport");
    const filteredList = documentList.filter(item =>
        !transportFilter || item.transport === transportFilter
    );
    const uploadedStatus = parseUploadedStatus(folders);

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

    useEffect(() => {
        if (selectedDocId === null && selectedSubtitleIdx === null) {
            const firstUploaded = findFirstUploadedDoc();
            if (firstUploaded) {
                handleSelect(firstUploaded.docId, firstUploaded.subtitleIdx);
            }
        }
    }, [ocrByDocId, filteredList]);

    // const getPageCount = (group: any) => {
    //     if (!group) return 0;
    //     let total = 0;
    //     Object.values(group).forEach((f: any) => total += f.pageCount || 0);
    //     return total;
    // };

    const getDisplayStatus = (
        isSelected: boolean,
        hasOcr: boolean,
        isUploaded: boolean,
        overallValidate: "waiting" | "failed" | "passed",
        hasValidate: boolean
    ) => {
        if (hasValidate) {
            if (overallValidate === "waiting") {
                return { Icon: MdDownloading, iconColor: "#FFCA04", bg: "#ffffff", textColor: "#000000", bar: "#FFCA04" };
            }
            if (overallValidate === "failed") {
                return { Icon: FaCircleExclamation, iconColor: "#FF0100", bg: "#fff0f0", textColor: "#FF0100", bar: "#FF0100" };
            }
            if (overallValidate === "passed") {
                return {
                    Icon: FaCheckCircle,
                    iconColor: isSelected ? "#ffffff" : "#22C659",
                    bg: isSelected ? "#22C659" : "#ffffff",
                    textColor: isSelected ? "#ffffff" : "#000000",
                    bar: "#22C659"
                };
            }
        } else {
            // ไม่มี validate config: พฤติกรรมเหมือนเดิม
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
        }
        return { Icon: MdDownloading, iconColor: "#BDBDBD", bg: "#ffffff", textColor: "#BDBDBD", bar: "#BDBDBD" };
    };

    const handleSelect = (docId: number, subtitleIndex = 0) => {
        if (onSelectDocumentMeta) onSelectDocumentMeta(docId, subtitleIndex);
        
        const docGroup = ocrByDocId[docId]?.[subtitleIndex];
        if (!docGroup) {
            onSelectDocument(null, null, docId, subtitleIndex);
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

        onSelectDocument(
            selectedFields,
            {
                pages: combinedPages,
                pageCount: pageOffset,
                pageFileKeyMap,
            },
            docId,
            subtitleIndex
        );

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

                const docType = getFirstDocType(group);
                const hasValidate = !!(docType && OCR_VALIDATE_MAP[docType]);
                // const pageCount = getPageCount(group);
                let overallValidate: "waiting" | "failed" | "passed" = "waiting";
                if (hasValidate && hasOcr) {
                    overallValidate = getOverallValidateStatus(
                        item.id, defaultSubIdx, validateResultsByDoc, ocrByDocId
                    );
                }

                const { Icon, iconColor, bg, textColor, bar } = getDisplayStatus(
                    isSelected, !!hasOcr, isUploaded, overallValidate, hasValidate
                );

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

                                        const docTypeSub = getFirstDocType(subGroup);
                                        const hasValidateSub = !!(docTypeSub && OCR_VALIDATE_MAP[docTypeSub]);
                                        // const pageCountSub = getPageCount(subGroup);
                                        let overallValidateSub: "waiting" | "failed" | "passed" = "waiting";
                                        if (hasValidateSub && hasOcrSub) {
                                            overallValidateSub = getOverallValidateStatus(item.id, subIdx, validateResultsByDoc, ocrByDocId);
                                        }

                                        const { Icon, iconColor, bg, textColor, bar } = getDisplayStatus(
                                            isSelectedSub, !!hasOcrSub, isUploadedSub, overallValidateSub, hasValidateSub
                                        );

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
