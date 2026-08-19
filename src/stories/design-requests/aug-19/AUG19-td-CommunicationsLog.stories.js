/** Components / Team Detail / Communications Log.
 *
 *  NEW IN PHASE 2 — DES-433 · P0-9. There was no per-team record of what had been
 *  sent; the team page had Details / Notes and Group Blocks only.
 */
import { COMMS_LOG, LOG_STATUS_COLOR } from './_aug19fixtures'

export default {
  title: 'Design Requests/Aug 19/Components/Team Detail/Communications Log',
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: `
**New in Phase 2** — [DES-433 · P0-9](https://linear.app/eventpipe/issue/DES-433).

A third tab on the team page: a heading and a table. Every automated Teams
Management email sent to this team, with *Sent*, *Email Type*, *Recipients* and
*Status*.

**View-only.** No resend, no row actions, no edit. It is a record, not a console
— a resend affordance here would need its own audit and permission story.

**Sortable headers are the only control.** The first pass also had explanatory
sub-text, a send-eligibility banner and a filter bar for email type and date
range. Review kept the table and cut everything else: *"Should be a simple log
with sortable headers, that's it."*

### Two details worth knowing

**Recipients get their own column**, one address per line, never merged into
another. Proving *who* was emailed is half the reason the log exists.

***Sent* sorts on a parsed date**, not the display string, so ordering stays
correct across a year boundary. Sorting "08/03" against "07/27" as text only
works by accident.

### Open question answered

The ticket asks whether this should be a general team activity log or a dedicated
communications log. This goes **dedicated**: a general feed would mix in
reservation and note events for which *Recipients* and *Status* are meaningless,
and the driving use case — "prove this team was emailed, and that it arrived" —
is a communications question.

### The acceptance criteria are stale

DES-433 still reads *"Log is sortable **and filterable** by email type and date"*.
Filtering was built to that AC and then removed by the same review. The ACs have
deliberately been left for Scott to amend.

### One thing lost with the banner

The empty state no longer distinguishes *nothing sent yet* from *team is opted
out* — it reads "No communications have been sent to this team yet" in both
cases.
` } } },
}

const LOG_ROWS = COMMS_LOG.map((r, i) => {
  const [mm, dd, yyyy] = r.sent.split(' ')[0].split('/')
  return { ...r, key: 'log-' + i, iso: `${yyyy}-${mm}-${dd}` }
})

const LOG_COLUMNS = [
  {
    name: 'sent', label: 'Sent', field: 'sent', align: 'left', sortable: true,
    sort: (a, b, rowA, rowB) => rowA.iso.localeCompare(rowB.iso),
  },
  { name: 'type', label: 'Email Type', field: 'type', align: 'left', sortable: true },
  {
    name: 'recipients', label: 'Recipients', align: 'left', sortable: true,
    field: (row) => row.recipients.join(', '),
  },
  { name: 'status', label: 'Status', field: 'status', align: 'left', sortable: true },
]

const H2 = 'font-size:1.0625rem; font-weight:700; color:var(--ds-color-text); margin-bottom:16px;'

const log = (rows) => ({
  setup: () => ({ logRows: rows, logColumns: LOG_COLUMNS, logStatusColor: LOG_STATUS_COLOR }),
  template: `
    <q-card flat bordered style="max-width:900px;">
      <q-card-section style="padding:26px 30px;">
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
    </q-card>`,
})

/** The populated record. Click any header to sort. Note the multi-recipient rows
 *  and the Bounced status — both are states the log has to make visible. */
export const Populated = { render: () => log(LOG_ROWS) }

/** A team that has not been emailed yet. This is also what an opted-out team
 *  shows, which the removed banner used to distinguish. */
export const Empty = { render: () => log([]) }
