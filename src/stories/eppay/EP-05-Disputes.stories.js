/** EP Pay / Screens / 05 · Disputes.
 *
 *  The 09/28 capture (references/092826/…-disputes-…png) set what is on this
 *  screen and where; the design system set how it looks.
 *
 *  Four decisions worth stating:
 *
 *  1. The chart is hand-drawn — plain divs for the bars, one inline SVG
 *     polyline pair for the line mode. A charting library would be a new
 *     dependency for one card of one screen, and the shapes here are a
 *     fixed-scale eight-month comparison, not a data-bound plot. It reads the
 *     same way as the dashboard sparklines: this period in the brand colour,
 *     last year in the neutral behind it.
 *
 *  2. The five stat cards are the table's filter control, not decoration. The
 *     capture spells this out ("Click a card above to filter"), so they are
 *     real buttons: clicking one re-titles the table, swaps the filter chip and
 *     narrows the rows. The counts on the cards stay the true account totals
 *     (34 disputes), while the table shows one page — which is why the footer
 *     reads "1–N of <card count>" rather than counting the rows on screen.
 *
 *  3. Dispute By is one amount split six ways, so its segments run down a
 *     single brand ramp from darkest to lightest rather than across six unlike
 *     hues. The ordering already carries the ranking, each swatch sits beside
 *     its own label, and six arbitrary colours would read as six categories of
 *     something — which is exactly what these are not.
 *
 *  4. Card-brand marks are neutral DS chips, not logos and not each network's
 *     own colour. Brand artwork in a prototype repo is a licensing question,
 *     and brand colours in a table whose other chips mean "won" and "lost"
 *     would be six more colours competing with the ones that carry status.
 */
import { ref, computed } from 'vue'
import { epPage, epHeader, tintFor, statusChip, BRAND_CHIP, EP_CARD, EP_CAPTION, EP_PAGE } from './_eppay'
import DsSearch from '../../components/DsSearch.vue'
import DsChoiceChips from '../../components/DsChoiceChips.vue'

export default {
  title: 'EP Pay/Screens/05 · Disputes',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Disputes: volume against the previous year, a summary of outcomes, a breakdown by payment method, and the dispute queue. The five stat cards filter the table — click one.' } },
  },
}

/* ---------------------------------------------------------------------------
 * Fixtures — local to this screen. The scaffold's shared fixtures describe the
 * merchant's balances and payouts; disputes are this file's business only.
 * ------------------------------------------------------------------------- */

/** Monthly dispute volume, in dollars. Fixed scale — see CHART_MAX. */
const MONTHS = [
  { m: 'Jan', sel: 10000, prev: 6500 },
  { m: 'Feb', sel: 9000, prev: 6300 },
  { m: 'Mar', sel: 18500, prev: 5800 },
  { m: 'Apr', sel: 7800, prev: 5600 },
  { m: 'May', sel: 400, prev: 2800 },
  { m: 'Jun', sel: 300, prev: 3600 },
  { m: 'Jul', sel: 3200, prev: 6500 },
  { m: 'Aug', sel: 4500, prev: 6200 },
]
const CHART_MAX = 20000
const GRIDS = ['$20k', '$15k', '$10k', '$5k', '$0']

const SUMMARY = [
  { label: 'Amount Disputed', value: '$53,455.35', big: true },
  { label: 'Disputes Received', value: '34' },
  { label: 'Won', value: '9' },
  { label: 'Lost', value: '6' },
  { label: 'Original Transactions', value: '6,800' },
  { label: 'Dispute Ratio', value: '0.50%', big: true },
]

/* Shares of one total, biggest first, so the ramp runs dark to light in step
   with the ranking. Straight from the DS brand ramp — no colour is invented.
   The steps skip a stop each (900, 700, 500, 300, 200, 100): adjacent stops are
   indistinguishable at swatch size, and six segments nobody can tell apart is
   worse than five. */
