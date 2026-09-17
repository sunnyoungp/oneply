import type { LinkRecord } from './types';
import { uid } from './ids';

const UNSAFE = /^(javascript|data|vbscript|file|blob):/i;

export type LinkParseResult =
  | { ok: true; link: Omit<LinkRecord, 'id'> }
  | { ok: false; error: string };

export function classifyUrl(url: string): LinkRecord['kind'] {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    if (
      host.includes('zoom.us') ||
      host.includes('meet.google.com') ||
      host.includes('teams.microsoft.com') ||
      host.includes('teams.live.com')
    ) {
      return 'meeting';
    }
    if (host.endsWith('notion.so') || host.endsWith('notion.site')) return 'notion';
    return 'web';
  } catch {
    return 'web';
  }
}

export function parseUrl(raw: string, label?: string): LinkParseResult {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, error: 'Enter a URL.' };
  if (UNSAFE.test(trimmed)) {
    return { ok: false, error: 'That URL scheme is not allowed.' };
  }
  let candidate = trimmed;
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(candidate)) {
    candidate = `https://${candidate}`;
  }
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return { ok: false, error: 'That does not look like a valid URL.' };
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return { ok: false, error: 'Only http and https links are allowed.' };
  }
  if (!url.hostname.includes('.')) {
    return { ok: false, error: 'Enter a full domain, such as example.com.' };
  }
  const href = url.toString();
  return {
    ok: true,
    link: {
      url: href,
      label: (label ?? href.replace(/^https?:\/\//, '').replace(/\/$/, '')).trim() || href,
      kind: classifyUrl(href),
    },
  };
}

export function makeLink(
  url: string,
  label?: string,
): { ok: true; link: Omit<LinkRecord, 'id'>; record: LinkRecord } | { ok: false; error: string } {
  const parsed = parseUrl(url, label);
  if (parsed.ok === false) return { ok: false, error: parsed.error };
  return { ok: true, link: parsed.link, record: { id: uid('link'), ...parsed.link } };
}

export function isSafeHref(href: string): boolean {
  return parseUrl(href).ok;
}
