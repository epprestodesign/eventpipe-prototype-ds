/** EP Pay / Screens / 08 · Unbuilt Areas / Customers — CONCEPT.
 *
 *  Illustrative concept with invented scope: no requirements exist for this
 *  area (checked Linear 2026-09-29). Built only from EP Pay patterns that
 *  already exist — the Transactions list, the Balances DsModal, the shared
 *  header/card scaffold — so it reads as the same product. See the docs block
 *  for the open questions and the assumption made for each.
 *
 *  Design decisions worth a second opinion:
 *
 *  1. A customer is a PAYER, created automatically the first time someone pays
 *     through EP Pay — so the list is a roll-up of the ledger, and every name
 *     in it is one already in Transactions. Adding a customer by hand exists
 *     only so a link or invoice can be sent to someone who has not paid yet.
 *
 *  2. The Add Customer dialog takes no card details. A housing company keying
 *     a guest's card into a dashboard is a PCI and trust problem EP Pay does
 *     not have today; the customer adds a method when they first pay.
 *
 *  3. The detail page stacks cards (details → numbers → payments → methods)
 *     rather than tabbing them. Tabs are the Developer pattern for four
 *     unrelated panels; this is one record, and it is short.
 */
import { ref, computed } from 'vue'
import { epPage, epCard, statusChip, toneChip, BRAND_CHIP, EP_CAPTION, EP_H2, EP_PAGE } from './_eppay'
import {
  conceptHeader, conceptDocs, filterTiles, listToolbar, pager, rowMenu,
  EDIT_COLUMNS_HEADER, ACTIONS_COL, TD, CUSTOMERS, EVENTS,
} from './_eppay-concepts'
import DsSearch from '../../components/DsSearch.vue'
import DsStat from '../../components/DsStat.vue'
import DsModal from '../../components/DsModal.vue'
import DsInput from '../../components/DsInput.vue'
import DsSelect from '../../components/DsSelect.vue'
import DsInfoGrid from '../../components/DsInfoGrid.vue'
import DsEmptyState from '../../components/DsEmptyState.vue'

export default {
  title: 'EP Pay/Screens/08 · Unbuilt Areas/Customers',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: conceptDocs({
          area: 'Customers',
          summary: 'A roll-up of everyone who has paid Team Travel Source through EventPipe Pay: who they are, how they pay, what they have spent, and the booking they last paid for.',
          patterns: 'Transactions (filter tiles, search/Filter/Export, `q-table.ds-table` with two-line cells, pagination), Balances (`DsModal` with a Cancel / primary footer), the shared `epHeader` / `epCard` scaffold.',
          questions: [
            ['Who is a customer — the guest who booked rooms, or the organisation (team, company) paying the housing company?',
              'the individual payer, i.e. the name already in the Transactions "Customer & Payment" column. Organisation is an optional field on the customer, not its own record.'],
            ['Are customers created automatically from payments, or managed by hand?',
              'automatically, on first payment, matched by email. Manual "Add Customer" exists only so a payment link or invoice can be sent before a first payment.'],
            ['Is a customer scoped to one event or to the whole merchant account?',
              'the whole account. The list shows the latest event/reservation paid for; the detail shows payments across events.'],
            ['Can staff store a card on a customer?',
              'no — no card entry in the dashboard. Methods appear only after the customer pays.'],
            ['How does this relate to the platform\'s existing guest/registrant records?',
              'it does not replace them. This is the payments view of a person; the platform\'s guest record stays the source of truth for the booking.'],
          ],
          left: 'edit/merge customers, bulk actions, customer-facing portal.',
        }),
      },
    },
  },
}

/* ---------------------------------------------------------------------------
 * Fixtures
 * ------------------------------------------------------------------------- */

/** Tile counts are account-wide (Year to Date), the table shows page 1 — the
 *  same "card total vs. rows on screen" split Transactions makes. */
