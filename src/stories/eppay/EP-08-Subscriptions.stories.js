/** EP Pay / Screens / 08 · Unbuilt Areas / Subscriptions — CONCEPT.
 *
 *  Illustrative concept with invented scope: no requirements exist for this
 *  area (checked Linear 2026-09-29). Built only from EP Pay patterns that
 *  already exist — the Transactions list, the Balances segment bar and
 *  DsModal, the shared header/card scaffold.
 *
 *  The central assumption: nothing about a hotel room block recurs forever,
 *  so a "subscription" here is an INSTALLMENT PLAN — a reservation's total
 *  split into a fixed number of scheduled charges against the customer's card.
 *  The nav label is kept as "Subscriptions" because the nav is not this
 *  concept's to rename; the first open question asks product to.
 *
 *  Design decisions worth a second opinion:
 *
 *  1. Progress is drawn with the Balances segment bar — one segment per
 *     installment, success for paid, danger for failed, neutral for scheduled —
 *     so "3 of 5 paid" is visible without reading.
 *
 *  2. A failed installment makes the plan Past Due and puts a banner on the
 *     detail page with the two things staff can do about it. The retry itself
 *     is automatic; staff are told when it will happen.
 *
 *  3. Create is one DsModal with a live schedule beside the form, not the EP-07
 *     wizard. The wizard is a full-screen onboarding surface; a plan is five
 *     fields whose consequence (the schedule) should be visible while typing.
 */
import { ref, computed } from 'vue'
import { epPage, epCard, BRAND_CHIP, EP_CAPTION, EP_H2, EP_PAGE, statusChip } from './_eppay'
import {
  conceptHeader, conceptDocs, filterTiles, listToolbar, pager, rowMenu, conceptChip, conceptTint, pick,
  EDIT_COLUMNS_HEADER, ACTIONS_COL, TD, MICRO, EVENTS, customerNames,
} from './_eppay-concepts'
import DsSearch from '../../components/DsSearch.vue'
import DsStat from '../../components/DsStat.vue'
import DsModal from '../../components/DsModal.vue'
import DsInput from '../../components/DsInput.vue'
import DsSelect from '../../components/DsSelect.vue'
import DsInfoGrid from '../../components/DsInfoGrid.vue'
import DsEmptyState from '../../components/DsEmptyState.vue'
import DsChartCard from '../../components/charts/DsChartCard.vue'
import DsStackedBarChart from '../../components/charts/DsStackedBarChart.vue'

export default {
  title: 'EP Pay/Screens/08 · Unbuilt Areas/Subscriptions',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: conceptDocs({
          area: 'Subscriptions',
          summary: 'Installment plans: a reservation\'s total split into scheduled charges on the customer\'s card, with progress, the next charge, and what happens when one fails.',
          patterns: 'Transactions (five filter tiles, toolbar, `q-table.ds-table`, two-line cells, pagination), Balances (the segmented bar, `DsModal` with Cancel / primary), `epHeader` / `epCard`, `DsInfoGrid`.',
          questions: [
            ['What is actually recurring in hotel room-block payments?',
              'nothing open-ended. This concept treats "Subscriptions" as installment plans with a fixed end — pay a reservation off over several dates. If product means something else (a recurring fee billed to a housing company, a membership), this area needs redesigning from scratch, and the nav label should probably change either way.'],
            ['Is a plan tied to one reservation?',
              'yes — one plan per reservation, so each charge lands in the ledger with the same event/reservation details as a booking payment.'],
            ['Must the plan finish before check-in?',
              'not enforced in this concept. Almost certainly a real rule (a hotel will want the balance before arrival) — needs the event\'s dates and a policy.'],
            ['What happens when an installment fails?',
              'the plan goes Past Due, the charge retries automatically once three days later, and the customer is emailed a link to update their card. Staff can retry now or send that link again.'],
            ['Can the customer set up a plan themselves at booking?',
              'not designed — this is the staff-created path only.'],
          ],
          left: 'customer self-serve plans at checkout, editing a running plan, dunning/retry settings, refunds across installments.',
        }),
      },
    },
  },
}

