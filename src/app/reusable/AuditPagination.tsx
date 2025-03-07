import React from "react";
import { motion } from "framer-motion";

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    customHeight?: number; 
}

const AuditPagination: React.FC<PaginationProps> = ({ totalPages, currentPage, setCurrentPage, customHeight }) => {
    return (
        <div
            className="d-flex align-items-center justify-content-center shadow-sm bg-white rounded-2 mt-3 w-100"
            style={{
                maxWidth: '730px',
                height: customHeight ? `${customHeight - 16}px` : '178px',
                fontFamily: "Sarabun"
            }}
        >
            <p className="fw-bold m-0 me-2" style={{ fontSize: "20px" }}>หน้า</p>
            <div className="d-flex">
                {Array.from({ length: totalPages }, (_, index) => (
                    <motion.div
                        key={index}
                        className="border border-dark border-2 rounded-2 mx-1 d-flex align-items-center justify-content-center"
                        style={{
                            width: "50px",
                            height: "50px",
                            backgroundColor: currentPage === index + 1 ? "#3D4957" : "#ffffff",
                            color: currentPage === index + 1 ? "#ffffff" : "#000000",
                            cursor: "pointer"
                        }}
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0 4px 8px rgba(2, 29, 58, 0.56)",
                            transition: { duration: 0.3 },
                        }}
                        whileTap={{
                            scale: 0.95,
                            transition: { duration: 0.2 },
                        }}
                        onClick={() => setCurrentPage(index + 1)}
                    >
                        <p className="fw-bold mb-0" style={{ fontSize: '20px' }}>{index + 1}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default AuditPagination;
