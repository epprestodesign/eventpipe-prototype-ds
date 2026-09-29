import { describe, it, expect } from 'vitest'
import {
  presetRange, matchPreset, parseTyped, formatTyped, formatRange, formatFull,
  monthGrid, startOfWeek, addMonths, isValidISO, clampRange, daysBetween, DEFAULT_PRESETS,
} from '../dateRangeMath.js'

const TODAY = '2026-09-29' // a Tuesday
const r = (key, today = TODAY, opts) => presetRange(key, today, opts)

describe('presetRange — mid-year (today = Tue Sep 29, 2026)', () => {
  it('today / yesterday', () => {
    expect(r('today')).toEqual({ start: '2026-09-29', end: '2026-09-29' })
    expect(r('yesterday')).toEqual({ start: '2026-09-28', end: '2026-09-28' })
  })
  it('weeks start on Sunday; "this" runs to today, "last" is the whole week', () => {
    expect(r('thisWeek')).toEqual({ start: '2026-09-27', end: '2026-09-29' })
    expect(r('lastWeek')).toEqual({ start: '2026-09-20', end: '2026-09-26' })
  })
  it('months', () => {
    expect(r('thisMonth')).toEqual({ start: '2026-09-01', end: '2026-09-29' })
    expect(r('lastMonth')).toEqual({ start: '2026-08-01', end: '2026-08-31' })
  })
  it('years', () => {
    expect(r('thisYear')).toEqual({ start: '2026-01-01', end: '2026-09-29' })
    expect(r('lastYear')).toEqual({ start: '2025-01-01', end: '2025-12-31' })
  })
  it('all time needs a floor', () => {
    expect(r('allTime', TODAY, { min: '2026-01-01' })).toEqual({ start: '2026-01-01', end: '2026-09-29' })
    expect(r('allTime')).toBeNull()
  })
  it('unknown keys return null', () => {
    expect(r('nextDecade')).toBeNull()
  })
})

describe('presetRange — edge days', () => {
  it('on a Sunday, this week is just today', () => {
    expect(r('thisWeek', '2026-09-27')).toEqual({ start: '2026-09-27', end: '2026-09-27' })
    expect(r('lastWeek', '2026-09-27')).toEqual({ start: '2026-09-20', end: '2026-09-26' })
  })
  it('on a Saturday, this week is the whole week', () => {
    expect(r('thisWeek', '2026-10-03')).toEqual({ start: '2026-09-27', end: '2026-10-03' })
  })
  it('on the 1st, this month is one day', () => {
    expect(r('thisMonth', '2026-10-01')).toEqual({ start: '2026-10-01', end: '2026-10-01' })
    expect(r('lastMonth', '2026-10-01')).toEqual({ start: '2026-09-01', end: '2026-09-30' })
  })
  it('crosses the year boundary', () => {
    // Fri Jan 2, 2026 — the week began in 2025.
    expect(r('yesterday', '2026-01-01')).toEqual({ start: '2025-12-31', end: '2025-12-31' })
    expect(r('thisWeek', '2026-01-02')).toEqual({ start: '2025-12-28', end: '2026-01-02' })
    expect(r('lastWeek', '2026-01-02')).toEqual({ start: '2025-12-21', end: '2025-12-27' })
    expect(r('lastMonth', '2026-01-15')).toEqual({ start: '2025-12-01', end: '2025-12-31' })
    expect(r('thisYear', '2026-01-01')).toEqual({ start: '2026-01-01', end: '2026-01-01' })
    expect(r('lastYear', '2026-01-01')).toEqual({ start: '2025-01-01', end: '2025-12-31' })
  })
  it('handles leap years', () => {
    expect(r('lastMonth', '2028-03-10')).toEqual({ start: '2028-02-01', end: '2028-02-29' })
    expect(r('lastMonth', '2026-03-10')).toEqual({ start: '2026-02-01', end: '2026-02-28' })
    expect(r('yesterday', '2028-03-01')).toEqual({ start: '2028-02-29', end: '2028-02-29' })
  })
  it('all time never starts after today', () => {
    expect(r('allTime', '2026-01-01', { min: '2026-06-01' })).toEqual({ start: '2026-01-01', end: '2026-01-01' })
  })
})

describe('matchPreset', () => {
  it('recognises a hand-picked range as its preset', () => {
    expect(matchPreset({ start: '2026-09-01', end: '2026-09-29' }, TODAY)).toBe('thisMonth')
    expect(matchPreset({ start: '2026-08-01', end: '2026-08-31' }, TODAY)).toBe('lastMonth')
    expect(matchPreset({ start: '2026-09-22', end: '2026-09-29' }, TODAY)).toBeNull()
  })
  it('takes the first match in rail order', () => {
    // Sunday: Today and This week are the same single day.
    expect(matchPreset({ start: '2026-09-27', end: '2026-09-27' }, '2026-09-27')).toBe('today')
  })
  it('respects a custom preset list', () => {
    const presets = DEFAULT_PRESETS.filter((p) => p.key !== 'today')
    expect(matchPreset({ start: '2026-09-27', end: '2026-09-27' }, '2026-09-27', { presets })).toBe('thisWeek')
  })
})

describe('typed dates', () => {
  it('parses loose M/D/YYYY and ISO', () => {
    expect(parseTyped('9/22/2026')).toBe('2026-09-22')
    expect(parseTyped(' 09 / 02 / 2026 ')).toBe('2026-09-02')
    expect(parseTyped('2026-09-22')).toBe('2026-09-22')
  })
  it('rejects impossible or partial dates', () => {
    expect(parseTyped('2/30/2026')).toBeNull()
    expect(parseTyped('13/1/2026')).toBeNull()
    expect(parseTyped('9/22/26')).toBeNull()
    expect(parseTyped('')).toBeNull()
    expect(isValidISO('2026-02-29')).toBe(false)
    expect(isValidISO('2028-02-29')).toBe(true)
  })
  it('round-trips through the display format', () => {
    expect(formatTyped('2026-09-22')).toBe('9 / 22 / 2026')
    expect(parseTyped(formatTyped('2026-09-22'))).toBe('2026-09-22')
  })
})

describe('formatting and grids', () => {
  it('formats the trigger label', () => {
    expect(formatRange({ start: '2026-09-22', end: '2026-09-29' })).toBe('Sep 22, 2026 – Sep 29, 2026')
    expect(formatRange({ start: '2026-09-29', end: '2026-09-29' })).toBe('Sep 29, 2026')
  })
  it('names a day in full for screen readers', () => {
    expect(formatFull('2026-09-29')).toBe('Tuesday, September 29, 2026')
  })
  it('lays September 2026 out Sunday-first', () => {
    const g = monthGrid('2026-09-01')
    expect(g[0]).toEqual([null, null, '2026-09-01', '2026-09-02', '2026-09-03', '2026-09-04', '2026-09-05'])
    expect(g).toHaveLength(5)
    expect(g[4]).toEqual(['2026-09-27', '2026-09-28', '2026-09-29', '2026-09-30', null, null, null])
  })
  it('month and week helpers', () => {
    expect(addMonths('2026-12-15', 1)).toBe('2027-01-01')
    expect(addMonths('2026-01-31', -1)).toBe('2025-12-01')
    expect(startOfWeek('2026-01-01')).toBe('2025-12-28')
    expect(daysBetween('2026-09-22', '2026-09-29')).toBe(8)
  })
  it('clamps into bounds', () => {
    expect(clampRange({ start: '2025-12-01', end: '2026-10-10' }, { min: '2026-01-01', max: '2026-09-29' }))
      .toEqual({ start: '2026-01-01', end: '2026-09-29' })
  })
})
