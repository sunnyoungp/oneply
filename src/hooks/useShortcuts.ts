import { useEffect } from 'react';
import { addMinutes, emptyEventDraft, emptyTaskDraft, fromZoned } from '../domain';
import { isTypingTarget } from './useMedia';
import { useStore } from '../state/store';

export function useShortcuts(): void {
  const { state, dispatch, open } = useStore();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === 'k') {
        if (isTypingTarget(e.target) && !(e.target as HTMLElement).closest?.('[data-command-root]')) {
          return;
        }
        e.preventDefault();
        open({ type: 'command' });
        return;
      }
      if (e.key === 'Escape') {
        if (state.overlay) {
          dispatch({ type: 'close_overlay' });
          return;
        }
        if (state.rightMode === 'details') {
          dispatch({ type: 'close_details' });
        }
        return;
      }
      if (isTypingTarget(e.target)) return;
      if (meta || e.altKey) return;
      const overlayType = state.overlay?.type;
      const creating =
        overlayType === 'task_composer' ||
        overlayType === 'event_composer' ||
        overlayType === 'focus_picker' ||
        overlayType === 'schedule_task';
      const key = e.key.toLowerCase();
      if (creating && ['n', 't', 'e', 'f'].includes(key)) return;
      if (key === 'n') {
        e.preventDefault();
        open({ type: 'create_chooser', via: 'shortcut' });
      } else if (key === 't') {
        e.preventDefault();
        open({ type: 'task_composer', draft: emptyTaskDraft(), via: 'shortcut' });
      } else if (key === 'e') {
        e.preventDefault();
        const start = fromZoned(state.focusedDate, 10, 0);
        open({
          type: 'event_composer',
          draft: emptyEventDraft(state.calendars[0].id, start, addMinutes(start, 60)),
          via: 'shortcut',
        });
      } else if (key === 'f') {
        e.preventDefault();
        const selectedTaskId =
          state.selected?.kind === 'task'
            ? state.selected.id
            : state.tasks.find((t) => !t.completed)?.id;
        if (selectedTaskId) open({ type: 'schedule_task', taskId: selectedTaskId });
      } else if (key === '?') {
        e.preventDefault();
        open({ type: 'shortcuts' });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dispatch, open, state.calendars, state.focusedDate, state.overlay, state.rightMode, state.selected, state.tasks]);
}
