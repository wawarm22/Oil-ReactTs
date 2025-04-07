import React from "react";

interface BuddhistInputProps {
    value?: string;
    onClick?: () => void;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BuddhistInput = React.forwardRef<HTMLInputElement, BuddhistInputProps>(
    ({ value, onClick, onChange }, ref) => {
        return (
            <input
                type="text"
                className="form-control"
                onClick={onClick}
                onChange={onChange}
                defaultValue={value}
                ref={ref}
                readOnly 
            />
        );
    }
);

export default BuddhistInput;
