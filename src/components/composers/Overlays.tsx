import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Calendar, CheckSquare, Search, Target } from 'lucide-react';
import {
  addMinutes,
  emptyEventDraft,
  emptyTaskDraft,
  formatRangeLabel,
  fromZoned,
  parseQuickEntry,
  zonedParts,
  type EventDraft,
  type TaskDraft,
} from '../../domain';
import { useStore } from '../../state/store';
import { Button, Dialog, Field, TextInput } from '../ui/primitives';
import { LinkList, RichEditor } from '../richtext/RichEditor';

export function OverlayHost() {
  const { state, dispatch, closeOverlay, confirmFocusAnyway, tryCreateFocus, retry, discard } = useStore();
  const overlay = state.overlay;
  if (!overlay) return null;
  if (overlay.type === 'create_chooser') return <CreateChooser />;
  if (overlay.type === 'task_composer') return <TaskComposer draft={overlay.draft} via={overlay.via} />;
  if (overlay.type === 'event_composer') return <EventComposer draft={overlay.draft} via={overlay.via} />;
  if (overlay.type === 'range_chooser') return <RangeChooser start={overlay.start} end={overlay.end} />;
  if (overlay.type === 'focus_picker') return <FocusPicker start={overlay.start} end={overlay.end} />;
  if (overlay.type === 'schedule_task') return <ScheduleDialog taskId={overlay.taskId} />;
  if (overlay.type === 'conflict') {
    return (
      <Dialog title="This time is busy" onClose={closeOverlay}>
        <p className="mb-3 text-[13px] text-ink-soft">
          {formatRangeLabel(overlay.draft.start, overlay.draft.end)} overlaps an existing commitment. Scheduling anyway will not change the task deadline.
        </p>
        <ul className="mb-3 space-y-1 text-[13px]">
          {overlay.conflicts.map((c) => (
            <li key={c.id} className="rounded-lg border border-line px-2 py-1.5">
              <span className="font-medium">{c.title}</span>
              <span className="text-ink-muted"> · {c.calendarName}</span>
            </li>
          ))}
        </ul>
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Nearby openings</p>
        <div className="mb-3 flex flex-wrap gap-1">
          {overlay.suggestions.map((s) => (
            <Button
              key={s.start}
              variant="ghost"
              onClick={() => {
                dispatch({ type: 'track', name: 'conflict_resolution_selected', props: { choice: 'nearby' } });
                tryCreateFocus({ ...overlay.draft, start: s.start, end: s.end, ignoreConflicts: true }, 'drag');
              }}
            >
              {s.label}
            </Button>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={closeOverlay}>
            Cancel
          </Button>
          <Button onClick={confirmFocusAnyway}>Schedule anyway</Button>
        </div>
      </Dialog>
    );
  }
  if (overlay.type === 'complete_task') {
    const task = state.tasks.find((t) => t.id === overlay.taskId);
    return (
      <Dialog title="Keep future focus sessions?" onClose={closeOverlay}>
        <p className="mb-3 text-[13px] text-ink-soft">
          Completing <span className="font-medium text-ink">{task?.title}</span> keeps past work history. {overlay.futureSessionIds.length} future session{overlay.futureSessionIds.length === 1 ? '' : 's'} remain.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => dispatch({ type: 'complete_task', id: overlay.taskId, futureMode: 'keep' })}>
            Keep sessions
          </Button>
          <Button onClick={() => dispatch({ type: 'complete_task', id: overlay.taskId, futureMode: 'remove' })}>
            Remove future sessions
          </Button>
        </div>
      </Dialog>
    );
  }
  if (overlay.type === 'command') return <CommandMenu />;
  if (overlay.type === 'shortcuts') return <ShortcutsDialog />;
  if (overlay.type === 'recovery') {
    const change = state.failedChanges.find((c) => c.objectId === overlay.objectId) ?? state.failedChanges[0];
    if (!change) {
      return (
        <Dialog title="All caught up" onClose={closeOverlay}>
          <p className="text-[13px]">There are no failed changes.</p>
        </Dialog>
      );
    }
    return (
      <Dialog title="Needs attention" onClose={closeOverlay}>
        <p className="mb-2 text-[13px]">{change.message}</p>
        <p className="mb-3 text-[12px] text-ink-muted">The item is still visible. Nothing was deleted.</p>
        <pre className="mb-3 max-h-32 overflow-auto rounded-lg bg-paper-2 p-2 text-[11px]">{change.pendingJson.slice(0, 400)}</pre>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => retry(change.id)}>Retry</Button>
          <Button variant="ghost" onClick={() => discard(change.id)}>
            Discard change
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              void navigator.clipboard?.writeText(change.pendingJson);
              dispatch({ type: 'toast', toast: { id: 'copied', message: 'Unsaved content copied' } });
            }}
          >
            Copy unsaved content
          </Button>
        </div>
      </Dialog>
    );
  }
  return null;
}