/* ---------------------------------------------------------------------------
 * Fixtures — customers, cards, events and hotels are the ledger's; the
 * reservations each plan pays off are new numbers so no plan contradicts a
 * booking the ledger already shows as paid in full.
 * ------------------------------------------------------------------------- */

const PLANS = [
  { id: 'SUB-2026-0042', status: 'Active', next: 'Next: Sep 30, 2026', amount: '$1,250.00', paid: 3, of: 5, failed: 0, freq: 'Monthly', total: '$6,250.00', who: 'Marcus Webb', brand: 'AMEX', last4: '••••1007', event: 'Pricing Event 637236', res: 'Omni Tempe Hotel at ASU RES-5398840' },
  { id: 'SUB-2026-0041', status: 'Past Due', next: 'Retrying Sep 30, 2026', amount: '$515.00', paid: 2, of: 5, failed: 1, freq: 'Monthly', total: '$2,575.00', who: 'Hannah Reyes', brand: 'PayPal', last4: '••••7730', event: 'Pricing Event 539073', res: 'Marriott Tempe at The Buttes RES-5396218' },
  { id: 'SUB-2026-0039', status: 'Active', next: 'Next: Oct 3, 2026', amount: '$300.75', paid: 2, of: 4, failed: 0, freq: 'Every 2 weeks', total: '$1,203.00', who: 'Priya Raman', brand: 'AMEX', last4: '••••3315', event: 'Pricing Event 539073', res: 'Marriott Tempe at The Buttes RES-5403312' },
  { id: 'SUB-2026-0036', status: 'Active', next: 'Next: Oct 20, 2026', amount: '$453.00', paid: 1, of: 3, failed: 0, freq: 'Monthly', total: '$1,359.00', who: 'Elena Fischer', brand: 'VISA', last4: '••••8821', event: 'Automated Playwright Live Event 340366', res: 'Hyatt Regency Seattle RES-5401175' },
  { id: 'SUB-2026-0031', status: 'Completed', next: 'Completed Sep 16, 2026', amount: '$684.00', paid: 3, of: 3, failed: 0, freq: 'Monthly', total: '$2,052.00', who: 'Jordan Alvarez', brand: 'VISA', last4: '••••8821', event: 'Automated Playwright Live Event 340366', res: 'Hyatt Regency Seattle RES-5388930' },
  { id: 'SUB-2026-0027', status: 'Completed', next: 'Completed Aug 18, 2026', amount: '$1,075.00', paid: 2, of: 2, failed: 0, freq: 'Monthly', total: '$2,150.00', who: 'Grace Lindqvist', brand: 'VISA', last4: '••••1188', event: 'Automated Playwright Live Event 340366', res: 'Hyatt Regency Seattle RES-5341907' },
  { id: 'SUB-2026-0022', status: 'Canceled', next: 'Canceled Aug 21, 2026', amount: '$365.00', paid: 1, of: 2, failed: 0, freq: 'Monthly', total: '$730.00', who: 'Noah Klein', brand: 'Klarna', last4: '••••2914', event: 'Pricing Event 539073', res: 'Marriott Tempe at The Buttes RES-5384467' },
]

const FILTERS = [
  { key: 'active', label: 'Active', count: 18, total: '$38,420.00 to collect', pages: 2, match: (p) => p.status === 'Active' },
  { key: 'pastdue', label: 'Past Due', count: 2, total: '$1,030.00 overdue', pages: 1, match: (p) => p.status === 'Past Due' },
  { key: 'completed', label: 'Completed', count: 41, total: '$97,315.50 collected', pages: 5, match: (p) => p.status === 'Completed' },
  { key: 'canceled', label: 'Canceled', count: 5, total: '$4,880.00 not collected', pages: 1, match: (p) => p.status === 'Canceled' },
  { key: 'all', label: 'All', count: 66, total: '$141,645.50 scheduled', pages: 7, match: null },
]

