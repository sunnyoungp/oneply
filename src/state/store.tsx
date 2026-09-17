import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import {
  createSeedState,
  detectConflicts,
  eventFromDraft,
  focusFromRange,
  futureSessionIds,
  reducer,
  suggestNearbyTimes,
  taskFromDraft,
  uid,
  type AnalyticsEventName,
  type AppAction,
  type AppState,
  type CreationMethod,
  type EventDraft,
  type FailedChange,
  type FocusDraft,
  type ObjectKind,
  type Overlay,
  type Selection,
  type TaskDraft,
} from '../domain';

type Store = {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  createTask: (draft: TaskDraft, via: CreationMethod) => string;
  createEvent: (draft: EventDraft, via: CreationMethod) => string;
  tryCreateFocus: (draft: FocusDraft, via: CreationMethod) => 'ok' | 'conflict';
  confirmFocusAnyway: () => void;
  persist: (objectId: string, objectKind: ObjectKind, previousJson: string | null, pendingJson: string) => void;
  retry: (changeId: string) => void;
  discard: (changeId: string) => void;
  open: (overlay: Overlay) => void;
  closeOverlay: () => void;
  select: (selection: Selection) => void;
  track: (name: AnalyticsEventName, props?: Record<string, string | number | boolean | null>) => void;
};

const Ctx = createContext<Store | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createSeedState);
  const stateRef = useRef(state);
  stateRef.current = state;
  const pendingFocus = useRef<{ draft: FocusDraft; via: CreationMethod } | null>(null);

  const persist = useCallback(
    (objectId: string, objectKind: ObjectKind, previousJson: string | null, pendingJson: string) => {
      dispatch({ type: 'mark_saving', objectId, objectKind });
      window.setTimeout(() => {
        const current = stateRef.current;
        const fail = current.simulateNextSaveFailure;
        if (fail) {
          const change: FailedChange = {
            id: uid('fail'),
            objectId,
            objectKind,
            action: previousJson ? 'update' : 'create',
            previousJson,
            pendingJson,
            message: 'Could not reach Personal Tasks in Notion. The item is still on this device.',
            createdAt: current.now,
          };
          dispatch({ type: 'set_simulate_failure', value: false });
          dispatch({ type: 'mark_failed', change });
          dispatch({
            type: 'toast',
            toast: { id: uid('toast'), message: 'Save failed — tap to recover', actionLabel: 'Review' },
          });
          return;
        }
        dispatch({ type: 'mark_saved', objectId, objectKind });
        if (current.failedChanges.some((c) => c.objectId === objectId)) {
          dispatch({ type: 'track', name: 'sync_recovered', props: { objectId } });
        }
      }, 420);
    },
    [],
  );

  const createTask = useCallback(
    (draft: TaskDraft, via: CreationMethod) => {
      const current = stateRef.current;
      const task = taskFromDraft(draft, current.now);
      const focus = draft.withFocus
        ? {
            taskId: task.id,
            start: draft.withFocus.start,
            end: draft.withFocus.end,
            blocksAvailability: true,
            calendarId: current.calendars.find((c) => c.kind === 'work')?.id ?? current.calendars[0].id,
            sessionCompleted: false,
          }
        : undefined;
      dispatch({ type: 'create_task', task, via, focus });
      persist(task.id, 'task', null, JSON.stringify(task));
      if (focus) persist(`${task.id}-focus`, 'focus_session', null, JSON.stringify(focus));
      return task.id;
    },
    [persist],
  );

  const createEvent = useCallback(
    (draft: EventDraft, via: CreationMethod) => {
      const event = eventFromDraft(draft, stateRef.current.now);
      dispatch({ type: 'create_event', event, via });
      persist(event.id, 'event', null, JSON.stringify(event));
      return event.id;
    },
    [persist],
  );

  const tryCreateFocus = useCallback(
    (draft: FocusDraft, via: CreationMethod): 'ok' | 'conflict' => {
      const current = stateRef.current;
      const conflicts = draft.ignoreConflicts ? [] : detectConflicts(current, draft.start, draft.end);
      if (conflicts.length) {
        pendingFocus.current = { draft, via };
        dispatch({
          type: 'track',
          name: 'calendar_conflict_detected',
          props: { count: conflicts.length },
        });
        dispatch({
          type: 'open_overlay',
          overlay: {
            type: 'conflict',
            draft,
            conflicts,
            suggestions: suggestNearbyTimes(current, draft.start, draft.end),
          },
        });
        return 'conflict';
      }
      let taskId = draft.taskId;
      if (!taskId && draft.newTaskTitle) {
        taskId = createTask(
          {
            title: draft.newTaskTitle,
            tagIds: [],
            priority: 'none',
            description: { blocks: [{ type: 'p', spans: [] }] },
            links: [],
          },
          via,
        );
      }
      if (!taskId) return 'ok';
      const session = focusFromRange(taskId, draft.start, draft.end, draft.calendarId, current.now);
      const taskBefore = current.tasks.find((t) => t.id === taskId);
      void taskBefore?.deadline;
      dispatch({ type: 'create_focus', session, via });
      persist(session.id, 'focus_session', null, JSON.stringify(session));
      return 'ok';
    },
    [createTask, persist],
  );

  const confirmFocusAnyway = useCallback(() => {
    const pending = pendingFocus.current;
    if (!pending) return;
    pendingFocus.current = null;
    dispatch({ type: 'track', name: 'conflict_resolution_selected', props: { choice: 'schedule_anyway' } });
    tryCreateFocus({ ...pending.draft, ignoreConflicts: true }, pending.via);
  }, [tryCreateFocus]);

  const retry = useCallback(
    (changeId: string) => {
      const change = stateRef.current.failedChanges.find((c) => c.id === changeId);
      if (!change) return;
      dispatch({ type: 'retry_save', changeId });
      window.setTimeout(() => {
        if (stateRef.current.simulateNextSaveFailure) {
          dispatch({ type: 'set_simulate_failure', value: false });
          dispatch({ type: 'mark_failed', change: { ...change, id: uid('fail'), createdAt: stateRef.current.now } });
          return;
        }
        dispatch({ type: 'mark_saved', objectId: change.objectId, objectKind: change.objectKind });
        dispatch({ type: 'track', name: 'sync_recovered', props: { objectId: change.objectId } });
      }, 420);
    },
    [],
  );

  const discard = useCallback((changeId: string) => {
    dispatch({ type: 'discard_change', changeId });
  }, []);

  const open = useCallback((overlay: Overlay) => {
    dispatch({ type: 'open_overlay', overlay });
  }, []);

  const closeOverlay = useCallback(() => dispatch({ type: 'close_overlay' }), []);
  const select = useCallback((selection: Selection) => dispatch({ type: 'select', selection }), []);
  const track = useCallback((name: AnalyticsEventName, props?: Record<string, string | number | boolean | null>) => {
    dispatch({ type: 'track', name, props });
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (state.toast) dispatch({ type: 'toast', toast: null });
    }, 4200);
    return () => window.clearTimeout(id);
  }, [state.toast]);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      createTask,
      createEvent,
      tryCreateFocus,
      confirmFocusAnyway,
      persist,
      retry,
      discard,
      open,
      closeOverlay,
      select,
      track,
    }),
    [
      state,
      createTask,
      createEvent,
      tryCreateFocus,
      confirmFocusAnyway,
      persist,
      retry,
      discard,
      open,
      closeOverlay,
      select,
      track,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore must be used within AppProvider');
  return ctx;
}
