/** EP Pay / Screens / 03 · Balances.
 *
 *  The merchant's money page: what the account holds right now (Balance
 *  Summary), the way to move it out (Get My Funds), and where it has already
 *  gone (Payouts). The three 09/28 captures set that structure; the colour,
 *  type and components are the design system's.
 *
 *  Built out of the same three pieces Teams Mgmt Comms Phase 2 is built out of:
 *  `epHeader()` for the title row, `epCard()` (`q-card flat bordered`) for the
 *  panels, and a `q-table class="ds-table"` for the ledger.
 *
 *  Three decisions worth stating:
 *
 *  1. The balance split is a DsStackedBarChart share bar (single row, 100%)
 *     fed from BALANCE_SUMMARY.rows' numeric values, not fixed widths. A
 *     hard-coded bar drifts the moment the fixture changes, and a balance bar
 *     that disagrees with the numbers beside it is worse than no bar at all.
 *     It also brings a tooltip, keyboard access and a hidden data table.
 *
 *  2. The segments wear the chart palette in its fixed order (chart-1 · 2 · 3),
 *     and each row icon beneath wears its segment's colour, so the rows double
 *     as the bar's key. They are no longer the DS status colours: the chart
 *     components only take categorical slots, and the Charts Overview reserves
 *     status colour for good/bad meaning — Held money is not an error. The
 *     row icons (check / clock / lock) still carry the meaning.
 *
 *  3. The Get My Funds dialog is `DsModal` — the design system's own centred
 *     dialog, which owns the backdrop, the header and close button, ESC and
 *     click-outside, and the body scroll lock. It teleports to <body>, so the
 *     one link inside it is `DsLink` rather than the `.eppay-link` class, which
 *     is scoped under `.eppay` and would not reach a teleported dialog.
 */
import { ref, computed } from 'vue'
import { epPage, epHeader, epCard, EP_CARD, EP_CAPTION, EP_H2, EP_PAGE, BALANCE_SUMMARY, PAYOUTS, statusChip, toneChip } from './_eppay'
import DsStackedBarChart from '../../components/charts/DsStackedBarChart.vue'
import DsChartCard from '../../components/charts/DsChartCard.vue'
import DsSearch from '../../components/DsSearch.vue'
import DsModal from '../../components/DsModal.vue'
import DsLink from '../../components/DsLink.vue'

export default {
  title: 'EP Pay/Screens/03 · Balances',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Balance Summary, a live Get My Funds dialog, and the payouts ledger. Click either release option in the dialog to switch between releasing everything and picking transactions.' } },
  },
}

/** Chart colour slot per balance bucket, in the palette's fixed order. The
 *  bar segment and the row icon below it resolve from this one map, so they
 *  cannot drift apart. */
const BUCKET_SLOT = { available: 'chart-1', soon: 'chart-2', held: 'chart-3' }

/** The balance split as a one-row share bar: one series per bucket. */
const balanceSplit = {
  labels: ['Balance'],
  series: BALANCE_SUMMARY.rows.map((r) => ({ key: r.key, label: r.label, color: BUCKET_SLOT[r.key], data: [r.value] })),
  /** Spoken summary: each bucket's amount and share, from the same numbers. */
  ariaLabel: 'Balance split: ' + BALANCE_SUMMARY.rows
    .map((r) => `${r.label} ${r.amount} (${Math.round((r.value / BALANCE_SUMMARY.totalAmount) * 100)}%)`)
    .join(', '),
}

/** An uppercase eyebrow label. The only type style on this screen the shared
 *  constants do not already cover — EP_CAPTION is the sentence-case muted line,
 *  this is the all-caps section marker above a number. */
const MICRO = 'font-size:0.75rem; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:var(--ds-color-text-subtle);'

/** Dollar string → number, for anything that has to add up. */
const usd = (s) => Number(String(s).replace(/[^0-9.]/g, '')) * (String(s).trim().startsWith('−') ? -1 : 1)

/* ---------------------------------------------------------------------------
 * Balance Summary
 * ------------------------------------------------------------------------- */

