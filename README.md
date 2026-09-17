# notcal

Interactive prototype of **Notion Calendar — Plan & Do**: a calendar with a first-class task manager. Product definition lives in [`docs/PRD.md`](docs/PRD.md). This README covers the prototype only.

Prototype clock is **Thursday 17 September 2026, 9:42 AM** (`America/New_York`). Data is local seed state. There is no production backend and no Google / Microsoft / Apple / Notion login.

## Setup

```bash
npm install
npm run dev
```

App: [http://localhost:3000](http://localhost:3000)

```bash
npm test         # domain state-transition tests
npm run typecheck
npm run lint     # same as typecheck
npm run build
```

Stack: Vite, React 19, TypeScript, Tailwind v4, Lucide.

## Implemented (P0)

- Three-pane desktop: calendars + date sources | day/week/month/agenda | tasks or details
- Mobile tabs: Agenda, Calendar, Tasks, Create
- Object model: **task**, optional **deadline**, **focus session**, **event**, dated **Notion database item**
- Drag a task onto the calendar → linked focus session (deadline unchanged; task stays in the manager)
- Empty-range drag → Focus on a task vs Create an event; new tasks can be scheduled with no deadline
- Accessible **Schedule** action (and `F`) without drag
- Multiple focus sessions per task
- Conflict detection with nearby times or schedule-anyway (never edits the deadline)
- Complete / restore; keep or remove future sessions; undo
- Visible save states; simulated failure; retry / discard / copy unsaved
- Descriptions (basic rich text), multiple labeled links, auto URL recognition, unsafe URL rejection
- Quick entry shorthand (`tomorrow #research !high`) with a preview
- Inbox, Today, Upcoming, Completed, Projects, Tags, Priorities, search/filters
- Details in the same right panel; Back restores the prior list, filters, and scroll
- Local analytics event log (in memory, no third party)

## Shortcuts

Disabled while the cursor is in an input, textarea, or rich-text field.

| Key | Action |
|---|---|
| `N` | Task vs event chooser |
| `T` | New task |
| `E` | New event |
| `F` | Schedule focus for the selected (or first open) task |
| `⌘` / `Ctrl` + `K` | Command menu |
| `?` | Shortcut list |
| `Esc` | Close overlay or details |

Hints also appear on the New button, command menu, and Schedule control.

## Prototype limitations

- In-memory only; refresh resets to seed data
- Notion-backed Personal Tasks is communicated in the UI, not synced
- No real calendar-provider auth or notifications
- Recurrence, subtasks, reminders, smart filters, batch scheduling, and AI planning are P1/P2 (see the PRD)
- No TickTick, Todoist, or other third-party task integrations
- Link previews, comments, and shared lists are out of scope

Use **Simulate next save failure** in the left sidebar (or the command menu) to exercise recovery.
