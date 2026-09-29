/** EP Pay — the transaction ledger as data.
 *
 *  One deterministic dataset, Jan 1 → Sep 29, 2026, that the Transactions
 *  screen filters by date range, status and search. It is two things merged:
 *
 *  1. PINNED rows — every transaction another EP Pay screen names by id. The
 *     ten rows the 09/28 capture shows (Aug 16–20) are copied verbatim, and so
 *     are the ledger rows behind the Disputes queue, Elena Fischer's customer
 *     page, the deposit payment link and Hannah Reyes' plan. Clicking through
 *     from any of those screens lands on a row that exists, on its date.
 *
 *  2. DISPUTED rows — every "Disputed" transaction is one the Disputes
 *     fixture (`_disputes-data.js`, imported, never copied) names: same
 *     transaction id, customer, card, event, date, and the original charge
 *     (the dispute's "of $X") as the amount. Nothing else in the ledger is
 *     Disputed, so the Disputed card and the Disputes screen cannot drift
 *     apart. The fixture ends Aug 31 and a dispute arrives days to weeks
 *     after the payment, so September has none yet — which is also true.
 *
 *  3. GENERATED rows — a seeded PRNG (mulberry32, fixed seed; never
 *     Math.random) fills every other day: a few sales on a weekday, fewer at
 *     the weekend (some quiet Sundays have none), volume growing through the
 *     year, ~86% Success with some Refunded and Failed. The days Aug 16–20
 *     are left to the captured rows alone, so picking that range reproduces
 *     the capture.
 *
 *  Customers, cards, events and hotels are the ones the other screens already
 *  use, so a name here is a name there.
 */

import { DISPUTES, isoFromLabel } from './_disputes-data'

export const DATA_START = '2026-01-01'
export const DATA_END = '2026-09-29'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MINUS = '−' // the ledger prints "−$243.00" with a real minus sign

/* ---------------------------------------------------------------- helpers */

/** mulberry32 — a tiny seeded PRNG. Same seed, same ledger, every run. */
function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6D2B79F5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const pad = (n) => String(n).padStart(2, '0')
const isoAdd = (iso, n) => {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}
const dow = (iso) => new Date(`${iso}T00:00:00Z`).getUTCDay()

/** Cents → "$1,359.00" / "−$243.00". */
export function money(cents) {
  const abs = Math.abs(Math.round(cents))
  const s = `$${Math.floor(abs / 100).toLocaleString('en-US')}.${pad(abs % 100)}`
  return cents < 0 ? MINUS + s : s
}

/** "$1,359.00" / "−$243.00" → cents. */
const parseMoney = (s) => {
  const neg = /^[-−]/.test(s)
  const cents = Math.round(Number(s.replace(/[^0-9.]/g, '')) * 100)
  return neg ? -cents : cents
}

/** "Aug 20, 2026 · 2:51 PM" → { date: '2026-08-20', minutes: 891 }. */
function parseWhen(when) {
  const m = /^([A-Z][a-z]{2}) (\d{1,2}), (\d{4}) · (\d{1,2}):(\d{2}) (AM|PM)$/.exec(when)
  if (!m) throw new Error(`Unparseable transaction time: ${when}`)
  const h = (Number(m[4]) % 12) + (m[6] === 'PM' ? 12 : 0)
  return { date: `${m[3]}-${pad(MONTHS.indexOf(m[1]) + 1)}-${pad(m[2])}`, minutes: h * 60 + Number(m[5]) }
}

function formatWhen(iso, minutes) {
  const [y, mo, d] = iso.split('-').map(Number)
  const h = Math.floor(minutes / 60)
  const mm = minutes % 60
  return `${MONTHS[mo - 1]} ${d}, ${y} · ${((h + 11) % 12) + 1}:${pad(mm)} ${h < 12 ? 'AM' : 'PM'}`
}

/* ---------------------------------------------------------------- cast */

