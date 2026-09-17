import { describe, expect, it } from 'vitest';
import { detectConflicts } from './conflicts';
import { dateKey, fromZoned, zonedParts } from './dates';
import { parseUrl } from './links';
import { parseQuickEntry } from './quick-entry';
import { reducer, sessionsForTask } from './reducer';
import { createSeedState } from './seed';
import { eventFromDraft, focusFromRange, taskFromDraft } from './commands';
import { emptyDoc, textDoc } from './richtext';
import type { AppState, FailedChange, FocusSession, Task } from './types';

const now = '2026-09-17T13:42:00.000Z';

function run(state: AppState, ...actions: Parameters<typeof reducer>[1][]): AppState {
  return actions.reduce(reducer, state);
}

describe('P0 state transitions', () => {
  it('1. creating an unscheduled task does not add a calendar object', () => {
    const state = createSeedState();
    const eventsBefore = state.events.length;
    const sessionsBefore = state.focusSessions.length;
    const task = taskFromDraft(
      { title: 'Buy oat milk', tagIds: [], priority: 'none', description: emptyDoc(), links: [] },
      now,
    );
    const next = reducer(state, { type: 'create_task', task, via: 'shortcut' });
    expect(next.tasks.some((t) => t.id === task.id)).toBe(true);
    expect(next.tasks.find((t) => t.id === task.id)?.deadline).toBeUndefined();
    expect(next.events.length).toBe(eventsBefore);
    expect(next.focusSessions.length).toBe(sessionsBefore);
  });

  it('2. creating an event adds a timed commitment without a completion checkbox field', () => {
    const state = createSeedState();
    const event = eventFromDraft(
      {
        title: 'Dentist',
        start: fromZoned('2026-09-17', 16, 0),
        end: fromZoned('2026-09-17', 16, 45),
        allDay: false,
        calendarId: 'cal-personal',
        attendeesText: '',
        location: 'Park Slope',
        conferencingUrl: '',
        description: textDoc('Bring insurance card. https://maps.example.com/dentist'),
        links: [],
      },
      now,
    );
    const next = reducer(state, { type: 'create_event', event, via: 'shortcut' });
    const saved = next.events.find((e) => e.id === event.id);
    expect(saved?.kind).toBe('event');
    expect(saved?.title).toBe('Dentist');
    expect(saved && 'completed' in saved).toBe(false);
  });

  it('3. scheduling a task creates a focus session and does not change the deadline', () => {
    const state = createSeedState();
    const taskId = 'task-unscheduled-no-deadline';
    const before = state.tasks.find((t) => t.id === taskId)!;
    expect(before.deadline).toBeUndefined();
    const session = focusFromRange(
      taskId,
      fromZoned('2026-09-15', 10, 0),
      fromZoned('2026-09-15', 11, 30),
      'cal-work',
      now,
    );
    const next = reducer(state, { type: 'create_focus', session, via: 'drag' });
    const after = next.tasks.find((t) => t.id === taskId)!;
    expect(after.deadline).toBeUndefined();
    expect(sessionsForTask(next, taskId).some((s) => s.id === session.id)).toBe(true);
    expect(next.tasks.some((t) => t.id === taskId)).toBe(true);
  });

  it('4. empty-range new task creates a task + linked session with an empty deadline', () => {
    const state = createSeedState();
    const task = taskFromDraft(
      {
        title: 'Draft onboarding copy',
        tagIds: [],
        priority: 'none',
        description: emptyDoc(),
        links: [],
      },
      now,
    );
    const next = reducer(state, {
      type: 'create_task',
      task,
      via: 'drag',
      focus: {
        taskId: task.id,
        start: fromZoned('2026-09-17', 15, 0),
        end: fromZoned('2026-09-17', 16, 0),
        blocksAvailability: true,
        calendarId: 'cal-work',
        sessionCompleted: false,
      },
    });
    expect(next.tasks.find((t) => t.id === task.id)?.deadline).toBeUndefined();
    expect(next.focusSessions.some((s) => s.taskId === task.id)).toBe(true);
  });

  it('5. a task can be scheduled without a deadline', () => {
    const state = createSeedState();
    const task = state.tasks.find((t) => t.id === 'task-inbox-capture')!;
    expect(task.deadline).toBeUndefined();
    const session = focusFromRange(
      task.id,
      fromZoned('2026-09-17', 16, 0),
      fromZoned('2026-09-17', 17, 0),
      'cal-work',
      now,
    );
    const next = reducer(state, { type: 'create_focus', session, via: 'accessible' });
    expect(next.tasks.find((t) => t.id === task.id)?.deadline).toBeUndefined();
    expect(next.focusSessions.filter((s) => s.taskId === task.id).length).toBe(1);
  });

  it('6. moving a deadline and moving a session are independent', () => {
    const state = createSeedState();
    const taskId = 'task-faq';
    const session = state.focusSessions.find((s) => s.id === 'focus-faq-thu')!;
    const moved = reducer(state, {
      type: 'move_focus',
      id: session.id,
      start: fromZoned('2026-09-16', 13, 0),
      end: fromZoned('2026-09-16', 14, 30),
    });
    expect(moved.tasks.find((t) => t.id === taskId)?.deadline).toBe('2026-09-19');
    const deadlineMoved = reducer(moved, { type: 'set_deadline', taskId, deadline: '2026-09-18' });
    const still = deadlineMoved.focusSessions.find((s) => s.id === session.id)!;
    expect(still.start).toBe(fromZoned('2026-09-16', 13, 0));
    expect(deadlineMoved.tasks.find((t) => t.id === taskId)?.deadline).toBe('2026-09-18');
  });

  it('7. one task may have multiple focus sessions', () => {
    const state = createSeedState();
    expect(sessionsForTask(state, 'task-faq').length).toBe(2);
    const extra = focusFromRange(
      'task-faq',
      fromZoned('2026-09-14', 9, 0),
      fromZoned('2026-09-14', 10, 0),
      'cal-work',
      now,
    );
    const next = reducer(state, { type: 'create_focus', session: extra, via: 'shortcut' });
    expect(sessionsForTask(next, 'task-faq').length).toBe(3);
    expect(next.tasks.find((t) => t.id === 'task-faq')?.deadline).toBe('2026-09-19');
  });

  it('8. completing keeps past sessions, keep/remove future, and restore works', () => {
    let state = createSeedState();
    const futureBefore = state.focusSessions.filter((s) => s.taskId === 'task-faq' && s.start > state.now);
    expect(futureBefore.length).toBeGreaterThan(0);
    const kept = reducer(state, { type: 'complete_task', id: 'task-faq', futureMode: 'keep' });
    expect(kept.tasks.find((t) => t.id === 'task-faq')?.completed).toBe(true);
    expect(kept.focusSessions.filter((s) => s.taskId === 'task-faq').length).toBe(state.focusSessions.filter((s) => s.taskId === 'task-faq').length);

    const removed = reducer(state, { type: 'complete_task', id: 'task-faq', futureMode: 'remove' });
    const remaining = removed.focusSessions.filter((s) => s.taskId === 'task-faq');
    expect(remaining.every((s) => s.start <= state.now || s.sessionCompleted)).toBe(true);
    expect(removed.toast?.actionLabel).toBe('Undo');

    const restored = reducer(removed, removed.undo!);
    expect(restored.tasks.find((t) => t.id === 'task-faq')?.completed).toBe(false);
    expect(restored.focusSessions.filter((s) => s.taskId === 'task-faq').length).toBe(
      state.focusSessions.filter((s) => s.taskId === 'task-faq').length,
    );

    const again = reducer(restored, { type: 'restore_task', id: 'task-done-interviews' });
    expect(again.tasks.find((t) => t.id === 'task-done-interviews')?.completed).toBe(false);
    expect(again.focusSessions.some((s) => s.taskId === 'task-done-interviews')).toBe(true);
  });

  it('9. failed save stays visible; retry restores saved; discard reverts', () => {
    const state = createSeedState();
    const task = taskFromDraft(
      { title: 'Flaky save', tagIds: [], priority: 'none', description: emptyDoc(), links: [] },
      now,
    );
    let next = reducer(state, { type: 'create_task', task, via: 'button' });
    const previousJson = JSON.stringify(task);
    const pending: Task = { ...task, title: 'Flaky save (edited)', syncState: 'needs_attention' };
    const change: FailedChange = {
      id: 'chg-1',
      objectId: task.id,
      objectKind: 'task',
      action: 'update',
      previousJson,
      pendingJson: JSON.stringify(pending),
      message: 'Network error',
      createdAt: now,
    };
    next = run(
      next,
      { type: 'update_task', id: task.id, patch: { title: 'Flaky save (edited)' } },
      { type: 'mark_failed', change },
    );
    expect(next.tasks.find((t) => t.id === task.id)?.syncState).toBe('needs_attention');
    expect(next.tasks.find((t) => t.id === task.id)?.title).toBe('Flaky save (edited)');
    expect(next.failedChanges.some((c) => c.id === 'chg-1')).toBe(true);

    const retried = run(next, { type: 'retry_save', changeId: 'chg-1' }, { type: 'mark_saved', objectId: task.id, objectKind: 'task' });
    expect(retried.tasks.find((t) => t.id === task.id)?.syncState).toBe('saved');
    expect(retried.failedChanges.some((c) => c.id === 'chg-1')).toBe(false);

    const discarded = reducer(next, { type: 'discard_change', changeId: 'chg-1' });
    expect(discarded.tasks.find((t) => t.id === task.id)?.title).toBe('Flaky save');
    expect(discarded.tasks.find((t) => t.id === task.id)?.syncState).toBe('saved');
  });
});