const DISPUTE_BY = [
  { label: 'Visa', amount: '$15,888.88', pct: 29.7, color: 'var(--ds-palette-azure-900)' },
  { label: 'Mastercard', amount: '$11,258.65', pct: 21.1, color: 'var(--ds-palette-azure-700)' },
  { label: 'Discover', amount: '$11,150.32', pct: 20.9, color: 'var(--ds-palette-azure-500)' },
  { label: 'Amex', amount: '$8,668.90', pct: 16.2, color: 'var(--ds-palette-azure-300)' },
  { label: 'PayPal', amount: '$3,729.00', pct: 7.0, color: 'var(--ds-palette-azure-200)' },
  { label: 'Klarna', amount: '$2,759.60', pct: 5.2, color: 'var(--ds-palette-azure-100)' },
]

/** The filter cards. `key` doubles as the status matched in the table. */
const FILTERS = [
  { key: 'Evidence Needed', label: 'EVIDENCE NEEDED', count: 10, amount: '$14,455.60 disputed' },
  { key: 'Pending', label: 'PENDING', count: 9, amount: '$19,096.41 disputed' },
  { key: 'Won', label: 'WON', count: 9, amount: '$11,852.68 disputed' },
  { key: 'Lost', label: 'LOST', count: 6, amount: '$8,050.66 disputed' },
  { key: 'All', label: 'ALL', count: 34, amount: '$53,455.35 disputed' },
]

