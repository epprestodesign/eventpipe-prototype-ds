/** EP Pay / Screens / 04 · Transactions.
 *
 *  The account ledger. The 09/28 capture fixed the arrangement — five cards
 *  above a table — and the design system fixed everything else. The cards are
 *  not decoration: they are the filter, and the selected one wears the DS
 *  selected pair (brand edge, palest brand wash). Clicking one narrows the
 *  table, so the screen demonstrates the interaction rather than describing it.
 *
 *  The screen is live. It runs on `_transactions-data.js` — a deterministic
 *  ledger, Jan 1 → Sep 29, 2026, that contains every transaction another EP
 *  Pay screen names by id — and everything on it is computed from that:
 *
 *  1. The **date range** (DsDateRangePicker in the header, replacing the dead
 *     "Year to Date" dropdown) scopes the whole page. It defaults to **This
 *     month**: the period a merchant reconciles payouts and statements
 *     against, and a preset — so the rail shows what is applied. "Last 30
 *     days" is not in the rail, and year-to-date opened on 78 pages.
 *  2. The **cards** count and total the range, by status. They ignore the
 *     search and their own selection — they describe the period, the table
 *     is what is being narrowed.
 *  3. The **table** is range ∩ selected card ∩ search (name, id or event),
 *     ten rows a page through DsPagination (the DS pager every EP Pay table
 *     uses), whose "Showing x–y of z" is the real slice. A range with nothing
 *     in it shows the table's no-data state.
 *
 *  Card brands are neutral text chips, not logo images and not each brand's
 *  own colour. Shipping real Visa/Amex/Klarna artwork into the design system
 *  is a trademark question, and painting the chips in brand colours spends six
 *  colours we do not own on a column that carries no status — next to the
 *  status chips, which do.
 */
import { ref, computed, watch } from 'vue'
import { epPage, epHeader, epCard, statusChip, BRAND_CHIP, EP_CAPTION, EP_PAGE } from './_eppay'
import { LEDGER, DATA_START, DATA_END, inRange, searchRows, tileTotals, trendBuckets, STATUS_FILTERS } from './_transactions-data'
import { presetRange, formatLong } from '../../components/dateRangeMath.js'
import DsSearch from '../../components/DsSearch.vue'
import DsStat from '../../components/DsStat.vue'
import DsEmptyState from '../../components/DsEmptyState.vue'
import DsDateRangePicker from '../../components/DsDateRangePicker.vue'
import DsSparkline from '../../components/charts/DsSparkline.vue'
import DsPagination from '../../components/DsPagination.vue'

export default {
  title: 'Eventpipe Labs/EP Pay/Screens/04 · Transactions',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'The transaction ledger with its five filter stat cards. Pick a date range in the header; the cards count and total that range, clicking a card narrows the table, the search narrows it further, and the footer pages through the real result.' } },
  },
}

/** The prototype's "now". Pinned, so the screen reads the same on every run. */
const TODAY = DATA_END
const PAGE_SIZE = 10

/** How each brand key prints. The chip itself is the shared neutral one — the
 *  brand is identified by its name, not by a colour we would be borrowing. */
const BRAND_LABEL = {
  visa: 'VISA',
  mastercard: 'Mastercard',
  amex: 'AMEX',
  discover: 'Discover',
  paypal: 'PayPal',
  klarna: 'Klarna',
}

/** The ledger's columns. Four of the five stack a value over a muted second
 *  line, which is why each one is drawn by a `#body-cell-*` slot below; `field`
 *  is still set on every column so the default renderer — and any future sort —
 *  has something real to work from. The last column is the row menu. */
const COLUMNS = [
  { name: 'status', label: 'Status & Date', field: 'status', align: 'left' },
  { name: 'amount', label: 'Amount & Type', field: 'amount', align: 'left' },
  { name: 'customer', label: 'Customer & Payment', field: 'who', align: 'left' },
  { name: 'details', label: 'Details', field: 'event', align: 'left' },
  { name: 'actions', label: '', field: 'id', align: 'right', style: 'width:64px;', headerStyle: 'width:64px;' },
]

/** Eyebrow on a filter card. The DS has no micro-label token, and this is the
 *  one place EP Pay needs one. */
const MICRO = 'font-size:0.75rem; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:var(--ds-color-text-subtle);'
/** Two-line cells get more air than QTable's default 7px — the second line
 *  would otherwise sit on the row border. */
const TD = 'padding:12px 16px;'

/** The filter row. Real `<button>`s — `q-card tag="button"` keeps the DS card
 *  shell and the button semantics at the same time, so the pressed state is
 *  announced rather than merely painted. The number and its total are a
 *  `DsStat`, which is the platform's metric pair. */
