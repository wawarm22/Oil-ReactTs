import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendar } from "react-icons/fa";

interface DateFilterProps {
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ startDate, endDate, setStartDate, setEndDate }) => {
  return (
    <div className="d-flex align-items-center">
      <strong className="me-2">เรียงลำดับ</strong>

      <div className="d-flex align-items-center border rounded-2 p-2 me-2" style={{ minWidth: "150px" }}>
        <DatePicker
          selected={startDate}
          onChange={setStartDate}
          placeholderText="ตั้งแต่"
          className="border-0 w-100"
        />
        <FaCalendar size={20} className="text-muted" />
      </div>

      <div className="d-flex align-items-center border rounded-2 p-2" style={{ minWidth: "150px" }}>
        <DatePicker
          selected={endDate}
          onChange={setEndDate}
          placeholderText="ถึง"
          className="border-0 w-100"
        />
        <FaCalendar size={20} className="text-muted" />
      </div>
    </div>
  );
};

export default DateFilter;