const EVENTS = [
  { event: 'Automated Playwright Live Event 340366', hotel: 'Hyatt Regency Seattle' },
  { event: 'Pricing Event 539073', hotel: 'Marriott Tempe at The Buttes' },
  { event: 'Pricing Event 637236', hotel: 'Omni Tempe Hotel at ASU' },
]

/** Customers and the cards the other screens show them paying with. The first
 *  six are the captured ledger's own; weight = how often they book. */
const CUSTOMERS = [
  { who: 'Elena Fischer', w: 5, cards: [['visa', '••••8821'], ['visa', '••••4242']] },
  { who: 'Noah Klein', w: 4, cards: [['klarna', '••••2914'], ['mastercard', '••••4508']] },
  { who: 'Jordan Alvarez', w: 4, cards: [['discover', '••••6011'], ['visa', '••••8821']] },
  { who: 'Hannah Reyes', w: 4, cards: [['paypal', '••••7730'], ['klarna', '••••2914']] },
  { who: 'Marcus Webb', w: 4, cards: [['amex', '••••1007']] },
  { who: 'Chris Okonkwo', w: 3, cards: [['mastercard', '••••5309']] },
  { who: 'Priya Raman', w: 2, cards: [['amex', '••••3315']] },
  { who: 'Owen Marsh', w: 2, cards: [['visa', '••••6620']] },
  { who: 'Maya Sorensen', w: 2, cards: [['discover', '••••7076']] },
  { who: 'Grace Lindqvist', w: 1, cards: [['visa', '••••1188']] },
  { who: 'Diego Ramirez', w: 1, cards: [['paypal', '••••8830']] },
  { who: 'Tom Okada', w: 1, cards: [['visa', '••••8017']] },
]
const CUSTOMER_BAG = CUSTOMERS.flatMap((c) => new Array(c.w).fill(c))

/* ---------------------------------------------------------------- pinned */

/** Page 1 of the ledger, exactly as the 09/28 capture shows it. */
export const CAPTURED_ROWS = [
  { id: 'TXN-2026-16006', status: 'Success', when: 'Aug 20, 2026 · 2:51 PM', amount: '$1,359.00', type: 'Sale', who: 'Elena Fischer', brand: 'visa', last4: '••••8821', event: 'Automated Playwright Live Event 340366', res: 'Hyatt Regency Seattle RES-5381879' },
  { id: 'TXN-2026-15993', status: 'Disputed', when: 'Aug 20, 2026 · 8:10 AM', amount: '$730.00', type: 'Sale', who: 'Noah Klein', brand: 'klarna', last4: '••••2914', event: 'Pricing Event 539073', res: 'Marriott Tempe at The Buttes RES-5379550' },
  { id: 'TXN-2026-15980', status: 'Success', when: 'Aug 19, 2026 · 10:36 AM', amount: '$804.00', type: 'Sale', who: 'Jordan Alvarez', brand: 'discover', last4: '••••6011', event: 'Automated Playwright Live Event 340366', res: 'Hyatt Regency Seattle RES-5379824' },
  { id: 'TXN-2026-15967', status: 'Success', when: 'Aug 19, 2026 · 3:55 PM', amount: '$2,575.00', type: 'Sale', who: 'Hannah Reyes', brand: 'paypal', last4: '••••7730', event: 'Pricing Event 539073', res: 'Marriott Tempe at The Buttes RES-5377495' },
  { id: 'TXN-2026-15954', status: 'Success', when: 'Aug 19, 2026 · 9:14 AM', amount: '$1,946.00', type: 'Sale', who: 'Marcus Webb', brand: 'amex', last4: '••••1007', event: 'Pricing Event 637236', res: 'Omni Tempe Hotel at ASU RES-5375166' },
  { id: 'TXN-2026-15941', status: 'Success', when: 'Aug 18, 2026 · 10:18 AM', amount: '$762.00', type: 'Sale', who: 'Chris Okonkwo', brand: 'mastercard', last4: '••••5309', event: 'Automated Playwright Live Event 340366', res: 'Hyatt Regency Seattle RES-5370782' },
  { id: 'TXN-2026-15928', status: 'Success', when: 'Aug 17, 2026 · 5:03 PM', amount: '−$243.00', type: 'Refund', who: 'Elena Fischer', brand: 'visa', last4: '••••4242', event: 'Automated Playwright Live Event 340366', res: 'Hyatt Regency Seattle RES-5368727' },
  { id: 'TXN-2026-15915', status: 'Success', when: 'Aug 17, 2026 · 11:22 AM', amount: '$1,978.00', type: 'Sale', who: 'Noah Klein', brand: 'mastercard', last4: '••••4508', event: 'Pricing Event 539073', res: 'Marriott Tempe at The Buttes RES-5366398' },
  { id: 'TXN-2026-15902', status: 'Refunded: Partial', when: 'Aug 16, 2026 · 1:48 PM', amount: '$2,052.00', type: 'Sale', who: 'Jordan Alvarez', brand: 'visa', last4: '••••8821', event: 'Automated Playwright Live Event 340366', res: 'Hyatt Regency Seattle RES-5366672' },
  { id: 'TXN-2026-15889', status: 'Success', when: 'Aug 16, 2026 · 6:07 PM', amount: '−$27.00', type: 'Adjustment', who: 'Hannah Reyes', brand: 'klarna', last4: '••••2914', event: 'Pricing Event 539073', res: 'Marriott Tempe at The Buttes RES-5364343' },
]

/** Ledger rows other screens point at by id, copied from those screens. The
 *  times are ours where a screen gives only a date. (Rows behind the Disputes
 *  queue are not here — they come from the fixture, below.) */
const REFERENCED_ROWS = [
  // Customers › Elena Fischer — also DSP-52173 in the Disputes fixture, which agrees
  { id: 'TXN-2026-15369', status: 'Disputed', when: 'Jul 27, 2026 · 10:12 AM', amount: '$1,119.00', type: 'Sale', who: 'Elena Fischer', brand: 'klarna', last4: '••••2914', event: 'Pricing Event 539073', res: 'Marriott Tempe at The Buttes RES-5321406' },
  // Payment Links › deposit link payments
  { id: 'TXN-2026-17342', status: 'Success', when: 'Sep 26, 2026 · 4:18 PM', amount: '$500.00', type: 'Sale', who: 'Marcus Webb', brand: 'amex', last4: '••••1007', event: 'Pricing Event 637236', res: 'Omni Tempe Hotel at ASU RES-5412760' },
  { id: 'TXN-2026-17301', status: 'Success', when: 'Sep 24, 2026 · 11:02 AM', amount: '$250.00', type: 'Sale', who: 'Owen Marsh', brand: 'visa', last4: '••••6620', event: 'Pricing Event 637236', res: 'Omni Tempe Hotel at ASU RES-5410981' },
  { id: 'TXN-2026-17266', status: 'Success', when: 'Sep 21, 2026 · 7:45 PM', amount: '$1,000.00', type: 'Sale', who: 'Maya Sorensen', brand: 'discover', last4: '••••7076', event: 'Pricing Event 637236', res: 'Omni Tempe Hotel at ASU RES-5408335' },
  { id: 'TXN-2026-17230', status: 'Success', when: 'Sep 19, 2026 · 9:26 AM', amount: '$500.00', type: 'Sale', who: 'Priya Raman', brand: 'amex', last4: '••••3315', event: 'Pricing Event 637236', res: 'Omni Tempe Hotel at ASU RES-5406512' },
  // Subscriptions › Hannah Reyes' installment plan
  { id: 'TXN-2026-14622', status: 'Success', when: 'Jul 26, 2026 · 6:00 AM', amount: '$515.00', type: 'Sale', who: 'Hannah Reyes', brand: 'paypal', last4: '••••7730', event: 'Pricing Event 539073', res: 'Marriott Tempe at The Buttes RES-5320118' },
  { id: 'TXN-2026-16310', status: 'Success', when: 'Aug 26, 2026 · 6:00 AM', amount: '$515.00', type: 'Sale', who: 'Hannah Reyes', brand: 'paypal', last4: '••••7730', event: 'Pricing Event 539073', res: 'Marriott Tempe at The Buttes RES-5320118' },
]

