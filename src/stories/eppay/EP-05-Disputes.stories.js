/** EP Pay / Screens / 05 · Disputes.
 *
 *  The 09/28 capture (references/092826/…-disputes-…png) set what is on this
 *  screen and where; the design system set how it looks.
 *
 *  Six decisions worth stating:
 *
 *  1. The volume chart is the DS chart catalog's DsBarChart / DsLineChart in
 *     a DsChartCard. The card header carries three quiet controls in one
 *     40px row: a joined Bar / Line icon switcher, a text-style "vs previous
 *     period ▾" menu, and the card's own expand icon (DsChartCard's
 *     table-toggle — always last, rightmost), which opens the exact monthly
 *     values in a modal. The selected range is the first categorical colour,
 *     the comparison the neutral dashed `comparison` series behind it.
 *     The comparison is COMPUTED, not relabelled (see comparisonByMonth in
 *     _disputes-data.js): "previous year" is the same range 12 months back,
 *     "previous period" the same number of months immediately before it,
 *     each month clipped to the same days as the month it sits behind. The
 *     fixture starts on Sep 1, 2025, so any comparison month before that is
 *     null — drawn as a gap / "No data", never 0 — and a one-line note under
 *     the chart says which months have no comparison and why. With a
 *     12-month fixture, "previous year" therefore never has data; the old
 *     hand-typed Jan–Aug 2025 series was dropped rather than shown next to
 *     computed ones, because nothing on the screen could tell a merchant
 *     which of the two was invented.
 *
 *  2. Every number on the screen comes from one fixture (_disputes-data.js,
 *     48 disputes, Sep 2025 – Aug 2026). The screen used to type its totals
 *     in by hand (34 disputes, $53,455.35) over 19 rows that could not add up
 *     to them; now the summary, the Dispute By bar, the monthly volume, the
 *     ratio concept, the status cards and the queue are all sums of the same
 *     rows, so none of them can disagree.
 *
 *  3. The page's date range (DsDateRangePicker in the header, default "Year
 *     to date", Jan 1 – Aug 31, 2026; today = the fixture's AS_OF, min = its
 *     first day) scopes EVERYTHING on the screen by dispute date: the volume
 *     chart (one bar per month the range touches, partial months clipped, so
 *     the bars add up to the summary), the Dispute Summary, Dispute By, the
 *     ratio concept, the status cards and the queue. One date for the whole
 *     page means no two figures on it can be about different periods.
 *     It is the ONLY date control: the filter panel's old "Dispute date"
 *     field was removed rather than left to narrow within the page range —
 *     two date controls that must be read together is one too many, and the
 *     queue's date is already on screen in the header.
 *     Within that range, the top card is the ACCOUNT and the status cards and
 *     table are the QUEUE. The chart, Dispute Summary and Dispute By answer
 *     "how is this account doing", so they deliberately ignore the queue's
 *     search and filters — a merchant narrowing the table to find one Klarna
 *     dispute should not see their account-level ratio change underneath
 *     them. Everything below the top card narrows together: the status
 *     cards, the search box, the filter panel and the pagination all read
 *     one result set.
 *
 *  4. The five status cards are the table's status filter, not decoration
 *     ("Click a card above to filter"), so they are real buttons that write
 *     the same `status` field the filter panel writes. Their counts are facet
 *     counts: each card counts its own status inside every OTHER active
 *     filter and the search, so the cards always say what clicking them will
 *     show. With nothing else applied they are the account totals.
 *
 *  5. The Filter button opens a DsSidePanel, not a menu. Six fields — two
 *     multi-select dropdowns, three chip groups and an amount range — is a
 *     form, and a q-menu under the button
 *     would either scroll inside itself or cover the table it is filtering.
 *     The panel edits a draft: nothing changes until Apply, whose label counts
 *     the matches the draft would give ("Show 7 disputes"), so the merchant
 *     knows before committing whether they are about to land on an empty
 *     table. Closing the panel (×, Esc or the scrim) discards the draft.
 *     Applied filters appear as removable chips above the table; the badge on
 *     the Filter button counts them.
 *
 *  6. Dispute By is one amount split by a dimension (picked from the same
 *     quiet text menu as the chart's comparison, "By payment method ▾"): a
 *     single-row 100% stacked bar (DsStackedBarChart, the catalog's "Share Bar") over a static
 *     DsChartLegend carrying each part's amount and share. Colours are the
 *     catalog's fixed categorical order, not a brand ramp; a sixth part takes
 *     the neutral overflow colour, since the catalog forbids a sixth hue.
 *     Card-brand marks in the table are neutral DS chips, not logos — brand
 *     artwork is a licensing question, and brand colours would compete with
 *     the chips that carry status.
 */
import { ref, reactive, computed, watch } from 'vue'
import { epPage, epHeader, tintFor, statusChip, BRAND_CHIP, EP_CARD, EP_CAPTION, EP_PAGE } from './_eppay'
import {
  DISPUTES, DISPUTE_STATUSES, DISPUTE_BRANDS, DISPUTE_REASONS, DISPUTE_KINDS, DISPUTE_EVENTS, AS_OF, DATA_START,
  emptyFilters, copyFilters, matchesFilters, matchesSearch, inRange, amountBounds, sumAmount, amountBy, byMonth,
  comparisonByMonth, monthStarts, shiftMonths, txnsIn,
} from './_disputes-data'
import DsSearch from '../../components/DsSearch.vue'
import DsChoiceChips from '../../components/DsChoiceChips.vue'
import DsSidePanel from '../../components/DsSidePanel.vue'
import DsField from '../../components/DsField.vue'
import DsSelect from '../../components/DsSelect.vue'
import DsInput from '../../components/DsInput.vue'
import DsEmptyState from '../../components/DsEmptyState.vue'
import DsDateRangePicker from '../../components/DsDateRangePicker.vue'
import { formatRange, formatLong, formatMonth, endOfMonth } from '../../components/dateRangeMath.js'
import DsPagination from '../../components/DsPagination.vue'
import DsChartCard from '../../components/charts/DsChartCard.vue'
import DsChartLegend from '../../components/charts/DsChartLegend.vue'
import DsBarChart from '../../components/charts/DsBarChart.vue'
import DsLineChart from '../../components/charts/DsLineChart.vue'
import DsStackedBarChart from '../../components/charts/DsStackedBarChart.vue'
import { formatValue } from '../../components/charts/chartFormat.js'
import { seriesColorSlots } from '../../components/charts/chartData.js'

