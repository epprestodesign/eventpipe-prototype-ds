// chartTable — the pure row model behind DsChartDataTable's interactive mode
// (the "View more" data modal): build rows, filter them by a search query,
// sort them by a column, and keep at least one series column visible.
// No Vue, no DOM — unit-tested in __tests__/chartTable.test.js.
import { formatValue, formatLabel, isMissing } from './chartFormat.js'

/** What a missing cell reads, in the table and to search. Never 0. */
export const NO_DATA = 'No data'

/** Sort key for the category (first) column. */
export const CATEGORY_KEY = '__category'

/**
 * One row per label. `index` keeps the chart's original order (chronological
 * for date labels), which is what the category column sorts by for dates.
 * Missing cells carry `missing: true` and read "No data" — never 0.
 */
export function buildTableRows(labels = [], series = [], { labelFormat = 'category', valueFormat = 'number', currency = 'USD' } = {}) {
  return labels.map((l, i) => ({
    key: l + '-' + i,
    index: i,
    raw: l,
    label: formatLabel(l, labelFormat, { long: true }),
    cells: series.map((s) => {
      const v = s.data?.[i]
      const missing = isMissing(v)
      return { key: s.key, value: missing ? null : Number(v), missing, text: missing ? NO_DATA : formatValue(v, valueFormat, { currency }) }
    }),
  }))
}

/**
 * Case-insensitive substring match on the row label or the formatted text of
 * any *visible* cell (so "$1,2" finds "$1,234.00", and "no data" finds gaps).
 * `visibleKeys` null/undefined = every column.
 */
export function filterTableRows(rows, query, visibleKeys) {
  const q = String(query ?? '').trim().toLowerCase()
  if (!q) return rows
  const vis = visibleKeys ? new Set(visibleKeys) : null
  return rows.filter((r) => r.label.toLowerCase().includes(q) ||
    r.cells.some((c) => (!vis || vis.has(c.key)) && c.text.toLowerCase().includes(q)))
}

/**
 * Sort rows by `{ key, dir: 'asc'|'desc' }` (null = original order).
 * - Category column: original order for date/time labels (`byIndex`),
 *   natural label order for plain categories.
 * - Value columns: numeric; missing values always last, whichever direction.
 * Ties fall back to original order, so sorting is stable and predictable.
 */
export function sortTableRows(rows, sort, { byIndex = false } = {}) {
  if (!sort || !sort.key) return rows
  const sign = sort.dir === 'desc' ? -1 : 1
  const out = [...rows]
  if (sort.key === CATEGORY_KEY) {
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
    out.sort((a, b) => sign * (byIndex ? a.index - b.index : (collator.compare(a.label, b.label) || a.index - b.index)))
    return out
  }
  const val = (r) => r.cells.find((c) => c.key === sort.key)?.value ?? null
  out.sort((a, b) => {
    const va = val(a); const vb = val(b)
    if (va === null && vb === null) return a.index - b.index
    if (va === null) return 1
    if (vb === null) return -1
    return sign * (va - vb) || a.index - b.index
  })
  return out
}

/** Header click: a new column starts ascending; the same column flips. */
export function nextSort(current, key) {
  if (current && current.key === key) return { key, dir: current.dir === 'asc' ? 'desc' : 'asc' }
  return { key, dir: 'asc' }
}

/** `aria-sort` value for a column header. */
export function ariaSort(sort, key) {
  if (!sort || sort.key !== key) return 'none'
  return sort.dir === 'desc' ? 'descending' : 'ascending'
}

/**
 * Show / hide a series column. Hiding the last visible column is refused —
 * a table with no values answers nothing. Returns the new hidden-key list.
 */
export function toggleHiddenSeries(hidden = [], key, allKeys = []) {
  if (hidden.includes(key)) return hidden.filter((k) => k !== key)
  const visible = allKeys.filter((k) => !hidden.includes(k))
  if (visible.length <= 1 && visible.includes(key)) return hidden
  return [...hidden, key]
}
