import type { RichDoc, RichSpan, RichBlock } from './types';

export function emptyDoc(): RichDoc {
  return { blocks: [{ type: 'p', spans: [] }] };
}

export function textDoc(text: string): RichDoc {
  if (!text.trim()) return emptyDoc();
  const paragraphs = text.split(/\n{2,}/);
  return {
    blocks: paragraphs.map((p) => {
      const lines = p.split('\n');
      if (lines.every((l) => /^[-*]\s/.test(l))) {
        return {
          type: 'ul' as const,
          items: lines.map((l) => autoLinkSpans(l.replace(/^[-*]\s/, ''))),
        };
      }
      return { type: 'p' as const, spans: autoLinkSpans(lines.join(' ')) };
    }),
  };
}

const URL_RE = /((https?:\/\/|www\.)[^\s<>"']+[^\s<>"'.,;:!?])/gi;

export function autoLinkSpans(text: string): RichSpan[] {
  const spans: RichSpan[] = [];
  let last = 0;
  const re = new RegExp(URL_RE);
  let match: RegExpExecArray | null;
  while ((match = re.exec(text))) {
    if (match.index > last) spans.push({ text: text.slice(last, match.index) });
    const raw = match[0];
    const href = raw.startsWith('http') ? raw : `https://${raw}`;
    spans.push({ text: raw, href });
    last = match.index + raw.length;
  }
  if (last < text.length) spans.push({ text: text.slice(last) });
  if (spans.length === 0) spans.push({ text });
  return spans.filter((s) => s.text.length > 0);
}

export function docToPlain(doc: RichDoc): string {
  return doc.blocks
    .map((block) => {
      if (block.type === 'p') return spansToPlain(block.spans);
      return block.items.map((item) => `• ${spansToPlain(item)}`).join('\n');
    })
    .join('\n\n')
    .trim();
}

export function spansToPlain(spans: RichSpan[]): string {
  return spans.map((s) => s.text).join('');
}

export function docIsEmpty(doc: RichDoc): boolean {
  return docToPlain(doc).length === 0;
}

export function docToHtml(doc: RichDoc): string {
  return doc.blocks
    .map((block) => {
      if (block.type === 'p') return `<p>${spansToHtml(block.spans)}</p>`;
      const tag = block.type;
      const items = block.items.map((item) => `<li>${spansToHtml(item)}</li>`).join('');
      return `<${tag}>${items}</${tag}>`;
    })
    .join('');
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function spansToHtml(spans: RichSpan[]): string {
  return spans
    .map((span) => {
      let inner = escapeHtml(span.text);
      if (span.marks?.includes('bold')) inner = `<strong>${inner}</strong>`;
      if (span.marks?.includes('italic')) inner = `<em>${inner}</em>`;
      if (span.href) {
        const safe = span.href;
        inner = `<a href="${escapeHtml(safe)}" rel="noreferrer noopener" target="_blank">${inner}</a>`;
      }
      return inner;
    })
    .join('');
}

export function htmlToDoc(html: string): RichDoc {
  const wrapped = html.trim() || '<p></p>';
  const template = typeof document !== 'undefined' ? document.createElement('template') : null;
  if (!template) return textDoc(html.replace(/<[^>]+>/g, ' '));
  template.innerHTML = wrapped;
  const blocks: RichBlock[] = [];
  const walk = (node: ParentNode) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === 1) {
        const el = child as HTMLElement;
        const tag = el.tagName.toLowerCase();
        if (tag === 'p' || tag === 'div') {
          blocks.push({ type: 'p', spans: inlineToSpans(el) });
        } else if (tag === 'ul' || tag === 'ol') {
          const items = Array.from(el.children)
            .filter((li) => li.tagName.toLowerCase() === 'li')
            .map((li) => inlineToSpans(li as HTMLElement));
          blocks.push({ type: tag, items: items.length ? items : [[]] });
        } else if (tag === 'br') {
          blocks.push({ type: 'p', spans: [] });
        } else {
          walk(el);
        }
      } else if (child.nodeType === 3 && child.textContent?.trim()) {
        blocks.push({ type: 'p', spans: autoLinkSpans(child.textContent) });
      }
    }
  };
  walk(template.content);
  return { blocks: blocks.length ? blocks : [{ type: 'p', spans: [] }] };
}

function inlineToSpans(el: HTMLElement): RichSpan[] {
  const spans: RichSpan[] = [];
  const visit = (node: Node, marks: RichSpan['marks'], href?: string) => {
    if (node.nodeType === 3) {
      const text = node.textContent ?? '';
      if (!text) return;
      if (href) {
        spans.push({ text, marks: marks?.length ? marks : undefined, href });
      } else {
        spans.push(...autoLinkSpans(text).map((s) => ({ ...s, marks: marks?.length ? marks : s.marks })));
      }
      return;
    }
    if (node.nodeType !== 1) return;
    const eln = node as HTMLElement;
    const tag = eln.tagName.toLowerCase();
    const nextMarks = [...(marks ?? [])];
    if (tag === 'strong' || tag === 'b') nextMarks.push('bold');
    if (tag === 'em' || tag === 'i') nextMarks.push('italic');
    let nextHref = href;
    if (tag === 'a') nextHref = eln.getAttribute('href') ?? href;
    for (const child of Array.from(eln.childNodes)) visit(child, nextMarks, nextHref);
  };
  for (const child of Array.from(el.childNodes)) visit(child, []);
  return spans.length ? spans : [];
}
