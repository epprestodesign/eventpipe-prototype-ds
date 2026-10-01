/** EP Pay / Screens / 08 · Unbuilt Areas / Payment Links — CONCEPT.
 *
 *  Illustrative concept with invented scope: no requirements exist for this
 *  area (checked Linear 2026-09-29). Built only from EP Pay patterns that
 *  already exist — Transactions for the list, Get My Funds for the create
 *  dialog's choice cards, the shared header/card scaffold for everything else.
 *
 *  Design decisions worth a second opinion:
 *
 *  1. Every link belongs to an EVENT. That is what makes a link payment land
 *     in the ledger with its "Details" column filled in, the same as a booking
 *     payment. A reservation and a customer are optional on top of it.
 *
 *  2. Two amount modes, chosen with Get My Funds' selected-card pattern: a
 *     fixed amount (a balance due) or customer-chooses (a room-block deposit
 *     many people pay into). Usage — single use or reusable — is separate,
 *     because a fixed amount can still be reusable.
 *
 *  3. The URL is shown in monospace under the customer and on the detail page,
 *     with Copy beside it, because copying it is the whole job. No QR code:
 *     nothing in EP Pay does QR today and it would be pure invention.
 */
import { ref, computed } from 'vue'
import { epPage, epCard, statusChip, BRAND_CHIP, EP_CAPTION, EP_H2, EP_PAGE } from './_eppay'
import {
  conceptHeader, conceptDocs, filterTiles, listToolbar, pager, rowMenu, conceptChip, pick,
  EDIT_COLUMNS_HEADER, ACTIONS_COL, TD, MONO, EVENTS, customerNames,
} from './_eppay-concepts'
import DsSearch from '../../components/DsSearch.vue'
import DsStat from '../../components/DsStat.vue'
import DsModal from '../../components/DsModal.vue'
import DsInput from '../../components/DsInput.vue'
import DsSelect from '../../components/DsSelect.vue'
import DsInfoGrid from '../../components/DsInfoGrid.vue'
import DsEmptyState from '../../components/DsEmptyState.vue'
import DsChartCard from '../../components/charts/DsChartCard.vue'
import DsBarChart from '../../components/charts/DsBarChart.vue'

export default {
  title: 'Eventpipe Labs/EP Pay/Screens/08 · Unbuilt Areas/Payment Links',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: conceptDocs({
          area: 'Payment Links',
          summary: 'Shareable links that collect a payment against an event — a balance due, a room-block deposit, an incidental — without the payer going through the booking flow.',
          patterns: 'Transactions (filter tiles, toolbar, `q-table.ds-table`, two-line cells, pagination), Get My Funds (`DsModal`, selected choice cards, Cancel / primary footer), `epHeader` / `epCard`, `DsInfoGrid` for record metadata.',
          questions: [
            ['Is a link tied to an EventPipe reservation, or can it be for any amount?',
              'it must be tied to an event; a reservation is optional. Amount is either fixed or chosen by the payer. A link with no event would produce a ledger row with an empty Details column, which no other EP Pay payment has.'],
            ['Single use or reusable?',
              'both, chosen per link. Single-use links become "Completed" once paid; reusable links stay Active until they expire or are deactivated.'],
            ['Does paying a link update the reservation\'s balance in EventPipe?',
              'yes when a reservation is set — shown as a hint in the create dialog. How that reconciles with the platform\'s booking balance is the biggest open dependency.'],
            ['Who can see the link — anyone, or only the named customer?',
              'anyone with the URL can pay; naming a customer only pre-fills their details and emails them the link.'],
            ['What does the payer see?',
              'not designed. The customer-facing payment page is a separate surface (it would sit with the booking site, not this dashboard).'],
          ],
          left: 'the customer-facing pay page, QR codes, link branding/theming, partial payments against a fixed-amount link.',
        }),
      },
    },
  },
}

/* ---------------------------------------------------------------------------
 * Fixtures — every customer, event, hotel and reservation below is one the
 * built screens already show; links and TXN ids from September are new.
 * ------------------------------------------------------------------------- */