const FILTERS = [
  { key: 'all', label: 'All', count: 312, total: '$486,210.40 spent', pages: 32, match: null },
  { key: 'repeat', label: 'Repeat', count: 64, total: '$171,904.15 spent', pages: 7, match: (c) => c.repeat },
  { key: 'new', label: 'New', count: 27, total: '$38,420.00 spent', pages: 3, match: (c) => c.isNew },
  { key: 'disputes', label: 'Open Dispute', count: 13, total: '$21,776.35 disputed', pages: 2, match: (c) => c.disputes > 0 },
]

const COLUMNS = [
  { name: 'customer', label: 'Customer', field: 'name', align: 'left' },
  { name: 'method', label: 'Payment Method', field: 'brand', align: 'left' },
  { name: 'spend', label: 'Spend', field: 'spend', align: 'left' },
  { name: 'latest', label: 'Latest Booking', field: 'event', align: 'left' },
  ACTIONS_COL,
]

/** Elena Fischer's payments — rows lifted from the Transactions ledger and the
 *  Disputes queue, with the cards those screens show for her. */
const ELENA = CUSTOMERS[0]
const ELENA_PAYMENTS = [
  { id: 'TXN-2026-16006', status: 'Success', when: 'Aug 20, 2026 · 2:51 PM', amount: '$1,359.00', type: 'Sale', brand: 'VISA', last4: '••••8821', event: 'Automated Playwright Live Event 340366', res: 'Hyatt Regency Seattle RES-5381879' },
  { id: 'TXN-2026-15928', status: 'Success', when: 'Aug 17, 2026 · 5:03 PM', amount: '−$243.00', type: 'Refund', brand: 'VISA', last4: '••••4242', event: 'Automated Playwright Live Event 340366', res: 'Hyatt Regency Seattle RES-5368727' },
  { id: 'TXN-2026-15369', status: 'Disputed', when: 'Jul 27, 2026 · 10:12 AM', amount: '$1,119.00', type: 'Sale', brand: 'Klarna', last4: '••••2914', event: 'Pricing Event 539073', res: 'Marriott Tempe at The Buttes RES-5321406' },
]
const PAYMENT_COLUMNS = [
  { name: 'status', label: 'Status & Date', field: 'status', align: 'left' },
  { name: 'amount', label: 'Amount & Type', field: 'amount', align: 'left' },
  { name: 'method', label: 'Payment', field: 'brand', align: 'left' },
  { name: 'details', label: 'Details', field: 'event', align: 'left' },
  ACTIONS_COL,
]

const ELENA_METHODS = [
  { brand: 'VISA', last4: '••••8821', isDefault: true, expires: '04/2028', added: 'Jan 14, 2025', used: 'Aug 20, 2026' },
  { brand: 'VISA', last4: '••••4242', isDefault: false, expires: '11/2027', added: 'Jun 2, 2025', used: 'Aug 17, 2026' },
  { brand: 'Klarna', last4: '••••2914', isDefault: false, expires: '—', added: 'Jul 27, 2026', used: 'Jul 27, 2026' },
]
const METHOD_COLUMNS = [
  { name: 'method', label: 'Method', field: 'brand', align: 'left' },
  { name: 'expires', label: 'Expires', field: 'expires', align: 'left' },
  { name: 'added', label: 'Added', field: 'added', align: 'left' },
  { name: 'used', label: 'Last used', field: 'used', align: 'left' },
]

/* ---------------------------------------------------------------------------
 * List
 * ------------------------------------------------------------------------- */

/* The period button only makes sense over data, so the empty state drops it. */
const HEADER_ACTIONS = (empty) => `
  ${empty ? '' : `<q-btn outline no-caps color="grey-8" icon="calendar_today" icon-right="expand_more"
    label="Year to Date" style="padding:0 16px;" />`}
  <q-btn unelevated no-caps color="primary" icon="person_add" label="Add Customer"
    style="padding:0 20px; font-weight:700;" @click="addOpen = true" />`