export default {
  title: 'Eventpipe Labs/EP Pay/Screens/05 · Disputes',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Disputes: monthly volume against a computed comparison (previous period or previous year), a summary of outcomes, a breakdown by payment method, and the dispute queue — all scoped by the page\'s date range. The five status cards, the search box and the Filter panel narrow the queue within it — click a card, or open Filter.' } },
  },
}

/* ---------------------------------------------------------------------------
 * Account-level figures — all derived from the dispute fixture.
 * ------------------------------------------------------------------------- */

const usd = (n) => formatValue(n, 'currency')
const shiftDays = (iso, days) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d) + days * 864e5).toISOString().slice(0, 10)
}

/** The page date range's presets. Counted back from the fixture's AS_OF
 *  (not the real clock) and clamped by the picker to [DATA_START, AS_OF].
 *  "Last 6 / 12 months" are whole calendar months, so their previous period
 *  lines up month for month with the chart. */
const RANGE_PRESETS = [
  { key: 'last30', label: 'Last 30 days', range: (t) => ({ start: shiftDays(t, -29), end: t }) },
  { key: 'last90', label: 'Last 90 days', range: (t) => ({ start: shiftDays(t, -89), end: t }) },
  { key: 'last6m', label: 'Last 6 months', range: (t) => ({ start: `${shiftMonths(t, -5).slice(0, 7)}-01`, end: t }) },
  { key: 'ytd', label: 'Year to date', range: (t) => ({ start: `${t.slice(0, 4)}-01-01`, end: t }) },
  { key: 'last12m', label: 'Last 12 months', range: (t) => ({ start: `${shiftMonths(t, -11).slice(0, 7)}-01`, end: t }) },
]
const DEFAULT_RANGE = { start: `${AS_OF.slice(0, 4)}-01-01`, end: AS_OF, preset: 'ytd' }

/** Comparison options. `short` is the trigger's text ("vs previous period"). */
const COMPARE_OPTIONS = [
  { value: 'period', label: 'Previous period', short: 'vs previous period' },
  { value: 'year', label: 'Previous year', short: 'vs previous year' },
]

/** Dispute By — each option names the row field it splits the total by. */
const BREAKDOWNS = [
  { value: 'Payment Method', field: 'brand', short: 'By payment method' },
  { value: 'Reason', field: 'reason', short: 'By reason' },
  { value: 'Event', field: 'event', short: 'By event' },
]

/* Chart concept · Dispute ratio: the monitoring threshold. The chart catalog
   has no reference-line prop, so it rides in as a flat comparison series —
   neutral and dashed. Illustrative value: the real figure depends on the
   network and acquirer, and product should confirm which one EP Pay shows.
   Known gap: the percent axis formats ticks to 0 decimals, so a sub-2% range
   labels its 0.5% steps "1%", "1%", "2%". Tooltip and table are exact; the
   fix belongs in chartFormat's formatAxisValue, not here. */
const RATIO_THRESHOLD = 0.009

/** The status cards, in the capture's order. `key` is the status matched. */
const CARDS = [...DISPUTE_STATUSES.map((s) => ({ key: s, label: s.toUpperCase() })), { key: 'All', label: 'ALL' }]

/** The queue's columns. Seven of the eight stack a value over a muted second
 *  line, so each is drawn by a `#body-cell-*` slot; `field` still points at
 *  the primary value so the column has something real behind it. */
const COLUMNS = [
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'dates', label: 'Dates', field: 'dateTop', align: 'left' },
  { name: 'amounts', label: 'Amounts', field: 'amount', align: 'left' },
  { name: 'customer', label: 'Customer', field: 'customer', align: 'left' },
  { name: 'txn', label: 'Original Transaction', field: 'txn', align: 'left' },
  { name: 'details', label: 'Additional Details', field: 'kind', align: 'left' },
  { name: 'actions', label: '', field: 'id', align: 'right', style: 'width:56px;', headerStyle: 'width:56px;' },
]

const PAGE_SIZE = 10

/* ---------------------------------------------------------------------------
 * Markup
 * ------------------------------------------------------------------------- */

/* `nowrap` on the cells: every value here is a date, a money amount or an ID,
   and wrapping one mid-string turns a scannable column into prose. The extra
   vertical padding is for the two-line cells — QTable's default 7px would put
   the second line on the row border. */
const TD = 'padding:12px 16px; vertical-align:top; white-space:nowrap;'
/** A card in the three-up summary row. Each is a real q-card; these values are
 *  the flex track it sits in, which the card shell has no opinion about. */
const PANEL = (grow, basis, min) => `flex:${grow} 1 ${basis}; min-width:${min};`

