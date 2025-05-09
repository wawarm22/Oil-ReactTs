// AuditPagination.tsx

import React from "react";
import MotionCard from "./MotionCard";

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    customHeight?: number;
}

const AuditPagination: React.FC<PaginationProps> = ({ totalPages, currentPage, setCurrentPage, customHeight }) => {
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
                <MotionCard
                    key={`page-${page}`}
                    isSelected={currentPage === page}
                    onClick={() => setCurrentPage(page)}
                    width="50px"
                    height="50px"
                    textSize="20px"
                    container="d-flex align-items-center justify-content-center"
                    margin="mx-1"
                >
                    {page}
                </MotionCard>
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
            className="d-flex align-items-center justify-content-start shadow-sm bg-white ps-4 rounded-2 w-100"
            style={{
                maxWidth: '730px',
                height: customHeight ? `${customHeight - 16}px` : '90px',
                fontFamily: "Sarabun"
            }}
        >
            <p className="fw-bold m-0 me-2" style={{ fontSize: "20px" }}>หน้า</p>
            <div className="d-flex">
                {renderPageNumbers()}
            </div>
        </div>
    );
};

export default AuditPagination;