const ROWS = [
  { status: 'Evidence Needed', id: 'DSP-52721', dateTop: 'Disputed: Aug 20, 2026', dateSub: 'Evidence due: Aug 30, 2026', amount: '$730.00', ofAmount: 'of $730.00', customer: 'Noah Klein', brand: 'Klarna', last4: '2914', txn: 'TXN-2026-15993', txnDate: 'Aug 20, 2026', kind: 'Retrieval', reason: 'Subscription canceled' },
  { status: 'Evidence Needed', id: 'DSP-52173', dateTop: 'Disputed: Aug 8, 2026', dateSub: 'Evidence due: Aug 18, 2026', amount: '$671.40', ofAmount: 'of $1,119.00', customer: 'Elena Fischer', brand: 'Klarna', last4: '2914', txn: 'TXN-2026-15369', txnDate: 'Jul 27, 2026', kind: 'Chargeback', reason: 'Credit not processed' },
  { status: 'Evidence Needed', id: 'DSP-50118', dateTop: 'Disputed: Apr 10, 2026', dateSub: 'Evidence due: Apr 20, 2026', amount: '$3,003.67', ofAmount: 'of $3,856.67', customer: 'Maya Sorensen', brand: 'Discover', last4: '7076', txn: 'TXN-244454', txnDate: 'Mar 20, 2026', kind: 'Chargeback', reason: 'Duplicate charge' },
  { status: 'Evidence Needed', id: 'DSP-49707', dateTop: 'Disputed: Mar 22, 2026', dateSub: 'Evidence due: Apr 1, 2026', amount: '$1,320.00', ofAmount: 'of $1,320.00', customer: 'Jamal Rivers', brand: 'Visa', last4: '1606', txn: 'TXN-243521', txnDate: 'Mar 16, 2026', kind: 'Chargeback', reason: 'Credit not processed' },
  { status: 'Evidence Needed', id: 'DSP-51625', dateTop: 'Disputed: Mar 22, 2026', dateSub: 'Evidence due: Apr 1, 2026', amount: '$471.00', ofAmount: 'of $471.00', customer: 'Elena Fischer', brand: 'Mastercard', last4: '4508', txn: 'TXN-2026-11963', txnDate: 'Mar 18, 2026', kind: 'Inquiry', reason: 'Fraudulent' },
  { status: 'Evidence Needed', id: 'DSP-51214', dateTop: 'Disputed: Mar 4, 2026', dateSub: 'Evidence due: Mar 14, 2026', amount: '$739.00', ofAmount: 'of $739.00', customer: 'Hannah Reyes', brand: 'Visa', last4: '4242', txn: 'TXN-2026-11248', txnDate: 'Feb 19, 2026', kind: 'Inquiry', reason: 'Product unacceptable' },
  { status: 'Evidence Needed', id: 'DSP-49159', dateTop: 'Disputed: Feb 25, 2026', dateSub: 'Evidence due: Mar 7, 2026', amount: '$1,876.44', ofAmount: 'of $1,932.44', customer: 'Ben Castellano', brand: 'Visa', last4: '9311', txn: 'TXN-242277', txnDate: 'Feb 15, 2026', kind: 'Inquiry', reason: 'Fraudulent' },
  { status: 'Evidence Needed', id: 'DSP-48611', dateTop: 'Disputed: Jan 31, 2026', dateSub: 'Evidence due: Feb 10, 2026', amount: '$2,432.88', ofAmount: 'of $2,804.88', customer: 'Tom Okada', brand: 'Visa', last4: '8017', txn: 'TXN-241033', txnDate: 'Jan 17, 2026', kind: 'Retrieval', reason: 'Subscription canceled' },
  { status: 'Evidence Needed', id: 'DSP-50666', dateTop: 'Disputed: Jan 19, 2026', dateSub: 'Evidence due: Jan 29, 2026', amount: '$2,462.00', ofAmount: 'of $2,462.00', customer: 'Marcus Webb', brand: 'Visa', last4: '4242', txn: 'TXN-2026-10312', txnDate: 'Jan 14, 2026', kind: 'Retrieval', reason: 'Product not received' },
  { status: 'Evidence Needed', id: 'DSP-48200', dateTop: 'Disputed: Jan 12, 2026', dateSub: 'Evidence due: Jan 22, 2026', amount: '$749.21', ofAmount: 'of $908.21', customer: 'Elena Fischer', brand: 'Mastercard', last4: '2547', txn: 'TXN-240100', txnDate: 'Dec 20, 2025', kind: 'Retrieval', reason: 'Product not received' },

  { status: 'Pending', id: 'DSP-52890', dateTop: 'Disputed: Aug 24, 2026', dateSub: 'Evidence submitted: Aug 26, 2026', amount: '$1,204.55', ofAmount: 'of $1,204.55', customer: 'Priya Raman', brand: 'Amex', last4: '3315', txn: 'TXN-2026-16104', txnDate: 'Aug 11, 2026', kind: 'Chargeback', reason: 'Fraudulent' },
  { status: 'Pending', id: 'DSP-52744', dateTop: 'Disputed: Aug 21, 2026', dateSub: 'Evidence submitted: Aug 23, 2026', amount: '$3,410.90', ofAmount: 'of $3,410.90', customer: 'Owen Marsh', brand: 'Visa', last4: '6620', txn: 'TXN-2026-16022', txnDate: 'Aug 4, 2026', kind: 'Chargeback', reason: 'Product not received' },
  { status: 'Pending', id: 'DSP-52410', dateTop: 'Disputed: Aug 12, 2026', dateSub: 'Evidence submitted: Aug 14, 2026', amount: '$885.00', ofAmount: 'of $885.00', customer: 'Lena Fischer', brand: 'Mastercard', last4: '4508', txn: 'TXN-2026-15782', txnDate: 'Jul 30, 2026', kind: 'Inquiry', reason: 'Duplicate charge' },

  { status: 'Won', id: 'DSP-51988', dateTop: 'Disputed: Jul 2, 2026', dateSub: 'Won: Jul 24, 2026', amount: '$2,150.00', ofAmount: 'of $2,150.00', customer: 'Grace Lindqvist', brand: 'Visa', last4: '1188', txn: 'TXN-2026-14310', txnDate: 'Jun 18, 2026', kind: 'Chargeback', reason: 'Product not received' },
  { status: 'Won', id: 'DSP-51640', dateTop: 'Disputed: Jun 14, 2026', dateSub: 'Won: Jul 3, 2026', amount: '$640.25', ofAmount: 'of $640.25', customer: 'Andre Soto', brand: 'Discover', last4: '7076', txn: 'TXN-2026-13877', txnDate: 'Jun 2, 2026', kind: 'Inquiry', reason: 'Credit not processed' },
  { status: 'Won', id: 'DSP-51203', dateTop: 'Disputed: May 28, 2026', dateSub: 'Won: Jun 15, 2026', amount: '$1,975.40', ofAmount: 'of $2,110.40', customer: 'Hannah Reyes', brand: 'Visa', last4: '4242', txn: 'TXN-2026-13204', txnDate: 'May 9, 2026', kind: 'Chargeback', reason: 'Fraudulent' },

  { status: 'Lost', id: 'DSP-50902', dateTop: 'Disputed: May 4, 2026', dateSub: 'Lost: May 26, 2026', amount: '$1,488.00', ofAmount: 'of $1,488.00', customer: 'Diego Ramirez', brand: 'PayPal', last4: '8830', txn: 'TXN-2026-12551', txnDate: 'Apr 22, 2026', kind: 'Chargeback', reason: 'Fraudulent' },
  { status: 'Lost', id: 'DSP-50477', dateTop: 'Disputed: Apr 18, 2026', dateSub: 'Lost: May 9, 2026', amount: '$920.60', ofAmount: 'of $920.60', customer: 'Tom Okada', brand: 'Visa', last4: '8017', txn: 'TXN-2026-12088', txnDate: 'Apr 3, 2026', kind: 'Chargeback', reason: 'Duplicate charge' },
  { status: 'Lost', id: 'DSP-49845', dateTop: 'Disputed: Mar 9, 2026', dateSub: 'Lost: Mar 30, 2026', amount: '$3,268.10', ofAmount: 'of $3,268.10', customer: 'Maya Sorensen', brand: 'Amex', last4: '3315', txn: 'TXN-2026-11402', txnDate: 'Feb 24, 2026', kind: 'Retrieval', reason: 'Subscription canceled' },
]