/* Card-header controls. One row, vertically centred, 40px tall; DsChartCard
   appends its expand icon (table-toggle) after the actions slot, so it is
   always the last, rightmost control. Two patterns, both quiet:
   - a SWITCHER: joined 40×40 icon buttons in one bordered container (the
     DsActionMenu 40×40 look), the selected one on the brand-subtlest fill
     with a brand icon; aria-pressed carries the state, a tooltip the name;
   - a TEXT MENU: a flat "vs previous period ▾" trigger and a q-menu of
     menuitemradio options — a wide outlined field was too loud for a
     setting that changes one series. */
const SWITCHER = 'display:inline-flex; height:40px; box-sizing:border-box; border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-md); background:var(--ds-color-surface); overflow:hidden;'

/** A quiet dropdown. `model` is the setup ref it writes; `options` are
 *  { value, label, caption? }; `trigger` is the expression for its text. */
const quietMenu = (model, options, trigger, name) => `
  <q-btn flat no-caps size="14px" padding="0 4px 0 8px"
    style="height:40px; min-height:40px; margin-left:-8px; border-radius:var(--ds-radius-md); font-weight:600; color:var(--ds-color-text);"
    :aria-label="'${name}: ' + ${trigger}" aria-haspopup="menu">
    <!-- Label + chevron drawn here rather than via icon-right, whose 12px gap
         pushed "By payment method" off the narrow Dispute By title row. -->
    <span>{{ ${trigger} }}</span><q-icon name="expand_more" size="20px" style="margin-left:2px;" />
    <q-menu anchor="bottom left" self="top left" :offset="[0, 4]">
      <q-list role="menu" aria-label="${name}" class="q-py-xs" style="min-width:220px;">
        <q-item v-for="o in ${options}" :key="o.value" clickable v-close-popup role="menuitemradio"
          :aria-checked="String(${model} === o.value)" :active="${model} === o.value" active-class="text-primary"
          style="min-height:40px;" @click="${model} = o.value">
          <q-item-section>
            <q-item-label>{{ o.label }}</q-item-label>
            <q-item-label v-if="o.caption" caption>{{ o.caption }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon v-if="${model} === o.value" name="check" size="18px" color="primary" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>`

/* The volume chart (layout per the user, 2026-09-29): title and subtitle, then
   the comparison menu on its own row below them; the legend row with the
   chart-type switcher at its right end; the chart. The expand icon (DsChartCard
   `table-toggle`) sits top right and opens the monthly data as a searchable
   table. The legend is drawn here rather than by the chart so the switcher can
   share its row; it uses the chart's own colour slots and still shows / hides
   series. The coverage note says when (and why) comparison months are missing. */
const chartCard = `
  <ds-chart-card title="Disputes" :subtitle="'Disputed amount by month · ' + rangeText" table-toggle
    style="${PANEL('1.7', '420px', '380px')}">
    <template #default="{ view }">
      <div v-if="view === 'chart'" style="margin:-8px 0 4px;">
        ${quietMenu('compare', 'compareOptions', 'compareShort', 'Compare to')}
      </div>
      <div v-if="view === 'chart'" class="row items-center no-wrap" style="gap:12px; margin-bottom:6px;">
        <ds-chart-legend :items="volumeLegend" :hidden="hiddenSeries" @toggle="toggleSeries" style="flex:1; min-width:0;" />
        <div role="group" aria-label="Chart type" style="${SWITCHER} flex:none;" data-test="chart-switcher">
          <q-btn v-for="(m, i) in chartModes" :key="m.value" flat padding="0" :icon="m.icon"
            :aria-label="m.label" :aria-pressed="String(chartMode === m.value)" :style="switchStyle(m.value, i)"
            @click="chartMode = m.value">
            <q-tooltip>{{ m.label }}</q-tooltip>
          </q-btn>
        </div>
      </div>
      <ds-bar-chart v-if="chartMode === 'bar'" :labels="volumeLabels" :series="volumeSeries" :show-legend="false"
        :hidden-series="hiddenSeries" label-format="month" value-format="currency" :height="220" :view="view" :aria-label="volumeAria" />
      <ds-line-chart v-else :labels="volumeLabels" :series="volumeSeries" :show-legend="false"
        :hidden-series="hiddenSeries" label-format="month" value-format="currency" :height="220" :view="view" :aria-label="volumeAria" />
      <p v-if="coverageNote" class="row items-start no-wrap" data-test="coverage-note"
        style="gap:6px; margin:10px 0 0; ${EP_CAPTION}">
        <q-icon name="info_outline" size="16px" style="margin-top:1px; flex:none;" /> <span>{{ coverageNote }}</span>
      </p>
    </template>
  </ds-chart-card>`

const summaryCard = `
  <q-card flat bordered style="${PANEL('1', '260px', '250px')}">
    <q-card-section style="padding:20px 22px;">
      <div class="row items-baseline no-wrap q-mb-md">
        <div style="font-size:1.125rem; font-weight:700;">Dispute Summary</div>
        <q-space />
        <div style="${EP_CAPTION}">{{ rangeCaption }}</div>
      </div>
      <div v-for="(s, i) in summary" :key="s.label"
        :style="'display:flex; align-items:baseline; justify-content:space-between; gap:16px; padding:11px 0;' + (i < summary.length - 1 ? ' border-bottom:1px solid var(--ds-color-border);' : '')">
        <span>{{ s.label }}</span>
        <span :style="'font-weight:700; ' + (s.big ? 'font-size:1.375rem;' : 'font-size:1.0625rem;')">{{ s.value }}</span>
      </div>
    </q-card-section>
  </q-card>`

/* One total split by the chosen dimension: the catalog's single-row share bar,
   with a static legend underneath that carries each part's amount and share.
   The chart's own legend is off because this one replaces it; the Table view
   has the same values. Account-wide (decision 3) — not narrowed by the queue. */
