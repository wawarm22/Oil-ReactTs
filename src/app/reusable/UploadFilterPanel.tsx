import DatePicker from "react-datepicker";
import { OptionType } from "../../types/selectTypes";
import CustomSelect from "./CustomSelect";

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
        <div className="d-flex flex-wrap gap-2 px-4">
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
                                selected={filters.dateStart}
                                onChange={(date) => onChange("dateStart", date)}
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                maxDate={filters.dateEnd ?? undefined}
                            />
                        </div>
                    </div>

                    <div className="d-flex align-items-center">
                        <label className="fw-bold pe-2">ถึง</label>
                        <div style={{ flex: 1, minWidth: "150px" }}>
                            <DatePicker
                                selected={filters.dateEnd}
                                onChange={(date) => onChange("dateEnd", date)}
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                minDate={filters.dateStart ?? undefined}
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
                            selected={filters.month}
                            onChange={(date) => onChange("month", date)}
                            dateFormat="MM/yyyy"
                            showMonthYearPicker
                            showFullMonthYearPicker
                            className="form-control"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadFilterPanel;