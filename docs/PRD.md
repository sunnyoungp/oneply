# Notion Calendar Redesign PRD: Calendar + Tasks

**Status:** Draft v0.2  
**Working title:** Notion Calendar — Plan & Do  
**Product area:** Notion Calendar  
**Primary platforms:** Desktop and web, with responsive mobile support  
**Last updated:** September 16, 2026

## 1. Executive summary

Redesign Notion Calendar as a seamless planning workspace that places a lightweight, first-class task manager beside the calendar.

The product should help users manage two fundamentally different kinds of commitments:

- **Events:** Meetings, appointments, classes, and other activities that happen at a specific time.
- **Tasks:** Work that must be completed, optionally before a deadline.

Users can create either type through a global add button, keyboard shortcuts, or direct manipulation. Tasks live in a dedicated panel with projects, tags, priorities, descriptions, links, and optional deadlines. Dragging a task onto the calendar creates a visually distinct focus session without changing or requiring its deadline.

The central product promise is:

> Capture what you need to do, see what is already occupying your time, and turn tasks into a realistic plan without confusing deadlines with scheduled work.

The interface must feel minimal, calm, and intuitive without hiding important distinctions or actions.

## 2. Problem statement

Notion Calendar can display calendar events and dated Notion database items together, but tasks often appear and behave too much like calendar events.

Users encounter several related problems:

1. A task's deadline and the time reserved to work on it are often represented by the same date field.
2. Tasks and events appear as similarly shaped calendar blocks even though they have different meanings.
3. Capturing a simple task may require understanding or configuring a Notion database.
4. There is no persistent task-management surface for organizing unscheduled work by project, tag, priority, or deadline.
5. Users may need to create duplicate calendar events merely to reserve time for an existing task.
6. Creation paths favor calendar events and do not consistently ask what kind of object the user intends to create.
7. Minimal interfaces can become ambiguous when labels, object types, source information, and system state are hidden.

The result is a calendar that can display work but does not fully help users decide what to work on or when to work on it.

## 3. Core unmet need

Users need one workspace where they can manage tasks and calendar commitments side by side, then schedule time for a task without changing its meaning, deadline, or source information.

The product must answer these questions clearly:

1. Is this a task, event, deadline, or focus session?
2. When is it due?
3. When will I work on it?
4. Where is it stored?
5. Has it been saved successfully?

## 4. Product hypothesis

If Notion Calendar adds a dedicated task manager and clearly separates tasks, deadlines, focus sessions, and events, users will be able to create and execute realistic plans with less duplication, less configuration, and greater confidence.

## 5. Target users

### Primary user

A knowledge worker who:

- Uses calendars for meetings and appointments.
- Maintains a personal or professional task list.
- Plans work daily or weekly.
- Needs projects, tags, priorities, and deadlines.
- Uses desktop for planning and mobile for checking or adjusting.
- Wants a simpler execution interface than a general-purpose database.

### Secondary users

- Students coordinating classes, assignments, exams, and study time.
- Freelancers coordinating client meetings and project deliverables.
- Creators managing publishing calendars and production tasks.
- Founders and managers balancing meetings with individual work.

### Not initially optimized for

- Full enterprise project and portfolio management.
- Resource and room booking.
- Complex team workload planning.
- Habit tracking and Pomodoro analytics.
- Fully automatic AI scheduling.

## 6. Jobs to be done

### Primary job

When I plan my day or week, I want to see my tasks beside my calendar and reserve time for important work so that I can make a realistic plan without changing task deadlines or duplicating information.

### Supporting jobs

- When I remember something, I want to capture it as a task in seconds.
- When I make a commitment, I want to create an event with the correct time and calendar.
- When I create something, I want the interface to make the task-versus-event distinction obvious.
- When I have free time, I want to choose an existing task or create a new task to focus on.
- When I schedule a task, I want its deadline to remain unchanged.
- When a task requires several work periods, I want to schedule multiple focus sessions.
- When I need context, I want descriptions and links available on both tasks and events.
- When I finish work, I want to complete the task without losing the history of when I worked on it.
- When something fails to save, I want to know and recover the change.

## 7. Product principles

### Minimal, not ambiguous

Reduce visual noise while keeping object type, source, timing, and state visible.

### Preserve meaning

Tasks, events, deadlines, and focus sessions must remain distinct in both behavior and appearance.

### Separate due from doing

A deadline describes when a task is due. A focus session describes when the user plans to work on it.

### Fast by default

Common actions should be available through visible controls, keyboard shortcuts, and direct manipulation.

### Keep context close

Descriptions, links, project information, tags, and related Notion content should be accessible without navigating through several screens.

### Design for trust

Saving, sync, errors, conflicts, and destructive actions must be visible and recoverable.

### Progressive disclosure

Show the minimum necessary information first, then reveal advanced fields when requested.

## 8. Information architecture

### Desktop structure

The default desktop layout uses three coordinated regions:

1. **Left — Calendars and date sources**
2. **Center — Calendar timeline**
3. **Right — Task manager and item details**

```text
┌──────────────────┬──────────────────────────────┬──────────────────────┐
│ Calendars        │ Calendar timeline            │ Tasks / Details      │
│                  │                              │                      │
│ Work             │ Events                       │ Inbox                │
│ Personal         │ Meetings                     │ Today                │
│ Team             │ Focus sessions               │ Upcoming             │
│                  │ Deadline markers              │ Projects             │
│ Notion sources   │                              │ Tags                 │
│ Launch calendar  │                              │ Quick add            │
│ Content calendar │                              │                      │
└──────────────────┴──────────────────────────────┴──────────────────────┘
```

### Left sidebar: calendars and date sources

The left sidebar contains:

- Mini date navigator.
- Connected work, personal, and shared calendars.
- Visibility controls.
- Calendar source colors.
- Notion databases with date properties.
- Account and sync health.
- Time-zone controls.

Notion databases are treated as date sources unless configured as task sources. A content calendar, launch roadmap, CRM, or travel plan should not automatically become a checklist.

### Center: calendar timeline

The central surface contains:

- Day, week, month, and agenda views.
- Timed events.
- Meetings.
- Focus sessions.
- All-day events.
- Deadline markers.
- Dated Notion database items.
- Current-time indicator.
- Conflict indicators.

### Right panel: task manager and details

The right panel has two primary modes:

#### Tasks mode

- Inbox
- Today
- Upcoming
- Completed
- Projects
- Tags
- Priorities
- Search and filters
- Quick task entry

#### Details mode

Selecting a task, event, focus session, deadline, or database item opens its details in the same panel. Closing Details returns the user to the prior task view and preserves filters and scroll position.

The panel should be collapsible and resizable on desktop.

## 9. Core object model

### 9.1 Task

A task represents work that can be completed.

A task supports:

- Title
- Completion state
- Project
- Multiple tags
- Priority
- Optional deadline
- Description
- Multiple links
- Rich hyperlinks inside the description
- Notes or supporting context
- Creation and update timestamps
- Zero or more linked focus sessions
- Sync state

A task does not require a deadline or scheduled focus session.

### 9.2 Event

An event represents a scheduled calendar commitment.

An event supports:

- Title
- Start and end time
- Calendar source
- Attendees
- Organizer
- Location
- Conferencing link
- Description
- Multiple links
- Rich hyperlinks inside the description
- Recurrence
- Availability behavior
- Visibility
- Time zone
- Sync state

Events do not have completion checkboxes.

### 9.3 Focus session

A focus session represents time reserved to work on a task.

A focus session supports:

- Start and end time
- Linked task
- Optional note
- Availability-blocking behavior
- Calendar destination when external blocking is enabled
- Completion state for the session
- Sync state

Creating or moving a focus session must not create or modify the linked task's deadline.

A task may have multiple focus sessions.

Completing a focus session does not automatically complete the task.

### 9.4 Deadline

A deadline is an optional property of a task.

A deadline:

- Appears in a compact deadline rail or all-day area.
- Does not have duration.
- Does not block availability.
- Does not invite attendees.
- Can exist without a focus session.
- Can be changed independently from every focus session.

### 9.5 Dated Notion database item

A database item is a page from a connected Notion database with at least one date property.

It may represent a launch, content post, milestone, trip, class, or another dated record. It should not be treated as a task unless its database is explicitly configured as a task source.

## 10. Task manager requirements

### Task capture

Users can create a task with only a title. Every other field is optional.

Quick entry should support natural shorthand where feasible:

```text
Prepare research summary tomorrow #research !high
```

The interface must display its interpretation before saving:

- Title: Prepare research summary
- Deadline: Tomorrow
- Tag: Research
- Priority: High

### Organization

Users can:

- Create, rename, reorder, and archive projects.
- Create and reuse tags.
- Assign multiple tags to a task.
- Set no priority, low, medium, or high priority.
- Filter by project, tag, priority, completion state, or deadline.
- Search task titles and descriptions.
- Move tasks between projects.
- Complete and restore tasks.

### Task details

The task detail view includes:

- Completion checkbox
- Title
- Project
- Tags
- Priority
- Optional deadline
- Description
- Links
- Scheduled focus sessions
- Activity history
- Duplicate and delete actions

URLs pasted into the links field or description must become clickable hyperlinks. Link labels should be editable. Links must open safely in a new browser tab or the appropriate application.

## 11. Universal creation system

The same object model must be available through three creation methods.

### 11.1 Global add button

A persistent `+` button opens a small chooser:

```text
Create

☐ Task
  Something you need to complete

▣ Event
  A scheduled calendar commitment
```

Choosing Task opens a task composer. Choosing Event opens an event composer.

The distinction must be understandable from the label, icon, and supporting description.

### 11.2 Keyboard shortcuts

Default shortcuts:

- `N` — Open the Task/Event chooser
- `T` — Create a task
- `E` — Create an event
- `F` — Schedule focus time for an existing task
- `Cmd/Ctrl + K` — Open the command menu

Shortcuts must not trigger while the user is typing in an input or rich-text field.

The interface must make shortcuts discoverable through tooltips, menus, and the command palette.

### 11.3 Dragging on the calendar

Dragging across an empty time range opens:

```text
Tuesday · 10:00–11:30

◉ Focus on a task
  Select an existing task or create a new one

▣ Create an event
  Add a meeting or calendar commitment
```

Choosing Focus on a task allows the user to:

- Select an existing task.
- Search tasks.
- Create a new task.
- Schedule the focus session without adding a deadline.
- Optionally add or change the task's deadline separately.

Choosing Create an event opens the event composer with the dragged time range prefilled.

### 11.4 Dragging a task onto the calendar

Dragging a task from the right panel onto the calendar:

1. Creates a linked focus session.
2. Keeps the task in the task manager.
3. Does not require a deadline.
4. Does not change an existing deadline.
5. Shows the scheduled session on the task.
6. Supports multiple sessions for the same task.

The interaction copies the task into time; it does not move the task out of the task manager.

An accessible Schedule action must provide the same functionality without drag and drop.

## 12. Visual distinction between object types

Users must be able to distinguish item types without opening them and without relying only on color.

### Task in the right panel

- Checkbox
- Task title
- Project
- Tags
- Priority indicator
- Optional deadline
- Scheduled-session count

### Focus session on the calendar

- Focus icon
- Prefix or label such as `Focus`
- Linked task title
- Optional project name
- Soft tinted background
- Accent border or subtle patterned treatment
- No attendee avatars
- Optional session-completion control

Example:

```text
◉ FOCUS
Write research synthesis
Calendar Redesign · 90m
```

### Event on the calendar

- Solid calendar-source color treatment
- Event title
- Time
- Attendee, location, or conferencing indicator when applicable
- Calendar source
- No checkbox
- No completion state

### Deadline

- Flag or diamond icon
- Compact placement in the deadline or all-day rail
- Task title and `due` label
- No duration
- No availability-blocking treatment

### Dated database item

- Database or page icon
- Database-source label or tooltip
- Styling distinct from tasks and events
- No completion affordance unless the source is configured as a task database

## 13. Descriptions, links, and hyperlinks

Tasks and events both support contextual information.

### Description behavior

- Plain text is supported by default.
- Basic rich text is supported: paragraphs, lists, emphasis, and hyperlinks.
- Long descriptions collapse with a clear `Show more` control.
- Description editing uses a lightweight inline editor.
- Pasted URLs are automatically recognized.

### Link behavior

- Users may attach multiple links.
- Each link can have an editable label.
- Recognized meeting links receive an appropriate icon.
- Web URLs open in a new tab.
- Notion links may open in Notion.
- Unsafe or malformed URLs are rejected with a clear message.
- Link previews are optional and should not add visual noise by default.

Descriptions and links must remain available from both the task manager and calendar details mode.

## 14. Completion behavior

When a task is completed:

- Its checkbox updates throughout the interface.
- It leaves active task views unless completed items are shown.
- Past focus sessions remain visible as work history.
- The active focus session may be marked completed.
- Future focus sessions prompt the user to remove or keep them.
- An Undo action appears temporarily.

Completing a focus session alone does not complete the task. The user may need more than one session.

Events cannot be completed.

## 15. Conflict behavior

When a focus session is placed over an existing commitment:

- Show the conflict visually before final confirmation.
- Identify the conflicting event and calendar.
- Offer nearby available times.
- Allow the user to schedule anyway.
- Never change the task's deadline as part of conflict resolution.

## 16. Saving, sync, and recovery

Every created or edited object has one of these states:

- Saved
- Saving
- Offline
- Needs attention
- Conflict detected

Failed changes remain visible. Users can:

- Retry.
- Discard.
- Copy unsaved content.
- Open the source when applicable.

The product must never silently remove a task, event, description, link, or focus session after a failed save.

## 17. Notion database behavior

Connected Notion databases with date properties appear as date sources in the left sidebar.

They may be shown on the calendar without appearing in the task manager.

Users may explicitly configure a compatible database as a task source by mapping:

- Title property
- Status property
- Completed status
- Due-date property
- Priority property
- Project or category property
- Tags property

The default task experience should not require this configuration. New users may create a dedicated Personal Tasks database through onboarding.

## 18. Recommended task storage

The default task manager should use a dedicated Notion-backed Personal Tasks database created or selected during onboarding.

Calendar presents a purpose-built task interface while Notion remains the underlying source of truth.

Benefits:

- Tasks remain accessible in Notion.
- Calendar does not create another isolated data silo.
- Advanced users can customize or replace the database.
- The Calendar interface can remain simpler than a general-purpose database interface.

The technical implementation may use local prototype data, but the product concept should communicate this Notion-backed model.

## 19. Mobile experience

Mobile should not be a compressed desktop grid.

Primary navigation:

- Agenda
- Calendar
- Tasks
- Create

Mobile supports:

- Quick task creation.
- Quick event creation.
- Task/Event chooser.
- Task completion.
- Project and tag filtering.
- Day, week, and month overview.
- Focus-session scheduling and rescheduling.
- Event and task descriptions.
- Clickable links.
- Joining a meeting.
- Viewing deadlines separately from focus sessions.
- Recovering failed changes.

## 20. Design direction

The interface should feel seamless, intuitive, calm, and precise.

### Required qualities

- Minimal without hiding essential information.
- Dense enough for serious calendar use.
- Clear object hierarchy.
- Consistent interaction patterns.
- Fast transitions and immediate feedback.
- Accessible contrast and focus states.
- Comfortable on both large and small screens.

### Avoid

- Excessive gradients or glass effects.
- Large decorative dashboard cards.
- Oversized headings that reduce usable space.
- Icon-only actions without tooltips.
- Hidden object-type distinctions.
- Using color as the only differentiator.
- Multiple competing creation patterns with different behavior.
- Modal overload.

### Progressive detail

Calendar blocks show only essential information. Full descriptions, links, metadata, source information, and activity appear in Details mode.

## 21. MVP requirements

### P0: Required

1. Three-pane desktop layout.
2. Calendar and date sources in the left sidebar.
3. Functional day, week, month, and agenda views.
4. Task manager in the right panel.
5. Inbox, Today, Upcoming, Completed, Projects, and Tags.
6. Task creation with project, tags, priority, optional deadline, description, and links.
7. Event creation with time, calendar, attendees, location, description, and links.
8. Global Task/Event add button.
9. Keyboard shortcuts for task, event, focus, chooser, and command menu.
10. Dragging an empty time range to choose Focus or Event.
11. Dragging a task to create a linked focus session.
12. Focus sessions that do not require or modify a deadline.
13. Multiple focus sessions for one task.
14. Clear visual distinction between task, event, focus session, deadline, and database item.
15. Task completion and restoration.
16. Safe hyperlink behavior.
17. Conflict detection and resolution.
18. Visible save and sync states.
19. Recoverable failed changes.
20. Responsive mobile task and calendar experiences.
21. Accessible alternatives to drag and keyboard-only interactions.

### P1: Follow-up

- Recurring tasks.
- Subtasks.
- Task reminders.
- Saved smart filters.
- Batch scheduling.
- Suggested available focus times.
- Preparation and travel blocks.
- Rich link previews.
- Shared task lists.
- Task comments.

### P2: Future exploration

- AI-assisted weekly planning.
- Automatic rescheduling.
- Workload and capacity recommendations.
- Team planning.
- Natural-language schedule editing.
- Focus analytics.

## 22. Non-goals

The MVP will not include:

- TickTick integration.
- Todoist or other third-party task integrations.
- Full project portfolio management.
- Habit tracking.
- Pomodoro statistics.
- Enterprise room or resource booking.
- Fully automatic scheduling.
- Production calendar-provider authentication in the prototype.
- Real notification delivery in the prototype.

## 23. Key flows

### Flow A: Capture an unscheduled task

1. User presses `T` or chooses `+` → Task.
2. User enters a title.
3. User optionally adds project, tags, priority, description, links, or deadline.
4. User saves.
5. Task appears in Inbox or the selected project.
6. No calendar item is created.

### Flow B: Schedule an existing task

1. User drags a task from the right panel.
2. User drops it on Tuesday from 10:00–11:30.
3. Calendar checks conflicts.
4. User confirms or selects another time.
5. Focus session appears on the calendar.
6. Task remains in the right panel.
7. Task deadline remains unchanged.

### Flow C: Create a task from calendar time

1. User drags across an empty time range.
2. User selects Focus on a task.
3. User selects Create new task.
4. User enters a title and optional metadata.
5. System creates the task and linked focus session.
6. Deadline remains empty unless explicitly added.

### Flow D: Create an event

1. User presses `E`, chooses `+` → Event, or drags a time range and selects Event.
2. Time is prefilled when created through the grid.
3. User adds calendar, attendees, description, location, and links.
4. Event appears using event styling.

### Flow E: Complete a task

1. User checks the task from the task panel or Details mode.
2. Task completion updates everywhere.
3. Past focus sessions remain.
4. Future sessions trigger a keep-or-remove choice.
5. Undo is available.

### Flow F: Recover a failed save

1. A change fails.
2. The item remains visible with Needs attention state.
3. User opens recovery details.
4. User retries or discards the change.
5. Successful retry restores the Saved state.

## 24. Success metrics

### North-star behavior

**Weekly plan-and-do completion:** The percentage of activated users who create or organize a task, schedule at least one linked focus session, and subsequently update or complete the task.

### Activation

Within the first seven days, a user:

1. Connects or displays a calendar.
2. Creates a task.
3. Creates an event or views an existing event.
4. Schedules a task as a focus session.

### Product metrics

- Task creation rate.
- Event creation rate.
- Percentage of tasks created without deadlines.
- Percentage of tasks scheduled into focus sessions.
- Average focus sessions per scheduled task.
- Task completion from Calendar.
- Usage by creation method: button, shortcut, or drag.
- Time required to create a task or event.
- Four-week retention among activated users.

### Comprehension metrics