/** A row as the screen needs it: the display strings, plus the date, minute
 *  and cents the filters and totals work from. */
const enrich = (row) => {
  const { date, minutes } = parseWhen(row.when)
  return { ...row, date, minutes, cents: parseMoney(row.amount), seq: Number(row.id.split('-').pop()) }
}

/* ---------------------------------------------------------------- disputed */

const BRAND_KEY = { Visa: 'visa', Mastercard: 'mastercard', Amex: 'amex', Discover: 'discover', PayPal: 'paypal', Klarna: 'klarna' }
const HOTEL_FOR = Object.fromEntries(EVENTS.map((e) => [e.event, e.hotel]))

/** FNV-1a — a stable number from a string, for the details the fixture does
 *  not carry (time of day, reservation number). */
function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i += 1) h = Math.imul(h ^ str.charCodeAt(i), 16777619)
  return h >>> 0
}

/** One ledger row per dispute whose payment falls inside the ledger's dates.
 *  Rows already pinned above (the captured Noah Klein row, Elena Fischer's
 *  Customers row) are the same transactions and are not repeated. */
function disputedRows(skipIds) {
  return DISPUTES
    .map((d) => ({ d, date: isoFromLabel(d.txnDate) }))
    .filter(({ d, date }) => date >= DATA_START && date <= DATA_END && !skipIds.has(d.txn))
    .map(({ d, date }) => {
      const h = hash(d.txn)
      return {
        id: d.txn,
        status: 'Disputed',
        when: formatWhen(date, 8 * 60 + (h % (12 * 60))),
        amount: d.ofAmount.replace(/^of /, ''),
        type: 'Sale',
        who: d.customer,
        brand: BRAND_KEY[d.brand] || d.brand.toLowerCase(),
        last4: `••••${d.last4}`,
        event: d.event,
        res: `${HOTEL_FOR[d.event] || 'Hyatt Regency Seattle'} RES-${5150000 + (h % 270000)}`,
      }
    })
}

/* ---------------------------------------------------------------- generator */

function generate(pinnedIds, capturedDays) {
  const rand = mulberry32(20260929)
  const pick = (arr) => arr[Math.floor(rand() * arr.length)]
  const between = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1))
  const rows = []
  const lastIndex = Math.round((Date.parse(`${DATA_END}T00:00:00Z`) - Date.parse(`${DATA_START}T00:00:00Z`)) / 86400000)

  for (let i = 0, day = DATA_START; day <= DATA_END; i += 1, day = isoAdd(day, 1)) {
    if (capturedDays.has(day)) continue
    const wd = dow(day)
    // Weekday volume grows ~60% across the year; weekends run at a third to a half.
    const growth = 0.8 + 0.5 * (i / lastIndex)
    // Weekends swing more, so some quiet Sundays have nothing at all.
    const weekend = wd === 0 || wd === 6
    const lambda = (wd === 0 ? 1 : wd === 6 ? 1.5 : 3.4) * growth
    const n = Math.max(0, Math.round(lambda * (weekend ? 0.2 + rand() * 1.6 : 0.45 + rand() * 1.1)))

    // Times within the day, ascending, 7 AM – 9 PM.
    const times = Array.from({ length: n }, () => between(7 * 60, 21 * 60 - 1)).sort((a, b) => a - b)
    // Ids climb ~26 a day — the same rate as the captured rows — so an id and
    // a date agree. A pinned id is never reused.
    let seq = 10000 + i * 26
    times.forEach((minutes, k) => {
      seq += between(2, 4)
      while (pinnedIds.has(seq)) seq += 1
      const c = pick(CUSTOMER_BAG)
      const [brand, last4] = pick(c.cards)
      const ev = pick(EVENTS)

      const r = rand()
      // Never 'Disputed' — those come from the Disputes fixture only.
      const status = r < 0.86 ? 'Success' : r < 0.9 ? 'Refunded' : r < 0.935 ? 'Refunded: Partial' : 'Failed'

      let type = 'Sale'
      // Sales cluster $300–$2,500, with the occasional large group booking.
      let cents = (between(3, 25) * 100 + between(0, 9) * 10 + (rand() < 0.08 ? between(10, 18) * 100 : 0)) * 100
      if (status === 'Success') {
        const t = rand()
        if (t < 0.05) { type = 'Refund'; cents = -between(40, 600) * 100 } else if (t < 0.065) { type = 'Adjustment'; cents = -between(9, 60) * 100 }
      }
      if (status === 'Failed') cents = Math.round(cents * 0.6 / 100) * 100

      rows.push(enrich({
        id: `TXN-2026-${seq}`,
        status,
        when: formatWhen(day, minutes),
        amount: money(cents),
        type,
        who: c.who,
        brand,
        last4,
        event: ev.event,
        res: `${ev.hotel} RES-${5150000 + i * 960 + k * 37 + between(0, 30)}`,
      }))
    })
  }
  return rows
}

