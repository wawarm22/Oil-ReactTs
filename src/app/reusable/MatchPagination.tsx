// AuditPagination.tsx

import React from "react";
import MotionCardChecklist from "./MotionCardChecklist";

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
}

const MatchPagination: React.FC<PaginationProps> = ({ totalPages, currentPage, setCurrentPage }) => {
    const renderPageNumbers = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1); // Always show page 1

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
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push("...");
            }

            pages.push(totalPages); // Always show last page
        }

        return pages.map((page, idx) =>
            typeof page === "number" ? (
                <MotionCardChecklist
                    key={`page-${page}`}
                    isSelected={currentPage === page}
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
            className="container-fluid d-flex justify-content-start align-items-center shadow-sm bg-white rounded-2 h-100"
            style={{
                width: '100%',
                fontFamily: "Sarabun"
            }}
        >
            <p className="fw-bold m-0 me-2" style={{ fontSize: "20px" }}>หน้า</p>
            <div className="d-flex" style={{ maxHeight: "55px"}}>
                {renderPageNumbers()}
            </div>
        </div>
    );
};

export default MatchPagination;
