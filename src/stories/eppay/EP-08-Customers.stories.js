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
 *
 *  4. The list is LIVE and literally a roll-up: it is computed from the
 *     Transactions ledger (`_transactions-data.js`, imported read-only), so
 *     the header's date range (DsDateRangePicker, the control Transactions
 *     uses — it replaced a dead "Year to Date ▾" button) scopes it exactly as
 *     it scopes Transactions. See RANGE-SCOPED vs LIFETIME below.
 */
import { ref, computed, watch } from 'vue'
import { epPage, epCard, statusChip, toneChip, BRAND_CHIP, EP_CAPTION, EP_H2, EP_PAGE } from './_eppay'
import {
  conceptHeader, conceptDocs, filterTiles, listToolbar, rowMenu,
  EDIT_COLUMNS_HEADER, ACTIONS_COL, TD, CUSTOMERS, EVENTS,
} from './_eppay-concepts'
import { LEDGER, DATA_START, DATA_END, money } from './_transactions-data'
import { isoFromLabel } from './_disputes-data'
import { presetRange, formatLong, formatRange } from '../../components/dateRangeMath.js'
import DsSearch from '../../components/DsSearch.vue'
import DsStat from '../../components/DsStat.vue'
import DsModal from '../../components/DsModal.vue'
import DsInput from '../../components/DsInput.vue'
import DsSelect from '../../components/DsSelect.vue'
import DsInfoGrid from '../../components/DsInfoGrid.vue'
import DsEmptyState from '../../components/DsEmptyState.vue'
import DsDateRangePicker from '../../components/DsDateRangePicker.vue'
import DsPagination from '../../components/DsPagination.vue'
import DsChartCard from '../../components/charts/DsChartCard.vue'
import DsStackedBarChart from '../../components/charts/DsStackedBarChart.vue'

export default {
  title: 'Eventpipe Labs/EP Pay/Screens/08 · Unbuilt Areas/Customers',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          conceptDocs({
            area: 'Customers',
            summary: 'A roll-up of everyone who has paid Team Travel Source through EventPipe Pay: who they are, how they pay, what they have spent, and the booking they last paid for.',
            patterns: 'Transactions (header date range, filter tiles, search/Filter/Export, `q-table.ds-table` with two-line cells, DsPagination), Balances (`DsModal` with a Cancel / primary footer), the shared `epHeader` / `epCard` scaffold.',
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
              ['What does the date range mean on a list of people?',
                'who PAID in that period. A customer is listed when at least one sale of theirs in the range went through (Success, Refunded or Disputed — not Failed); the money columns are that period\'s. "Customer since" stays lifetime.'],
            ],
            left: 'edit/merge customers, bulk actions, customer-facing portal.',
          }),
          '',
          '### What the date range scopes',
          '',
          'The list is computed from the Transactions ledger (Jan 1 – Sep 29, 2026), so every number on it agrees with Transactions for the same range. It opens on **Year to date**.',
          '',
          '| On screen | Scope | Derived from |',
          '| --- | --- | --- |',
          '| Which customers are listed | **Range** | at least one sale in the range that did not fail |',
          '| All tile | **Range** | customers listed · gross paid in the range |',
          '| Returning tile | **Range** | paid in the range *and* had paid before it started |',
          '| New tile | **Range** | first-ever payment falls inside the range |',
          '| Disputed tile | **Range** | a payment in the range is disputed · the disputed payments\' total |',
          '| Paid in Period column | **Range** | gross sales in the range (refunds are not netted — the ledger records a refunded sale at its original amount) and their count |',
          '| Last Payment column | **Range** | the newest of those sales: event, reservation, date, and the card it used |',
          '| "+N more" under the card | **Lifetime** | other cards the customer has paid with |',
          '| "Customer since" (under the email) | **Lifetime** | first payment in the ledger — or, for the two customers whose record predates it (Elena Fischer, Maya Sorensen), the record\'s own date |',
          '',
          'Returning + New always equals All. Search (name or email), the tiles and the pager all work on the same range result; the tiles ignore search and their own selection, as in Transactions. A range with no payments shows the table\'s empty state.',
          '',
          '*Chart concept:* the monthly chart follows the range too, from the same ledger. Because the ledger begins on Jan 1, 2026, nearly everyone\'s "first payment" is in January — the chart is honest about that rather than showing the invented curve it used to.',
          '',
          '*Detail · Elena Fischer* is unchanged: a static record, lifetime figures.',
        ].join('\n'),
      },
    },
  },
}