const disputeByCard = `
  <ds-chart-card title="Dispute By" :subtitle="disputeBySubtitle" table-toggle style="${PANEL('1', '260px', '250px')}">
    <template #default="{ view }">
      <div v-if="view === 'chart'" style="margin:-8px 0 8px;">
        ${quietMenu('breakdown', 'breakdownOptions', 'breakdownShort', 'Break down by')}
      </div>
      <ds-stacked-bar-chart percent horizontal :labels="['Amount']" :series="disputeBySeries"
        value-format="currency" bare :height="28" :show-grid="false" :show-legend="false" :view="view"
        :aria-label="'Disputed amount by ' + breakdown.toLowerCase() + ', share of ' + disputeByTotal" />
      <ds-chart-legend v-if="view === 'chart'" :items="disputeByLegend" :interactive="false" layout="column"
        style="margin-top:14px;" />
    </template>
  </ds-chart-card>`

/* The status cards. `q-card tag="button"` keeps the DS card shell and real
   button semantics at the same time, so the pressed state is announced, not
   just painted. Each card wears its own status tint, which is why these are
   not the plain white cards the rest of the screen uses. */
const filterCards = `
  <div style="display:flex; gap:14px; margin:18px 0;">
    <q-card v-for="f in cards" :key="f.key" flat bordered tag="button" type="button"
      :aria-pressed="active === f.key" :style="cardStyle(f)" @click="pickStatus(f.key)">
      <q-card-section :style="active === f.key ? 'padding:14px 18px;' : 'padding:15px 19px;'">
        <div :style="'font-size:0.75rem; font-weight:700; letter-spacing:0.05em; color:' + tint(f).fg + ';'">{{ f.label }}</div>
        <div :style="'font-size:1.75rem; font-weight:700; line-height:1.2; margin:2px 0; color:' + tint(f).fg + ';'">{{ f.count }}</div>
        <div style="${EP_CAPTION}">{{ f.amount }}</div>
      </q-card-section>
    </q-card>
  </div>`

/* The filter panel. Every field edits `draft`; Apply copies it onto the
   applied filters. Chip groups for the short fixed lists (a merchant scans
   four statuses faster than they open a dropdown), dropdowns for the long
   labels. */
const filterPanel = `
  <ds-side-panel v-model="panelOpen" title="Filter disputes" width="480px">
    <div style="display:flex; flex-direction:column; gap:22px; padding-top:8px;">
      <ds-field label="Status">
        <ds-choice-chips v-model="draft.status" :options="statusOptions" aria-label="Status" />
      </ds-field>
      <ds-select v-model="draft.reasons" :options="reasonOptions" label="Reason" multiple clearable
        placeholder="Any reason" />
      <ds-field label="Payment method">
        <ds-choice-chips v-model="draft.brands" :options="brandOptions" aria-label="Payment method" />
      </ds-field>
      <ds-field label="Dispute type">
        <ds-choice-chips v-model="draft.kinds" :options="kindOptions" aria-label="Dispute type" />
      </ds-field>
      <div style="display:flex; gap:12px;">
        <ds-input v-model="draft.amountMin" type="currency" label="Minimum amount" placeholder="0" style="flex:1;" />
        <ds-input v-model="draft.amountMax" type="currency" label="Maximum amount" placeholder="No limit"
          :error="amountError" style="flex:1;" />
      </div>
      <ds-select v-model="draft.events" :options="eventOptions" label="Event" multiple clearable
        placeholder="Any event" />
    </div>
    <template #footer>
      <div class="row items-center no-wrap">
        <q-btn flat no-caps color="primary" label="Clear all" :disable="!draftCount" @click="clearDraft" />
        <q-space />
        <q-btn unelevated no-caps color="primary" :label="applyLabel" :disable="!!amountError"
          data-test="apply-filters" @click="applyDraft" />
      </div>
    </template>
  </ds-side-panel>`

/* The queue is a QTable with `.ds-table`, so the Azure header bar, the zebra
   rows and the rounded outline all come from the design system. The table is
   handed one page of rows and DsPagination (the DS "Rich" pager, with its
   "Showing x–y of z" summary) pages the whole result set, so the count is the
   real number of matches rather than what is on screen. */
