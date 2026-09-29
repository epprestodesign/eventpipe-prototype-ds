/** Pure date maths behind DsDateRangePicker.
 *
 *  Kept out of the component so the preset boundaries — the part a silent
 *  change would make quietly wrong — can be unit-tested without mounting
 *  anything (see __tests__/dateRangeMath.test.js).
 *
 *  Every date is an ISO calendar string, 'YYYY-MM-DD'. Arithmetic runs on UTC
 *  midnights, so the host's timezone and DST can never shift a day. ISO strings
 *  also compare correctly as plain strings, which the component leans on.
 *
 *  Weeks start on Sunday (US convention, and the Su–Sa header the picker draws).
 */

const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})$/
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const WEEKDAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const WEEKDAYS_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

/** The preset rail, in the order the picker lists it. */
export const DEFAULT_PRESETS = [
  { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'thisWeek', label: 'This week' },
  { key: 'lastWeek', label: 'Last week' },
  { key: 'thisMonth', label: 'This month' },
  { key: 'lastMonth', label: 'Last month' },
  { key: 'thisYear', label: 'This year' },
  { key: 'lastYear', label: 'Last year' },
  { key: 'allTime', label: 'All time' },
]

const pad = (n) => String(n).padStart(2, '0')

/** ISO string → UTC Date, or null when it is not a real calendar date. */
export function parseISO(iso) {
  const m = ISO_RE.exec(String(iso || ''))
  if (!m) return null
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])]
  const date = new Date(Date.UTC(y, mo - 1, d))
  // Date.UTC rolls 2026-02-30 over to Mar 2 — reject anything that rolled.
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== mo - 1 || date.getUTCDate() !== d) return null
  return date
}

export const isValidISO = (iso) => parseISO(iso) !== null

/** UTC Date → ISO string. */
export const toISO = (date) => `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`

/** Build an ISO string from parts; month is 1-based. Rolls over like Date.UTC. */
export const isoFrom = (y, m, d) => toISO(new Date(Date.UTC(y, m - 1, d)))

/** The host's local calendar date — what "today" means to the person looking. */
export function todayISO(now = new Date()) {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

export function addDays(iso, n) {
  const d = parseISO(iso)
  d.setUTCDate(d.getUTCDate() + n)
  return toISO(d)
}

/** First of the month `n` months away from `iso`'s month. */
export function addMonths(iso, n) {
  const d = parseISO(iso)
  return toISO(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1)))
}

export const startOfMonth = (iso) => `${iso.slice(0, 7)}-01`
export function endOfMonth(iso) {
  const d = parseISO(iso)
  return toISO(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)))
}
export const startOfYear = (iso) => `${iso.slice(0, 4)}-01-01`
export const endOfYear = (iso) => `${iso.slice(0, 4)}-12-31`

/** Sunday on or before `iso`. */
export const startOfWeek = (iso) => addDays(iso, -parseISO(iso).getUTCDay())
export const endOfWeek = (iso) => addDays(startOfWeek(iso), 6)

/** 0 = Sunday. */
export const weekday = (iso) => parseISO(iso).getUTCDay()

/** Inclusive day count of a range. */
export function daysBetween(start, end) {
  return Math.round((parseISO(end) - parseISO(start)) / 86400000) + 1
}

export const minISO = (a, b) => (!a ? b : !b ? a : a < b ? a : b)
export const maxISO = (a, b) => (!a ? b : !b ? a : a > b ? a : b)

/** Range for a preset key, relative to `today`.
 *
 *  "This …" periods run from the period's first day to today — a ledger has
 *  nothing in the future, and a range that ends on a future Saturday would make
 *  every total look short. "Last …" periods are the whole previous period.
 *  'allTime' needs a floor: `min` (the earliest date there is data for); with
 *  none it returns null and the picker leaves the preset out. */
