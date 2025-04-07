import DatePicker from "react-datepicker";
import { OptionType } from "../../types/selectTypes";
import CustomSelect from "./CustomSelect";
import { th } from "date-fns/locale";
import "dayjs/locale/th";
import "../../assets/css/datepicker.css"
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import BuddhistInput from "./BuddhistInput";
import MonthPickerHeader from "../../utils/function/MonthPickerHeader";
import ThaiDatePickerHeader from "../../utils/function/ThaiDatePickerHeader";
dayjs.extend(buddhistEra);
dayjs.locale("th");

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
                                value={
                                    filters.dateStart
                                        ? dayjs(filters.dateStart).add(543, "year").format("DD/MM/YYYY")
                                        : ""
                                }

                                onChange={(date) => onChange("dateStart", date)}
                                // onChangeRaw={(e) => {
                                //     const input = (e?.target as HTMLInputElement)?.value;
                                //     const parsed = dayjs(input, "DD/MM/YYYY", true).subtract(543, 'year');
                                //     if (parsed.isValid()) {
                                //         onChange("dateStart", parsed.toDate());
                                //     }
                                // }}

                                customInput={
                                    <BuddhistInput
                                        value={
                                            filters.dateStart
                                                ? dayjs(filters.dateStart).add(543, "year").format("DD/MM/YYYY")
                                                : ""
                                        }
                                    />
                                }
                                dateFormat="dd/MM/yyyy"
                                maxDate={filters.dateEnd ?? undefined}
                                renderCustomHeader={(props) => (
                                    <ThaiDatePickerHeader
                                        {...props}
                                        onChangeDate={(newDate) => {
                                            onChange("dateStart", newDate);
                                        }}
                                    />
                                )}
                                showYearDropdown
                                scrollableYearDropdown
                                yearDropdownItemNumber={30}
                            />
                        </div>
                    </div>

                    <div className="d-flex align-items-center">
                        <label className="fw-bold pe-2">ถึง</label>
                        <div style={{ flex: 1, minWidth: "150px" }}>
                            <DatePicker
                                locale={th}
                                selected={filters.dateEnd}
                                value={
                                    filters.dateEnd
                                        ? dayjs(filters.dateEnd).add(543, "year").format("DD/MM/YYYY")
                                        : ""
                                }

                                onChange={(date) => onChange("dateEnd", date)}
                                onChangeRaw={(e) => {
                                    const input = (e?.target as HTMLInputElement)?.value;
                                    const parsed = dayjs(input, "DD/MM/YYYY", true).subtract(543, 'year');
                                    if (parsed.isValid()) {
                                        onChange("dateEnd", parsed.toDate());
                                    }
                                }}

                                customInput={
                                    <BuddhistInput
                                        value={
                                            filters.dateEnd
                                                ? dayjs(filters.dateEnd).add(543, "year").format("DD/MM/YYYY")
                                                : ""
                                        }
                                    />
                                }
                                dateFormat="dd/MM/yyyy"
                                minDate={filters.dateStart ?? undefined}
                                renderCustomHeader={(props) => (
                                    <ThaiDatePickerHeader
                                        {...props}
                                        onChangeDate={(newDate) => {
                                            onChange("dateEnd", newDate);
                                        }}
                                    />
                                )}
                                showYearDropdown
                                scrollableYearDropdown
                                yearDropdownItemNumber={30}
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
                            value={
                                filters.month
                                    ? dayjs(filters.month).add(543, "year").format("MM/YYYY")
                                    : ""
                            }

                            onChange={(date) => {
                                if (date) {
                                    onChange("month", date);
                                }
                            }}

                            onChangeRaw={(e) => {
                                const input = (e?.target as HTMLInputElement)?.value;
                                const parsed = dayjs(input, "MM/YYYY", true).subtract(543, "year");
                                if (parsed.isValid()) {
                                    onChange("month", parsed.toDate());
                                }
                            }}

                            customInput={
                                <BuddhistInput
                                    value={
                                        filters.month
                                            ? dayjs(filters.month).add(543, "year").format("MM/YYYY")
                                            : ""
                                    }
                                />
                            }

                            calendarClassName="bg-white border-0 shadow-sm rounded"
                            popperClassName="calendar-popper-custom"
                            dateFormat="MM/yyyy"
                            showMonthYearPicker
                            showFullMonthYearPicker
                            showYearDropdown
                            scrollableYearDropdown
                            yearDropdownItemNumber={30}
                            renderCustomHeader={(props) => (
                                <MonthPickerHeader
                                    {...props}
                                    onChangeDate={(newDate) => {
                                        const newDateWithMonth = new Date(
                                            newDate.getFullYear(),
                                            filters.month?.getMonth() ?? new Date().getMonth(),
                                            1
                                        );
                                        onChange("month", newDateWithMonth);
                                    }}
                                />
                            )}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadFilterPanel;