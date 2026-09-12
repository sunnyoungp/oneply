import React from 'react';

export type BadgeTone = 'success' | 'warning' | 'info' | 'neutral';

const toneClass: Record<BadgeTone, string> = {
  success: 'text-emerald-800 bg-emerald-50',
  warning: 'text-amber-900 bg-amber-50',
  info: 'text-[#1D4ED8] bg-[#EFF6FF] border border-[#BFDBFE]',
  neutral: 'text-gray-600 bg-gray-100',
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export const Badge: React.FC<BadgeProps> = ({ tone = 'neutral', className = '', ...props }) => (
  <span className={`inline-flex items-center gap-1.5 text-xs font-bold rounded-lg px-2.5 py-1.5 ${toneClass[tone]} ${className}`} {...props} />
);