function CreateChooser() {
  const { state, open, closeOverlay } = useStore();
  const start = fromZoned(state.focusedDate, 10, 0);
  return (
    <Dialog title="Create" onClose={closeOverlay}>
      <div className="grid gap-2">
        <Choice
          icon={<CheckSquare className="h-5 w-5" />}
          title="Task"
          subtitle="Something you need to complete"
          hint="T"
          onClick={() => open({ type: 'task_composer', draft: emptyTaskDraft(), via: 'button' })}
        />
        <Choice
          icon={<Calendar className="h-5 w-5" />}
          title="Event"
          subtitle="A scheduled calendar commitment"
          hint="E"
          onClick={() =>
            open({
              type: 'event_composer',
              draft: emptyEventDraft(state.calendars[0].id, start, addMinutes(start, 60)),
              via: 'button',
            })
          }
        />
      </div>
    </Dialog>
  );
}

function Choice({
  icon,
  title,
  subtitle,
  hint,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  hint?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-start gap-3 rounded-xl border border-line px-3 py-3 text-left hover:bg-paper-2"
    >
      <span className="mt-0.5 text-ink-soft">{icon}</span>
      <span className="flex-1">
        <span className="block text-[14px] font-semibold">{title}</span>
        <span className="block text-[13px] text-ink-muted">{subtitle}</span>
      </span>
      {hint ? <kbd className="rounded-md bg-paper-2 px-1.5 py-0.5 text-[11px] text-ink-muted">{hint}</kbd> : null}
    </button>
  );
}

function TaskComposer({ draft, via }: { draft: TaskDraft; via: 'button' | 'shortcut' | 'drag' | 'command' | 'quick_entry' | 'accessible' }) {
  const { state, createTask, closeOverlay } = useStore();
  const [form, setForm] = useState(draft);
  const parsed = useMemo(() => parseQuickEntry(form.title, state.now), [form.title, state.now]);
  return (
    <Dialog title="New task" onClose={closeOverlay} width="w-[520px]">
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          createTask(
            {
              ...form,
              title: parsed.title || form.title,
              deadline: form.deadline ?? parsed.deadline,
              priority: form.priority !== 'none' ? form.priority : parsed.priority,
            },
            via,
          );
        }}
      >
        <Field label="Title">
          <TextInput autoFocus value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="What needs to get done?" />
        </Field>
        {parsed.title && parsed.title !== form.title ? (
          <p className="text-[12px] text-ink-muted">
            Will save as “{parsed.title}”
            {parsed.deadline ? ` · due ${parsed.deadline}` : ''}
            {parsed.tags.length ? ` · #${parsed.tags.join(' #')}` : ''}
          </p>
        ) : null}
        <div className="grid grid-cols-2 gap-2">
          <Field label="Project">
            <select
              className="w-full rounded-lg border border-line bg-surface px-2 py-1.5 text-[13px]"
              value={form.projectId ?? ''}
              onChange={(e) => setForm({ ...form, projectId: e.target.value || undefined })}
            >
              <option value="">None</option>
              {state.projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Priority">
            <select
              className="w-full rounded-lg border border-line bg-surface px-2 py-1.5 text-[13px]"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value as TaskDraft['priority'] })}
            >
              <option value="none">None</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </Field>
        </div>
        <Field label="Deadline" hint="Leave empty unless this work is due.">
          <TextInput type="date" value={form.deadline ?? ''} onChange={(e) => setForm({ ...form, deadline: e.target.value || undefined })} />
        </Field>
        <Field label="Description">
          <RichEditor value={form.description} onChange={(description) => setForm({ ...form, description })} />
        </Field>
        <Field label="Links">
          <LinkList links={form.links} onChange={(links) => setForm({ ...form, links })} />
        </Field>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={closeOverlay}>
            Cancel
          </Button>
          <Button type="submit">Save task</Button>
        </div>
      </form>
    </Dialog>
  );
}

