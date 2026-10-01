/** EP Pay / Screens / 08 · Unbuilt Areas / Products — CONCEPT (revised 2026-09-29).
 *
 *  Illustrative concept with invented scope: no requirements exist for this
 *  area (checked Linear 2026-09-29). The first pass treated a product as a
 *  priced hotel extra. The user then pointed it at EventPipe's product-offering
 *  expansion — the ticketing repo (presto-2026-ticketing) — and approved, one
 *  decision at a time:
 *
 *    1. Event-travel product TYPES only: the repo's (tickets, packages, gameday
 *       and destination add-ons) plus protection, meals & banquets, group
 *       transport, merchandise, experiences, and hotel extras & fees. No
 *       registration or entry-fee products.
 *    2. Examples use the repo's two events and its real names and prices —
 *       deliberately NOT the 09/28 test events the rest of EP Pay uses.
 *    3. Dedicated create forms for exactly four types (package, ticket tiers,
 *       add-on with rules, merchandise with sizes); every other type shares one
 *       generic form.
 *
 *  Built from EP Pay patterns only: the Transactions list (tiles, toolbar,
 *  `.ds-table`, two-line cells, pager), Get My Funds' selected choice cards, and
 *  the Subscriptions create dialog's "form left, consequence right" layout.
 *
 *  Design decisions worth a second opinion:
 *
 *  1. STAYS ARE LISTED BUT NOT CREATABLE. Rates and inventory belong to the
 *     event's room block in EventPipe. They appear here so a package can be
 *     composed from them, and they say "Managed in Room Blocks" instead of
 *     offering edit.
 *
 *  2. THE BUNDLE CREDIT FOLLOWS tickets-first/src/addons.js — 10% off the stay
 *     and the extras, never the ticket face value. option-d/src/packages.js
 *     prices its packages with a blended 12% off everything, tickets included;
 *     the two rules disagree, and the builder follows the one that says why
 *     (a buyer comparing the ticket line against the box office must find the
 *     same number). Flagged as an open question.
 *
 *  3. The whole create flow is ONE DsModal: pick a type, then that type's form,
 *     with Back in the footer. Two dialogs in a row would lose the choice the
 *     moment the second opened.
 */
import { ref, computed } from 'vue'
import { epPage, epCard, BRAND_CHIP, EP_CAPTION, EP_PAGE } from './_eppay'
import {
  conceptHeader, conceptDocs, listToolbar, pager, conceptChip, pick,
  EDIT_COLUMNS_HEADER, ACTIONS_COL, TD, MICRO,
  PRODUCTS, PRODUCT_TYPES, PRODUCT_EVENTS, productEventNames, productTypeByKey, TICKETING_REPO,
} from './_eppay-concepts'
import DsSearch from '../../components/DsSearch.vue'
import DsModal from '../../components/DsModal.vue'
import DsInput from '../../components/DsInput.vue'
import DsSelect from '../../components/DsSelect.vue'
import DsEmptyState from '../../components/DsEmptyState.vue'
import DsLink from '../../components/DsLink.vue'
import DsChartCard from '../../components/charts/DsChartCard.vue'
import DsBarChart from '../../components/charts/DsBarChart.vue'

/* ---------------------------------------------------------------------------
 * Docs
 * ------------------------------------------------------------------------- */

const TAXONOMY = [
  '**Product-type taxonomy**',
  '',
  '| Type | Unit | Rules | Example | Create form | Source |',
  '|---|---|---|---|---|---|',
  ...PRODUCT_TYPES.map((t) => `| ${t.label} | ${t.unit} | ${t.rules} | ${t.example} | ${
    t.form === null ? '— (Room Blocks)' : t.form === 'generic' ? 'Generic' : 'Dedicated'} | ${t.source} |`),
  '',
  `**Source:** the ticketing repo — [presto-2026-ticketing](${TICKETING_REPO}) (local: \`presto-2026-ticketing\`). ` +
    'Events: *Pittsburgh Steelers at New England Patriots*, Sun Sep 20 2026, Gillette Stadium; and *Sunshine State Spirit Nationals 2027*, Feb 12–14 2027, Orange County Convention Center, Orlando.',
  '',
  '**Why the events don\'t match Transactions:** the rest of EP Pay still uses the 09/28 test events (Automated Playwright Live Event 340366, Pricing Event 539073…). ' +
    'Products intentionally uses the ticketing repo\'s events instead, because that is where the product offering is defined. The mismatch is expected until the rest of EP Pay is re-pointed.',
].join('\n')

export default {
  title: 'Eventpipe Labs/EP Pay/Screens/08 · Unbuilt Areas/Products',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: conceptDocs({
          area: 'Products',
          summary: 'The catalogue of everything Team Travel Source sells around an event trip — stays (read from room blocks), ticket tiers, packages, add-ons, meals, transport, merchandise, experiences, protection and fees — organised by product type, each type with its own unit and rules.',
          patterns: 'Transactions (filter tiles — here one per type — toolbar, `q-table.ds-table`, two-line cells, pagination), Get My Funds (`DsModal`, selected choice cards, Cancel / primary footer), Subscriptions (form left, live consequence right).',
          questions: [
            ['What counts as a product?',
              'anything sold as part of an event trip. The approved types are in the taxonomy below; registration and entry fees are out of scope.'],
            ['Are hotel stays products?',
              'they are LISTED as products (so packages can include them) but are created and priced only in the event\'s room block. They are read-only here.'],
            ['Which bundle-credit rule is right?',
              'the tickets-first rule: 10% off stay + extras, never on ticket face value. option-d prices packages with 12% off everything including tickets — product needs to pick one.'],
            ['Who sets ticket face value?',
              'the team / event organiser. The merchant sees it locked and controls inventory per tier only. How it arrives (import vs. entry) is open.'],
            ['Is a product scoped to one event?',
              'yes for tickets, packages, add-ons, meals, transport, merchandise and experiences; protection and service fees can apply to all events.'],
            ['How is merchandise fulfilled?',
              'picked up at hotel check-in by default, shipping optional. Returns and exchanges are not designed.'],
          ],
          left: 'a product detail page, per-date pricing, taxes, refund rules per type, supplier/vendor payouts for destination add-ons.',
        }) + '\n\n' + TAXONOMY,
      },
    },
  },
}

