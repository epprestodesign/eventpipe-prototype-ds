import { describe, it, expect } from 'vitest'
import {
  CATEGORY_KEY, NO_DATA, buildTableRows, filterTableRows, sortTableRows, nextSort, ariaSort, toggleHiddenSeries,
} from '../chartTable.js'

const LABELS = ['Direct', 'Email', 'Agent', 'Group block']
const SERIES = [
  { key: 'now', label: 'Sep 2026', data: [1200, null, 300, 1200] },
  { key: 'then', label: 'Sep 2025', data: [900, 50, 0, 1500] },
]
const rows = buildTableRows(LABELS, SERIES, { valueFormat: 'currency' })
const keys = (rs) => rs.map((r) => r.raw)

describe('buildTableRows', () => {
  it('formats labels and cells, keeps original index', () => {
    expect(rows[0]).toMatchObject({ index: 0, raw: 'Direct', label: 'Direct' })
    expect(rows[0].cells[0]).toEqual({ key: 'now', value: 1200, missing: false, text: '$1,200.00' })
  })
  it('missing reads "No data" and is null, never 0; a real 0 stays 0', () => {
    expect(rows[1].cells[0]).toMatchObject({ value: null, missing: true, text: NO_DATA })
    expect(rows[2].cells[1]).toMatchObject({ value: 0, missing: false, text: '$0.00' })
  })
  it('formats date labels in long form', () => {
    const [r] = buildTableRows(['2026-09-01'], [{ key: 'a', data: [1] }], { labelFormat: 'day' })
    expect(r.label).not.toBe('2026-09-01')
    expect(r.label).toMatch(/2026/)
  })
})

describe('filterTableRows', () => {
  it('empty / whitespace query returns every row', () => {
    expect(filterTableRows(rows, '')).toBe(rows)
    expect(filterTableRows(rows, '   ')).toBe(rows)
  })
  it('matches the label case-insensitively', () => {
    expect(keys(filterTableRows(rows, 'GROUP'))).toEqual(['Group block'])
  })
  it('matches formatted cell text', () => {
    expect(keys(filterTableRows(rows, '$1,200'))).toEqual(['Direct', 'Group block'])
    expect(keys(filterTableRows(rows, 'no data'))).toEqual(['Email'])
  })
  it('ignores hidden columns when matching cells', () => {
    expect(keys(filterTableRows(rows, '$1,500', ['now']))).toEqual([])
    expect(keys(filterTableRows(rows, '$1,500', ['then']))).toEqual(['Group block'])
    expect(keys(filterTableRows(rows, 'no data', ['then']))).toEqual([])
  })
  it('no match yields an empty list', () => {
    expect(filterTableRows(rows, 'zzz')).toEqual([])
  })
})

describe('sortTableRows', () => {
  it('null sort keeps the original order', () => {
    expect(sortTableRows(rows, null)).toBe(rows)
  })
  it('category sorts by label for plain categories', () => {
    expect(keys(sortTableRows(rows, { key: CATEGORY_KEY, dir: 'asc' }))).toEqual(['Agent', 'Direct', 'Email', 'Group block'])
    expect(keys(sortTableRows(rows, { key: CATEGORY_KEY, dir: 'desc' }))).toEqual(['Group block', 'Email', 'Direct', 'Agent'])
  })
  it('category sorts by original order for dates (byIndex)', () => {
    expect(keys(sortTableRows(rows, { key: CATEGORY_KEY, dir: 'asc' }, { byIndex: true }))).toEqual(LABELS)
    expect(keys(sortTableRows(rows, { key: CATEGORY_KEY, dir: 'desc' }, { byIndex: true }))).toEqual([...LABELS].reverse())
  })
  it('values sort numerically with missing last in both directions, ties in original order', () => {
    expect(keys(sortTableRows(rows, { key: 'now', dir: 'asc' }))).toEqual(['Agent', 'Direct', 'Group block', 'Email'])
    expect(keys(sortTableRows(rows, { key: 'now', dir: 'desc' }))).toEqual(['Direct', 'Group block', 'Agent', 'Email'])
  })
  it('does not mutate the input', () => {
    const copy = [...rows]
    sortTableRows(rows, { key: 'then', dir: 'desc' })
    expect(rows).toEqual(copy)
  })
})

describe('nextSort / ariaSort', () => {
  it('new column starts ascending, same column flips', () => {
    const a = nextSort(null, 'now')
    expect(a).toEqual({ key: 'now', dir: 'asc' })
    expect(nextSort(a, 'now')).toEqual({ key: 'now', dir: 'desc' })
    expect(nextSort(nextSort(a, 'now'), 'now')).toEqual({ key: 'now', dir: 'asc' })
    expect(nextSort({ key: 'now', dir: 'desc' }, 'then')).toEqual({ key: 'then', dir: 'asc' })
  })
  it('maps to aria-sort values', () => {
    expect(ariaSort(null, 'now')).toBe('none')
    expect(ariaSort({ key: 'then', dir: 'asc' }, 'now')).toBe('none')
    expect(ariaSort({ key: 'now', dir: 'asc' }, 'now')).toBe('ascending')
    expect(ariaSort({ key: 'now', dir: 'desc' }, 'now')).toBe('descending')
  })
})

describe('toggleHiddenSeries', () => {
  const all = ['a', 'b', 'c']
  it('hides and re-shows a column', () => {
    expect(toggleHiddenSeries([], 'b', all)).toEqual(['b'])
    expect(toggleHiddenSeries(['b'], 'b', all)).toEqual([])
  })
  it('refuses to hide the last visible column', () => {
    const hidden = ['a', 'b']
    expect(toggleHiddenSeries(hidden, 'c', all)).toBe(hidden)
    expect(toggleHiddenSeries([], 'a', ['a'])).toEqual([])
  })
})
