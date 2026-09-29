/** EP Pay / Screens / 08 · Unbuilt Areas / Invoicing — CONCEPT.
 *
 *  Illustrative concept with invented scope: no requirements exist for this
 *  area (checked Linear 2026-09-29). Built only from EP Pay patterns that
 *  already exist — the Transactions list, the shared header/card scaffold,
 *  `q-table.ds-table` for line items, `DsInfoGrid` for record metadata.
 *
 *  Design decisions worth a second opinion:
 *
 *  1. An EP Pay invoice is Team Travel Source billing ITS customer (a guest or
 *     a group contact) for rooms and extras, paid by card through EP Pay. It is
 *     NOT the platform's existing room-by-room hotel invoicing, which stays
 *     where it is — the empty state and the docs both say so, because the name
 *     collision is the first thing a reviewer will trip on.
 *
 *  2. Line items come from two places only: a reservation (room nights at the
 *     room-block rate, pulled from EventPipe) or a saved Product. Free-typed
 *     lines are allowed but secondary. That keeps rates single-sourced.
 *
 *  3. Create is a full page, not a DsModal or DsSidePanel. An invoice is a
 *     document with an editable table of line items; the other concepts' dialogs
 *     are five-field forms. The page keeps the shell, the header card and the
 *     card stack, and puts the running total in a right-hand card — the same
 *     "the consequence stays visible" idea as the Subscriptions schedule.
 *
 *  4. A paid invoice points at its ledger transaction: INV-2026-0406 was paid
 *     by TXN-2026-16006, the $1,359.00 Elena Fischer row at the top of
 *     Transactions. Invoicing is a way INTO the ledger, not a second one.
 */
import { ref, computed } from 'vue'
import { epPage, epCard, EP_CAPTION, EP_H2, EP_PAGE } from './_eppay'
import {
  conceptHeader, conceptDocs, filterTiles, listToolbar, pager, rowMenu, conceptChip,
  EDIT_COLUMNS_HEADER, ACTIONS_COL, TD, MICRO, EVENTS, customerNames,
} from './_eppay-concepts'
import DsSearch from '../../components/DsSearch.vue'
import DsStat from '../../components/DsStat.vue'
import DsInput from '../../components/DsInput.vue'
import DsSelect from '../../components/DsSelect.vue'
import DsInfoGrid from '../../components/DsInfoGrid.vue'
import DsEmptyState from '../../components/DsEmptyState.vue'

export default {
  title: 'EP Pay/Screens/08 · Unbuilt Areas/Invoicing',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: conceptDocs({
          area: 'Invoicing',
          summary: 'Invoices Team Travel Source sends its own customers — a group\'s room block, a guest\'s extras — with line items drawn from reservations and saved Products, paid by card through EventPipe Pay.',
          patterns: 'Transactions (five filter tiles, toolbar, `q-table.ds-table`, two-line cells, pagination), `epHeader` / `epCard`, `DsInfoGrid`, the Balances summary-row styling for the totals.',
          questions: [
            ['How does this relate to the platform\'s existing room-by-room hotel invoicing?',
              'it is separate. That flow is between the platform, housing company and hotel; this one is the housing company billing its own customer and getting paid through EP Pay. The two are not linked in this concept — whether they should be (e.g. one reconciles against the other) is the most important question here.'],
            ['Who is billed — an individual or an organisation?',
              'a Customer (see the Customers concept), who may be a group contact paying for several reservations on one invoice.'],
            ['Where do line items come from?',
              'reservations (room nights × the room-block rate, pulled from EventPipe, not editable) and Products (editable quantity). Free-text lines are allowed for anything else.'],
            ['How does the customer pay?',
              'the invoice email carries a payment link; payment by card or wallet lands in Transactions against the invoice\'s event. Partial payments are allowed and shown as "$x due".'],
            ['Tax, credit notes, numbering rules?',
              'not handled. Nothing in built EP Pay shows tax, and numbering is shown as a simple INV-YYYY-#### sequence.'],
          ],
          left: 'the customer-facing invoice page/PDF, tax, credit notes, recurring invoices (see Subscriptions), reminders schedule settings.',
        }),
      },
    },
  },
}

