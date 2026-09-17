import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  Circle,
  Flag,
  Folder,
  Inbox,
  Search,
  Tag as TagIcon,
  Target,
} from 'lucide-react';
import {
  filteredTasks,
  formatDeadline,
  parseQuickEntry,
  sessionCount,
  type Priority,
  type Task,
  type TaskListView,
} from '../../domain';
import { useStore } from '../../state/store';
import { Button, TextInput, cx } from '../ui/primitives';

const VIEWS: { id: TaskListView; label: string; icon: React.ReactNode }[] = [
  { id: 'inbox', label: 'Inbox', icon: <Inbox className="h-3.5 w-3.5" /> },
  { id: 'today', label: 'Today', icon: <Circle className="h-3.5 w-3.5" /> },
  { id: 'upcoming', label: 'Upcoming', icon: <Flag className="h-3.5 w-3.5" /> },
  { id: 'completed', label: 'Completed', icon: <Check className="h-3.5 w-3.5" /> },
  { id: 'projects', label: 'Projects', icon: <Folder className="h-3.5 w-3.5" /> },
  { id: 'tags', label: 'Tags', icon: <TagIcon className="h-3.5 w-3.5" /> },
  { id: 'priorities', label: 'Priorities', icon: <Target className="h-3.5 w-3.5" /> },
];

