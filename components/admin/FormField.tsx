import React from 'react';

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}

export function FormField({
  label,
  error,
  children,
  required = false,
}: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}

interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function TextInput({
  label,
  error,
  ...props
}: TextInputProps) {
  const inputElement = (
    <input
      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#173472] focus:border-transparent outline-none transition-colors ${
        error ? 'border-red-500' : 'border-gray-300'
      } ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      {...props}
    />
  );

  if (label) {
    return (
      <FormField label={label} error={error}>
        {inputElement}
      </FormField>
    );
  }

  return inputElement;
}

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function TextArea({
  label,
  error,
  ...props
}: TextAreaProps) {
  const textareaElement = (
    <textarea
      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#173472] focus:border-transparent outline-none transition-colors resize-none ${
        error ? 'border-red-500' : 'border-gray-300'
      } ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      {...props}
    />
  );

  if (label) {
    return (
      <FormField label={label} error={error}>
        {textareaElement}
      </FormField>
    );
  }

  return textareaElement;
}

interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string | number; label: string }>;
}

export function Select({
  label,
  error,
  options,
  ...props
}: SelectProps) {
  const selectElement = (
    <select
      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#173472] focus:border-transparent outline-none transition-colors ${
        error ? 'border-red-500' : 'border-gray-300'
      } ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      {...props}
    >
      <option value="">Select an option</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );

  if (label) {
    return (
      <FormField label={label} error={error}>
        {selectElement}
      </FormField>
    );
  }

  return selectElement;
}
