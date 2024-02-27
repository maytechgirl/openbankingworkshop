import React, { InputHTMLAttributes } from "react";

interface CheckBoxProps extends InputHTMLAttributes<HTMLInputElement> {
    wrapperClassName?: string;
    labelText: string;
    labelClassName?: string;
}

const CheckBoxStyled: React.FC<CheckBoxProps> = ({
    wrapperClassName,
    className,
    labelClassName,
    labelText,
    ...inputProps
}) => {
    return (
        <div className={wrapperClassName}>
            <input type="checkbox" className={className} {...inputProps} />
            <label htmlFor={inputProps.id} className={labelClassName}>{labelText}</label>
        </div>
    );
};

export default CheckBoxStyled;
