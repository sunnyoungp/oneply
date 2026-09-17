import { AlertCircle, Check, ChevronLeft, ChevronRight, Database, Plus } from 'lucide-react';
import {
  addMonths,
  dateKey,
  formatMonthYear,
  monthGrid,
  startOfMonth,
} from '../../domain';
import { useStore } from '../../state/store';
import { IconButton, SyncPill, cx } from '../ui/primitives';

export function LeftSidebar() {
  const { state, dispatch, open } = useStore();
  return (
    <aside
      className="flex h-full flex-col border-r border-line bg-paper"
      style={{ width: state.leftCollapsed ? 0 : state.leftWidth }}
      hidden={state.leftCollapsed}
      aria-label="Calendars and date sources"
    >
      <div className="flex items-center gap-2 px-3 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-[13px] font-semibold text-white">n</div>
        <div>
          <div className="font-display text-[16px] font-semibold leading-none">notcal</div>
          <div className="text-[11px] text-ink-muted">Plan & Do</div>
        </div>
      </div>
      <MiniMonth />
      <div className="cal-scroll min-h-0 flex-1 space-y-5 overflow-auto px-3 pb-4">
        <section>
          <h2 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Calendars</h2>
          <ul className="space-y-0.5">
            {state.calendars.map((cal) => (
              <li key={cal.id}>
                <label className="flex cursor-pointer items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-paper-2">
                  <input
                    type="checkbox"
                    checked={cal.visible}
                    onChange={() => dispatch({ type: 'toggle_calendar', id: cal.id })}
                    aria-label={`Toggle ${cal.name}`}
                  />
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: cal.color }} />
                  <span className="flex-1 text-[13px]">{cal.name}</span>
                  <span className="text-[10px] uppercase text-ink-muted">{cal.kind}</span>
                </label>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Notion sources</h2>
          <ul className="space-y-0.5">
            {state.notionSources.map((src) => (
              <li key={src.id}>
                <label className="flex cursor-pointer items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-paper-2">
                  <input
                    type="checkbox"
                    checked={src.visible}
                    onChange={() => dispatch({ type: 'toggle_notion_source', id: src.id })}
                    disabled={src.isTaskSource}
                    aria-label={`Toggle ${src.name}`}
                  />
                  <Database className="h-3.5 w-3.5 text-ink-muted" />
                  <span className="flex-1 text-[13px]">{src.name}</span>
                  {src.isTaskSource ? (
                    <span className="rounded-full bg-accent-soft px-1.5 text-[10px] font-medium text-accent">Tasks</span>
                  ) : (
                    <span className="text-[10px] text-ink-muted">dates</span>
                  )}
                </label>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] leading-snug text-ink-muted">
            Dated databases stay on the calendar unless you map them as a task source. Personal Tasks is the dedicated list.
          </p>
        </section>
        <section>
          <h2 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Visibility</h2>
          <p className="text-[12px] text-ink-soft">Events, focus sessions, deadlines, and Notion dates can be shown independently. Color is a hint — each type also has an icon and label.</p>
        </section>
      </div>
      <div className="space-y-2 border-t border-line px-3 py-3">
        <div className="flex items-start gap-2">
          {state.accountHealth.state === 'needs_attention' ? (
            <AlertCircle className="mt-0.5 h-4 w-4 text-danger" />
          ) : (
            <Check className="mt-0.5 h-4 w-4 text-ok" />
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-medium leading-tight">{state.accountHealth.label}</span>
              <SyncPill state={state.accountHealth.state} />
            </div>
            <p className="text-[11px] text-ink-muted">{state.accountHealth.detail}</p>
            {state.failedChanges[0] ? (
              <button
                type="button"
                className="mt-1 text-[12px] font-medium text-accent"
                onClick={() =>
                  open({
                    type: 'recovery',
                    objectId: state.failedChanges[0].objectId,
                    objectKind: state.failedChanges[0].objectKind,
                  })
                }
              >
                Review failed change
              </button>
            ) : null}
          </div>
        </div>
        <div className="text-[11px] text-ink-muted">Time zone · {state.timeZone.replace(/_/g, ' ')}</div>
        <label className="flex items-center gap-2 text-[12px] text-ink-soft">
          <input
            type="checkbox"
            checked={state.simulateNextSaveFailure}
            onChange={(e) => dispatch({ type: 'set_simulate_failure', value: e.target.checked })}
          />
          Simulate next save failure
        </label>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-1 rounded-lg border border-line bg-surface py-1.5 text-[12px] font-medium"
          title="Create (N)"
          onClick={() => open({ type: 'create_chooser', via: 'button' })}
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      </div>
    </aside>
  );
}

function MiniMonth() {
  const { state, dispatch } = useStore();
  const month = startOfMonth(state.focusedDate);
  const days = monthGrid(month);
  const today = dateKey(state.now);
  return (
    <div className="px-3 pb-3">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[13px] font-semibold">{formatMonthYear(month)}</span>
        <div className="flex">
          <IconButton label="Previous month" onClick={() => dispatch({ type: 'set_focused_date', date: addMonths(month, -1) })}>
            <ChevronLeft className="h-4 w-4" />
          </IconButton>
          <IconButton label="Next month" onClick={() => dispatch({ type: 'set_focused_date', date: addMonths(month, 1) })}>
            <ChevronRight className="h-4 w-4" />
          </IconButton>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-0.5 text-center text-[10px] text-ink-muted">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div key={`${d}${i}`}>{d}</div>
        ))}
        {days.map((date) => {
          const inMonth = date.startsWith(month.slice(0, 7));
          const selected = date === state.focusedDate;
          return (
            <button
              key={date}
              type="button"
              onClick={() => dispatch({ type: 'set_focused_date', date })}
              className={cx(
                'mx-auto flex h-7 w-7 items-center justify-center rounded-full text-[11px]',
                !inMonth && 'text-ink-muted/50',
                date === today && 'font-semibold text-accent',
                selected && 'bg-ink text-white',
              )}
            >
              {Number(date.slice(8))}
            </button>
          );
        })}
      </div>
    </div>
  );
}