const table = `
  <q-card flat bordered>
    <q-card-section style="padding:22px 24px;">
      <div class="row items-center no-wrap q-mb-md">
        <div style="font-size:1.125rem; font-weight:700;">{{ heading }}</div>
        <q-space />
        <div style="${EP_CAPTION}">Click a card above to filter</div>
      </div>

      <div class="row items-center no-wrap q-mb-md">
        <div style="width:320px;">
          <ds-search v-model="q" placeholder="Search disputes" :results="suggestions" />
        </div>
        <q-space />
        <q-btn outline no-caps color="primary" icon="filter_list" label="Filter" class="q-mr-sm"
          aria-haspopup="dialog" data-test="open-filters" @click="panelOpen = true">
          <q-badge v-if="chips.length" color="primary" rounded class="q-ml-sm"
            :aria-label="chips.length + ' filters applied'">{{ chips.length }}</q-badge>
        </q-btn>
        <q-btn outline no-caps color="primary" icon="file_download" label="Export" />
      </div>

      <div v-if="chips.length" class="row items-center q-mb-md" data-test="active-filters"
        style="background:var(--ds-color-background-brand-subtlest); border:1px solid var(--ds-color-border);
               border-radius:var(--ds-radius-md); padding:8px 14px; gap:4px 0;">
        <q-icon name="filter_list" size="18px" color="grey-7" class="q-mr-sm" />
        <span style="${EP_CAPTION} margin-right:10px;">Filter by:</span>
        <q-chip v-for="c in chips" :key="c.key" removable dense color="primary" text-color="white"
          style="font-size:0.8125rem;" :remove-aria-label="'Remove ' + c.field + ' filter'" @remove="removeChip(c.key)">
          {{ c.field }}: <strong class="q-ml-xs">{{ c.label }}</strong>
        </q-chip>
        <q-space />
        <q-btn flat dense no-caps color="primary" label="Clear all" @click="clearApplied" />
      </div>

      <q-table class="ds-table" :rows="pageRows" :columns="columns" row-key="id"
        flat bordered :pagination="{ rowsPerPage: 0 }">

        <template #header-cell-actions="props">
          <q-th :props="props">
            <q-btn flat dense square icon="edit" color="white" size="sm" aria-label="Edit columns" />
          </q-th>
        </template>

        <template #body-cell-status="props">
          <q-td :props="props" style="${TD}">
            <span :style="chipStyle(props.row.status)">{{ props.row.status }}</span>
          </q-td>
        </template>

        <template #body-cell-id="props">
          <q-td :props="props" style="${TD}">
            <a href="#" class="eppay-link" @click.prevent>{{ props.row.id }}</a>
          </q-td>
        </template>

        <template #body-cell-dates="props">
          <q-td :props="props" style="${TD}">
            <div style="font-weight:700; font-size:0.9375rem;">{{ props.row.dateTop }}</div>
            <div style="${EP_CAPTION}">{{ props.row.dateSub }}</div>
          </q-td>
        </template>

        <template #body-cell-amounts="props">
          <q-td :props="props" style="${TD}">
            <div style="font-weight:700;">{{ props.row.amount }}</div>
            <div style="${EP_CAPTION}">{{ props.row.ofAmount }}</div>
          </q-td>
        </template>

        <template #body-cell-customer="props">
          <q-td :props="props" style="${TD}">
            <div style="font-weight:700;">{{ props.row.customer }}</div>
            <div style="display:flex; align-items:center; gap:8px; margin-top:4px;">
              <span :style="brandStyle(props.row.brand)">{{ props.row.brand }}</span>
              <span style="${EP_CAPTION}">{{ props.row.last4 }}</span>
            </div>
          </q-td>
        </template>

        <template #body-cell-txn="props">
          <q-td :props="props" style="${TD}">
            <a href="#" class="eppay-link" @click.prevent>{{ props.row.txn }}</a>
            <div style="${EP_CAPTION}">{{ props.row.txnDate }}</div>
          </q-td>
        </template>

        <template #body-cell-details="props">
          <q-td :props="props" style="${TD}">
            <div style="font-weight:700;">{{ props.row.kind }}</div>
            <div style="${EP_CAPTION}">{{ props.row.reason }}</div>
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props" style="${TD}">
            <ds-action-menu :label="'Actions for ' + props.row.id" :items="[
              { label: 'View dispute', icon: 'visibility' },
              { label: 'Submit evidence', icon: 'upload_file', disabled: props.row.status !== 'Evidence Needed' },
              { label: 'Copy dispute ID', icon: 'content_copy', copy: props.row.id },
              { label: 'Accept dispute', icon: 'gavel', danger: true, dividerBefore: true, disabled: props.row.status === 'Won' || props.row.status === 'Lost', confirm: { title: 'Accept ' + props.row.id + '?', message: 'You concede the dispute and the disputed amount stays with the cardholder.', okLabel: 'Accept dispute' } },
            ]" />
          </q-td>
        </template>

        <template #no-data>
          <div style="flex:1;" data-test="no-results">
            <ds-empty-state icon="filter_list_off" title="No matching disputes" :description="emptyDescription">
              <template #action>
                <q-btn unelevated no-caps color="primary" label="Clear filters" @click="clearEverything" />
              </template>
            </ds-empty-state>
          </div>
        </template>

        <template #bottom>
          <div style="flex:1; padding:4px 0;" data-test="showing">
            <ds-pagination v-model="page" :total="rows.length" :page-size="pageSize" noun="disputes" />
          </div>
        </template>
      </q-table>
    </q-card-section>
  </q-card>`

/* Concept only — see ChartConceptRatio. Full width under the three-up row,
   because it expands the summary's single "Dispute Ratio" figure into the
   trend behind it. */
const ratioCard = `
  <ds-chart-card title="Dispute ratio" subtitle="Disputes received ÷ transactions processed, by month" table-toggle
    style="${EP_CARD}">
    <template #default="{ view }">
      <ds-line-chart :labels="volumeLabels" :series="ratioSeries" label-format="month" value-format="percent"
        :height="200" :view="view" />
    </template>
  </ds-chart-card>`

const slot = ({ badge = '', extra = '' } = {}) => `
  <div style="${EP_PAGE}">
    ${epHeader('Disputes', {
      actions: `<ds-date-range-picker v-model="range" :presets="rangePresets" :today="today" :min="min" :max="today"
        align="right" label="Disputes date range" data-test="page-range" />`,
      ...(badge ? { badge, badgeColor: 'ds-warning text-ds-warning' } : {}),
    })}

    <q-card flat bordered style="${EP_CARD}">
      <q-card-section style="padding:18px; display:flex; gap:16px; flex-wrap:wrap;">
        ${chartCard}
        ${summaryCard}
        ${disputeByCard}
      </q-card-section>
    </q-card>

    ${extra}
    ${filterCards}
    ${table}
    ${filterPanel}
  </div>`

/* ---------------------------------------------------------------------------
 * State
 * ------------------------------------------------------------------------- */

/** "Visa" / "Visa, Amex" / "Visa +2" — a chip stays one line. */
const listLabel = (values) => (values.length <= 2 ? values.join(', ') : `${values[0]} +${values.length - 1}`)

