import React from "react";
import Select, { SingleValue, StylesConfig } from "react-select";
import { OptionType } from "../../types/selectTypes";

interface CustomSelectProps {
    label: string;
    value: OptionType | null;
    onChange: (value: SingleValue<OptionType>) => void;
    options: OptionType[];
}

const customStyles: StylesConfig<OptionType, false> = {
    control: (base, state) => ({
        ...base,
        borderRadius: "12px",
        borderColor: state.isFocused ? "#ccc" : "#e0e0e0",
        boxShadow: "none",
        padding: "2px 6px",
        minHeight: "40px",
        fontSize: "16px",
        fontFamily: "Sarabun",
        cursor: "pointer",
    }),
    valueContainer: (base) => ({
        ...base,
        padding: "0 8px",
    }),
    indicatorsContainer: (base) => ({
        ...base,
        paddingRight: "6px",
    }),
    indicatorSeparator: (base) => ({
        ...base,
        display: 'none',
    }),
    dropdownIndicator: (base) => ({
        ...base,
        color: "#000",
    }),
    placeholder: (base) => ({
        ...base,
        color: "#999",
    }),
    singleValue: (base) => ({
        ...base,
        color: "#000",
    }),
};

const CustomSelect: React.FC<CustomSelectProps> = ({ label, value, onChange, options }) => {
    return (
        <div className="d-flex align-items-center" style={{ fontFamily: "Sarabun" }}>
            <label className="fw-bold pe-2 mb-0" style={{ fontSize: "16px" }}>{label}</label>
            <div style={{ flex: 1, minWidth: "150px" }}>
                <Select<OptionType>
                    value={value}
                    onChange={onChange}
                    options={options}
                    placeholder=""
                    styles={customStyles}
                />
            </div>
        </div>
    );
};

export default CustomSelect;
