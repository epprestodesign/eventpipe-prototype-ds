/** EP Pay — the Dashboard "insights" numbers, computed from the ledger.
 *
 *  Pure functions over `LEDGER` (`_transactions-data.js`, read-only here), so
 *  the insights concept can never disagree with the Transactions screen: pick
 *  the same range on both and the payments are the same rows.
 *
 *  A **successful payment** is a ledger row with status `Success` and type
 *  `Sale` — the Transactions screen's Success tile minus the refunds and
 *  adjustments, which carry the Success status but are money going out.
 *  Gross volume is their total. Refunded, partially refunded, disputed and
 *  failed charges are not counted (a judgement call; see the story docs).
 *
 *  The comparison window is either the same-length window immediately before
 *  (`period`) or the same dates one year earlier (`year`). The ledger starts
 *  on DATA_START, so any comparison day before it has NO data — it is `null`
 *  (missing), never 0, and a KPI whose comparison window is not fully covered
 *  gets a `null` previous value ("No comparison"), not a partial total.
 */
import { LEDGER, DATA_START } from './_transactions-data'
import { addDays, daysBetween } from '../../components/dateRangeMath.js'

export const isSuccessfulPayment = (t) => t.status === 'Success' && t.type === 'Sale'

const BRAND_LABEL = { visa: 'Visa', mastercard: 'Mastercard', amex: 'American Express', discover: 'Discover', paypal: 'PayPal', klarna: 'Klarna' }

/** "Hyatt Regency Seattle RES-5381879" → "Hyatt Regency Seattle". */
export const hotelOf = (t) => String(t.res || '').replace(/\s+RES-\d+$/, '')

/** Same calendar day one year earlier; Feb 29 → Feb 28. */
export function sameDayLastYear(iso) {
  const y = Number(iso.slice(0, 4)) - 1
  const md = iso.slice(5)
  return md === '02-29' ? `${y}-02-28` : `${y}-${md}`
}

/** The comparison window for `range`. */
export function comparisonRange({ start, end }, mode = 'period') {
  if (mode === 'year') return { start: sameDayLastYear(start), end: sameDayLastYear(end) }
  const n = daysBetween(start, end)
  return { start: addDays(start, -n), end: addDays(start, -1) }
}

/** Every ISO day in [start, end]. */
export function daysOf({ start, end }) {
  const out = []
  for (let d = start; d <= end; d = addDays(d, 1)) out.push(d)
  return out
}

const sumCents = (rows) => rows.reduce((s, t) => s + t.cents, 0)
const dollars = (cents) => Math.round(cents) / 100

/** Group payments by `keyFn` → [{ key, label, value (dollars), count }], largest first. */
export function breakdown(rows, keyFn, labelFn = (k) => k) {
  const m = new Map()
  for (const t of rows) {
    const k = keyFn(t)
    const cur = m.get(k) || { key: k, label: labelFn(k), cents: 0, count: 0 }
    cur.cents += t.cents
    cur.count += 1
    m.set(k, cur)
  }
  return [...m.values()]
    .sort((a, b) => b.cents - a.cents || a.label.localeCompare(b.label))
    .map(({ cents, ...r }) => ({ ...r, value: dollars(cents), sublabel: `${r.count} payment${r.count === 1 ? '' : 's'}` }))
}

/**
 * Everything the insights layout shows for one range and comparison mode.
 * @param {{ start: string, end: string }} range
 * @param {'period'|'year'} mode
 * @param {{ ledger?: object[], dataStart?: string }} [opts]
 */
export function computeInsights(range, mode = 'period', { ledger = LEDGER, dataStart = DATA_START } = {}) {
  const cmp = comparisonRange(range, mode)
  const days = daysOf(range)
  const cmpDays = daysOf(cmp)
  const nDays = days.length

  const pay = ledger.filter((t) => isSuccessfulPayment(t) && t.date >= range.start && t.date <= range.end)
  const prevPay = ledger.filter((t) => isSuccessfulPayment(t) && t.date >= cmp.start && t.date <= cmp.end)

  // How much of the comparison window the ledger covers.
  const coveredDays = cmpDays.filter((d) => d >= dataStart).length
  const coverage = coveredDays === 0 ? 'none' : coveredDays === cmpDays.length ? 'full' : 'partial'
  const full = coverage === 'full'

  const byDay = (rows) => {
    const m = new Map()
    for (const t of rows) m.set(t.date, (m.get(t.date) || 0) + t.cents)
    return m
  }
  const cur = byDay(pay)
  const prev = byDay(prevPay)

  const gross = dollars(sumCents(pay))
  const prevGross = full ? dollars(sumCents(prevPay)) : null

  return {
    range: { start: range.start, end: range.end },
    comparison: { ...cmp, mode, coverage, coveredDays, days: cmpDays.length },
    kpis: {
      gross: { value: gross, previous: prevGross },
      avgDaily: { value: nDays ? gross / nDays : null, previous: full && nDays ? prevGross / nDays : null },
      count: { value: pay.length, previous: full ? prevPay.length : null },
    },
    trend: {
      labels: days,
      current: days.map((d) => dollars(cur.get(d) || 0)),
      // Day i of the comparison window, aligned with day i of this one.
      previous: cmpDays.map((d) => (d < dataStart ? null : dollars(prev.get(d) || 0))),
    },
    byEvent: breakdown(pay, (t) => t.event),
    byHotel: breakdown(pay, hotelOf),
    byMethod: breakdown(pay, (t) => t.brand, (k) => BRAND_LABEL[k] || k),
    byCustomer: breakdown(pay, (t) => t.who),
  }
}
