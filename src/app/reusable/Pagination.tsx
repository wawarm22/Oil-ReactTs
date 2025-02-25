import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; 
import "../../assets/css/pagination.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  numberColor?: string; 
  activeNumberColor?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  numberColor = "#BCBCBC", 
  activeNumberColor = "black" 
}) => {
  return (
    <nav className="pagination-container">
      {/* ปุ่มย้อนกลับ */}
      <button
        className={`pagination-btn ${currentPage === 1 ? "disabled" : "active"}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FaChevronLeft />
      </button>

      {/* แสดงเลขหน้า */}
      {[...Array(totalPages)].map((_, index) => {
        const page = index + 1;
        const isActive = currentPage === page;

        return (
          <button
            key={page}
            className={`pagination-number ${isActive ? "active" : ""}`}
            onClick={() => onPageChange(page)}
            style={{ color: isActive ? activeNumberColor : numberColor }}
          >
            {page}
          </button>
        );
      })}

      {/* ปุ่มไปข้างหน้า */}
      <button
        className={`pagination-btn ${currentPage === totalPages ? "disabled" : "active"}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <FaChevronRight />
      </button>
    </nav>
  );
};

export default Pagination;
