import { describe, it, expect } from 'vitest'
import { LEDGER, CAPTURED_ROWS, DATA_START, DATA_END, inRange, searchRows, tileTotals, trendBuckets, money } from '../_transactions-data.js'
import { DISPUTES, isoFromLabel } from '../_disputes-data.js'

/* The EP Pay ledger is a fixture other screens point into by id, so the
   things worth pinning are its promises: pinned rows unchanged, disputes in
   step with the Disputes fixture, totals that add up, and determinism. */

const byId = new Map(LEDGER.map((r) => [r.id, r]))

describe('transactions ledger', () => {
  it('has unique ids and stays inside its dates, newest first', () => {
    expect(byId.size).toBe(LEDGER.length)
    expect(LEDGER.every((r) => r.date >= DATA_START && r.date <= DATA_END)).toBe(true)
    for (let i = 1; i < LEDGER.length; i += 1) expect(LEDGER[i - 1].date >= LEDGER[i].date).toBe(true)
  })

  it('keeps every captured row verbatim', () => {
    for (const row of CAPTURED_ROWS) {
      const got = byId.get(row.id)
      for (const k of Object.keys(row)) expect(got[k]).toBe(row[k])
    }
  })

  it('keeps the rows other screens reference', () => {
    expect(byId.get('TXN-2026-16006')).toMatchObject({ who: 'Elena Fischer', amount: '$1,359.00', date: '2026-08-20' })
    expect(byId.get('TXN-2026-15369')).toMatchObject({ who: 'Elena Fischer', status: 'Disputed', date: '2026-07-27' })
    expect(byId.get('TXN-2026-17342')).toMatchObject({ who: 'Marcus Webb', amount: '$500.00', date: '2026-09-26' })
    expect(byId.get('TXN-2026-16310')).toMatchObject({ who: 'Hannah Reyes', amount: '$515.00', date: '2026-08-26' })
  })

  it('marks exactly the Disputes fixture\'s 2026 payments as Disputed', () => {
    const fixture = DISPUTES.filter((d) => { const t = isoFromLabel(d.txnDate); return t >= DATA_START && t <= DATA_END })
    const disputed = LEDGER.filter((r) => r.status === 'Disputed')
    expect(disputed.map((r) => r.id).sort()).toEqual(fixture.map((d) => d.txn).sort())
    for (const d of fixture) {
      expect(byId.get(d.txn)).toMatchObject({
        who: d.customer, date: isoFromLabel(d.txnDate), amount: d.ofAmount.replace(/^of /, ''), event: d.event, last4: `••••${d.last4}`,
      })
    }
    expect(byId.get('TXN-2026-15993')).toMatchObject({ who: 'Noah Klein', amount: '$730.00', event: 'Pricing Event 539073' })
  })

  it('reproduces the captured page for Aug 16–20 (plus the one disputed payment that day)', () => {
    const ids = inRange(LEDGER, { start: '2026-08-16', end: '2026-08-20' }).map((r) => r.id)
    expect(ids.slice(0, 5)).toEqual(CAPTURED_ROWS.slice(0, 5).map((r) => r.id))
    expect(ids).toHaveLength(CAPTURED_ROWS.length + 1)
  })

  it('tile counts and totals add up', () => {
    const rows = inRange(LEDGER, { start: '2026-09-01', end: '2026-09-29' })
    const [all, ...rest] = tileTotals(rows)
    expect(rest.reduce((s, t) => s + t.count, 0)).toBe(all.count)
    expect(all.total).toBe(money(rows.reduce((s, r) => s + r.cents, 0)))
  })

  it('has quiet days, so an empty range is reachable', () => {
    expect(inRange(LEDGER, { start: '2026-03-21', end: '2026-03-22' })).toHaveLength(0)
  })

  it('searches name, id and event', () => {
    expect(searchRows(LEDGER, 'txn-2026-16006').map((r) => r.id)).toEqual(['TXN-2026-16006'])
    expect(searchRows(LEDGER, 'noah').every((r) => r.who === 'Noah Klein')).toBe(true)
    expect(searchRows(LEDGER, '637236').every((r) => r.event.includes('637236'))).toBe(true)
  })

  it('buckets trends by day, week or month', () => {
    expect(trendBuckets(LEDGER, { start: '2026-09-01', end: '2026-09-29' }).unit).toBe('day')
    expect(trendBuckets(LEDGER, { start: '2026-07-01', end: '2026-09-29' }).unit).toBe('week')
    const y = trendBuckets(LEDGER, { start: '2026-01-01', end: '2026-09-29' })
    expect(y.unit).toBe('month')
    expect(y.keys).toHaveLength(9)
    expect(y.series.all.reduce((a, b) => a + b, 0)).toBe(LEDGER.length)
  })

  it('formats money with a real minus sign', () => {
    expect(money(135900)).toBe('$1,359.00')
    expect(money(-24300)).toBe('−$243.00')
  })
})