/** The applied filters as chips — one per field, in the panel's order. `key`
 *  is what removing the chip clears. */
function chipsFor(f) {
  const out = []
  const list = (key, field) => { if (f[key].length) out.push({ key, field, label: listLabel(f[key]) }) }
  list('status', 'Status')
  list('reasons', 'Reason')
  list('brands', 'Payment method')
  list('kinds', 'Type')
  const { min, max } = amountBounds(f)
  if (min !== null || max !== null) {
    const label = min !== null && max !== null ? `${usd(min)} – ${usd(max)}` : min !== null ? `${usd(min)} or more` : `Up to ${usd(max)}`
    out.push({ key: 'amount', field: 'Amount', label })
  }
  list('events', 'Event')
  return out
}

/** @param initialStatus  a status, or 'All'
 *  @param opts.filters   any other fields to start applied (see emptyFilters)
 *  @param opts.panel     open the filter panel on load
 *  @param opts.range     the page date range to start on (default: year to date) */
function state(initialStatus, { filters = {}, panel = false, range: startRange = DEFAULT_RANGE } = {}) {
  const applied = reactive(copyFilters(emptyFilters(), filters))
  applied.status = initialStatus === 'All' ? [] : [initialStatus]
  const draft = reactive(copyFilters(emptyFilters(), applied))
  const panelOpen = ref(panel)
  const q = ref('')
  const page = ref(1)
  /** The page date range — scopes everything on the screen (decision 3). */
  const range = ref({ ...startRange })
  const scoped = computed(() => DISPUTES.filter((r) => inRange(r, range.value)))

  /* The panel always opens on what is applied — a draft abandoned last time
     is not resurrected. */
  watch(panelOpen, (open) => { if (open) copyFilters(draft, applied) })

  /* A chart has to be in one mode or the other, so the setter ignores an
     empty value. */
  const mode = ref('bar')
  const chartMode = computed({ get: () => mode.value, set: (v) => { if (v) mode.value = v } })
  /* The volume chart's legend, drawn by the page so the chart-type switcher
     can share its row. Same colour slots the chart uses; clicking a key hides
     that series (never the last one visible). */
  const hiddenSeries = ref([])
  const toggleSeries = (key) => {
    const on = hiddenSeries.value.includes(key)
    if (!on && hiddenSeries.value.length >= volumeSeries.value.length - 1) return
    hiddenSeries.value = on ? hiddenSeries.value.filter((k) => k !== key) : [...hiddenSeries.value, key]
  }

  /* ---- the queue ---- */
  const searched = computed(() => scoped.value.filter((r) => matchesSearch(r, q.value)))
  const rows = computed(() => searched.value.filter((r) => matchesFilters(r, applied)))
  /** Everything but status — what the status cards count within. */
  const facet = computed(() => searched.value.filter((r) => matchesFilters(r, applied, ['status'])))

  const cards = computed(() => CARDS.map((c) => {
    const inCard = c.key === 'All' ? facet.value : facet.value.filter((r) => r.status === c.key)
    return { ...c, count: inCard.length, amount: `${usd(sumAmount(inCard))} disputed` }
  }))

  const active = computed(() => {
    if (!applied.status.length) return 'All'
    return applied.status.length === 1 ? applied.status[0] : null
  })
  const pickStatus = (key) => { applied.status = key === 'All' ? [] : [key] }

  // Any change to what is matched starts again at page 1.
  watch([q, () => JSON.stringify(applied), range], () => { page.value = 1 })
  const pageRows = computed(() => rows.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE))

  const chips = computed(() => chipsFor(applied))
  const removeChip = (key) => {
    const blank = emptyFilters()
    if (key === 'amount') { applied.amountMin = ''; applied.amountMax = '' }
    else applied[key] = blank[key]
  }
  const clearApplied = () => copyFilters(applied, emptyFilters())
  const clearEverything = () => { clearApplied(); q.value = '' }

  /* ---- the panel ---- */
  const draftMatches = computed(() => searched.value.filter((r) => matchesFilters(r, draft)).length)
  const draftCount = computed(() => chipsFor(draft).length)
  const amountError = computed(() => {
    const { min, max } = amountBounds(draft)
    return min !== null && max !== null && max < min ? 'Must be at least the minimum' : ''
  })
  const applyLabel = computed(() => `Show ${draftMatches.value} dispute${draftMatches.value === 1 ? '' : 's'}`)
  const applyDraft = () => { copyFilters(applied, draft); panelOpen.value = false }
  const clearDraft = () => copyFilters(draft, emptyFilters())

  /* ---- the account figures (decision 3: scoped by the page range, not
     narrowed by the queue) ---- */
  const rangeText = computed(() => formatRange(range.value))
  const rangeCaption = computed(() => {
    const hit = RANGE_PRESETS.find((p) => p.key === range.value.preset)
    return hit ? hit.label : rangeText.value
  })
  const volumeLabels = computed(() => monthStarts(range.value))
  const monthly = computed(() => byMonth(DISPUTES, range.value))

  const compare = ref('period')
  const compareOpt = computed(() => COMPARE_OPTIONS.find((o) => o.value === compare.value))
  const comparison = computed(() => comparisonByMonth(DISPUTES, range.value, compare.value))
  /* Each option says in the menu when it has nothing to show for this range,
     so "Previous year" is not a surprise empty chart. */
  const compareOptions = computed(() => COMPARE_OPTIONS.map((o) => {
    const c = comparisonByMonth(DISPUTES, range.value, o.value)
    return { ...o, caption: c.coverage === 'none' ? `No data before ${formatLong(DATA_START)}` : formatRange(c.window) }
  }))
  /* Like the dashboard: a comparison with no data at all is dropped (the
     note says why); a partial one keeps its nulls, which the charts draw as
     gaps / "No data", never as 0. */
  const volumeSeries = computed(() => {
    const out = [{ key: 'selected', label: 'Selected range', data: monthly.value.map((m) => m.amount) }]
    if (comparison.value.coverage !== 'none') {
      out.push({ key: 'previous', label: compareOpt.value.label, data: comparison.value.values, comparison: true })
    }
    return out
  })
  /* Says WHY comparison months are missing. The chart's own note already
     says missing is not zero, so this one does not repeat it. The missing
     months are always the earliest ones (history has a start, not holes),
     so they print as one span. */
  const coverageNote = computed(() => {
    const c = comparison.value
    const name = compareOpt.value.label.toLowerCase()
    const floor = formatLong(DATA_START)
    if (c.coverage === 'none') return `No ${name} to compare: ${formatRange(c.window)} is before dispute history starts (${floor}).`
    if (c.coverage === 'partial') {
      const mon = (m) => formatMonth(m).slice(0, 3)
      const span = c.missing.length === 1 ? mon(c.missing[0]) : `${mon(c.missing[0])}–${mon(c.missing[c.missing.length - 1])}`
      return `No ${name} for ${span}: dispute history starts ${floor}.`
    }
    return ''
  })
  const volumeAria = computed(() => `Disputed amount by month, ${rangeText.value}${comparison.value.coverage === 'none' ? '' : `, compared with the ${compareOpt.value.label.toLowerCase()} (${formatRange(comparison.value.window)})`}`)

  const summary = computed(() => {
    const rows = scoped.value
    const txns = txnsIn(range.value)
    return [
      { label: 'Amount Disputed', value: usd(sumAmount(rows)), big: true },
      { label: 'Disputes Received', value: String(rows.length) },
      { label: 'Won', value: String(rows.filter((r) => r.status === 'Won').length) },
      { label: 'Lost', value: String(rows.filter((r) => r.status === 'Lost').length) },
      { label: 'Original Transactions', value: txns.toLocaleString('en-US') },
      { label: 'Dispute Ratio', value: txns ? formatValue(rows.length / txns, 'percent', { decimals: 2 }) : '—', big: true },
    ]
  })

  /* Chart concept · Dispute ratio — disputes received ÷ transactions
     processed, per month of the page range. Ratios, not percentages. */
  const ratioSeries = computed(() => [
    { key: 'ratio', label: 'Dispute ratio', data: monthly.value.map((m) => {
      const { start, end } = range.value
      const t = txnsIn({ start: m.month > start ? m.month : start, end: endOfMonth(m.month) < end ? endOfMonth(m.month) : end })
      return t ? m.count / t : null
    }) },
    { key: 'threshold', label: 'Monitoring threshold (0.9%)', data: volumeLabels.value.map(() => RATIO_THRESHOLD), comparison: true },
  ])

  const breakdown = ref('Payment Method')
  const breakdownShort = computed(() => BREAKDOWNS.find((b) => b.value === breakdown.value).short)
  const breakdownOptions = BREAKDOWNS.map(({ value }) => ({ value, label: value }))
  const disputeBy = computed(() => amountBy(scoped.value, BREAKDOWNS.find((b) => b.value === breakdown.value).field))
  const disputeBySeries = computed(() => disputeBy.value.map((d, i) => ({ key: `part-${i}`, label: d.label, data: [d.amount] })))
  const disputeByTotal = computed(() => sumAmount(scoped.value))
  /** The legend rows: swatch from the same slot the bar segment gets, amount
   *  and share formatted by the chart formatters. */
  const disputeByLegend = computed(() => {
    const slots = seriesColorSlots(disputeBySeries.value)
    return disputeBy.value.map((d, i) => ({
      key: `part-${i}`, label: d.label, color: slots[i],
      value: usd(d.amount), detail: formatValue(d.amount / disputeByTotal.value, 'percent'),
    }))
  })

  /** Switcher button: 40 wide, 38 tall inside the 1px container border (40
   *  overall, like DsActionMenu); a hairline between the two. */
  const switchStyle = (value, i) => {
    const on = chartMode.value === value
    return [
      'width:40px; min-width:40px; height:38px; min-height:38px; border-radius:0;',
      i ? 'border-left:1px solid var(--ds-color-border-container);' : '',
      on ? 'background:var(--ds-color-background-brand-subtlest); color:var(--ds-color-text-brand);'
        : 'background:var(--ds-color-surface); color:var(--ds-color-icon-subtle);',
    ].join(' ')
  }

  const tint = (f) => tintFor(f.key)
  /* One card is the current filter, and the capture marks it with a 2px edge in
     its own tone rather than a different fill — the fills already carry meaning.
     The card section compensates with 1px of padding so the row's height stays
     steady when the edge thins. */
  const cardStyle = (f) => {
    const t = tint(f)
    const on = active.value === f.key
    return [
      'flex:1; padding:0; text-align:left; font:inherit; cursor:pointer;',
      `background:${t.bg};`,
      on ? `border:2px solid ${t.fg};` : 'border:1px solid var(--ds-color-border-container);',
    ].join(' ')
  }

  return {
    // queue
    q, page, pageSize: PAGE_SIZE, rows, pageRows, columns: COLUMNS,
    cards, active, pickStatus, tint, cardStyle,
    chipStyle: statusChip, brandStyle: () => BRAND_CHIP,
    chips, removeChip, clearApplied, clearEverything,
    heading: computed(() => {
      if (!applied.status.length) return 'All Disputes'
      return applied.status.length === 1 ? `${applied.status[0]} Disputes` : 'Disputes'
    }),
    emptyDescription: computed(() => (q.value.trim()
      ? `Nothing matches “${q.value.trim()}” with these filters. Try a different search or remove a filter.`
      : 'Nothing in the queue matches these filters. Remove a filter or widen the date range.')),
    // The dropdown under the search box offers the rows it would leave behind.
    suggestions: computed(() => rows.value.slice(0, 6).map((r) => ({ id: r.id, label: r.id, sublabel: `${r.customer} · ${r.amount}` }))),
    // panel
    panelOpen, draft, draftCount, applyLabel, applyDraft, clearDraft, amountError,
    statusOptions: DISPUTE_STATUSES, reasonOptions: DISPUTE_REASONS, brandOptions: DISPUTE_BRANDS,
    kindOptions: DISPUTE_KINDS, eventOptions: DISPUTE_EVENTS,
    // page range
    range, rangePresets: RANGE_PRESETS, today: AS_OF, min: DATA_START, rangeText, rangeCaption,
    // account charts
    hiddenSeries, toggleSeries,
    volumeLegend: computed(() => {
      const slots = seriesColorSlots(volumeSeries.value)
      return volumeSeries.value.map((s, i) => ({ key: s.key, label: s.label, color: slots[i], dashed: !!s.comparison && chartMode.value === 'line' }))
    }),
    chartMode, switchStyle, compare, compareOptions, compareShort: computed(() => compareOpt.value.short),
    breakdown, breakdownOptions, breakdownShort,
    /* What the bar means, in words: it splits the disputed dollars in the
       range by the chosen dimension, so the reader knows the parts add up to
       the Dispute Summary's disputed amount. No date range here — the page
       picker, the Disputes card and the Summary already say it, and repeating
       it ran this narrow card's subtitle to three lines. */
    disputeBySubtitle: computed(() => `Share of the disputed amount, by ${breakdown.value.toLowerCase()}`),
    chartModes: [
      { value: 'bar', label: 'Bar chart', icon: 'bar_chart' },
      { value: 'line', label: 'Line chart', icon: 'show_chart' },
    ],
    volumeLabels, volumeSeries, volumeAria, coverageNote, ratioSeries,
    disputeBySeries, disputeByLegend, disputeByTotal: computed(() => usd(disputeByTotal.value)),
    summary,
  }
}