/* ---------------------------------------------------------------------------
 * Fixtures. Paid invoices point at real ledger rows (TXN-2026-16006, -15967,
 * -15954); open ones point at new reservation numbers.
 * ------------------------------------------------------------------------- */

const INVOICES = [
  { id: 'INV-2026-0412', status: 'Open', due: 'Due Sep 30, 2026', total: '$3,722.00', owed: '$3,722.00 due', who: 'Marcus Webb', email: 'marcus.webb@example.com', event: 'Pricing Event 637236', sub: 'Omni Tempe Hotel at ASU · 4 reservations' },
  { id: 'INV-2026-0411', status: 'Past Due', due: 'Was due Sep 15, 2026', total: '$1,608.00', owed: '$1,608.00 due', who: 'Jordan Alvarez', email: 'jordan.alvarez@example.com', event: 'Automated Playwright Live Event 340366', sub: 'Hyatt Regency Seattle RES-5390087' },
  { id: 'INV-2026-0409', status: 'Draft', due: 'Not sent', total: '$6,120.00', owed: 'Draft', who: 'Hannah Reyes', email: 'hannah.reyes@example.com', event: 'Pricing Event 539073', sub: 'Marriott Tempe at The Buttes · 6 reservations' },
  { id: 'INV-2026-0401', status: 'Open', due: 'Due Sep 30, 2026', total: '$3,892.00', owed: '$1,946.00 due', who: 'Marcus Webb', email: 'marcus.webb@example.com', event: 'Pricing Event 637236', sub: 'Omni Tempe Hotel at ASU RES-5375166' },
  { id: 'INV-2026-0406', status: 'Paid', due: 'Paid Aug 20, 2026', total: '$1,359.00', owed: 'TXN-2026-16006', who: 'Elena Fischer', email: 'elena.fischer@example.com', event: 'Automated Playwright Live Event 340366', sub: 'Hyatt Regency Seattle RES-5381879' },
  { id: 'INV-2026-0403', status: 'Paid', due: 'Paid Aug 19, 2026', total: '$2,575.00', owed: 'TXN-2026-15967', who: 'Hannah Reyes', email: 'hannah.reyes@example.com', event: 'Pricing Event 539073', sub: 'Marriott Tempe at The Buttes RES-5377495' },
  { id: 'INV-2026-0398', status: 'Void', due: 'Voided Aug 21, 2026', total: '$730.00', owed: 'Not collected', who: 'Noah Klein', email: 'noah.klein@example.com', event: 'Pricing Event 539073', sub: 'Marriott Tempe at The Buttes RES-5384467' },
]

const FILTERS = [
  { key: 'all', label: 'All', count: 107, total: '$212,480.00 invoiced', pages: 11, match: null },
  { key: 'draft', label: 'Draft', count: 4, total: '$14,930.00', pages: 1, match: (i) => i.status === 'Draft' },
  { key: 'open', label: 'Open', count: 12, total: '$28,406.00 due', pages: 2, match: (i) => i.status === 'Open' },
  { key: 'pastdue', label: 'Past Due', count: 3, total: '$4,117.00 due', pages: 1, match: (i) => i.status === 'Past Due' },
  { key: 'paid', label: 'Paid', count: 86, total: '$163,297.00 collected', pages: 9, match: (i) => i.status === 'Paid' },
]

const COLUMNS = [
  { name: 'status', label: 'Status & Due', field: 'status', align: 'left' },
  { name: 'amount', label: 'Amount', field: 'total', align: 'left' },
  { name: 'customer', label: 'Customer', field: 'who', align: 'left' },
  { name: 'details', label: 'Invoice & Details', field: 'id', align: 'left' },
  ACTIONS_COL,
]

/** INV-2026-0412's lines: four room-block reservations at the Omni, then
 *  three saved Products from the Products concept. */
