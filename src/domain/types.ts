export type SyncState =
  | 'saved'
  | 'saving'
  | 'offline'
  | 'needs_attention'
  | 'conflict_detected';

export type Priority = 'none' | 'low' | 'medium' | 'high';

export type CalendarView = 'day' | 'week' | 'month' | 'agenda';

export type TaskListView =
  | 'inbox'
  | 'today'
  | 'upcoming'
  | 'completed'
  | 'projects'
  | 'tags'
  | 'priorities';

export type MobileTab = 'agenda' | 'calendar' | 'tasks';

export type ObjectKind = 'task' | 'event' | 'focus_session' | 'deadline' | 'database_item';

export type CalendarKind = 'work' | 'personal' | 'shared';

export type Availability = 'busy' | 'free';

export type EventVisibility = 'default' | 'private' | 'public';

export type RichMark = 'bold' | 'italic';

export type RichSpan = {
  text: string;
  marks?: RichMark[];
  href?: string;
};

export type RichBlock =
  | { type: 'p'; spans: RichSpan[] }
  | { type: 'ul'; items: RichSpan[][] }
  | { type: 'ol'; items: RichSpan[][] };

export type RichDoc = {
  blocks: RichBlock[];
};

export type LinkRecord = {
  id: string;
  url: string;
  label: string;
  kind: 'web' | 'meeting' | 'notion';
};

export type Attendee = {
  id: string;
  name: string;
  email: string;
  status: 'accepted' | 'tentative' | 'declined' | 'needs_action';
};

export type ActivityEntry = {
  id: string;
  at: string;
  label: string;
};

export type CalendarSource = {
  id: string;
  name: string;
  kind: CalendarKind;
  color: string;
  visible: boolean;
  account: string;
  health: SyncState;
  timeZone: string;
};

export type NotionSource = {
  id: string;
  name: string;
  visible: boolean;
  color: string;
  isTaskSource: boolean;
  dateProperty: string;
  mapped?: {
    title: string;
    status?: string;
    completedStatus?: string;
    due?: string;
    priority?: string;
    project?: string;
    tags?: string;
  };
  health: SyncState;
};

export type Project = {
  id: string;
  name: string;
  archived: boolean;
  order: number;
  color: string;
};

export type Tag = {
  id: string;
  name: string;
};