/** CHART CONCEPT — every plan's installments by the month they fall in.
 *  Sep carries both past-due charges (Hannah Reyes' $515 and one more — the
 *  Past Due tile's $1,030) and Marcus Webb's $1,250 still to run on Sep 30.
 *  Scheduled Sep–Jan sums to the Active tile's $38,420. A past month has $0
 *  scheduled and a future one $0 collected — real zeros, not missing. */
const COLLECTION_BY_MONTH = {
  labels: ['2026-06-01', '2026-07-01', '2026-08-01', '2026-09-01', '2026-10-01', '2026-11-01', '2026-12-01', '2027-01-01'],
  series: [
    { key: 'collected', label: 'Collected', data: [9860, 14215, 16930, 13405, 0, 0, 0, 0] },
    { key: 'pastdue', label: 'Past due', data: [0, 0, 0, 1030, 0, 0, 0, 0] },
    { key: 'scheduled', label: 'Scheduled', color: 'comparison', data: [0, 0, 0, 1250, 12480, 11215, 8640, 4835] },
  ],
}

const COLUMNS = [
  { name: 'status', label: 'Status & Next Charge', field: 'status', align: 'left' },
  { name: 'amount', label: 'Installments', field: 'amount', align: 'left' },
  { name: 'customer', label: 'Customer & Payment', field: 'who', align: 'left' },
  { name: 'details', label: 'Details', field: 'event', align: 'left' },
  ACTIONS_COL,
]

/** Hannah Reyes' plan, installment by installment — the Detail story. */
const HANNAH = PLANS[1]
const SCHEDULE = [
  { n: 1, status: 'Paid', date: 'Jul 26, 2026', amount: '$515.00', note: 'TXN-2026-14622' },
  { n: 2, status: 'Paid', date: 'Aug 26, 2026', amount: '$515.00', note: 'TXN-2026-16310' },
  { n: 3, status: 'Failed', date: 'Sep 26, 2026', amount: '$515.00', note: 'Declined by PayPal · retrying Sep 30' },
  { n: 4, status: 'Scheduled', date: 'Oct 26, 2026', amount: '$515.00', note: '' },
  { n: 5, status: 'Scheduled', date: 'Nov 26, 2026', amount: '$515.00', note: '' },
]
const SCHEDULE_COLUMNS = [
  { name: 'n', label: 'Installment', field: 'n', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'date', label: 'Date', field: 'date', align: 'left' },
  { name: 'amount', label: 'Amount', field: 'amount', align: 'left' },
  { name: 'note', label: 'Transaction', field: 'note', align: 'left' },
]

/** One segment per installment, coloured the way the Balances bar is.
 *
 *  Deliberately NOT a chart component. It is a discrete progress meter — "3 of
 *  5 paid", one cell per charge, like a stepper — not a share of an amount.
 *  DsStackedBarChart would draw continuous shares (losing the per-installment
 *  cells), needs axis room a 140×6px table cell does not have, and its series
 *  colours are categorical only, so Paid/Failed could not wear the success /
 *  danger status fills they carry here. */
const segmentsFor = (p) => Array.from({ length: p.of }, (_, i) => {
  if (i < p.paid) return 'var(--ds-color-background-success-bold)'
  if (i < p.paid + p.failed) return 'var(--ds-color-background-danger-bold)'
  return 'var(--ds-color-background-neutral)'
})

const BAR = (expr) => `
  <div style="display:flex; gap:3px; width:140px; margin-top:6px;" role="img"
    :aria-label="${expr}.paid + ' of ' + ${expr}.of + ' installments paid'">
    <span v-for="(c, i) in segments(${expr})" :key="i"
      :style="'flex:1; height:6px; border-radius:var(--ds-radius-pill); background:' + c"></span>
  </div>`

/* ---------------------------------------------------------------------------
 * List
 * ------------------------------------------------------------------------- */

const CREATE_BTN = `<q-btn unelevated no-caps color="primary" icon="add" label="Create Plan"
  style="padding:0 20px; font-weight:700;" @click="createOpen = true" />`

