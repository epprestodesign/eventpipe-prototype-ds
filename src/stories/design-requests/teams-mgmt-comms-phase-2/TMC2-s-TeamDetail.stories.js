/** Teams Mgmt Comms Phase 2 / Screens / Team Detail.
 *  Rebuilt from the production capture in references/080626 (Compliance → team
 *  drill-in, "Details / Notes" tab). This is the screen P0-2 (Team-Level
 *  Communications Opt Out) and P0-9 (Communication Log) land on — both are now
 *  designed here on top of that production baseline. */
import { ref } from 'vue'
import { tmc2Page } from './_tmc2shell'
import { COMMS_LOG, EVENT, LOG_STATUS_COLOR, TEAM } from './_tmc2fixtures'
import DsInput from './components/DsInput.vue'
import DsSelect from './components/DsSelect.vue'

export default {
  title: 'Design Requests/Teams Mgmt Comms Phase 2/Screens/Team Detail',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: `
The team drill-in from **Compliance**, rebuilt from production
(\`references/080626\`).

Two Phase 2 requirements land here:

- **[DES-426 · P0-2](https://linear.app/eventpipe/issue/DES-426)** — Team-Level Communications Opt Out.
  A single checkbox labelled *Opt out of Teams Management communications*, in its own
  **Communications** card between *Goals & Restrictions* and *Compliance Credits* — same
  bordered card, padding and heading treatment as Compliance Credits. The header is the short
  form; the full product name stays in the checkbox label, which is what has to be unambiguous.
  Every team is opted *in* by default, so the box ships unchecked. Checking it suppresses
  **all** automated Teams Management email for this team.
- **[DES-433 · P0-9](https://linear.app/eventpipe/issue/DES-433)** — Communication Log.
  A third tab, **Communications Log**, holding a read-only table of every automated Teams
  Management email sent to this team: *Sent*, *Email Type*, *Recipients* (one address per line)
  and *Status*. Every column sorts; *Sent* sorts on the parsed date rather than the display
  string, so it stays correct across a year boundary.

The log is **view-only** — no resend, no row actions, no edit. It is a record, not a console.

## What review removed

Both requirements were first designed with considerably more around them. Review (2026-08-07)
called the surplus bloat on both, and this mock is the trimmed result:

| Requirement | Removed |
| -- | -- |
| **P0-2** | Explanatory sub-text under the checkbox; the amber warning callout shown when checked |
| **P0-9** | Sub-text under the heading; the send-eligibility banner; the email-type and date-range filter bar |

Two consequences worth knowing:

1. **DES-433's acceptance criteria are now stale.** They still read *"Log is sortable **and
   filterable** by email type and date"*. Sorting is here; filtering was removed by the same
   review. The ACs have deliberately been left untouched for Scott to amend.
2. **[DES-432 · P0-8](https://linear.app/eventpipe/issue/DES-432) is no longer surfaced here —
   or anywhere.** Its two surfaces on this screen (the read-only *Communications status* block
   under the checkbox, and the banner on the log tab) went with this trim. Its remaining
   surfaces on Event Registration Settings and Notification Preferences were then removed
   separately on 2026-08-07, because **P0-8 was never asked to be mocked**. It is engine
   rules, and has no design in this folder by request.

> **The P0-9 open question — activity log vs. communications log — is resolved in this mock as a
> dedicated communications log.** A general team activity log would mix email sends with
> reservation, compliance and note edits, and the columns that make this table useful
> (*Recipients*, *Status*) are meaningless for those other event types. The value being asked for
> is "prove this team was emailed, and that it arrived", which is a communications question. The
> \`Notes\` block below remains the closest existing pattern for a broader activity feed if one is
> wanted later — the two can coexist.
` } } },
}

