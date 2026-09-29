/** SYNTHETIC chart fixtures — Storybook only.
 *
 *  Every value here is invented for the catalog. None of it is customer or
 *  production data. Dates are fixed ISO strings; values are literals or come
 *  from a fixed formula (no Math.random, no Date.now, no API calls), so every
 *  render — and every visual-regression screenshot — is identical.
 *
 *  Missing (null), zero (0) and empty ([]) are deliberately distinct fixtures.
 *
 *  Production code must never import this file.
 */

/** ISO dates for `n` consecutive days starting at `start` (UTC). */
export function isoDays(start, n) {
  const [y, m, d] = start.split('-').map(Number)
  return Array.from({ length: n }, (_, i) => new Date(Date.UTC(y, m - 1, d + i)).toISOString().slice(0, 10))
}

/** A stable wave: deterministic "organic-looking" values. */
export function wave(n, { base = 100, amp = 20, period = 7, trend = 0, phase = 0, decimals = 0 } = {}) {
  const f = 10 ** decimals
  return Array.from({ length: n }, (_, i) => {
    const v = base + trend * i + amp * Math.sin((2 * Math.PI * (i + phase)) / period) + (amp / 3) * Math.sin((2 * Math.PI * (i + phase)) / (period * 2.7))
    return Math.round(v * f) / f
  })
}

export const MONTHS_2026 = ['2026-01-01', '2026-02-01', '2026-03-01', '2026-04-01', '2026-05-01', '2026-06-01', '2026-07-01', '2026-08-01', '2026-09-01', '2026-10-01', '2026-11-01', '2026-12-01']
export const SEPT_2026 = isoDays('2026-09-01', 30)

/* ---- Line ---------------------------------------------------------------- */

/** Monthly booking revenue, current year vs previous year (USD). */
export const REVENUE_MONTHLY = {
  labels: MONTHS_2026,
  series: [
    { key: 'current', label: '2026', data: [48200, 51900, 63400, 58100, 72500, 88900, 94300, 91200, 76800, 69400, 57300, 61800] },
    { key: 'previous', label: '2025', comparison: true, data: [41800, 44100, 52600, 55900, 61200, 74300, 80100, 83600, 70200, 60800, 51900, 55400] },
  ],
}

/** Daily revenue for September 2026 — single series. */
export const REVENUE_DAILY = {
  labels: SEPT_2026,
  series: [{ key: 'revenue', label: 'Revenue', data: wave(30, { base: 2400, amp: 520, period: 7, trend: 18 }) }],
}

/** Three booking channels, monthly room nights. */
export const CHANNELS_MONTHLY = {
  labels: MONTHS_2026,
  series: [
    { key: 'direct', label: 'Direct booking site', data: [820, 910, 1040, 990, 1210, 1480, 1560, 1510, 1290, 1150, 960, 1020] },
    { key: 'group', label: 'Group blocks', data: [540, 610, 720, 760, 880, 1020, 1100, 1060, 930, 810, 690, 720] },
    { key: 'partner', label: 'Partner referrals', data: [310, 330, 360, 410, 450, 520, 540, 560, 480, 430, 380, 400] },
  ],
}

/** Daily check-ins with a reporting outage (Sep 9–12) and isolated gaps. */
export const CHECKINS_MISSING = {
  labels: SEPT_2026.slice(0, 21),
  series: [
    { key: 'checkins', label: 'Check-ins', data: [142, 151, 138, 160, 171, 158, 149, 155, null, null, null, null, 166, 174, null, 181, null, 188, 176, 169, 184] },
    { key: 'prev', label: 'Same days, 2025', comparison: true, data: [128, 133, 131, 140, 152, 149, 137, 141, 139, 145, 150, 147, 151, 158, 160, 162, 159, 165, 161, 154, 166] },
  ],
}

/** 90 days of dense daily data. */
export const DENSE_DAILY = {
  labels: isoDays('2026-07-01', 90),
  series: [
    { key: 'sessions', label: 'Sessions', data: wave(90, { base: 5200, amp: 900, period: 7, trend: 14 }) },
    { key: 'prev', label: 'Previous 90 days', comparison: true, data: wave(90, { base: 4700, amp: 800, period: 7, trend: 9, phase: 2 }) },
  ],
}

/** Every reported value is zero (a real, measured zero). */
export const ALL_ZERO = {
  labels: SEPT_2026.slice(0, 14),
  series: [{ key: 'refunds', label: 'Refunds', data: Array(14).fill(0) }],
}

/** Categories exist but nothing was reported (all missing). */
export const ALL_MISSING = {
  labels: SEPT_2026.slice(0, 14),
  series: [{ key: 'refunds', label: 'Refunds', data: Array(14).fill(null) }],
}

/** No categories at all. */
export const EMPTY = { labels: [], series: [] }

/* ---- Area ---------------------------------------------------------------- */

/** Cumulative registered attendees over a 12-week registration window. */
export const GROWTH_WEEKLY = {
  labels: isoDays('2026-06-01', 84).filter((_, i) => i % 7 === 0),
  series: [{ key: 'registrations', label: 'Registrations (cumulative)', data: [120, 310, 560, 840, 1180, 1510, 1930, 2360, 2710, 3120, 3480, 3810] }],
}

/** Room nights by room type, monthly — for stacked area. */
export const ROOM_TYPES_MONTHLY = {
  labels: MONTHS_2026,
  series: [
    { key: 'king', label: 'King', data: [620, 680, 760, 740, 860, 1020, 1090, 1060, 930, 850, 720, 760] },
    { key: 'double', label: 'Double Queen', data: [480, 520, 610, 640, 720, 860, 910, 880, 770, 700, 600, 630] },
    { key: 'suite', label: 'Suite', data: [90, 95, 120, 115, 140, 180, 190, 185, 160, 140, 110, 120] },
  ],
}

