/** Chart formatting — pure functions, no renderer and no DOM.
 *
 *  Every chart, legend, tooltip and data table formats through here so a value
 *  reads the same wherever it appears. Locale is fixed to en-US and dates are
 *  formatted in UTC, which keeps output deterministic across machines (a
 *  fixture date never shifts a day because of the viewer's timezone).
 *
 *  Missing values (null / undefined / NaN) always format to MISSING — they are
 *  never coerced to 0.
 */

export const MISSING = '—'
export const LOCALE = 'en-US'

/** Supported value formats. `percent` expects a RATIO (0.25 → 25%). */
export const VALUE_FORMATS = ['number', 'compact', 'currency', 'currency-compact', 'percent']

/** Supported label formats. Date formats expect ISO `YYYY-MM-DD` strings. */
export const LABEL_FORMATS = ['category', 'day', 'month', 'month-year']

export const isMissing = (v) => v === null || v === undefined || (typeof v === 'number' && Number.isNaN(v))

const nf = new Map()
function numberFormat(opts) {
  const key = JSON.stringify(opts)
  if (!nf.has(key)) nf.set(key, new Intl.NumberFormat(LOCALE, opts))
  return nf.get(key)
}

/**
 * Format a value for display.
 * @param {number|null} value
 * @param {string} format   one of VALUE_FORMATS
 * @param {{ currency?: string, decimals?: number }} [opts]
 */
export function formatValue(value, format = 'number', { currency = 'USD', decimals } = {}) {
  if (isMissing(value)) return MISSING
  switch (format) {
    case 'currency':
      return numberFormat({ style: 'currency', currency, minimumFractionDigits: decimals ?? 2, maximumFractionDigits: decimals ?? 2 }).format(value)
    case 'currency-compact':
      return numberFormat({ style: 'currency', currency, notation: 'compact', maximumFractionDigits: decimals ?? 1 }).format(value)
    case 'percent':
      return numberFormat({ style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: decimals ?? 1 }).format(value)
    case 'compact':
      return numberFormat({ notation: 'compact', maximumFractionDigits: decimals ?? 1 }).format(value)
    case 'number':
    default:
      return numberFormat({ maximumFractionDigits: decimals ?? 2 }).format(value)
  }
}

/** The shorter form used on axis ticks: currency and numbers go compact. */
export function formatAxisValue(value, format = 'number', opts = {}) {
  if (format === 'currency') return formatValue(value, 'currency-compact', { ...opts, decimals: 1 })
  if (format === 'number') return formatValue(value, Math.abs(value) >= 10000 ? 'compact' : 'number', opts)
  if (format === 'percent') return formatValue(value, 'percent', { decimals: 0 })
  return formatValue(value, format, opts)
}

/** Parse an ISO date (YYYY-MM-DD or YYYY-MM) as UTC midnight. */
export function parseISODate(iso) {
  const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(String(iso))
  if (!m) return null
  return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3] || 1)))
}

const df = new Map()
function dateFormat(opts) {
  const key = JSON.stringify(opts)
  if (!df.has(key)) df.set(key, new Intl.DateTimeFormat(LOCALE, { timeZone: 'UTC', ...opts }))
  return df.get(key)
}

/**
 * Format an x-axis label. `long` is the tooltip / table form.
 * @param {string} label
 * @param {string} format  one of LABEL_FORMATS
 * @param {{ long?: boolean }} [opts]
 */
export function formatLabel(label, format = 'category', { long = false } = {}) {
  if (format === 'category') return String(label)
  const d = parseISODate(label)
  if (!d) return String(label)
  if (format === 'day') {
    return long
      ? dateFormat({ weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).format(d)
      : dateFormat({ month: 'short', day: 'numeric' }).format(d)
  }
  if (format === 'month') {
    return long ? dateFormat({ month: 'long', year: 'numeric' }).format(d) : dateFormat({ month: 'short' }).format(d)
  }
  // month-year
  return long ? dateFormat({ month: 'long', year: 'numeric' }).format(d) : dateFormat({ month: 'short', year: 'numeric' }).format(d)
}

/** Truncate a category label for an axis tick. The full label stays in the
 *  tooltip and data table. */
export function truncateLabel(label, max = 16) {
  const s = String(label)
  return s.length > max ? s.slice(0, max - 1).trimEnd() + '…' : s
}

/**
 * Period-over-period change.
 * Returns { direction: 'up'|'down'|'flat'|'none', ratio: number|null, text }.
 *  - either side missing → direction 'none' (no comparison available)
 *  - previous 0, current > 0 → 'up' with ratio null ("New") — a percentage
 *    change from zero is undefined, not infinite.
 */
export function formatDelta(current, previous, { flatThreshold = 0.0005 } = {}) {
  if (isMissing(current) || isMissing(previous)) return { direction: 'none', ratio: null, text: 'No comparison' }
  if (previous === 0) {
    if (current === 0) return { direction: 'flat', ratio: 0, text: '0%' }
    return { direction: current > 0 ? 'up' : 'down', ratio: null, text: 'New' }
  }
  const ratio = (current - previous) / Math.abs(previous)
  if (Math.abs(ratio) < flatThreshold) return { direction: 'flat', ratio: 0, text: '0%' }
  const text = (ratio > 0 ? '+' : '−') + formatValue(Math.abs(ratio), 'percent', { decimals: 1 })
  return { direction: ratio > 0 ? 'up' : 'down', ratio, text }
}