/* ---------------------------------------------------------------------------
 * The roll-up — customers derived from the Transactions ledger
 * ------------------------------------------------------------------------- */

/** The prototype's "now", as Transactions pins it. */
const TODAY = DATA_END
const PAGE_SIZE = 10

/** The header's presets. "Year to date" is the default — the label the old
 *  dead button carried — and is the `thisYear` preset (Jan 1 → today). Last
 *  year / All time are left out: the ledger starts Jan 1, 2026, so both would
 *  only repeat Year to date. */
const PRESETS = ['today', 'yesterday', 'thisWeek', 'lastWeek', 'thisMonth', 'lastMonth', { key: 'thisYear', label: 'Year to date' }]

/** How the ledger's brand keys print — the labels the CUSTOMERS fixture uses. */
const BRAND_LABEL = { visa: 'VISA', mastercard: 'Mastercard', amex: 'AMEX', discover: 'Discover', paypal: 'PayPal', klarna: 'Klarna' }

/** A payment is a sale that went through. Failed sales, refunds and
 *  adjustments are not someone paying. Disputed and refunded sales did go
 *  through, so they count (and are kept at the ledger's amount). */
const PAID = LEDGER.filter((t) => t.type === 'Sale' && t.status !== 'Failed')

/** The concept's hand-written profiles (email, id) where it has one. The
 *  ledger also has payers the fixture never listed — the two occasional
 *  bookers and the one-off payers behind the Disputes queue — and they are
 *  customers too: their email follows the fixture's example.com pattern. */
const PROFILE = Object.fromEntries(CUSTOMERS.map((c) => [c.name, c]))
const slug = (name) => name.toLowerCase().replace(/[^a-z]+/g, '.')

/** LIFETIME facts per payer: when they were first a customer, and every card
 *  they have paid with. `since` is the first ledger payment, unless the
 *  fixture's record predates the ledger (Elena Fischer, Maya Sorensen) — the
 *  ledger cannot see before Jan 1, 2026, so the older record date wins. The
 *  fixture's other `since` values contradict the ledger and are not used. */
const LIFETIME = (() => {
  const out = new Map()
  // LEDGER is newest first, so the last row seen per payer is their first.
  for (const t of PAID) {
    const l = out.get(t.who) || { first: t.date, cards: new Set() }
    l.first = t.date
    l.cards.add(`${t.brand} ${t.last4}`)
    out.set(t.who, l)
  }
  for (const [who, l] of out) {
    const recorded = PROFILE[who] ? isoFromLabel(PROFILE[who].since) : ''
    l.since = recorded && recorded < DATA_START ? recorded : l.first
  }
  return out
})()

/** Every customer who paid in `range`, newest payment first, with that
 *  period's numbers alongside the lifetime ones. */
function rollUp({ start, end }) {
  const byWho = new Map()
  for (const t of PAID) {
    if (t.date < start || t.date > end) continue
    // PAID is newest first, so the first row met per payer is their latest.
    const r = byWho.get(t.who) || { latest: t, payments: 0, cents: 0, disputes: 0, disputedCents: 0 }
    r.payments += 1
    r.cents += t.cents
    if (t.status === 'Disputed') { r.disputes += 1; r.disputedCents += t.cents }
    byWho.set(t.who, r)
  }
  return [...byWho].map(([name, r]) => {
    const p = PROFILE[name]
    const life = LIFETIME.get(name)
    return {
      id: p ? p.id : slug(name),
      name,
      email: p ? p.email : `${slug(name)}@example.com`,
      brand: BRAND_LABEL[r.latest.brand] || r.latest.brand,
      last4: r.latest.last4,
      methods: life.cards.size,
      payments: r.payments,
      cents: r.cents,
      spend: money(r.cents),
      disputes: r.disputes,
      disputedCents: r.disputedCents,
      event: r.latest.event,
      res: r.latest.res,
      latestWhen: formatLong(r.latest.date),
      since: formatLong(life.since),
      isNew: life.since >= start,
      returning: life.since < start,
    }
  })
}