/* ---------------------------------------------------------------------------
 * List
 * ------------------------------------------------------------------------- */

const TILES = [
  { key: 'all', label: 'All', icon: 'apps', count: PRODUCTS.length },
  ...PRODUCT_TYPES.map((t) => ({ key: t.key, label: t.label, icon: t.icon, count: PRODUCTS.filter((p) => p.type === t.key).length })),
]

/* Ten types do not fit one row of Transactions-size tiles, so these are the
   same buttons (same selected pair, same aria-pressed) at half the height, two
   rows of five. */
const typeTiles = `
  <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:12px; margin-bottom:20px;">
    <q-card v-for="t in tiles" :key="t.key" flat bordered tag="button" type="button"
      :aria-pressed="active === t.key"
      :style="'display:block; width:100%; padding:0; text-align:left; font:inherit; cursor:pointer; ' +
              (active === t.key ? 'border:2px solid var(--ds-color-border-brand); background:var(--ds-color-background-brand-subtlest);' : '')"
      @click="active = t.key">
      <q-card-section :style="'display:flex; align-items:center; gap:10px; ' + (active === t.key ? 'padding:11px 15px;' : 'padding:12px 16px;')">
        <q-icon :name="t.icon" size="20px" style="color:var(--ds-color-icon-subtle);" />
        <span style="${MICRO} flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">{{ t.label }}</span>
        <span style="font-size:1.125rem; font-weight:700; color:var(--ds-color-text);">{{ t.count }}</span>
      </q-card-section>
    </q-card>
  </div>`

/** CHART CONCEPT — sales by product type, computed from the catalogue rather
 *  than typed in, so it cannot disagree with the table: each product's order
 *  count is its "On N orders" line, times an assumed average quantity per
 *  order, times its price (tickets, which list a price range, get an assumed
 *  average; Trip Protection gets 7% of a ~$1,400 trip). Stays are left out —
 *  they are sold and reported through Room Blocks — and so is the draft
 *  banquet, which has no orders. */
const UNITS_AND_PRICE = {
  'PRD-0110': [2.8, 190], 'PRD-0111': [2.5, 58],
  'PRD-0120': [1, 3368], 'PRD-0121': [1, 3154],
  'PRD-0130': [1, 65], 'PRD-0131': [3, 42], 'PRD-0132': [3, 139], 'PRD-0133': [1, 145],
  'PRD-0140': [3, 59],
  'PRD-0150': [3, 28], 'PRD-0151': [1, 1850],
  'PRD-0160': [2, 28],
  'PRD-0170': [2, 120], 'PRD-0171': [1, 45],
  'PRD-0180': [1, 98], 'PRD-0181': [1, 25], 'PRD-0182': [1, 75],
}
const SALES_BY_TYPE = (() => {
  const byType = {}
  PRODUCTS.forEach((p) => {
    const orders = Number((/On (\d+) orders/.exec(p.used) || [])[1])
    const up = UNITS_AND_PRICE[p.id]
    if (!orders || !up) return
    byType[p.type] = Math.round(((byType[p.type] || 0) + orders * up[0] * up[1]) * 100) / 100
  })
  const rows = PRODUCT_TYPES.filter((t) => byType[t.key] != null).sort((a, b) => byType[b.key] - byType[a.key])
  return {
    labels: rows.map((t) => t.label),
    series: [{ key: 'sales', label: 'Sales', data: rows.map((t) => byType[t.key]) }],
  }
})()

const COLUMNS = [
  { name: 'status', label: 'Status & Usage', field: 'status', align: 'left' },
  { name: 'product', label: 'Product & Type', field: 'name', align: 'left' },
  { name: 'price', label: 'Price', field: 'price', align: 'left' },
  { name: 'event', label: 'Event', field: (r) => (r.event ? r.event.name : 'All events'), align: 'left' },
  ACTIONS_COL,
]

const ADD_BTN = `<q-btn unelevated no-caps color="primary" icon="add" label="Add Product"
  style="padding:0 20px; font-weight:700;" @click="openCreate()" />`

