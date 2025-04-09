import React from "react";
import MotionCard from "./MotionCard";

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    customHeight?: number; 
}

const AuditPagination: React.FC<PaginationProps> = ({ totalPages, currentPage, setCurrentPage, customHeight }) => {
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
                {Array.from({ length: totalPages }, (_, index) => (
                    <MotionCard
                        key={index}
                        isSelected={currentPage === index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        width="50px"
                        height="50px"
                        textSize="20px"
                        container="d-flex align-items-center justify-content-center"
                        margin="mx-1"
                    >
                        {index + 1}
                    </MotionCard>
                ))}
            </div>
        </div>
    );
};

export default AuditPagination;
