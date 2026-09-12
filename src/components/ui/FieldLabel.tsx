import React from 'react';

export const labelClass = 'block text-sm font-semibold text-gray-800 mb-1.5';
export const helpClass = 'block text-xs text-gray-500 mt-1.5 leading-relaxed';

export const FieldLabel: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ className = '', ...props }) => (
  <span className={`${labelClass} ${className}`} {...props} />
);

export const HelpText: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ className = '', ...props }) => (
  <span className={`${helpClass} ${className}`} {...props} />
);