const screen = (filter, slotOpts, stateOpts) => epPage({
  active: 'disputes',
  components: {
    DsSearch, DsChoiceChips, DsSidePanel, DsField, DsSelect, DsInput, DsEmptyState, DsPagination, DsDateRangePicker,
    DsChartCard, DsChartLegend, DsBarChart, DsLineChart, DsStackedBarChart,
  },
  setup: () => state(filter, stateOpts),
  slot: slot(slotOpts),
})

/** The queue as it opens: the disputes with an evidence deadline running. */
export const EvidenceNeeded = screen('Evidence Needed')
EvidenceNeeded.storyName = 'Evidence Needed (default)'

/** Evidence is in and the network has not ruled yet — nothing to do but wait. */
export const Pending = screen('Pending')

/** No status filter: the chip row disappears and the Filter badge clears.
 *  48 disputes over five pages. */
export const AllDisputes = screen('All')
AllDisputes.storyName = 'All Disputes'

/** The Filter panel open over the queue, with filters already applied: Visa
 *  and Mastercard disputes over $500, inside the page's default range (year to
 *  date — dates are the page picker's job, not the panel's). The table behind
 *  the scrim, the chips, the Filter badge and the status cards' facet counts
 *  all reflect them; the Apply button counts what the draft would show.
 *  Change a field to watch the Apply count move before anything is applied. */