export type Task = {
  kind: 'task';
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
  projectId?: string;
  tagIds: string[];
  priority: Priority;
  deadline?: string;
  description: RichDoc;
  links: LinkRecord[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  syncState: SyncState;
  activity: ActivityEntry[];
};

export type CalendarEvent = {
  kind: 'event';
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  calendarId: string;
  attendees: Attendee[];
  organizer?: string;
  location?: string;
  conferencingUrl?: string;
  description: RichDoc;
  links: LinkRecord[];
  recurrence?: string;
  availability: Availability;
  visibility: EventVisibility;
  timeZone: string;
  createdAt: string;
  updatedAt: string;
  syncState: SyncState;
};

export type FocusSession = {
  kind: 'focus_session';
  id: string;
  taskId: string;
  start: string;
  end: string;
  note?: string;
  blocksAvailability: boolean;
  calendarId: string;
  sessionCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  syncState: SyncState;
};

export type DatabaseItem = {
  kind: 'database_item';
  id: string;
  title: string;
  databaseId: string;
  start: string;
  end?: string;
  allDay: boolean;
  properties: Record<string, string>;
  url?: string;
  createdAt: string;
  updatedAt: string;
  syncState: SyncState;
};

export type CalendarObject =
  | Task
  | CalendarEvent
  | FocusSession
  | DatabaseItem;

export type Selection =
  | { kind: 'task'; id: string }
  | { kind: 'event'; id: string }
  | { kind: 'focus_session'; id: string }
  | { kind: 'deadline'; taskId: string }
  | { kind: 'database_item'; id: string };

export type TaskFilters = {
  projectId?: string;
  tagId?: string;
  priority?: Priority;
  showCompleted: boolean;
};

export type RightPanelSnapshot = {
  taskView: TaskListView;
  filters: TaskFilters;
  search: string;
  scroll: number;
};

export type Overlay =
  | { type: 'create_chooser'; via: CreationMethod }
  | { type: 'task_composer'; draft: TaskDraft; via: CreationMethod }
  | { type: 'event_composer'; draft: EventDraft; via: CreationMethod }
  | { type: 'range_chooser'; start: string; end: string }
  | { type: 'focus_picker'; start: string; end: string }
  | { type: 'schedule_task'; taskId: string }
  | {
      type: 'conflict';
      draft: FocusDraft;
      conflicts: ConflictInfo[];
      suggestions: { start: string; end: string; label: string }[];
    }
  | { type: 'complete_task'; taskId: string; futureSessionIds: string[] }
  | { type: 'command' }
  | { type: 'shortcuts' }
  | { type: 'recovery'; objectId: string; objectKind: ObjectKind };

export type CreationMethod = 'button' | 'shortcut' | 'drag' | 'command' | 'quick_entry' | 'accessible';

export type TaskDraft = {
  title: string;
  projectId?: string;
  tagIds: string[];
  priority: Priority;
  deadline?: string;
  description: RichDoc;
  links: LinkRecord[];
  withFocus?: { start: string; end: string };
};

export type EventDraft = {
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  calendarId: string;
  attendeesText: string;
  location: string;
  conferencingUrl: string;
  description: RichDoc;
  links: LinkRecord[];
};

export type FocusDraft = {
  taskId?: string;
  newTaskTitle?: string;
  start: string;
  end: string;
  calendarId: string;
  ignoreConflicts?: boolean;
};

export type ConflictInfo = {
  kind: 'event' | 'focus_session';
  id: string;
  title: string;
  calendarName: string;
  start: string;
  end: string;
};

export type FailedChange = {
  id: string;
  objectId: string;
  objectKind: ObjectKind;
  action: 'create' | 'update' | 'delete';
  previousJson: string | null;
  pendingJson: string;
  message: string;
  createdAt: string;
};

export type AnalyticsEventName =
  | 'create_menu_opened'
  | 'task_create_started'
  | 'task_created'
  | 'event_create_started'
  | 'event_created'
  | 'creation_method_used'
  | 'task_drag_started'
  | 'focus_session_created'
  | 'focus_session_rescheduled'
  | 'task_deadline_added'
  | 'task_deadline_changed'
  | 'task_completed'
  | 'future_sessions_resolution_selected'
  | 'calendar_conflict_detected'
  | 'conflict_resolution_selected'
  | 'description_edited'
  | 'link_added'
  | 'link_opened'
  | 'sync_failed'
  | 'sync_retry_started'
  | 'sync_recovered'
  | 'view_changed'
  | 'task_filter_applied';

export type AnalyticsEvent = {
  name: AnalyticsEventName;
  at: string;
  props?: Record<string, string | number | boolean | null>;
};

export type Toast = {
  id: string;
  message: string;
  actionLabel?: string;
  action?: AppAction;
};

export type AccountHealth = {
  label: string;
  state: SyncState;
  detail: string;
};

export type AppState = {
  now: string;
  timeZone: string;
  view: CalendarView;
  focusedDate: string;
  mobileTab: MobileTab;
  calendars: CalendarSource[];
  notionSources: NotionSource[];
  projects: Project[];
  tags: Tag[];
  tasks: Task[];
  events: CalendarEvent[];
  focusSessions: FocusSession[];
  databaseItems: DatabaseItem[];
  selected: Selection | null;
  rightMode: 'tasks' | 'details';
  taskView: TaskListView;
  filters: TaskFilters;
  search: string;
  taskScroll: number;
  detailsReturn: RightPanelSnapshot | null;
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  leftWidth: number;
  rightWidth: number;
  overlay: Overlay | null;
  toast: Toast | null;
  analytics: AnalyticsEvent[];
  failedChanges: FailedChange[];
  simulateNextSaveFailure: boolean;
  accountHealth: AccountHealth;
  undo: AppAction | null;
};

export type AppAction =
  | { type: 'set_now'; now: string }
  | { type: 'set_view'; view: CalendarView }
  | { type: 'set_focused_date'; date: string }
  | { type: 'shift_range'; direction: -1 | 1 }
  | { type: 'go_today' }
  | { type: 'set_mobile_tab'; tab: MobileTab }
  | { type: 'toggle_calendar'; id: string }
  | { type: 'toggle_notion_source'; id: string }
  | { type: 'set_task_view'; view: TaskListView }
  | { type: 'set_filters'; filters: Partial<TaskFilters> }
  | { type: 'set_search'; search: string }
  | { type: 'set_task_scroll'; scroll: number }
  | { type: 'select'; selection: Selection }
  | { type: 'close_details' }
  | { type: 'toggle_left' }
  | { type: 'toggle_right' }
  | { type: 'set_left_width'; width: number }
  | { type: 'set_right_width'; width: number }
  | { type: 'open_overlay'; overlay: Overlay }
  | { type: 'close_overlay' }
  | { type: 'create_task'; task: Task; via: CreationMethod; focus?: Omit<FocusSession, 'kind' | 'id' | 'createdAt' | 'updatedAt' | 'syncState'> }
  | { type: 'update_task'; id: string; patch: Partial<Omit<Task, 'kind' | 'id'>> }
  | { type: 'complete_task'; id: string; futureMode: 'keep' | 'remove' }
  | { type: 'restore_task'; id: string }
  | { type: 'delete_task'; id: string }
  | { type: 'set_deadline'; taskId: string; deadline?: string }
  | { type: 'create_event'; event: CalendarEvent; via: CreationMethod }
  | { type: 'update_event'; id: string; patch: Partial<Omit<CalendarEvent, 'kind' | 'id'>> }
  | { type: 'delete_event'; id: string }
  | { type: 'create_focus'; session: FocusSession; via: CreationMethod }
  | { type: 'move_focus'; id: string; start: string; end: string }
  | { type: 'update_focus'; id: string; patch: Partial<Omit<FocusSession, 'kind' | 'id' | 'taskId'>> }
  | { type: 'complete_focus'; id: string }
  | { type: 'delete_focus'; id: string }
  | { type: 'create_project'; project: Project }
  | { type: 'rename_project'; id: string; name: string }
  | { type: 'reorder_projects'; ids: string[] }
  | { type: 'archive_project'; id: string }
  | { type: 'create_tag'; tag: Tag }
  | { type: 'mark_saving'; objectId: string; objectKind: ObjectKind }
  | { type: 'mark_saved'; objectId: string; objectKind: ObjectKind }
  | {
      type: 'mark_failed';
      change: FailedChange;
    }
  | { type: 'retry_save'; changeId: string }
  | { type: 'discard_change'; changeId: string }
  | { type: 'set_simulate_failure'; value: boolean }
  | { type: 'track'; name: AnalyticsEventName; props?: AnalyticsEvent['props'] }
  | { type: 'toast'; toast: Toast | null }
  | { type: 'undo_complete'; taskId: string; removedSessions: FocusSession[]; previousCompletedAt?: string };
