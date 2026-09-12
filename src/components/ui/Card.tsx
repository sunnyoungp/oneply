import React from 'react';
import { cardClass } from './tokens';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: boolean;
}

export const Card: React.FC<CardProps> = ({ className = '', padding = true, children, ...props }) => {
  const base = padding ? cardClass : 'bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden';
  return (
    <div className={`${base} ${className}`} {...props}>
      {children}
    </div>
  );
};
