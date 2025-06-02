import React from 'react';
import { handleKeyboardNavigation } from '../../utils/accessibility';

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  description?: string;
  isLoading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  label,
  description,
  isLoading = false,
  loadingText = 'Loading...',
  variant = 'primary',
  fullWidth = false,
  disabled,
  onClick,
  className,
  children,
  ...props
}) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    handleKeyboardNavigation(event, {
      Enter: () => onClick?.(event as any),
      Space: () => onClick?.(event as any),
    });
  };

  const baseStyles = `
    inline-flex items-center justify-center px-4 py-2 rounded-md
    font-medium transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      ref={buttonRef}
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyles} ${className || ''}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={label}
      aria-describedby={description ? `${props.id}-description` : undefined}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="sr-only">{loadingText}</span>
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {loadingText}
        </>
      ) : (
        children || label
      )}
      {description && (
        <span id={`${props.id}-description`} className="sr-only">
          {description}
        </span>
      )}
    </button>
  );
}; 