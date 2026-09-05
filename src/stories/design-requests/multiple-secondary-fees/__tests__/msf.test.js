/** DES-451 · DES-452 · DES-456 — secondary custom fee maths.
 *
 *  The reservation summary, the price details and the config screens must all
 *  arrive at the same number for the same fee. These functions are the single
 *  place that happens, so they are the place worth testing.
 */
import { describe, it, expect } from 'vitest'
import {
  money, feeRate, feeTotal, activeFees, makeFees,
  MAX_SECONDARY_FEES, EVENT_FEE_SEEDS, HOTEL_FEE_SEEDS,
} from '../_msf'

describe('the cap', () => {
  it('is three, and makeFees always returns exactly three slots', () => {
    expect(MAX_SECONDARY_FEES).toBe(3)
    expect(makeFees()).toHaveLength(3)
    expect(makeFees(HOTEL_FEE_SEEDS)).toHaveLength(3)
    expect(makeFees([{ enabled: true }])).toHaveLength(3)
  })

  it('leaves unseeded slots off, so a partly-configured event stays compact', () => {
    const fees = makeFees(EVENT_FEE_SEEDS)
    expect(fees.filter((f) => f.enabled)).toHaveLength(2)
    expect(fees[2].enabled).toBe(false)
  })
})

describe('fee maths', () => {
  it('a per-room-night fee multiplies by nights — the loom\'s $5 × 4 = $20', () => {
    expect(feeTotal({ chargeType: 'Per Room Night', amount: 5 }, 4)).toBe(20)
  })

  it('a per-reservation fee does not multiply by nights', () => {
    expect(feeTotal({ chargeType: 'Per Reservation', amount: 15 }, 4)).toBe(15)
  })

  it('multiplies by rooms in both charge types', () => {
    expect(feeTotal({ chargeType: 'Per Room Night', amount: 5 }, 4, 2)).toBe(40)
    expect(feeTotal({ chargeType: 'Per Reservation', amount: 15 }, 4, 2)).toBe(30)
  })

  it('treats a missing amount as zero rather than NaN', () => {
    expect(feeTotal({ chargeType: 'Per Room Night', amount: null }, 4)).toBe(0)
    expect(feeTotal({ chargeType: 'Per Reservation' }, 4)).toBe(0)
  })
})

describe('how a fee reads', () => {
  it('states the rate the same way on every surface', () => {
    expect(feeRate({ chargeType: 'Per Room Night', amount: 5 })).toBe('$5.00 per room night')
    expect(feeRate({ chargeType: 'Per Reservation', amount: 10 })).toBe('$10.00 per reservation')
  })

  it('formats money to two places with thousands separators', () => {
    expect(money(5)).toBe('$5.00')
    expect(money(1234.5)).toBe('$1,234.50')
    expect(money(0)).toBe('$0.00')
    expect(money(null)).toBe('$0.00')
  })
})

describe('activeFees', () => {
  const fees = makeFees(HOTEL_FEE_SEEDS)

  it('returns only enabled slots, carrying their slot number', () => {
    const shown = activeFees(fees)
    expect(shown).toHaveLength(3)
    expect(shown.map((f) => f.slot)).toEqual([1, 2, 3])
  })

  it('falls back to the slot name when a label is still blank', () => {
    const [first] = activeFees(makeFees([{ enabled: true, label: '' }]))
    expect(first.name).toBe('Secondary Custom Fee 1')
  })

  it('keeps slot numbers stable when a middle fee is switched off', () => {
    const partial = makeFees([HOTEL_FEE_SEEDS[0], { enabled: false }, HOTEL_FEE_SEEDS[2]])
    expect(activeFees(partial).map((f) => f.slot)).toEqual([1, 3])
  })
})