/* The summary block is deliberately not DsStat and not DsStatus. DsStat is a
   value stacked over a muted label at 1.375rem; this is an eyebrow over a
   2.25rem total with an item count beside it, and the three rows below are
   navigation — icon, label, count, amount, chevron — not KPI cells. DsStatus is
   a status dot or pill; Available / Available Soon / Held are balance buckets
   that each carry their own icon, which a dot would throw away. */
const summaryCard = epCard(`
  <div style="${EP_H2}">Balance Summary</div>

  <div style="border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-lg); overflow:hidden;">
    <div style="display:flex; align-items:flex-start; gap:24px; padding:22px 24px;">
      <div style="flex:1; min-width:0;">
        <div style="${MICRO}">Total EventPipe Pay Balance</div>
        <div style="display:flex; align-items:baseline; gap:12px; margin:6px 0 14px;">
          <span style="font-size:2.25rem; font-weight:700; color:var(--ds-color-text); line-height:1;">{{ summary.total }}</span>
          <span style="${EP_CAPTION}">{{ summary.items }} items</span>
        </div>

        <!-- Legend off: the three rows below are the key (icon in the segment's
             colour, label, amount), so a legend here would say it twice. -->
        <div style="max-width:660px;">
          <ds-stacked-bar-chart percent horizontal :labels="split.labels" :series="split.series"
            value-format="currency" bare :height="28" :show-grid="false" :show-legend="false"
            :aria-label="split.ariaLabel" />
        </div>
      </div>

      <q-btn unelevated no-caps color="primary" label="Get My Funds" @click="openFunds"
        style="flex:none; padding:0 22px; font-size:1rem; font-weight:700;" />
    </div>

    <a v-for="r in summary.rows" :key="r.key" href="#" @click.prevent
      style="display:flex; align-items:center; gap:12px; padding:15px 24px;
             border-top:1px solid var(--ds-color-border-container);
             text-decoration:none; color:inherit;">
      <q-icon :name="r.icon" size="20px" :style="'color:' + r.color" />
      <span style="font-weight:700; color:var(--ds-color-text);">{{ r.label }}</span>
      <span style="flex:1;" />
      <span style="${EP_CAPTION}">{{ r.items }} items</span>
      <span style="font-size:1.0625rem; font-weight:700; color:var(--ds-color-text); min-width:104px; text-align:right;">{{ r.amount }}</span>
      <q-icon name="chevron_right" size="20px" style="color:var(--ds-color-icon-subtle);" />
    </a>
  </div>`)

/* ---------------------------------------------------------------------------
 * Payouts
 * ------------------------------------------------------------------------- */

/** The ledger's columns. Four data columns, each one a pair of lines — the
 *  value on top and its muted qualifier under it — plus a trailing column for
 *  the row menu, whose header carries the edit-columns control.
 *
 *  `field` is what the column sorts and filters on; every cell is drawn by its
 *  own `#body-cell-*` slot, because all four hold two lines. */
const PAYOUT_COLUMNS = [
  { name: 'status', label: 'Status & ID', field: 'status', align: 'left' },
  { name: 'amount', label: 'Amount & Type', field: 'amount', align: 'left' },
  { name: 'account', label: 'Account', field: 'account', align: 'left' },
  { name: 'dates', label: 'Dates', field: 'created', align: 'left' },
  { name: 'actions', label: '', field: 'id', align: 'right' },
]

/* The ledger is a QTable wearing `.ds-table`, so the Azure brand header, the
   zebra rows and the rounded outline all come from that class. It used to be a
   grid of divs with the brand-bold header colour copied onto a div — two
   implementations of one table header, which drift the moment either moves. */