const CARD = 'margin-bottom:20px;'
const CARD_BODY = 'padding:26px 30px;'
const H2 = 'font-size:1.0625rem; font-weight:700; color:var(--ds-color-text); margin-bottom:16px;'
const CAPTION = 'font-size:0.8125rem; color:var(--ds-color-text-subtle);'
const FIELD_W = 'max-width:400px;'

/** Calculated-vs-Override triple used by Goals & Restrictions. */
const overrideRow = (label, calculated, control) => `
  <div style="margin-bottom:14px;">
    <div style="${CAPTION} margin-bottom:6px;">${label}</div>
    <div style="display:grid; grid-template-columns:140px 1fr; gap:16px; align-items:center; max-width:420px;">
      <div>
        <div style="${CAPTION} margin-bottom:4px;">Calculated</div>
        <div style="font-size:0.9375rem;">${calculated}</div>
      </div>
      <div>
        <div style="${CAPTION} margin-bottom:4px;">Override</div>
        ${control}
      </div>
    </div>
  </div>`

/** DES-426 · P0-2 — team-level opt out of ALL Teams Management email.
 *  A bare checkbox, and nothing else. The first pass wrapped it in explanatory
 *  sub-text, a warning callout on the checked state and a read-only send-status
 *  panel; review called all of that bloat, so the affordance now carries its own
 *  meaning through its label alone.
 *
 *  Its own card, built exactly like Compliance Credits below — same q-card flat
 *  bordered shell, same CARD_BODY padding, same H2 heading, one control under
 *  it. It sat inside Goals & Restrictions at first, but that card is a form of
 *  compliance overrides and org fields, and a comms opt-out is neither.
 *
 *  Header is "Communications", not "Teams Management Communications": next to
 *  Goals & Restrictions and Compliance Credits the short form reads better, and
 *  the checkbox label right beneath it already carries the full product name —
 *  which is the string that has to be unambiguous, not the header.
 *  Unchecked by default — every team is opted IN unless someone opts it out. */
const commsOptOutCard = `
  <q-card flat bordered style="${CARD}">
    <q-card-section style="${CARD_BODY}">
      <div style="${H2}">Communications</div>
      <q-checkbox v-model="commsOptOut" color="primary" dense
        label="Opt out of Teams Management communications" />
    </q-card-section>
  </q-card>`

const goalsAndRestrictions = `
  <q-card flat bordered style="${CARD}">
    <q-card-section style="${CARD_BODY}">
      <div class="row items-start q-mb-md">
        <div style="${H2} margin-bottom:0;">Goals &amp; Restrictions</div>
        <q-space />
        <div class="row q-gutter-sm">
          <q-btn outline no-caps color="grey-8" label="Cancel" />
          <q-btn unelevated no-caps color="primary" label="Save Changes" />
        </div>
      </div>

      ${overrideRow('Compliance Status', TEAM.complianceStatus,
        `<div style="max-width:150px;"><ds-select v-model="statusOverride" :options="['No Override','Compliant','Non-Compliant','Exempt','Local','Not Coming']" /></div>`)}
      ${overrideRow('Compliance Goal', TEAM.complianceGoal,
        `<div style="max-width:70px;"><q-input v-model="goalOverride" outlined dense hide-bottom-space /></div>`)}
      ${overrideRow('Room Block Restrictions', TEAM.roomBlockRestrictions,
        `<div style="max-width:70px;"><q-input v-model="blockOverride" outlined dense hide-bottom-space /></div>`)}

      <div style="${H2} margin:26px 0 16px;">Team / Org Information</div>
      <div style="${FIELD_W}">
        <div v-for="f in teamFields" :key="f.label" style="margin-bottom:14px;">
          <div style="${CAPTION} margin-bottom:6px;">{{ f.label }}</div>
          <q-input v-model="f.value" outlined dense hide-bottom-space :readonly="f.locked">
            <template v-if="f.locked" #append><q-icon name="lock" size="18px" color="grey-7" /></template>
          </q-input>
        </div>
        <div style="margin-bottom:14px;">
          <div style="${CAPTION} margin-bottom:6px;">Venue</div>
          <ds-select v-model="venue" :options="venueOptions" />
        </div>
      </div>
    </q-card-section>
  </q-card>`

