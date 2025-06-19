import React, { useState, useRef } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';

dayjs.extend(buddhistEra);

interface BuddhistDateInputProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  label: string;
  minDate?: Date;
  maxDate?: Date;
}

const BuddhistDateInput: React.FC<BuddhistDateInputProps> = ({
  value,
  onChange,
  label,
  minDate,
  maxDate,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [inputValue, setInputValue] = useState(
    value ? dayjs(value).add(543, 'year').format('DD/MM/YYYY') : ''
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDateSelect = (date?: Date) => {
    if (date) {
      setInputValue(dayjs(date).add(543, 'year').format('DD/MM/YYYY'));
      onChange(date);
      setShowCalendar(false);
    }
  };

  const handleBlur = () => {
    const parsed = dayjs(inputValue, 'DD/MM/YYYY', true).subtract(543, 'year');
    if (parsed.isValid()) {
      onChange(parsed.toDate());
    }
  };

  return (
    <div style={{ position: 'relative', minWidth: '180px' }}>
      <label className="fw-bold pe-2">{label}</label>
      <input
        type="text"
        className="form-control"
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => setShowCalendar(true)}
        onBlur={handleBlur}
        placeholder="วว/ดด/ปปปป"
      />
      {showCalendar && (
        <div
          style={{
            position: 'absolute',
            zIndex: 9999,
            top: '100%',
            left: 0,
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: '6px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          }}
          onMouseDown={(e) => e.preventDefault()} 
        >
          <DayPicker
            mode="single"
            selected={value ?? undefined}
            onSelect={handleDateSelect}
            fromDate={minDate}
            toDate={maxDate}
            weekStartsOn={0}
            formatters={{
              formatCaption: (date) =>
                dayjs(date).add(543, 'year').format('MMMM BBBB'),
              formatWeekdayName: (date) => dayjs(date).format('dd'),
            }}
          />
        </div>
      )}
    </div>
  );
};

export default BuddhistDateInput;