function EventComposer({ draft, via }: { draft: EventDraft; via: 'button' | 'shortcut' | 'drag' | 'command' | 'quick_entry' | 'accessible' }) {
  const { state, createEvent, closeOverlay } = useStore();
  const [form, setForm] = useState(draft);
  return (
    <Dialog title="New event" onClose={closeOverlay} width="w-[520px]">
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          createEvent(form, via);
        }}
      >
        <Field label="Title">
          <TextInput autoFocus value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Meeting or commitment" />
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Start">
            <TextInput type="datetime-local" value={toLocalInput(form.start)} onChange={(e) => setForm({ ...form, start: fromLocalInput(e.target.value) })} />
          </Field>
          <Field label="End">
            <TextInput type="datetime-local" value={toLocalInput(form.end)} onChange={(e) => setForm({ ...form, end: fromLocalInput(e.target.value) })} />
          </Field>
        </div>
        <Field label="Calendar">
          <select
            className="w-full rounded-lg border border-line bg-surface px-2 py-1.5 text-[13px]"
            value={form.calendarId}
            onChange={(e) => setForm({ ...form, calendarId: e.target.value })}
          >
            {state.calendars.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Attendees">
          <TextInput placeholder="Names or emails, comma-separated" value={form.attendeesText} onChange={(e) => setForm({ ...form, attendeesText: e.target.value })} />
        </Field>
        <Field label="Location">
          <TextInput value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </Field>
        <Field label="Conferencing">
          <TextInput placeholder="https://meet.google.com/…" value={form.conferencingUrl} onChange={(e) => setForm({ ...form, conferencingUrl: e.target.value })} />
        </Field>
        <Field label="Description">
          <RichEditor value={form.description} onChange={(description) => setForm({ ...form, description })} />
        </Field>
        <Field label="Links">
          <LinkList links={form.links} onChange={(links) => setForm({ ...form, links })} />
        </Field>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={closeOverlay}>
            Cancel
          </Button>
          <Button type="submit">Save event</Button>
        </div>
      </form>
    </Dialog>
  );
}

function RangeChooser({ start, end }: { start: string; end: string }) {
  const { state, open, closeOverlay } = useStore();
  return (
    <Dialog title={formatRangeLabel(start, end)} onClose={closeOverlay}>
      <div className="grid gap-2">
        <Choice
          icon={<Target className="h-5 w-5" />}
          title="Focus on a task"
          subtitle="Select an existing task or create a new one"
          onClick={() => open({ type: 'focus_picker', start, end })}
        />
        <Choice
          icon={<Calendar className="h-5 w-5" />}
          title="Create an event"
          subtitle="Add a meeting or calendar commitment"
          onClick={() =>
            open({
              type: 'event_composer',
              draft: emptyEventDraft(state.calendars[0].id, start, end),
              via: 'drag',
            })
          }
        />
      </div>
    </Dialog>
  );
}