const payoutsCard = epCard(`
  <div style="${EP_H2}">Payouts</div>

  <div style="display:flex; align-items:center; gap:16px; margin-bottom:18px;">
    <div style="width:100%; max-width:490px;">
      <ds-search v-model="query" placeholder="Search payouts" />
    </div>
    <span style="flex:1;" />
    <q-btn outline no-caps color="primary" icon="filter_alt" label="Filter" style="padding:0 18px;" />
    <q-btn outline no-caps color="primary" icon="file_download" label="Export" style="padding:0 18px;" />
  </div>

  <q-table class="ds-table" :rows="payouts" :columns="payoutColumns" row-key="id"
    flat bordered :pagination="{ rowsPerPage: 0 }">

    <template #header-cell-actions="props">
      <q-th :props="props">
        <q-btn flat dense icon="edit" text-color="white" aria-label="Edit columns"
          style="border:1px solid color-mix(in srgb, var(--ds-color-text-inverse) 35%, transparent);
                 border-radius:var(--ds-radius-sm);" />
      </q-th>
    </template>

    <template #body-cell-status="props">
      <q-td :props="props">
        <span :style="props.row.chip">{{ props.row.status }}</span>
        <div style="${EP_CAPTION} margin-top:6px;">{{ props.row.id }}</div>
      </q-td>
    </template>

    <template #body-cell-amount="props">
      <q-td :props="props">
        <div style="font-weight:700; color:var(--ds-color-text);">{{ props.row.amount }}</div>
        <div style="${EP_CAPTION} margin-top:2px;">{{ props.row.type }}</div>
      </q-td>
    </template>

    <template #body-cell-account="props">
      <q-td :props="props">
        <div style="display:flex; align-items:flex-start; gap:10px;">
          <q-icon :name="props.row.accountIcon" size="20px" style="color:var(--ds-color-icon-subtle); margin-top:2px;" />
          <div style="min-width:0;">
            <div>{{ props.row.account }}</div>
            <div style="${EP_CAPTION} margin-top:2px;">{{ props.row.accountSub }}</div>
          </div>
        </div>
      </q-td>
    </template>

    <template #body-cell-dates="props">
      <q-td :props="props">
        <div>{{ props.row.created }}</div>
        <div style="${EP_CAPTION} margin-top:2px;">{{ props.row.settled }}</div>
      </q-td>
    </template>

    <template #body-cell-actions="props">
      <q-td :props="props">
        <ds-action-menu :label="'Actions for ' + props.row.id" :items="[
          { label: 'View payout', icon: 'visibility' },
          { label: 'Copy payout ID', icon: 'content_copy', copy: props.row.id },
          { label: 'Download statement', icon: 'file_download' },
        ]" />
      </q-td>
    </template>

    <template #bottom>
      <!-- The design system's pager (DsPagination). The ledger shows one static
           page of the 33 payouts, so the control responds but rows don't page. -->
      <ds-pagination :total="33" :page-size="payouts.length" noun="payouts" style="width:100%;" />
    </template>
  </q-table>`)

/* ---------------------------------------------------------------------------
 * Get My Funds — the dialog from the 21_02_28 and 21_02_38 captures.
 * ------------------------------------------------------------------------- */

/** The four released-soon transactions the "release some" capture lists. */
const RELEASABLE = [
  { id: 'TXN-2026-20400', amount: '$412.80', when: 'Aug 20, 2026 · 2:51 PM', type: 'Sale', who: 'Jordan Alvarez', pay: 'Visa ••••8821', event: 'Automated Playwright Live Event 340366', res: 'Hyatt Regency Seattle RES-5381879' },
  { id: 'TXN-2026-20429', amount: '$298.45', when: 'Aug 20, 2026 · 8:10 AM', type: 'Sale', who: 'Priya Raman', pay: 'Klarna ••••2914', event: 'Pricing Event 539073', res: 'Marriott Tempe at The Buttes RES-5379550' },
  { id: 'TXN-2026-20458', amount: '$301.30', when: 'Aug 19, 2026 · 10:36 AM', type: 'Sale', who: 'Marcus Webb', pay: 'Discover ••••6011', event: 'Automated Playwright Live Event 340366', res: 'Hyatt Regency Seattle RES-5379824' },
  { id: 'TXN-2026-20487', amount: '$192.00', when: 'Aug 19, 2026 · 3:55 PM', type: 'Sale', who: 'Elena Fischer', pay: 'PayPal ••••7730', event: 'Pricing Event 539073', res: 'Marriott Tempe at The Buttes RES-5377495' },
]

