import { describe, it, expect } from 'vitest'
import { comparisonRange, sameDayLastYear, computeInsights, hotelOf, daysOf } from '../_insights.js'

const row = (date, cents, extra = {}) => ({
  date, cents, status: 'Success', type: 'Sale', who: 'A', brand: 'visa',
  event: 'E1', res: 'Hotel One RES-5000001', ...extra,
})

describe('comparison windows', () => {
  it('previous period is the same length, immediately before', () => {
    expect(comparisonRange({ start: '2026-08-31', end: '2026-09-29' })).toEqual({ start: '2026-08-01', end: '2026-08-30' })
    expect(comparisonRange({ start: '2026-03-01', end: '2026-03-01' })).toEqual({ start: '2026-02-28', end: '2026-02-28' })
  })
  it('previous year is the same dates a year earlier', () => {
    expect(comparisonRange({ start: '2026-08-31', end: '2026-09-29' }, 'year')).toEqual({ start: '2025-08-31', end: '2025-09-29' })
    expect(sameDayLastYear('2028-02-29')).toBe('2027-02-28')
  })
})

describe('computeInsights', () => {
  const ledger = [
    row('2026-01-02', 10000),
    row('2026-01-03', 5000, { who: 'B', brand: 'amex', event: 'E2', res: 'Hotel Two RES-5000002' }),
    row('2026-01-03', -2000, { type: 'Refund' }),
    row('2026-01-04', 7000, { status: 'Failed' }),
    row('2025-12-31', 99999), // before the ledger's start — must be ignored as comparison
  ]
  const opts = { ledger, dataStart: '2026-01-01' }

  it('counts only successful sales', () => {
    const r = computeInsights({ start: '2026-01-02', end: '2026-01-04' }, 'period', opts)
    expect(r.kpis.gross.value).toBe(150)
    expect(r.kpis.count.value).toBe(2)
    expect(r.kpis.avgDaily.value).toBe(50)
    expect(r.trend.current).toEqual([100, 50, 0])
  })

  it('a comparison window before the ledger is missing, not zero', () => {
    const r = computeInsights({ start: '2026-01-02', end: '2026-01-04' }, 'period', opts)
    expect(r.comparison).toMatchObject({ start: '2025-12-30', end: '2026-01-01', coverage: 'partial' })
    expect(r.trend.previous).toEqual([null, null, 0])
    expect(r.kpis.gross.previous).toBeNull()
    expect(computeInsights({ start: '2026-01-02', end: '2026-01-04' }, 'year', opts).comparison.coverage).toBe('none')
  })

  it('fully covered comparisons get real previous values', () => {
    const r = computeInsights({ start: '2026-01-03', end: '2026-01-03' }, 'period', opts)
    expect(r.kpis.gross.previous).toBe(100)
    expect(r.kpis.count.previous).toBe(1)
  })

  it('breaks down by event, hotel, method and customer, largest first', () => {
    const r = computeInsights({ start: '2026-01-02', end: '2026-01-04' }, 'period', opts)
    expect(r.byEvent.map((x) => [x.label, x.value, x.count])).toEqual([['E1', 100, 1], ['E2', 50, 1]])
    expect(r.byHotel.map((x) => x.label)).toEqual(['Hotel One', 'Hotel Two'])
    expect(r.byMethod.map((x) => x.label)).toEqual(['Visa', 'American Express'])
    expect(r.byCustomer[0].sublabel).toBe('1 payment')
  })

  it('works on the real ledger', () => {
    const r = computeInsights({ start: '2026-08-31', end: '2026-09-29' })
    expect(r.trend.labels).toHaveLength(30)
    expect(r.kpis.gross.value).toBeGreaterThan(0)
    expect(r.kpis.gross.previous).toBeGreaterThan(0)
    expect(r.byEvent.reduce((s, x) => s + x.value, 0)).toBeCloseTo(r.kpis.gross.value, 2)
    expect(computeInsights({ start: '2026-08-31', end: '2026-09-29' }, 'year').kpis.gross.previous).toBeNull()
  })
})

describe('helpers', () => {
  it('hotelOf strips the reservation number', () => {
    expect(hotelOf({ res: 'Omni Tempe Hotel at ASU RES-5412760' })).toBe('Omni Tempe Hotel at ASU')
  })
  it('daysOf is inclusive', () => {
    expect(daysOf({ start: '2026-02-27', end: '2026-03-01' })).toEqual(['2026-02-27', '2026-02-28', '2026-03-01'])
  })
})
