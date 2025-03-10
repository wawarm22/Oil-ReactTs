import React from "react";
import { motion } from "framer-motion";

interface MotionCardProps {
    onClick?: () => void;
    isSelected: boolean;
    children: React.ReactNode;
    width?: string;
    height?: string;
    padding?: string;
    textSize?: string;
    container?: string;
    margin?: string; 
    style?: React.CSSProperties; 
}

const MotionCard: React.FC<MotionCardProps> = ({
    onClick,
    isSelected,
    children,
    width = "325px",
    height = "135px",
    textSize = "18px",
    container = "d-flex flex-column justify-content-start align-items-start",
    margin = "",
    style = {},
}) => {
    return (
        <motion.div
            className={`${container} border border-dark border-2 rounded-2 ${margin}`} // ✅ ใช้ className ที่กำหนด
            style={{
                width,
                height,
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

export default MotionCard;
