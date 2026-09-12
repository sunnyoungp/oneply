import React from 'react';

export type PillTone = 'neutral' | 'brand' | 'caution';

export const pillClass = (active: boolean, tone: PillTone = 'brand') => {
  const base = 'px-5 py-2 text-sm font-bold rounded-xl cursor-pointer transition-colors min-h-[38px]';
  if (!active) {
    return `${base} text-gray-800 bg-white border border-gray-300 hover:bg-gray-50`;
  }
  return tone === 'caution'
    ? `${base} text-amber-950 bg-amber-50 border-2 border-amber-500`
    : `${base} text-white bg-[#006AFF] border-2 border-[#006AFF]`;
};

export interface PillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
  tone?: PillTone;
}

export const Pill: React.FC<PillProps> = ({ active, tone, className = '', type = 'button', ...props }) => (
  <button type={type} className={`${pillClass(active, tone ?? 'brand')} ${className}`} {...props} />
);