const table = `
  <q-table class="ds-table" :rows="visible" :columns="columns" row-key="id"
    flat bordered :pagination="{ rowsPerPage: 0 }"
    no-data-label="No products of this type yet.">
    ${EDIT_COLUMNS_HEADER}

    <template #body-cell-status="props">
      <q-td :props="props" style="${TD}">
        <span :style="chipFor(props.row.status)">{{ props.row.status }}</span>
        <div style="${EP_CAPTION} margin-top:6px;">{{ props.row.used }}</div>
      </q-td>
    </template>

    <!-- Name on top, type chip + description under it. Wrapping is allowed in
         this one column (max 360px) so the row menu stays inside the card. -->
    <template #body-cell-product="props">
      <q-td :props="props" style="${TD} white-space:normal; max-width:360px;">
        <span v-if="props.row.type === 'stay'" style="font-weight:700; color:var(--ds-color-text);">{{ props.row.name }}</span>
        <a v-else href="#" class="eppay-link" @click.prevent style="font-weight:700;">{{ props.row.name }}</a>
        <div style="display:flex; align-items:baseline; gap:8px; margin-top:4px;">
          <span style="${BRAND_CHIP} flex:none;">{{ typeOf(props.row).single }}</span>
          <span style="${EP_CAPTION}">{{ props.row.desc }}</span>
        </div>
      </q-td>
    </template>

    <template #body-cell-price="props">
      <q-td :props="props" style="${TD}">
        <div style="font-weight:700;">{{ props.row.price }}</div>
        <div style="${EP_CAPTION} margin-top:2px;">{{ props.row.unit }}</div>
      </q-td>
    </template>

    <template #body-cell-event="props">
      <q-td :props="props" style="${TD}">
        <div style="line-height:1.35;">{{ props.row.event ? props.row.event.short : 'All events' }}</div>
        <div style="${EP_CAPTION} margin-top:2px;">{{ props.row.event ? props.row.event.where : 'Applies to every booking' }}</div>
      </q-td>
    </template>

    <!-- Stays have no menu here — the one action is to go where they live. -->
    <template #body-cell-actions="props">
      <q-td :props="props" style="${TD}">
        <q-btn v-if="props.row.type === 'stay'" flat dense icon="open_in_new" :aria-label="'Open ' + props.row.name + ' in Room Blocks'"
          style="border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-sm); color:var(--ds-color-icon-subtle);">
          <q-tooltip>Managed in Room Blocks</q-tooltip>
        </q-btn>
        <ds-action-menu v-else :label="'Actions for ' + props.row.name" :items="[
          { label: 'Edit product', icon: 'edit' },
          { label: 'Duplicate', icon: 'content_copy' },
          { label: 'Archive product', icon: 'archive', danger: true, dividerBefore: true, confirm: { title: 'Archive ' + props.row.name + '?', message: 'It stops appearing on new payment links and invoices. Existing ones are unchanged.', okLabel: 'Archive' } },
        ]" />
      </q-td>
    </template>

    ${pager('products')}
  </q-table>`

const stayNote = `
  <div v-if="active === 'stay'" style="display:flex; gap:12px; align-items:flex-start; margin-bottom:16px; padding:14px 16px;
              border-radius:var(--ds-radius-lg); background:var(--ds-color-background-info); color:var(--ds-color-text-info);">
    <q-icon name="info" size="20px" style="margin-top:1px;" />
    <div style="font-size:0.875rem; line-height:1.45;">
      Stays come from each event's room block and can't be created or edited here. They're listed so packages can include them.
    </div>
  </div>`

const emptyBody = `
  <ds-empty-state icon="inventory_2" title="No products yet"
    description="Add the tickets, packages, add-ons and extras you sell around an event trip. Hotel stays appear here on their own once an event has a room block.">
    <template #action>${ADD_BTN}</template>
  </ds-empty-state>`

/* ---------------------------------------------------------------------------
 * Create — step 1: product type
 * ------------------------------------------------------------------------- */

const typeStep = `
  <div v-if="step === 'type'">
    <div style="${EP_CAPTION} margin-bottom:14px;">Each type has its own unit and rules. Tickets, packages, add-ons and merchandise have a guided form; the rest share one.</div>
    <!-- Every card the same size: minmax(0, 1fr) stops a long label or example
         widening its column, and grid-auto-rows: 1fr makes every row as tall
         as the tallest card, so all nine match. -->
    <div style="display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); grid-auto-rows:1fr; gap:12px;">
      <a v-for="t in types" :key="t.key" href="#" @click.prevent="t.form && (chosen = t.key)"
        :aria-disabled="!t.form"
        :style="'display:flex; flex-direction:column; box-sizing:border-box; min-width:0; border-radius:var(--ds-radius-lg); text-decoration:none; color:inherit; ' +
                (t.form ? pick(chosen === t.key) + ' cursor:pointer;' : pick(false) + ' background:var(--ds-color-surface-sunken); cursor:not-allowed;')">
        <div style="display:flex; align-items:center; gap:10px;">
          <q-icon :name="t.icon" size="22px" :style="'color:' + (t.form ? 'var(--ds-color-text-brand)' : 'var(--ds-color-icon-subtle)')" />
          <span style="font-weight:700; color:var(--ds-color-text); flex:1;">{{ t.single }}</span>
          <q-radio v-if="t.form" v-model="chosen" :val="t.key" color="primary" dense :aria-label="t.single" />
        </div>
        <div style="${EP_CAPTION} margin-top:6px;">{{ t.form ? t.unit : 'Managed in Room Blocks' }}</div>
        <div style="${EP_CAPTION} margin-top:2px; color:var(--ds-color-text-subtlest);">{{ t.form ? 'e.g. ' + t.example : 'Rates and inventory come from the event\\'s room block.' }}</div>
      </a>
    </div>
  </div>`

/* ---------------------------------------------------------------------------
 * Create — package builder
 * ------------------------------------------------------------------------- */

/** option-d's two hotels, with their contracted rate and how many a room sleeps. */
const PKG_HOTELS = [
  { value: 'westin', label: 'The Westin · Deluxe King · $289/night', rate: 289, sleeps: 2 },
  { value: 'ritz', label: 'The Ritz-Carlton · Carlton Suite · $549/night', rate: 549, sleeps: 4 },
]
const NIGHTS = 2
/** How each component scales: per guest, per room, or per room-night. */
const PKG_COMPONENTS = [
  { key: 'tickets', type: 'ticket', name: 'Club Level ticket', rate: 375, per: 'guest', note: 'Seated together in one block' },
  { key: 'stay', type: 'stay', name: 'Hotel stay · Sat Sep 19 – Mon Sep 21', rate: null, per: 'room-night', note: 'From the room block' },
  { key: 'coach', type: 'transport', name: 'Round-trip coach, hotel ↔ Gillette', rate: 180, per: 'room', note: 'Both days' },
  { key: 'hosp', type: 'addon', name: 'Pregame hospitality', rate: 140, per: 'guest', note: 'EventPipe tent before kickoff' },
]
const BUNDLE_CREDIT_RATE = 0.1
const money = (n) => (Number(n) || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })

