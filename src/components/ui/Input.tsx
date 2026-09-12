import React from 'react';

export const inputBaseClass =
  'w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-[#006AFF]';

export const inputAttentionClass =
  'w-full rounded-xl px-3 py-2.5 text-sm font-medium bg-amber-50 border-2 border-amber-600 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  attention?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', attention = false, ...props }, ref) => (
    <input
      ref={ref}
      className={`${attention ? inputAttentionClass : inputBaseClass} ${className}`}
      {...props}
    />
  )
);
Input.displayName = 'Input';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  attention?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', attention = false, children, ...props }, ref) => (
    <select
      ref={ref}
      className={`${attention ? inputAttentionClass : inputBaseClass} ${className}`}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = 'Select';