const LINKS = [
  { id: 'PL-2026-0138', status: 'Active', created: 'Created Sep 24, 2026', amount: '$1,359.00', usage: 'Single use', url: 'pay.eventpipe.com/l/7QK2-M4DX', customer: 'Elena Fischer', sub: 'Expires Sep 30, 2026', event: 'Automated Playwright Live Event 340366', res: 'Hyatt Regency Seattle RES-5392640' },
  { id: 'PL-2026-0136', status: 'Active', created: 'Created Sep 22, 2026', amount: '$2,575.00', usage: 'Single use', url: 'pay.eventpipe.com/l/R8TN-2WQE', customer: 'Hannah Reyes', sub: 'No expiry', event: 'Pricing Event 539073', res: 'Marriott Tempe at The Buttes RES-5388012' },
  { id: 'PL-2026-0131', status: 'Active', created: 'Created Sep 18, 2026', amount: 'Customer chooses', usage: 'Reusable · 4 paid', url: 'pay.eventpipe.com/l/OMNI-DEP1', customer: 'Anyone with the link', sub: 'No expiry', event: 'Pricing Event 637236', res: 'Omni Tempe Hotel at ASU · Room block deposit' },
  { id: 'PL-2026-0124', status: 'Completed', created: 'Created Sep 10, 2026', amount: '$804.00', usage: 'Single use', url: 'pay.eventpipe.com/l/K3VD-9PLA', customer: 'Jordan Alvarez', sub: 'Paid Sep 11, 2026', event: 'Automated Playwright Live Event 340366', res: 'Hyatt Regency Seattle RES-5379824' },
  { id: 'PL-2026-0117', status: 'Completed', created: 'Created Aug 18, 2026', amount: '$1,946.00', usage: 'Single use', url: 'pay.eventpipe.com/l/W2HC-6ZNB', customer: 'Marcus Webb', sub: 'Paid Aug 19, 2026', event: 'Pricing Event 637236', res: 'Omni Tempe Hotel at ASU RES-5375166' },
  { id: 'PL-2026-0112', status: 'Completed', created: 'Created Aug 17, 2026', amount: '$762.00', usage: 'Single use', url: 'pay.eventpipe.com/l/F6MJ-1RXT', customer: 'Chris Okonkwo', sub: 'Paid Aug 18, 2026', event: 'Automated Playwright Live Event 340366', res: 'Hyatt Regency Seattle RES-5370782' },
  { id: 'PL-2026-0105', status: 'Expired', created: 'Created Aug 5, 2026', amount: '$1,204.55', usage: 'Single use', url: 'pay.eventpipe.com/l/Q9ZP-4KSE', customer: 'Priya Raman', sub: 'Expired Aug 19, 2026', event: 'Pricing Event 539073', res: 'Marriott Tempe at The Buttes RES-5359961' },
  { id: 'PL-2026-0098', status: 'Deactivated', created: 'Created Aug 3, 2026', amount: '$3,410.90', usage: 'Single use', url: 'pay.eventpipe.com/l/B7LA-8GUY', customer: 'Owen Marsh', sub: 'Deactivated Aug 9, 2026', event: 'Pricing Event 637236', res: 'Omni Tempe Hotel at ASU RES-5362210' },
]

const FILTERS = [
  { key: 'all', label: 'All', count: 38, total: '$41,870.25 collected', pages: 4, match: null },
  { key: 'active', label: 'Active', count: 11, total: '$16,390.00 open', pages: 2, match: (l) => l.status === 'Active' },
  { key: 'completed', label: 'Completed', count: 24, total: '$38,114.80 collected', pages: 3, match: (l) => l.status === 'Completed' },
  { key: 'ended', label: 'Expired or Off', count: 3, total: '$6,020.45 not paid', pages: 1, match: (l) => l.status === 'Expired' || l.status === 'Deactivated' },
]

/** CHART CONCEPT — how long the 24 Completed links (the Completed tile) took
 *  to be paid, from creation. The three fixture rows agree: Sep 10 → 11,
 *  Aug 18 → 19, Aug 17 → 18 are all "Next day". The 3 links that ended unpaid
 *  are the "Expired or Off" tile and are named in the chart's footer, not
 *  plotted as a bucket — never-paid is not a duration. */
