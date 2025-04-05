import React, { useEffect, useRef } from 'react';
import '../../assets/css/button.css'

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
    const buttonRef = useRef<HTMLButtonElement>(null);
    const originalStyleRef = useRef<Partial<CSSStyleDeclaration>>({});

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled || variant !== 'bg-hide') return;
        const btn = e.currentTarget;
        
        if (!originalStyleRef.current.backgroundColor) {
            originalStyleRef.current = {
                backgroundColor: btn.style.backgroundColor,
                color: btn.style.color,
                borderColor: btn.style.borderColor,
            };
        }

        btn.style.backgroundColor = hoverBgColor || 'transparent';
        btn.style.color = hoverColor || bgColor;
        btn.style.borderColor = hoverBorderColor || hoverBgColor || bgColor;
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled || variant !== 'bg-hide') return;

        const btn = e.currentTarget;
        const original = originalStyleRef.current;

        btn.style.backgroundColor = original.backgroundColor || bgColor;
        btn.style.color = original.color || color || '#fff';
        btn.style.borderColor = original.borderColor || borderColor || bgColor;
    };

    useEffect(() => {
        if (!disabled && variant === 'bg-hide' && buttonRef.current) {
            const btn = buttonRef.current;
            btn.style.backgroundColor = bgColor;
            btn.style.color = color || '#fff';
            btn.style.borderColor = borderColor || bgColor;
            originalStyleRef.current = {};
        }
    }, [disabled, bgColor, color, borderColor, variant]);

    return (
        <button
            ref={buttonRef}
            type={type}
            className={`btn flex-fill rounded-pill fw-bold ${variant} ${className || ''}`}
            style={{
                fontFamily: 'IBM Plex Sans Thai',
                backgroundColor: bgColor,
                color: color,
                fontSize: '18px',
                minHeight: '50px',
                maxWidth: maxWidth,
                border: `2px solid ${borderColor || bgColor}`,
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.5 : 1,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={!disabled ? onClick : undefined}
            disabled={disabled}
        >
            {children}
            {label}
        </button>
    );
};

export default Button;
