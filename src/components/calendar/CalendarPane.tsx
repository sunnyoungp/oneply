import { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import {
  allDayForDate,
  dateKey,
  formatDayHeading,
  formatMonthYear,
  monthGrid,
  startOfMonth,
  weekDates,
  addDays,
  type CalendarView,
} from '../../domain';
import { useStore } from '../../state/store';
import { Button, IconButton, cx } from '../ui/primitives';
import { DatabaseChip, DeadlineChip, EventBlock, FocusBlock, blockMeta } from './Blocks';
import { HOUR_PX, TimeGrid } from './TimeGrid';

const VIEWS: CalendarView[] = ['day', 'week', 'month', 'agenda'];

export function CalendarPane() {
  const { state, dispatch, open } = useStore();
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = 7 * HOUR_PX;
  }, [state.view]);
  const dates = state.view === 'day' ? [state.focusedDate] : weekDates(state.focusedDate);
  const heading =
    state.view === 'month' ? formatMonthYear(state.focusedDate) : state.view === 'day' ? formatDayHeading(state.focusedDate) : `${formatDayHeading(dates[0])} – ${formatDayHeading(dates[6])}`;

  return (
    <section className="flex min-w-0 flex-1 flex-col bg-surface" aria-label="Calendar">
      <header className="flex flex-wrap items-center gap-2 border-b border-line px-3 py-2">
        <Button variant="ghost" onClick={() => dispatch({ type: 'go_today' })}>
          Today
        </Button>
        <IconButton label="Previous range" onClick={() => dispatch({ type: 'shift_range', direction: -1 })}>
          <ChevronLeft className="h-4 w-4" />
        </IconButton>
        <IconButton label="Next range" onClick={() => dispatch({ type: 'shift_range', direction: 1 })}>
          <ChevronRight className="h-4 w-4" />
        </IconButton>
        <h1 className="min-w-0 flex-1 truncate text-[15px] font-semibold">{heading}</h1>
        <div className="flex rounded-lg border border-line p-0.5" role="tablist" aria-label="Calendar view">
          {VIEWS.map((view) => (
            <button
              key={view}
              type="button"
              role="tab"
              aria-selected={state.view === view}
              className={cx(
                'rounded-md px-2.5 py-1 text-[12px] font-medium capitalize',
                state.view === view ? 'bg-ink text-white' : 'text-ink-soft hover:bg-paper-2',
              )}
              onClick={() => dispatch({ type: 'set_view', view })}
            >
              {view}
            </button>
          ))}
        </div>
        <Button
          title="Create (N)"
          onClick={() => open({ type: 'create_chooser', via: 'button' })}
        >
          <Plus className="h-4 w-4" />
          New
        </Button>
      </header>
      {state.view === 'month' ? (
        <MonthView />
      ) : state.view === 'agenda' ? (
        <AgendaView />
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="cal-scroll min-h-0 flex-1 overflow-auto" ref={scroller}>
            <div className="sticky top-0 z-20 min-w-[720px] bg-surface">
              <AllDayRow dates={dates} />
            </div>
            <TimeGrid dates={dates} />
          </div>
        </div>
      )}
    </section>
  );
}

