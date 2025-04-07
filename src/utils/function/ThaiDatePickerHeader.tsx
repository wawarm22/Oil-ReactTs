import React, { useState } from "react";
import dayjs from "dayjs";

interface ThaiDatePickerHeaderProps {
  date: Date;
  changeYear: (year: number) => void;
  increaseMonth: () => void;
  decreaseMonth: () => void;
  prevMonthButtonDisabled: boolean;
  nextMonthButtonDisabled: boolean;
  onChangeDate?: (newDate: Date) => void;
}

const ThaiDatePickerHeader: React.FC<ThaiDatePickerHeaderProps> = ({
  date,
  changeYear,
  increaseMonth,
  decreaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
  onChangeDate,
}) => {
  const [showYearGrid, setShowYearGrid] = useState(false);

  const selectedYear = dayjs(date).year();
  const selectedYearBE = selectedYear + 543;
  const currentYear = dayjs().year();
  const currentYearBE = currentYear + 543;

  const latestYearBE = Math.max(selectedYearBE, currentYearBE);
  const startYear = latestYearBE;
  const endYear = 2500;
  const years = Array.from({ length: startYear - endYear + 1 }, (_, i) => startYear - i);

  const month = dayjs(date).format("MMMM");

  return (
    <div className="position-relative px-2 pb-2">
      <div
        className="d-flex justify-content-between align-items-center mb-2 rounded"
        style={{ backgroundColor: "white", padding: "0.5rem" }}
      >
        <button
          onClick={decreaseMonth}
          disabled={prevMonthButtonDisabled}
          className="btn btn-sm btn-outline-secondary"
        >
          {"<"}
        </button>

        <div
          className="d-flex align-items-center gap-2"
        >
          <span>{month}</span>
          <span
            className="fw-bold"
            style={{ cursor: "pointer", minWidth: "70px" }}
            onClick={() => setShowYearGrid(!showYearGrid)}
          >
            {selectedYearBE}
          </span>
        </div>

        <button
          onClick={increaseMonth}
          disabled={nextMonthButtonDisabled}
          className="btn btn-sm btn-outline-secondary"
        >
          {">"}
        </button>
      </div>

      {showYearGrid && (
        <div
          className="position-absolute bg-white shadow border rounded p-2"
          style={{
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "6px",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {years.map((year) => (
            <button
              key={year}
              className={`btn btn-sm ${year === selectedYearBE ? "btn-primary" : "btn-outline-secondary"}`}
              onClick={() => {
                const newYear = year - 543;
                changeYear(newYear);
                onChangeDate?.(new Date(newYear, date.getMonth(), date.getDate()));
                setShowYearGrid(false);
              }}
            >
              {year}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThaiDatePickerHeader;
