import React from "react";
import { motion } from "framer-motion";

interface MotionCardProps {
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
    backgroundColor?: string;
    color?: string;
}

const MotionCard: React.FC<MotionCardProps> = ({
    onClick,
    isSelected,
    children,
    width = "325px",
    minHeight = "55px",
    textSize = "18px",
    container = "d-flex flex-column justify-content-start align-items-start",
    margin = "",
    style = {},
    backgroundColor,
    color,
}) => {
    // ถ้า prop ไม่ส่งมา จะใช้ค่าตาม selected หรือ default
    const appliedBg = backgroundColor ?? (isSelected ? "#22C659" : "#ffffff");
    const appliedColor = color ?? (isSelected ? "#ffffff" : "#000000");

    return (
        <motion.div
            className={`${container} border ${margin}`}
            style={{
                width,
                minHeight,
                backgroundColor: appliedBg,
                color: appliedColor,
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

export default MotionCard;
