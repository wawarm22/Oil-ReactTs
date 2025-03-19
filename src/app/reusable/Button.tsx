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
    disabled?: boolean;  
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
    disabled = false 
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
                cursor: disabled ? "not-allowed" : "pointer",  
                opacity: disabled ? 0.5 : 1  
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
            onClick={!disabled ? onClick : undefined}  
            disabled={disabled}  
        >
            {children}
            {label}
        </button>
    );
};

export default Button;
