import React from 'react';

export type CardTone = 'default' | 'attention' | 'success' | 'info';

const toneClass: Record<CardTone, string> = {
  default: 'bg-white border border-gray-200',
  attention: 'bg-white border-2 border-amber-300',
  success: 'bg-emerald-50/50 border border-emerald-300',
  info: 'bg-blue-50/60 border border-blue-200',
};

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  tone?: CardTone;
  as?: 'div' | 'section';
}

export const Card: React.FC<CardProps> = ({ tone = 'default', as = 'section', className = '', children, ...props }) => {
  const Tag = as;
  return (
    <Tag className={`rounded-2xl p-5 sm:p-6 shadow-xs ${toneClass[tone]} ${className}`} {...props}>
      {children}
    </Tag>
  );
};
