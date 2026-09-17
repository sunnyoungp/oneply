import type { ReactNode } from 'react';
import { CalendarDays, CheckSquare, ListChecks, Plus } from 'lucide-react';
import { useStore } from '../../state/store';
import { useIsDesktop } from '../../hooks/useMedia';
import { useShortcuts } from '../../hooks/useShortcuts';
import { LeftSidebar } from '../sidebar/LeftSidebar';
import { CalendarPane } from '../calendar/CalendarPane';
import { TaskManager } from '../tasks/TaskManager';
import { DetailsPanel } from '../details/DetailsPanel';
import { OverlayHost } from '../composers/Overlays';
import { Button, cx } from '../ui/primitives';

export function AppShell() {
  useShortcuts();
  const desktop = useIsDesktop();
  const { state, dispatch } = useStore();

  return (
    <div className="flex h-full flex-col bg-paper text-ink">
      <a href="#main" className="skip-link">
        Skip to calendar
      </a>
      {desktop ? <DesktopLayout /> : <MobileLayout />}
      <OverlayHost />
      {state.toast ? (
        <div className="toast-in fixed bottom-20 right-4 z-50 flex items-center gap-2 rounded-xl border border-line bg-ink px-3 py-2 text-[13px] text-white md:bottom-4">
          <span>{state.toast.message}</span>
          {state.toast.actionLabel && state.toast.action ? (
            <button
              type="button"
              className="font-semibold text-accent-soft"
              onClick={() => {
                dispatch(state.toast!.action!);
                dispatch({ type: 'toast', toast: null });
              }}
            >
              {state.toast.actionLabel}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function DesktopLayout() {
  const { state, dispatch } = useStore();
  return (
    <div className="flex min-h-0 flex-1" data-testid="desktop-shell">
      <LeftSidebar />
      <button
        type="button"
        aria-label={state.leftCollapsed ? 'Show calendars' : 'Hide calendars'}
        className="w-1.5 cursor-col-resize bg-transparent hover:bg-line"
        onClick={() => dispatch({ type: 'toggle_left' })}
      />
      <main id="main" className="flex min-w-0 flex-1">
        <CalendarPane />
      </main>
      <button
        type="button"
        aria-label={state.rightCollapsed ? 'Show tasks' : 'Hide tasks'}
        className="w-1.5 cursor-col-resize bg-transparent hover:bg-line"
        onMouseDown={(e) => {
          const startX = e.clientX;
          const startW = state.rightWidth;
          const move = (ev: MouseEvent) => dispatch({ type: 'set_right_width', width: startW - (ev.clientX - startX) });
          const up = () => {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', up);
          };
          window.addEventListener('mousemove', move);
          window.addEventListener('mouseup', up);
        }}
      />
      <aside
        className="border-l border-line"
        style={{ width: state.rightCollapsed ? 0 : state.rightWidth, overflow: 'hidden' }}
        aria-label="Tasks and details"
      >
        <div style={{ width: state.rightWidth }} className="h-full">
          {state.rightMode === 'details' ? <DetailsPanel /> : <TaskManager />}
        </div>
      </aside>
    </div>
  );
}

function MobileLayout() {
  const { state, dispatch, open } = useStore();
  return (
    <div className="flex min-h-0 flex-1 flex-col" data-testid="mobile-shell">
      <header className="flex items-center justify-between border-b border-line px-3 py-2">
        <div>
          <div className="font-display text-[16px] font-semibold">notcal</div>
          <div className="text-[11px] text-ink-muted">Plan & Do</div>
        </div>
        <Button title="Create (N)" onClick={() => open({ type: 'create_chooser', via: 'button' })}>
          <Plus className="h-4 w-4" />
        </Button>
      </header>
      <main id="main" className="min-h-0 flex-1">
        {state.mobileTab === 'tasks' ? (
          state.rightMode === 'details' ? <DetailsPanel /> : <TaskManager />
        ) : (
          <CalendarPane />
        )}
      </main>
      <nav className="grid grid-cols-4 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)]" aria-label="Primary">
        <Tab
          label="Agenda"
          icon={<ListChecks className="h-4 w-4" />}
          active={state.mobileTab === 'agenda'}
          onClick={() => {
            dispatch({ type: 'set_mobile_tab', tab: 'agenda' });
            dispatch({ type: 'set_view', view: 'agenda' });
          }}
        />
        <Tab
          label="Calendar"
          icon={<CalendarDays className="h-4 w-4" />}
          active={state.mobileTab === 'calendar'}
          onClick={() => dispatch({ type: 'set_mobile_tab', tab: 'calendar' })}
        />
        <Tab
          label="Tasks"
          icon={<CheckSquare className="h-4 w-4" />}
          active={state.mobileTab === 'tasks'}
          onClick={() => dispatch({ type: 'set_mobile_tab', tab: 'tasks' })}
        />
        <Tab label="Create" icon={<Plus className="h-4 w-4" />} active={false} onClick={() => open({ type: 'create_chooser', via: 'button' })} />
      </nav>
    </div>
  );
}

function Tab({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx('flex flex-col items-center gap-0.5 py-2 text-[11px]', active ? 'text-accent' : 'text-ink-muted')}
    >
      {icon}
      {label}
    </button>
  );
}