const table = `
  <q-table class="ds-table" :rows="visible" :columns="columns" row-key="id"
    flat bordered :pagination="{ rowsPerPage: 0 }"
    no-data-label="No customers on this page match that filter.">
    ${EDIT_COLUMNS_HEADER}

    <template #body-cell-customer="props">
      <q-td :props="props" style="${TD}">
        <a href="#" class="eppay-link" @click.prevent style="font-weight:700;">{{ props.row.name }}</a>
        <div style="${EP_CAPTION} margin-top:2px;">{{ props.row.email }}</div>
      </q-td>
    </template>

    <template #body-cell-method="props">
      <q-td :props="props" style="${TD}">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="${BRAND_CHIP}">{{ props.row.brand }}</span>
          <span style="${EP_CAPTION}">{{ props.row.last4 }}</span>
        </div>
        <div v-if="props.row.methods > 1" style="${EP_CAPTION} margin-top:4px;">+{{ props.row.methods - 1 }} more</div>
      </q-td>
    </template>

    <template #body-cell-spend="props">
      <q-td :props="props" style="${TD}">
        <div style="font-weight:700;">{{ props.row.spend }}</div>
        <div style="${EP_CAPTION} margin-top:2px;">
          {{ props.row.payments }} {{ props.row.payments === 1 ? 'payment' : 'payments' }}<template
            v-if="props.row.disputes"> · <span style="color:var(--ds-color-text-danger); font-weight:700;">{{ props.row.disputes }} open dispute</span></template>
        </div>
      </q-td>
    </template>

    <template #body-cell-latest="props">
      <q-td :props="props" style="${TD}">
        <a href="#" class="eppay-link" @click.prevent
          style="display:block; line-height:1.35; color:var(--ds-color-text); font-weight:400;">{{ props.row.event }}</a>
        <div style="${EP_CAPTION} margin-top:2px; line-height:1.35;">{{ props.row.res }} · {{ props.row.latestWhen }}</div>
      </q-td>
    </template>

    ${rowMenu('props.row.name')}
    ${pager('customers')}
  </q-table>`

const emptyBody = `
  <ds-empty-state icon="group" title="No customers yet"
    description="Everyone who pays you through EventPipe Pay is added here automatically, with their payment history. Add someone yourself to send them a payment link or an invoice before they have paid.">
    <template #action>
      <q-btn unelevated no-caps color="primary" icon="person_add" label="Add Customer"
        style="padding:0 20px; font-weight:700;" @click="addOpen = true" />
    </template>
  </ds-empty-state>`

/* The dialog is Balances' Get My Funds shape: DsModal, Cancel + one primary.
   No card fields — see decision 2 in the file comment. */
const addDialog = `
  <ds-modal v-model="addOpen" title="Add Customer" size="md">
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
      <ds-input v-model="form.first" label="First name" required />
      <ds-input v-model="form.last" label="Last name" required />
      <ds-input v-model="form.email" label="Email" type="email" required style="grid-column:1 / -1;"
        hint="Receipts, payment links and invoices go to this address." />
      <ds-input v-model="form.phone" label="Phone" type="tel" />
      <ds-input v-model="form.org" label="Organisation" hint="Optional. Printed on invoices." />
      <ds-select v-model="form.event" :options="events" label="Event" clearable style="grid-column:1 / -1;"
        hint="Optional. Pre-fills the event on links and invoices you send them." />
    </div>

    <div style="display:flex; gap:12px; align-items:flex-start; margin-top:20px; padding:14px 16px;
                border-radius:var(--ds-radius-lg); background:var(--ds-color-background-info); color:var(--ds-color-text-info);">
      <q-icon name="info" size="20px" style="margin-top:1px;" />
      <div style="font-size:0.875rem; line-height:1.45;">
        You can't add card details here. {{ form.first || 'The customer' }} adds a payment method the first time they pay a link or an invoice.
      </div>
    </div>

    <template #footer="{ close }">
      <div style="display:flex; justify-content:flex-end; gap:12px; width:100%;">
        <q-btn flat no-caps label="Cancel" color="grey-8" style="padding:0 22px;" @click="close" />
        <q-btn unelevated no-caps label="Add Customer" color="primary" :disable="!canAdd"
          style="padding:0 26px; font-weight:700;" />
      </div>
    </template>
  </ds-modal>`

