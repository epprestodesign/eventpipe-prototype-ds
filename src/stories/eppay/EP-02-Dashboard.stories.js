/** EP Pay / Screens / 02 · Dashboard.
 *
 *  The merchant's landing screen: six metric cards (DsMetricCard), each
 *  comparing this period against the same period last year with a delta badge
 *  and a this-period vs previous-year sparkline.
 *
 *  The notice at the top is the one piece of state worth understanding. A
 *  merchant can take payments before their application is verified, but cannot
 *  be paid out — so the banner is not onboarding nagging, it is the thing
 *  standing between them and their money. It links to the wizard in
 *  Screens › 07 · Merchant Application, and disappears once submitted
 *  (see the "Application submitted" story).
 */
import { epPage, epHeader, EP_CARD, EP_PAGE, DASHBOARD_STATS } from './_eppay'
import DsMetricCard from '../../components/charts/DsMetricCard.vue'
import DsChartCard from '../../components/charts/DsChartCard.vue'
import DsLineChart from '../../components/charts/DsLineChart.vue'
import DsDonutChart from '../../components/charts/DsDonutChart.vue'
import DsBarList from '../../components/charts/DsBarList.vue'
import DsDateRangePicker from '../../components/DsDateRangePicker.vue'
import DsSelect from '../../components/DsSelect.vue'
import DsField from '../../components/DsField.vue'
import { ref, computed } from 'vue'
import { formatValue, formatDelta } from '../../components/charts/chartFormat.js'
import { addDays, formatRange, formatLong } from '../../components/dateRangeMath.js'
import { computeInsights } from './_insights'
import { DATA_START, DATA_END } from './_transactions-data'

export default {
  title: 'EP Pay/Screens/02 · Dashboard',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'The EP Pay merchant dashboard. The 09/28 capture set the layout; the design system set the colour, type and components. Six DsMetricCards, each with a delta badge and a this-period vs previous-year sparkline.' } },
  },
}

/** The application callout.
 *
 *  A `q-card flat bordered` like everything else on the canvas, with the brand
 *  left edge kept — that 4px stripe is what marks it as a notice rather than
 *  another body panel, and it is the only thing about it that is not a plain
 *  card.
 *
 *  Written out rather than built with `epCard()` because this is a callout, not
 *  a section: it wants the tighter 18/22 padding of a banner, where `epCard()`
 *  supplies the 26/30 interior a titled body card needs.
 */
const NOTICE = `
  <q-card v-if="showNotice" flat bordered
    style="${EP_CARD} border-left:4px solid var(--ds-color-background-brand-bold);">
    <q-card-section class="row items-center no-wrap" style="padding:18px 22px; gap:24px;">
      <div style="flex:1; min-width:0;">
        <div style="font-weight:700; color:var(--ds-color-text);">EventPipe Pay</div>
        <div style="color:var(--ds-color-text-subtle); margin-top:3px;">
          To avoid any delays in receiving your funds complete your EventPipe Pay application.
        </div>
      </div>
      <q-btn unelevated no-caps color="primary" label="Complete Application" style="flex:none;" />
    </q-card-section>
  </q-card>`

/** Period controls, in the header's actions slot where the rest of the platform
 *  puts a page's controls. */
const ACTIONS = `
  <q-btn outline no-caps color="primary" icon="filter_alt" label="Filter" style="background:var(--ds-color-surface);" />
  <q-btn outline no-caps color="grey-8" icon="event" icon-right="expand_more" label="Today" style="background:var(--ds-color-surface);" />`

/** How each metric formats and which way is good. Disputes rising is bad, so
 *  both dispute cards are `down-is-good` — the badge turns red on a rise even
 *  though the arrow points up. */
const METRIC = {
  gross: { valueFormat: 'currency' },
  success: { valueFormat: 'number' },
  payouts: { valueFormat: 'currency' },
  avgspend: { valueFormat: 'currency' },
  dispvol: { valueFormat: 'currency', polarity: 'down-is-good' },
  dispcount: { valueFormat: 'number', polarity: 'down-is-good' },
}

const metrics = DASHBOARD_STATS.map((s) => ({
  key: s.key,
  label: s.label,
  value: s.amount,
  previousValue: s.previousAmount,
  valueFormat: METRIC[s.key].valueFormat,
  polarity: METRIC[s.key].polarity || 'up-is-good',
  comparisonLabel: 'vs. previous year',
  spark: s.trend,
  sparkPrevious: s.trendPrevious,
  rangeStart: '12 AM, Aug 20, 2026',
  rangeEnd: '11:59 PM',
}))

