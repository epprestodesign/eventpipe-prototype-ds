/** EP Pay / Screens / 04 · Transactions.
 *
 *  The account ledger. The 09/28 capture fixed the arrangement — five cards
 *  above a table — and the design system fixed everything else. The cards are
 *  not decoration: they are the filter, and the selected one wears the DS
 *  selected pair (brand edge, palest brand wash). Clicking one narrows the
 *  table, so the screen demonstrates the interaction rather than describing it.
 *
 *  Three things worth stating:
 *
 *  1. The card counts (463 / 384 / 36 / 16 / 27) are account-wide totals for
 *     the selected period, while the table shows one page. So the footer reads
 *     "Showing 1–N of <that filter's total>" — N is what is on screen, the
 *     total is what the card claims, and the two are deliberately different.
 *
 *  2. Card brands are neutral text chips, not logo images and not each brand's
 *     own colour. Shipping real Visa/Amex/Klarna artwork into the design system
 *     is a trademark question, and painting the chips in brand colours spends
 *     six colours we do not own on a column that carries no status — next to
 *     the status chips, which do.
 *
 *  3. The rows live here rather than in `_eppay.js`. They are used by this
 *     screen only, and the shared scaffold is worth keeping small.
 */
import { ref, computed } from 'vue'
import { epPage, epHeader, epCard, statusChip, BRAND_CHIP, EP_CAPTION, EP_PAGE } from './_eppay'
import DsSearch from '../../components/DsSearch.vue'
import DsStat from '../../components/DsStat.vue'

export default {
  title: 'EP Pay/Screens/04 · Transactions',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'The transaction ledger with its five filter stat cards. Click a card to narrow the table; the footer count follows the filter.' } },
  },
}

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

/** Page 1 of the ledger, as the capture shows it. */
const TRANSACTIONS = [
  { id: 'TXN-2026-16006', status: 'Success', when: 'Aug 20, 2026 · 2:51 PM', amount: '$1,359.00', type: 'Sale', who: 'Elena Fischer', brand: 'visa', last4: '••••8821', event: 'Automated Playwright Live Event 340366', res: 'Hyatt Regency Seattle RES-5381879' },
  { id: 'TXN-2026-15993', status: 'Disputed', when: 'Aug 20, 2026 · 8:10 AM', amount: '$730.00', type: 'Sale', who: 'Noah Klein', brand: 'klarna', last4: '••••2914', event: 'Pricing Event 539073', res: 'Marriott Tempe at The Buttes RES-5379550' },
  { id: 'TXN-2026-15980', status: 'Success', when: 'Aug 19, 2026 · 10:36 AM', amount: '$804.00', type: 'Sale', who: 'Jordan Alvarez', brand: 'discover', last4: '••••6011', event: 'Automated Playwright Live Event 340366', res: 'Hyatt Regency Seattle RES-5379824' },
  { id: 'TXN-2026-15967', status: 'Success', when: 'Aug 19, 2026 · 3:55 PM', amount: '$2,575.00', type: 'Sale', who: 'Hannah Reyes', brand: 'paypal', last4: '••••7730', event: 'Pricing Event 539073', res: 'Marriott Tempe at The Buttes RES-5377495' },
  { id: 'TXN-2026-15954', status: 'Success', when: 'Aug 19, 2026 · 9:14 AM', amount: '$1,946.00', type: 'Sale', who: 'Marcus Webb', brand: 'amex', last4: '••••1007', event: 'Pricing Event 637236', res: 'Omni Tempe Hotel at ASU RES-5375166' },
  { id: 'TXN-2026-15941', status: 'Success', when: 'Aug 18, 2026 · 10:18 AM', amount: '$762.00', type: 'Sale', who: 'Chris Okonkwo', brand: 'mastercard', last4: '••••5309', event: 'Automated Playwright Live Event 340366', res: 'Hyatt Regency Seattle RES-5370782' },
  { id: 'TXN-2026-15928', status: 'Success', when: 'Aug 17, 2026 · 5:03 PM', amount: '−$243.00', type: 'Refund', who: 'Elena Fischer', brand: 'visa', last4: '••••4242', event: 'Automated Playwright Live Event 340366', res: 'Hyatt Regency Seattle RES-5368727' },
  { id: 'TXN-2026-15915', status: 'Success', when: 'Aug 17, 2026 · 11:22 AM', amount: '$1,978.00', type: 'Sale', who: 'Noah Klein', brand: 'mastercard', last4: '••••4508', event: 'Pricing Event 539073', res: 'Marriott Tempe at The Buttes RES-5366398' },
  { id: 'TXN-2026-15902', status: 'Refunded: Partial', when: 'Aug 16, 2026 · 1:48 PM', amount: '$2,052.00', type: 'Sale', who: 'Jordan Alvarez', brand: 'visa', last4: '••••8821', event: 'Automated Playwright Live Event 340366', res: 'Hyatt Regency Seattle RES-5366672' },
  { id: 'TXN-2026-15889', status: 'Success', when: 'Aug 16, 2026 · 6:07 PM', amount: '−$27.00', type: 'Adjustment', who: 'Hannah Reyes', brand: 'klarna', last4: '••••2914', event: 'Pricing Event 539073', res: 'Marriott Tempe at The Buttes RES-5364343' },
]

