import React from 'react';
import '../../assets/css/ิbutton.css';

interface ButtonProps {
    type: 'button' | 'submit';
    label: string;
    onClick?: () => void;
    bgColor: string;
    color?: string;
    hoverBgColor?: string;
    hoverColor?: string;
    borderColor?: string;
    hoverBorderColor?: string;
    className?: string;
    variant?: 'bg-hide' | 'bg-show' | 'default';
    maxWidth?: string;
    children?: React.ReactNode;
    disabled?: boolean;  // ✅ เพิ่ม property disabled
}

const Button: React.FC<ButtonProps> = ({ 
    type, 
    label, 
    onClick, 
    bgColor, 
    color, 
    hoverBgColor, 
    hoverColor, 
    borderColor, 
    hoverBorderColor,
    className, 
    variant = 'default',
    maxWidth = "180px",
    children,
    disabled = false  // ✅ ค่าเริ่มต้นคือ false (เปิดใช้งานปุ่ม)
}) => {
    return (
        <button
            type={type}
            className={`btn flex-fill rounded-pill fw-bold ${variant} ${className}`}
            style={{
                fontFamily: 'IBM Plex Sans Thai',
                backgroundColor: bgColor,
                color: color,
                fontSize: '18px',
                minHeight: '50px',
                maxWidth: maxWidth,                
                border: `2px solid ${borderColor || bgColor}`,
                cursor: disabled ? "not-allowed" : "pointer",  // ✅ เปลี่ยน cursor เมื่อ disabled
                opacity: disabled ? 0.5 : 1  // ✅ ลดความเข้มสีปุ่มเมื่อ disabled
            }}
            onMouseEnter={(e) => {
                if (!disabled && variant === 'bg-hide') {
                    e.currentTarget.style.backgroundColor = hoverBgColor || 'transparent';
                    e.currentTarget.style.color = hoverColor || bgColor;
                    e.currentTarget.style.borderColor = hoverBorderColor || hoverBgColor || bgColor;
                }
            }}
            onMouseLeave={(e) => {
                if (!disabled && variant === 'bg-hide') {
                    e.currentTarget.style.backgroundColor = bgColor;
                    e.currentTarget.style.color = color || '#fff';
                    e.currentTarget.style.borderColor = borderColor || bgColor;
                }
            }}
            onClick={!disabled ? onClick : undefined}  // ✅ ปิดการใช้งาน onClick หาก disabled
            disabled={disabled}  // ✅ ใช้ค่า disabled ที่รับมา
        >
            {children}
            {label}
        </button>
    );
};

export default Button;