const packageStep = `
  <div v-if="step === 'package'" style="display:grid; grid-template-columns:1.35fr 1fr; gap:28px;">
    <div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
        <ds-input v-model="pkg.name" label="Package name" required />
        <ds-select v-model="pkg.event" :options="events" label="Event" required />
        <ds-select v-model="pkg.hotel" :options="hotels" label="Hotel" required />
        <ds-input v-model="pkg.party" label="Priced for a party of" type="number" stepper :min="1" :max="12" required />
      </div>

      <div style="display:flex; align-items:center; margin:22px 0 10px;">
        <span style="font-weight:700; color:var(--ds-color-text);">What's included</span>
        <span style="flex:1;" />
        <q-btn flat no-caps dense color="primary" icon="add" label="Add product" />
      </div>
      <div style="border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-lg); overflow:hidden;">
        <label v-for="(c, i) in pkgLines" :key="c.key"
          :style="'display:flex; align-items:center; gap:12px; padding:12px 16px; cursor:pointer;' + (i ? ' border-top:1px solid var(--ds-color-border-container);' : '')">
          <q-checkbox v-model="pkg.include" :val="c.key" color="primary" dense :aria-label="'Include ' + c.name" />
          <div style="flex:1; min-width:0;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="${BRAND_CHIP}">{{ typeLabel(c.type) }}</span>
              <span style="color:var(--ds-color-text);">{{ c.name }}</span>
            </div>
            <div style="${EP_CAPTION} margin-top:3px;">{{ c.qty }} × {{ money(c.rate) }} per {{ c.per }} · {{ c.note }}</div>
          </div>
          <span :style="'font-weight:700; ' + (c.on ? 'color:var(--ds-color-text);' : 'color:var(--ds-color-text-subtlest); text-decoration:line-through;')">{{ money(c.amount) }}</span>
        </label>
      </div>
      <div style="${EP_CAPTION} margin-top:8px;">{{ pkgPrice.rooms }} {{ pkgPrice.rooms === 1 ? 'room' : 'rooms' }} — a room at this hotel sleeps {{ pkgPrice.sleeps }}.</div>
    </div>

    <div style="border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-lg); overflow:hidden; align-self:start;">
      <div style="padding:12px 18px; background:var(--ds-color-surface-sunken);"><span style="${MICRO}">Package price</span></div>
      <div style="padding:6px 18px 16px;">
        <div v-for="(r, i) in pkgPrice.rows" :key="r.label"
          :style="'display:flex; align-items:baseline; gap:12px; padding:10px 0;' + (i ? ' border-top:1px solid var(--ds-color-border-container);' : '')">
          <div style="flex:1;">
            <div :style="r.strong ? 'font-weight:700; color:var(--ds-color-text);' : 'color:var(--ds-color-text);'">{{ r.label }}</div>
            <div v-if="r.note" style="${EP_CAPTION}">{{ r.note }}</div>
          </div>
          <span :style="'font-weight:700; ' + (r.credit ? 'color:var(--ds-color-text-success);' : 'color:var(--ds-color-text);') + (r.strong ? ' font-size:1.375rem;' : '')">{{ r.value }}</span>
        </div>
        <div style="${EP_CAPTION}">{{ money(pkgPrice.perPerson) }} per person</div>
      </div>
      <div style="display:flex; gap:10px; align-items:flex-start; padding:12px 18px; border-top:1px solid var(--ds-color-border-container);
                  background:var(--ds-color-background-info); color:var(--ds-color-text-info); font-size:0.8125rem; line-height:1.45;">
        <q-icon name="lock" size="16px" style="margin-top:2px;" />
        <span>The bundle credit never applies to ticket face value — a buyer comparing the ticket line with the box office sees the same price.</span>
      </div>
    </div>
  </div>`

/* ---------------------------------------------------------------------------
 * Create — ticket tiers
 * ------------------------------------------------------------------------- */

/** hotel-first/src/tickets.js, verbatim names, prices and counts. */
const TIERS = [
  { key: 'weekend', name: 'Weekend Spectator Pass', days: 'Fri 2/12 – Sun 2/14', price: 89, stock: 240 },
  { key: 'sunday', name: 'Sunday Finals Day Pass', days: 'Sun 2/14', price: 55, stock: 88 },
  { key: 'saturday', name: 'Saturday Prelims Day Pass', days: 'Sat 2/13', price: 45, stock: 140 },
  { key: 'athlete', name: 'Athlete Credential Wristband', days: 'All days', price: 25, stock: 6 },
  { key: 'matside', name: 'Mat-Side Finals Seating', days: 'Sun 2/14', price: 149, stock: 0 },
]
const TIER_COLUMNS = [
  { name: 'name', label: 'Tier', field: 'name', align: 'left' },
  { name: 'price', label: 'Face value', field: 'price', align: 'left' },
  { name: 'stock', label: 'Inventory', field: 'stock', align: 'left' },
  { name: 'state', label: '', field: 'stock', align: 'left' },
]

