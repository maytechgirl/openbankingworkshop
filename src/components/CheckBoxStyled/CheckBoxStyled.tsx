import React, { InputHTMLAttributes } from "react";

interface CheckBoxProps extends InputHTMLAttributes<HTMLInputElement> {
    wrapperClassName?: string;
    labelText: string;
    labelClassName?: string;
    labelFor?: string;
}

const CheckBoxStyled: React.FC<CheckBoxProps> = ({
    wrapperClassName,
    className,
    labelClassName,
    labelText,
    labelFor,
    ...inputProps
}) => {
    return (
        <div className={wrapperClassName}>
            <input type="checkbox" className={className} {...inputProps} />
            <label htmlFor={labelFor} className={labelClassName}>{labelText}</label>
        </div>
    );
};

export default CheckBoxStyled;