const LINES = [
  { key: 'r1', kind: 'Reservation', desc: 'RES-5409921 · King · 3 nights', qty: 3, rate: 219, locked: true },
  { key: 'r2', kind: 'Reservation', desc: 'RES-5409922 · King · 3 nights', qty: 3, rate: 219, locked: true },
  { key: 'r3', kind: 'Reservation', desc: 'RES-5409923 · Double Queen · 3 nights', qty: 3, rate: 219, locked: true },
  { key: 'r4', kind: 'Reservation', desc: 'RES-5409924 · Double Queen · 4 nights', qty: 4, rate: 219, locked: true },
  { key: 'p1', kind: 'Product', desc: 'Resort fee · per night', qty: 13, rate: 35, locked: false },
  { key: 'p2', kind: 'Product', desc: 'Airport shuttle · per person', qty: 8, rate: 40, locked: false },
  { key: 'p3', kind: 'Product', desc: 'Housing service fee · per reservation', qty: 4, rate: 25, locked: false },
]
const LINE_COLUMNS = [
  { name: 'desc', label: 'Item', field: 'desc', align: 'left' },
  { name: 'qty', label: 'Qty', field: 'qty', align: 'left' },
  { name: 'rate', label: 'Unit price', field: 'rate', align: 'left' },
  { name: 'amount', label: 'Amount', field: (r) => r.qty * r.rate, align: 'right' },
]
const EDIT_COLUMNS = [...LINE_COLUMNS, { name: 'remove', label: '', field: () => '', align: 'right', style: 'width:56px;', headerStyle: 'width:56px;' }]

const money = (n) => (Number(n) || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })

/* ---------------------------------------------------------------------------
 * List
 * ------------------------------------------------------------------------- */

const CREATE_BTN = `<q-btn unelevated no-caps color="primary" icon="add" label="Create Invoice"
  style="padding:0 20px; font-weight:700;" />`

const table = `
  <q-table class="ds-table" :rows="visible" :columns="columns" row-key="id"
    flat bordered :pagination="{ rowsPerPage: 0 }"
    no-data-label="No invoices on this page match that filter.">
    ${EDIT_COLUMNS_HEADER}

    <template #body-cell-status="props">
      <q-td :props="props" style="${TD}">
        <span :style="chipFor(props.row.status)">{{ props.row.status }}</span>
        <div style="${EP_CAPTION} margin-top:6px;">{{ props.row.due }}</div>
      </q-td>
    </template>

    <template #body-cell-amount="props">
      <q-td :props="props" style="${TD}">
        <div style="font-weight:700;">{{ props.row.total }}</div>
        <div style="${EP_CAPTION} margin-top:2px;">{{ props.row.owed }}</div>
      </q-td>
    </template>

    <template #body-cell-customer="props">
      <q-td :props="props" style="${TD}">
        <div>{{ props.row.who }}</div>
        <div style="${EP_CAPTION} margin-top:2px;">{{ props.row.email }}</div>
      </q-td>
    </template>

    <template #body-cell-details="props">
      <q-td :props="props" style="${TD}">
        <a href="#" class="eppay-link" @click.prevent>{{ props.row.id }}</a>
        <span style="color:var(--ds-color-text);"> · {{ props.row.event }}</span>
        <div style="${EP_CAPTION} margin-top:2px; line-height:1.35;">{{ props.row.sub }}</div>
      </q-td>
    </template>

    ${rowMenu('props.row.id')}
    ${pager('invoices')}
  </q-table>`

const emptyBody = `
  <ds-empty-state icon="description" title="No invoices yet"
    description="Bill a customer for a room block or extras and get paid by card through EventPipe Pay. This is separate from the room-by-room hotel invoicing in EventPipe.">
    <template #action>${CREATE_BTN}</template>
  </ds-empty-state>`

const LIST_SLOT = (empty) => `
  <div style="${EP_PAGE}">
    ${conceptHeader('Invoicing', { actions: CREATE_BTN })}
    ${epCard(empty ? emptyBody : `${filterTiles(5)}${listToolbar('Search invoices, customers or reservations')}${table}`)}
  </div>`

function listState() {
  const active = ref('all')
  const current = computed(() => FILTERS.find((f) => f.key === active.value) || FILTERS[0])
  return {
    filters: FILTERS,
    columns: COLUMNS,
    active,
    current,
    visible: computed(() => (current.value.match ? INVOICES.filter(current.value.match) : INVOICES)),
    query: ref(''),
    chipFor: conceptChip,
  }
}

