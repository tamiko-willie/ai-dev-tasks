import React from 'react';
import { AccessibleFormFieldProps } from '../../utils/accessibility';

interface AccessibleInputProps extends React.InputHTMLAttributes<HTMLInputElement>, AccessibleFormFieldProps {
  helperText?: string;
}

export const AccessibleInput: React.FC<AccessibleInputProps> = ({
  id,
  label,
  error,
  required,
  description,
  helperText,
  className,
  'aria-describedby': ariaDescribedby,
  ...props
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;
  const descriptionId = `${id}-description`;

  const getAriaDescribedby = () => {
    const ids = [];
    if (error) ids.push(errorId);
    if (helperText) ids.push(helperId);
    if (description) ids.push(descriptionId);
    if (ariaDescribedby) ids.push(ariaDescribedby);
    return ids.join(' ') || undefined;
  };

  const baseInputStyles = `
    w-full px-4 py-2 rounded-md border
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors duration-200
  `;

  const errorStyles = error
    ? 'border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500'
    : 'border-gray-300 focus:border-blue-500';

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700 flex items-center gap-1"
      >
        {label}
        {required && (
          <span className="text-red-500" aria-hidden="true">
            *
          </span>
        )}
        {required && <span className="sr-only">required</span>}
      </label>

      {description && (
        <span id={descriptionId} className="text-sm text-gray-500">
          {description}
        </span>
      )}

      <input
        ref={inputRef}
        id={id}
        aria-invalid={!!error}
        aria-required={required}
        aria-describedby={getAriaDescribedby()}
        className={`${baseInputStyles} ${errorStyles} ${className || ''}`}
        {...props}
      />

      {helperText && !error && (
        <span id={helperId} className="text-sm text-gray-500">
          {helperText}
        </span>
      )}

      {error && (
        <span id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}; 