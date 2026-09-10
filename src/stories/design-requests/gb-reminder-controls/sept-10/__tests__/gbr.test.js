/** PP-42 · PP-43 · PP-44 — the acceptance criteria, as tests.
 *
 *  Each block quotes the criterion it covers, so a failure says which ticket
 *  the prototype has stopped matching.
 */
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import {
  validateInterval, hasReminderConflict, REMINDER_TOOLTIP,
  makeGroupBlockReminders, DEFAULT_INTERVAL, FIRST_REMINDER_DAYS,
} from '../_gbr'

describe('PP-42 · GBR-1 — event-level toggle', () => {
  it('"Default state: On, preserving current behavior"', () => {
    expect(makeGroupBlockReminders().enabled).toBe(true)
  })

  it('"The group block confirmation email sends regardless of toggle state" is stated to the user', () => {
    expect(REMINDER_TOOLTIP).toMatch(/confirmation email sends when group blocks are initially created/i)
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
    expect(REMINDER_TOOLTIP).toContain('2 days after the block opens')
  })

  it('the info text is static — it points at the field rather than repeating it', () => {
    // Scott, 2026-09-09: the copy must not depend on values the page passes in.
    expect(REMINDER_TOOLTIP).toContain('the interval you set below')
    expect(REMINDER_TOOLTIP).not.toMatch(/every \d+ days/)
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


/* Copy Scott approved on 2026-09-09, asserted verbatim. These tests exist to
 * make stakeholder-approved wording expensive to change by accident: edit the
 * string and a test names the ticket it came from. */
describe('approved copy', () => {
  it('PP-43 · info icon', () => {
    expect(REMINDER_TOOLTIP).toBe(
      'When on, the person who created a group block gets a reminder 2 days after the block opens, ' +
      "then additional reminders on the interval you set below until the block's release date. " +
      'The group block confirmation email sends when group blocks are initially created regardless of this setting.'
    )
  })

  it('PP-44 · modal body', () => {
    const modal = readFileSync(new URL('../components/GbrConflictModal.vue', import.meta.url), 'utf8')
    const body = modal.slice(modal.indexOf('<q-card-section class="gbrm__body">'), modal.indexOf('</q-card-section>'))
      .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

    expect(body).toContain(
      'Compliance reminders and group block reminders are both on for this event, and at least ' +
      'one compliance reminder tier sends to group block contacts.'
    )
    expect(body).toContain(
      'Those contacts will receive both streams: a compliance reminder on your tier schedule, and ' +
      "a group block reminder starting 2 days after each block opens and recurring on the interval " +
      "you set for this event until the group block's release date."
    )
    expect(body).toContain('We recommend turning group block reminders off for this event.')
  })

  it('PP-44 · the modal names no event values', () => {
    const modal = readFileSync(new URL('../components/GbrConflictModal.vue', import.meta.url), 'utf8')
    const template = modal.slice(modal.indexOf('<template>'), modal.indexOf('</template>'))
    // No interpolation in the body: Scott asked that no variables be passed in.
    expect(template).not.toMatch(/\{\{\s*(tierText|intervalText|tiers|interval)\s*\}\}/)
  })
})
