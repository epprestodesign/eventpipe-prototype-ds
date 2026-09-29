import { describe, it, expect } from 'vitest'
import { formatValue, formatLabel, formatDelta, truncateLabel, formatAxisValue, MISSING } from '../chartFormat.js'
import { classifyCartesian, classifySegments, seriesColorSlots, toShares, foldSegments, sumPresent } from '../chartData.js'

describe('formatValue', () => {
  it('formats each value format', () => {
    expect(formatValue(1234.5, 'currency')).toBe('$1,234.50')
    expect(formatValue(1234567, 'currency-compact')).toBe('$1.2M')
    expect(formatValue(0.1234, 'percent')).toBe('12.3%')
    expect(formatValue(12500, 'compact')).toBe('12.5K')
    expect(formatValue(1234.567, 'number')).toBe('1,234.57')
  })
  it('never turns missing into zero', () => {
    expect(formatValue(null, 'currency')).toBe(MISSING)
    expect(formatValue(undefined)).toBe(MISSING)
    expect(formatValue(NaN)).toBe(MISSING)
    expect(formatValue(0, 'currency')).toBe('$0.00')
  })
  it('uses compact currency on axes', () => {
    expect(formatAxisValue(25000, 'currency')).toBe('$25K')
    expect(formatAxisValue(0.5, 'percent')).toBe('50%')
  })
})

describe('formatLabel', () => {
  it('formats ISO dates in UTC regardless of host timezone', () => {
    expect(formatLabel('2026-09-01', 'day')).toBe('Sep 1')
    expect(formatLabel('2026-09-01', 'day', { long: true })).toBe('Tue, Sep 1, 2026')
    expect(formatLabel('2026-01-01', 'month')).toBe('Jan')
    expect(formatLabel('2026-01-01', 'month-year')).toBe('Jan 2026')
  })
  it('passes categories through', () => {
    expect(formatLabel('Direct', 'category')).toBe('Direct')
  })
  it('truncates long labels with an ellipsis', () => {
    expect(truncateLabel('Hotel & Venue Partnerships', 12)).toBe('Hotel & Ven…')
    expect(truncateLabel('Short', 12)).toBe('Short')
  })
})

describe('formatDelta', () => {
  it('computes direction and signed text', () => {
    expect(formatDelta(114.2, 100)).toMatchObject({ direction: 'up', text: '+14.2%' })
    expect(formatDelta(80, 100)).toMatchObject({ direction: 'down', text: '−20%' })
    expect(formatDelta(100, 100)).toMatchObject({ direction: 'flat' })
  })
  it('handles zero and missing baselines honestly', () => {
    expect(formatDelta(50, 0)).toMatchObject({ direction: 'up', ratio: null, text: 'New' })
    expect(formatDelta(50, null)).toMatchObject({ direction: 'none' })
    expect(formatDelta(null, 50)).toMatchObject({ direction: 'none' })
  })
})

describe('classifyCartesian', () => {
  const labels = ['a', 'b', 'c']
  it('distinguishes empty, all-missing, all-zero and partial-missing', () => {
    expect(classifyCartesian([], [{ data: [] }]).empty).toBe(true)
    expect(classifyCartesian(labels, []).empty).toBe(true)
    expect(classifyCartesian(labels, [{ data: [null, null, null] }])).toMatchObject({ empty: false, allMissing: true })
    expect(classifyCartesian(labels, [{ data: [0, 0, 0] }])).toMatchObject({ allZero: true, hasMissing: false })
    expect(classifyCartesian(labels, [{ data: [0, null, 0] }])).toMatchObject({ allZero: true, hasMissing: true, missingCount: 1 })
    expect(classifyCartesian(labels, [{ data: [1, null, 3] }])).toMatchObject({ allZero: false, hasMissing: true })
  })
})

describe('classifySegments', () => {
  it('keeps missing distinct from zero', () => {
    expect(classifySegments([]).empty).toBe(true)
    expect(classifySegments([{ value: 0 }, { value: 0 }]).allZero).toBe(true)
    expect(classifySegments([{ value: null }]).allMissing).toBe(true)
    expect(classifySegments([{ value: 3 }, { value: null }])).toMatchObject({ hasMissing: true, allZero: false })
  })
})

describe('seriesColorSlots', () => {
  it('assigns by entity, comparison goes neutral, overflow never cycles', () => {
    const slots = seriesColorSlots([{}, { comparison: true }, {}, {}, {}, {}, {}])
    expect(slots).toEqual(['chart-1', 'comparison', 'chart-2', 'chart-3', 'chart-4', 'chart-5', 'comparison'])
  })
})

describe('toShares', () => {
  it('normalises per category and leaves zero-total categories undefined', () => {
    const out = toShares(['x', 'y'], [{ data: [1, 0] }, { data: [3, 0] }])
    expect(out[0].data).toEqual([0.25, null])
    expect(out[1].data).toEqual([0.75, null])
    expect(out[0].raw).toEqual([1, 0])
  })
  it('does not count missing as zero in the total', () => {
    const out = toShares(['x'], [{ data: [2] }, { data: [null] }])
    expect(out[0].data).toEqual([1])
    expect(out[1].data).toEqual([null])
  })
})

describe('foldSegments', () => {
  it('folds the smallest into Other and keeps missing aside', () => {
    const segs = [5, 4, 3, 2, 1, 0.5].map((v, i) => ({ key: 'k' + i, label: 'L' + i, value: v }))
    const { segments, missing } = foldSegments([...segs, { key: 'm', label: 'M', value: null }], 5)
    expect(segments).toHaveLength(5)
    expect(segments[4]).toMatchObject({ other: true, value: 1.5 })
    expect(missing).toHaveLength(1)
  })
  it('sums present values only', () => {
    expect(sumPresent([1, null, 2])).toBe(3)
  })
})