function AllDayRow({ dates }: { dates: string[] }) {
  const { state, select } = useStore();
  return (
    <div className="flex min-w-[720px] border-b border-line bg-surface-2/80 backdrop-blur-sm">
      <div className="w-14 shrink-0 px-1 py-2 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">All day</div>
      <div className="flex min-w-0 flex-1">
        {dates.map((date) => {
          const { events, items, deadlines } = allDayForDate(state, date);
          return (
            <div key={date} className="flex min-h-[52px] flex-1 flex-col gap-1 border-l border-line px-1 py-1">
              <div className="text-[11px] font-medium text-ink-muted">{formatDayHeading(date).split(' ')[0]} {date.slice(8)}</div>
              {events.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  className="truncate rounded-md px-1.5 py-0.5 text-left text-[11px] text-white"
                  style={{ background: state.calendars.find((c) => c.id === event.calendarId)?.color }}
                  onClick={() => select({ kind: 'event', id: event.id })}
                >
                  {event.title}
                </button>
              ))}
              {deadlines.map((task) => (
                <DeadlineChip key={task.id} task={task} onClick={() => select({ kind: 'deadline', taskId: task.id })} />
              ))}
              {items.map((item) => (
                <DatabaseChip
                  key={item.id}
                  item={item}
                  sourceName={state.notionSources.find((s) => s.id === item.databaseId)?.name ?? 'Notion'}
                  onClick={() => select({ kind: 'database_item', id: item.id })}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MonthView() {
  const { state, dispatch } = useStore();
  const days = monthGrid(state.focusedDate);
  const month = startOfMonth(state.focusedDate).slice(0, 7);
  const today = dateKey(state.now);
  return (
    <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-6">
      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
        <div key={d} className="border-b border-line px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
          {d}
        </div>
      ))}
      {days.map((date) => {
        const { events, items, deadlines } = allDayForDate(state, date);
        const timedEvents = state.events.filter((e) => !e.allDay && dateKey(e.start) === date);
        const sessions = state.focusSessions.filter((s) => dateKey(s.start) === date);
        const inMonth = date.startsWith(month);
        return (
          <button
            key={date}
            type="button"
            onClick={() => {
              dispatch({ type: 'set_focused_date', date });
              dispatch({ type: 'set_view', view: 'day' });
            }}
            onDragOver={(e) => {
              if ([...e.dataTransfer.types].includes('application/x-notcal-task')) e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              const taskId = e.dataTransfer.getData('application/x-notcal-task');
              if (!taskId) return;
              dispatch({ type: 'set_focused_date', date });
              dispatch({ type: 'open_overlay', overlay: { type: 'schedule_task', taskId } });
            }}
            className={cx(
              'flex flex-col items-start gap-0.5 overflow-hidden border-b border-l border-line p-1 text-left',
              !inMonth && 'bg-paper/60 text-ink-muted',
              date === today && 'bg-accent-soft/40',
            )}
          >
            <span className={cx('text-[12px] font-medium', date === today && 'text-accent')}>{Number(date.slice(8))}</span>
            {deadlines.slice(0, 1).map((t) => (
              <span key={t.id} className="truncate text-[10px] text-deadline">Due · {t.title}</span>
            ))}
            {sessions.slice(0, 2).map((s) => (
              <span key={s.id} className="truncate text-[10px] text-focus-ink">Focus · {state.tasks.find((t) => t.id === s.taskId)?.title}</span>
            ))}
            {timedEvents.slice(0, 2).map((e) => (
              <span key={e.id} className="truncate text-[10px]" style={{ color: state.calendars.find((c) => c.id === e.calendarId)?.color }}>{e.title}</span>
            ))}
            {items.slice(0, 1).map((i) => (
              <span key={i.id} className="truncate text-[10px] text-ink-muted">{i.title}</span>
            ))}
          </button>
        );
      })}
    </div>
  );
}

function AgendaView() {
  const { state, select } = useStore();
  const start = state.focusedDate;
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  return (
    <div className="cal-scroll min-h-0 flex-1 overflow-auto p-3">
      {days.map((date) => {
        const { events, items, deadlines } = allDayForDate(state, date);
        const timed = state.events.filter((e) => !e.allDay && dateKey(e.start) === date && state.calendars.find((c) => c.id === e.calendarId)?.visible);
        const sessions = state.focusSessions.filter((s) => dateKey(s.start) === date && state.calendars.find((c) => c.id === s.calendarId)?.visible);
        const empty = !events.length && !items.length && !deadlines.length && !timed.length && !sessions.length;
        return (
          <section key={date} className="mb-5">
            <h2 className="mb-2 text-[13px] font-semibold">{formatDayHeading(date)}</h2>
            {empty ? <p className="text-[13px] text-ink-muted">Nothing scheduled</p> : null}
            <div className="space-y-2">
              {deadlines.map((t) => (
                <DeadlineChip key={t.id} task={t} onClick={() => select({ kind: 'deadline', taskId: t.id })} />
              ))}
              {items.map((item) => (
                <DatabaseChip
                  key={item.id}
                  item={item}
                  sourceName={state.notionSources.find((s) => s.id === item.databaseId)?.name ?? 'Notion'}
                  onClick={() => select({ kind: 'database_item', id: item.id })}
                />
              ))}
              {sessions.map((s) => {
                const meta = blockMeta(state, s);
                return (
                  <div key={s.id} className="h-16">
                    <FocusBlock session={s} task={meta.task} project={meta.project} onClick={() => select({ kind: 'focus_session', id: s.id })} />
                  </div>
                );
              })}
              {timed.map((event) => (
                <div key={event.id} className="h-16">
                  <EventBlock
                    event={event}
                    calendarColor={state.calendars.find((c) => c.id === event.calendarId)?.color ?? '#3d6b8a'}
                    onClick={() => select({ kind: 'event', id: event.id })}
                  />
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
