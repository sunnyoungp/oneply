import { appendAnalytics } from './analytics';
import { addDays, addMonths, dateKey, startOfMonth, startOfWeek, TIME_ZONE } from './dates';
import type {
  AppAction,
  AppState,
  CalendarEvent,
  FailedChange,
  FocusSession,
  ObjectKind,
  Task,
} from './types';

function stamp(state: AppState): string {
  return state.now;
}

function withAccountHealth(state: AppState): AppState {
  const failed = state.failedChanges.length;
  const saving = countBySync(state, 'saving');
  const offline = countBySync(state, 'offline');
  if (failed) {
    return {
      ...state,
      accountHealth: {
        label: 'Personal Tasks · Notion',
        state: 'needs_attention',
        detail: `${failed} change${failed === 1 ? '' : 's'} need${failed === 1 ? 's' : ''} attention`,
      },
    };
  }
  if (offline) {
    return {
      ...state,
      accountHealth: { label: 'Workspace', state: 'offline', detail: 'Offline — changes queued' },
    };
  }
  if (saving) {
    return {
      ...state,
      accountHealth: { label: 'Workspace', state: 'saving', detail: 'Saving…' },
    };
  }
  return {
    ...state,
    accountHealth: { label: 'Workspace', state: 'saved', detail: 'All changes saved' },
  };
}

function countBySync(state: AppState, sync: AppState['tasks'][number]['syncState']): number {
  return (
    state.tasks.filter((t) => t.syncState === sync).length +
    state.events.filter((e) => e.syncState === sync).length +
    state.focusSessions.filter((s) => s.syncState === sync).length
  );
}

function mapSync(
  state: AppState,
  objectId: string,
  objectKind: ObjectKind,
  syncState: AppState['tasks'][number]['syncState'],
): AppState {
  if (objectKind === 'task' || objectKind === 'deadline') {
    return { ...state, tasks: state.tasks.map((t) => (t.id === objectId ? { ...t, syncState, updatedAt: stamp(state) } : t)) };
  }
  if (objectKind === 'event') {
    return { ...state, events: state.events.map((e) => (e.id === objectId ? { ...e, syncState, updatedAt: stamp(state) } : e)) };
  }
  if (objectKind === 'focus_session') {
    return {
      ...state,
      focusSessions: state.focusSessions.map((s) => (s.id === objectId ? { ...s, syncState, updatedAt: stamp(state) } : s)),
    };
  }
  return {
    ...state,
    databaseItems: state.databaseItems.map((d) => (d.id === objectId ? { ...d, syncState, updatedAt: stamp(state) } : d)),
  };
}

function restoreObject(state: AppState, kind: ObjectKind, json: string | null, objectId: string): AppState {
  if (json === null) {
    if (kind === 'task') return { ...state, tasks: state.tasks.filter((t) => t.id !== objectId) };
    if (kind === 'event') return { ...state, events: state.events.filter((e) => e.id !== objectId) };
    if (kind === 'focus_session') {
      return { ...state, focusSessions: state.focusSessions.filter((s) => s.id !== objectId) };
    }
    return { ...state, databaseItems: state.databaseItems.filter((d) => d.id !== objectId) };
  }
  const parsed = JSON.parse(json) as Task | CalendarEvent | FocusSession;
  if (kind === 'task' || kind === 'deadline') {
    const next = parsed as Task;
    const exists = state.tasks.some((t) => t.id === next.id);
    return { ...state, tasks: exists ? state.tasks.map((t) => (t.id === next.id ? next : t)) : [...state.tasks, next] };
  }
  if (kind === 'event') {
    const next = parsed as CalendarEvent;
    const exists = state.events.some((e) => e.id === next.id);
    return { ...state, events: exists ? state.events.map((e) => (e.id === next.id ? next : e)) : [...state.events, next] };
  }
  if (kind === 'focus_session') {
    const next = parsed as FocusSession;
    const exists = state.focusSessions.some((s) => s.id === next.id);
    return {
      ...state,
      focusSessions: exists
        ? state.focusSessions.map((s) => (s.id === next.id ? next : s))
        : [...state.focusSessions, next],
    };
  }
  return state;
}

function applyPending(state: AppState, change: FailedChange): AppState {
  return restoreObject(state, change.objectKind, change.pendingJson, change.objectId);
}

export function futureSessionIds(state: AppState, taskId: string): string[] {
  return state.focusSessions
    .filter((s) => s.taskId === taskId && new Date(s.start) > new Date(state.now) && !s.sessionCompleted)
    .map((s) => s.id);
}

