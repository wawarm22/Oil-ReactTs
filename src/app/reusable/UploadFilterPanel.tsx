import DatePicker from "react-datepicker";
import { OptionType } from "../../types/selectTypes";
import CustomSelect from "./CustomSelect";
import { th } from "date-fns/locale";
import "dayjs/locale/th";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra);
dayjs.locale("th");
const renderHeaderWithThaiYear = ({
    date,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
}: any) => {
    const year = dayjs(date).year() + 543;
    const month = dayjs(date).format("MMMM");

    return (
        <div className="d-flex justify-content-between align-items-center px-2 pb-2">
            <button
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                className="btn btn-sm btn-outline-secondary"
            >
                {"<"}
            </button>
            <span className="fw-bold">
                {month} {year}
            </span>
            <button
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                className="btn btn-sm btn-outline-secondary"
            >
                {">"}
            </button>
        </div>
    );
};

interface UploadFilterPanelProps {
    filters: {
        warehouse: OptionType | null;
        transport: OptionType | null;
        periodType: OptionType | null;
        dateStart: Date | null;
        dateEnd: Date | null;
        month: Date | null;
    };
    onChange: (field: keyof UploadFilterPanelProps["filters"], value: any) => void;
    options: {
        warehouse: OptionType[];
        transport: OptionType[];
        period: OptionType[];
    };
}

const UploadFilterPanel: React.FC<UploadFilterPanelProps> = ({ filters, onChange, options }) => {
    return (
        <div className="d-flex justify-content-center gap-2 px-4 w-100">
            <CustomSelect
                label="เลือกคลัง"
                value={filters.warehouse}
                onChange={(val) => onChange("warehouse", val)}
                options={options.warehouse}
            />
            <CustomSelect
                label="ทาง"
                value={filters.transport}
                onChange={(val) => onChange("transport", val)}
                options={options.transport}
            />
            <CustomSelect
                label="ช่วงยื่น"
                value={filters.periodType}
                onChange={(val) => onChange("periodType", val)}
                options={options.period}
            />

            {filters.periodType?.value === "range" && (
                <>
                    <div className="d-flex align-items-center">
                        <label className="fw-bold pe-2">ช่วงวันที่ตั้งแต่</label>
                        <div style={{ flex: 1, minWidth: "150px" }}>
                            <DatePicker
                                locale={th}
                                selected={filters.dateStart}
                                onChange={(date) => onChange("dateStart", date)}
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                maxDate={filters.dateEnd ?? undefined}
                                renderCustomHeader={renderHeaderWithThaiYear}
                            />
                        </div>
                    </div>

                    <div className="d-flex align-items-center">
                        <label className="fw-bold pe-2">ถึง</label>
                        <div style={{ flex: 1, minWidth: "150px" }}>
                            <DatePicker
                                locale={th}
                                selected={filters.dateEnd}
                                onChange={(date) => onChange("dateEnd", date)}
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                minDate={filters.dateStart ?? undefined}
                                renderCustomHeader={renderHeaderWithThaiYear}
                            />
                        </div>
                    </div>
                </>
            )}

            {filters.periodType?.value === "month" && (
                <div className="d-flex align-items-center">
                    <label className="fw-bold pe-2">เลือกเดือน</label>
                    <div style={{ flex: 1, minWidth: "150px" }}>
                        <DatePicker
                            locale={th}
                            selected={filters.month}
                            onChange={(date) => onChange("month", date)}
                            dateFormat="MM/yyyy"
                            showMonthYearPicker
                            showFullMonthYearPicker
                            className="form-control"
                            renderCustomHeader={renderHeaderWithThaiYear}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadFilterPanel;