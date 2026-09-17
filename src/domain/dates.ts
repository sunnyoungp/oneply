export const TIME_ZONE = 'America/New_York';
export const PROTOTYPE_NOW = '2026-09-17T13:42:00.000Z';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

export type ZonedParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  weekday: number;
  date: string;
};

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function zonedParts(iso: string, timeZone = TIME_ZONE): ZonedParts {
  const date = new Date(iso);
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: 'short',
    hourCycle: 'h23',
  });
  const map: Record<string, string> = {};
  for (const part of fmt.formatToParts(date)) {
    if (part.type !== 'literal') map[part.type] = part.value;
  }
  const weekdayName = map.weekday;
  const weekday = WEEKDAYS.indexOf(weekdayName as (typeof WEEKDAYS)[number]);
  const year = Number(map.year);
  const month = Number(map.month);
  const day = Number(map.day);
  return {
    year,
    month,
    day,
    hour: Number(map.hour),
    minute: Number(map.minute),
    second: Number(map.second),
    weekday: weekday === -1 ? 0 : weekday,
    date: `${year}-${pad(month)}-${pad(day)}`,
  };
}

export function dateKey(iso: string, timeZone = TIME_ZONE): string {
  return zonedParts(iso, timeZone).date;
}

export function addMinutes(iso: string, minutes: number): string {
  return new Date(new Date(iso).getTime() + minutes * 60_000).toISOString();
}

export function minutesBetween(start: string, end: string): number {
  return Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60_000);
}

export function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return new Date(aStart) < new Date(bEnd) && new Date(bStart) < new Date(aEnd);
}

export function isBefore(a: string, b: string): boolean {
  return new Date(a).getTime() < new Date(b).getTime();
}

export function compareIso(a: string, b: string): number {
  return new Date(a).getTime() - new Date(b).getTime();
}

/** Convert a wall-clock date+time in a zone to ISO. */
export function fromZoned(date: string, hours: number, minutes: number, timeZone = TIME_ZONE): string {
  const guess = new Date(`${date}T${pad(hours)}:${pad(minutes)}:00Z`);
  const parts = zonedParts(guess.toISOString(), timeZone);
  const desired = hours * 60 + minutes;
  const actual = parts.hour * 60 + parts.minute;
  return addMinutes(guess.toISOString(), desired - actual);
}

export function startOfDay(date: string, timeZone = TIME_ZONE): string {
  return fromZoned(date, 0, 0, timeZone);
}

export function endOfDay(date: string, timeZone = TIME_ZONE): string {
  return fromZoned(date, 23, 59, timeZone);
}

export function addDays(date: string, days: number): string {
  const [y, m, d] = date.split('-').map(Number);
  const utc = new Date(Date.UTC(y, m - 1, d + days));
  return `${utc.getUTCFullYear()}-${pad(utc.getUTCMonth() + 1)}-${pad(utc.getUTCDate())}`;
}

export function startOfWeek(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  const utc = new Date(Date.UTC(y, m - 1, d));
  const weekday = utc.getUTCDay();
  const mondayOffset = (weekday + 6) % 7;
  utc.setUTCDate(utc.getUTCDate() - mondayOffset);
  return `${utc.getUTCFullYear()}-${pad(utc.getUTCMonth() + 1)}-${pad(utc.getUTCDate())}`;
}

export function startOfMonth(date: string): string {
  return `${date.slice(0, 7)}-01`;
}

export function addMonths(date: string, months: number): string {
  const [y, m] = date.split('-').map(Number);
  const utc = new Date(Date.UTC(y, m - 1 + months, 1));
  return `${utc.getUTCFullYear()}-${pad(utc.getUTCMonth() + 1)}-01`;
}