/** Tiles: count + total over the range. They ignore the search and their own
 *  selection — they describe the period; the table is what gets narrowed. */
const FILTERS = [
  { key: 'all', label: 'All', match: null },
  { key: 'returning', label: 'Returning', match: (c) => c.returning },
  { key: 'new', label: 'New', match: (c) => c.isNew },
  { key: 'disputed', label: 'Disputed', match: (c) => c.disputes > 0 },
]
function tilesFor(rows) {
  return FILTERS.map((f) => {
    const hit = f.match ? rows.filter(f.match) : rows
    const total = f.key === 'disputed'
      ? `${money(hit.reduce((s, c) => s + c.disputedCents, 0))} disputed`
      : `${money(hit.reduce((s, c) => s + c.cents, 0))} paid`
    return { ...f, count: hit.length, total }
  })
}

const searchCustomers = (rows, query) => {
  const q = String(query || '').trim().toLowerCase()
  return q ? rows.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)) : rows
}

/** CHART CONCEPT — payers per month across the range, split by whether the
 *  month holds their first-ever payment. Same ledger, same definitions. */
function payersByMonth({ start, end }) {
  const months = []
  for (let m = start.slice(0, 7); m <= end.slice(0, 7);) {
    months.push(m)
    const [y, mo] = m.split('-').map(Number)
    m = mo === 12 ? `${y + 1}-01` : `${y}-${String(mo + 1).padStart(2, '0')}`
  }
  const seen = months.map(() => new Map())
  for (const t of PAID) {
    if (t.date < start || t.date > end) continue
    seen[months.indexOf(t.date.slice(0, 7))].set(t.who, true)
  }
  const first = seen.map((s, i) => [...s.keys()].filter((who) => LIFETIME.get(who).since.slice(0, 7) === months[i]).length)
  return {
    labels: months.map((m) => `${m}-01`),
    series: [
      { key: 'first', label: 'First payment', data: first },
      { key: 'returning', label: 'Returning', data: seen.map((s, i) => s.size - first[i]) },
    ],
  }
}

