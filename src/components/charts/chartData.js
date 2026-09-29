/** Chart data helpers — pure functions shared by every chart component.
 *
 *  The one rule they all enforce: EMPTY, MISSING and ZERO are three different
 *  facts and are never collapsed into one another.
 *    - empty    → there is nothing to plot (no categories or no series)
 *    - missing  → a slot exists but has no reported value (null)
 *    - zero     → a reported value of 0
 */
import { isMissing } from './chartFormat.js'

/** Maximum distinct categorical colours. A sixth series is never a generated
 *  hue — it renders in the neutral comparison colour (see seriesColorSlots). */
export const MAX_CATEGORICAL = 5

/**
 * Classify a cartesian dataset.
 * @param {string[]} labels
 * @param {{ data: (number|null)[] }[]} series
 */
export function classifyCartesian(labels = [], series = []) {
  const empty = !labels.length || !series.length || series.every((s) => !s.data || !s.data.length)
  if (empty) return { empty: true, allMissing: false, allZero: false, hasMissing: false, missingCount: 0 }
  let missingCount = 0
  let present = 0
  let nonZero = 0
  for (const s of series) {
    for (let i = 0; i < labels.length; i++) {
      const v = s.data ? s.data[i] : undefined
      if (isMissing(v)) missingCount++
      else { present++; if (v !== 0) nonZero++ }
    }
  }
  return {
    empty: false,
    allMissing: present === 0,
    allZero: present > 0 && nonZero === 0,
    hasMissing: missingCount > 0 && present > 0,
    missingCount,
  }
}

/** Classify donut segments ({ value }[]). */
export function classifySegments(segments = []) {
  if (!segments.length) return { empty: true, allMissing: false, allZero: false, hasMissing: false, missingCount: 0 }
  const missingCount = segments.filter((s) => isMissing(s.value)).length
  const present = segments.length - missingCount
  return {
    empty: false,
    allMissing: present === 0,
    allZero: present > 0 && segments.every((s) => isMissing(s.value) || s.value === 0),
    hasMissing: missingCount > 0 && present > 0,
    missingCount,
  }
}

/**
 * Assign colour slots by entity, never by rank or visibility: hiding a series
 * must not repaint the others. Comparison series take the neutral colour; the
 * rest take categorical slots 1..5 in order; overflow goes neutral.
 * An explicit `color` on a series ('chart-1'..'chart-5' | 'comparison') wins.
 * @returns {string[]} token names, e.g. ['chart-1', 'comparison']
 */
export function seriesColorSlots(series = []) {
  let next = 1
  return series.map((s) => {
    if (s.color) return s.color
    if (s.comparison) return 'comparison'
    if (next > MAX_CATEGORICAL) return 'comparison'
    return `chart-${next++}`
  })
}

/**
 * Convert stacked series into per-category shares (0..1). A category whose
 * reported values sum to 0 (or are all missing) yields nulls — a share of
 * nothing is undefined, and drawing it as 0% would claim a measurement.
 */
export function toShares(labels = [], series = []) {
  const totals = labels.map((_, i) => series.reduce((sum, s) => sum + (isMissing(s.data?.[i]) ? 0 : s.data[i]), 0))
  return series.map((s) => ({
    ...s,
    raw: s.data,
    data: labels.map((_, i) => {
      const v = s.data?.[i]
      if (isMissing(v) || totals[i] === 0) return null
      return v / totals[i]
    }),
  }))
}

/**
 * Fold donut segments beyond `max` into a single "Other" segment (largest
 * first). Missing segments are kept aside and never folded into a number.
 */
export function foldSegments(segments = [], max = MAX_CATEGORICAL) {
  const present = segments.filter((s) => !isMissing(s.value))
  const missing = segments.filter((s) => isMissing(s.value))
  if (present.length <= max) return { segments: present, missing }
  const sorted = [...present].sort((a, b) => b.value - a.value)
  const keep = sorted.slice(0, max - 1)
  const rest = sorted.slice(max - 1)
  const other = { key: '__other', label: `Other · ${rest.length}`, value: rest.reduce((n, s) => n + s.value, 0), other: true, members: rest.map((s) => s.label) }
  // Keep the caller's order for the survivors so colour follows the entity.
  const ordered = present.filter((s) => keep.includes(s))
  return { segments: [...ordered, other], missing }
}

/** Sum of reported values (missing excluded, never counted as zero). */
export function sumPresent(values = []) {
  return values.reduce((n, v) => (isMissing(v) ? n : n + v), 0)
}

/** Series extent over reported values — { min, max } or null when none. */
export function extent(values = []) {
  const present = values.filter((v) => !isMissing(v))
  if (!present.length) return null
  return { min: Math.min(...present), max: Math.max(...present) }
}