/** The dispute queue's columns. Seven of the eight stack a value over a muted
 *  second line, so each is drawn by a `#body-cell-*` slot; `field` still points
 *  at the primary value so the column has something real behind it. */
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

const chartCard = `
  <q-card flat bordered style="${PANEL('1.7', '420px', '380px')}">
    <q-card-section style="padding:20px 22px;">
      <div class="row items-center no-wrap q-mb-lg">
        <div style="font-size:1.125rem; font-weight:700;">Disputes</div>
        <q-space />
        <ds-choice-chips v-model="chartMode" :options="chartModes" :multiple="false" class="q-mr-md" />
        <div style="display:flex; align-items:center; gap:6px; border:1px solid var(--ds-color-border); border-radius:var(--ds-radius-md); padding:4px 10px 4px 14px;">
          <span style="${EP_CAPTION}">Compared to</span>
          <q-select v-model="compare" :options="['Previous Year', 'Previous Period']" borderless dense
            options-dense dropdown-icon="expand_more" style="font-weight:700;" />
        </div>
      </div>

      <!-- Hand-drawn on purpose: a fixed-scale eight-month comparison, not a
           data-bound plot. A charting library for one card of one screen is a
           dependency the prototype does not need, and there is no DS chart
           component to reach for. -->
      <div style="display:flex; gap:10px;">
        <div style="display:flex; flex-direction:column; justify-content:space-between; height:170px; ${EP_CAPTION} text-align:right;">
          <span v-for="g in grids" :key="g">{{ g }}</span>
        </div>
        <div style="flex:1; min-width:0;">
          <div style="position:relative; height:170px;">
            <div v-for="(g, i) in grids" :key="'grid-' + g"
              :style="'position:absolute; left:0; right:0; border-top:1px solid var(--ds-color-border); top:' + (i * 25) + '%;'"></div>

            <div v-if="chartMode === 'bar'" style="position:absolute; inset:0; display:flex; align-items:flex-end; gap:0;">
              <div v-for="m in months" :key="m.m"
                style="flex:1; display:flex; align-items:flex-end; justify-content:center; gap:4px; height:100%;">
                <div :style="'width:16px; border-radius:var(--ds-radius-sm) var(--ds-radius-sm) 0 0; background:var(--ds-color-border-bold); height:' + pct(m.prev) + '%;'"></div>
                <div :style="'width:16px; border-radius:var(--ds-radius-sm) var(--ds-radius-sm) 0 0; background:var(--ds-color-background-brand-bold); height:' + pct(m.sel) + '%;'"></div>
              </div>
            </div>

            <svg v-else viewBox="0 0 100 100" preserveAspectRatio="none" role="img"
              aria-label="Dispute volume, selected range against the previous year"
              style="position:absolute; inset:0; width:100%; height:100%;">
              <polyline :points="prevLine" fill="none" stroke="var(--ds-color-border-bold)" stroke-width="2"
                vector-effect="non-scaling-stroke" stroke-linejoin="round" />
              <polyline :points="selLine" fill="none" stroke="var(--ds-color-background-brand-bold)" stroke-width="2"
                vector-effect="non-scaling-stroke" stroke-linejoin="round" />
            </svg>
          </div>

          <div style="display:flex; margin-top:6px;">
            <div v-for="m in months" :key="'lbl-' + m.m" style="flex:1; text-align:center; ${EP_CAPTION}">{{ m.m }}</div>
          </div>
        </div>
      </div>

      <div class="row justify-center items-center q-gutter-lg q-mt-md">
        <div style="display:flex; align-items:center; gap:8px; ${EP_CAPTION}">
          <span style="width:12px; height:12px; border-radius:var(--ds-radius-sm); background:var(--ds-color-background-brand-bold);"></span>Selected range
        </div>
        <div style="display:flex; align-items:center; gap:8px; ${EP_CAPTION}">
          <span style="width:12px; height:12px; border-radius:var(--ds-radius-sm); background:var(--ds-color-border-bold);"></span>Previous Year
        </div>
      </div>
    </q-card-section>
  </q-card>`