const table = `
  <q-table class="ds-table" :rows="visible" :columns="columns" row-key="id"
    flat bordered :pagination="{ rowsPerPage: 0 }"
    no-data-label="No plans on this page match that filter.">
    ${EDIT_COLUMNS_HEADER}

    <template #body-cell-status="props">
      <q-td :props="props" style="${TD}">
        <span :style="chipFor(props.row.status)">{{ props.row.status }}</span>
        <div style="${EP_CAPTION} margin-top:6px;">{{ props.row.next }}</div>
      </q-td>
    </template>

    <template #body-cell-amount="props">
      <q-td :props="props" style="${TD}">
        <div><span style="font-weight:700;">{{ props.row.amount }}</span>
          <span style="${EP_CAPTION}"> × {{ props.row.of }} · {{ props.row.freq }}</span></div>
        ${BAR('props.row')}
        <div style="${EP_CAPTION} margin-top:4px;">{{ props.row.paid }} of {{ props.row.of }} paid | {{ props.row.id }}</div>
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

    <template #body-cell-details="props">
      <q-td :props="props" style="${TD}">
        <a href="#" class="eppay-link" @click.prevent
          style="display:block; line-height:1.35; color:var(--ds-color-text); font-weight:400;">{{ props.row.event }}</a>
        <div style="${EP_CAPTION} margin-top:2px; line-height:1.35;">{{ props.row.res }}</div>
      </q-td>
    </template>

    ${rowMenu('props.row.id', "[{ label: 'View plan', icon: 'visibility', to: 'subscriptions/detail' }, { label: 'Retry failed payment', icon: 'replay', confirm: { title: 'Retry the failed installment?', message: 'The card on file is charged again now.', okLabel: 'Retry payment' } }, { label: 'Copy plan ID', icon: 'content_copy', copy: props.row.id }, { label: 'Cancel plan', icon: 'cancel', danger: true, dividerBefore: true, confirm: { title: 'Cancel this plan?', message: 'No further installments are charged. Paid installments are not refunded.', okLabel: 'Cancel plan' } }]")}
    ${pager('plans')}
  </q-table>`

const emptyBody = `
  <ds-empty-state icon="autorenew" title="No installment plans yet"
    description="Split a reservation's total into scheduled charges on the customer's card. Each charge shows up in Transactions against the same event and reservation.">
    <template #action>${CREATE_BTN}</template>
  </ds-empty-state>`

/* Form left, the schedule it produces right — the schedule is the thing the
   merchant is actually agreeing to, so it is never hidden behind a Next. */