const COMPONENTS = { DsSearch, DsStat, DsInput, DsSelect, DsInfoGrid, DsEmptyState }

const listStory = (empty = false) => epPage({
  active: 'invoicing',
  components: COMPONENTS,
  setup: listState,
  slot: LIST_SLOT(empty),
})

/* ---------------------------------------------------------------------------
 * Shared: the totals block — Balances' summary-row styling (label left,
 * amount right, rule between rows).
 * ------------------------------------------------------------------------- */

const TOTALS = `
  <div v-for="(t, i) in totals" :key="t.label"
    :style="'display:flex; align-items:baseline; gap:16px; padding:11px 0;' + (i ? ' border-top:1px solid var(--ds-color-border-container);' : '')">
    <span :style="t.strong ? 'font-weight:700; color:var(--ds-color-text);' : 'color:var(--ds-color-text-subtle);'">{{ t.label }}</span>
    <span style="flex:1;" />
    <span :style="'font-weight:700; color:var(--ds-color-text);' + (t.strong ? ' font-size:1.375rem;' : '')">{{ t.value }}</span>
  </div>`

/* ---------------------------------------------------------------------------
 * Detail — INV-2026-0412, open.
 * ------------------------------------------------------------------------- */

const OPEN = INVOICES[0]

const DETAIL_SLOT = `
  <div style="${EP_PAGE}">
    <q-breadcrumbs active-color="primary" gutter="sm" class="text-body2" style="margin-bottom:12px;">
      <q-breadcrumbs-el label="Invoicing" href="#" />
      <q-breadcrumbs-el label="${OPEN.id}" class="text-grey-7" />
    </q-breadcrumbs>

    ${conceptHeader(OPEN.id, {
      actions: `
        <q-btn outline no-caps color="primary" icon="file_download" label="Download PDF" style="padding:0 16px;" />
        <q-btn outline no-caps color="primary" icon="notifications" label="Send Reminder" style="padding:0 16px;" />
        <q-btn flat dense icon="more_vert" aria-label="More invoice actions"
          style="border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-sm); color:var(--ds-color-icon-subtle);" />`,
    })}

    <div style="display:flex; gap:20px; align-items:flex-start;">
      <div style="flex:1; min-width:0;">
        ${epCard(`
          <div style="display:flex; align-items:flex-start; gap:24px; margin-bottom:24px;">
            <div style="flex:1;">
              <div style="${MICRO}">From</div>
              <div style="font-weight:700; color:var(--ds-color-text); margin-top:4px;">Team Travel Source</div>
            </div>
            <div style="flex:1;">
              <div style="${MICRO}">Bill to</div>
              <div style="font-weight:700; color:var(--ds-color-text); margin-top:4px;">${OPEN.who}</div>
              <div style="${EP_CAPTION}">${OPEN.email}</div>
            </div>
            <div style="flex:1;">
              <ds-info-grid :items="meta" label-width="72px" min-col-width="200px" />
            </div>
          </div>

          <div style="${EP_H2}">${OPEN.event} · Omni Tempe Hotel at ASU</div>
          <q-table class="ds-table" :rows="lines" :columns="lineColumns" row-key="key"
            flat bordered hide-bottom :pagination="{ rowsPerPage: 0 }">
            <template #body-cell-desc="props">
              <q-td :props="props" style="${TD}">
                <div>{{ props.row.desc }}</div>
                <div style="${EP_CAPTION} margin-top:2px;">{{ props.row.kind === 'Reservation' ? 'Room block rate' : 'Product' }}</div>
              </q-td>
            </template>
            <template #body-cell-rate="props">
              <q-td :props="props" style="${TD}">{{ money(props.row.rate) }}</q-td>
            </template>
            <template #body-cell-amount="props">
              <q-td :props="props" style="${TD} font-weight:700;">{{ money(props.value) }}</q-td>
            </template>
          </q-table>

          <div style="margin:12px 0 0 auto; max-width:360px;">${TOTALS}</div>`)}
      </div>

      <div style="flex:none; width:340px;">
        ${epCard(`
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:14px;">
            <span :style="chipFor(inv.status)">{{ inv.status }}</span>
            <span style="${EP_CAPTION}">{{ inv.due }}</span>
          </div>
          <ds-stat value="${OPEN.total}" label="Amount due" />
          <div style="${MICRO} margin:20px 0 8px;">Payment link</div>
          <div style="display:flex; align-items:center; gap:6px; padding:8px 12px; background:var(--ds-color-surface-sunken);
                      border:1px solid var(--ds-color-border); border-radius:var(--ds-radius-md);">
            <span style="font-family:ui-monospace, SFMono-Regular, Menlo, monospace; font-size:0.8125rem; flex:1; white-space:nowrap;">pay.eventpipe.com/i/R4XK-0412</span>
            <q-btn flat dense round size="sm" icon="content_copy" color="primary" aria-label="Copy invoice payment link" />
          </div>
          <div style="${EP_CAPTION} margin-top:8px;">Included in the invoice email. Payments show in Transactions against ${OPEN.event}.</div>`)}

        ${epCard(`
          <div style="${EP_H2}">Activity</div>
          <div v-for="(a, i) in activity" :key="i" style="display:flex; gap:12px; padding:8px 0;">
            <q-icon :name="a.icon" size="18px" style="color:var(--ds-color-icon-subtle); margin-top:2px;" />
            <div>
              <div style="color:var(--ds-color-text);">{{ a.text }}</div>
              <div style="${EP_CAPTION}">{{ a.when }}</div>
            </div>
          </div>`)}
      </div>
    </div>
  </div>`

