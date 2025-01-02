import React from "react";

interface FormInputProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    id?: string; // Allow specifying a custom id
  }
  
  export const FormInput = ({
    label,
    value,
    onChange,
    type = "text",
    id = "form-input", // Default id if none is provided
  }: FormInputProps) => {
    return (
      <div>
        <label
          htmlFor={id}
          className="block text-left text-gray-700 font-medium mb-2"
        >
          {label}:
        </label>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          className="w-full border rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>
    );
  };  

interface FormSelectProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string; disabled?: boolean }[];
}

export function FormSelect({ label, value, onChange, options }: FormSelectProps) {
  return (
    <div>
      <label className="block text-left text-gray-700 font-medium mb-2">{label}:</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full border rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring focus:ring-blue-300"
      >
        {options.map((option, index) => (
          <option key={index} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