const complianceCredits = `
  <q-card flat bordered style="${CARD}">
    <q-card-section style="${CARD_BODY}">
      <div style="${H2}">Compliance Credits</div>
      <q-btn outline no-caps color="primary" label="+ Add New Compliance Credit" />
    </q-card-section>
  </q-card>`

const notes = `
  <q-card flat bordered style="${CARD}">
    <q-card-section style="${CARD_BODY}">
      <div style="${H2}">Notes</div>
      <div style="display:grid; grid-template-columns:260px 1fr; border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-md); overflow:hidden; min-height:260px;">
        <div style="border-right:1px solid var(--ds-color-border-container); background:var(--ds-color-surface-sunken);">
          <div v-for="(n, i) in noteList" :key="i"
            @click="activeNote = i"
            :style="'padding:12px 14px; cursor:pointer; ' + (activeNote === i ? 'background:var(--ds-color-surface-sunken);' : 'background:var(--ds-color-surface);')">
            <div style="font-weight:700; font-size:0.9375rem;">{{ n.title }}</div>
            <div style="${CAPTION} margin:2px 0 6px;"><q-icon name="event" size="13px" class="q-mr-xs" />Added On: {{ n.added }}</div>
            <div style="font-size:0.875rem;">{{ n.body }}</div>
          </div>
        </div>
        <div style="padding:16px 18px; background:var(--ds-color-surface);">
          <div class="row items-start">
            <div>
              <div style="font-weight:700; font-size:0.9375rem;">{{ noteList[activeNote].title }}</div>
              <div style="${CAPTION} margin-top:2px;"><q-icon name="event" size="13px" class="q-mr-xs" />Added on: {{ noteList[activeNote].added }} by {{ noteList[activeNote].author }}</div>
            </div>
            <q-space />
            <q-btn flat dense round icon="delete" color="negative" size="sm" />
          </div>
          <div style="margin-top:18px;">{{ noteList[activeNote].body }}</div>
        </div>
      </div>
      <q-btn outline no-caps color="primary" label="+ Add New Note" class="q-mt-md" />
    </q-card-section>
  </q-card>`

/* ---------------------------------------------------------------------------
 * DES-433 · P0-9 — Communications Log tab.
 * Read-only record of every automated Teams Management email sent to this team.
 *
 * A plain table and nothing else. The first pass also carried explanatory
 * sub-text, a send-eligibility banner and a type + date-range filter bar; review
 * cut all three as bloat, leaving sortable column headers as the only control.
 */

/** COMMS_LOG rows carry a sortable ISO date and a stable key.
 *  Keyed on the index, not on `sent` or `type` — both repeat across rows. */
const LOG_ROWS = COMMS_LOG.map((r, i) => {
  const [mm, dd, yyyy] = r.sent.split(' ')[0].split('/')
  return { ...r, key: 'log-' + i, iso: `${yyyy}-${mm}-${dd}` }
})

const LOG_COLUMNS = [
  {
    name: 'sent', label: 'Sent', field: 'sent', align: 'left', sortable: true,
    // Sort on the parsed date, not the display string — "08/03" would otherwise
    // sort above "07/27" only by accident and break across a year boundary.
    sort: (a, b, rowA, rowB) => rowA.iso.localeCompare(rowB.iso),
  },
  { name: 'type', label: 'Email Type', field: 'type', align: 'left', sortable: true },
  {
    name: 'recipients', label: 'Recipients', align: 'left', sortable: true,
    field: (row) => row.recipients.join(', '),
  },
  { name: 'status', label: 'Status', field: 'status', align: 'left', sortable: true },
]