const totalsFor = (lines) => {
  const sum = lines.reduce((n, l) => n + (Number(l.qty) || 0) * (Number(l.rate) || 0), 0)
  return [
    { label: 'Rooms', value: money(lines.filter((l) => l.kind === 'Reservation').reduce((n, l) => n + l.qty * l.rate, 0)) },
    { label: 'Extras', value: money(lines.filter((l) => l.kind !== 'Reservation').reduce((n, l) => n + (Number(l.qty) || 0) * (Number(l.rate) || 0), 0)) },
    { label: 'Total', value: money(sum), strong: true },
  ]
}

function detailState() {
  return {
    inv: OPEN,
    meta: [
      { label: 'Issued', value: 'Sep 22, 2026' },
      { label: 'Due', value: 'Sep 30, 2026' },
      { label: 'Terms', value: 'Net 8' },
    ],
    lines: LINES,
    lineColumns: LINE_COLUMNS,
    totals: totalsFor(LINES),
    money,
    chipFor: conceptChip,
    activity: [
      { icon: 'visibility', text: 'Viewed by Marcus Webb', when: 'Sep 23, 2026 · 8:14 AM' },
      { icon: 'send', text: 'Sent to marcus.webb@example.com', when: 'Sep 22, 2026 · 3:02 PM' },
      { icon: 'edit_note', text: 'Created by Mike Addesa', when: 'Sep 22, 2026 · 2:47 PM' },
    ],
  }
}

/* ---------------------------------------------------------------------------
 * Create — a full page (see decision 3).
 * ------------------------------------------------------------------------- */

