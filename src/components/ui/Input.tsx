import React from 'react';
import { helpClass, inputClass, labelClass } from './tokens';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, className = '', id, ...props }, ref) => {
    return (
      <label className="block" htmlFor={id}>
        {label && <span className={labelClass}>{label}</span>}
        <input ref={ref} id={id} className={`${inputClass} ${className}`} {...props} />
        {hint && <span className={helpClass}>{hint}</span>}
      </label>
    );
  }
);

Input.displayName = 'Input';