const LIST_SLOT = (empty) => `
  <div style="${EP_PAGE}">
    ${conceptHeader('Customers', { actions: HEADER_ACTIONS(empty) })}
    ${epCard(empty ? emptyBody : `${filterTiles(4)}${listToolbar('Search customers by name or email')}${table}`)}
  </div>
  ${addDialog}`

function listState({ addOpen = false, filled = false } = {}) {
  const active = ref('all')
  const current = computed(() => FILTERS.find((f) => f.key === active.value) || FILTERS[0])
  const form = ref(filled
    ? { first: 'Rosa', last: 'Delgado', email: 'rosa.delgado@example.com', phone: '(206) 555-0175', org: '', event: EVENTS[0] }
    : { first: '', last: '', email: '', phone: '', org: '', event: null })
  return {
    filters: FILTERS,
    columns: COLUMNS,
    active,
    current,
    visible: computed(() => (current.value.match ? CUSTOMERS.filter(current.value.match) : CUSTOMERS)),
    query: ref(''),
    addOpen: ref(addOpen),
    form,
    events: EVENTS,
    canAdd: computed(() => !!(form.value.first && form.value.last && form.value.email)),
  }
}

const COMPONENTS = { DsSearch, DsStat, DsModal, DsInput, DsSelect, DsInfoGrid, DsEmptyState }

const listStory = (opts = {}) => epPage({
  active: 'customers',
  components: COMPONENTS,
  setup: () => listState(opts),
  slot: LIST_SLOT(!!opts.empty),
})

/* ---------------------------------------------------------------------------
 * Detail
 * ------------------------------------------------------------------------- */