const statCards = `
  <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:16px; margin-bottom:20px;">
    <q-card v-for="f in tiles" :key="f.key" flat bordered tag="button" type="button"
      :aria-pressed="active === f.key ? 'true' : 'false'"
      :data-testid="'tile-' + f.key"
      :style="'display:block; width:100%; padding:0; text-align:left; font:inherit; cursor:pointer; ' +
              (active === f.key
                ? 'border:2px solid var(--ds-color-border-brand); background:var(--ds-color-background-brand-subtlest);'
                : '')"
      @click="setActive(f.key)">
      <q-card-section :style="active === f.key ? 'padding:17px 19px;' : 'padding:18px 20px;'">
        <div style="${MICRO}">{{ f.label }}</div>
        <ds-stat :value="f.count" :label="f.total" style="margin-top:4px;" />
        <template v-if="trend">
          <template v-if="trend.keys.length > 1">
            <ds-sparkline :data="trend.series[f.key]" :height="32" area style="margin-top:12px;"
              :aria-label="f.label + ' ' + trend.caption.toLowerCase() + ': ' + trend.series[f.key].join(', ')" />
            <div style="${EP_CAPTION} margin-top:2px;">{{ trend.caption }}</div>
          </template>
          <div v-else style="${EP_CAPTION} margin-top:12px;">Pick more than one day to see a trend</div>
        </template>
      </q-card-section>
    </q-card>
  </div>`

/* The ledger is a QTable with `.ds-table`, so the Azure header bar, the zebra
   rows and the rounded outline all come from the design system. */
const table = `
  <q-table class="ds-table" :rows="pageRows" :columns="columns" row-key="id"
    flat bordered :pagination="{ rowsPerPage: 0 }">

    <template #header-cell-actions="props">
      <q-th :props="props">
        <q-btn flat dense square icon="edit" color="white" size="sm" aria-label="Edit columns" />
      </q-th>
    </template>

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

    <template #body-cell-customer="props">
      <q-td :props="props" style="${TD}">
        <div>{{ props.row.who }}</div>
        <div style="display:flex; align-items:center; gap:8px; margin-top:4px;">
          <span :style="brandStyle(props.row.brand)">{{ brandLabel(props.row.brand) }}</span>
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

    <template #body-cell-actions="props">
      <q-td :props="props" style="${TD}">
        <ds-action-menu :label="'Actions for ' + props.row.id" :items="[
          { label: 'View details', icon: 'visibility' },
          { label: 'Copy transaction ID', icon: 'content_copy', copy: props.row.id },
          { label: 'Download receipt', icon: 'receipt_long' },
          { label: 'Refund payment', icon: 'undo', danger: true, dividerBefore: true, confirm: { title: 'Refund ' + props.row.id + '?', message: 'The customer is refunded to the original payment method. This can’t be undone.', okLabel: 'Refund' } },
        ]" />
      </q-td>
    </template>

    <template #no-data>
      <div style="width:100%;" data-testid="txn-empty">
        <ds-empty-state icon="receipt_long" :title="empty.title" :description="empty.description">
          <template #action>
            <q-btn v-if="query" outline no-caps color="primary" label="Clear search" @click="query = ''" />
          </template>
        </ds-empty-state>
      </div>
    </template>

    <template #bottom>
      <ds-pagination v-model="page" :total="filtered.length" :page-size="PAGE_SIZE" noun="transactions"
        style="flex:1; padding:6px 4px;" data-testid="txn-pagination" />
    </template>
  </q-table>`

const toolbar = `
  <div style="display:flex; align-items:center; gap:16px; margin-bottom:18px;">
    <div style="width:100%; max-width:400px;">
      <ds-search v-model="query" placeholder="Search by name, ID or event" />
    </div>
    <span style="flex:1;" />
    <q-btn outline no-caps color="primary" icon="filter_alt" label="Filter" style="padding:0 18px;" />
    <q-btn outline no-caps color="primary" icon="file_download" label="Export" style="padding:0 18px;" />
  </div>`

const slot = ({ badge = '' } = {}) => `
  <div style="${EP_PAGE}">
    ${epHeader('Transactions', {
      actions: `<ds-date-range-picker v-model="range" label="Transactions date range" align="right"
        today="${TODAY}" min="${DATA_START}" max="${TODAY}" />`,
      ...(badge ? { badge, badgeColor: 'ds-warning text-ds-warning' } : {}),
    })}
    ${epCard(`${statCards}${toolbar}${table}`)}
  </div>`

const TREND_UNIT = { day: 'Per day', week: 'Per week', month: 'Per month' }

