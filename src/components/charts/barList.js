/** Pure row maths behind DsBarList — no DOM, no renderer, unit-tested in
 *  __tests__/barList.test.js.
 *
 *  A ranked bar list is "top N of a breakdown": each row a bar whose length is
 *  its value relative to the LARGEST shown value (the longest bar fills the
 *  track), then the label, then the value. Share, when asked for, is of the
 *  total of ALL reported items — not just the rows shown — so "Top 5" never
 *  quietly re-bases to 100%.
 *
 *  Missing (null / undefined / NaN) and zero are different facts and stay
 *  different: a missing row has no bar and no share; a zero row has a bar of
 *  length 0 (an empty track) and a 0% share.
 */
import { isMissing } from './chartFormat.js'

/**
 * @param {{ key?: string, label: string, value: number|null, sublabel?: string, href?: string }[]} items
 * @param {{ max?: number, sort?: 'desc'|'asc'|'none' }} [opts]
 * @returns {{ rows: object[], total: number, reported: number, hidden: number, hasMissing: boolean, allMissing: boolean }}
 */
export function barListRows(items = [], { max = 5, sort = 'desc' } = {}) {
  const list = (items || []).map((it, i) => ({
    ...it,
    key: it.key ?? `${it.label}-${i}`,
    missing: isMissing(it.value),
    order: i,
  }))

  const present = list.filter((r) => !r.missing)
  // Negative values have no length on a bar list; they count as 0 for scale and share.
  const total = present.reduce((s, r) => s + Math.max(0, r.value), 0)

  let ranked = list
  if (sort === 'desc' || sort === 'asc') {
    const dir = sort === 'desc' ? -1 : 1
    ranked = [...list].sort((a, b) => {
      // Missing always sinks to the bottom, whichever way the list is sorted.
      if (a.missing !== b.missing) return a.missing ? 1 : -1
      if (a.missing) return a.order - b.order
      return a.value === b.value ? a.order - b.order : (a.value - b.value) * dir
    })
  }

  const limit = Number.isFinite(max) && max > 0 ? Math.floor(max) : ranked.length
  const shown = ranked.slice(0, limit)
  const scale = shown.reduce((m, r) => (r.missing ? m : Math.max(m, r.value)), 0)

  const rows = shown.map(({ order: _order, ...r }) => ({
    ...r,
    ratio: r.missing ? null : scale > 0 ? Math.max(0, r.value) / scale : 0,
    share: r.missing ? null : total > 0 ? Math.max(0, r.value) / total : 0,
  }))

  return {
    rows,
    total,
    reported: present.length,
    hidden: Math.max(0, ranked.length - shown.length),
    hasMissing: rows.some((r) => r.missing),
    allMissing: list.length > 0 && present.length === 0,
  }
}
