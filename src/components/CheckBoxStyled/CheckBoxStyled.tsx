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
    const checkboxId = inputProps.id || inputProps.name;
    const labelClassNameDefault = "cursor-pointer";
    return (
        <div className={wrapperClassName}>
            <input id={checkboxId} type="checkbox" className={className} {...inputProps} />
            <label htmlFor={checkboxId} className={labelClassName || labelClassNameDefault}>
                {labelText}
            </label>
        </div>
    );
};

export default CheckBoxStyled;
