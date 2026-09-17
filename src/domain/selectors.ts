import { TIME_ZONE, dateKey } from './dates';
import { docToPlain } from './richtext';
import type { AppState, CalendarEvent, DatabaseItem, FocusSession, Priority, Task } from './types';

export function visibleEvents(state: AppState): CalendarEvent[] {
  const ids = new Set(state.calendars.filter((c) => c.visible).map((c) => c.id));
  return state.events.filter((e) => ids.has(e.calendarId));
}

export function visibleDatabaseItems(state: AppState): DatabaseItem[] {
  const ids = new Set(state.notionSources.filter((s) => s.visible && !s.isTaskSource).map((s) => s.id));
  return state.databaseItems.filter((d) => ids.has(d.databaseId));
}

export function visibleFocusSessions(state: AppState): FocusSession[] {
  const ids = new Set(state.calendars.filter((c) => c.visible).map((c) => c.id));
  return state.focusSessions.filter((s) => ids.has(s.calendarId));
}

export function projectName(state: AppState, id?: string): string | undefined {
  return state.projects.find((p) => p.id === id)?.name;
}

export function tagNames(state: AppState, ids: string[]): string[] {
  return ids.map((id) => state.tags.find((t) => t.id === id)?.name).filter((n): n is string => Boolean(n));
}

export function taskMatchesSearch(task: Task, search: string): boolean {
  if (!search.trim()) return true;
  const q = search.toLowerCase();
  return (
    task.title.toLowerCase().includes(q) ||
    docToPlain(task.description).toLowerCase().includes(q)
  );
}

export function filteredTasks(state: AppState): Task[] {
  const today = dateKey(state.now, TIME_ZONE);
  let list = state.tasks.filter((t) => taskMatchesSearch(t, state.search));
  if (state.filters.projectId) list = list.filter((t) => t.projectId === state.filters.projectId);
  if (state.filters.tagId) list = list.filter((t) => t.tagIds.includes(state.filters.tagId!));
  if (state.filters.priority) list = list.filter((t) => t.priority === state.filters.priority);
  const view = state.taskView;
  if (view === 'completed') return list.filter((t) => t.completed);
  if (!state.filters.showCompleted) list = list.filter((t) => !t.completed);
  if (view === 'inbox') return list;
  if (view === 'today') {
    return list.filter((t) => {
      if (t.deadline && t.deadline <= today) return true;
      return state.focusSessions.some((s) => s.taskId === t.id && dateKey(s.start, TIME_ZONE) === today);
    });
  }
  if (view === 'upcoming') return list.filter((t) => t.deadline && t.deadline > today);
  if (view === 'projects') {
    if (state.filters.projectId) return list.filter((t) => t.projectId === state.filters.projectId);
    return list.filter((t) => Boolean(t.projectId));
  }
  if (view === 'tags') {
    if (state.filters.tagId) return list.filter((t) => t.tagIds.includes(state.filters.tagId!));
    return list.filter((t) => t.tagIds.length > 0);
  }
  if (view === 'priorities') {
    const order: Record<Priority, number> = { high: 0, medium: 1, low: 2, none: 3 };
    return [...list].sort((a, b) => order[a.priority] - order[b.priority]);
  }
  return list;
}

export function inboxTasks(state: AppState): Task[] {
  return state.tasks.filter((t) => !t.completed && !t.projectId);
}

export function sessionCount(state: AppState, taskId: string): number {
  return state.focusSessions.filter((s) => s.taskId === taskId).length;
}

export function deadlinesOnDate(state: AppState, date: string): Task[] {
  return state.tasks.filter((t) => !t.completed && t.deadline === date);
}

export function allDayForDate(state: AppState, date: string) {
  const events = visibleEvents(state).filter((e) => e.allDay && dateKey(e.start, TIME_ZONE) === date);
  const items = visibleDatabaseItems(state).filter((d) => dateKey(d.start, TIME_ZONE) === date);
  const deadlines = deadlinesOnDate(state, date);
  return { events, items, deadlines };
}

export function timedForDate(state: AppState, date: string) {
  const events = visibleEvents(state).filter((e) => !e.allDay && dateKey(e.start, TIME_ZONE) === date);
  const sessions = visibleFocusSessions(state).filter((s) => dateKey(s.start, TIME_ZONE) === date);
  return { events, sessions };
}

export function selectedTask(state: AppState): Task | undefined {
  const sel = state.selected;
  if (!sel) return undefined;
  if (sel.kind === 'task') return state.tasks.find((t) => t.id === sel.id);
  if (sel.kind === 'deadline') return state.tasks.find((t) => t.id === sel.taskId);
  if (sel.kind === 'focus_session') {
    const s = state.focusSessions.find((x) => x.id === sel.id);
    return s ? state.tasks.find((t) => t.id === s.taskId) : undefined;
  }
  return undefined;
}
