/**
 * Design tokens extracted from the updated Rental Application Profile
 * (ProfileStep + Rental Application v2). Single source of truth for visuals.
 */

export const colors = {
  brand: '#006AFF',
  brandHover: '#0d5cb0',
  text: '#111827', // gray-900
  textMuted: '#4b5563', // gray-600
  textSubtle: '#6b7280', // gray-500
  border: '#e5e7eb', // gray-200
  borderStrong: '#d1d5db', // gray-300
  surface: '#ffffff',
  surfaceMuted: '#f9fafb', // gray-50
  success: '#047857', // emerald-700
  successBg: '#ecfdf5', // emerald-50
  warning: '#78350f', // amber-900
  warningBg: '#fffbeb', // amber-50
  warningBorder: '#fcd34d', // amber-300
  pending: '#1D4ED8',
  pendingBg: '#EFF6FF',
  pendingBorder: '#BFDBFE',
} as const;

export const inputClass =
  'w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-[#006AFF]';

export const labelClass = 'block text-sm font-semibold text-gray-800 mb-1.5';

export const helpClass = 'block text-xs text-gray-500 mt-1.5 leading-relaxed';

export const cardClass = 'bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-xs';

export const pageClass = 'min-h-screen bg-white flex flex-col font-sans text-gray-900';

export const badgeVerified =
  'flex-none text-xs font-bold text-emerald-800 bg-emerald-50 rounded-lg px-2.5 py-1.5';

export const badgeWarning =
  'flex-none text-xs font-bold text-amber-900 bg-amber-50 rounded-lg px-2.5 py-1.5';

export const badgePending =
  'text-xs font-bold text-[#1D4ED8] bg-[#EFF6FF] border border-[#BFDBFE] px-3 py-1.5 rounded-xl';

export const outlineBrandClass = '!border-[#006AFF] !text-[#006AFF] hover:!bg-blue-50';