const DETAIL_SLOT = `
  <div style="${EP_PAGE}">
    <q-breadcrumbs active-color="primary" gutter="sm" class="text-body2" style="margin-bottom:12px;">
      <q-breadcrumbs-el label="Customers" href="#" />
      <q-breadcrumbs-el :label="c.name" class="text-grey-7" />
    </q-breadcrumbs>

    ${conceptHeader(ELENA.name, {
      actions: `
        <q-btn outline no-caps color="primary" icon="link" label="Create Payment Link" style="padding:0 16px;" />
        <q-btn outline no-caps color="primary" icon="description" label="Create Invoice" style="padding:0 16px;" />
        <q-btn flat dense icon="more_vert" aria-label="More customer actions"
          style="border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-sm); color:var(--ds-color-icon-subtle);" />`,
    })}

    ${epCard(`
      <div style="display:flex; gap:40px; align-items:flex-start; flex-wrap:wrap;">
        <div style="flex:2 1 460px; min-width:0;">
          <div style="${EP_H2}">Customer Details</div>
          <ds-info-grid :items="details" layout="stacked" min-col-width="200px" />
        </div>
        <div style="flex:1 1 300px; display:grid; grid-template-columns:1fr 1fr; gap:20px 24px;
                    padding-left:32px; border-left:1px solid var(--ds-color-border-container);">
          <ds-stat v-for="s in stats" :key="s.label" :value="s.value" :label="s.label" />
        </div>
      </div>`)}

    ${epCard(`
      <div style="display:flex; align-items:center; margin-bottom:16px;">
        <div style="${EP_H2} margin-bottom:0;">Payments</div>
        <span style="flex:1;" />
        <a href="#" class="eppay-link" @click.prevent>View in Transactions</a>
      </div>
      <q-table class="ds-table" :rows="payments" :columns="paymentColumns" row-key="id"
        flat bordered :pagination="{ rowsPerPage: 0 }">
        ${EDIT_COLUMNS_HEADER}
        <template #body-cell-status="props">
          <q-td :props="props" style="${TD}">
            <span :style="chipFor(props.row.status)">{{ props.row.status }}</span>
            <div style="${EP_CAPTION} margin-top:6px;">{{ props.row.when }}</div>
          </q-td>
        </template>
        <template #body-cell-amount="props">
          <q-td :props="props" style="${TD}">
            <div style="font-weight:700;">{{ props.row.amount }}</div>
            <div style="${EP_CAPTION} margin-top:2px;">{{ props.row.type }} | {{ props.row.id }}</div>
          </q-td>
        </template>
        <template #body-cell-method="props">
          <q-td :props="props" style="${TD}">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="${BRAND_CHIP}">{{ props.row.brand }}</span>
              <span style="${EP_CAPTION}">{{ props.row.last4 }}</span>
            </div>
          </q-td>
        </template>
        <template #body-cell-details="props">
          <q-td :props="props" style="${TD}">
            <a href="#" class="eppay-link" @click.prevent
              style="display:block; line-height:1.35; color:var(--ds-color-text); font-weight:400;">{{ props.row.event }}</a>
            <div style="${EP_CAPTION} margin-top:2px; line-height:1.35;">{{ props.row.res }}</div>
          </q-td>
        </template>
        ${rowMenu('props.row.id')}
        <template #bottom>
          <div style="display:flex; align-items:center; flex:1; padding:6px 4px;">
            <span style="${EP_CAPTION}">Showing 1–{{ payments.length }} of {{ c.payments }} payments</span>
          </div>
        </template>
      </q-table>`)}

    ${epCard(`
      <div style="${EP_H2}">Payment Methods</div>
      <q-table class="ds-table" :rows="methods" :columns="methodColumns" row-key="last4"
        flat bordered hide-bottom :pagination="{ rowsPerPage: 0 }">
        <template #body-cell-method="props">
          <q-td :props="props" style="${TD}">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="${BRAND_CHIP}">{{ props.row.brand }}</span>
              <span>{{ props.row.last4 }}</span>
              <span v-if="props.row.isDefault" :style="chipTone('info')">Default</span>
            </div>
          </q-td>
        </template>
      </q-table>
      <div style="${EP_CAPTION} margin-top:12px;">Methods are added by the customer when they pay. Staff can't add or view full card numbers.</div>`)}
  </div>`

function detailState() {
  return {
    c: ELENA,
    details: [
      { label: 'Email', value: ELENA.email },
      { label: 'Phone', value: ELENA.phone },
      { label: 'Customer ID', value: ELENA.id },
      { label: 'Customer since', value: ELENA.since },
      { label: 'Organisation', value: '—' },
      { label: 'Latest booking', value: `${ELENA.event} · ${ELENA.res}` },
    ],
    stats: [
      { value: ELENA.spend, label: 'Lifetime spend' },
      { value: String(ELENA.payments), label: 'Payments' },
      { value: '$243.00', label: 'Refunded' },
      { value: '1', label: 'Open dispute' },
    ],
    payments: ELENA_PAYMENTS,
    paymentColumns: PAYMENT_COLUMNS,
    methods: ELENA_METHODS,
    methodColumns: METHOD_COLUMNS,
    chipFor: statusChip,
    chipTone: toneChip,
  }
}

/* ---------------------------------------------------------------------------
 * Stories — `List` MUST stay the first export: the standalone prototype opens
 * each area on its first story.
 * ------------------------------------------------------------------------- */

/** Landing screen: every payer on the account, Year to Date. The tiles filter
 *  the table exactly as the Transactions tiles do. */
export const List = listStory()

/** A customer's record — Elena Fischer, whose payments are in the ledger and
 *  whose Klarna payment is in the dispute queue. */
export const Detail = epPage({
  active: 'customers',
  components: COMPONENTS,
  setup: detailState,
  slot: DETAIL_SLOT,
})
Detail.storyName = 'Detail · Elena Fischer'

/** Add Customer, filled in for someone who has not paid yet (so is not in
 *  the ledger) — the one case manual add exists for. The info note is the design point: no card entry. */
export const Create = listStory({ addOpen: true, filled: true })
Create.storyName = 'Create · Add Customer'

/** First run — nothing paid through EP Pay yet. The copy explains that the
 *  list fills itself, which is the assumption the whole area rests on. */
export const Empty = listStory({ empty: true })
Empty.storyName = 'Empty · first run'
