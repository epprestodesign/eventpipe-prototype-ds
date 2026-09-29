import { describe, it, expect } from 'vitest'
import { barListRows } from '../barList.js'

const ITEMS = [
  { key: 'a', label: 'A', value: 100 },
  { key: 'b', label: 'B', value: 400 },
  { key: 'c', label: 'C', value: 250 },
  { key: 'd', label: 'D', value: 50 },
  { key: 'e', label: 'E', value: 150 },
  { key: 'f', label: 'F', value: 50 },
]

describe('barListRows', () => {
  it('ranks descending and caps at max, longest bar = full track', () => {
    const { rows, hidden, total } = barListRows(ITEMS, { max: 5 })
    expect(rows.map((r) => r.key)).toEqual(['b', 'c', 'e', 'a', 'd'])
    expect(rows[0].ratio).toBe(1)
    expect(rows[1].ratio).toBeCloseTo(0.625)
    expect(hidden).toBe(1)
    expect(total).toBe(1000)
  })

  it('share is of every reported item, not only the rows shown', () => {
    const { rows } = barListRows(ITEMS, { max: 2 })
    expect(rows.map((r) => r.share)).toEqual([0.4, 0.25])
  })

  it('keeps ties in input order and supports asc / none', () => {
    expect(barListRows(ITEMS, { max: 10 }).rows.slice(-2).map((r) => r.key)).toEqual(['d', 'f'])
    expect(barListRows(ITEMS, { sort: 'asc', max: 2 }).rows.map((r) => r.key)).toEqual(['d', 'f'])
    expect(barListRows(ITEMS, { sort: 'none', max: 3 }).rows.map((r) => r.key)).toEqual(['a', 'b', 'c'])
  })

  it('never turns missing into zero', () => {
    const { rows, hasMissing } = barListRows([
      { label: 'Zero', value: 0 },
      { label: 'Missing', value: null },
      { label: 'Some', value: 20 },
    ])
    expect(rows.map((r) => r.label)).toEqual(['Some', 'Zero', 'Missing'])
    expect(rows[1]).toMatchObject({ missing: false, ratio: 0, share: 0 })
    expect(rows[2]).toMatchObject({ missing: true, ratio: null, share: null })
    expect(hasMissing).toBe(true)
  })

  it('all zero gives empty tracks, not a divide by zero', () => {
    const { rows } = barListRows([{ label: 'x', value: 0 }, { label: 'y', value: 0 }])
    expect(rows.map((r) => [r.ratio, r.share])).toEqual([[0, 0], [0, 0]])
  })

  it('flags all-missing and empty input', () => {
    expect(barListRows([{ label: 'x', value: null }]).allMissing).toBe(true)
    expect(barListRows([]).rows).toEqual([])
    expect(barListRows([]).allMissing).toBe(false)
  })

  it('gives rows without a key a stable one', () => {
    expect(barListRows([{ label: 'x', value: 1 }]).rows[0].key).toBe('x-0')
  })
})