const METHODS = [
  { key: 'standard', title: 'Standard', icon: 'schedule', dest: 'Chase Bank ••••4321', destIcon: 'account_balance', blurb: 'Funds arrive in 3–5 business days. Exact timing varies by bank.', fee: 'No fee', feeTone: 'positive' },
  { key: 'instant-bank', title: 'Instant', icon: 'bolt', dest: 'Chase Bank ••••4321', destIcon: 'account_balance', blurb: 'Funds arrive in minutes.', fee: '2% fee, capped at $25.00', feeTone: 'warning' },
  { key: 'instant-card', title: 'Instant', icon: 'bolt', dest: 'New Visa virtual card', destIcon: 'credit_card', blurb: 'Funds arrive in seconds and can be used anywhere Visa is accepted.', fee: 'No fee', feeTone: 'positive' },
]

/** Selected state for any choice card in the dialog: the DS selected pair — a
 *  brand edge over the palest brand wash. The padding drops by a pixel on the
 *  selected card so the thicker border does not nudge the row taller. */
const pick = (on) => (on
  ? 'border:2px solid var(--ds-color-border-brand); background:var(--ds-color-background-brand-subtlest); padding:15px 17px;'
  : 'border:1px solid var(--ds-color-border-container); background:var(--ds-color-surface); padding:16px 18px;')

const fundsDialog = `
  <ds-modal v-model="fundsOpen" title="Get My Funds" size="lg">
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
      <a v-for="m in ['all','some']" :key="m" href="#" @click.prevent="mode = m"
        :style="'display:block; border-radius:var(--ds-radius-lg); text-decoration:none; color:inherit; ' + pick(mode === m)">
        <div style="display:flex; align-items:center; gap:10px;">
          <q-radio v-model="mode" :val="m" color="primary" dense />
          <span style="font-weight:700; color:var(--ds-color-text);">
            {{ m === 'all' ? 'Release all available funds' : 'Release some of my funds' }}
          </span>
        </div>
        <div style="font-size:1.5rem; font-weight:700; color:var(--ds-color-text); margin:8px 0 2px;">
          {{ m === 'all' ? summary.rows[0].amount : selectedTotal }}
        </div>
        <div style="${EP_CAPTION}">
          {{ m === 'all' ? summary.rows[0].items + ' items' : 'Choose which transactions to release' }}
        </div>
      </a>
    </div>

    <!-- A list of tick-boxes rather than a second .ds-table: it has no column
         headers by design, and the whole row is the checkbox's label, which is
         what makes the whole row clickable. A QTable would add a header band
         inside the dialog that the screen does not have. -->
    <div v-if="mode === 'some'" style="margin-top:18px; border:1px solid var(--ds-color-border-container);
                border-radius:var(--ds-radius-lg); overflow:hidden;">
      <div style="display:flex; align-items:center; gap:12px; padding:12px 18px;
                  background:var(--ds-color-surface-sunken);">
        <span style="${MICRO}">Select transactions</span>
        <span style="flex:1;" />
        <span style="${MICRO}">{{ selected.length }} selected · {{ selectedTotal }}</span>
      </div>
      <label v-for="t in releasable" :key="t.id"
        style="display:grid; grid-template-columns:44px 1.1fr 1.2fr 1.1fr 1.6fr; align-items:center;
               gap:10px; padding:12px 18px; border-top:1px solid var(--ds-color-border-container); cursor:pointer;">
        <q-checkbox v-model="selected" :val="t.id" color="primary" dense :aria-label="'Release ' + t.id" />
        <div>
          <span :style="chipFor('Success')">Success</span>
          <div style="${EP_CAPTION} margin-top:6px;">{{ t.when }}</div>
        </div>
        <div>
          <div style="font-weight:700; color:var(--ds-color-text);">{{ t.amount }}</div>
          <div style="${EP_CAPTION} margin-top:2px;">{{ t.type }} | {{ t.id }}</div>
        </div>
        <div>
          <div style="color:var(--ds-color-text);">{{ t.who }}</div>
          <div style="${EP_CAPTION} margin-top:2px;">{{ t.pay }}</div>
        </div>
        <div>
          <div style="color:var(--ds-color-text); line-height:1.35;">{{ t.event }}</div>
          <div style="${EP_CAPTION} margin-top:2px; line-height:1.35;">{{ t.res }}</div>
        </div>
      </label>
    </div>

    <div style="display:flex; align-items:center; gap:12px; margin:22px 0 12px;">
      <h3 style="margin:0; font-size:1.0625rem; font-weight:700; color:var(--ds-color-text);">How do you want your funds?</h3>
      <span style="flex:1;" />
      <ds-link href="#" @click.prevent>
        <q-icon name="edit" size="16px" class="q-mr-xs" />Send to a different account
      </ds-link>
    </div>

    <div style="display:flex; flex-direction:column; gap:12px;">
      <a v-for="mth in methods" :key="mth.key" href="#" @click.prevent="method = mth.key"
        :style="'display:flex; align-items:flex-start; gap:12px; border-radius:var(--ds-radius-lg); text-decoration:none; color:inherit; ' + pick(method === mth.key)">
        <q-radio v-model="method" :val="mth.key" color="primary" dense />
        <q-icon :name="mth.icon" size="20px" style="color:var(--ds-color-text-brand); margin-top:2px;" />
        <div style="flex:1; min-width:0;">
          <div style="font-weight:700; color:var(--ds-color-text);">{{ mth.title }}</div>
          <div style="display:flex; align-items:center; gap:6px; margin:2px 0 4px;">
            <q-icon :name="mth.destIcon" size="16px" style="color:var(--ds-color-text-brand);" />
            <span style="color:var(--ds-color-text-brand); font-weight:700;">{{ mth.dest }}</span>
          </div>
          <div style="${EP_CAPTION}">{{ mth.blurb }}</div>
        </div>
        <span :style="chipTone(mth.feeTone)">{{ mth.fee }}</span>
      </a>
    </div>

    <template #footer="{ close }">
      <div style="display:flex; justify-content:flex-end; gap:12px; width:100%;">
        <q-btn flat no-caps label="Cancel" color="grey-8" style="padding:0 22px;" @click="close" />
        <q-btn unelevated no-caps label="Review" color="primary" :disable="reviewDisabled"
          style="padding:0 26px; font-weight:700;" />
      </div>
    </template>
  </ds-modal>`