/** The six metric cards. Plain div: a CSS grid track definition, not a panel —
 *  each card inside is a DsMetricCard (DsCard surface); this only places them. */
const GRID = `
  <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(420px, 1fr)); gap:20px;">
    <ds-metric-card v-for="m in metrics" :key="m.key" v-bind="m" />
  </div>`

const SLOT = `
  <div style="${EP_PAGE}">
    ${NOTICE}

    ${epHeader('Dashboard', { actions: ACTIONS })}

    ${GRID}
  </div>`

const story = (showNotice) => epPage({
  active: 'dashboard',
  components: { DsMetricCard },
  setup: () => ({ metrics, showNotice }),
  slot: SLOT,
})

/** Default: application not yet submitted, so the banner is up. */
export const Default = story(true)

/** After the wizard is submitted the banner clears. Nothing else changes —
 *  payouts stay blocked until verification, but that is said in the
 *  confirmation screen rather than repeated here. */
export const Submitted = story(false)
Submitted.storyName = 'Application submitted'

/* ---------------------------------------------------------------------------
 * Chart concepts — for approval. The stories above are unchanged by these.
 * ------------------------------------------------------------------------- */

/** Aug 1–20, 2026 daily gross volume, and the same calendar days of 2025.
 *  Synthetic but consistent with the rest of EP Pay: Aug 20 is the Gross
 *  Volume card's $2,089.00 (vs $1,829.25), and the weeks of Aug 3–9 and
 *  Aug 10–16 sum to a little over the PO-2026-1257 / PO-2026-1264 payouts
 *  that settled them (gross before fees). Every day had sales, so there are
 *  no missing (null) values here. */
const GROSS_TREND = {
  labels: Array.from({ length: 20 }, (_, i) => `2026-08-${String(i + 1).padStart(2, '0')}`),
  series: [
    { key: 'current', label: 'Aug 2026', data: [312.40, 188.00, 905.60, 1120.35, 842.10, 1310.75, 1480.20, 402.95, 298.50, 780.40, 1045.90, 1265.30, 988.15, 1402.60, 356.80, 160.25, 1188.45, 934.70, 1356.20, 2089.00] },
    { key: 'previous', label: 'Aug 2025', comparison: true, data: [268.10, 245.60, 812.35, 998.40, 905.15, 1120.60, 1290.45, 330.20, 262.75, 702.90, 960.25, 1088.40, 1015.30, 1244.85, 298.60, 190.45, 1050.20, 872.35, 1198.60, 1829.25] },
  ],
}

/** **Chart concept · Gross volume trend.**
 *
 *  *Question it answers:* "Is today a good day, or just a normal one — and is
 *  this month tracking ahead of last year?" The six cards answer "how is today
 *  going" with one number each; they cannot show whether today's +14.2% is a
 *  trend or a spike. Twenty days of daily gross volume against the same days
 *  last year can.
 *
 *  *Why a line chart:* the Overview's guidance — Line is for "change over time;
 *  current vs. previous period", and a `comparison: true` series draws last
 *  year dashed and neutral behind this year, so the comparison reads as a
 *  baseline, not a second competing series. Area was considered (volume) but
 *  two overlapping fills muddy the comparison.
 *
 *  *Placement:* below the metric grid, as a full-width DsChartCard. The cards
 *  are the page's established answer and the header's "Today" control drives
 *  them; putting a month-scale chart above would push them below the fold at
 *  1440×900 and put a different period first. Below, it reads as the context
 *  for the numbers above it. The table toggle gives the exact daily values.
 *
 *  *What it adds:* new — the dashboard has no trend beyond the cards'
 *  one-day sparklines. */
export const ChartConceptGrossTrend = epPage({
  active: 'dashboard',
  components: { DsMetricCard, DsChartCard, DsLineChart },
  setup: () => ({ metrics, showNotice: true, trend: GROSS_TREND }),
  slot: `
  <div style="${EP_PAGE}">
    ${NOTICE}

    ${epHeader('Dashboard', { actions: ACTIONS, badge: 'Chart concept — for approval', badgeColor: 'ds-warning text-ds-warning' })}

    ${GRID}

    <ds-chart-card title="Gross volume" subtitle="Month to date · Aug 1–20, 2026 vs. the same days of 2025" table-toggle
      style="margin-top:20px;">
      <template #default="{ view }">
        <ds-line-chart :labels="trend.labels" :series="trend.series" label-format="day"
          value-format="currency" :height="280" :view="view" />
      </template>
    </ds-chart-card>
  </div>`,
})
ChartConceptGrossTrend.storyName = 'Chart concept · Gross volume trend'

