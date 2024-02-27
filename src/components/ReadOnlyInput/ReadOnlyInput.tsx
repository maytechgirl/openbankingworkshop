import React from 'react';

interface InputFieldProps {
  label: string;
  id: string;
  value: string;
  className?: string;
  classNameLabel?: string;
  divClass?: string;
  readOnly?: boolean;
}

const ReadOnlyInput: React.FC<InputFieldProps> = ({ label, id, divClass, className, classNameLabel, value, readOnly = false }) => {
  if(!divClass) divClass = "mb-4";
  if (!className) classNameLabel = "font-bold pr-2";

  return (
    <div className={divClass}>
      <label className={classNameLabel} htmlFor={id}>
        {label}:
      </label>
      <input id={id} type="text" className={className} name={id} value={value} readOnly={readOnly} />
    </div>
  );
};

export default ReadOnlyInput;
