import React, { useEffect, useRef, useState } from 'react';
import { Bold, Italic, Link2, List } from 'lucide-react';
import { docToHtml, htmlToDoc, isSafeHref, makeLink, type LinkRecord, type RichDoc } from '../../domain';
import { Button, TextInput, cx } from '../ui/primitives';

export function RichEditor({
  value,
  onChange,
  placeholder,
}: {
  value: RichDoc;
  onChange: (doc: RichDoc) => void;
  placeholder?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const html = docToHtml(value) || '<p><br/></p>';
    if (ref.current.innerHTML !== html) ref.current.innerHTML = html;
  }, [value]);

  const apply = (cmd: string) => {
    document.execCommand(cmd, false);
    if (ref.current) onChange(htmlToDoc(ref.current.innerHTML));
  };

  const addLink = () => {
    const url = window.prompt('Link URL');
    if (!url) return;
    const parsed = makeLink(url);
    if (!parsed.ok) {
      window.alert(parsed.error);
      return;
    }
    document.execCommand('createLink', false, parsed.link.url);
    if (ref.current) onChange(htmlToDoc(ref.current.innerHTML));
  };

  return (
    <div className="rounded-lg border border-line bg-surface">
      <div className="flex gap-0.5 border-b border-line px-1 py-1">
        <Tiny onClick={() => apply('bold')} label="Bold">
          <Bold className="h-3.5 w-3.5" />
        </Tiny>
        <Tiny onClick={() => apply('italic')} label="Italic">
          <Italic className="h-3.5 w-3.5" />
        </Tiny>
        <Tiny onClick={() => apply('insertUnorderedList')} label="List">
          <List className="h-3.5 w-3.5" />
        </Tiny>
        <Tiny onClick={addLink} label="Link">
          <Link2 className="h-3.5 w-3.5" />
        </Tiny>
      </div>
      <div
        ref={ref}
        contentEditable="true"
        role="textbox"
        aria-multiline="true"
        aria-label={placeholder ?? 'Description'}
        className="min-h-[88px] px-2.5 py-2 text-[13px] leading-relaxed outline-none [&_a]:text-accent [&_a]:underline"
        data-placeholder={placeholder}
        onInput={() => {
          if (ref.current) onChange(htmlToDoc(ref.current.innerHTML));
        }}
        onPaste={(e) => {
          const text = e.clipboardData.getData('text/plain');
          if (text && /^https?:\/\//i.test(text.trim())) {
            e.preventDefault();
            const parsed = makeLink(text.trim());
            if (parsed.ok) document.execCommand('insertHTML', false, `<a href="${parsed.link.url}">${parsed.link.label}</a>`);
            if (ref.current) onChange(htmlToDoc(ref.current.innerHTML));
          }
        }}
      />
    </div>
  );
}

function Tiny({ children, onClick, label }: { children: React.ReactNode; onClick: () => void; label: string }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className="rounded-md p-1.5 text-ink-soft hover:bg-paper-2">
      {children}
    </button>
  );
}

export function DescriptionView({ doc, collapsedChars = 180 }: { doc: RichDoc; collapsedChars?: number }) {
  const [open, setOpen] = useState(false);
  const html = docToHtml(doc);
  const plain = html.replace(/<[^>]+>/g, ' ').trim();
  if (!plain) return <p className="text-[13px] text-ink-muted">No description</p>;
  const long = plain.length > collapsedChars;
  return (
    <div>
      <div
        className={cx('prose-desc text-[13px] leading-relaxed text-ink [&_a]:text-accent [&_a]:underline', !open && long && 'max-h-24 overflow-hidden')}
        dangerouslySetInnerHTML={{ __html: html }}
        onClick={(e) => {
          const a = (e.target as HTMLElement).closest('a');
          if (a) {
            e.preventDefault();
            const href = a.getAttribute('href') ?? '';
            if (!isSafeHref(href)) return;
            window.open(href, '_blank', 'noopener,noreferrer');
          }
        }}
      />
      {long ? (
        <button type="button" className="mt-1 text-[12px] font-medium text-accent" onClick={() => setOpen(!open)}>
          {open ? 'Show less' : 'Show more'}
        </button>
      ) : null}
    </div>
  );
}

export function LinkList({
  links,
  onChange,
  onOpen,
}: {
  links: LinkRecord[];
  onChange: (links: LinkRecord[]) => void;
  onOpen?: (link: LinkRecord) => void;
}) {
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');
  const [error, setError] = useState<string | null>(null);

  const add = () => {
    const parsed = makeLink(url, label || undefined);
    if (!parsed.ok) {
      setError(parsed.error);
      return;
    }
    setError(null);
    onChange([...links, parsed.record]);
    setUrl('');
    setLabel('');
  };

  return (
    <div className="space-y-2">
      <ul className="space-y-1.5">
        {links.map((link) => (
          <li key={link.id} className="flex items-center gap-2 rounded-lg border border-line px-2 py-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">{link.kind}</span>
            <input
              aria-label="Link label"
              className="min-w-0 flex-1 bg-transparent text-[13px]"
              value={link.label}
              onChange={(e) => onChange(links.map((l) => (l.id === link.id ? { ...l, label: e.target.value } : l)))}
            />
            <a
              href={link.url}
              className="text-[12px] text-accent"
              onClick={(e) => {
                e.preventDefault();
                if (!isSafeHref(link.url)) return;
                onOpen?.(link);
                window.open(link.url, '_blank', 'noopener,noreferrer');
              }}
            >
              Open
            </a>
            <button type="button" className="text-[12px] text-ink-muted" onClick={() => onChange(links.filter((l) => l.id !== link.id))}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-1.5 sm:flex-row">
        <TextInput placeholder="https://" value={url} onChange={(e) => setUrl(e.target.value)} aria-label="Link URL" />
        <TextInput placeholder="Label" value={label} onChange={(e) => setLabel(e.target.value)} aria-label="Link label" />
        <Button variant="ghost" onClick={add}>
          Add link
        </Button>
      </div>
      {error ? <p className="text-[12px] text-danger">{error}</p> : null}
    </div>
  );
}