/* ---------------------------------------------------------------------------
 * Chart concept · Insights layout
 * ------------------------------------------------------------------------- */

/** Range presets for the insights picker. "Last 30 days" is the default, as in
 *  the reference; the picker clamps every preset to the ledger (Jan 1 → today). */
const INSIGHTS_PRESETS = [
  { key: 'last7', label: 'Last 7 days', range: (t) => ({ start: addDays(t, -6), end: t }) },
  { key: 'last30', label: 'Last 30 days', range: (t) => ({ start: addDays(t, -29), end: t }) },
  { key: 'last90', label: 'Last 90 days', range: (t) => ({ start: addDays(t, -89), end: t }) },
  'thisMonth',
  'lastMonth',
  'thisYear',
]

const COMPARE_OPTIONS = [
  { label: 'Previous period', value: 'period' },
  { label: 'Previous year', value: 'year' },
]

const KPI_LABEL = 'font-size:0.75rem; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:var(--ds-color-text-subtle);'
const CARD_H2 = 'margin:0; flex:1; min-width:0; font-size:1.0625rem; font-weight:700; color:var(--ds-color-text);'

/** A breakdown card: icon + title + "View all ›", then `body`. */
const breakdownCard = (icon, title, body) => `
  <q-card flat bordered style="min-width:0;">
    <q-card-section style="padding:22px 24px 24px;">
      <div class="row items-center no-wrap" style="gap:10px; margin-bottom:16px;">
        <q-icon name="${icon}" size="22px" style="color:var(--ds-color-icon-subtle); flex:none;" />
        <h2 style="${CARD_H2}">${title}</h2>
        <q-btn flat dense no-caps color="primary" label="View all" icon-right="chevron_right"
          aria-label="View all transactions, ${title.toLowerCase()}" style="flex:none;" @click="viewAll" />
      </div>
      ${body}
    </q-card-section>
  </q-card>`

const INSIGHTS_ACTIONS = `
  <q-btn outline no-caps color="primary" icon="file_download" label="Export" style="background:var(--ds-color-surface);" />`

/** Controls row, under the title inside the header card: comparison on the
 *  left; range preset + date range on the right. The preset button is a second
 *  trigger for the same picker, so the current preset reads at a glance the
 *  way the reference's "Last 30 days ⇕" does. */
const INSIGHTS_CONTROLS = `
  <div class="row items-end justify-between" style="gap:16px 24px; margin-top:18px; padding-bottom:22px;">
    <ds-select v-model="compare" :options="compareOptions" label="Compare to" style="width:220px;" />
    <ds-field label="Date range">
      <div class="row items-center no-wrap" style="gap:8px;">
        <q-btn outline no-caps color="grey-8" :label="presetLabel" icon-right="unfold_more"
          :aria-label="'Range preset: ' + presetLabel + '. Change date range'"
          style="background:var(--ds-color-surface);" @click="picker && picker.open()" />
        <ds-date-range-picker ref="picker" v-model="range" :presets="presets" :today="today"
          :min="min" :max="today" align="right" label="Date range" />
      </div>
    </ds-field>
  </div>`