const createDialog = `
  <ds-modal v-model="createOpen" title="Create Installment Plan" size="lg">
    <div style="display:grid; grid-template-columns:1.25fr 1fr; gap:28px;">
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; align-content:start;">
        <ds-select v-model="form.customer" :options="customers" label="Customer" required searchable style="grid-column:1 / -1;" />
        <ds-select v-model="form.event" :options="events" label="Event" required />
        <ds-input v-model="form.res" label="Reservation" required placeholder="RES-" />
        <ds-input v-model="form.total" label="Total" type="currency" required />
        <ds-input v-model="form.count" label="Installments" type="number" stepper :min="2" :max="12" required />
        <ds-select v-model="form.freq" :options="freqs" label="Frequency" required />
        <ds-input v-model="form.start" label="First charge" type="date" required />

        <div style="grid-column:1 / -1;">
          <div style="font-weight:700; color:var(--ds-color-text); margin:4px 0 10px;">Charge</div>
          <div style="display:flex; flex-direction:column; gap:10px;">
            <a v-for="m in methods" :key="m.key" href="#" @click.prevent="form.method = m.key"
              :style="'display:flex; align-items:center; gap:10px; border-radius:var(--ds-radius-lg); text-decoration:none; color:inherit; ' + pick(form.method === m.key)">
              <q-radio v-model="form.method" :val="m.key" color="primary" dense />
              <span v-if="m.brand" style="${BRAND_CHIP}">{{ m.brand }}</span>
              <span style="font-weight:700; color:var(--ds-color-text);">{{ m.title }}</span>
              <span style="flex:1;" />
              <span style="${EP_CAPTION}">{{ m.sub }}</span>
            </a>
          </div>
        </div>
      </div>

      <div style="border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-lg); overflow:hidden; align-self:start;">
        <div style="display:flex; align-items:center; padding:12px 18px; background:var(--ds-color-surface-sunken);">
          <span style="${MICRO}">Schedule</span>
          <span style="flex:1;" />
          <span style="${MICRO}">{{ schedule.length }} charges · {{ money(form.total) }}</span>
        </div>
        <div v-for="(s, i) in schedule" :key="i"
          style="display:flex; align-items:center; gap:12px; padding:12px 18px; border-top:1px solid var(--ds-color-border-container);">
          <span style="${EP_CAPTION} width:22px;">{{ i + 1 }}</span>
          <span style="color:var(--ds-color-text);">{{ s.date }}</span>
          <span style="flex:1;" />
          <span style="font-weight:700; color:var(--ds-color-text);">{{ s.amount }}</span>
        </div>
        <div style="${EP_CAPTION} padding:12px 18px; border-top:1px solid var(--ds-color-border-container);">
          Any rounding difference is added to the last charge.
        </div>
      </div>
    </div>

    <template #footer="{ close }">
      <div style="display:flex; justify-content:flex-end; gap:12px; width:100%;">
        <q-btn flat no-caps label="Cancel" color="grey-8" style="padding:0 22px;" @click="close" />
        <q-btn unelevated no-caps label="Create Plan" color="primary" :disable="!canCreate"
          style="padding:0 26px; font-weight:700;" />
      </div>
    </template>
  </ds-modal>`

/** CHART CONCEPT — see ChartConceptCollection. */
const collectionChart = `
  <div style="margin-bottom:20px;">
    <ds-chart-card title="Installments by month" subtitle="All plans · collected, past due and still scheduled" table-toggle>
      <template #default="{ view }">
        <ds-stacked-bar-chart :labels="collection.labels" :series="collection.series" label-format="month-year"
          value-format="currency" :height="240" :view="view" />
      </template>
      <template #footer>$38,420.00 is still scheduled across 18 active plans; the last charge runs in January 2027.</template>
    </ds-chart-card>
  </div>`

const LIST_SLOT = (empty, chart = false) => `
  <div style="${EP_PAGE}">
    ${conceptHeader('Subscriptions', { actions: CREATE_BTN })}
    ${chart ? collectionChart : ''}
    ${epCard(empty ? emptyBody : `${filterTiles(5)}${listToolbar('Search plans, customers or reservations')}${table}`)}
  </div>
  ${createDialog}`

const FREQS = ['Weekly', 'Every 2 weeks', 'Monthly']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const money = (n) => (Number(n) || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })

/** Deterministic schedule: UTC dates, cents split evenly, remainder on the
 *  last charge (which is what the note under the schedule promises). */
function buildSchedule({ total, count, freq, start }) {
  const n = Math.max(1, Math.min(12, Number(count) || 1))
  const cents = Math.round((Number(total) || 0) * 100)
  const each = Math.floor(cents / n)
  const [y, m, d] = String(start || '2026-09-30').split('-').map(Number)
  return Array.from({ length: n }, (_, i) => {
    const dt = freq === 'Monthly'
      ? new Date(Date.UTC(y, m - 1 + i, d))
      : new Date(Date.UTC(y, m - 1, d + i * (freq === 'Weekly' ? 7 : 14)))
    const amt = i === n - 1 ? cents - each * (n - 1) : each
    return { date: `${MONTHS[dt.getUTCMonth()]} ${dt.getUTCDate()}, ${dt.getUTCFullYear()}`, amount: money(amt / 100) }
  })
}

