import React, { forwardRef } from 'react';
import { useHighContrastMode } from '../../hooks/useHighContrastMode';

interface AccessibleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

export const AccessibleButton = forwardRef<
  HTMLButtonElement,
  AccessibleButtonProps
>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      icon,
      className = '',
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isHighContrast = useHighContrastMode();

    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variantStyles = {
      primary: isHighContrast
        ? 'bg-black text-white hover:bg-gray-900 focus:ring-black'
        : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
      secondary: isHighContrast
        ? 'bg-white text-black border-2 border-black hover:bg-gray-100 focus:ring-black'
        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-indigo-500',
      danger: isHighContrast
        ? 'bg-black text-white hover:bg-gray-900 focus:ring-black'
        : 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      ghost: 'bg-transparent hover:bg-gray-100 focus:ring-gray-500',
    };

    const sizeStyles = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const widthStyles = fullWidth ? 'w-full' : '';

    const disabledStyles = disabled || loading
      ? 'opacity-50 cursor-not-allowed'
      : 'cursor-pointer';

    const combinedClassName = `
      ${baseStyles}
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${widthStyles}
      ${disabledStyles}
      ${className}
    `.trim();

    return (
      <button
        ref={ref}
        type={type}
        className={combinedClassName}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span
            className="inline-block animate-spin mr-2"
            role="status"
            aria-label="Loading"
          >
            ⟳
          </span>
        ) : icon ? (
          <span className="mr-2">{icon}</span>
        ) : null}
        {children}
      </button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton'; 