/** The filter cards. `match` is what each one keeps — null means "everything",
 *  which is why ALL needs no special case anywhere below. */
const FILTERS = [
  { key: 'all', label: 'All', count: 463, total: '$483,354.00', pages: 47, match: null },
  { key: 'success', label: 'Success', count: 384, total: '$397,121.00', pages: 39, match: (t) => t.status === 'Success' },
  { key: 'refunded', label: 'Refunded', count: 36, total: '$51,650.00', pages: 4, match: (t) => t.status.startsWith('Refunded') },
  { key: 'disputed', label: 'Disputed', count: 16, total: '$19,183.00', pages: 2, match: (t) => t.status === 'Disputed' },
  { key: 'failed', label: 'Failed', count: 27, total: '$15,400.00', pages: 3, match: (t) => t.status === 'Failed' },
]

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
    <q-card v-for="f in filters" :key="f.key" flat bordered tag="button" type="button"
      :aria-pressed="active === f.key"
      :style="'display:block; width:100%; padding:0; text-align:left; font:inherit; cursor:pointer; ' +
              (active === f.key
                ? 'border:2px solid var(--ds-color-border-brand); background:var(--ds-color-background-brand-subtlest);'
                : '')"
      @click="active = f.key">
      <q-card-section :style="active === f.key ? 'padding:17px 19px;' : 'padding:18px 20px;'">
        <div style="${MICRO}">{{ f.label }}</div>
        <ds-stat :value="f.count" :label="f.total" style="margin-top:4px;" />
      </q-card-section>
    </q-card>
  </div>`

/* The ledger is a QTable with `.ds-table`, so the Azure header bar, the zebra
   rows and the rounded outline all come from the design system. An earlier
   pass drew this as a grid of divs and re-painted that header by hand; the
   header was then the same colour twice, from two places. */
const table = `
  <q-table class="ds-table" :rows="visible" :columns="columns" row-key="id"
    flat bordered :pagination="{ rowsPerPage: 0 }"
    no-data-label="No transactions on this page match that filter.">

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
        <q-btn flat dense icon="more_vert" :aria-label="'Actions for ' + props.row.id"
          style="border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-sm); color:var(--ds-color-icon-subtle);" />
      </q-td>
    </template>

    <template #bottom>
      <div style="display:flex; align-items:center; gap:8px; flex:1; padding:6px 4px;">
        <span style="${EP_CAPTION}">Showing 1–{{ visible.length }} of {{ current.count }} transactions</span>
        <span style="flex:1;" />
        <q-btn outline no-caps dense disable label="Previous" color="grey-7" style="height:38px; padding:0 14px;" />
        <q-btn unelevated no-caps dense color="primary" label="1" aria-current="page" style="min-width:38px; height:38px;" />
        <q-btn flat no-caps dense color="grey-8" label="2" style="min-width:38px; height:38px;" />
        <span v-if="current.pages > 3" style="${EP_CAPTION} padding:0 4px;">…</span>
        <q-btn v-if="current.pages > 2" flat no-caps dense color="grey-8" :label="String(current.pages)" style="min-width:38px; height:38px;" />
        <q-btn outline no-caps dense label="Next" color="primary" style="height:38px; padding:0 14px;" />
      </div>
    </template>
  </q-table>`

const toolbar = `
  <div style="display:flex; align-items:center; gap:16px; margin-bottom:18px;">
    <div style="width:100%; max-width:400px;">
      <ds-search v-model="query" placeholder="Search transactions" />
    </div>
    <span style="flex:1;" />
    <q-btn outline no-caps color="primary" icon="filter_alt" label="Filter" style="padding:0 18px;" />
    <q-btn outline no-caps color="primary" icon="file_download" label="Export" style="padding:0 18px;" />
  </div>`

const SLOT = `
  <div style="${EP_PAGE}">
    ${epHeader('Transactions', {
      actions: `<q-btn outline no-caps color="grey-8" icon="calendar_today" icon-right="expand_more"
        label="Year to Date" style="padding:0 16px;" />`,
    })}
    ${epCard(`${statCards}${toolbar}${table}`)}
  </div>`

function state ({ active = 'all' } = {}) {
  const activeRef = ref(active)
  const current = computed(() => FILTERS.find((f) => f.key === activeRef.value) || FILTERS[0])

  return {
    filters: FILTERS,
    columns: COLUMNS,
    active: activeRef,
    current,
    visible: computed(() => (current.value.match ? TRANSACTIONS.filter(current.value.match) : TRANSACTIONS)),
    query: ref(''),
    chipFor: statusChip,
    brandLabel: (key) => BRAND_LABEL[key] || key,
    brandStyle: () => BRAND_CHIP,
  }
}

const story = (opts) => epPage({
  active: 'transactions',
  components: { DsSearch, DsStat },
  setup: () => state(opts),
  slot: SLOT,
})

/** The page as captured: **All**, year to date, page 1 of 47. */
export const Default = story()

/** What a dispute review starts from — the filter the merchant reaches for
 *  first, because these are the rows with a deadline attached. */
export const Disputed = story({ active: 'disputed' })
Disputed.storyName = 'Filtered · Disputed'

/** Refunds and partial refunds. Shows the third chip tone in the table, and the
 *  short pagination a small result set gets. */
export const Refunded = story({ active: 'refunded' })
Refunded.storyName = 'Filtered · Refunded'
