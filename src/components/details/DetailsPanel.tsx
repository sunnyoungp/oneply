import type React from 'react';
import {
  ArrowLeft,
  Calendar,
  Copy,
  Database,
  ExternalLink,
  Flag,
  MapPin,
  Target,
  Trash2,
  Video,
} from 'lucide-react';
import {
  formatDeadline,
  formatRangeLabel,
  formatTime,
  projectName,
  sessionsForTask,
  type CalendarEvent,
  type DatabaseItem,
  type FocusSession,
  type Priority,
  type Task,
} from '../../domain';
import { useStore } from '../../state/store';
import { Button, Field, SyncPill, TextInput } from '../ui/primitives';
import { DescriptionView, LinkList, RichEditor } from '../richtext/RichEditor';

export function DetailsPanel() {
  const { state, dispatch } = useStore();
  const selected = state.selected;
  return (
    <div className="flex h-full flex-col bg-paper" aria-label="Details">
      <div className="flex items-center gap-2 border-b border-line px-3 py-2">
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[13px] text-ink-soft hover:bg-paper-2"
          onClick={() => dispatch({ type: 'close_details' })}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to tasks
        </button>
      </div>
      <div className="cal-scroll min-h-0 flex-1 overflow-auto p-3">
        {selected?.kind === 'task' ? <TaskDetails id={selected.id} /> : null}
        {selected?.kind === 'deadline' ? <TaskDetails id={selected.taskId} asDeadline /> : null}
        {selected?.kind === 'event' ? <EventDetails id={selected.id} /> : null}
        {selected?.kind === 'focus_session' ? <FocusDetails id={selected.id} /> : null}
        {selected?.kind === 'database_item' ? <DatabaseDetails id={selected.id} /> : null}
      </div>
    </div>
  );
}

