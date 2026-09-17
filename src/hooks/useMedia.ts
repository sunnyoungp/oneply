import { useEffect, useState } from 'react';

export function useIsDesktop(query = '(min-width: 900px)'): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : true,
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

export function isTypingTarget(target: EventTarget | null): boolean {
  const el =
    target instanceof HTMLElement ? target : target instanceof Node ? target.parentElement : null;
  if (!el) return false;
  if (el.closest('input, textarea, select, [contenteditable], [role="textbox"]')) return true;
  return el.isContentEditable;
}
