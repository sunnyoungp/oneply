import React from 'react';

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export function IconButton({
  label,
  onClick,
  children,
  className,
  disabled,
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cx(
        'inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-soft hover:bg-paper-2 hover:text-ink disabled:opacity-40',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  className,
  disabled,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'danger' | 'quiet';
  type?: 'button' | 'submit';
  className?: string;
  disabled?: boolean;
  title?: string;
}) {
  const styles = {
    primary: 'bg-accent text-white hover:bg-[#b04e1c]',
    ghost: 'bg-surface text-ink border border-line hover:bg-paper-2',
    quiet: 'bg-transparent text-ink-soft hover:bg-paper-2 hover:text-ink',
    danger: 'bg-danger text-white hover:bg-[#8e2f28]',
  }[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cx(
        'inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium disabled:opacity-40',
        styles,
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">{label}</span>
      {children}
      {hint ? <span className="block text-[12px] text-ink-muted">{hint}</span> : null}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cx(
        'w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[13px] text-ink placeholder:text-ink-muted',
        props.className,
      )}
    />
  );
}

export function Dialog({
  title,
  onClose,
  children,
  width = 'w-[420px]',
  labelledBy,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
  labelledBy?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#2a2622]/35 p-3 sm:items-center" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy ?? 'dialog-title'}
        className={cx('max-h-[90vh] overflow-auto rounded-2xl border border-line bg-surface shadow-xl', width, 'max-w-[calc(100vw-24px)]')}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 id={labelledBy ?? 'dialog-title'} className="text-[15px] font-semibold">
            {title}
          </h2>
          <button type="button" aria-label="Close" className="rounded-md px-2 py-1 text-ink-muted hover:bg-paper-2" onClick={onClose}>
            Esc
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export function SyncPill({ state }: { state: string }) {
  const map: Record<string, string> = {
    saved: 'text-ok bg-[#e6f3ea]',
    saving: 'text-ink-soft bg-paper-2',
    offline: 'text-ink-soft bg-paper-2',
    needs_attention: 'text-danger bg-[#f8e8e6]',
    conflict_detected: 'text-warn bg-[#f8ecdc]',
  };
  const label: Record<string, string> = {
    saved: 'Saved',
    saving: 'Saving',
    offline: 'Offline',
    needs_attention: 'Needs attention',
    conflict_detected: 'Conflict',
  };
  return (
    <span className={cx('inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium', map[state] ?? 'bg-paper-2')}>
      {label[state] ?? state}
    </span>
  );
}