const ticketsStep = `
  <div v-if="step === 'tickets'">
    <div style="display:grid; grid-template-columns:1.4fr 1fr 1fr; gap:16px; margin-bottom:20px;">
      <ds-select v-model="tix.event" :options="events" label="Event" required />
      <ds-input v-model="tix.opens" label="On sale from" type="date" required />
      <ds-input v-model="tix.closes" label="Sales close" type="date" required />
    </div>
    <div style="display:flex; align-items:center; margin-bottom:10px;">
      <span style="font-weight:700; color:var(--ds-color-text);">Tiers</span>
      <span style="${EP_CAPTION} margin-left:10px;">Priced per ticket · {{ tierTotal }} tickets in total</span>
      <span style="flex:1;" />
      <q-btn flat no-caps dense color="primary" icon="add" label="Add tier" />
    </div>
    <q-table class="ds-table" :rows="tix.tiers" :columns="tierColumns" row-key="key"
      flat bordered hide-bottom :pagination="{ rowsPerPage: 0 }">
      <template #body-cell-name="props">
        <q-td :props="props" style="${TD}">
          <div style="font-weight:700;">{{ props.row.name }}</div>
          <div style="${EP_CAPTION} margin-top:2px;">{{ props.row.days }}</div>
        </q-td>
      </template>
      <template #body-cell-price="props">
        <q-td :props="props" style="${TD}">
          <div style="display:flex; align-items:center; gap:6px;">
            <q-icon name="lock" size="16px" style="color:var(--ds-color-icon-subtle);" />
            <span style="font-weight:700;">{{ money(props.row.price) }}</span>
          </div>
          <div style="${EP_CAPTION} margin-top:2px;">Set by the organiser</div>
        </q-td>
      </template>
      <template #body-cell-stock="props">
        <q-td :props="props" style="${TD} width:150px;">
          <ds-input v-model="props.row.stock" type="number" :min="0" style="width:110px;" :aria-label="'Inventory for ' + props.row.name" />
        </q-td>
      </template>
      <template #body-cell-state="props">
        <q-td :props="props" style="${TD}">
          <span v-if="Number(props.row.stock) === 0" :style="chipFor('Sold Out')">Sold Out</span>
          <span v-else-if="Number(props.row.stock) < 10" style="${EP_CAPTION}">Only {{ props.row.stock }} left</span>
        </q-td>
      </template>
    </q-table>
    <div style="${EP_CAPTION} margin-top:10px;">Buyers pay an 18% ticketing service fee on top of face value. Tickets are never discounted by a package's bundle credit.</div>
  </div>`

/* ---------------------------------------------------------------------------
 * Create — add-on with rules
 * ------------------------------------------------------------------------- */

const ADDON_UNITS = [
  { key: 'guest', title: 'Per guest', blurb: 'Tailgate, hospitality, transfer seats' },
  { key: 'vehicle', title: 'Per vehicle', blurb: 'Parking — cars don\'t follow headcount' },
  { key: 'booking', title: 'Per booking', blurb: 'Airport van, one per trip' },
]

const addonStep = `
  <div v-if="step === 'addon'" style="display:grid; grid-template-columns:1.35fr 1fr; gap:28px;">
    <div style="display:flex; flex-direction:column; gap:18px;">
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
        <ds-input v-model="addon.name" label="Name" required style="grid-column:1 / -1;" />
        <ds-select v-model="addon.event" :options="events" label="Event" required />
        <ds-input v-model="addon.price" label="Price" type="currency" required />
      </div>

      <div>
        <div style="font-weight:700; color:var(--ds-color-text); margin-bottom:8px;">Charged</div>
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px;">
          <a v-for="u in addonUnits" :key="u.key" href="#" @click.prevent="addon.unit = u.key"
            :style="'display:block; border-radius:var(--ds-radius-lg); text-decoration:none; color:inherit; ' + pick(addon.unit === u.key)">
            <div style="display:flex; align-items:center; gap:8px;">
              <q-radio v-model="addon.unit" :val="u.key" color="primary" dense :aria-label="u.title" />
              <span style="font-weight:700; color:var(--ds-color-text);">{{ u.title }}</span>
            </div>
            <div style="${EP_CAPTION} margin:4px 0 0 28px;">{{ u.blurb }}</div>
          </a>
        </div>
      </div>

      <div>
        <div style="font-weight:700; color:var(--ds-color-text); margin-bottom:8px;">Quantity</div>
        <div style="display:flex; flex-direction:column; gap:8px;">
          <q-radio v-model="addon.qtyRule" val="tickets" color="primary" dense :disable="addon.unit !== 'guest'"
            label="Follows the ticket count — four tickets, four of these" />
          <q-radio v-model="addon.qtyRule" val="guest" color="primary" dense label="Guest chooses" />
        </div>
        <ds-input v-if="addon.qtyRule === 'guest'" v-model="addon.max" label="Max per order" type="number" :min="1"
          style="max-width:180px; margin-top:12px;" />
      </div>

      <div style="display:flex; align-items:flex-start; gap:12px; padding-top:16px; border-top:1px solid var(--ds-color-border-container);">
        <q-toggle v-model="addon.requiresHotel" color="primary" dense aria-label="Requires a hotel in the trip" />
        <div>
          <div style="font-weight:700; color:var(--ds-color-text);">Requires a hotel in the trip</div>
          <div style="${EP_CAPTION}">Shown disabled, with the reason, until a stay is added — and dropped if the stay is removed.</div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
        <ds-input v-model="addon.when" label="Timing" hint="Printed on the cart line and the itinerary." />
        <ds-input v-model="addon.where" label="Where" />
      </div>
    </div>

    <div style="border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-lg); overflow:hidden; align-self:start;">
      <div style="padding:12px 18px; background:var(--ds-color-surface-sunken);"><span style="${MICRO}">In the cart · party of 4</span></div>
      <div style="padding:16px 18px;">
        <div style="display:flex; align-items:baseline; gap:12px;">
          <span style="font-weight:700; color:var(--ds-color-text); flex:1;">{{ addon.name || 'Add-on' }}</span>
          <span style="font-weight:700; color:var(--ds-color-text);">{{ money(addonPreview.amount) }}</span>
        </div>
        <div style="${EP_CAPTION} margin-top:4px;">{{ addonPreview.line }}</div>
        <div v-if="addon.when" style="${EP_CAPTION}">{{ addon.when }}<template v-if="addon.where"> · {{ addon.where }}</template></div>
      </div>
      <div v-if="addon.requiresHotel" style="display:flex; gap:10px; padding:12px 18px; border-top:1px solid var(--ds-color-border-container); font-size:0.8125rem;">
        <q-icon name="hotel" size="16px" style="color:var(--ds-color-icon-subtle); margin-top:2px;" />
        <span style="color:var(--ds-color-text-subtle);">Without a stay: "Add a hotel to your trip to get this — it leaves from the hotel lobby."</span>
      </div>
    </div>
  </div>`

/* ---------------------------------------------------------------------------
 * Create — merchandise with sizes
 * ------------------------------------------------------------------------- */