const commsLog = `
  <q-card flat bordered style="${CARD}">
    <q-card-section style="${CARD_BODY}">
      <div style="${H2}">Communications Log</div>

      <q-table class="ds-table" :rows="logRows" :columns="logColumns" row-key="key"
        flat bordered hide-bottom :pagination="{ rowsPerPage: 0 }"
        no-data-label="No communications have been sent to this team yet.">
        <template #body-cell-recipients="props">
          <q-td :props="props">
            <div v-for="(rcp, ri) in props.row.recipients" :key="ri">{{ rcp }}</div>
          </q-td>
        </template>
        <template #body-cell-status="props">
          <q-td :props="props">
            <q-chip dense :color="logStatusColor[props.value]" text-color="white" :label="props.value" />
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>`

const body = `
  <div style="padding:20px 28px 56px; background:var(--ds-color-surface-sunken); min-height:100%;">
    <q-card flat bordered style="${CARD}">
      <q-card-section style="padding:22px 30px 0;">
        <div style="font-size:1.375rem; font-weight:700; color:var(--ds-color-text);">{{ team.name }}</div>
        <div style="margin:6px 0 4px; font-size:0.9375rem;">
          <span style="color:var(--ds-color-text-subtle);">Event Name:</span>
          <strong class="q-ml-xs">{{ team.event }}</strong>
        </div>
        <q-tabs v-model="tab" no-caps active-color="primary" indicator-color="primary" align="left"
          class="text-grey-7" style="margin:0 -8px;">
          <q-tab name="details" label="Details / Notes" />
          <q-tab name="blocks" label="Group Blocks / Reservations" />
          <q-tab name="comms" label="Communications Log" />
        </q-tabs>
      </q-card-section>
    </q-card>

    <div v-show="tab === 'details'">
      ${goalsAndRestrictions}
      ${commsOptOutCard}
      ${complianceCredits}
      ${notes}
    </div>

    <div v-show="tab === 'blocks'">
      <q-card flat bordered><q-card-section style="${CARD_BODY}">
        <div style="${CAPTION}">Group Blocks / Reservations for this team.</div>
      </q-card-section></q-card>
    </div>

    <div v-show="tab === 'comms'">
      ${commsLog}
    </div>
  </div>`

export const DetailsNotes = tmc2Page({
  active: 'compliance',
  components: { DsInput, DsSelect },
  setup: () => {
    return {
      tab: ref('details'),
      team: { name: TEAM.name, event: EVENT.name },
      statusOverride: ref('No Override'),
      goalOverride: ref(''),
      blockOverride: ref(''),
      venue: ref(TEAM.venue),
      teamFields: ref([
        { label: 'Team Name', value: TEAM.name, locked: true },
        { label: 'Organization Name', value: TEAM.org },
        { label: 'Team/Org ID', value: TEAM.id },
        { label: 'Contact Name', value: TEAM.contactName, locked: true },
        { label: 'Contact Email', value: TEAM.contactEmail },
        { label: 'Contact Phone', value: TEAM.contactPhone },
        { label: 'Team Address', value: TEAM.address },
        { label: 'Team City', value: TEAM.city },
        { label: 'Team State/Province', value: TEAM.state },
        { label: 'Team Zip/Postal Code', value: TEAM.zip },
        { label: '# of Team Participants', value: TEAM.participants },
        { label: '# of Teams', value: TEAM.teams },
      ]),
      venueOptions: [TEAM.venue, 'STAR Soccer Complex', 'Blossom Athletic Center'],
      activeNote: ref(0),
      noteList: [
        { title: 'sfasdf', added: 'Wed, 08/05/2026', author: 'Scott V', body: 'asdfasd' },
      ],
      // DES-426 · P0-2 — off by default: every team is opted in to comms.
      commsOptOut: ref(false),
      logRows: LOG_ROWS,
      logColumns: LOG_COLUMNS,
      logStatusColor: LOG_STATUS_COLOR,
    }
  },
  slot: body,
})
DetailsNotes.parameters = { layout: 'fullscreen' }