const TIME_TO_PAY = {
  labels: ['Same day', 'Next day', '2–3 days', '4–7 days', '8+ days'],
  series: [{ key: 'links', label: 'Links paid', data: [7, 10, 4, 2, 1] }],
}

const COLUMNS = [
  { name: 'status', label: 'Status & Dates', field: 'status', align: 'left' },
  { name: 'amount', label: 'Amount & Usage', field: 'amount', align: 'left' },
  { name: 'customer', label: 'Customer & Link', field: 'customer', align: 'left' },
  { name: 'details', label: 'Details', field: 'event', align: 'left' },
  ACTIONS_COL,
]

/** The reusable deposit link's payments — Detail shows these. */
const DEPOSIT = LINKS[2]
const DEPOSIT_PAYMENTS = [
  { id: 'TXN-2026-17342', status: 'Success', when: 'Sep 26, 2026 · 4:18 PM', amount: '$500.00', who: 'Marcus Webb', brand: 'AMEX', last4: '••••1007' },
  { id: 'TXN-2026-17301', status: 'Success', when: 'Sep 24, 2026 · 11:02 AM', amount: '$250.00', who: 'Owen Marsh', brand: 'VISA', last4: '••••6620' },
  { id: 'TXN-2026-17266', status: 'Success', when: 'Sep 21, 2026 · 7:45 PM', amount: '$1,000.00', who: 'Maya Sorensen', brand: 'Discover', last4: '••••7076' },
  { id: 'TXN-2026-17230', status: 'Success', when: 'Sep 19, 2026 · 9:26 AM', amount: '$500.00', who: 'Priya Raman', brand: 'AMEX', last4: '••••3315' },
]
const DEPOSIT_COLUMNS = [
  { name: 'status', label: 'Status & Date', field: 'status', align: 'left' },
  { name: 'amount', label: 'Amount', field: 'amount', align: 'left' },
  { name: 'customer', label: 'Customer & Payment', field: 'who', align: 'left' },
  ACTIONS_COL,
]

/* ---------------------------------------------------------------------------
 * List
 * ------------------------------------------------------------------------- */

const CREATE_BTN = `<q-btn unelevated no-caps color="primary" icon="add_link" label="Create Payment Link"
  style="padding:0 20px; font-weight:700;" @click="createOpen = true" />`

const table = `
  <q-table class="ds-table" :rows="visible" :columns="columns" row-key="id"
    flat bordered :pagination="{ rowsPerPage: 0 }"
    no-data-label="No payment links on this page match that filter.">
    ${EDIT_COLUMNS_HEADER}

    <template #body-cell-status="props">
      <q-td :props="props" style="${TD}">
        <span :style="chipFor(props.row.status)">{{ props.row.status }}</span>
        <div style="${EP_CAPTION} margin-top:6px;">{{ props.row.created }}</div>
        <div style="${EP_CAPTION}">{{ props.row.sub }}</div>
      </q-td>
    </template>

    <template #body-cell-amount="props">
      <q-td :props="props" style="${TD}">
        <div style="font-weight:700;">{{ props.row.amount }}</div>
        <div style="${EP_CAPTION} margin-top:2px;">{{ props.row.usage }} | {{ props.row.id }}</div>
      </q-td>
    </template>

    <!-- Four columns, like the ledger: the URL rides under the customer rather
         than taking a fifth column, which pushed the table past the card. -->
    <template #body-cell-customer="props">
      <q-td :props="props" style="${TD}">
        <div>{{ props.row.customer }}</div>
        <div style="display:flex; align-items:center; gap:4px; margin-top:2px;">
          <span :style="'${MONO} font-size:0.8125rem; color:' + (props.row.status === 'Active' ? 'var(--ds-color-text-subtle)' : 'var(--ds-color-text-subtlest)')">{{ props.row.url }}</span>
          <q-btn v-if="props.row.status === 'Active'" flat dense round size="xs" icon="content_copy"
            color="primary" :aria-label="'Copy link ' + props.row.id" />
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

    ${rowMenu('props.row.id', "[{ label: 'View link', icon: 'visibility', to: 'payment-links/detail' }, { label: 'Copy link', icon: 'content_copy', copy: 'https://' + props.row.url }, { label: 'Deactivate link', icon: 'link_off', danger: true, dividerBefore: true, confirm: { title: 'Deactivate this link?', message: 'Anyone who opens it will see that it is no longer active.', okLabel: 'Deactivate' } }]")}
    ${pager('payment links')}
  </q-table>`

