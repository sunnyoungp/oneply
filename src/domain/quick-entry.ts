import type { Priority } from './types';
import { dateKey, parseNaturalDate, PROTOTYPE_NOW, TIME_ZONE } from './dates';

export type QuickEntryParse = {
  title: string;
  deadline?: string;
  tags: string[];
  priority: Priority;
  project?: string;
  raw: string;
};

const PRIORITY_TOKEN = /(?:^|\s)!(high|medium|med|low|none)\b/gi;
const TAG_TOKEN = /(?:^|\s)#([a-z0-9][\w-]*)/gi;
const PROJECT_TOKEN = /(?:^|\s)@("[^"]+"|[A-Za-z][\w\s-]*)/g;

const DATE_WORDS =
  /\b(today|tomorrow|yesterday|next\s+(?:mon|tue|tues|wed|thu|thur|thurs|fri|sat|sun|monday|tuesday|wednesday|thursday|friday|saturday|sunday)(?:day)?|(?:mon|tue|tues|wed|thu|thur|thurs|fri|sat|sun|monday|tuesday|wednesday|thursday|friday|saturday|sunday)(?:day)?|\d{4}-\d{2}-\d{2}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+\d{1,2})\b/i;

export function parseQuickEntry(raw: string, now = PROTOTYPE_NOW): QuickEntryParse {
  let text = raw.trim();
  const tags: string[] = [];
  let priority: Priority = 'none';
  let project: string | undefined;
  let deadline: string | undefined;

  text = text.replace(PRIORITY_TOKEN, (_, p: string) => {
    const v = p.toLowerCase();
    priority = v === 'med' ? 'medium' : (v as Priority);
    return ' ';
  });

  text = text.replace(TAG_TOKEN, (_, tag: string) => {
    tags.push(tag.toLowerCase());
    return ' ';
  });

  text = text.replace(PROJECT_TOKEN, (_, name: string) => {
    project = name.replace(/^"|"$/g, '').trim();
    return ' ';
  });

  const dateMatch = text.match(DATE_WORDS);
  if (dateMatch) {
    deadline = parseNaturalDate(dateMatch[0], dateKey(now, TIME_ZONE));
    text = text.replace(dateMatch[0], ' ');
  }

  const title = text.replace(/\s+/g, ' ').trim();
  return { title, deadline, tags, priority, project, raw };
}