function listState({ createOpen = false, filled = false } = {}) {
  const active = ref('active')
  const current = computed(() => FILTERS.find((f) => f.key === active.value) || FILTERS[0])
  const form = ref(filled
    ? { customer: 'Chris Okonkwo', event: EVENTS[0], res: 'RES-5405530', total: 2286, count: 3, freq: 'Monthly', start: '2026-09-30', method: 'saved' }
    : { customer: null, event: null, res: '', total: '', count: 3, freq: 'Monthly', start: '', method: 'request' })
  return {
    filters: FILTERS,
    columns: COLUMNS,
    active,
    current,
    visible: computed(() => (current.value.match ? PLANS.filter(current.value.match) : PLANS)),
    query: ref(''),
    createOpen: ref(createOpen),
    form,
    customers: customerNames,
    events: EVENTS,
    freqs: FREQS,
    methods: [
      { key: 'saved', brand: 'Mastercard', title: '••••5309', sub: 'Saved card, last used Aug 18, 2026' },
      { key: 'request', brand: '', title: 'Ask the customer for a card', sub: 'We email them a link' },
    ],
    schedule: computed(() => buildSchedule(form.value)),
    money,
    pick,
    segments: segmentsFor,
    chipFor: conceptChip,
    collection: COLLECTION_BY_MONTH,
    canCreate: computed(() => !!(form.value.customer && form.value.event && form.value.res && form.value.total && form.value.start)),
  }
}

const COMPONENTS = { DsSearch, DsStat, DsModal, DsInput, DsSelect, DsInfoGrid, DsEmptyState, DsChartCard, DsStackedBarChart }

const listStory = (opts = {}) => epPage({
  active: 'subscriptions',
  components: COMPONENTS,
  setup: () => listState(opts),
  slot: LIST_SLOT(!!opts.empty, !!opts.chart),
})

/* ---------------------------------------------------------------------------
 * Detail — the past-due plan, because it is the state with decisions in it.
 * ------------------------------------------------------------------------- */

const DETAIL_SLOT = `
  <div style="${EP_PAGE}">
    <q-breadcrumbs active-color="primary" gutter="sm" class="text-body2" style="margin-bottom:12px;">
      <q-breadcrumbs-el label="Subscriptions" href="#" />
      <q-breadcrumbs-el label="${HANNAH.id}" class="text-grey-7" />
    </q-breadcrumbs>

    ${conceptHeader(`${HANNAH.who} · ${HANNAH.total} plan`, {
      actions: `
        <q-btn outline no-caps color="negative" label="Cancel Plan" style="padding:0 18px;" />`,
    })}

    <div role="status" :style="'display:flex; align-items:center; gap:14px; padding:16px 20px; margin-bottom:20px; border-radius:var(--ds-radius-lg); border:1px solid var(--ds-color-border-container); background:' + warn.bg + '; color:' + warn.fg + ';'">
      <q-icon name="error_outline" size="22px" />
      <div style="flex:1; line-height:1.45;">
        <strong>Installment 3 of 5 failed on Sep 26, 2026.</strong>
        PayPal declined the charge. We'll retry automatically on Sep 30, and Hannah has been emailed a link to update her payment method.
      </div>
      <q-btn outline no-caps color="primary" label="Send Update Link" style="padding:0 16px; background:var(--ds-color-surface);" />
      <q-btn unelevated no-caps color="primary" label="Retry Now" style="padding:0 18px; font-weight:700;" />
    </div>

    ${epCard(`
      <div style="display:flex; gap:40px; align-items:flex-start; flex-wrap:wrap;">
        <div style="flex:2 1 460px; min-width:0;">
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
            <span :style="chipFor(plan.status)">{{ plan.status }}</span>
            <span style="${EP_CAPTION}">{{ plan.id }}</span>
          </div>
          <ds-info-grid :items="details" layout="stacked" min-col-width="200px" />
        </div>
        <div style="flex:1 1 280px; padding-left:32px; border-left:1px solid var(--ds-color-border-container);">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px 24px;">
            <ds-stat value="$1,030.00" label="Collected" />
            <ds-stat value="$1,545.00" label="Remaining" />
          </div>
          <div style="${MICRO} margin-top:22px;">Progress</div>
          ${BAR('plan').replace('width:140px', 'width:100%').replace('height:6px', 'height:10px')}
        </div>
      </div>`)}

    ${epCard(`
      <div style="${EP_H2}">Schedule</div>
      <q-table class="ds-table" :rows="schedule" :columns="scheduleColumns" row-key="n"
        flat bordered hide-bottom :pagination="{ rowsPerPage: 0 }">
        <template #body-cell-n="props">
          <q-td :props="props" style="${TD}">{{ props.row.n }} of 5</q-td>
        </template>
        <template #body-cell-status="props">
          <q-td :props="props" style="${TD}">
            <span :style="chipFor(props.row.status)">{{ props.row.status }}</span>
          </q-td>
        </template>
        <template #body-cell-amount="props">
          <q-td :props="props" style="${TD} font-weight:700;">{{ props.row.amount }}</q-td>
        </template>
        <template #body-cell-note="props">
          <q-td :props="props" style="${TD}">
            <a v-if="props.row.status === 'Paid'" href="#" class="eppay-link" @click.prevent>{{ props.row.note }}</a>
            <span v-else style="${EP_CAPTION}">{{ props.row.note || '—' }}</span>
          </q-td>
        </template>
      </q-table>`)}
  </div>`