const screenRows = [...CAPTURED_ROWS, ...REFERENCED_ROWS]
const pinned = [...screenRows, ...disputedRows(new Set(screenRows.map((r) => r.id)))].map(enrich)
const pinnedIds = new Set(pinned.map((r) => r.seq))
const capturedDays = new Set(CAPTURED_ROWS.map((r) => parseWhen(r.when).date))

/** Newest first: by date, then by id — the captured page lists a day's rows in
 *  id order, not clock order, and this keeps it that way. */
export const LEDGER = [...pinned, ...generate(pinnedIds, capturedDays)]
  .sort((a, b) => (a.date === b.date ? b.seq - a.seq : a.date < b.date ? 1 : -1))

/* ---------------------------------------------------------------- queries */

/** Status tiles. `match` null = everything. */
export const STATUS_FILTERS = [
  { key: 'all', label: 'All', match: null },
  { key: 'success', label: 'Success', match: (t) => t.status === 'Success' },
  { key: 'refunded', label: 'Refunded', match: (t) => t.status.startsWith('Refunded') },
  { key: 'disputed', label: 'Disputed', match: (t) => t.status === 'Disputed' },
  { key: 'failed', label: 'Failed', match: (t) => t.status === 'Failed' },
]

export const inRange = (rows, { start, end }) => rows.filter((t) => t.date >= start && t.date <= end)

export function searchRows(rows, query) {
  const q = String(query || '').trim().toLowerCase()
  if (!q) return rows
  return rows.filter((t) => t.who.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.event.toLowerCase().includes(q))
}

/** Count and signed total per status tile. */
export function tileTotals(rows) {
  return STATUS_FILTERS.map((f) => {
    const hit = f.match ? rows.filter(f.match) : rows
    return { ...f, count: hit.length, total: money(hit.reduce((s, t) => s + t.cents, 0)) }
  })
}

/** Per-status counts in buckets across a range — day, week or month depending
 *  on its length, so a sparkline always has a sensible number of points. */
export function trendBuckets(rows, { start, end }) {
  const days = Math.round((Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86400000) + 1
  const unit = days <= 31 ? 'day' : days <= 120 ? 'week' : 'month'
  const keyOf = (iso) => {
    if (unit === 'day') return iso
    if (unit === 'month') return iso.slice(0, 7)
    return isoAdd(iso, -dow(iso)) // week starting Sunday
  }
  const keys = []
  for (let d = start; d <= end; d = isoAdd(d, 1)) {
    const k = keyOf(d)
    if (keys[keys.length - 1] !== k) keys.push(k)
  }
  const index = new Map(keys.map((k, i) => [k, i]))
  const series = Object.fromEntries(STATUS_FILTERS.map((f) => [f.key, new Array(keys.length).fill(0)]))
  for (const t of inRange(rows, { start, end })) {
    const i = index.get(keyOf(t.date))
    for (const f of STATUS_FILTERS) if (!f.match || f.match(t)) series[f.key][i] += 1
  }
  return { unit, keys, series }
}
