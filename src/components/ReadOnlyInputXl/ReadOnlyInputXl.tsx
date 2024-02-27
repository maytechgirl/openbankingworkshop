import React from 'react';

interface InputFieldProps {
  label: string;
  id: string;
  value: string;
  readOnly?: boolean;
}

const ReadOnlyInputXl: React.FC<InputFieldProps> = ({ label, id, value, readOnly = false }) => {
  return (
    <div className="mb-4">
      <label className="font-bold" htmlFor={id}>
        {label}:
      </label>
      <input id={id} type="text" name={id} value={value} readOnly={readOnly} />
    </div>
  );
};

export default ReadOnlyInputXl;
