import { uid } from './ids';
import { emptyDoc } from './richtext';
import type { CalendarEvent, EventDraft, FocusSession, Task, TaskDraft } from './types';

export function taskFromDraft(draft: TaskDraft, now: string): Task {
  return {
    kind: 'task',
    id: uid('task'),
    title: draft.title.trim() || 'Untitled task',
    completed: false,
    projectId: draft.projectId,
    tagIds: [...draft.tagIds],
    priority: draft.priority,
    deadline: draft.deadline,
    description: draft.description ?? emptyDoc(),
    links: draft.links.map((l) => ({ ...l })),
    createdAt: now,
    updatedAt: now,
    syncState: 'saving',
    activity: [{ id: uid('act'), at: now, label: 'Created' }],
  };
}

export function eventFromDraft(draft: EventDraft, now: string): CalendarEvent {
  const attendees = draft.attendeesText
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((name) => ({
      id: uid('att'),
      name: name.includes('@') ? name.split('@')[0] : name,
      email: name.includes('@') ? name : `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      status: 'needs_action' as const,
    }));
  return {
    kind: 'event',
    id: uid('evt'),
    title: draft.title.trim() || 'Untitled event',
    start: draft.start,
    end: draft.end,
    allDay: draft.allDay,
    calendarId: draft.calendarId,
    attendees,
    location: draft.location || undefined,
    conferencingUrl: draft.conferencingUrl || undefined,
    description: draft.description ?? emptyDoc(),
    links: draft.links.map((l) => ({ ...l })),
    availability: 'busy',
    visibility: 'default',
    timeZone: 'America/New_York',
    createdAt: now,
    updatedAt: now,
    syncState: 'saving',
  };
}

export function focusFromRange(
  taskId: string,
  start: string,
  end: string,
  calendarId: string,
  now: string,
): FocusSession {
  return {
    kind: 'focus_session',
    id: uid('focus'),
    taskId,
    start,
    end,
    blocksAvailability: true,
    calendarId,
    sessionCompleted: false,
    createdAt: now,
    updatedAt: now,
    syncState: 'saving',
  };
}

export function emptyTaskDraft(): TaskDraft {
  return {
    title: '',
    tagIds: [],
    priority: 'none',
    description: emptyDoc(),
    links: [],
  };
}

export function emptyEventDraft(calendarId: string, start: string, end: string): EventDraft {
  return {
    title: '',
    start,
    end,
    allDay: false,
    calendarId,
    attendeesText: '',
    location: '',
    conferencingUrl: '',
    description: emptyDoc(),
    links: [],
  };
}