const summaryCard = `
  <q-card flat bordered style="${PANEL('1', '260px', '250px')}">
    <q-card-section style="padding:20px 22px;">
      <div class="row items-baseline no-wrap q-mb-md">
        <div style="font-size:1.125rem; font-weight:700;">Dispute Summary</div>
        <q-space />
        <div style="${EP_CAPTION}">Last 12 months</div>
      </div>
      <div v-for="(s, i) in summary" :key="s.label"
        :style="'display:flex; align-items:baseline; justify-content:space-between; gap:16px; padding:11px 0;' + (i < summary.length - 1 ? ' border-bottom:1px solid var(--ds-color-border);' : '')">
        <span>{{ s.label }}</span>
        <span :style="'font-weight:700; ' + (s.big ? 'font-size:1.375rem;' : 'font-size:1.0625rem;')">{{ s.value }}</span>
      </div>
    </q-card-section>
  </q-card>`

const disputeByCard = `
  <q-card flat bordered style="${PANEL('1', '260px', '250px')}">
    <q-card-section style="padding:20px 22px;">
      <div class="row items-center no-wrap q-mb-md">
        <div style="font-size:1.125rem; font-weight:700; white-space:nowrap;">Dispute By</div>
        <q-space />
        <q-select v-model="breakdown" :options="['Payment Method', 'Reason', 'Product']" outlined dense
          options-dense dropdown-icon="expand_more" style="font-weight:700;" />
      </div>

      <!-- A stacked share bar: six segments of one total. Divs, because the DS
           has no chart primitive and a six-segment bar is not worth one. -->
      <div style="display:flex; gap:3px; margin-bottom:18px;" role="img"
        :aria-label="'Disputed amount by ' + breakdown">
        <div v-for="d in disputeBy" :key="'seg-' + d.label"
          :style="'height:10px; border-radius:var(--ds-radius-sm); background:' + d.color + '; flex:' + d.pct + ';'"></div>
      </div>

      <div v-for="d in disputeBy" :key="d.label" class="row items-start no-wrap" style="padding:7px 0;">
        <span :style="'width:11px; height:11px; border-radius:var(--ds-radius-sm); flex:none; margin:5px 10px 0 0; background:' + d.color + ';'"></span>
        <div style="min-width:0;">
          <div style="font-weight:700;">{{ d.label }}</div>
          <div style="${EP_CAPTION}">{{ d.amount }}</div>
        </div>
        <q-space />
        <div style="font-weight:700; padding-top:1px;">{{ d.pct.toFixed(1) }}%</div>
      </div>
    </q-card-section>
  </q-card>`