const INSIGHTS_SLOT = `
  <div style="${EP_PAGE}">
    <!-- Same application notice as the Default dashboard: until the merchant
         application is submitted, payouts are blocked, so it leads the page. -->
    ${NOTICE}
    ${epHeader('Dashboard', { actions: INSIGHTS_ACTIONS, tabs: INSIGHTS_CONTROLS, badge: 'Chart concept — for approval', badgeColor: 'ds-warning text-ds-warning' })}

    <q-card flat bordered style="${EP_CARD}">
      <q-card-section style="padding:26px 30px 24px;">
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:20px 32px;">
          <div v-for="k in kpis" :key="k.key" style="min-width:0;">
            <div style="${KPI_LABEL}">{{ k.label }}</div>
            <div class="row items-baseline" style="gap:4px 12px; margin-top:6px;">
              <span style="font-size:2rem; font-weight:700; line-height:1.15; color:var(--ds-color-text); font-variant-numeric:tabular-nums;"
                >{{ k.main }}<span v-if="k.cents" style="font-size:1.25rem; font-weight:400; color:var(--ds-color-text-subtle);">{{ k.cents }}</span></span>
              <span class="row items-center no-wrap" style="gap:2px; font-size:0.8125rem;" :aria-label="k.sr" role="img">
                <q-icon v-if="k.icon" :name="k.icon" size="20px" :style="{ color: k.color, margin: '0 -2px' }" />
                <span :style="{ color: k.color, fontWeight: 700 }">{{ k.deltaText }}</span>
                <span v-if="k.hasDelta" style="color:var(--ds-color-text-subtle); margin-left:3px;">{{ compareShort }}</span>
              </span>
            </div>
          </div>
        </div>

        <p v-if="coverageNote" class="row items-start no-wrap"
          style="gap:6px; margin:16px 0 0; font-size:0.8125rem; color:var(--ds-color-text-subtle);">
          <q-icon name="info_outline" size="16px" style="margin-top:1px; flex:none;" /> <span>{{ coverageNote }}</span>
        </p>

        <div style="margin-top:22px;">
          <ds-line-chart :labels="insights.trend.labels" :series="trendSeries" label-format="day"
            value-format="currency" :height="300"
            :aria-label="'Daily gross volume, ' + rangeText + (trendSeries.length > 1 ? ', compared with ' + compareLabel.toLowerCase() : '')" />
        </div>
      </q-card-section>
    </q-card>

    <div :style="{ display: 'grid', gap: '20px', gridTemplateColumns: $q.screen.width < 1100 ? 'minmax(0, 1fr)' : 'repeat(2, minmax(0, 1fr))' }">
      ${breakdownCard('event', 'By event', `
        <ds-donut-chart :segments="eventSegments" value-format="currency" :size="140"
          :center-value="String(insights.kpis.count.value)" center-label="payments" />`)}
      ${breakdownCard('hotel', 'By hotel', `
        <ds-bar-list :items="lists.byHotel" value-format="currency" aria-label="Gross volume by hotel, largest first" />`)}
      ${breakdownCard('credit_card', 'By payment method', `
        <ds-bar-list :items="lists.byMethod" value-format="currency" aria-label="Gross volume by payment method, largest first" />`)}
      ${breakdownCard('group', 'Top customers', `
        <ds-bar-list :items="lists.byCustomer" value-format="currency" aria-label="Top customers by gross volume" />`)}
    </div>
  </div>`

/** Split "$15,502.07" into "$15,502" and ".07" so the cents can sit smaller. */
function splitCents(text) {
  const m = /^(.*?)(\.\d+)$/.exec(text)
  return m ? { main: m[1], cents: m[2] } : { main: text, cents: '' }
}

function insightsSetup() {
  const today = DATA_END
  const range = ref({ start: addDays(today, -29), end: today, preset: 'last30' })
  const compare = ref('period')
  const picker = ref(null)

  const insights = computed(() => computeInsights(range.value, compare.value))
  const compareLabel = computed(() => (compare.value === 'year' ? 'Previous year' : 'Previous period'))
  const compareShort = computed(() => (compare.value === 'year' ? 'prev year' : 'prev period'))
  const rangeText = computed(() => formatRange(range.value))

  const presetLabel = computed(() => {
    const key = range.value && range.value.preset
    const hit = INSIGHTS_PRESETS.find((p) => (typeof p === 'string' ? p : p.key) === key)
    if (!hit) return 'Custom'
    if (typeof hit !== 'string') return hit.label
    return { thisMonth: 'This month', lastMonth: 'Last month', thisYear: 'This year' }[hit] || hit
  })

  const KPI_DEFS = [
    { key: 'gross', label: 'Gross volume', format: 'currency' },
    { key: 'avgDaily', label: 'Avg daily volume', format: 'currency' },
    { key: 'count', label: 'Successful payments', format: 'number' },
  ]
  const kpis = computed(() => KPI_DEFS.map((d) => {
    const { value, previous } = insights.value.kpis[d.key]
    const { main, cents } = splitCents(formatValue(value, d.format))
    const delta = formatDelta(value, previous)
    // Up is good for all three.
    const good = delta.direction === 'up'
    const bad = delta.direction === 'down'
    const color = good ? 'var(--ds-color-text-success)' : bad ? 'var(--ds-color-text-danger)' : 'var(--ds-color-text-subtle)'
    const icon = good ? 'arrow_drop_up' : bad ? 'arrow_drop_down' : ''
    const hasDelta = delta.direction !== 'none'
    const deltaText = !hasDelta ? 'No comparison' : delta.text === 'New' ? 'New' : delta.text.replace(/^[+−]/, '')
    const prevText = formatValue(previous, d.format)
    const sr = !hasDelta
      ? `No comparison data for the ${compareLabel.value.toLowerCase()}`
      : `${{ up: 'Up', down: 'Down', flat: 'Unchanged' }[delta.direction]} ${deltaText} vs ${compareLabel.value.toLowerCase()}, from ${prevText}`
    return { key: d.key, label: d.label, main, cents, color, icon, hasDelta, deltaText, sr }
  }))

  const trendSeries = computed(() => {
    const t = insights.value.trend
    const out = [{ key: 'current', label: 'This period', data: t.current }]
    if (insights.value.comparison.coverage !== 'none') {
      out.push({ key: 'previous', label: compareLabel.value, comparison: true, data: t.previous })
    }
    return out
  })

  const coverageNote = computed(() => {
    const c = insights.value.comparison
    const win = formatRange(c)
    const floor = formatLong(DATA_START)
    if (c.coverage === 'none') {
      return `No comparison: the ${compareLabel.value.toLowerCase()} (${win}) is before the ledger starts on ${floor}, so there is no data for it. It is shown as missing, not as zero.`
    }
    if (c.coverage === 'partial') {
      return `The ${compareLabel.value.toLowerCase()} (${win}) starts before the ledger (${floor}). Its first ${c.days - c.coveredDays} day${c.days - c.coveredDays === 1 ? '' : 's'} have no data, so the chart leaves a gap and the totals are not compared.`
    }
    return ''
  })

  // Single-line rows, as in the reference: the per-row payment count
  // (`sublabel`) is left off here; DsBarList can show it.
  const strip = (rows) => rows.map(({ key, label, value }) => ({ key, label, value }))
  const lists = computed(() => ({
    byHotel: strip(insights.value.byHotel),
    byMethod: strip(insights.value.byMethod),
    byCustomer: strip(insights.value.byCustomer),
  }))

  const eventSegments = computed(() => insights.value.byEvent.map((e) => ({ key: e.key, label: e.label, value: e.value })))

  const viewAll = () => {
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('eppay:navigate', { detail: 'transactions' }))
  }

  return {
    showNotice: true,
    today, min: DATA_START, range, compare, picker, presets: INSIGHTS_PRESETS, compareOptions: COMPARE_OPTIONS,
    insights, compareLabel, compareShort, rangeText, presetLabel, kpis, trendSeries, coverageNote, eventSegments, lists, viewAll,
  }
}