export const FiltersOpen = screen('All', {}, {
  panel: true,
  filters: { brands: ['Visa', 'Mastercard'], amountMin: 500 },
})
FiltersOpen.storyName = 'Filters open'

/** Filters that match nothing: Evidence Needed disputes paid by PayPal. The
 *  status cards still count within the other filter (so "Won 3" says where
 *  the PayPal disputes are), and the table offers one way out. */
export const NoMatchingDisputes = screen('Evidence Needed', {}, {
  filters: { brands: ['PayPal'] },
})
NoMatchingDisputes.storyName = 'No matching disputes'

/** **Chart concept — for approval.** The screen as it opens, plus a dispute
 *  ratio trend under the summary row.
 *
 *  - **Question it answers:** "Is my dispute ratio getting worse, and how close
 *    is it to the level that puts my account under review?" The summary shows
 *    one 12-month figure (0.71%); it cannot show that August ran at 1.6% after a
 *    quieter spring (about 0.5%). The volume chart above is in dollars, so it cannot
 *    answer this either — one $3,000 dispute and three $1,000 ones look the
 *    same there, but not to a card network.
 *  - **Why a line:** change over time for one continuous measure, with a
 *    reference to read it against (Overview: "Line — change over time, 1–5
 *    series"). A rate, so `valueFormat: 'percent'` on ratios. Its own chart
 *    rather than a second axis on the volume chart — the Overview's "one value
 *    axis" rule.
 *  - **Adds, does not replace:** the summary's single ratio stays; this is
 *    the trend behind it. The threshold is a flat comparison series (dashed,
 *    neutral) because the catalog has no reference-line prop; its 0.9% value
 *    is illustrative until product confirms which network's rule EP Pay shows.
 */
export const ChartConceptRatio = screen('Evidence Needed', {
  badge: 'Chart concept — for approval',
  extra: ratioCard,
})
ChartConceptRatio.storyName = 'Chart concept · Dispute ratio trend'