const COLUMNS = [
  { name: 'customer', label: 'Customer', field: 'name', align: 'left' },
  { name: 'method', label: 'Payment Method', field: 'brand', align: 'left' },
  { name: 'spend', label: 'Paid in Period', field: 'spend', align: 'left' },
  { name: 'latest', label: 'Last Payment', field: 'event', align: 'left' },
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

/* The date range only makes sense over data, so the first-run empty state
   drops it. Same control, same bounds as the Transactions header. */
const HEADER_ACTIONS = (empty) => `
  ${empty ? '' : `<ds-date-range-picker v-model="range" label="Customers date range" align="right"
    today="${TODAY}" min="${DATA_START}" max="${TODAY}" :presets="presets" />`}
  <q-btn unelevated no-caps color="primary" icon="person_add" label="Add Customer"
    style="padding:0 20px; font-weight:700;" @click="addOpen = true" />`

const table = `
  <q-table class="ds-table" :rows="pageRows" :columns="columns" row-key="id"
    flat bordered :pagination="{ rowsPerPage: 0 }">
    ${EDIT_COLUMNS_HEADER}

    <template #body-cell-customer="props">
      <q-td :props="props" style="${TD}">
        <a href="#" class="eppay-link" @click.prevent style="font-weight:700;">{{ props.row.name }}</a>
        <div style="${EP_CAPTION} margin-top:2px;">{{ props.row.email }}</div>
        <div style="${EP_CAPTION} margin-top:2px;">Customer since {{ props.row.since }}</div>
      </q-td>
    </template>

    <template #body-cell-method="props">
      <q-td :props="props" style="${TD}">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="${BRAND_CHIP}">{{ props.row.brand }}</span>
          <span style="${EP_CAPTION}">{{ props.row.last4 }}</span>
        </div>
        <div v-if="props.row.methods > 1" style="${EP_CAPTION} margin-top:4px;">+{{ props.row.methods - 1 }} more on file</div>
      </q-td>
    </template>

    <template #body-cell-spend="props">
      <q-td :props="props" style="${TD}">
        <div style="font-weight:700;">{{ props.row.spend }}</div>
        <div style="${EP_CAPTION} margin-top:2px;">
          {{ props.row.payments }} {{ props.row.payments === 1 ? 'payment' : 'payments' }}<template
            v-if="props.row.disputes"> · <span style="color:var(--ds-color-text-danger); font-weight:700;">{{ props.row.disputes }} disputed</span></template>
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

    ${rowMenu('props.row.name', "[{ label: 'View customer', icon: 'visibility', to: 'customers/detail' }, { label: 'Create payment link', icon: 'add_link', to: 'payment-links' }, { label: 'Send invoice', icon: 'request_quote' }, { label: 'Copy email', icon: 'content_copy', copy: props.row.email }]")}

    <template #no-data>
      <div style="width:100%;" data-testid="customers-empty">
        <ds-empty-state icon="group" :title="empty.title" :description="empty.description">
          <template #action>
            <q-btn v-if="query" outline no-caps color="primary" label="Clear search" @click="query = ''" />
          </template>
        </ds-empty-state>
      </div>
    </template>

    <template #bottom>
      <ds-pagination v-model="page" :total="filtered.length" :page-size="PAGE_SIZE" noun="customers"
        style="flex:1; padding:6px 4px;" data-testid="customers-pagination" />
    </template>
  </q-table>`

/* Says which numbers are the period's and which are lifetime, right where
   they are read. */
const scopeNote = `
  <div style="${EP_CAPTION} margin:-6px 0 12px;" data-testid="customers-scope">
    Customers who paid {{ periodText }}. Paid in Period and Last Payment cover this period; “Customer since” is lifetime.
  </div>`

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

/** CHART CONCEPT — see ChartConceptReturning. */
const payersChart = `
  <div style="margin-bottom:20px;">
    <ds-chart-card title="First-time vs returning payers" :subtitle="'Customers who paid each month · ' + periodLabel" table-toggle>
      <template #default="{ view }">
        <ds-stacked-bar-chart :labels="payers.labels" :series="payers.series" label-format="month-year"
          :height="220" :view="view" />
      </template>
    </ds-chart-card>
  </div>`

const LIST_SLOT = (empty, chart = false) => `
  <div style="${EP_PAGE}">
    ${conceptHeader('Customers', { actions: HEADER_ACTIONS(empty) })}
    ${chart ? payersChart : ''}
    ${epCard(empty ? emptyBody : `${filterTiles(4)}${listToolbar('Search customers by name or email')}${scopeNote}${table}`)}
  </div>
  ${addDialog}`

function listState({ addOpen = false, filled = false } = {}) {
  const range = ref({ ...presetRange('thisYear', TODAY, { min: DATA_START }), preset: 'thisYear' })
  const active = ref('all')
  const query = ref('')
  const page = ref(1)

  const ranged = computed(() => rollUp(range.value))
  const tiles = computed(() => tilesFor(ranged.value))
  const current = computed(() => FILTERS.find((f) => f.key === active.value) || FILTERS[0])
  const filtered = computed(() => searchCustomers(current.value.match ? ranged.value.filter(current.value.match) : ranged.value, query.value))
  const pageRows = computed(() => filtered.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE))
  // Any change to what is being looked at starts again from page 1.
  watch([range, active, query], () => { page.value = 1 }, { deep: true })

  const periodLabel = computed(() => formatRange(range.value))
  const periodText = computed(() => {
    const { start, end } = range.value
    return start === end ? `on ${formatLong(start)}` : `from ${formatLong(start)} to ${formatLong(end)}`
  })
  const empty = computed(() => {
    if (!ranged.value.length) return { title: 'No customers paid in this period', description: `Nobody paid through EventPipe Pay ${periodText.value}. Try a wider date range.` }
    if (query.value) return { title: 'No matching customers', description: `No one who paid in ${periodLabel.value} matches “${query.value}”. Search by name or email.` }
    return { title: `No ${current.value.label.toLowerCase()} customers`, description: `None of the customers who paid in this period are ${current.value.label.toLowerCase()}.` }
  })

  const form = ref(filled
    ? { first: 'Rosa', last: 'Delgado', email: 'rosa.delgado@example.com', phone: '(206) 555-0175', org: '', event: EVENTS[0] }
    : { first: '', last: '', email: '', phone: '', org: '', event: null })
  return {
    range,
    presets: PRESETS,
    filters: tiles,
    columns: COLUMNS,
    active,
    current,
    query,
    page,
    filtered,
    pageRows,
    PAGE_SIZE,
    empty,
    periodLabel,
    periodText,
    addOpen: ref(addOpen),
    form,
    events: EVENTS,
    canAdd: computed(() => !!(form.value.first && form.value.last && form.value.email)),
    payers: computed(() => payersByMonth(range.value)),
  }
}

