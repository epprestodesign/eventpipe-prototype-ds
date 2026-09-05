/** PP-42 · PP-43 · PP-44 — the acceptance criteria, as tests.
 *
 *  Each block quotes the criterion it covers, so a failure says which ticket
 *  the prototype has stopped matching.
 */
import { describe, it, expect } from 'vitest'
import {
  validateInterval, hasReminderConflict, reminderTooltip,
  makeGroupBlockReminders, DEFAULT_INTERVAL, FIRST_REMINDER_DAYS,
} from '../_gbr'

describe('PP-42 · GBR-1 — event-level toggle', () => {
  it('"Default state: On, preserving current behavior"', () => {
    expect(makeGroupBlockReminders().enabled).toBe(true)
  })

  it('"The group block confirmation email sends regardless of toggle state" is stated to the user', () => {
    expect(reminderTooltip(3)).toMatch(/confirmation email sends either way/i)
  })
})

describe('PP-43 · GBR-3 — days between reminders', () => {
  it('"defaulted to 3", preserving current behavior', () => {
    expect(makeGroupBlockReminders().interval).toBe(3)
    expect(DEFAULT_INTERVAL).toBe(3)
  })

  it('"Field accepts positive integers only"', () => {
    for (const ok of [1, 2, 3, 14, 365, '7']) {
      expect(validateInterval(ok), `${ok} should be valid`).toBe('')
    }
  })

  it('"zero, negative numbers, decimals, non-numeric input and an empty value are rejected"', () => {
    for (const bad of [0, -1, -14, 1.5, 0.5, 'soon', 'abc', '', null, undefined, NaN]) {
      expect(validateInterval(bad), `${String(bad)} should be rejected`).not.toBe('')
    }
  })

  it('rejection messages say what to do, not just that it is wrong', () => {
    expect(validateInterval(0)).toBe('Must be at least 1 day')
    expect(validateInterval(1.5)).toBe('Whole days only')
    expect(validateInterval('')).toBe('Enter a number of days')
  })

  it('"the first reminder still sends 2 days after block creation" — fixed, not configurable', () => {
    expect(FIRST_REMINDER_DAYS).toBe(2)
    expect(reminderTooltip(3)).toContain('2 days after the block opens')
    expect(reminderTooltip(14)).toContain('2 days after the block opens')
  })

  it('the info text states the interval actually configured', () => {
    expect(reminderTooltip(3)).toContain('every 3 days')
    expect(reminderTooltip(14)).toContain('every 14 days')
    expect(reminderTooltip(1)).toContain('every day')       // not "every 1 days"
    expect(reminderTooltip(0)).toContain('interval you set') // invalid → no false claim
  })
})

describe('PP-44 · GBR-2 — conflict trigger', () => {
  const all = {
    complianceReminderOn: true,
    groupBlockRemindersOn: true,
    companyRecipientsIncludeGroupBlockContacts: true,
  }

  it('fires when all three conditions are true', () => {
    expect(hasReminderConflict(all)).toBe(true)
  })

  it('"Modal does not display when any one of those three conditions is false"', () => {
    for (const key of Object.keys(all)) {
      expect(hasReminderConflict({ ...all, [key]: false }), `${key} false`).toBe(false)
    }
  })

  it('does not fire on an empty/partial state', () => {
    expect(hasReminderConflict({})).toBe(false)
  })
})
