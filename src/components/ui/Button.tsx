import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'teal';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      leftIcon,
      rightIcon,
      isLoading = false,
      className = '',
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    // Base styles ensuring standard typography, optical alignment, transitions, and focus ring
    const baseStyles =
      'inline-flex items-center justify-center font-bold tracking-normal transition-all select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 whitespace-nowrap active:scale-[0.99]';

    // Distinct variants with purposeful contrast and zero unneeded gradients
    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        'bg-[#006AFF] hover:bg-blue-700 active:bg-blue-800 text-white shadow-xs focus-visible:ring-blue-500 border border-transparent',
      secondary:
        'bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-800 border border-gray-300 shadow-2xs focus-visible:ring-gray-400',
      outline:
        'bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-700 border border-gray-300 focus-visible:ring-gray-400',
      ghost:
        'bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-600 hover:text-gray-900 border border-transparent focus-visible:ring-gray-300',
      destructive:
        'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-xs focus-visible:ring-rose-500 border border-transparent',
      teal:
        'bg-[#087F7B] hover:bg-[#066562] active:bg-[#05504E] text-white shadow-xs focus-visible:ring-[#087F7B] border border-transparent',
    };

    // Mathematically scaled sizes
    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5 min-h-[34px]',
      md: 'px-4 py-2.5 text-xs sm:text-sm rounded-xl gap-2 min-h-[42px]',
      lg: 'px-6 py-3.5 text-sm sm:text-base rounded-xl gap-2.5 min-h-[48px]',
      icon: 'p-2 rounded-xl min-h-[38px] min-w-[38px] justify-center',
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children && <span>{children}</span>}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