const SIZES = ['YS', 'YM', 'YL', 'AS', 'AM', 'AL', 'AXL']
const COLOURS = ['Navy', 'White']
const STOCK = { Navy: [20, 30, 30, 40, 50, 40, 20], White: [10, 15, 15, 20, 25, 20, 10] }

const merchStep = `
  <div v-if="step === 'merch'" style="display:grid; grid-template-columns:1fr 1.1fr; gap:28px;">
    <div style="display:flex; flex-direction:column; gap:16px;">
      <ds-input v-model="merch.name" label="Name" required />
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
        <ds-select v-model="merch.event" :options="events" label="Event" required />
        <ds-input v-model="merch.price" label="Price" type="currency" required hint="Per item" />
      </div>
      <div>
        <div style="font-weight:700; color:var(--ds-color-text); margin-bottom:8px;">Fulfilment</div>
        <div style="display:flex; flex-direction:column; gap:10px;">
          <a v-for="f in fulfilment" :key="f.key" href="#" @click.prevent="merch.fulfil = f.key"
            :style="'display:block; border-radius:var(--ds-radius-lg); text-decoration:none; color:inherit; ' + pick(merch.fulfil === f.key)">
            <div style="display:flex; align-items:center; gap:8px;">
              <q-radio v-model="merch.fulfil" :val="f.key" color="primary" dense :aria-label="f.title" />
              <span style="font-weight:700; color:var(--ds-color-text);">{{ f.title }}</span>
            </div>
            <div style="${EP_CAPTION} margin:4px 0 0 28px;">{{ f.blurb }}</div>
          </a>
        </div>
      </div>
    </div>

    <div>
      <div style="display:flex; align-items:center; margin-bottom:10px;">
        <span style="font-weight:700; color:var(--ds-color-text);">Stock by variant</span>
        <span style="${EP_CAPTION} margin-left:10px;">{{ sizes.length }} sizes × {{ colours.length }} colours · {{ stockTotal }} in stock</span>
        <span style="flex:1;" />
        <q-btn flat no-caps dense color="primary" icon="add" label="Colour" />
      </div>
      <q-table class="ds-table" :rows="merch.rows" :columns="merchColumns" row-key="size"
        flat bordered hide-bottom dense :pagination="{ rowsPerPage: 0 }">
        <template #body-cell-Navy="props">
          <q-td :props="props" style="padding:6px 12px;">
            <ds-input v-model="props.row.Navy" type="number" :min="0" style="width:92px;" :aria-label="'Navy ' + props.row.size + ' stock'" />
          </q-td>
        </template>
        <template #body-cell-White="props">
          <q-td :props="props" style="padding:6px 12px;">
            <ds-input v-model="props.row.White" type="number" :min="0" style="width:92px;" :aria-label="'White ' + props.row.size + ' stock'" />
          </q-td>
        </template>
      </q-table>
    </div>
  </div>`

/* ---------------------------------------------------------------------------
 * Create — generic (every other type)
 * ------------------------------------------------------------------------- */

const GENERIC_UNITS = ['Per person', 'Per guest', 'Per athlete', 'Per seat', 'Per coach', 'Per booking', 'Per reservation', 'Per room-night', '% of trip cost', 'One-time']

const genericStep = `
  <div v-if="step === 'generic'">
    <div style="display:flex; align-items:center; gap:10px; margin-bottom:18px;">
      <span style="${EP_CAPTION}">Type</span>
      <span style="${BRAND_CHIP}">{{ typeLabel(chosen) }}</span>
      <!-- DsLink, not .eppay-link: the dialog teleports out of the .eppay scope. -->
      <ds-link href="#" @click.prevent="step = 'type'" style="font-size:0.8125rem;">Change</ds-link>
    </div>
    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px;">
      <ds-input v-model="gen.name" label="Name" required style="grid-column:span 2;" />
      <ds-select v-model="gen.event" :options="events" label="Event" required />
      <ds-input v-model="gen.desc" label="Description" style="grid-column:1 / -1;" hint="Shown to the buyer." />
      <ds-input v-model="gen.price" label="Price" type="currency" required />
      <ds-select v-model="gen.unit" :options="genericUnits" label="Charged" required />
      <ds-input v-model="gen.capacity" label="Capacity" type="number" hint="Optional. Sales stop when it's reached." />
      <ds-input v-model="gen.date" label="Date" type="date" />
      <ds-input v-model="gen.time" label="Time" placeholder="7:00 PM" />
    </div>
    <div style="display:flex; align-items:center; gap:12px; margin-top:20px; padding-top:16px; border-top:1px solid var(--ds-color-border-container);">
      <q-toggle v-model="gen.onSale" color="primary" dense aria-label="On sale" />
      <div>
        <div style="font-weight:700; color:var(--ds-color-text);">On sale</div>
        <div style="${EP_CAPTION}">{{ gen.onSale ? 'Buyers can add it as soon as it\\'s saved.' : 'Off — saved as a draft until you turn this on.' }}</div>
      </div>
    </div>
  </div>`

/* ---------------------------------------------------------------------------
 * The one dialog
 * ------------------------------------------------------------------------- */

const createDialog = `
  <ds-modal v-model="createOpen" :title="modalTitle" :subtitle="modalSub" size="lg">
    ${typeStep}
    ${packageStep}
    ${ticketsStep}
    ${addonStep}
    ${merchStep}
    ${genericStep}

    <template #footer="{ close }">
      <div style="display:flex; align-items:center; gap:12px; width:100%;">
        <q-btn v-if="step !== 'type'" flat no-caps color="primary" icon="arrow_back" label="Product type" @click="step = 'type'" />
        <span style="flex:1;" />
        <q-btn flat no-caps label="Cancel" color="grey-8" style="padding:0 22px;" @click="close" />
        <q-btn v-if="step === 'type'" unelevated no-caps label="Continue" color="primary" :disable="!chosen"
          style="padding:0 26px; font-weight:700;" @click="step = formFor(chosen)" />
        <q-btn v-else unelevated no-caps label="Save Product" color="primary" style="padding:0 26px; font-weight:700;" />
      </div>
    </template>
  </ds-modal>`

