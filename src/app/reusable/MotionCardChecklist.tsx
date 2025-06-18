import React from "react";
import { motion } from "framer-motion";

interface MotionCardChecklistProps {
    onClick?: () => void;
    isSelected: boolean;
    isFailed?: boolean;
    isInitial?: boolean;
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
    isInitial,
    children,
    width = "325px",
    minHeight = "55px",
    textSize = "18px",
    container = "d-flex flex-column justify-content-start align-items-start",
    margin = "",
    style = {},
}) => {
    const defaultBackground = "#FFFFFF";
    const defaultColor = "#1E2329";
    const defaultBorder = "2px solid #1E2329";

    let backgroundColor = defaultBackground;
    let color = defaultColor;
    let borderStyle = defaultBorder;

    if (isInitial && isSelected) {
        backgroundColor = "#1E2329";
        color = "#FFFFFF";
        borderStyle = "2px solid #1E2329";
    } else if (isInitial) {
        backgroundColor = defaultBackground;
        color = defaultColor;
        borderStyle = defaultBorder;
    } else if (isFailed && isSelected) {
        backgroundColor = "#FF0000";
        color = "#ffffff";
        borderStyle = "2px solid #FF0000";
    } else if (isFailed) {
        backgroundColor = "#ffffff";
        color = "#FF0000";
        borderStyle = "2px solid #FF0100";
    } else if (isSelected) {
        backgroundColor = "#22C659";
        color = "#ffffff";
        borderStyle = "2px solid #22C659";
    } else {
        // ผ่าน แต่ไม่ได้เลือก
        backgroundColor = "#ffffff";
        color = "#22C659";
        borderStyle = "2px solid #22C659";
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
