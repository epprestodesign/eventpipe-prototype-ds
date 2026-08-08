/** Components / Team Detail / Communications Opt-Out Card.
 *
 *  NEW IN PHASE 2 — DES-426 · P0-2. There was no way to stop communications for
 *  one team; the only controls were company-level and event-level.
 */
import { ref } from 'vue'

export default {
  title: 'Design Requests/Teams Mgmt Comms Phase 2/Components/Team Detail/Communications Opt-Out',
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: `
**New in Phase 2** — [DES-426 · P0-2](https://linear.app/eventpipe/issue/DES-426).

A single checkbox, in its own **Communications** card between *Goals &
Restrictions* and *Compliance Credits*. Checking it suppresses **all** automated
Teams Management email for that one team.

**Unchecked by default** — every team is opted *in* unless someone opts it out.

### Why it looks like this

It went through two rounds of review, and both were cuts.

The first pass wrapped the checkbox in explanatory sub-text, an amber warning
callout on the checked state, and a read-only send-status panel. Review:
*"The solution is overkill, really just need checkbox with a label."* All of it
came out — the label carries the meaning on its own now.

It then sat inside *Goals & Restrictions*, which is compliance overrides and org
fields. A comms opt-out is neither, and it read as an unrelated control bolted
onto the end of a form. So it was promoted to its own card, built on the same
shell as *Compliance Credits* — same border, padding and heading treatment — so
the page reads as a consistent stack of sections.

The header is the short form, **Communications**. Alongside *Goals &
Restrictions* and *Compliance Credits* it reads better, and the full product name
is carried by the checkbox label directly beneath it. That label is the string
that has to be unambiguous, not the header.

### A checkbox, not a toggle

The card is saved by an explicit *Save Changes*, so a switch would wrongly imply
the change takes effect on click.
` } } },
}

const CARD = 'margin-bottom:20px;'
const CARD_BODY = 'padding:26px 30px;'
const H2 = 'font-size:1.0625rem; font-weight:700; color:var(--ds-color-text); margin-bottom:16px;'

const card = (checked) => ({
  setup: () => ({ commsOptOut: ref(checked) }),
  template: `
    <div style="max-width:900px; background:var(--ds-color-surface-sunken); padding:20px;">
      <q-card flat bordered style="${CARD}">
        <q-card-section style="${CARD_BODY}">
          <div style="${H2} margin-bottom:0;">Goals &amp; Restrictions</div>
          <div class="text-grey-6" style="font-size:0.8125rem; margin-top:8px;">…overrides and org fields.</div>
        </q-card-section>
      </q-card>

      <q-card flat bordered style="${CARD}">
        <q-card-section style="${CARD_BODY}">
          <div style="${H2}">Communications</div>
          <q-checkbox v-model="commsOptOut" color="primary" dense
            label="Opt out of Teams Management communications" />
        </q-card-section>
      </q-card>

      <q-card flat bordered style="${CARD}">
        <q-card-section style="${CARD_BODY}">
          <div style="${H2}">Compliance Credits</div>
          <q-btn outline no-caps color="primary" label="+ Add New Compliance Credit" />
        </q-card-section>
      </q-card>
    </div>`,
})

/** The default for every team. */
export const OptedIn = { render: () => card(false) }

/** Checked. No automated Teams Management email sends to this team — welcome,
 *  compliance reminders or previously-compliant notices. */
export const OptedOut = { render: () => card(true) }