/** CHART CONCEPT — see ChartConceptSalesByType. */
const salesChart = `
  <div style="margin-bottom:20px;">
    <ds-chart-card title="Sales by product type" subtitle="Both events, to date · stays are reported in Room Blocks" table-toggle>
      <template #default="{ view }">
        <ds-bar-chart horizontal :labels="sales.labels" :series="sales.series" value-format="currency"
          :height="300" :max-label-length="20" :view="view" />
      </template>
    </ds-chart-card>
  </div>`

const SLOT = (empty, chart = false) => `
  <div style="${EP_PAGE}">
    ${conceptHeader('Products', { actions: ADD_BTN })}
    ${chart ? salesChart : ''}
    ${epCard(empty ? emptyBody : `${typeTiles}${stayNote}${listToolbar('Search products')}${table}`)}
  </div>
  ${createDialog}`

/* ---------------------------------------------------------------------------
 * State
 * ------------------------------------------------------------------------- */

const STEP_TITLE = {
  type: ['Add Product', 'Choose a product type'],
  package: ['New Package', 'Compose it from other products and price it for the party'],
  tickets: ['New Ticket Tiers', 'One event, several tiers'],
  addon: ['New Add-on', 'An extra with its own unit and rules'],
  merch: ['New Merchandise', 'Sizes, colours and stock per variant'],
  generic: ['New Product', ''],
}

function state({ open = false, step = 'type', chosen = null } = {}) {
  const active = ref('all')
  const stepRef = ref(step)
  const chosenRef = ref(chosen)
  const typeLabel = (key) => (productTypeByKey[key] || {}).single || key

  // Package builder
  const pkg = ref({ name: 'Westin Package', event: PRODUCT_EVENTS[0].name, hotel: 'westin', party: 4, include: PKG_COMPONENTS.map((c) => c.key) })
  const pkgHotel = computed(() => PKG_HOTELS.find((h) => h.value === pkg.value.hotel) || PKG_HOTELS[0])
  const pkgRooms = computed(() => Math.ceil((Number(pkg.value.party) || 1) / pkgHotel.value.sleeps))
  const pkgLines = computed(() => PKG_COMPONENTS.map((c) => {
    const party = Number(pkg.value.party) || 1
    const rate = c.key === 'stay' ? pkgHotel.value.rate : c.rate
    const qty = c.per === 'guest' ? party : c.per === 'room' ? pkgRooms.value : pkgRooms.value * NIGHTS
    return { ...c, rate, qty, amount: rate * qty, on: pkg.value.include.includes(c.key) }
  }))
  const pkgPrice = computed(() => {
    const on = pkgLines.value.filter((l) => l.on)
    const tickets = on.filter((l) => l.type === 'ticket').reduce((n, l) => n + l.amount, 0)
    const stay = on.filter((l) => l.type === 'stay').reduce((n, l) => n + l.amount, 0)
    const extras = on.filter((l) => l.type !== 'ticket' && l.type !== 'stay').reduce((n, l) => n + l.amount, 0)
    const credit = Math.round((stay + extras) * BUNDLE_CREDIT_RATE)
    const price = tickets + stay + extras - credit
    return {
      rooms: pkgRooms.value,
      sleeps: pkgHotel.value.sleeps,
      perPerson: Math.round(price / (Number(pkg.value.party) || 1)),
      rows: [
        { label: 'Tickets', note: 'Face value — no credit', value: money(tickets) },
        { label: 'Stay', note: `${pkgRooms.value} × ${NIGHTS} nights`, value: money(stay) },
        { label: 'Extras', note: 'Coach and hospitality', value: money(extras) },
        { label: 'Bundle credit', note: '10% of stay + extras', value: '−' + money(credit), credit: true },
        { label: `Party of ${pkg.value.party}`, value: money(price), strong: true },
      ],
    }
  })

  // Ticket tiers
  const tix = ref({ event: PRODUCT_EVENTS[1].name, opens: '2026-09-01', closes: '2027-02-11', tiers: TIERS.map((t) => ({ ...t })) })

  // Add-on with rules — tickets-first's Round-Trip Stadium Transfer, verbatim.
  const addon = ref({ name: 'Round-Trip Stadium Transfer', event: PRODUCT_EVENTS[0].name, price: 42, unit: 'guest', qtyRule: 'tickets', max: 4, requiresHotel: true, when: 'Departs 2:00 PM · returns 30 min after the game', where: 'Your hotel lobby' })
  const addonPreview = computed(() => {
    const a = addon.value
    const units = a.unit === 'booking' ? 1 : a.qtyRule === 'tickets' && a.unit === 'guest' ? 4 : 1
    const noun = a.unit === 'booking' ? 'booking' : a.unit
    return { amount: units * (Number(a.price) || 0), line: `${units} × ${noun}${units === 1 ? '' : 's'} · ${a.qtyRule === 'tickets' && a.unit === 'guest' ? 'follows the 4 tickets' : 'guest chose ' + units}` }
  })

  // Merchandise
  const merch = ref({ name: 'Spirit Nationals Event Tee', event: PRODUCT_EVENTS[1].name, price: 28, fulfil: 'pickup', rows: SIZES.map((s, i) => ({ size: s, Navy: STOCK.Navy[i], White: STOCK.White[i] })) })

  // Generic — an invented meal, the type the repo does not have.
  const gen = ref({ name: 'Team Awards Banquet', event: PRODUCT_EVENTS[1].name, desc: 'Buffet dinner after Sunday finals, Rosen Centre ballroom.', price: 68, unit: 'Per person', capacity: 240, date: '2027-02-14', time: '7:00 PM', onSale: false })

  return {
    tiles: TILES,
    columns: COLUMNS,
    sales: SALES_BY_TYPE,
    active,
    current: computed(() => {
      const count = active.value === 'all' ? PRODUCTS.length : PRODUCTS.filter((p) => p.type === active.value).length
      return { count, pages: 1 }
    }),
    visible: computed(() => (active.value === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.type === active.value))),
    query: ref(''),
    typeOf: (row) => productTypeByKey[row.type],
    chipFor: conceptChip,
    pick,
    money,
    typeLabel,
    // dialog
    createOpen: ref(open),
    step: stepRef,
    chosen: chosenRef,
    types: PRODUCT_TYPES,
    formFor: (key) => (productTypeByKey[key] || {}).form || 'type',
    openCreate: () => { stepRef.value = 'type'; chosenRef.value = null },
    modalTitle: computed(() => (stepRef.value === 'generic' ? `New ${typeLabel(chosenRef.value)}` : STEP_TITLE[stepRef.value][0])),
    modalSub: computed(() => STEP_TITLE[stepRef.value][1]),
    events: productEventNames,
    // package
    pkg, pkgLines, pkgPrice, hotels: PKG_HOTELS,
    // tickets
    tix, tierColumns: TIER_COLUMNS,
    tierTotal: computed(() => tix.value.tiers.reduce((n, t) => n + (Number(t.stock) || 0), 0)),
    // add-on
    addon, addonUnits: ADDON_UNITS, addonPreview,
    // merch
    merch, sizes: SIZES, colours: COLOURS,
    merchColumns: [{ name: 'size', label: 'Size', field: 'size', align: 'left' }, ...COLOURS.map((c) => ({ name: c, label: c, field: c, align: 'left' }))],
    stockTotal: computed(() => merch.value.rows.reduce((n, r) => n + COLOURS.reduce((m, c) => m + (Number(r[c]) || 0), 0), 0)),
    fulfilment: [
      { key: 'pickup', title: 'Pick up at hotel check-in', blurb: 'Bagged by size and handed over with the room key. No shipping.' },
      { key: 'ship', title: 'Ship to the buyer', blurb: 'Flat $8.95 shipping, added at checkout. Ships 10 days before the event.' },
    ],
    // generic
    gen, genericUnits: GENERIC_UNITS,
  }
}

