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
    variant = 'default' 
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
                maxWidth: '180px',
                border: `2px solid ${borderColor || bgColor}`, // ใช้ borderColor หรือค่าเริ่มต้นเป็น bgColor
            }}
            onMouseEnter={(e) => {
                if (variant === 'bg-hide') {
                    e.currentTarget.style.backgroundColor = hoverBgColor || 'transparent';
                    e.currentTarget.style.color = hoverColor || bgColor;
                    e.currentTarget.style.borderColor = hoverBorderColor || hoverBgColor || bgColor;
                }
            }}
            onMouseLeave={(e) => {
                if (variant === 'bg-hide') {
                    e.currentTarget.style.backgroundColor = bgColor;
                    e.currentTarget.style.color = color || '#fff';
                    e.currentTarget.style.borderColor = borderColor || bgColor;
                }
            }}
            onClick={onClick}
        >
            {label}
        </button>
    );
};

export default Button;
