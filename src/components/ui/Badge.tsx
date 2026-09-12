import React from 'react';
import { badgePending, badgeVerified, badgeWarning } from './tokens';

export type BadgeTone = 'verified' | 'warning' | 'pending' | 'neutral';

const toneClass: Record<BadgeTone, string> = {
  verified: badgeVerified,
  warning: badgeWarning,
  pending: badgePending,
  neutral: 'text-xs font-bold text-gray-600 bg-gray-100 rounded-lg px-2 py-1',
};

export const Badge: React.FC<{ tone?: BadgeTone; className?: string; children: React.ReactNode }> = ({
  tone = 'neutral',
  className = '',
  children,
}) => {
  return <span className={`${toneClass[tone]} ${className}`}>{children}</span>;
};