export function presetRange(key, today, { min = null } = {}) {
  switch (key) {
    case 'today': return { start: today, end: today }
    case 'yesterday': { const y = addDays(today, -1); return { start: y, end: y } }
    case 'thisWeek': return { start: startOfWeek(today), end: today }
    case 'lastWeek': { const s = addDays(startOfWeek(today), -7); return { start: s, end: addDays(s, 6) } }
    case 'thisMonth': return { start: startOfMonth(today), end: today }
    case 'lastMonth': { const s = addMonths(today, -1); return { start: s, end: endOfMonth(s) } }
    case 'thisYear': return { start: startOfYear(today), end: today }
    case 'lastYear': { const y = Number(today.slice(0, 4)) - 1; return { start: `${y}-01-01`, end: `${y}-12-31` } }
    case 'allTime': return min ? { start: minISO(min, today), end: today } : null
    default: return null
  }
}

/** The first preset (in `presets` order) whose range equals `range`, or null.
 *  Lets a hand-picked Sep 1 → today light up "This month" as well. */
export function matchPreset(range, today, { min = null, presets = DEFAULT_PRESETS } = {}) {
  if (!range || !range.start || !range.end) return null
  for (const p of presets) {
    const r = presetRange(p.key, today, { min })
    if (r && r.start === range.start && r.end === range.end) return p.key
  }
  return null
}

/** Clamp a range into [min, max]; either bound may be null. */
export function clampRange(range, { min = null, max = null } = {}) {
  let { start, end } = range
  if (min) { start = maxISO(start, min); end = maxISO(end, min) }
  if (max) { start = minISO(start, max); end = minISO(end, max) }
  return { start, end }
}

/** "Sep 22, 2026" */
export function formatLong(iso) {
  const d = parseISO(iso)
  if (!d) return ''
  return `${MONTHS_SHORT[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
}

/** "Tuesday, September 22, 2026" — the day cell's accessible name. */
export function formatFull(iso) {
  const d = parseISO(iso)
  return `${WEEKDAYS_LONG[d.getUTCDay()]}, ${MONTHS_LONG[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
}

/** "September 2026" */
export function formatMonth(iso) {
  const d = parseISO(iso)
  return `${MONTHS_LONG[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

/** "Sep 22, 2026 – Sep 29, 2026" (a single day prints once). */
export function formatRange(range) {
  if (!range || !range.start) return ''
  if (!range.end || range.end === range.start) return formatLong(range.start)
  return `${formatLong(range.start)} – ${formatLong(range.end)}`
}

/** "9 / 22 / 2026" — the typed-input format. */
export function formatTyped(iso) {
  const d = parseISO(iso)
  if (!d) return ''
  return `${d.getUTCMonth() + 1} / ${d.getUTCDate()} / ${d.getUTCFullYear()}`
}

/** Parse "9/22/2026", "09 / 22 / 2026" or an ISO string. Invalid → null. */
export function parseTyped(text) {
  const s = String(text || '').trim()
  if (ISO_RE.test(s)) return isValidISO(s) ? s : null
  const m = /^(\d{1,2})\s*[/.-]\s*(\d{1,2})\s*[/.-]\s*(\d{4})$/.exec(s)
  if (!m) return null
  const iso = `${m[3]}-${pad(m[1])}-${pad(m[2])}`
  return isValidISO(iso) ? iso : null
}

/** A month as rows of seven cells (Sunday first); cells outside the month are
 *  null. Always whole weeks, so two months side by side can differ in height —
 *  the component pads to six rows so they do not. */
export function monthGrid(firstOfMonth) {
  const first = startOfMonth(firstOfMonth)
  const last = endOfMonth(first)
  const rows = []
  let row = new Array(weekday(first)).fill(null)
  for (let d = first; d <= last; d = addDays(d, 1)) {
    row.push(d)
    if (row.length === 7) { rows.push(row); row = [] }
  }
  if (row.length) rows.push(row.concat(new Array(7 - row.length).fill(null)))
  return rows
}