const emptyBody = `
  <ds-empty-state icon="link" title="No payment links yet"
    description="Create a link to collect a payment for an event — a balance due, a deposit, an incidental — without the customer going back through booking.">
    <template #action>${CREATE_BTN}</template>
  </ds-empty-state>`

/* Get My Funds' structure: two selected-card choices on top, then the detail
   the choice needs, then a Cancel / primary footer. */
const createDialog = `
  <ds-modal v-model="createOpen" title="Create Payment Link" size="lg">
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
      <a v-for="m in modes" :key="m.key" href="#" @click.prevent="form.mode = m.key"
        :style="'display:block; border-radius:var(--ds-radius-lg); text-decoration:none; color:inherit; ' + pick(form.mode === m.key)">
        <div style="display:flex; align-items:center; gap:10px;">
          <q-radio v-model="form.mode" :val="m.key" color="primary" dense />
          <span style="font-weight:700; color:var(--ds-color-text);">{{ m.title }}</span>
        </div>
        <div style="${EP_CAPTION} margin:6px 0 0 30px;">{{ m.blurb }}</div>
      </a>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:20px;">
      <template v-if="form.mode === 'fixed'">
        <ds-input v-model="form.amount" label="Amount" type="currency" required />
        <div />
      </template>
      <template v-else>
        <ds-input v-model="form.min" label="Minimum" type="currency" hint="Optional" />
        <ds-input v-model="form.max" label="Maximum" type="currency" hint="Optional" />
      </template>
      <ds-input v-model="form.description" label="Description" required style="grid-column:1 / -1;"
        hint="The payer sees this on the payment page and on their receipt." />
      <ds-select v-model="form.event" :options="events" label="Event" required />
      <ds-input v-model="form.res" label="Reservation" placeholder="RES-"
        hint="Optional. Payments are applied to this reservation's balance." />
      <ds-select v-model="form.customer" :options="customers" label="Customer" clearable
        placeholder="Anyone with the link" hint="Optional. We email them the link." />
      <ds-input v-model="form.expires" label="Expires" type="date" hint="Optional." />
    </div>

    <div style="display:flex; align-items:center; gap:24px; margin-top:20px; padding-top:18px;
                border-top:1px solid var(--ds-color-border-container);">
      <span style="font-weight:700; color:var(--ds-color-text);">Usage</span>
      <q-radio v-model="form.usage" val="single" label="Single use — closes once paid" color="primary" dense />
      <q-radio v-model="form.usage" val="reusable" label="Reusable — anyone can pay, any number of times" color="primary" dense />
    </div>

    <template #footer="{ close }">
      <div style="display:flex; justify-content:flex-end; gap:12px; width:100%;">
        <q-btn flat no-caps label="Cancel" color="grey-8" style="padding:0 22px;" @click="close" />
        <q-btn unelevated no-caps label="Create Link" color="primary" :disable="!canCreate"
          style="padding:0 26px; font-weight:700;" />
      </div>
    </template>
  </ds-modal>`

/** CHART CONCEPT — see ChartConceptTimeToPay. */
const timeToPayChart = `
  <div style="margin-bottom:20px;">
    <ds-chart-card title="Time to pay" subtitle="Completed links by days from creation to payment · year to date" table-toggle>
      <template #default="{ view }">
        <ds-bar-chart :labels="timeToPay.labels" :series="timeToPay.series" :height="200" :view="view" />
      </template>
      <template #footer>21 of 24 were paid within 3 days. 3 more links expired or were turned off before anyone paid.</template>
    </ds-chart-card>
  </div>`

const LIST_SLOT = (empty, chart = false) => `
  <div style="${EP_PAGE}">
    ${conceptHeader('Payment Links', { actions: CREATE_BTN })}
    ${chart ? timeToPayChart : ''}
    ${epCard(empty ? emptyBody : `${filterTiles(4)}${listToolbar('Search links, customers or reservations')}${table}`)}
  </div>
  ${createDialog}`