const CREATE_SLOT = `
  <div style="${EP_PAGE}">
    <q-breadcrumbs active-color="primary" gutter="sm" class="text-body2" style="margin-bottom:12px;">
      <q-breadcrumbs-el label="Invoicing" href="#" />
      <q-breadcrumbs-el label="New invoice" class="text-grey-7" />
    </q-breadcrumbs>

    ${conceptHeader('New Invoice', {
      actions: `
        <q-btn flat no-caps color="grey-8" label="Cancel" style="padding:0 18px;" />
        <q-btn outline no-caps color="primary" label="Save Draft" style="padding:0 18px;" />`,
    })}

    <div style="display:flex; gap:20px; align-items:flex-start;">
      <div style="flex:1; min-width:0;">
        ${epCard(`
          <div style="${EP_H2}">Bill To</div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
            <ds-select v-model="form.customer" :options="customers" label="Customer" required searchable />
            <ds-select v-model="form.event" :options="events" label="Event" required />
            <ds-input v-model="form.due" label="Due date" type="date" required />
            <ds-input v-model="form.memo" label="Memo" hint="Optional. Printed under the line items." />
          </div>`)}

        ${epCard(`
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:16px;">
            <div style="${EP_H2} margin-bottom:0;">Line Items</div>
            <span style="flex:1;" />
            <q-btn outline no-caps color="primary" icon="hotel" label="Add from Reservation" style="padding:0 16px;" />
            <q-btn outline no-caps color="primary" icon="inventory_2" label="Add Product" style="padding:0 16px;" />
            <q-btn flat no-caps color="primary" icon="add" label="Custom line" style="padding:0 12px;" />
          </div>
          <q-table class="ds-table" :rows="lines" :columns="editColumns" row-key="key"
            flat bordered hide-bottom :pagination="{ rowsPerPage: 0 }">
            <template #body-cell-desc="props">
              <q-td :props="props" style="${TD}">
                <div>{{ props.row.desc }}</div>
                <div style="${EP_CAPTION} margin-top:2px;">
                  <q-icon v-if="props.row.locked" name="lock" size="14px" style="margin-right:4px;" />{{ props.row.locked ? 'From reservation — room block rate' : 'Product' }}
                </div>
              </q-td>
            </template>
            <template #body-cell-qty="props">
              <q-td :props="props" style="${TD} width:110px;">
                <span v-if="props.row.locked">{{ props.row.qty }}</span>
                <ds-input v-else v-model="props.row.qty" type="number" :min="1" style="width:84px;"
                  :aria-label="'Quantity for ' + props.row.desc" />
              </q-td>
            </template>
            <template #body-cell-rate="props">
              <q-td :props="props" style="${TD}">{{ money(props.row.rate) }}</q-td>
            </template>
            <template #body-cell-amount="props">
              <q-td :props="props" style="${TD} font-weight:700;">{{ money(props.row.qty * props.row.rate) }}</q-td>
            </template>
            <template #body-cell-remove="props">
              <q-td :props="props" style="${TD}">
                <q-btn flat dense round icon="close" size="sm" color="grey-7" :aria-label="'Remove ' + props.row.desc" />
              </q-td>
            </template>
          </q-table>`)}
      </div>

      <div style="flex:none; width:340px;">
        ${epCard(`
          <div style="${EP_H2}">Summary</div>
          ${TOTALS}
          <q-btn unelevated no-caps color="primary" label="Review & Send" icon-right="send"
            style="width:100%; margin-top:18px; font-weight:700;" :disable="!canSend" />
          <div style="${EP_CAPTION} margin-top:10px; text-align:center;">
            {{ form.customer || 'The customer' }} gets an email with the invoice and a payment link.
          </div>`)}
      </div>
    </div>
  </div>`

function createState() {
  const lines = ref(LINES.map((l) => ({ ...l })))
  const form = ref({ customer: 'Marcus Webb', event: EVENTS[2], due: '2026-09-30', memo: '' })
  return {
    form,
    lines,
    editColumns: EDIT_COLUMNS,
    customers: customerNames,
    events: EVENTS,
    money,
    totals: computed(() => totalsFor(lines.value)),
    canSend: computed(() => !!(form.value.customer && form.value.event && form.value.due && lines.value.length)),
  }
}

/* ---------------------------------------------------------------------------
 * Stories — `List` MUST stay the first export (standalone prototype).
 * ------------------------------------------------------------------------- */

/** Landing screen: every invoice, with the five status tiles filtering it. */
export const List = listStory()

/** An open invoice for four Omni reservations plus three Products. */
export const Detail = epPage({
  active: 'invoicing',
  components: COMPONENTS,
  setup: detailState,
  slot: DETAIL_SLOT,
})
Detail.storyName = 'Detail · INV-2026-0412'

/** Building that same invoice. Reservation lines are locked to the room-block
 *  rate; product quantities are editable and the summary follows them. */
export const Create = epPage({
  active: 'invoicing',
  components: COMPONENTS,
  setup: createState,
  slot: CREATE_SLOT,
})
Create.storyName = 'Create · New invoice'

/** First run — no invoices yet. Says which "invoicing" this is. */
export const Empty = listStory(true)
Empty.storyName = 'Empty · first run'