export function daysInMonth(date: string): number {
  const [y, m] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

export function weekDates(date: string): string[] {
  const start = startOfWeek(date);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function monthGrid(date: string): string[] {
  const first = startOfMonth(date);
  const start = startOfWeek(first);
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}

export function formatTime(iso: string, timeZone = TIME_ZONE): string {
  const p = zonedParts(iso, timeZone);
  const hour12 = p.hour % 12 || 12;
  const ampm = p.hour < 12 ? 'AM' : 'PM';
  return p.minute === 0 ? `${hour12} ${ampm}` : `${hour12}:${pad(p.minute)} ${ampm}`;
}

export function formatTimeShort(iso: string, timeZone = TIME_ZONE): string {
  const p = zonedParts(iso, timeZone);
  const hour12 = p.hour % 12 || 12;
  return p.minute === 0 ? `${hour12}` : `${hour12}:${pad(p.minute)}`;
}

export function formatDayHeading(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  const utc = new Date(Date.UTC(y, m - 1, d));
  const weekday = WEEKDAYS[utc.getUTCDay()];
  return `${weekday} ${MONTHS[m - 1]} ${d}`;
}

export function formatMonthYear(date: string): string {
  const [y, m] = date.split('-').map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

export function formatRangeLabel(start: string, end: string, timeZone = TIME_ZONE): string {
  const s = zonedParts(start, timeZone);
  const weekday = WEEKDAYS[s.weekday];
  return `${weekday} · ${formatTime(start, timeZone)}–${formatTime(end, timeZone)}`;
}

export function formatDeadline(date: string | undefined): string | undefined {
  if (!date) return undefined;
  const [y, m, d] = date.split('-').map(Number);
  const utc = new Date(Date.UTC(y, m - 1, d));
  return `${WEEKDAYS[utc.getUTCDay()]}, ${MONTHS[m - 1]} ${d}`;
}

export function durationLabel(start: string, end: string): string {
  const mins = minutesBetween(start, end);
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function isSameDay(a: string, b: string, timeZone = TIME_ZONE): boolean {
  return dateKey(a, timeZone) === dateKey(b, timeZone);
}

export function parseNaturalDate(text: string, nowDate: string): string | undefined {
  const raw = text.trim().toLowerCase();
  if (!raw) return undefined;
  if (raw === 'today') return nowDate;
  if (raw === 'tomorrow') return addDays(nowDate, 1);
  if (raw === 'yesterday') return addDays(nowDate, -1);
  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) return raw;
  const named: Record<string, number> = {
    sunday: 0,
    sun: 0,
    monday: 1,
    mon: 1,
    tuesday: 2,
    tue: 2,
    tues: 2,
    wednesday: 3,
    wed: 3,
    thursday: 4,
    thu: 4,
    thur: 4,
    thurs: 4,
    friday: 5,
    fri: 5,
    saturday: 6,
    sat: 6,
  };
  const next = raw.startsWith('next ') ? raw.slice(5) : raw;
  if (named[next] !== undefined) {
    const [y, m, d] = nowDate.split('-').map(Number);
    const utc = new Date(Date.UTC(y, m - 1, d));
    const current = utc.getUTCDay();
    let delta = (named[next] - current + 7) % 7;
    if (delta === 0) delta = raw.startsWith('next ') ? 7 : 0;
    if (raw.startsWith('next ') && delta === 0) delta = 7;
    if (!raw.startsWith('next ') && delta === 0) return nowDate;
    return addDays(nowDate, delta === 0 ? 7 : delta);
  }
  const monthNames = MONTHS.map((x) => x.toLowerCase());
  const md = raw.match(/^([a-z]{3,9})\s+(\d{1,2})$/);
  if (md) {
    const mi = monthNames.findIndex((n) => n === md[1].slice(0, 3));
    if (mi >= 0) {
      const year = Number(nowDate.slice(0, 4));
      return `${year}-${pad(mi + 1)}-${pad(Number(md[2]))}`;
    }
  }
  return undefined;
}

export function snapMinutes(iso: string, step = 15): string {
  const d = new Date(iso);
  const mins = d.getUTCMinutes();
  const snapped = Math.round(mins / step) * step;
  d.setUTCMinutes(snapped, 0, 0);
  return d.toISOString();
}

export function hourFromOffset(offsetPx: number, hourHeight: number): { hour: number; minute: number } {
  const totalMinutes = Math.max(0, Math.min(24 * 60 - 15, Math.round((offsetPx / hourHeight) * 60 / 15) * 15));
  return { hour: Math.floor(totalMinutes / 60), minute: totalMinutes % 60 };
}