/* The filter row. `q-card tag="button"` keeps the DS card shell and real button
   semantics at the same time, so the pressed state is announced, not just
   painted. Each card wears its own status tint, which is why these are not the
   plain white cards the rest of the screen uses. */
const filterCards = `
  <div style="display:flex; gap:14px; margin:18px 0;">
    <q-card v-for="f in filters" :key="f.key" flat bordered tag="button" type="button"
      :aria-pressed="active === f.key" :style="cardStyle(f)" @click="active = f.key">
      <q-card-section :style="active === f.key ? 'padding:14px 18px;' : 'padding:15px 19px;'">
        <div :style="'font-size:0.75rem; font-weight:700; letter-spacing:0.05em; color:' + tint(f).fg + ';'">{{ f.label }}</div>
        <div :style="'font-size:1.75rem; font-weight:700; line-height:1.2; margin:2px 0; color:' + tint(f).fg + ';'">{{ f.count }}</div>
        <div style="${EP_CAPTION}">{{ f.amount }}</div>
      </q-card-section>
    </q-card>
  </div>`

/* The queue is a QTable with `.ds-table`, so the Azure header bar, the zebra
   rows and the rounded outline all come from the design system. An earlier pass
   drew this as a plain <table> and re-painted that header by hand; the header
   was then the same colour twice, from two places. */
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
        <q-btn outline no-caps color="primary" icon="filter_list" label="Filter" class="q-mr-sm">
          <q-badge v-if="chips.length" color="primary" rounded class="q-ml-sm">{{ chips.length }}</q-badge>
        </q-btn>
        <q-btn outline no-caps color="primary" icon="file_download" label="Export" />
      </div>

      <div v-if="chips.length" class="row items-center no-wrap q-mb-md"
        style="background:var(--ds-color-background-brand-subtlest); border:1px solid var(--ds-color-border);
               border-radius:var(--ds-radius-md); padding:10px 14px;">
        <q-icon name="filter_list" size="18px" color="grey-7" class="q-mr-sm" />
        <span style="${EP_CAPTION} margin-right:10px;">Filter by:</span>
        <q-chip v-for="c in chips" :key="c.label" removable dense color="primary" text-color="white"
          style="font-size:0.8125rem;" @remove="active = 'All'">
          {{ c.field }}: <strong class="q-ml-xs">{{ c.label }}</strong>
        </q-chip>
        <q-space />
        <q-btn flat dense no-caps color="primary" label="Clear all" @click="active = 'All'" />
      </div>

      <q-table class="ds-table" :rows="rows" :columns="columns" row-key="id"
        flat bordered :pagination="{ rowsPerPage: 0 }"
        no-data-label="No disputes match this search.">

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
            <q-btn outline dense color="grey-6" icon="more_vert" size="sm" aria-label="Row actions" />
          </q-td>
        </template>

        <template #bottom>
          <div class="row items-center" style="flex:1; padding:4px 0;">
            <div style="${EP_CAPTION}">{{ footer }}</div>
            <q-space />
            <q-btn flat no-caps color="grey-6" label="Previous" disable class="q-mr-sm" />
            <q-btn unelevated no-caps color="primary" label="1" aria-current="page" style="min-width:40px;" class="q-mr-sm" />
            <q-btn outline no-caps color="grey-7" label="Next" />
          </div>
        </template>
      </q-table>
    </q-card-section>
  </q-card>`

const SLOT = `
  <div style="${EP_PAGE}">
    ${epHeader('Disputes', {
      actions: '<q-btn outline no-caps color="grey-8" icon="event" icon-right="expand_more" label="Year to Date" />',
    })}

    <q-card flat bordered style="${EP_CARD}">
      <q-card-section style="padding:18px; display:flex; gap:16px; flex-wrap:wrap;">
        ${chartCard}
        ${summaryCard}
        ${disputeByCard}
      </q-card-section>
    </q-card>

    ${filterCards}
    ${table}
  </div>`

/* ---------------------------------------------------------------------------
 * State
 * ------------------------------------------------------------------------- */

function state(initialFilter) {
  const active = ref(initialFilter)
  const q = ref('')

  /* DsChoiceChips in single-select mode clears on a second click of the live
     chip. A chart has to be in one mode or the other, so the setter drops the
     null and the group behaves as a segmented control. */
  const mode = ref('bar')
  const chartMode = computed({
    get: () => mode.value,
    set: (v) => { if (v) mode.value = v },
  })

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

  const chipStyle = statusChip
  const brandStyle = () => BRAND_CHIP

  const matches = (r) => {
    const needle = q.value.trim().toLowerCase()
    if (!needle) return true
    return [r.id, r.customer, r.txn, r.reason, r.kind].some((v) => v.toLowerCase().includes(needle))
  }

  const rows = computed(() =>
    ROWS.filter((r) => (active.value === 'All' || r.status === active.value) && matches(r)))

  const chips = computed(() =>
    active.value === 'All' ? [] : [{ field: 'Status', label: active.value }])

  const footer = computed(() => {
    const card = FILTERS.find((f) => f.key === active.value)
    const total = q.value.trim() ? rows.value.length : card.count
    return `Showing 1–${rows.value.length} of ${total} disputes`
  })

  const pct = (v) => (v / CHART_MAX) * 100
  const line = (key) => MONTHS
    .map((m, i) => `${(((i + 0.5) / MONTHS.length) * 100).toFixed(2)},${(100 - pct(m[key])).toFixed(2)}`)
    .join(' ')

  return {
    active, chartMode, q,
    columns: COLUMNS,
    compare: ref('Previous Year'),
    breakdown: ref('Payment Method'),
    chartModes: [
      { value: 'bar', label: 'Bar', icon: 'bar_chart' },
      { value: 'line', label: 'Line', icon: 'show_chart' },
    ],
    months: MONTHS, grids: GRIDS, pct, selLine: line('sel'), prevLine: line('prev'),
    summary: SUMMARY, disputeBy: DISPUTE_BY, filters: FILTERS,
    tint, cardStyle, chipStyle, brandStyle,
    rows, chips, footer,
    heading: computed(() => (active.value === 'All' ? 'All Disputes' : `${active.value} Disputes`)),
    // The dropdown under the search box offers the rows it would leave behind.
    suggestions: computed(() => rows.value.slice(0, 6).map((r) => ({ id: r.id, label: r.id, sublabel: `${r.customer} · ${r.amount}` }))),
  }
}

const screen = (filter) => epPage({
  active: 'disputes',
  components: { DsSearch, DsChoiceChips },
  setup: () => state(filter),
  slot: SLOT,
})

/** The queue as it opens: the disputes with an evidence deadline running. */
export const EvidenceNeeded = screen('Evidence Needed')
EvidenceNeeded.storyName = 'Evidence Needed (default)'

/** Evidence is in and the network has not ruled yet — nothing to do but wait. */
export const Pending = screen('Pending')

/** No status filter: the chip row disappears and the Filter badge clears. */
export const AllDisputes = screen('All')
AllDisputes.storyName = 'All Disputes'
