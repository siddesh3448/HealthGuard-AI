import React, { ComponentType, ReactNode, MouseEventHandler } from 'react';

export interface ButtonProps {
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: ComponentType<{ size?: number; className?: string }>;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function Button({
  className = '',
  children,
  variant = 'primary',
  size = 'md',
  icon: IconComponent,
  iconPosition = 'left',
  isLoading = false,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  // Variant styles mapped to theme colors
  const variants = {
    primary: 'bg-brand-primary-500 hover:bg-brand-primary-600 active:bg-brand-primary-700 text-white shadow-sm border border-transparent disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none dark:disabled:bg-slate-800 dark:disabled:text-slate-600',
    secondary: 'bg-white hover:bg-brand-secondary-50 border border-slate-200 text-slate-700 active:bg-slate-100 disabled:bg-slate-100 disabled:text-slate-400 dark:bg-slate-900 dark:hover:bg-slate-850 dark:border-slate-800 dark:text-slate-200 dark:disabled:bg-slate-900 dark:disabled:text-slate-700',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white dark:active:bg-slate-750',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-medium rounded-lg',
    md: 'px-5 py-2.5 text-sm font-semibold rounded-xl', // rounded-xl matches design system token
    lg: 'px-7 py-3.5 text-base font-semibold rounded-2xl',
  };

  const isClickable = !disabled && !isLoading;

  return (
    <button
      type={type}
      disabled={!isClickable}
      className={`inline-flex items-center justify-center transition-all duration-200 active:scale-[0.98] select-none shrink-0 ${sizes[size]} ${variants[variant]} ${
        !isClickable ? 'cursor-not-allowed opacity-65' : 'cursor-pointer'
      } ${className}`}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2.5 h-4.5 w-4.5 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            path-id="button-spinner-path"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}

      {!isLoading && IconComponent && iconPosition === 'left' && (
        <IconComponent size={size === 'sm' ? 14 : size === 'lg' ? 20 : 17} className="mr-2" />
      )}

      <span>{children}</span>

      {!isLoading && IconComponent && iconPosition === 'right' && (
        <IconComponent size={size === 'sm' ? 14 : size === 'lg' ? 20 : 17} className="ml-2" />
      )}
    </button>
  );
}

export default Button;