const SLOT = `
  <div style="${EP_PAGE}">
    ${epHeader('Balances')}
    ${summaryCard}
    ${payoutsCard}
  </div>
  ${fundsDialog}`

/* ---------------------------------------------------------------------------
 * State
 * ------------------------------------------------------------------------- */

function state ({ fundsOpen = false, mode = 'all', method = 'standard' } = {}) {
  /* Both chips come from the shared helper: the payout status chips in the
     ledger and the fee chips in the dialog are the same object, so "No fee"
     and "Paid" are green for the same reason. */
  const chipTone = toneChip
  const chipFor = statusChip

  const selected = ref([])
  const modeRef = ref(mode)
  const open = ref(fundsOpen)
  const selectedTotal = computed(() => {
    const sum = RELEASABLE
      .filter((t) => selected.value.includes(t.id))
      .reduce((n, t) => n + usd(t.amount), 0)
    return '$' + sum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  })

  return {
    // Each summary row carries the colour of its own bar segment, so the icon
    // beside a number and the segment above it cannot drift apart.
    summary: { ...BALANCE_SUMMARY, rows: BALANCE_SUMMARY.rows.map((r) => ({ ...r, color: `var(--ds-color-${BUCKET_SLOT[r.key]})` })) },
    split: balanceSplit,
    payouts: PAYOUTS.map((p) => ({ ...p, chip: chipFor(p.status) })),
    payoutColumns: PAYOUT_COLUMNS,
    releasable: RELEASABLE,
    methods: METHODS,
    query: ref(''),
    fundsOpen: open,
    openFunds: () => { open.value = true },
    mode: modeRef,
    method: ref(method),
    selected,
    selectedTotal,
    // Nothing to review until the merchant has picked at least one transaction.
    reviewDisabled: computed(() => modeRef.value === 'some' && selected.value.length === 0),
    pick,
    chipTone,
    chipFor,
  }
}

const story = (opts) => epPage({
  active: 'balances',
  components: { DsSearch, DsModal, DsLink, DsStackedBarChart },
  setup: () => state(opts),
  slot: SLOT,
})

/** The page as it lands: balance split, payout ledger, and a live **Get My Funds** button. */
export const Default = story()