describe('supporting domain rules', () => {
  it('quick entry parses title, deadline, tag, and priority', () => {
    const parsed = parseQuickEntry('Prepare research summary tomorrow #research !high');
    expect(parsed.title).toBe('Prepare research summary');
    expect(parsed.deadline).toBe('2026-09-18');
    expect(parsed.tags).toContain('research');
    expect(parsed.priority).toBe('high');
  });

  it('rejects unsafe and malformed URLs', () => {
    expect(parseUrl('javascript:alert(1)').ok).toBe(false);
    expect(parseUrl('not a url').ok).toBe(false);
    expect(parseUrl('https://meet.google.com/abc').ok).toBe(true);
  });

  it('detects calendar conflicts without proposing deadline changes', () => {
    const state = createSeedState();
    const conflicts = detectConflicts(
      state,
      fromZoned('2026-09-15', 10, 0),
      fromZoned('2026-09-15', 11, 30),
    );
    expect(conflicts.some((c) => c.title === 'Design critique')).toBe(true);
  });

  it('closing details restores the prior task view snapshot', () => {
    let state = createSeedState();
    state = run(
      state,
      { type: 'set_task_view', view: 'upcoming' },
      { type: 'set_search', search: 'faq' },
      { type: 'set_task_scroll', scroll: 80 },
      { type: 'select', selection: { kind: 'task', id: 'task-faq' } },
    );
    expect(state.rightMode).toBe('details');
    state = reducer(state, { type: 'close_details' });
    expect(state.rightMode).toBe('tasks');
    expect(state.taskView).toBe('upcoming');
    expect(state.search).toBe('faq');
    expect(state.taskScroll).toBe(80);
  });
});

describe('dates', () => {
  it('maps midnight in New York onto the intended calendar date', () => {
    const iso = fromZoned('2026-09-18', 0, 0);
    expect(dateKey(iso)).toBe('2026-09-18');
    expect(zonedParts(iso).hour).toBe(0);
  });
});

describe('focus session type', () => {
  it('never writes deadline when creating or moving sessions', () => {
    const state = createSeedState();
    const session: FocusSession = focusFromRange(
      'task-research-synth',
      fromZoned('2026-09-17', 8, 0),
      fromZoned('2026-09-17', 9, 0),
      'cal-work',
      now,
    );
    const created = reducer(state, { type: 'create_focus', session, via: 'drag' });
    expect(created.tasks.find((t) => t.id === 'task-research-synth')?.deadline).toEqual(
      state.tasks.find((t) => t.id === 'task-research-synth')?.deadline,
    );
  });
});