function TaskDetails({ id, asDeadline }: { id: string; asDeadline?: boolean }) {
  const { state, dispatch, persist, open, track } = useStore();
  const task = state.tasks.find((t) => t.id === id);
  if (!task) return <p>Task not found.</p>;
  const sessions = sessionsForTask(state, task.id);
  const failed = state.failedChanges.find((c) => c.objectId === task.id);

  const patch = (next: Partial<Task>) => {
    const previousJson = JSON.stringify(task);
    dispatch({ type: 'update_task', id: task.id, patch: next });
    persist(task.id, 'task', previousJson, JSON.stringify({ ...task, ...next }));
    if (next.description) track('description_edited', { object: 'task' });
    if (next.links) track('link_added', { object: 'task' });
  };

  return (
    <div className="space-y-4">
      <Header
        icon={asDeadline ? <Flag className="h-4 w-4 text-deadline" /> : null}
        kind={asDeadline ? 'Deadline' : 'Task'}
        title={task.title}
        sync={task.syncState}
      />
      <label className="flex items-center gap-2 text-[13px]">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => {
            if (task.completed) dispatch({ type: 'restore_task', id: task.id });
            else {
              const future = sessions.filter((s) => s.start > state.now);
              if (future.length) {
                dispatch({
                  type: 'open_overlay',
                  overlay: { type: 'complete_task', taskId: task.id, futureSessionIds: future.map((s) => s.id) },
                });
              } else dispatch({ type: 'complete_task', id: task.id, futureMode: 'keep' });
            }
          }}
        />
        {task.completed ? 'Completed' : 'Mark complete'}
      </label>
      <Field label="Title">
        <TextInput value={task.title} onChange={(e) => patch({ title: e.target.value })} />
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Project">
          <select
            className="w-full rounded-lg border border-line bg-surface px-2 py-1.5 text-[13px]"
            value={task.projectId ?? ''}
            onChange={(e) => patch({ projectId: e.target.value || undefined })}
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
            className="w-full rounded-lg border border-line bg-surface px-2 py-1.5 text-[13px] capitalize"
            value={task.priority}
            onChange={(e) => patch({ priority: e.target.value as Priority })}
          >
            {['none', 'low', 'medium', 'high'].map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Tags">
        <div className="flex flex-wrap gap-1">
          {state.tags.map((tag) => {
            const on = task.tagIds.includes(tag.id);
            return (
              <button
                key={tag.id}
                type="button"
                className={`rounded-full px-2 py-0.5 text-[11px] ${on ? 'bg-ink text-white' : 'bg-surface text-ink-soft'}`}
                onClick={() =>
                  patch({ tagIds: on ? task.tagIds.filter((id) => id !== tag.id) : [...task.tagIds, tag.id] })
                }
              >
                #{tag.name}
              </button>
            );
          })}
        </div>
      </Field>
      <Field label="Deadline" hint="Independent from focus sessions. Optional.">
        <TextInput
          type="date"
          value={task.deadline ?? ''}
          onChange={(e) => dispatch({ type: 'set_deadline', taskId: task.id, deadline: e.target.value || undefined })}
        />
        <p className="text-[12px] text-ink-muted">{task.deadline ? formatDeadline(task.deadline) : 'No deadline'}</p>
      </Field>
      <Field label="Description">
        <RichEditor value={task.description} onChange={(description) => patch({ description })} />
      </Field>
      <Field label="Links">
        <LinkList
          links={task.links}
          onChange={(links) => patch({ links })}
          onOpen={(link) => track('link_opened', { url: link.url })}
        />
      </Field>
      <section>
        <div className="mb-1.5 flex items-center justify-between">
          <h3 className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Focus sessions</h3>
          <Button variant="quiet" onClick={() => open({ type: 'schedule_task', taskId: task.id })}>
            Schedule
          </Button>
        </div>
        {sessions.length === 0 ? (
          <p className="text-[13px] text-ink-muted">None scheduled. Drag this task onto the calendar or use Schedule.</p>
        ) : (
          <ul className="space-y-1">
            {sessions.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-lg border border-line bg-surface px-2 py-1.5 text-left text-[13px]"
                  onClick={() => dispatch({ type: 'select', selection: { kind: 'focus_session', id: s.id } })}
                >
                  <Target className="h-3.5 w-3.5 text-focus-ink" />
                  <span className="flex-1">{formatRangeLabel(s.start, s.end)}</span>
                  {s.sessionCompleted ? <span className="text-[11px] text-ok">done</span> : null}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Activity</h3>
        <ul className="space-y-1 text-[12px] text-ink-muted">
          {task.activity.map((a) => (
            <li key={a.id}>{a.label}</li>
          ))}
        </ul>
      </section>
      <div className="text-[12px] text-ink-muted">Stored in Notion · Personal Tasks</div>
      {failed ? (
        <Button onClick={() => open({ type: 'recovery', objectId: task.id, objectKind: 'task' })}>Recover failed save</Button>
      ) : null}
      <div className="flex gap-2">
        <Button variant="ghost" onClick={() => dispatch({ type: 'update_task', id: task.id, patch: { title: `${task.title} copy` } })}>
          <Copy className="h-3.5 w-3.5" /> Duplicate
        </Button>
        <Button variant="danger" onClick={() => dispatch({ type: 'delete_task', id: task.id })}>
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </Button>
      </div>
    </div>
  );
}

function EventDetails({ id }: { id: string }) {
  const { state, dispatch, persist, track } = useStore();
  const event = state.events.find((e) => e.id === id);
  if (!event) return <p>Event not found.</p>;
  const cal = state.calendars.find((c) => c.id === event.calendarId);
  const patch = (next: Partial<CalendarEvent>) => {
    const previousJson = JSON.stringify(event);
    dispatch({ type: 'update_event', id: event.id, patch: next });
    persist(event.id, 'event', previousJson, JSON.stringify({ ...event, ...next }));
    if (next.description) track('description_edited', { object: 'event' });
  };
  return (
    <div className="space-y-4">
      <Header icon={<Calendar className="h-4 w-4" />} kind="Event" title={event.title} sync={event.syncState} />
      <Field label="Title">
        <TextInput value={event.title} onChange={(e) => patch({ title: e.target.value })} />
      </Field>
      <p className="text-[13px] text-ink-soft">{formatRangeLabel(event.start, event.end)}</p>
      <p className="text-[12px] text-ink-muted">Calendar · {cal?.name} · {cal?.account}</p>
      {event.location ? (
        <p className="flex items-center gap-1 text-[13px]">
          <MapPin className="h-3.5 w-3.5" /> {event.location}
        </p>
      ) : null}
      {event.conferencingUrl ? (
        <a
          href={event.conferencingUrl}
          className="inline-flex items-center gap-1 text-[13px] text-accent"
          onClick={(e) => {
            e.preventDefault();
            window.open(event.conferencingUrl, '_blank', 'noopener,noreferrer');
            track('link_opened', { url: event.conferencingUrl! });
          }}
        >
          <Video className="h-3.5 w-3.5" /> Join meeting
        </a>
      ) : null}
      {event.attendees.length ? (
        <ul className="text-[13px] text-ink-soft">
          {event.attendees.map((a) => (
            <li key={a.id}>
              {a.name} · {a.status}
            </li>
          ))}
        </ul>
      ) : null}
      <Field label="Description">
        <RichEditor value={event.description} onChange={(description) => patch({ description })} />
      </Field>
      <Field label="Links">
        <LinkList links={event.links} onChange={(links) => patch({ links })} onOpen={(l) => track('link_opened', { url: l.url })} />
      </Field>
      <Button variant="danger" onClick={() => dispatch({ type: 'delete_event', id: event.id })}>
        Delete event
      </Button>
    </div>
  );
}

function FocusDetails({ id }: { id: string }) {
  const { state, dispatch, persist } = useStore();
  const session = state.focusSessions.find((s) => s.id === id);
  if (!session) return <p>Session not found.</p>;
  const task = state.tasks.find((t) => t.id === session.taskId);
  const patch = (next: Partial<FocusSession>) => {
    const previousJson = JSON.stringify(session);
    dispatch({ type: 'update_focus', id: session.id, patch: next });
    persist(session.id, 'focus_session', previousJson, JSON.stringify({ ...session, ...next }));
  };
  return (
    <div className="space-y-4">
      <Header icon={<Target className="h-4 w-4 text-focus-ink" />} kind="Focus session" title={task?.title ?? 'Focus'} sync={session.syncState} />
      <p className="text-[13px]">{formatRangeLabel(session.start, session.end)}</p>
      <p className="text-[12px] text-ink-muted">
        Linked task stays in the manager. Deadline: {task?.deadline ? formatDeadline(task.deadline) : 'none'}. Moving this session will not change the deadline.
      </p>
      {task ? (
        <p className="text-[13px] text-ink-soft">
          Project · {projectName(state, task.projectId) ?? 'None'}
        </p>
      ) : null}
      <Field label="Note">
        <TextInput value={session.note ?? ''} onChange={(e) => patch({ note: e.target.value })} />
      </Field>
      <label className="flex items-center gap-2 text-[13px]">
        <input
          type="checkbox"
          checked={session.sessionCompleted}
          onChange={() => dispatch({ type: 'complete_focus', id: session.id })}
        />
        Mark this session done (does not complete the task)
      </label>
      <div className="flex gap-2">
        <Button variant="ghost" onClick={() => task && dispatch({ type: 'select', selection: { kind: 'task', id: task.id } })}>
          Open task
        </Button>
        <Button
          variant="ghost"
          onClick={() =>
            dispatch({
              type: 'move_focus',
              id: session.id,
              start: session.start,
              end: session.end,
            })
          }
        >
          {formatTime(session.start)}
        </Button>
        <Button variant="danger" onClick={() => dispatch({ type: 'delete_focus', id: session.id })}>
          Remove session
        </Button>
      </div>
    </div>
  );
}

function DatabaseDetails({ id }: { id: string }) {
  const { state } = useStore();
  const item = state.databaseItems.find((d) => d.id === id) as DatabaseItem | undefined;
  if (!item) return <p>Item not found.</p>;
  const src = state.notionSources.find((s) => s.id === item.databaseId);
  return (
    <div className="space-y-3">
      <Header icon={<Database className="h-4 w-4" />} kind="Notion database item" title={item.title} sync={item.syncState} />
      <p className="text-[13px] text-ink-soft">{src?.name} · {src?.dateProperty}</p>
      <p className="text-[13px]">This is a dated record, not a task. It has no completion checkbox.</p>
      <ul className="text-[13px] text-ink-soft">
        {Object.entries(item.properties).map(([k, v]) => (
          <li key={k}>
            {k}: {v}
          </li>
        ))}
      </ul>
      {item.url ? (
        <a href={item.url} className="inline-flex items-center gap-1 text-[13px] text-accent" onClick={(e) => {
          e.preventDefault();
          window.open(item.url, '_blank', 'noopener,noreferrer');
        }}>
          <ExternalLink className="h-3.5 w-3.5" /> Open in Notion
        </a>
      ) : null}
    </div>
  );
}

function Header({
  icon,
  kind,
  title,
  sync,
}: {
  icon: React.ReactNode;
  kind: string;
  title: string;
  sync: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
        {icon}
        {kind}
        <SyncPill state={sync} />
      </div>
      <h2 className="text-[18px] font-semibold leading-snug">{title}</h2>
    </div>
  );
}