/** **Chart concept · Insights layout.**
 *
 *  *What it is:* the Dashboard rebuilt on a reference "insights" page's
 *  STRUCTURE — a title with Export; a controls row (comparison on the left,
 *  range preset + date range on the right); one hero card with three KPIs over
 *  a this-period vs comparison line chart; then a 2×2 grid of breakdown cards.
 *  Only the structure is borrowed. Colour, type, cards, controls and charts are
 *  the design system's: DsPageHeader, `q-card flat bordered`, DsSelect,
 *  DsDateRangePicker, DsLineChart, DsDonutChart and the new DsBarList.
 *
 *  *What is computed, and from what:* everything, from the transactions ledger
 *  (`_transactions-data.js`) via `_insights.js` — so a range here and the same
 *  range on the Transactions screen are the same rows.
 *  - A **successful payment** is a `Success` `Sale` (refunds and adjustments
 *    carry the Success status but are money out; refunded, disputed and failed
 *    charges are excluded). Gross volume is their total; Avg daily volume is
 *    gross ÷ days in the range (days with no sales count as $0 days).
 *  - **Previous period** = the same-length window immediately before;
 *    **Previous year** = the same dates a year earlier. The ledger starts
 *    Jan 1, 2026, so Previous year never has data: its line is omitted, the
 *    KPIs say "No comparison" and a note says why — nothing is invented. A
 *    previous period that starts before Jan 1 (e.g. "This year") is handled
 *    the same way, with a gap in the dashed line for the uncovered days.
 *  - By event (donut; centre = successful payment count), By hotel (from the
 *    reservation's hotel), By payment method (card network / wallet) and Top
 *    customers — all over the same successful payments, all reactive to the
 *    range and comparison.
 *
 *  *Decisions for you:*
 *  1. Does this replace the six-metric-card grid (Default), or sit beside it —
 *     e.g. as a Reports/Insights page? Disputes and Payouts, which the cards
 *     show, have no place in this layout yet.
 *  2. Gross volume definition (above) — whether refunded/disputed charges
 *     should count toward gross, as some processors do.
 *  3. The DsLineChart legend sits above the plot (catalog convention); the
 *     reference puts it below.
 *  4. "View all" goes to Transactions unfiltered; filtering it by the row's
 *     event / hotel / method / customer needs Transactions to accept those
 *     filters. */
export const InsightsLayout = epPage({
  active: 'dashboard',
  components: { DsLineChart, DsDonutChart, DsBarList, DsDateRangePicker, DsSelect, DsField },
  setup: insightsSetup,
  slot: INSIGHTS_SLOT,
})
InsightsLayout.storyName = 'Chart concept · Insights layout'