function detailState() {
  return {
    plan: HANNAH,
    warn: conceptTint('Past Due'),
    details: [
      { label: 'Customer', value: HANNAH.who },
      { label: 'Charged to', value: `PayPal ${HANNAH.last4}` },
      { label: 'Event', value: HANNAH.event },
      { label: 'Reservation', value: HANNAH.res },
      { label: 'Installments', value: `5 × ${HANNAH.amount}, monthly` },
      { label: 'Created', value: 'Jul 20, 2026 by Mike Addesa' },
    ],
    schedule: SCHEDULE,
    scheduleColumns: SCHEDULE_COLUMNS,
    segments: segmentsFor,
    chipFor: conceptChip,
    txChip: statusChip,
  }
}

/* ---------------------------------------------------------------------------
 * Stories — `List` MUST stay the first export (standalone prototype).
 * ------------------------------------------------------------------------- */

/** Landing screen: plans still collecting, with the progress bar on each. */
export const List = listStory()

/** The past-due plan: failure banner, progress, and the full schedule. */
export const Detail = epPage({
  active: 'subscriptions',
  components: COMPONENTS,
  setup: detailState,
  slot: DETAIL_SLOT,
})
Detail.storyName = 'Detail · Past due plan'

/** Create, filled in: Chris Okonkwo's $2,286.00 over three monthly charges on
 *  his saved card. Change the total, count or frequency and the schedule
 *  follows. */
export const Create = listStory({ createOpen: true, filled: true })
Create.storyName = 'Create · Installment plan'

/** First run — no plans yet. */
export const Empty = listStory({ empty: true })
Empty.storyName = 'Empty · first run'

/** **Chart concept · Installments by month** — the List with a month-by-month
 *  view of what the plans have collected and have still to collect.
 *
 *  *Question it answers:* "How much cash are installment plans bringing in,
 *  month by month — and how much has slipped?" The tiles give totals (to
 *  collect, overdue, collected) but not *when*; a merchant planning payouts
 *  needs the shape: October is the peak, then it tails off to January.
 *
 *  *Why a stacked bar:* the Charts Overview's Stacked Bar is for composition
 *  per category where both total and split matter — each month's bar is its
 *  installments, split into collected, past due and still scheduled.
 *  "Scheduled" wears the neutral comparison colour because it has not
 *  happened yet. (A plan-health chart was considered: plan status is already
 *  five tiles with counts, so a donut of the same five numbers adds nothing.)
 *
 *  *Adds:* one chart card between the header and the list; the list and its
 *  per-plan progress meters are unchanged. */
export const ChartConceptCollection = listStory({ chart: true })
ChartConceptCollection.storyName = 'Chart concept · Installments by month'