const COMPONENTS = { DsSearch, DsStat, DsModal, DsInput, DsSelect, DsInfoGrid, DsEmptyState, DsDateRangePicker, DsPagination, DsChartCard, DsStackedBarChart }

const listStory = (opts = {}) => epPage({
  active: 'customers',
  components: COMPONENTS,
  setup: () => listState(opts),
  slot: LIST_SLOT(!!opts.empty, !!opts.chart),
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
        <ds-action-menu label="More customer actions" :items="[
          { label: 'Edit customer', icon: 'edit' },
          { label: 'Create payment link', icon: 'add_link', to: 'payment-links' },
          { label: 'Copy customer ID', icon: 'content_copy', copy: 'CUS-10482' },
          { label: 'Delete customer', icon: 'delete', danger: true, dividerBefore: true, confirm: { title: 'Delete this customer?', message: 'Their payment history is kept; saved payment methods are removed.', okLabel: 'Delete' } },
        ]" />`,
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
        ${rowMenu('props.row.id', "[{ label: 'View transaction', icon: 'visibility', to: 'transactions' }, { label: 'Copy transaction ID', icon: 'content_copy', copy: props.row.id }, { label: 'Refund payment', icon: 'undo', danger: true, dividerBefore: true, confirm: { title: 'Refund ' + props.row.id + '?', message: 'The customer is refunded to the original payment method. This can’t be undone.', okLabel: 'Refund' } }]")}
        <template #bottom>
          <ds-pagination :total="c.payments" :page-size="payments.length || 10" noun="payments"
            style="flex:1; padding:6px 4px;" />
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

/** Landing screen: everyone who paid **Year to date** (the default range).
 *  Change the range in the header and the tiles, the list and the pager
 *  follow — it is the Transactions ledger rolled up by payer. The tiles
 *  filter the table exactly as the Transactions tiles do; "Customer since" is
 *  the one lifetime figure. */
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

/** **Chart concept · Returning payers** — the List with a monthly chart above
 *  the tiles. The chart follows the header range: one bar per month in it,
 *  from the same ledger roll-up as the list (so January, when the ledger
 *  begins, is mostly "first payment").
 *
 *  *Question it answers:* "Are the people who pay us coming back?" For a
 *  housing company that is the health of the repeat-event business; the
 *  Returning tile gives a count for the period but not whether it is growing.
 *
 *  *Why a stacked bar:* the Charts Overview's Stacked Bar is for "composition
 *  per category" when both the total and the split matter — here each month's
 *  bar is how many paid, and the top segment is how many had paid before.
 *
 *  *Adds:* one chart card between the header and the list; the list is
 *  unchanged. *Considered and not proposed:* a spend sparkline per row (most
 *  customers pay one to six times in total, so the line is a dot or a step —
 *  noise, not a trend) and a spend-over-time chart on Detail (three to six
 *  payments; the Payments table already shows each one exactly). */
export const ChartConceptReturning = listStory({ chart: true })
ChartConceptReturning.storyName = 'Chart concept · Returning payers'
