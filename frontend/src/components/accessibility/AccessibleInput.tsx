import React, { forwardRef } from 'react';

interface AccessibleInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const AccessibleInput = forwardRef<HTMLInputElement, AccessibleInputProps>(
  ({ label, error, hint, id, className = '', ...props }, ref) => {
    const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    const hasError = !!error;
    const hasHint = !!hint;

    const describedBy = [
      hasError ? errorId : null,
      hasHint ? hintId : null,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="space-y-1">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {props.required && (
            <span className="text-red-500 ml-1" aria-hidden="true">
              *
            </span>
          )}
        </label>

        {hasHint && (
          <p className="text-sm text-gray-500" id={hintId}>
            {hint}
          </p>
        )}

        <input
          ref={ref}
          id={inputId}
          className={`
            block w-full rounded-md shadow-sm
            ${
              hasError
                ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
            }
            ${className}
          `.trim()}
          aria-invalid={hasError}
          aria-describedby={describedBy || undefined}
          {...props}
        />

        {hasError && (
          <p
            className="mt-2 text-sm text-red-600"
            id={errorId}
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

AccessibleInput.displayName = 'AccessibleInput'; 