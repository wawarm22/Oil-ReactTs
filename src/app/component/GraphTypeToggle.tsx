import React from "react";
import { LuChartBarIncreasing } from "react-icons/lu";
import { TbChartDots } from "react-icons/tb";

interface GraphTypeToggleProps {
    type: "line" | "bar";
    onChange: (type: "line" | "bar") => void;
}

const GraphTypeToggle: React.FC<GraphTypeToggleProps> = ({ type, onChange }) => {
    return (
        <div className="d-flex gap-2">
            <div
                className="d-flex justify-content-center align-items-center rounded-3"
                onClick={() => onChange("line")}
                style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: type === "line" ? "#2C3E50" : "#ccc",
                    cursor: "pointer",
                }}
            >
                <TbChartDots size={25} color="#fff" />
            </div>
            <div
                className="d-flex justify-content-center align-items-center rounded-3"
                onClick={() => onChange("bar")}
                style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: type === "bar" ? "#2C3E50" : "#ccc",
                    cursor: "pointer",
                }}
            >
                <LuChartBarIncreasing size={25} color="#fff" />
            </div>
        </div>
    );
};

export default GraphTypeToggle;
