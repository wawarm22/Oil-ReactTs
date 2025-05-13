import React from "react";
import { motion } from "framer-motion";

interface MotionCardChecklistProps {
    onClick?: () => void;
    isSelected: boolean;
    children: React.ReactNode;
    width?: string;
    minHeight?: string;
    padding?: string;
    textSize?: string;
    container?: string;
    margin?: string; 
    style?: React.CSSProperties; 
}

const MotionCardChecklist: React.FC<MotionCardChecklistProps> = ({
    onClick,
    isSelected,
    children,
    width = "325px",
    minHeight = "55px",
    textSize = "18px",
    container = "d-flex flex-column justify-content-start align-items-start",
    margin = "",
    style = {},
}) => {
    return (
        <motion.div
            className={`${container} border ${isSelected ? "border-light" : "border-dark"} border-1 rounded-2 ${margin}`}
            style={{
                width,
                minHeight,
                backgroundColor: isSelected ? "#3D4957" : "#ffffff",
                color: isSelected ? "#ffffff" : "#000000",
                cursor: "pointer",
                ...style,
            }}
            whileHover={{
                scale: 1.02,
                boxShadow: "0 4px 8px rgba(2, 29, 58, 0.56)",
                transition: { duration: 0.3 },
            }}
            whileTap={{
                scale: 0.98,
                transition: { duration: 0.2 },
            }}
            onClick={onClick}
        >
            <p className="fw-bold mb-0" style={{ fontSize: textSize }}>
                {children}
            </p>
        </motion.div>
    );
};

export default MotionCardChecklist;
