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
  activeNumberColor = "black",
}) => {
  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 4) {
      // Start case
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 3) {
      // End case
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Middle case
      pages.push(1);
      pages.push("...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    }

    return pages.map((page, idx) =>
      typeof page === "number" ? (
        <button
          key={page}
          className={`pagination-number ${currentPage === page ? "active" : ""}`}
          onClick={() => onPageChange(page)}
          style={{
            color: currentPage === page ? activeNumberColor : numberColor,
          }}
        >
          {page}
        </button>
      ) : (
        <span
          key={`ellipsis-${idx}`}
          className="pagination-ellipsis"
          style={{
            display: "inline-block",
            width: "50px",
            textAlign: "center",
            fontSize: "20px",
          }}
        >
          ...
        </span>
      )
    );
  };

  return (
    <nav className="pagination-container">
      <button
        className={`pagination-btn ${currentPage === 1 ? "disabled" : "active"}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FaChevronLeft />
      </button>

      {renderPageNumbers()}

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
