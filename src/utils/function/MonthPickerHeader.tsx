import React, { useState } from "react";
import dayjs from "dayjs";

interface MonthPickerHeaderProps {
    date: Date;
    changeYear: (year: number) => void;
    prevYearButtonDisabled?: boolean;
    nextYearButtonDisabled?: boolean;
    onChangeDate?: (newDate: Date) => void;
}

const MonthPickerHeader: React.FC<MonthPickerHeaderProps> = ({
    date,
    changeYear,
    prevYearButtonDisabled,
    nextYearButtonDisabled,
    onChangeDate
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

    const handleYearChange = (newYear: number) => {
        const oldMonth = dayjs(date).month();
        const newDate = dayjs(date).year(newYear).month(oldMonth).toDate();
        changeYear(newYear);
        onChangeDate?.(newDate);
    };    

    return (
        <div className="position-relative px-2 pb-2">
            <div
                className="d-flex justify-content-between align-items-center mb-2 px-3 rounded"
                style={{ backgroundColor: "white" }}
            >
                <button
                    onClick={() => handleYearChange(selectedYear - 1)}
                    disabled={prevYearButtonDisabled}
                    className="btn btn-sm btn-outline-secondary"
                >
                    {"<"}
                </button>

                <span
                    className="fw-bold text-center"
                    style={{ cursor: "pointer", minWidth: "80px" }}
                    onClick={() => setShowYearGrid(!showYearGrid)}
                >
                    {selectedYearBE}
                </span>

                <button
                    onClick={() => handleYearChange(selectedYear + 1)}
                    disabled={nextYearButtonDisabled}
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
                            onClick={() => handleYearChange(year - 543)} // ใช้ปีใหม่ที่เลือก
                        >
                            {year}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MonthPickerHeader;
