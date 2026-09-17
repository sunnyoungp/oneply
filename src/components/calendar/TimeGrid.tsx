import React, { useRef, useState } from 'react';
import {
  addMinutes,
  dateKey,
  durationLabel,
  fromZoned,
  hourFromOffset,
  minutesBetween,
  zonedParts,
  type CalendarEvent,
  type FocusSession,
} from '../../domain';
import { useStore } from '../../state/store';
import { HOUR_PX } from './constants';
import { EventBlock, FocusBlock, layoutTimed, blockMeta } from './Blocks';

export { HOUR_PX };
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function yFor(iso: string): number {
  const p = zonedParts(iso);
  return (p.hour + p.minute / 60) * HOUR_PX;
}

function heightFor(start: string, end: string): number {
  return Math.max(22, yFor(end) - yFor(start));
}

function offsetFromEvent(e: { clientY: number }, el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  return hourFromOffset(e.clientY - rect.top, HOUR_PX);
}

type Range = { date: string; startMin: number; endMin: number };

export function TimeGrid({ dates }: { dates: string[] }) {
  const { state, dispatch, select, tryCreateFocus, track } = useStore();
  const [range, setRange] = useState<Range | null>(null);
  const [dropHint, setDropHint] = useState<{ date: string; hour: number; minute: number } | null>(null);
  const dragging = useRef<{ date: string; startMin: number } | null>(null);

  const nowParts = zonedParts(state.now);
  const nowDate = dateKey(state.now);
  const nowTop = (nowParts.hour + nowParts.minute / 60) * HOUR_PX;

  const finishRange = () => {
    if (!dragging.current || !range) {
      dragging.current = null;
      setRange(null);
      return;
    }
    const start = fromZoned(range.date, Math.floor(range.startMin / 60), range.startMin % 60);
    const end = fromZoned(range.date, Math.floor(range.endMin / 60), range.endMin % 60);
    dragging.current = null;
    setRange(null);
    if (minutesBetween(start, end) < 15) return;
    void durationLabel;
    dispatch({ type: 'open_overlay', overlay: { type: 'range_chooser', start, end } });
  };

  return (
    <div className="flex min-w-[720px]">
      <div className="w-14 shrink-0 pt-2 text-right">
        {HOURS.map((h) => (
          <div key={h} className="pr-2 text-[11px] text-ink-muted" style={{ height: HOUR_PX }}>
            <span className="-translate-y-1.5 block">
              {h === 0 ? '' : `${((h + 11) % 12) + 1} ${h < 12 ? 'AM' : 'PM'}`}
            </span>
          </div>
        ))}
      </div>
      <div className="flex min-w-0 flex-1">
        {dates.map((date) => (
          <div
            key={date}
            className="relative flex-1 border-l border-line/80"
            data-drop-date={date}
            style={{ height: 24 * HOUR_PX }}
            onPointerDown={(e) => {
              if ((e.target as HTMLElement).closest('[data-block]')) return;
              const pos = offsetFromEvent(e, e.currentTarget);
              const startMin = pos.hour * 60 + pos.minute;
              dragging.current = { date, startMin };
              setRange({ date, startMin, endMin: startMin + 30 });
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!dragging.current) return;
              const pos = offsetFromEvent(e, e.currentTarget);
              const endMin = Math.max(dragging.current.startMin + 15, pos.hour * 60 + pos.minute);
              setRange({ date: dragging.current.date, startMin: dragging.current.startMin, endMin });
            }}
            onPointerUp={finishRange}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'copy';
              const pos = offsetFromEvent(e, e.currentTarget);
              setDropHint({ date, ...pos });
            }}
            onDragLeave={() => setDropHint(null)}
            onDrop={(e) => {
              e.preventDefault();
              const taskId =
                e.dataTransfer.getData('application/x-notcal-task') ||
                e.dataTransfer.getData('text/plain').replace(/^notcal-task:/, '');
              const pos = dropHint ?? { ...offsetFromEvent(e, e.currentTarget), date };
              setDropHint(null);
              if (!taskId) return;
              track('task_drag_started', { taskId });
              const start = fromZoned(date, pos.hour, pos.minute);
              const calId = state.calendars.find((c) => c.kind === 'work')?.id ?? state.calendars[0].id;
              tryCreateFocus({ taskId, start, end: addMinutes(start, 90), calendarId: calId }, 'drag');
            }}
          >
            {HOURS.map((h) => (
              <div key={h} className="border-t border-line/70" style={{ height: HOUR_PX }} />
            ))}
            <DayBlocks date={date} />
            {range && range.date === date ? (
              <div
                className="pointer-events-none absolute right-1 left-1 z-[2] rounded-md border border-dashed border-accent bg-accent/10"
                style={{
                  top: (range.startMin / 60) * HOUR_PX,
                  height: ((range.endMin - range.startMin) / 60) * HOUR_PX,
                }}
              />
            ) : null}
            {dropHint && dropHint.date === date ? (
              <div
                className="pointer-events-none absolute right-1 left-1 z-[2] rounded-md border border-focus-ink/40 bg-focus-fill/80"
                style={{ top: (dropHint.hour + dropHint.minute / 60) * HOUR_PX, height: 1.5 * HOUR_PX }}
              />
            ) : null}
            {date === nowDate ? (
              <div className="pointer-events-none absolute right-0 left-0 z-10" style={{ top: nowTop }}>
                <div className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full bg-danger" />
                <div className="h-px bg-danger" />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function DayBlocks({ date }: { date: string }) {
  const { state, select } = useStore();
  const events = state.events.filter(
    (e) => !e.allDay && dateKey(e.start) === date && state.calendars.find((c) => c.id === e.calendarId)?.visible,
  );
  const sessions = state.focusSessions.filter(
    (s) => dateKey(s.start) === date && state.calendars.find((c) => c.id === s.calendarId)?.visible,
  );
  const mixed = layoutTimed([
    ...events.map((e) => ({ ...e, _kind: 'event' as const })),
    ...sessions.map((s) => ({ ...s, _kind: 'focus' as const })),
  ]);
  return (
    <>
      {mixed.map((item) => {
        const style: React.CSSProperties = {
          top: yFor(item.start),
          height: heightFor(item.start, item.end),
          left: `calc(${(item.col / item.cols) * 100}% + 2px)`,
          width: `calc(${100 / item.cols}% - 4px)`,
        };
        if (item._kind === 'event') {
          const event = item as CalendarEvent & { col: number; cols: number; _kind: 'event' };
          const color = state.calendars.find((c) => c.id === event.calendarId)?.color ?? '#3d6b8a';
          return (
            <div key={event.id} className="absolute z-[1]" style={style}>
              <EventBlock
                event={event}
                calendarColor={color}
                compact={heightFor(event.start, event.end) < 40}
                onClick={() => select({ kind: 'event', id: event.id })}
              />
            </div>
          );
        }
        const session = item as FocusSession & { col: number; cols: number; _kind: 'focus' };
        const meta = blockMeta(state, session);
        return (
          <div key={session.id} className="absolute z-[1]" style={style}>
            <FocusBlock
              session={session}
              task={meta.task}
              project={meta.project}
              compact={heightFor(session.start, session.end) < 40}
              onClick={() => select({ kind: 'focus_session', id: session.id })}
            />
          </div>
        );
      })}
    </>
  );
}