export function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'set_now':
      return { ...state, now: action.now };
    case 'set_view':
      return appendAnalytics({ ...state, view: action.view }, 'view_changed', { view: action.view });
    case 'set_focused_date':
      return { ...state, focusedDate: action.date };
    case 'go_today':
      return { ...state, focusedDate: dateKey(state.now, TIME_ZONE) };
    case 'shift_range': {
      if (state.view === 'day' || state.view === 'agenda') {
        return { ...state, focusedDate: addDays(state.focusedDate, action.direction) };
      }
      if (state.view === 'week') {
        return { ...state, focusedDate: addDays(startOfWeek(state.focusedDate), action.direction * 7) };
      }
      const month = startOfMonth(state.focusedDate);
      const nextMonth = addMonths(month, action.direction);
      return { ...state, focusedDate: nextMonth };
    }
    case 'set_mobile_tab':
      return {
        ...state,
        mobileTab: action.tab,
        view: action.tab === 'agenda' ? 'agenda' : state.view === 'agenda' && action.tab === 'calendar' ? 'day' : state.view,
      };
    case 'toggle_calendar':
      return {
        ...state,
        calendars: state.calendars.map((c) => (c.id === action.id ? { ...c, visible: !c.visible } : c)),
      };
    case 'toggle_notion_source':
      return {
        ...state,
        notionSources: state.notionSources.map((s) => (s.id === action.id ? { ...s, visible: !s.visible } : s)),
      };
    case 'set_task_view':
      return { ...state, taskView: action.view, rightMode: 'tasks' };
    case 'set_filters':
      return appendAnalytics(
        { ...state, filters: { ...state.filters, ...action.filters } },
        'task_filter_applied',
        { keys: Object.keys(action.filters).join(',') },
      );
    case 'set_search':
      return { ...state, search: action.search };
    case 'set_task_scroll':
      return { ...state, taskScroll: action.scroll };
    case 'select': {
      const snapshot =
        state.rightMode === 'tasks'
          ? {
              taskView: state.taskView,
              filters: { ...state.filters },
              search: state.search,
              scroll: state.taskScroll,
            }
          : state.detailsReturn;
      return { ...state, selected: action.selection, rightMode: 'details', detailsReturn: snapshot };
    }
    case 'close_details': {
      const snap = state.detailsReturn;
      return {
        ...state,
        selected: null,
        rightMode: 'tasks',
        taskView: snap?.taskView ?? state.taskView,
        filters: snap?.filters ?? state.filters,
        search: snap?.search ?? state.search,
        taskScroll: snap?.scroll ?? 0,
        detailsReturn: null,
      };
    }
    case 'toggle_left':
      return { ...state, leftCollapsed: !state.leftCollapsed };
    case 'toggle_right':
      return { ...state, rightCollapsed: !state.rightCollapsed };
    case 'set_left_width':
      return { ...state, leftWidth: Math.min(360, Math.max(200, action.width)) };
    case 'set_right_width':
      return { ...state, rightWidth: Math.min(480, Math.max(280, action.width)) };
    case 'open_overlay': {
      let next: AppState = { ...state, overlay: action.overlay };
      if (action.overlay.type === 'create_chooser') {
        next = appendAnalytics(next, 'create_menu_opened', { via: action.overlay.via });
      }
      if (action.overlay.type === 'task_composer') {
        next = appendAnalytics(next, 'task_create_started', { via: action.overlay.via });
      }
      if (action.overlay.type === 'event_composer') {
        next = appendAnalytics(next, 'event_create_started', { via: action.overlay.via });
      }
      return next;
    }
    case 'close_overlay':
      return { ...state, overlay: null };
    case 'create_task': {
      const task: Task = { ...action.task, updatedAt: stamp(state), createdAt: action.task.createdAt || stamp(state) };
      let next: AppState = {
        ...state,
        tasks: [...state.tasks, task],
        overlay: null,
      };
      if (action.focus) {
        const session: FocusSession = {
          kind: 'focus_session',
          ...action.focus,
          id: `${task.id}-focus`,
          taskId: task.id,
          createdAt: stamp(state),
          updatedAt: stamp(state),
          syncState: 'saving',
        };
        next = { ...next, focusSessions: [...next.focusSessions, session] };
        next = appendAnalytics(next, 'focus_session_created', { taskId: task.id, via: action.via });
      }
      next = appendAnalytics(next, 'task_created', { via: action.via, hasDeadline: Boolean(task.deadline) });
      next = appendAnalytics(next, 'creation_method_used', { method: action.via, object: 'task' });
      return withAccountHealth(next);
    }
    case 'update_task':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.id
            ? {
                ...t,
                ...action.patch,
                id: t.id,
                kind: 'task',
                deadline: 'deadline' in action.patch ? action.patch.deadline : t.deadline,
                updatedAt: stamp(state),
              }
            : t,
        ),
      };
    case 'set_deadline': {
      const task = state.tasks.find((t) => t.id === action.taskId);
      if (!task) return state;
      const prev = task.deadline;
      const name = prev ? 'task_deadline_changed' : 'task_deadline_added';
      const next = {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId
            ? {
                ...t,
                deadline: action.deadline,
                updatedAt: stamp(state),
                activity: [
                  ...t.activity,
                  {
                    id: `${t.id}-dl-${stamp(state)}`,
                    at: stamp(state),
                    label: action.deadline ? `Deadline set to ${action.deadline}` : 'Deadline removed',
                  },
                ],
              }
            : t,
        ),
        focusSessions: state.focusSessions,
      };
      return appendAnalytics(next, name, { taskId: action.taskId });
    }
    case 'complete_task': {
      const task = state.tasks.find((t) => t.id === action.id);
      if (!task) return state;
      const future = futureSessionIds(state, action.id);
      let sessions = state.focusSessions.map((s) => {
        if (s.taskId !== action.id) return s;
        if (new Date(s.end) <= new Date(state.now)) {
          return { ...s, sessionCompleted: true, updatedAt: stamp(state) };
        }
        return s;
      });
      const removedSessions = action.futureMode === 'remove'
        ? state.focusSessions.filter((s) => future.includes(s.id))
        : [];
      if (action.futureMode === 'remove') {
        sessions = sessions.filter((s) => !future.includes(s.id));
      }
      const undoAction: AppAction = {
        type: 'undo_complete',
        taskId: action.id,
        removedSessions,
      };
      const next: AppState = {
        ...state,
        overlay: null,
        tasks: state.tasks.map((t) =>
          t.id === action.id
            ? {
                ...t,
                completed: true,
                completedAt: stamp(state),
                updatedAt: stamp(state),
                activity: [...t.activity, { id: `${t.id}-done`, at: stamp(state), label: 'Completed' }],
              }
            : t,
        ),
        focusSessions: sessions,
        undo: undoAction,
        toast: {
          id: `undo-${action.id}`,
          message: 'Task completed',
          actionLabel: 'Undo',
          action: undoAction,
        },
      };
      return appendAnalytics(
        appendAnalytics(next, 'task_completed', { taskId: action.id }),
        'future_sessions_resolution_selected',
        { mode: action.futureMode, count: future.length },
      );
    }
    case 'undo_complete': {
      const existingIds = new Set(state.focusSessions.map((s) => s.id));
      const restoredSessions = action.removedSessions.filter((s) => !existingIds.has(s.id));
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId
            ? { ...t, completed: false, completedAt: undefined, updatedAt: stamp(state) }
            : t,
        ),
        focusSessions: [...state.focusSessions, ...restoredSessions],
        toast: { id: 'undone', message: 'Task restored' },
        undo: null,
        overlay: null,
      };
    }
    case 'restore_task':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.id
            ? {
                ...t,
                completed: false,
                completedAt: undefined,
                updatedAt: stamp(state),
                activity: [...t.activity, { id: `${t.id}-rest`, at: stamp(state), label: 'Restored' }],
              }
            : t,
        ),
      };
    case 'delete_task':
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.id),
        focusSessions: state.focusSessions.filter((s) => s.taskId !== action.id),
        selected: state.selected?.kind === 'task' && state.selected.id === action.id ? null : state.selected,
        rightMode:
          state.selected?.kind === 'task' && state.selected.id === action.id ? 'tasks' : state.rightMode,
      };
    case 'create_event': {
      const next = {
        ...state,
        events: [...state.events, { ...action.event, createdAt: stamp(state), updatedAt: stamp(state) }],
        overlay: null,
      };
      return appendAnalytics(
        appendAnalytics(next, 'event_created', { via: action.via }),
        'creation_method_used',
        { method: action.via, object: 'event' },
      );
    }
    case 'update_event':
      return {
        ...state,
        events: state.events.map((e) =>
          e.id === action.id ? { ...e, ...action.patch, kind: 'event', id: e.id, updatedAt: stamp(state) } : e,
        ),
      };
    case 'delete_event':
      return {
        ...state,
        events: state.events.filter((e) => e.id !== action.id),
        selected: state.selected?.kind === 'event' && state.selected.id === action.id ? null : state.selected,
      };
    case 'create_focus': {
      const task = state.tasks.find((t) => t.id === action.session.taskId);
      const next: AppState = {
        ...state,
        focusSessions: [...state.focusSessions, { ...action.session, updatedAt: stamp(state) }],
        overlay: null,
        tasks: state.tasks.map((t) =>
          t.id === action.session.taskId
            ? {
                ...t,
                activity: [
                  ...t.activity,
                  { id: `${t.id}-fs`, at: stamp(state), label: 'Focus session scheduled' },
                ],
              }
            : t,
        ),
      };
      void task;
      return appendAnalytics(next, 'focus_session_created', {
        taskId: action.session.taskId,
        via: action.via,
      });
    }
    case 'move_focus': {
      const next = {
        ...state,
        focusSessions: state.focusSessions.map((s) =>
          s.id === action.id ? { ...s, start: action.start, end: action.end, updatedAt: stamp(state) } : s,
        ),
      };
      return appendAnalytics(next, 'focus_session_rescheduled', { id: action.id });
    }
    case 'update_focus':
      return {
        ...state,
        focusSessions: state.focusSessions.map((s) =>
          s.id === action.id ? { ...s, ...action.patch, id: s.id, kind: 'focus_session', updatedAt: stamp(state) } : s,
        ),
      };
    case 'complete_focus':
      return {
        ...state,
        focusSessions: state.focusSessions.map((s) =>
          s.id === action.id ? { ...s, sessionCompleted: true, updatedAt: stamp(state) } : s,
        ),
      };
    case 'delete_focus':
      return {
        ...state,
        focusSessions: state.focusSessions.filter((s) => s.id !== action.id),
        selected:
          state.selected?.kind === 'focus_session' && state.selected.id === action.id ? null : state.selected,
      };
    case 'create_project':
      return { ...state, projects: [...state.projects, action.project] };
    case 'rename_project':
      return {
        ...state,
        projects: state.projects.map((p) => (p.id === action.id ? { ...p, name: action.name } : p)),
      };
    case 'reorder_projects':
      return {
        ...state,
        projects: action.ids
          .map((id, order) => {
            const p = state.projects.find((x) => x.id === id);
            return p ? { ...p, order } : null;
          })
          .filter((p): p is NonNullable<typeof p> => Boolean(p))
          .concat(state.projects.filter((p) => !action.ids.includes(p.id))),
      };
    case 'archive_project':
      return {
        ...state,
        projects: state.projects.map((p) => (p.id === action.id ? { ...p, archived: true } : p)),
      };
    case 'create_tag':
      return { ...state, tags: [...state.tags, action.tag] };
    case 'mark_saving':
      return withAccountHealth(mapSync(state, action.objectId, action.objectKind, 'saving'));
    case 'mark_saved':
      return withAccountHealth({
        ...mapSync(state, action.objectId, action.objectKind, 'saved'),
        failedChanges: state.failedChanges.filter((c) => c.objectId !== action.objectId),
      });
    case 'mark_failed': {
      const next = mapSync(state, action.change.objectId, action.change.objectKind, 'needs_attention');
      return withAccountHealth(
        appendAnalytics(
          {
            ...next,
            failedChanges: [...state.failedChanges.filter((c) => c.objectId !== action.change.objectId), action.change],
          },
          'sync_failed',
          { objectId: action.change.objectId },
        ),
      );
    }
    case 'retry_save': {
      const change = state.failedChanges.find((c) => c.id === action.changeId);
      if (!change) return state;
      const applied = applyPending(state, change);
      return withAccountHealth(
        appendAnalytics(
          {
            ...mapSync(applied, change.objectId, change.objectKind, 'saving'),
          },
          'sync_retry_started',
          { objectId: change.objectId },
        ),
      );
    }
    case 'discard_change': {
      const change = state.failedChanges.find((c) => c.id === action.changeId);
      if (!change) return state;
      const restored = restoreObject(state, change.objectKind, change.previousJson, change.objectId);
      const cleaned = {
        ...restored,
        failedChanges: state.failedChanges.filter((c) => c.id !== action.changeId),
      };
      return withAccountHealth(mapSync(cleaned, change.objectId, change.objectKind, 'saved'));
    }
    case 'set_simulate_failure':
      return { ...state, simulateNextSaveFailure: action.value };
    case 'track':
      return appendAnalytics(state, action.name, action.props);
    case 'toast':
      return { ...state, toast: action.toast };
    default:
      return state;
  }
}

export function sessionsForTask(state: AppState, taskId: string): FocusSession[] {
  return state.focusSessions
    .filter((s) => s.taskId === taskId)
    .sort((a, b) => +new Date(a.start) - +new Date(b.start));
}