const MODES = [
  { key: 'fixed', title: 'Fixed amount', blurb: 'A balance due or a single charge. The payer can\'t change it.' },
  { key: 'open', title: 'Customer chooses amount', blurb: 'A deposit or contribution. Set a minimum and maximum if you need one.' },
]

function listState({ createOpen = false, filled = false } = {}) {
  const active = ref('all')
  const current = computed(() => FILTERS.find((f) => f.key === active.value) || FILTERS[0])
  const form = ref(filled
    ? { mode: 'fixed', amount: 486, min: '', max: '', description: 'Parking — 3 nights, Hyatt Regency Seattle', event: EVENTS[0], res: 'RES-5381879', customer: 'Elena Fischer', expires: '2026-09-30', usage: 'single' }
    : { mode: 'fixed', amount: '', min: '', max: '', description: '', event: null, res: '', customer: null, expires: '', usage: 'single' })
  return {
    filters: FILTERS,
    columns: COLUMNS,
    active,
    current,
    visible: computed(() => (current.value.match ? LINKS.filter(current.value.match) : LINKS)),
    query: ref(''),
    createOpen: ref(createOpen),
    form,
    modes: MODES,
    events: EVENTS,
    customers: customerNames,
    pick,
    chipFor: conceptChip,
    canCreate: computed(() => !!(form.value.description && form.value.event && (form.value.mode === 'open' || form.value.amount))),
    timeToPay: TIME_TO_PAY,
  }
}

const COMPONENTS = { DsSearch, DsStat, DsModal, DsInput, DsSelect, DsInfoGrid, DsEmptyState, DsChartCard, DsBarChart }

const listStory = (opts = {}) => epPage({
  active: 'payment-links',
  components: COMPONENTS,
  setup: () => listState(opts),
  slot: LIST_SLOT(!!opts.empty, !!opts.chart),
})

/* ---------------------------------------------------------------------------
 * Detail — the reusable deposit link, because it is the one with history.
 * ------------------------------------------------------------------------- */

const DETAIL_SLOT = `
  <div style="${EP_PAGE}">
    <q-breadcrumbs active-color="primary" gutter="sm" class="text-body2" style="margin-bottom:12px;">
      <q-breadcrumbs-el label="Payment Links" href="#" />
      <q-breadcrumbs-el label="${DEPOSIT.id}" class="text-grey-7" />
    </q-breadcrumbs>

    ${conceptHeader('Room block deposit', {
      actions: `
        <q-btn outline no-caps color="negative" label="Deactivate" style="padding:0 18px;" />
        <q-btn outline no-caps color="primary" icon="edit" label="Edit" style="padding:0 18px;" />`,
    })}

    ${epCard(`
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:22px;">
        <span :style="chipFor(link.status)">{{ link.status }}</span>
        <div style="flex:1; display:flex; align-items:center; gap:10px; padding:10px 14px;
                    background:var(--ds-color-surface-sunken); border:1px solid var(--ds-color-border);
                    border-radius:var(--ds-radius-md);">
          <q-icon name="link" size="20px" style="color:var(--ds-color-icon-subtle);" />
          <span style="${MONO} flex:1;">https://{{ link.url }}</span>
        </div>
        <q-btn unelevated no-caps color="primary" icon="content_copy" label="Copy Link" style="padding:0 18px; font-weight:700;" />
        <q-btn outline no-caps color="primary" icon="mail" label="Email" style="padding:0 18px;" />
      </div>
      <div style="display:flex; gap:40px; align-items:flex-start; flex-wrap:wrap;">
        <div style="flex:2 1 460px; min-width:0;">
          <ds-info-grid :items="details" layout="stacked" min-col-width="200px" />
        </div>
        <div style="flex:1 1 260px; display:grid; grid-template-columns:1fr 1fr; gap:20px 24px;
                    padding-left:32px; border-left:1px solid var(--ds-color-border-container);">
          <ds-stat value="$2,250.00" label="Collected" />
          <ds-stat value="4" label="Payments" />
        </div>
      </div>`)}

    ${epCard(`
      <div style="${EP_H2}">Payments Through This Link</div>
      <q-table class="ds-table" :rows="payments" :columns="paymentColumns" row-key="id"
        flat bordered hide-bottom :pagination="{ rowsPerPage: 0 }">
        ${EDIT_COLUMNS_HEADER}
        <template #body-cell-status="props">
          <q-td :props="props" style="${TD}">
            <span :style="txChip(props.row.status)">{{ props.row.status }}</span>
            <div style="${EP_CAPTION} margin-top:6px;">{{ props.row.when }}</div>
          </q-td>
        </template>
        <template #body-cell-amount="props">
          <q-td :props="props" style="${TD}">
            <div style="font-weight:700;">{{ props.row.amount }}</div>
            <div style="${EP_CAPTION} margin-top:2px;">Sale | {{ props.row.id }}</div>
          </q-td>
        </template>
        <template #body-cell-customer="props">
          <q-td :props="props" style="${TD}">
            <div>{{ props.row.who }}</div>
            <div style="display:flex; align-items:center; gap:8px; margin-top:4px;">
              <span style="${BRAND_CHIP}">{{ props.row.brand }}</span>
              <span style="${EP_CAPTION}">{{ props.row.last4 }}</span>
            </div>
          </q-td>
        </template>
        ${rowMenu('props.row.id', "[{ label: 'View transaction', icon: 'visibility', to: 'transactions' }, { label: 'Copy transaction ID', icon: 'content_copy', copy: props.row.id }, { label: 'Refund payment', icon: 'undo', danger: true, dividerBefore: true, confirm: { title: 'Refund ' + props.row.id + '?', message: 'The customer is refunded to the original payment method. This can’t be undone.', okLabel: 'Refund' } }]")}
      </q-table>`)}
  </div>`