/* ---- Bar ----------------------------------------------------------------- */

/** Bookings by channel (single period). */
export const CHANNEL_BOOKINGS = {
  labels: ['Direct', 'Group block', 'Partner', 'Phone', 'Walk-in'],
  series: [{ key: 'bookings', label: 'Bookings', data: [1840, 1320, 640, 280, 95] }],
}

/** Current vs previous period by channel — grouped bars. */
export const CHANNEL_PERIODS = {
  labels: ['Direct', 'Group block', 'Partner', 'Phone', 'Walk-in'],
  series: [
    { key: 'current', label: 'Sep 2026', data: [1840, 1320, 640, 280, 95] },
    { key: 'previous', label: 'Sep 2025', comparison: true, data: [1510, 1410, 520, 330, 110] },
  ],
}

/** Long category names — the case for horizontal bars. */
export const LONG_LABELS = {
  labels: [
    'Downtown Convention Center Hotel & Suites',
    'Riverside Marriott — Conference Wing',
    'Airport Hilton Garden Inn (Shuttle Partner)',
    'Lakeside Resort and Waterpark Family Lodge',
    'Historic District Boutique Inn',
    'Stadium Hampton Inn',
  ],
  series: [{ key: 'nights', label: 'Room nights', data: [2140, 1780, 1320, 1190, 640, 410] }],
}

/** Revenue by month with a missing month (bars). */
export const BARS_MISSING = {
  labels: MONTHS_2026.slice(0, 8),
  series: [{ key: 'revenue', label: 'Revenue', data: [48200, 51900, null, 58100, 72500, 0, 94300, 91200] }],
}

/* ---- Stacked bar --------------------------------------------------------- */

/** Reservation status composition per event. */
export const STATUS_BY_EVENT = {
  labels: ['Bend Premier Cup', 'Show-Me State Games', 'Oregon Super Cup', 'Jr Canes Classic', 'Summer Slam'],
  series: [
    { key: 'confirmed', label: 'Confirmed', data: [412, 286, 198, 144, 88] },
    { key: 'pending', label: 'Pending', data: [58, 74, 21, 36, 12] },
    { key: 'cancelled', label: 'Cancelled', data: [31, 18, 25, 9, 4] },
  ],
}

/** Same composition, with one event that has no reservations (all zero) and
 *  one whose pending count was not reported. */
export const STATUS_EDGE_CASES = {
  labels: ['Bend Premier Cup', 'Show-Me State Games', 'Winter Invitational', 'Jr Canes Classic'],
  series: [
    { key: 'confirmed', label: 'Confirmed', data: [412, 286, 0, 144] },
    { key: 'pending', label: 'Pending', data: [58, null, 0, 36] },
    { key: 'cancelled', label: 'Cancelled', data: [31, 18, 0, 9] },
  ],
}

/** A single-row share bar — the pattern the EP Pay screens hand-draw
 *  ("Dispute By", balance split). */
export const SHARE_SINGLE = {
  labels: ['Disputed amount'],
  series: [
    { key: 'visa', label: 'Visa', data: [18420] },
    { key: 'mc', label: 'Mastercard', data: [9310] },
    { key: 'amex', label: 'Amex', data: [5120] },
    { key: 'discover', label: 'Discover', data: [1880] },
    { key: 'other', label: 'Other methods', comparison: true, data: [940] },
  ],
}

/* ---- Donut --------------------------------------------------------------- */

export const CHANNEL_SEGMENTS = [
  { key: 'direct', label: 'Direct booking site', value: 1840 },
  { key: 'group', label: 'Group blocks', value: 1320 },
  { key: 'partner', label: 'Partner referrals', value: 640 },
  { key: 'phone', label: 'Phone', value: 280 },
]

/** Seven parts — folds into top four + Other. */
export const MANY_SEGMENTS = [
  { key: 'direct', label: 'Direct', value: 1840 },
  { key: 'group', label: 'Group blocks', value: 1320 },
  { key: 'partner', label: 'Partners', value: 640 },
  { key: 'phone', label: 'Phone', value: 280 },
  { key: 'walkin', label: 'Walk-in', value: 95 },
  { key: 'email', label: 'Email', value: 61 },
  { key: 'kiosk', label: 'Kiosk', value: 22 },
]

export const SEGMENTS_MISSING = [
  { key: 'direct', label: 'Direct', value: 1840 },
  { key: 'group', label: 'Group blocks', value: 1320 },
  { key: 'partner', label: 'Partners', value: null },
  { key: 'phone', label: 'Phone', value: 280 },
]

export const SEGMENTS_ZERO = [
  { key: 'direct', label: 'Direct', value: 0 },
  { key: 'group', label: 'Group blocks', value: 0 },
  { key: 'partner', label: 'Partners', value: 0 },
]

export const SEGMENTS_ALL_MISSING = [
  { key: 'direct', label: 'Direct', value: null },
  { key: 'group', label: 'Group blocks', value: null },
]

/* ---- Sparkline / Metric card -------------------------------------------- */

export const SPARK_UP = [12, 14, 13, 17, 16, 19, 21, 20, 24, 23, 27, 29]
export const SPARK_DOWN = [31, 29, 30, 27, 26, 27, 23, 22, 20, 21, 18, 16]
export const SPARK_FLAT = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
export const SPARK_MISSING = [12, 14, 13, null, null, 19, 21, 20, null, 23, 27, 29]
export const SPARK_PREV = [11, 12, 12, 13, 14, 14, 15, 16, 16, 17, 18, 18]