/** The dialog on its release-everything default — one amount, one destination. */
export const GetMyFunds = story({ fundsOpen: true })
GetMyFunds.storyName = 'Get My Funds · release everything'

/** The other half of the dialog: pick transactions, and the total (and Review)
 *  follow the boxes ticked. Instant-to-bank is pre-selected to show the fee chip. */
export const ReleaseSome = story({ fundsOpen: true, mode: 'some', method: 'instant-bank' })
ReleaseSome.storyName = 'Get My Funds · release some'

/* ---------------------------------------------------------------------------
 * Chart concepts — for approval. The stories above are unchanged by these.
 * ------------------------------------------------------------------------- */

/** "Created Aug 17, 2026" → "2026-08-17", for a date axis. */
const isoFrom = (created) => {
  const d = new Date(created.replace(/^Created /, '') + ' UTC')
  return d.toISOString().slice(0, 10)
}

/** The ledger's ten payouts, one per week, oldest first, split by what
 *  happened to the money. Each week holds exactly one payout, so the other two
 *  series are a real 0 that week (nothing moved), not missing. Withdrawals are
 *  negative — money out of the bank account — so they stack below the axis.
 *  The failed payout's week keeps its slot on the axis (time does not skip)
 *  but draws no bar, since no money moved; the card footer names it. */
const payoutHistory = (() => {
  const rows = [...PAYOUTS].reverse()
  const amounts = (test) => rows.map((p) => (test(p) ? usd(p.amount) : 0))
  return {
    labels: rows.map((p) => isoFrom(p.created)),
    series: [
      { key: 'deposited', label: 'Deposited', data: amounts((p) => p.type === 'Deposit' && p.status === 'Paid') },
      { key: 'transit', label: 'In transit', data: amounts((p) => p.status === 'In Transit') },
      { key: 'withdrawn', label: 'Withdrawn', data: amounts((p) => p.type === 'Withdrawal') },
    ],
    failed: PAYOUTS.filter((p) => p.status === 'Failed'),
  }
})()

/** **Chart concept · Payouts over time.**
 *
 *  *Question it answers:* "How much has actually reached my bank each week,
 *  and when did money go the other way?" The ledger answers that one row at a
 *  time; ten weeks of payouts as bars show the rhythm (a deposit every Monday),
 *  the two withdrawals, and the payout still in transit, at a glance.
 *
 *  *Why a stacked bar:* the Overview — Bar is for comparing magnitudes across
 *  categories (here, payout weeks) and Stacked Bar for composition per
 *  category. Stacking puts deposits above the axis and withdrawals below it on
 *  one value axis, which keeps "money in" and "money out" on the same scale
 *  without a second axis. Line was rejected: payouts are discrete events, not
 *  a continuous quantity.
 *
 *  *Placement:* a DsChartCard between Balance Summary and the Payouts ledger —
 *  the overview sits directly above the rows it summarises. The table toggle
 *  gives the exact amounts.
 *
 *  *What it adds:* new — the page has no view of payouts over time today. */
export const ChartConceptPayouts = epPage({
  active: 'balances',
  components: { DsSearch, DsModal, DsLink, DsStackedBarChart, DsChartCard },
  setup: () => ({ ...state(), history: payoutHistory }),
  slot: `
  <div style="${EP_PAGE}">
    ${epHeader('Balances', { badge: 'Chart concept — for approval', badgeColor: 'ds-warning text-ds-warning' })}
    ${summaryCard}
    <ds-chart-card title="Payouts over time" subtitle="Weekly payouts · Jun 15 – Aug 17, 2026" table-toggle
      padding="lg" style="${EP_CARD}">
      <template #default="{ view }">
        <ds-stacked-bar-chart :labels="history.labels" :series="history.series" label-format="day"
          value-format="currency" :height="260" :view="view" />
      </template>
      <template #footer>
        <span v-for="f in history.failed" :key="f.id">
          Not shown: {{ f.id }} ({{ f.amount }}, {{ f.created.replace('Created ', '') }}) failed — no money moved.
        </span>
      </template>
    </ds-chart-card>
    ${payoutsCard}
  </div>
  ${fundsDialog}`,
})
ChartConceptPayouts.storyName = 'Chart concept · Payouts over time'
