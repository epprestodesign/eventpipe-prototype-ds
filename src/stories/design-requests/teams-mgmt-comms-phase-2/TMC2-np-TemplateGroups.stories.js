/** Components / Notification Preferences / Template Group Labels.
 *
 *  NEW IN PHASE 2 — DES-428 · P0-4. The list was previously one flat run of
 *  templates in content order, with no grouping and nothing marked required.
 */
import { ref } from 'vue'
import { colHeaders, templateActions, LIST_TITLE_STYLE, COL_SEND, COL_TMPL } from './_tmc2'
import DsListItem from './components/DsListItem.vue'

export default {
  title: 'Design Requests/Teams Mgmt Comms Phase 2/Components/Notification Preferences/Template Group Labels',
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: `
**New in Phase 2** — [DES-428 · P0-4](https://linear.app/eventpipe/issue/DES-428).

Two quiet labels splitting the Teams Management section in two.

| Group | Why it is its own group |
| --- | --- |
| **Standard Emails** | A closed set — exactly one Welcome and one Previously Compliant Notice, forever |
| **Compliance Reminders** | Open-ended. Ships with one and grows as a Hoco adds more |

**Reminders sort last.** Without that, every reminder someone adds lands in among
the fixed templates and the order reads as arbitrary.

The distinction is deliberately **a small uppercase label**, not a heading or a
second card — review asked for it to be subtle. Both labels get identical
treatment so neither group reads as more important.

Both are derived from **position**, not stamped onto the rows: the label appears
on the first row of each group wherever it falls, so it stays correct whether
there is one reminder or twenty.

### Required templates

The seeded **Compliance Reminder** is marked required — its Send Email checkbox
is checked and disabled, with a *"Required — always sent"* tooltip. Reminders a
Hoco adds are not required, so the group reads correctly: one required reminder
that ships, and optional ones built on top.

### On badges

Only **customised** templates carry a badge. There used to be a grey *Default*
badge on every row; it said nothing and added noise. The rule now is to label the
exception, never the norm.
` } } },
}

const GROUP_LABEL = 'padding:14px 28px 2px; font-size:0.75rem; font-weight:600; letter-spacing:0.04em;'
  + ' text-transform:uppercase; color:var(--ds-color-text-subtle);'

const ROWS = [
  { id: 'a', group: 'Standard Emails', title: 'STP - Welcome Email', desc: 'Introduces the team to their booking site and requirements.', send: true, forced: false, custom: false },
  { id: 'b', title: 'STP - Previously Compliant Notice', desc: 'Notifies a team that has fallen out of compliance.', send: true, forced: false, custom: true },
  { id: 'd', group: 'Compliance Reminders', title: 'STP - Compliance Reminder', desc: 'Reminds non-compliant teams about their Stay-to-Play requirement.', send: true, forced: true, custom: false },
]

const list = (rows) => ({
  components: { DsListItem },
  setup: () => ({ items: ref(rows.map((r) => ({ ...r }))), groupLabel: GROUP_LABEL, openEditor: () => {} }),
  template: `
    <q-card flat bordered style="max-width:900px; overflow:hidden;">
      <q-expansion-item default-opened label="Teams Management" header-class="text-primary text-weight-bold">
        <q-separator />
        ${colHeaders}
        <template v-for="(it, i) in items" :key="it.id">
          <q-separator v-if="i > 0" />
          <div v-if="it.group" :style="groupLabel">{{ it.group }}</div>
          <div style="padding:8px 28px;">
            <ds-list-item :subtitle="it.desc" :bordered="false">
              <template #title>
                <span class="row items-center q-gutter-sm">
                  <strong style="${LIST_TITLE_STYLE}">{{ it.title }}</strong>
                  <q-badge v-if="it.custom" color="primary" class="q-px-sm q-py-xs">Custom</q-badge>
                </span>
              </template>
              <template #trailing>
                <div class="row items-center no-wrap">
                  <div style="${COL_SEND}">
                    <q-checkbox v-model="it.send" :disable="it.forced" color="primary">
                      <q-tooltip v-if="it.forced">Required — always sent</q-tooltip>
                    </q-checkbox>
                  </div>
                  <div style="${COL_TMPL}">${templateActions({ onEdit: 'openEditor' })}</div>
                </div>
              </template>
            </ds-list-item>
          </div>
        </template>
      </q-expansion-item>
    </q-card>`,
})

/** The seeded state: three standard emails, one required reminder. */
export const Seeded = { render: () => list(ROWS) }

/** After a Hoco has added three of their own. The label does not move; the group
 *  under it just grows, which is the point of sorting reminders last. */
export const WithAddedReminders = {
  render: () => list([
    ...ROWS,
    { id: 'e', title: '30 Day Reminder', desc: 'Reminds non-compliant teams about their Stay-to-Play requirement.', send: true, forced: false, custom: true },
    { id: 'f', title: '14 Day Reminder', desc: 'A firmer follow-up as the cutoff approaches.', send: true, forced: false, custom: true },
    { id: 'g', title: 'Final Notice', desc: 'Last call before the hotel cutoff date.', send: false, forced: false, custom: true },
  ]),
}