function state ({ active = 'all', trends = false, preset = 'thisMonth' } = {}) {
  const initial = presetRange(preset, TODAY, { min: DATA_START })
  const range = ref({ ...initial, preset })
  const activeRef = ref(active)
  const query = ref('')
  const page = ref(1)

  const ranged = computed(() => inRange(LEDGER, range.value))
  const tiles = computed(() => tileTotals(ranged.value))
  const current = computed(() => STATUS_FILTERS.find((f) => f.key === activeRef.value) || STATUS_FILTERS[0])
  const filtered = computed(() => {
    const byStatus = current.value.match ? ranged.value.filter(current.value.match) : ranged.value
    return searchRows(byStatus, query.value)
  })
  const pageRows = computed(() => filtered.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE))

  // Any change to what is being looked at starts again from page 1.
  watch([range, activeRef, query], () => { page.value = 1 }, { deep: true })

  const empty = computed(() => {
    const { start, end } = range.value
    const period = start === end ? formatLong(start) : `${formatLong(start)} – ${formatLong(end)}`
    const when = start === end ? `on ${formatLong(start)}` : `from ${formatLong(start)} to ${formatLong(end)}`
    if (!ranged.value.length) return { title: 'No transactions in this period', description: `Nothing was processed ${when}. Try a wider date range.` }
    if (query.value) return { title: 'No matching transactions', description: `Nothing in ${period} matches “${query.value}”. Search by customer name, transaction ID or event.` }
    return { title: `No ${current.value.label.toLowerCase()} transactions`, description: `None of this period's transactions are ${current.value.label.toLowerCase()}.` }
  })

  const trend = computed(() => {
    if (!trends) return null
    const t = trendBuckets(LEDGER, range.value)
    const a = formatLong(range.value.start).replace(/, \d{4}$/, '')
    const b = formatLong(range.value.end).replace(/, \d{4}$/, '')
    return { ...t, caption: `${TREND_UNIT[t.unit]}, ${a} – ${b}` }
  })

  return {
    range,
    tiles,
    trend,
    columns: COLUMNS,
    active: activeRef,
    setActive: (key) => { activeRef.value = key },
    current,
    query,
    page,
    filtered,
    pageRows,
    PAGE_SIZE,
    empty,
    chipFor: statusChip,
    brandLabel: (key) => BRAND_LABEL[key] || key,
    brandStyle: () => BRAND_CHIP,
  }
}

const story = (opts) => epPage({
  active: 'transactions',
  components: { DsSearch, DsStat, DsSparkline, DsEmptyState, DsDateRangePicker, DsPagination },
  setup: () => state(opts),
  slot: slot(opts),
})

/** **All**, this month, page 1. Change the range in the header and every
 *  number on the page follows. */
export const Default = story()

/** What a dispute review starts from — the filter the merchant reaches for
 *  first, because these are the rows with a deadline attached. This year, so
 *  every payment in the Disputes screen's fixture made in 2026 is here — same
 *  ids, customers, cards and original amounts. */
export const Disputed = story({ active: 'disputed', preset: 'thisYear' })
Disputed.storyName = 'Filtered · Disputed'

/** Refunds and partial refunds, year to date. Shows the third chip tone in the
 *  table, and a result set short enough for compact pagination. */
export const Refunded = story({ active: 'refunded', preset: 'thisYear' })
Refunded.storyName = 'Filtered · Refunded'

/** **Chart concept — for approval.** The page with a trend in each filter
 *  card, derived from the same ledger the cards count — so the line and the
 *  number beside it can never disagree. Opens on This year (per month); the
 *  bucket follows the range: per day up to a month, per week up to ~4 months,
 *  per month beyond.
 *
 *  - **Question it answers:** "Is anything going the wrong way?" — are
 *    failures or disputes creeping up while sales grow? The cards give totals
 *    only, so a bad month is invisible until it moves the total, and by then
 *    it has been bad for a while.
 *  - **Why sparklines in the cards:** a word-sized trend beside the number
 *    that carries the magnitude (Overview: "Sparkline — a word-sized trend
 *    beside a number"). Each one scales to itself, so the disputes get as
 *    much shape as the successes — which is the point: the merchant wants
 *    each status's direction, not their relative size.
 *  - **Considered and rejected:** a stacked bar of monthly volume by status
 *    above the table. Success is ~80% of transactions, so disputed and failed
 *    — the statuses a merchant acts on — would be slivers a few pixels tall,
 *    and a stacked bar compares totals and composition, not per-status
 *    trends. It would also push the ledger, this screen's real content, below
 *    the fold.
 *  - **Adds, does not replace:** the cards stay the filter; the sparkline sits
 *    under the existing number. Brand tone throughout — the colour makes no
 *    good/bad claim, the shape and the caption carry it.
 *  - **Caveat for review:** self-scaling cuts both ways. Small counts (a
 *    handful of disputes a month) swing as far as Success's steady climb, and
 *    per-day buckets on a short range are mostly zeros. DsSparkline has no
 *    zero-anchored option to damp that; if approved, the component needs one
 *    (or the card needs a stated range).
 */
export const ChartConceptTrends = story({ trends: true, preset: 'thisYear', badge: 'Chart concept — for approval' })
ChartConceptTrends.storyName = 'Chart concept · Status trends in filter cards'
