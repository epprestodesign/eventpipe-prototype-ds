/** Teams Mgmt Comms Phase 2 / Screens / Team Detail.
 *  Rebuilt from the production capture in references/080626 (Compliance → team
 *  drill-in, "Details / Notes" tab). This is the screen P0-2 (Team-Level
 *  Communications Opt Out) and P0-9 (Communication Log) land on — both are now
 *  designed here on top of that production baseline. */
import { computed, ref } from 'vue'
import { tmc2Page } from './_tmc2shell'
import { COMMS_LOG, EVENT, LOG_STATUS_COLOR, TEAM, TEAM_SEND_STATE } from './_tmc2fixtures'
import DsInput from './components/DsInput.vue'
import DsSelect from './components/DsSelect.vue'

export default {
  title: 'Design Requests/Teams Mgmt Comms Phase 2/Screens/Team Detail',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: `
The team drill-in from **Compliance**, rebuilt from production
(\`references/080626\`).

Three Phase 2 requirements land here, and **all are now designed**:

- **[DES-426 · P0-2](https://linear.app/eventpipe/issue/DES-426)** — Team-Level Communications Opt Out.
  A checkbox at the bottom of **Goals & Restrictions**, below the override rows. Every team is
  opted *in* by default, so the box ships unchecked. Checking it suppresses **all** automated
  Teams Management email for this team — welcome, compliance reminders, previously-compliant
  notices — and surfaces an inline warning so the consequence is not silent.
- **[DES-433 · P0-9](https://linear.app/eventpipe/issue/DES-433)** — Communication Log.
  A third tab, **Communications Log**, holding a read-only table of every automated Teams
  Management email sent to this team: *Sent*, *Email Type*, *Recipients* (one address per line)
  and *Status*. Sortable on every column, filterable by email type and by date range.
- **[DES-432 · P0-8](https://linear.app/eventpipe/issue/DES-432)** — Team-Level Send Eligibility,
  surfaced here in **two** places. A read-only **Communications status** block under the opt-out
  checkbox in *Goals & Restrictions* (is this team receiving comms, and if not, why — opted out,
  or a compliance status no template targets — plus the one-time send flags and what the team is
  eligible for), and the same summary as a compact banner at the top of the **Communications Log**
  tab.

  The one-time send flags (*Welcome Email sent — 06/12/2026*, *Previously Compliant Notice*) are
  **read-only engine state**: they are reported, never reset. There is no button, checkbox or
  resend on them, because clearing a one-time flag re-sends real email and would need its own
  permission and audit story.

  **No forecasting is shown** — no predicted next-send date, no count of upcoming sends. Both
  places state *current* eligibility only ("Eligible for: Compliance Reminder"), never "Next send:
  Monday". Forecasting is
  **[DES-437](https://linear.app/eventpipe/issue/DES-437)** and is out of scope here.

The log is deliberately **view-only** — no resend, no row actions, no edit. It is a record, not
a console; a resend affordance here would need its own audit and permission story.

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

/** DES-432 · P0-8 — team-level send eligibility, read-only.
 *  Sits directly under the opt-out checkbox because it is the answer to the
 *  question the checkbox raises ("so is this team getting email or not?").
 *  Everything in here is ENGINE STATE: the one-time send flags are reported,
 *  never reset — no buttons, no checkboxes, no resend. Deliberately says
 *  nothing about WHEN the next email goes out; forecasting is DES-437. */
const sendEligibilityBlock = `
  <div style="margin:16px 0 0 30px; padding:14px 16px; max-width:560px;
              border:1px solid var(--ds-color-border-container);
              border-radius:var(--ds-radius-md); background:var(--ds-color-surface-sunken);">
    <div class="row items-center" style="margin-bottom:10px;">
      <div style="font-size:0.875rem; font-weight:700; color:var(--ds-color-text);">Communications status</div>
      <q-space />
      <div style="${CAPTION} font-size:0.75rem;">Read-only</div>
    </div>

    <div v-if="commsReceiving"
      style="padding:9px 12px; border-radius:var(--ds-radius-md); font-size:0.8125rem;
             background:var(--ds-color-background-success);
             border:1px solid var(--ds-color-background-success-bold);
             color:var(--ds-color-text-success);">
      <q-icon name="check_circle" size="16px" class="q-mr-xs" style="vertical-align:-3px;" />
      <strong>Receiving Teams Management communications.</strong>
      Compliance status is {{ sendState.complianceStatus }}.
    </div>
    <div v-else
      style="padding:9px 12px; border-radius:var(--ds-radius-md); font-size:0.8125rem;
             background:var(--ds-color-background-warning);
             border:1px solid var(--ds-color-background-warning-bold);
             color:var(--ds-color-text-warning);">
      <q-icon name="pause_circle" size="16px" class="q-mr-xs" style="vertical-align:-3px;" />
      <strong>Not receiving Teams Management communications.</strong>
      {{ commsBlockedReason }}
    </div>

    <div style="${CAPTION} font-size:0.75rem; margin:14px 0 6px; text-transform:uppercase; letter-spacing:0.04em;">
      One-time sends
    </div>
    <div v-for="f in sendFlags" :key="f.key" style="display:flex; gap:8px; margin-bottom:8px;">
      <q-icon :name="f.sent ? 'check_circle' : 'radio_button_unchecked'" size="15px"
        :color="f.sent ? 'positive' : 'grey-6'" style="margin-top:2px;" />
      <div>
        <div style="font-size:0.8125rem; color:var(--ds-color-text);">
          <span>{{ f.label }}</span>
          <span v-if="f.sent"> &mdash; {{ f.when }}</span>
          <span v-else> &mdash; not sent</span>
        </div>
        <div style="${CAPTION} font-size:0.75rem;">{{ f.note }}</div>
      </div>
    </div>

    <div style="font-size:0.8125rem; margin-top:12px;">
      <span style="color:var(--ds-color-text-subtle);">Currently eligible for:</span>
      <strong v-if="commsReceiving && sendState.eligibleFor.length" class="q-ml-xs">{{ sendState.eligibleFor.join(', ') }}</strong>
      <strong v-else class="q-ml-xs">Nothing</strong>
    </div>
    <div style="${CAPTION} font-size:0.75rem; margin-top:8px;">
      Reported by the send engine &mdash; these flags cannot be changed or reset from this screen.
    </div>
  </div>`

/** DES-426 · P0-2 — team-level opt out of ALL Teams Management email.
 *  A checkbox, not a toggle: it sits in a card of q-inputs and selects that is
 *  saved with an explicit "Save Changes", and a checkbox reads as a form value
 *  being edited rather than a switch that takes effect on click. It also matches
 *  the send-checkbox used everywhere else in this folder (see SendEmailControl).
 *  Unchecked by default — every team is opted IN unless someone opts it out. */
const commsOptOutField = `
  <div style="margin-top:22px; padding-top:18px; border-top:1px solid var(--ds-color-border-container); max-width:560px;">
    <q-checkbox v-model="commsOptOut" color="primary" dense
      label="Opt out of Teams Management communications" />
    <div style="${CAPTION} margin:6px 0 0 30px;">
      When on, this team receives <strong>none</strong> of the automated Teams Management
      emails &mdash; welcome, compliance reminders and previously-compliant notices.
      Off by default: every team is opted in.
    </div>
    <div v-if="commsOptOut"
      style="margin:12px 0 0 30px; padding:10px 14px; border-radius:var(--ds-radius-md);
             background:var(--ds-color-background-warning);
             border:1px solid var(--ds-color-background-warning-bold);
             color:var(--ds-color-text-warning); font-size:0.8125rem;">
      <q-icon name="warning" size="16px" class="q-mr-xs" style="vertical-align:-3px;" />
      No automated Teams Management email will be sent to this team while this is on,
      including compliance reminders before the cutoff date.
    </div>
    ${sendEligibilityBlock}
  </div>`

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

      ${commsOptOutField}

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
 */

/** COMMS_LOG rows carry a sortable/filterable ISO date and a stable key.
 *  Keyed on the index, not on `sent` or `type` — both repeat across rows. */
const LOG_ROWS = COMMS_LOG.map((r, i) => {
  const [mm, dd, yyyy] = r.sent.split(' ')[0].split('/')
  return { ...r, key: 'log-' + i, iso: `${yyyy}-${mm}-${dd}` }
})

const LOG_TYPE_OPTIONS = ['All email types', ...new Set(LOG_ROWS.map((r) => r.type))]

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
      <div style="${H2} margin-bottom:8px;">Communications Log</div>
      <div style="${CAPTION} max-width:760px;">
        A read-only record of every automated Teams Management email sent to this team.
        Nothing here can be edited or resent &mdash; it exists so you can confirm what was
        sent, to whom, and whether it arrived.
      </div>

      <!-- DES-432 - P0-8: current send eligibility, stated as CURRENT STATE only.
           No next-send date and no upcoming-send count: forecasting is DES-437. -->
      <div v-if="commsReceiving"
        style="margin-top:14px; padding:10px 14px; border-radius:var(--ds-radius-md);
               background:var(--ds-color-background-success);
               border:1px solid var(--ds-color-background-success-bold);
               color:var(--ds-color-text-success); font-size:0.8125rem; max-width:760px;">
        <q-icon name="check_circle" size="16px" class="q-mr-xs" style="vertical-align:-3px;" />
        <strong>Currently receiving Teams Management communications.</strong>
        Compliance status is {{ sendState.complianceStatus }}.
        <span v-if="sendState.eligibleFor.length">Eligible for: {{ sendState.eligibleFor.join(', ') }}.</span>
      </div>
      <div v-else
        style="margin-top:14px; padding:10px 14px; border-radius:var(--ds-radius-md);
               background:var(--ds-color-background-warning);
               border:1px solid var(--ds-color-background-warning-bold);
               color:var(--ds-color-text-warning); font-size:0.8125rem; max-width:760px;">
        <q-icon name="pause_circle" size="16px" class="q-mr-xs" style="vertical-align:-3px;" />
        <strong>Not currently receiving Teams Management communications.</strong>
        {{ commsBlockedReason }} Nothing new will be added to this log until that changes.
      </div>

      <div class="row items-center q-gutter-md q-mt-md q-mb-sm">
        <div style="min-width:230px;">
          <ds-select v-model="logType" :options="logTypeOptions" />
        </div>
        <q-input v-model="logFrom" type="date" outlined dense hide-bottom-space
          label="From" stack-label style="min-width:170px;" />
        <q-input v-model="logTo" type="date" outlined dense hide-bottom-space
          label="To" stack-label style="min-width:170px;" />
        <q-btn flat no-caps dense color="primary" label="Clear filters" @click="clearLogFilters" />
      </div>

      <q-table class="ds-table" :rows="logRows" :columns="logColumns" row-key="key"
        flat bordered hide-bottom :pagination="{ rowsPerPage: 0 }"
        no-data-label="No communications match these filters.">
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
    // DES-426 · P0-2 — off by default: every team is opted in to comms.
    const commsOptOut = ref(false)
    // DES-432 · P0-8 — is this team receiving comms right now, and if not, why.
    // Two blockers only: the opt-out above (live, hence the computed), and a
    // compliance status no template targets. No next-send date is derived here
    // on purpose — forecasting belongs to DES-437.
    const commsReceiving = computed(() => !commsOptOut.value && TEAM_SEND_STATE.eligible)
    const commsBlockedReason = computed(() => {
      if (commsOptOut.value) {
        return 'Communications are paused: this team is opted out of Teams Management email in '
          + 'Goals & Restrictions, so no automated emails will send.'
      }
      return TEAM_SEND_STATE.reason
        || 'Its compliance status (' + TEAM_SEND_STATE.complianceStatus + ') is outside the '
          + 'statuses any active template targets.'
    })
    // DES-433 · P0-9 — log filters. Sorting is q-table's own (every column
    // sortable, Sent sorted on the parsed ISO date); filtering by type and by
    // date range is done here rather than through q-table's single `filter`
    // string, which cannot express two independent controls.
    const logType = ref(LOG_TYPE_OPTIONS[0])
    const logFrom = ref('')
    const logTo = ref('')
    const logRows = computed(() => LOG_ROWS.filter((r) => (
      (logType.value === LOG_TYPE_OPTIONS[0] || r.type === logType.value)
      && (!logFrom.value || r.iso >= logFrom.value)
      && (!logTo.value || r.iso <= logTo.value)
    )))
    const clearLogFilters = () => {
      logType.value = LOG_TYPE_OPTIONS[0]
      logFrom.value = ''
      logTo.value = ''
    }

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
      commsOptOut,
      commsReceiving,
      commsBlockedReason,
      sendState: TEAM_SEND_STATE,
      sendFlags: TEAM_SEND_STATE.flags,
      logType,
      logFrom,
      logTo,
      logRows,
      clearLogFilters,
      logTypeOptions: LOG_TYPE_OPTIONS,
      logColumns: LOG_COLUMNS,
      logStatusColor: LOG_STATUS_COLOR,
    }
  },
  slot: body,
})
DetailsNotes.parameters = { layout: 'fullscreen' }
