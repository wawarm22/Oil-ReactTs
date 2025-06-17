import React from "react";
import { motion } from "framer-motion";

interface MotionCardChecklistProps {
    onClick?: () => void;
    isSelected: boolean;
    isFailed?: boolean;
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
    isFailed,
    children,
    width = "325px",
    minHeight = "55px",
    textSize = "18px",
    container = "d-flex flex-column justify-content-start align-items-start",
    margin = "",
    style = {},
}) => {
    const borderStyle = isFailed
        ? "2px solid #FF0100"
        : isSelected
            ? "2px solid #22C659"
            : "2px solid #22C659";
    
    let backgroundColor = "#ffffff";
    let color = "#22C659";
    if (isFailed && isSelected) {
        backgroundColor = "#FF0000";
        color = "#ffffff";           
    } else if (isFailed) {
        backgroundColor = "#ffffff";
        color = "#FF0000";           
    } else if (isSelected) {
        backgroundColor = "#22C659";
        color = "#ffffff";
    }

    return (
        <motion.div
            className={`${container} rounded-2 ${margin}`}
            style={{
                width,
                minHeight,
                backgroundColor,
                color,
                cursor: "pointer",
                border: borderStyle,
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