function FocusPicker({ start, end }: { start: string; end: string }) {
  const { state, tryCreateFocus, closeOverlay, createTask } = useStore();
  const [query, setQuery] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const calId = state.calendars.find((c) => c.kind === 'work')?.id ?? state.calendars[0].id;
  const tasks = state.tasks.filter((t) => !t.completed && t.title.toLowerCase().includes(query.toLowerCase()));
  return (
    <Dialog title="Focus on a task" onClose={closeOverlay} width="w-[480px]">
      <p className="mb-3 text-[13px] text-ink-muted">{formatRangeLabel(start, end)} · Deadline stays empty unless you add one.</p>
      <label className="relative mb-3 block">
        <Search className="pointer-events-none absolute left-2 top-2 h-3.5 w-3.5 text-ink-muted" />
        <TextInput className="pl-7" placeholder="Search tasks" value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <ul className="mb-3 max-h-48 space-y-1 overflow-auto">
        {tasks.map((t) => (
          <li key={t.id}>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-lg border border-line px-2 py-1.5 text-left text-[13px] hover:bg-paper-2"
              onClick={() => tryCreateFocus({ taskId: t.id, start, end, calendarId: calId }, 'drag')}
            >
              <span>{t.title}</span>
              <span className="text-[11px] text-ink-muted">{t.deadline ? `due ${t.deadline}` : 'no deadline'}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <TextInput placeholder="Create new task" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
        <Button
          onClick={() => {
            if (!newTitle.trim()) return;
            const id = createTask(
              {
                title: newTitle.trim(),
                tagIds: [],
                priority: 'none',
                description: { blocks: [{ type: 'p', spans: [] }] },
                links: [],
                withFocus: { start, end },
              },
              'drag',
            );
            void id;
            closeOverlay();
          }}
        >
          Create & schedule
        </Button>
      </div>
    </Dialog>
  );
}

function ScheduleDialog({ taskId }: { taskId: string }) {
  const { state, tryCreateFocus, closeOverlay } = useStore();
  const task = state.tasks.find((t) => t.id === taskId);
  const [date, setDate] = useState(state.focusedDate);
  const [start, setStart] = useState('10:00');
  const [end, setEnd] = useState('11:30');
  const calId = state.calendars.find((c) => c.kind === 'work')?.id ?? state.calendars[0].id;
  return (
    <Dialog title={`Schedule · ${task?.title ?? 'Task'}`} onClose={closeOverlay}>
      <p className="mb-3 text-[13px] text-ink-muted">Creates a focus session. Will not add or change a deadline.</p>
      <div className="mb-3 grid grid-cols-3 gap-2">
        <Field label="Date">
          <TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Start">
          <TextInput type="time" value={start} onChange={(e) => setStart(e.target.value)} />
        </Field>
        <Field label="End">
          <TextInput type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
        </Field>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={closeOverlay}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            const [sh, sm] = start.split(':').map(Number);
            const [eh, em] = end.split(':').map(Number);
            tryCreateFocus(
              { taskId, start: fromZoned(date, sh, sm), end: fromZoned(date, eh, em), calendarId: calId },
              'accessible',
            );
          }}
        >
          Add focus session
        </Button>
      </div>
    </Dialog>
  );
}

function CommandMenu() {
  const { state, dispatch, open, closeOverlay } = useStore();
  const [q, setQ] = useState('');
  const start = fromZoned(state.focusedDate, 10, 0);
  const commands = [
    { id: 'task', label: 'Create task', hint: 'T', run: () => open({ type: 'task_composer', draft: emptyTaskDraft(), via: 'command' }) },
    { id: 'event', label: 'Create event', hint: 'E', run: () => open({ type: 'event_composer', draft: emptyEventDraft(state.calendars[0].id, start, addMinutes(start, 60)), via: 'command' }) },
    { id: 'focus', label: 'Schedule focus for selected / first task', hint: 'F', run: () => {
      const id = state.selected?.kind === 'task' ? state.selected.id : state.tasks.find((t) => !t.completed)?.id;
      if (id) open({ type: 'schedule_task', taskId: id });
    } },
    { id: 'today', label: 'Go to today', run: () => dispatch({ type: 'go_today' }) },
    { id: 'day', label: 'Day view', run: () => dispatch({ type: 'set_view', view: 'day' }) },
    { id: 'week', label: 'Week view', run: () => dispatch({ type: 'set_view', view: 'week' }) },
    { id: 'month', label: 'Month view', run: () => dispatch({ type: 'set_view', view: 'month' }) },
    { id: 'agenda', label: 'Agenda view', run: () => dispatch({ type: 'set_view', view: 'agenda' }) },
    { id: 'inbox', label: 'Inbox', run: () => dispatch({ type: 'set_task_view', view: 'inbox' }) },
    { id: 'fail', label: 'Simulate next save failure', run: () => dispatch({ type: 'set_simulate_failure', value: true }) },
    { id: 'keys', label: 'Keyboard shortcuts', hint: '?', run: () => open({ type: 'shortcuts' }) },
  ].filter((c) => c.label.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-[#2a2622]/35 p-4 pt-[12vh]" onMouseDown={closeOverlay}>
      <div
        data-command-root
        role="dialog"
        aria-label="Command menu"
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-surface shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <TextInput autoFocus placeholder="Type a command…" value={q} onChange={(e) => setQ(e.target.value)} className="rounded-none border-0 border-b" />
        <ul className="max-h-80 overflow-auto p-1">
          {commands.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[13px] hover:bg-paper-2"
                onClick={() => {
                  closeOverlay();
                  c.run();
                }}
              >
                {c.label}
                {c.hint ? <kbd className="text-[11px] text-ink-muted">{c.hint}</kbd> : null}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ShortcutsDialog() {
  const { closeOverlay } = useStore();
  const rows = [
    ['N', 'Task or event chooser'],
    ['T', 'New task'],
    ['E', 'New event'],
    ['F', 'Schedule focus'],
    ['⌘ / Ctrl K', 'Command menu'],
    ['?', 'This list'],
    ['Esc', 'Close overlay or details'],
  ];
  return (
    <Dialog title="Keyboard shortcuts" onClose={closeOverlay}>
      <p className="mb-3 text-[13px] text-ink-muted">Shortcuts are paused while you type in a field.</p>
      <table className="w-full text-left text-[13px]">
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="border-t border-line">
              <td className="py-1.5 font-medium">{r[0]}</td>
              <td className="py-1.5 text-ink-soft">{r[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Dialog>
  );
}

function toLocalInput(iso: string): string {
  const p = zonedParts(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${p.date}T${pad(p.hour)}:${pad(p.minute)}`;
}

function fromLocalInput(value: string): string {
  const [date, time] = value.split('T');
  const [h, m] = (time ?? '10:00').split(':').map(Number);
  return fromZoned(date, h, m);
}