function detailState() {
  return {
    link: DEPOSIT,
    details: [
      { label: 'Amount', value: 'Customer chooses · $250.00 minimum' },
      { label: 'Usage', value: 'Reusable' },
      { label: 'Customer', value: 'Anyone with the link' },
      { label: 'Event', value: DEPOSIT.event },
      { label: 'Applies to', value: 'Omni Tempe Hotel at ASU — room block' },
      { label: 'Expires', value: 'No expiry' },
      { label: 'Created', value: 'Sep 18, 2026 by Mike Addesa' },
      { label: 'Link ID', value: DEPOSIT.id },
    ],
    payments: DEPOSIT_PAYMENTS,
    paymentColumns: DEPOSIT_COLUMNS,
    chipFor: conceptChip,
    txChip: statusChip,
  }
}

/* ---------------------------------------------------------------------------
 * Stories — `List` MUST stay the first export (standalone prototype).
 * ------------------------------------------------------------------------- */

/** Landing screen: every link on the account. The tiles filter the table. */
export const List = listStory()

/** A reusable deposit link with four payments against it. */
export const Detail = epPage({
  active: 'payment-links',
  components: COMPONENTS,
  setup: detailState,
  slot: DETAIL_SLOT,
})
Detail.storyName = 'Detail · Room block deposit'

/** Create, filled in: a fixed-amount, single-use link for Elena Fischer's
 *  parking against her Hyatt reservation. Click the second card to see the
 *  customer-chooses fields. */
export const Create = listStory({ createOpen: true, filled: true })
Create.storyName = 'Create · Payment Link'

/** First run — no links created yet. */
export const Empty = listStory({ empty: true })
Empty.storyName = 'Empty · first run'

/** **Chart concept · Time to pay** — the List with a days-to-payment chart
 *  above the tiles.
 *
 *  *Question it answers:* "How long do people take to pay a link — and so how
 *  long should a link live?" That is the one setting a merchant chooses on
 *  every link (Expires), and today they choose it blind. Here most links are
 *  paid within a day, so a 7-day default expiry loses almost nothing.
 *
 *  *Why a bar chart:* the Charts Overview's Bar is for "comparing
 *  categories"; the buckets are ordered categories and the question is which
 *  is biggest. One series, so no legend.
 *
 *  *Adds:* one chart card between the header and the list; the list is
 *  unchanged. *Considered and not proposed:* a per-link payments sparkline in
 *  the table (most links are single use — one payment is a dot, not a trend)
 *  and revenue by link (the Amount column already says it, exactly). */
export const ChartConceptTimeToPay = listStory({ chart: true })
ChartConceptTimeToPay.storyName = 'Chart concept · Time to pay'
