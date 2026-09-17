import {
  Calendar,
  Database,
  Flag,
  MapPin,
  Target,
  Users,
  Video,
} from 'lucide-react';
import { durationLabel, formatTime, projectName, type AppState, type CalendarEvent, type DatabaseItem, type FocusSession, type Task } from '../../domain';
import { cx } from '../ui/primitives';

export function EventBlock({
  event,
  calendarColor,
  compact,
  onClick,
}: {
  event: CalendarEvent;
  calendarColor: string;
  compact?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      data-block="event"
      onClick={onClick}
      className={cx(
        'h-full w-full overflow-hidden rounded-md px-1.5 py-1 text-left text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]',
        compact && 'py-0.5',
      )}
      style={{ background: calendarColor }}
      aria-label={`Event ${event.title}`}
    >
      <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.08em] opacity-90">
        <Calendar className="h-3 w-3" />
        Event
      </div>
      <div className="truncate text-[12px] font-semibold leading-tight">{event.title}</div>
      {!compact ? (
        <div className="mt-0.5 flex items-center gap-1.5 text-[11px] opacity-90">
          <span>{formatTime(event.start)}</span>
          {event.attendees.length > 0 ? <Users className="h-3 w-3" /> : null}
          {event.location ? <MapPin className="h-3 w-3" /> : null}
          {event.conferencingUrl ? <Video className="h-3 w-3" /> : null}
        </div>
      ) : null}
    </button>
  );
}

export function FocusBlock({
  session,
  task,
  project,
  compact,
  onClick,
}: {
  session: FocusSession;
  task?: Task;
  project?: string;
  compact?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      data-block="focus"
      onClick={onClick}
      className={cx(
        'hatch-focus h-full w-full overflow-hidden rounded-md border border-focus-ink/25 px-1.5 py-1 text-left text-focus-ink',
        session.sessionCompleted && 'opacity-70',
        compact && 'py-0.5',
      )}
      aria-label={`Focus session for ${task?.title ?? 'task'}`}
    >
      <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.08em]">
        <Target className="h-3 w-3" />
        Focus
      </div>
      <div className="truncate text-[12px] font-semibold leading-tight text-ink">{task?.title ?? 'Focus session'}</div>
      {!compact ? (
        <div className="mt-0.5 truncate text-[11px] text-ink-soft">
          {project ? `${project} · ` : ''}
          {durationLabel(session.start, session.end)}
        </div>
      ) : null}
    </button>
  );
}

export function DeadlineChip({ task, onClick }: { task: Task; onClick: () => void }) {
  return (
    <button
      type="button"
      data-block="deadline"
      onClick={onClick}
      className="inline-flex max-w-full items-center gap-1 rounded-full border border-[#e6d2b3] bg-[#fbf4e8] px-2 py-0.5 text-left text-[11px] text-deadline"
      aria-label={`Deadline due ${task.title}`}
    >
      <Flag className="h-3 w-3" />
      <span className="truncate font-medium text-ink">{task.title}</span>
      <span className="uppercase tracking-wide">due</span>
    </button>
  );
}

export function DatabaseChip({
  item,
  sourceName,
  onClick,
}: {
  item: DatabaseItem;
  sourceName: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      data-block="database"
      onClick={onClick}
      title={sourceName}
      className="inline-flex max-w-full items-center gap-1 rounded-md border border-dashed border-line-strong bg-surface px-2 py-0.5 text-left text-[11px] text-ink"
      aria-label={`Notion item ${item.title} from ${sourceName}`}
    >
      <Database className="h-3 w-3 text-ink-muted" />
      <span className="truncate">{item.title}</span>
      <span className="text-ink-muted">{sourceName}</span>
    </button>
  );
}

export function layoutTimed<T extends { start: string; end: string }>(items: T[]): (T & { col: number; cols: number })[] {
  const sorted = [...items].sort((a, b) => +new Date(a.start) - +new Date(b.start));
  const placed: (T & { col: number; cols: number })[] = [];
  const groups: T[][] = [];
  for (const item of sorted) {
    let group = groups.find((g) => g.some((o) => +new Date(o.start) < +new Date(item.end) && +new Date(item.start) < +new Date(o.end)));
    if (!group) {
      group = [];
      groups.push(group);
    }
    group.push(item);
  }
  for (const group of groups) {
    const cols: T[][] = [];
    for (const item of group) {
      let col = cols.findIndex((c) => c.every((o) => +new Date(o.end) <= +new Date(item.start)));
      if (col === -1) {
        cols.push([item]);
      } else {
        cols[col].push(item);
      }
    }
    cols.forEach((colItems, col) => {
      for (const item of colItems) placed.push({ ...item, col, cols: cols.length });
    });
  }
  return placed;
}

export function blockMeta(state: AppState, session: FocusSession) {
  const task = state.tasks.find((t) => t.id === session.taskId);
  return { task, project: projectName(state, task?.projectId) };
}