const story = (opts = {}) => epPage({
  active: 'products',
  components: { DsSearch, DsModal, DsInput, DsSelect, DsEmptyState, DsLink, DsChartCard, DsBarChart },
  setup: () => {
    const s = state(opts)
    // openCreate also has to open the dialog; kept here so `state()` stays a
    // plain description of the screen.
    const open = s.openCreate
    s.openCreate = () => { open(); s.createOpen.value = true }
    return s
  },
  slot: SLOT(!!opts.empty, !!opts.chart),
})

/* ---------------------------------------------------------------------------
 * Stories — `List` MUST stay the first export (standalone prototype).
 * ------------------------------------------------------------------------- */

/** Landing screen: the catalogue, one filter tile per product type. Click
 *  "Stays" to see the room-block rows and the note about them. */
export const List = story()

/** Step 1 of Add Product. Stays are shown but can't be chosen. */
export const CreateTypePicker = story({ open: true, step: 'type', chosen: 'package' })
CreateTypePicker.storyName = 'Create · 1 Choose a type'

/** Westin Package for a party of 4: $3,576.00 of components, −$208.00 bundle
 *  credit on the stay and extras only, $3,368.00. Change the hotel or the
 *  party size, or untick a component, and the price follows. */
export const CreatePackage = story({ open: true, step: 'package', chosen: 'package' })
CreatePackage.storyName = 'Create · Package builder'

/** Spirit Nationals admission: the five tiers from the repo, face value locked,
 *  inventory editable — Mat-Side Finals Seating at 0 reads Sold Out. */
export const CreateTicketTiers = story({ open: true, step: 'tickets', chosen: 'ticket' })
CreateTicketTiers.storyName = 'Create · Ticket tiers'

/** Round-Trip Stadium Transfer: per guest, follows the ticket count, requires a
 *  hotel. Switch to Per vehicle to see "Guest chooses" and Max per order. */
export const CreateAddon = story({ open: true, step: 'addon', chosen: 'addon' })
CreateAddon.storyName = 'Create · Add-on with rules'

/** Event tee: 7 sizes × 2 colours with stock per variant, pickup at check-in. */
export const CreateMerch = story({ open: true, step: 'merch', chosen: 'merch' })
CreateMerch.storyName = 'Create · Merchandise with sizes'

/** The shared form every other type uses — here a Meal (Team Awards Banquet). */
export const CreateGeneric = story({ open: true, step: 'generic', chosen: 'meal' })
CreateGeneric.storyName = 'Create · Generic form (meal)'

/** First run — nothing created yet. */
export const Empty = story({ empty: true })
Empty.storyName = 'Empty · first run'

/** **Chart concept · Sales by product type** — the List with a ranked sales
 *  chart above the type tiles.
 *
 *  *Question it answers:* "Beyond the room, what actually earns?" — which
 *  product types are worth building out for the next event and which are
 *  shelf-fillers. The tiles count *products* per type, which says nothing
 *  about money: Add-ons has the most rows, Packages has two and out-earns it.
 *
 *  *Why a horizontal bar, not a donut:* there are eight types. The Charts
 *  Overview limits Donut to 2–5 parts (beyond that it folds the rest into
 *  "Other", which would hide exactly the small types this is meant to judge)
 *  and prefers horizontal Bar for many categories with long labels. Sorted
 *  largest first so the ranking reads top-down.
 *
 *  *Adds:* one chart card between the header and the catalogue; the catalogue
 *  is unchanged. */
export const ChartConceptSalesByType = story({ chart: true })
ChartConceptSalesByType.storyName = 'Chart concept · Sales by product type'
