import { overlaps, addMinutes, minutesBetween, formatTime, TIME_ZONE } from './dates';
import type { AppState, ConflictInfo, FocusDraft } from './types';

export function busyIntervals(state: AppState): { start: string; end: string; info: ConflictInfo }[] {
  const visibleCal = new Set(state.calendars.filter((c) => c.visible).map((c) => c.id));
  const intervals: { start: string; end: string; info: ConflictInfo }[] = [];
  for (const event of state.events) {
    if (event.allDay || event.availability === 'free') continue;
    if (!visibleCal.has(event.calendarId)) continue;
    const cal = state.calendars.find((c) => c.id === event.calendarId);
    intervals.push({
      start: event.start,
      end: event.end,
      info: {
        kind: 'event',
        id: event.id,
        title: event.title,
        calendarName: cal?.name ?? 'Calendar',
        start: event.start,
        end: event.end,
      },
    });
  }
  for (const session of state.focusSessions) {
    if (!session.blocksAvailability) continue;
    const cal = state.calendars.find((c) => c.id === session.calendarId);
    const task = state.tasks.find((t) => t.id === session.taskId);
    intervals.push({
      start: session.start,
      end: session.end,
      info: {
        kind: 'focus_session',
        id: session.id,
        title: task ? `Focus · ${task.title}` : 'Focus session',
        calendarName: cal?.name ?? 'Focus',
        start: session.start,
        end: session.end,
      },
    });
  }
  return intervals;
}

export function detectConflicts(state: AppState, start: string, end: string, ignoreId?: string): ConflictInfo[] {
  return busyIntervals(state)
    .filter((item) => item.info.id !== ignoreId && overlaps(start, end, item.start, item.end))
    .map((item) => item.info);
}

export function suggestNearbyTimes(
  state: AppState,
  start: string,
  end: string,
  ignoreId?: string,
): { start: string; end: string; label: string }[] {
  const duration = minutesBetween(start, end);
  const offsets = [-duration, duration, 60, -60, 90, 120];
  const seen = new Set<string>();
  const out: { start: string; end: string; label: string }[] = [];
  for (const offset of offsets) {
    const s = addMinutes(start, offset);
    const e = addMinutes(s, duration);
    if (detectConflicts(state, s, e, ignoreId).length) continue;
    if (seen.has(s)) continue;
    seen.add(s);
    out.push({
      start: s,
      end: e,
      label: `${formatTime(s, TIME_ZONE)}–${formatTime(e, TIME_ZONE)}`,
    });
    if (out.length >= 3) break;
  }
  return out;
}

export function shouldWarn(state: AppState, draft: FocusDraft): ConflictInfo[] {
  if (draft.ignoreConflicts) return [];
  return detectConflicts(state, draft.start, draft.end);
}
