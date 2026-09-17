import React, { createContext, useCallback, useContext, useState } from 'react';
import { addMinutes, fromZoned, hourFromOffset } from '../domain';
import { HOUR_PX } from '../components/calendar/constants';
import { useStore } from './store';

type Drag = { taskId: string; title: string; x: number; y: number };

type Dnd = {
  drag: Drag | null;
  begin: (taskId: string, title: string, e: React.PointerEvent) => void;
};

const Ctx = createContext<Dnd | null>(null);

export function TaskDragProvider({ children }: { children: React.ReactNode }) {
  const { tryCreateFocus, track, state, dispatch } = useStore();
  const [drag, setDrag] = useState<Drag | null>(null);

  const begin = useCallback(
    (taskId: string, title: string, e: React.PointerEvent) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      setDrag({ taskId, title, x: e.clientX, y: e.clientY });
      track('task_drag_started', { taskId });
      const onMove = (ev: PointerEvent) => setDrag((d) => (d ? { ...d, x: ev.clientX, y: ev.clientY } : d));
      const onUp = (ev: PointerEvent) => {
        window.removeEventListener('pointermove', onMove);
        const el = document.elementFromPoint(ev.clientX, ev.clientY);
        const timed = el?.closest('[data-drop-date]') as HTMLElement | null;
        const month = el?.closest('[data-month-date]') as HTMLElement | null;
        setDrag(null);
        const calId = state.calendars.find((c) => c.kind === 'work')?.id ?? state.calendars[0].id;
        if (timed?.dataset.dropDate) {
          const date = timed.dataset.dropDate;
          const rect = timed.getBoundingClientRect();
          const { hour, minute } = hourFromOffset(ev.clientY - rect.top, HOUR_PX);
          const start = fromZoned(date, hour, minute);
          tryCreateFocus({ taskId, start, end: addMinutes(start, 90), calendarId: calId }, 'drag');
          return;
        }
        if (month?.dataset.monthDate) {
          dispatch({ type: 'set_focused_date', date: month.dataset.monthDate });
          dispatch({ type: 'open_overlay', overlay: { type: 'schedule_task', taskId } });
        }
      };
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp, { once: true });
    },
    [dispatch, state.calendars, track, tryCreateFocus],
  );

  return (
    <Ctx.Provider value={{ drag, begin }}>
      {children}
      {drag ? (
        <div
          className="pointer-events-none fixed z-[70] rounded-lg border border-focus-ink/30 bg-focus-fill px-2 py-1 text-[12px] font-medium text-focus-ink shadow-md"
          style={{ left: drag.x + 12, top: drag.y + 12 }}
        >
          Focus · {drag.title}
        </div>
      ) : null}
    </Ctx.Provider>
  );
}

export function useTaskDrag(): Dnd {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useTaskDrag requires TaskDragProvider');
  return ctx;
}