export function TaskManager() {
  const { state, dispatch, createTask, select, open } = useStore();
  const listRef = useRef<HTMLDivElement>(null);
  const tasks = filteredTasks(state);
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = state.taskScroll;
  }, [state.rightMode, state.taskView]);
  const [draft, setDraft] = useState('');
  const preview = useMemo(() => (draft.trim() ? parseQuickEntry(draft, state.now) : null), [draft, state.now]);

  const submit = () => {
    if (!preview?.title) return;
    const project = preview.project
      ? state.projects.find((p) => p.name.toLowerCase() === preview.project?.toLowerCase())
      : undefined;
    const tagIds = preview.tags.map((name) => {
      const existing = state.tags.find((t) => t.name === name);
      if (existing) return existing.id;
      const id = `tag-${name}`;
      dispatch({ type: 'create_tag', tag: { id, name } });
      return id;
    });
    createTask(
      {
        title: preview.title,
        projectId: project?.id,
        tagIds,
        priority: preview.priority,
        deadline: preview.deadline,
        description: { blocks: [{ type: 'p', spans: [] }] },
        links: [],
      },
      'quick_entry',
    );
    setDraft('');
  };

  return (
    <div className="flex h-full flex-col bg-paper" aria-label="Task manager">
      <div className="border-b border-line px-3 py-2">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold">Tasks</h2>
          <Button variant="quiet" title="Command menu (⌘K)" onClick={() => open({ type: 'command' })}>
            ⌘K
          </Button>
        </div>
        <label className="relative block">
          <Search className="pointer-events-none absolute left-2 top-2 h-3.5 w-3.5 text-ink-muted" />
          <TextInput
            className="pl-7"
            placeholder="Search tasks"
            value={state.search}
            onChange={(e) => dispatch({ type: 'set_search', search: e.target.value })}
            aria-label="Search tasks"
          />
        </label>
      </div>
      <nav className="flex flex-wrap gap-1 border-b border-line px-2 py-2" aria-label="Task views">
        {VIEWS.map((view) => (
          <button
            key={view.id}
            type="button"
            className={cx(
              'inline-flex items-center gap-1 rounded-full px-2 py-1 text-[12px]',
              state.taskView === view.id ? 'bg-ink text-white' : 'text-ink-soft hover:bg-paper-2',
            )}
            onClick={() => dispatch({ type: 'set_task_view', view: view.id })}
          >
            {view.icon}
            {view.label}
          </button>
        ))}
      </nav>
      {state.taskView === 'projects' ? <ProjectChips /> : null}
      {state.taskView === 'tags' ? <TagChips /> : null}
      {state.taskView === 'priorities' ? <PriorityChips /> : null}
      <div
        ref={listRef}
        className="cal-scroll min-h-0 flex-1 overflow-auto px-2 py-2"
        onScroll={(e) => dispatch({ type: 'set_task_scroll', scroll: e.currentTarget.scrollTop })}
      >
        {state.taskView === 'projects' && !state.filters.projectId ? (
          <ProjectManager />
        ) : tasks.length === 0 ? (
          <p className="px-2 py-6 text-center text-[13px] text-ink-muted">No tasks in this view.</p>
        ) : (
          <ul className="space-y-1">
            {tasks.map((task) => (
              <li key={task.id}>
                <TaskRow task={task} onOpen={() => select({ kind: 'task', id: task.id })} />
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="border-t border-line p-2">
        <TextInput
          placeholder="Add a task — try: Prepare summary tomorrow #research !high"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
          }}
          aria-label="Quick task entry"
        />
        {preview?.title ? (
          <div className="mt-1.5 rounded-lg bg-surface px-2 py-1.5 text-[11px] text-ink-soft">
            <span className="font-medium text-ink">{preview.title}</span>
            {preview.deadline ? ` · due ${preview.deadline}` : ' · no deadline'}
            {preview.tags.length ? ` · #${preview.tags.join(' #')}` : ''}
            {preview.priority !== 'none' ? ` · ${preview.priority}` : ''}
            {preview.project ? ` · @${preview.project}` : ''}
          </div>
        ) : (
          <p className="mt-1 px-1 text-[11px] text-ink-muted">Enter saves. Deadlines stay optional.</p>
        )}
      </div>
    </div>
  );
}

function ProjectChips() {
  const { state, dispatch } = useStore();
  return (
    <div className="flex flex-wrap gap-1 border-b border-line px-2 py-2">
      {state.projects.filter((p) => !p.archived).map((p) => (
        <button
          key={p.id}
          type="button"
          className={cx(
            'rounded-full px-2 py-0.5 text-[11px]',
            state.filters.projectId === p.id ? 'bg-ink text-white' : 'bg-surface text-ink-soft',
          )}
          onClick={() =>
            dispatch({
              type: 'set_filters',
              filters: { projectId: state.filters.projectId === p.id ? undefined : p.id },
            })
          }
        >
          {p.name}
        </button>
      ))}
    </div>
  );
}

function TagChips() {
  const { state, dispatch } = useStore();
  return (
    <div className="flex flex-wrap gap-1 border-b border-line px-2 py-2">
      {state.tags.map((t) => (
        <button
          key={t.id}
          type="button"
          className={cx(
            'rounded-full px-2 py-0.5 text-[11px]',
            state.filters.tagId === t.id ? 'bg-ink text-white' : 'bg-surface text-ink-soft',
          )}
          onClick={() =>
            dispatch({ type: 'set_filters', filters: { tagId: state.filters.tagId === t.id ? undefined : t.id } })
          }
        >
          #{t.name}
        </button>
      ))}
    </div>
  );
}

function PriorityChips() {
  const { state, dispatch } = useStore();
  const levels: Priority[] = ['high', 'medium', 'low', 'none'];
  return (
    <div className="flex flex-wrap gap-1 border-b border-line px-2 py-2">
      {levels.map((p) => (
        <button
          key={p}
          type="button"
          className={cx(
            'rounded-full px-2 py-0.5 text-[11px] capitalize',
            state.filters.priority === p ? 'bg-ink text-white' : 'bg-surface text-ink-soft',
          )}
          onClick={() =>
            dispatch({ type: 'set_filters', filters: { priority: state.filters.priority === p ? undefined : p } })
          }
        >
          {p}
        </button>
      ))}
    </div>
  );
}

function ProjectManager() {
  const { state, dispatch } = useStore();
  const [name, setName] = useState('');
  return (
    <div className="space-y-2 px-1">
      {state.projects.map((p) => (
        <div key={p.id} className="flex items-center gap-2 rounded-lg border border-line bg-surface px-2 py-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
          <input
            className="flex-1 bg-transparent text-[13px]"
            value={p.name}
            disabled={p.archived}
            onChange={(e) => dispatch({ type: 'rename_project', id: p.id, name: e.target.value })}
            aria-label={`Rename ${p.name}`}
          />
          {!p.archived ? (
            <button type="button" className="text-[11px] text-ink-muted" onClick={() => dispatch({ type: 'archive_project', id: p.id })}>
              Archive
            </button>
          ) : (
            <span className="text-[11px] text-ink-muted">Archived</span>
          )}
        </div>
      ))}
      <div className="flex gap-1">
        <TextInput placeholder="New project" value={name} onChange={(e) => setName(e.target.value)} />
        <Button
          variant="ghost"
          onClick={() => {
            if (!name.trim()) return;
            dispatch({
              type: 'create_project',
              project: { id: `proj-${name}`, name: name.trim(), archived: false, order: state.projects.length, color: '#6b645c' },
            });
            setName('');
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
}

function TaskRow({ task, onOpen }: { task: Task; onOpen: () => void }) {
  const { state, dispatch, open } = useStore();
  const project = state.projects.find((p) => p.id === task.projectId);
  const tags = task.tagIds.map((id) => state.tags.find((t) => t.id === id)?.name).filter(Boolean);
  const sessions = sessionCount(state, task.id);
  const complete = () => {
    if (task.completed) {
      dispatch({ type: 'restore_task', id: task.id });
      return;
    }
    const future = state.focusSessions.filter((s) => s.taskId === task.id && s.start > state.now);
    if (future.length) {
      dispatch({ type: 'open_overlay', overlay: { type: 'complete_task', taskId: task.id, futureSessionIds: future.map((s) => s.id) } });
    } else {
      dispatch({ type: 'complete_task', id: task.id, futureMode: 'keep' });
    }
  };

  return (
    <div
      className={cx(
        'flex items-start gap-2 rounded-xl border border-transparent px-1.5 py-1.5 hover:border-line hover:bg-surface',
        task.syncState === 'needs_attention' && 'border-[#ead2ce] bg-[#fbf4f3]',
      )}
      draggable={!task.completed}
      onDragStart={(e) => {
        e.dataTransfer.setData('application/x-notcal-task', task.id);
        e.dataTransfer.effectAllowed = 'copy';
        dispatch({ type: 'track', name: 'task_drag_started', props: { taskId: task.id } });
      }}
    >
      <button
        type="button"
        aria-label={task.completed ? 'Restore task' : 'Complete task'}
        className="mt-0.5 text-ink-soft"
        onClick={complete}
      >
        {task.completed ? <Check className="h-4 w-4 text-ok" /> : <Circle className="h-4 w-4" />}
      </button>
      <button type="button" className="min-w-0 flex-1 text-left" onClick={onOpen}>
        <div className={cx('truncate text-[13px] font-medium', task.completed && 'text-ink-muted line-through')}>{task.title}</div>
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-ink-muted">
          {project ? <span>{project.name}</span> : null}
          {tags.map((t) => (
            <span key={t}>#{t}</span>
          ))}
          {task.priority !== 'none' ? <span className="capitalize">{task.priority}</span> : null}
          {task.deadline ? <span className="text-deadline">due {formatDeadline(task.deadline)}</span> : <span>no deadline</span>}
          <span className="inline-flex items-center gap-0.5">
            <Target className="h-3 w-3" />
            {sessions}
          </span>
        </div>
      </button>
      <button
        type="button"
        className="rounded-md px-1.5 py-1 text-[11px] font-medium text-accent hover:bg-accent-soft"
        title="Schedule focus without dragging"
        onClick={() => open({ type: 'schedule_task', taskId: task.id })}
      >
        Schedule
      </button>
    </div>
  );
}
