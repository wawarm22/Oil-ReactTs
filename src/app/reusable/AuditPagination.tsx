import { ValidateResultsByDoc } from "../../types/checkList";
import { OCR_VALIDATE_MAP } from "../../utils/function/ocrValidateMap";
import MotionCardChecklist from "./MotionCardChecklist";

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    customHeight?: number;
    validateResultsByDoc: ValidateResultsByDoc;
    selectedDocId: number | null;
    selectedSubtitleIdx: number | null;
}

const AuditPagination: React.FC<PaginationProps> = ({
    totalPages,
    currentPage,
    setCurrentPage,
    customHeight,
    validateResultsByDoc,
    selectedDocId,
    selectedSubtitleIdx
}) => {
    function isPageFailed(pageNum: number): boolean {
        if (
            selectedDocId == null ||
            selectedSubtitleIdx == null ||
            !validateResultsByDoc[selectedDocId]?.[selectedSubtitleIdx]?.[pageNum]?.validateResult
        ) return false;

        const validateResult = validateResultsByDoc[selectedDocId][selectedSubtitleIdx][pageNum]?.validateResult;
        const docType = validateResultsByDoc[selectedDocId][selectedSubtitleIdx][pageNum]?.docType;

        if (!docType || !OCR_VALIDATE_MAP[docType]) return false;
        const checkFailed = OCR_VALIDATE_MAP[docType].checkFailed;

        return checkFailed(validateResult);
    }

    function isPageInitial(pageNum: number): boolean {
        if (
            selectedDocId == null ||
            selectedSubtitleIdx == null ||
            !validateResultsByDoc[selectedDocId]?.[selectedSubtitleIdx]?.[pageNum]
        ) {
            return true; // ยังไม่ได้ validate
        }
        return false;
    }

    const renderPageNumbers = () => {
        const pages: (number | string)[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            if (currentPage <= 3) {
                for (let i = 2; i <= 4; i++) {
                    if (i < totalPages) pages.push(i);
                }
                pages.push("...");
            } else if (currentPage >= totalPages - 2) {
                pages.push("...");
                for (let i = totalPages - 3; i < totalPages; i++) {
                    if (i > 1) pages.push(i);
                }
            } else {
                pages.push("...");
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push("...");
            }
            pages.push(totalPages);
        }

        return pages.map((page, idx) =>
            typeof page === "number" ? (
                <MotionCardChecklist
                    key={`page-${page}`}
                    isSelected={currentPage === page}
                    isFailed={isPageFailed(page)} 
                    isInitial={isPageInitial(page)}
                    onClick={() => setCurrentPage(page)}
                    width="50px"
                    minHeight="50px"
                    textSize="20px"
                    container="d-flex align-items-center justify-content-center"
                    margin="mx-1"
                >
                    {page}
                </MotionCardChecklist>
            ) : (
                <div
                    key={`ellipsis-${idx}`}
                    className="d-flex align-items-center justify-content-center mx-1"
                    style={{ width: "50px", height: "50px", fontSize: "20px" }}
                >
                    ...
                </div>
            )
        );
    };

    return (
        <div
            className="d-flex align-items-center justify-content-start shadow-sm bg-white rounded-2 w-100"
            style={{
                maxWidth: '100%',
                height: customHeight ? `${customHeight - 16}px` : '90px',
                fontFamily: "Sarabun",
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                paddingLeft: '14px',
                minHeight: '64px'
            }}
        >
            <p className="fw-bold m-0 me-2" style={{ fontSize: "20px", minWidth: '44px' }}>หน้า</p>
            <div className="d-flex flex-row" style={{ gap: '4px' }}>
                {renderPageNumbers()}
            </div>
        </div>
    );
};

export default AuditPagination;