- Percentage of users who correctly identify a task, event, focus session, and deadline in usability testing.
- Percentage who correctly predict what moving each object will change.
- Rate of accidental deadline changes.
- Rate of accidental event creation when the user intended a task.

### Trust metrics

- Save success rate.
- Sync latency.
- Missing or duplicate item rate.
- Failed-change recovery rate.
- Accidental invitation rate.
- Double-booking rate.

Numerical targets should be set after baseline measurement.

## 25. Analytics events

- `create_menu_opened`
- `task_create_started`
- `task_created`
- `event_create_started`
- `event_created`
- `creation_method_used`
- `task_drag_started`
- `focus_session_created`
- `focus_session_rescheduled`
- `task_deadline_added`
- `task_deadline_changed`
- `task_completed`
- `future_sessions_resolution_selected`
- `calendar_conflict_detected`
- `conflict_resolution_selected`
- `description_edited`
- `link_added`
- `link_opened`
- `sync_failed`
- `sync_retry_started`
- `sync_recovered`
- `view_changed`
- `task_filter_applied`

## 26. Validation plan

Test the prototype with Notion Calendar users, general calendar users, and people who currently use separate calendar and task applications.

Core usability tasks:

1. Create an unscheduled task with no deadline.
2. Add a description and labeled hyperlink.
3. Create an event with a description and meeting link.
4. Schedule the task through drag and drop.
5. Verify that the task still has no deadline.
6. Add a Friday deadline.
7. Move the focus session to Wednesday.
8. Verify that the Friday deadline did not change.
9. Distinguish the focus session from a meeting.
10. Schedule a second focus session for the same task.
11. Complete the task and decide what happens to future sessions.
12. Recover a simulated save failure.

Key research question:

> Can users correctly create a task, event, deadline, and focus session—and predict what will happen when each one is moved?

## 27. Risks and mitigations

### Risk: The task manager competes with Notion databases

**Mitigation:** Use a Notion-backed task database while presenting a simplified execution interface.

### Risk: The right panel becomes crowded

**Mitigation:** Use clear modes, progressive disclosure, resizable width, and preserved navigation state.

### Risk: Users confuse focus sessions with duplicated tasks

**Mitigation:** Use explicit Focus labels, linked-task language, distinct styling, and a session list on the task.

### Risk: Creation options slow users down

**Mitigation:** Provide direct shortcuts and remember the last relevant destination while keeping object type explicit.

### Risk: Minimal design hides functionality

**Mitigation:** Use visible labels for primary actions, contextual guidance, tooltips, and progressive onboarding.

### Risk: Rich descriptions and links add visual noise

**Mitigation:** Keep details collapsed on the calendar and available in the right-side Details mode.

## 28. Acceptance criteria

The redesign is successful when a user can:

1. Immediately distinguish a task, event, deadline, focus session, and database item.
2. Create a task from the add button, keyboard, and calendar drag flow.
3. Create an event from the add button, keyboard, and calendar drag flow.
4. Create a task with only a title.
5. Add projects, tags, priorities, descriptions, and hyperlinks to a task.
6. Add descriptions and hyperlinks to an event.
7. Drag a task into time without adding or modifying its deadline.
8. Schedule multiple focus sessions for one task.
9. Complete a task without removing its historical work sessions.
10. Understand where an item is stored and whether it saved successfully.
11. Recover a simulated failed change.
12. Complete core workflows using a keyboard or accessible non-drag alternative.
13. Use the essential task and calendar workflows at a mobile viewport.

## 29. Product decision

The redesign will make Notion Calendar a combined calendar and task-planning workspace.

Calendars remain the source of scheduled commitments. A dedicated task manager provides a simple execution layer. Dragging tasks into the calendar creates distinct focus sessions. Deadlines remain optional task properties and never become calendar events automatically.

The defining relationship is:

```text
Task
├── Optional deadline
├── Project, tags, priority, description, and links
└── Zero or more focus sessions

Event
└── Scheduled calendar commitment with description and links
```

Notion stores what the work is. Calendar shows what already occupies time and when the user intends to work.
