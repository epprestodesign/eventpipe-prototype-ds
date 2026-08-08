/** Components / Event Registration Settings / Teams Management Communications Card.
 *
 *  NEW IN PHASE 2 — DES-425 · P0-1. The event's Registration Settings tab had no
 *  communications section at all before this; there was no way to control what
 *  sent for one event.
 */
import { ref } from 'vue'
import { TM_TEMPLATES } from './_tmc2fixtures'

export default {
  title: 'Design Requests/Teams Mgmt Comms Phase 2/Components/Event Registration Settings/Teams Management Communications Card',
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: `
**New in Phase 2** — [DES-425 · P0-1](https://linear.app/eventpipe/issue/DES-425).

One toggle per company-level template, controlling only whether it sends **for
this event**. It sits between *Compliance* and *Restrictions* on the event's
Registration Settings tab.

### Deliberately toggle-only

No edit buttons, no per-template configuration. Content is authored **once**, in
*Company Settings › Notifications* — the line at the top of the card says so,
because "where do I change the wording" is the obvious next question. New events
inherit the company-level on/off state.

### Templates a Hoco creates arrive here

This is where [DES-428 · P0-4](https://linear.app/eventpipe/issue/DES-428) meets
P0-1. A compliance reminder created on Notification Preferences shows up as its
own row, badged **New**, so it is obvious which rows came from this session
rather than shipping with the account.

It arrives **off**. A newly created template should not start sending for every
existing event — that is what makes the toggle meaningful rather than
decorative.

It only appears **after Save** on the company screen. While the reminder is an
unsaved edit it does not exist here at all.

### Appears only with Compliance Tracking on

Like *Compliance* itself, this is a Stay-to-Play concept, so the whole card is
hidden until Compliance Tracking is ticked.

### Removed 2026-08-07

An event-level **send eligibility** block used to sit above these toggles, along
with a *Sending Blocked* state that dimmed the rows. Both are gone —
[DES-432 · P0-8](https://linear.app/eventpipe/issue/DES-432) was never requested
as a mock.
` } } },
}

const CARD_BODY = 'padding:28px 32px;'
const SECTION_TITLE = 'color:var(--ds-color-background-brand-bold); font-size:1.125rem; font-weight:500; margin-bottom:20px;'

const card = (rows) => ({
  setup: () => ({ tmTemplates: ref(rows.map((t) => ({ ...t }))) }),
  template: `
    <q-card flat bordered style="max-width:900px;">
      <q-card-section style="${CARD_BODY}">
        <div style="${SECTION_TITLE}">Teams Management Communications</div>

        <div style="color:var(--ds-color-text); line-height:1.5; max-width:760px; margin:-10px 0 4px;">
          These are your company's Teams Management templates. Switching one off here only stops it
          sending <strong>for this event</strong> — the content itself is edited once, in
          <strong>Company Settings &rsaquo; Notifications</strong>.
        </div>
        <div style="font-size:0.8125rem; color:var(--ds-color-text-subtle); margin-bottom:18px;">
          New events inherit the company-level on/off state.
        </div>

        <div style="max-width:760px;">
          <div v-for="(t, ti) in tmTemplates" :key="t.key">
            <q-separator v-if="ti" />
            <div class="row items-center no-wrap" style="padding:14px 0; gap:24px;">
              <div style="flex:1; min-width:0;">
                <div class="row items-center no-wrap q-gutter-sm">
                  <div style="font-weight:700; color:var(--ds-color-text);">{{ t.title }}</div>
                  <q-badge v-if="t.userAdded" color="primary" class="q-px-sm q-py-xs" style="flex:none;">New</q-badge>
                </div>
                <div style="font-size:0.875rem; color:var(--ds-color-text-subtle); line-height:1.45; margin-top:2px;">
                  {{ t.desc }}
                </div>
              </div>
              <q-toggle v-model="t.eventOn" color="primary" style="flex:none;"
                :aria-label="'Send ' + t.title + ' for this event'" />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>`,
})

/** The four company templates every account ships with. */
export const Seeded = { render: () => card(TM_TEMPLATES) }

/** After a reminder was created on Notification Preferences and saved. It lands
 *  here badged New and switched off, waiting to be opted in for this event. */
export const WithNewTemplate = {
  render: () => card([
    ...TM_TEMPLATES,
    {
      key: 'tm-added-1',
      title: '30 Day Reminder',
      desc: 'Reminds non-compliant teams about their Stay-to-Play requirement.',
      eventOn: false,
      userAdded: true,
    },
  ]),
}

/** A template that is on at company level but switched off for this event —
 *  the state the whole card exists to make possible. */
export const OneSwitchedOff = {
  render: () => card(TM_TEMPLATES.map((t, i) => (i === 1 ? { ...t, eventOn: false } : t))),
}
