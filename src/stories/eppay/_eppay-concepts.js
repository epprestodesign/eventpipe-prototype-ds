/** EP Pay — shared scaffold for the five CONCEPT areas.
 *
 *  Customers, Payment Links, Products, Subscriptions and Invoicing have no
 *  requirements anywhere in Linear (checked 2026-09-29). The user chose to have
 *  them designed as concepts extrapolated from the EP Pay screens that DO
 *  exist — no external references — and labelled so a screenshot can never be
 *  mistaken for specified product.
 *
 *  Everything here is a pattern lifted from a built EP Pay screen, not a new
 *  one:
 *
 *    - `conceptHeader()`   → `epHeader()` with the Concept badge on it.
 *    - `filterTiles()`     → the Transactions filter row (q-card buttons + DsStat).
 *    - `listToolbar()`     → the Transactions / Payouts search + Filter + Export row.
 *    - `pager()`           → the Transactions table footer.
 *    - `EDIT_COLUMNS_HEADER` / `ROW_MENU` → the pencil header and the row menu
 *      every EP Pay ledger ends on.
 *    - `pick()`            → the selected-choice-card style from Get My Funds.
 *
 *  The fixtures reuse the people, events, hotels and reservation numbers the
 *  built screens already show, so a customer here is someone who is already in
 *  Transactions, and a reservation here is one already in the ledger.
 */
import { epHeader, toneChip, TONE_TINT } from './_eppay'

/* ---------------------------------------------------------------------------
 * The Concept label
 * ------------------------------------------------------------------------- */

export const CONCEPT_BADGE = 'Concept — no requirements'

/** DsPageHeader paints its badge as a Quasar `q-badge`, which turns `color`
 *  into a `bg-<color>` class and hard-codes white text. The DS warning pair
 *  (pale yellow + yellow-700 text) is the right "neutral caution" — it is what
 *  every EP Pay "Pending" chip wears, it is not the red of an error, and it is
 *  not the grey a disabled control wears. Quasar's own `warning` is the bold
 *  yellow with white text on it, which fails contrast badly.
 *
 *  So the colour passed is the two DS utility classes, `bg-ds-warning` and
 *  `text-ds-warning`: `q-badge` prefixes the first with `bg-`, and the second
 *  rides along as a plain class. It works (verified in the screenshots), but it
 *  is leaning on how `q-badge` builds its class string — a `badgeTextColor`
 *  option on `epHeader()` would be the honest version. Flagged in the report
 *  rather than changed, because `_eppay.js` is shared. */
export const CONCEPT_BADGE_COLOR = 'ds-warning text-ds-warning'

/** `epHeader()` with the Concept badge. Every concept screen opens with this,
 *  so the label cannot be forgotten on one of them. */
export const conceptHeader = (title, opts = {}) =>
  epHeader(title, { ...opts, badge: CONCEPT_BADGE, badgeColor: CONCEPT_BADGE_COLOR })

/** The docs block every concept file opens with: the concept statement, what
 *  the area was designed as, and the open questions — each with the answer the
 *  concept assumed, so product can overturn one assumption at a time. */
export const conceptDocs = ({ area, summary, patterns, questions, left }) => [
  `> **Illustrative concept — invented scope.** There are no requirements for ${area} anywhere in Linear (checked 2026-09-29). ` +
    'Every field, status and number on these screens is a guess extrapolated from the EP Pay screens that *are* built. ' +
    'Nothing here is specified product; review it as a starting point for a conversation, not as a design to build.',
  '',
  summary,
  '',
  `**Built from existing EP Pay patterns:** ${patterns}`,
  '',
  '**Open questions for product** — and the assumption this concept designed to:',
  '',
  ...questions.map(([q, a], i) => `${i + 1}. **${q}** — *Assumed:* ${a}`),
  ...(left ? ['', `**Deliberately not designed:** ${left}`] : []),
].join('\n')

/* ---------------------------------------------------------------------------
 * Shared type + table bits — each one a copy of what a built screen does.
 * ------------------------------------------------------------------------- */

/** Uppercase eyebrow — same value Transactions and Balances declare locally. */
export const MICRO = 'font-size:0.75rem; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:var(--ds-color-text-subtle);'
/** Two-line cell padding — same as the Transactions ledger. */
export const TD = 'padding:12px 16px;'
export const MONO = 'font-family:ui-monospace, SFMono-Regular, Menlo, monospace; font-size:0.875rem;'

/** The Transactions filter row, generalised: `filters` is `[{ key, label,
 *  count, total }]` and `active` is the selected key, both from setup(). */
export const filterTiles = (cols) => `
  <div style="display:grid; grid-template-columns:repeat(${cols}, 1fr); gap:16px; margin-bottom:20px;">
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

/** Search + Filter + Export, as Transactions and Payouts lay it out. */
export const listToolbar = (placeholder) => `
  <div style="display:flex; align-items:center; gap:16px; margin-bottom:18px;">
    <div style="width:100%; max-width:400px;">
      <ds-search v-model="query" placeholder="${placeholder}" />
    </div>
    <span style="flex:1;" />
    <q-btn outline no-caps color="primary" icon="filter_alt" label="Filter" style="padding:0 18px;" />
    <q-btn outline no-caps color="primary" icon="file_download" label="Export" style="padding:0 18px;" />
  </div>`

/** The table footer: "Showing 1–N of <count> <noun>" plus the page control —
 *  the design system's DsPagination (Components › Navigation › Pagination,
 *  "Rich"), registered for every EP Pay screen by epPage(). Uncontrolled: the
 *  concept tables show one static page of rows, so the control responds but the
 *  rows don't page. */
export const pager = (noun) => `
  <template #bottom>
    <ds-pagination :total="current.count" :page-size="visible.length || 10" :max="current.pages"
      noun="${noun}" style="flex:1; padding:6px 4px;" />
  </template>`

export const EDIT_COLUMNS_HEADER = `
  <template #header-cell-actions="props">
    <q-th :props="props">
      <q-btn flat dense square icon="edit" color="white" size="sm" aria-label="Edit columns" />
    </q-th>
  </template>`

/** `label` is a template expression for the row's name, for the aria-label. */
/** A row's ⋮ action menu — the design system's DsActionMenu (one 40×40 size
 *  everywhere; registered for every EP Pay screen by epPage()). `label` and
 *  `items` are template expressions; items with `to` open that prototype route. */
export const rowMenu = (label, items = '[]') => `
  <template #body-cell-actions="props">
    <q-td :props="props" style="${TD}">
      <ds-action-menu :label="'Actions for ' + ${label}" :items="${items}" />
    </q-td>
  </template>`

export const ACTIONS_COL = { name: 'actions', label: '', field: () => '', align: 'right', style: 'width:64px;', headerStyle: 'width:64px;' }

/** Get My Funds' choice-card selected state: brand edge over the palest wash. */
export const pick = (on) => (on
  ? 'border:2px solid var(--ds-color-border-brand); background:var(--ds-color-background-brand-subtlest); padding:15px 17px;'
  : 'border:1px solid var(--ds-color-border-container); background:var(--ds-color-surface); padding:16px 18px;')

/** Statuses the concepts introduce. They resolve to the SAME five tones
 *  `_eppay.js` owns — no new colour — and are mapped here rather than added to
 *  STATUS_TONE because they are invented and should not leak into built
 *  screens. "Open"/"Scheduled for retry" read as Pending does (warning);
 *  anything finished-but-not-money is info, the tone Refunded already uses. */
const CONCEPT_TONE = {
  Active: 'positive', Paid: 'positive', Succeeded: 'positive',
  Open: 'warning', Retrying: 'warning',
  'Past Due': 'negative', Failed: 'negative',
  Completed: 'info', Refunded: 'info',
  Draft: 'neutral', Expired: 'neutral', Deactivated: 'neutral', Archived: 'neutral',
  Canceled: 'neutral', Scheduled: 'neutral', Void: 'neutral',
  // Products: a sold-out tier is a caution, not a failure; a room-block row is
  // information (it lives elsewhere), the tone Refunded/Completed use.
  'Sold Out': 'warning', 'Room Block': 'info',
}
export const conceptChip = (status) => toneChip(CONCEPT_TONE[status] || 'neutral')
export const conceptTint = (status) => TONE_TINT[CONCEPT_TONE[status] || 'neutral']

/* ---------------------------------------------------------------------------
 * Fixtures shared by more than one concept — all drawn from built screens.
 * ------------------------------------------------------------------------- */

/** The three events the ledger shows. */
export const EVENTS = [
  'Automated Playwright Live Event 340366',
  'Pricing Event 539073',
  'Pricing Event 637236',
]

/** Event → the hotel its reservations are at, as the ledger pairs them. */
export const HOTEL_FOR = {
  'Automated Playwright Live Event 340366': 'Hyatt Regency Seattle',
  'Pricing Event 539073': 'Marriott Tempe at The Buttes',
  'Pricing Event 637236': 'Omni Tempe Hotel at ASU',
}

/** Customers — everyone here is a payer already in Transactions, Balances or
 *  Disputes, with the card and reservation those screens show for them.
 *  `id` is invented (CUS-), emails are on the reserved example.com domain. */
export const CUSTOMERS = [
  { id: 'CUS-10482', name: 'Elena Fischer', email: 'elena.fischer@example.com', phone: '(206) 555-0148', brand: 'VISA', last4: '••••8821', methods: 3, spend: '$4,812.00', payments: 6, refunds: 1, disputes: 1, since: 'Jan 14, 2025', latestWhen: 'Aug 20, 2026', event: 'Automated Playwright Live Event 340366', res: 'Hyatt Regency Seattle RES-5381879', repeat: true, isNew: false },
  { id: 'CUS-10477', name: 'Noah Klein', email: 'noah.klein@example.com', phone: '(480) 555-0112', brand: 'Klarna', last4: '••••2914', methods: 2, spend: '$2,708.00', payments: 2, refunds: 0, disputes: 1, since: 'Aug 17, 2026', latestWhen: 'Aug 20, 2026', event: 'Pricing Event 539073', res: 'Marriott Tempe at The Buttes RES-5379550', repeat: false, isNew: true },
  { id: 'CUS-10469', name: 'Jordan Alvarez', email: 'jordan.alvarez@example.com', phone: '(206) 555-0190', brand: 'Discover', last4: '••••6011', methods: 2, spend: '$3,268.80', payments: 3, refunds: 1, disputes: 0, since: 'Mar 2, 2026', latestWhen: 'Aug 19, 2026', event: 'Automated Playwright Live Event 340366', res: 'Hyatt Regency Seattle RES-5379824', repeat: true, isNew: false },
  { id: 'CUS-10455', name: 'Hannah Reyes', email: 'hannah.reyes@example.com', phone: '(602) 555-0171', brand: 'PayPal', last4: '••••7730', methods: 3, spend: '$5,531.00', payments: 5, refunds: 1, disputes: 0, since: 'Feb 19, 2026', latestWhen: 'Aug 19, 2026', event: 'Pricing Event 539073', res: 'Marriott Tempe at The Buttes RES-5377495', repeat: true, isNew: false },
  { id: 'CUS-10441', name: 'Marcus Webb', email: 'marcus.webb@example.com', phone: '(480) 555-0136', brand: 'AMEX', last4: '••••1007', methods: 2, spend: '$4,709.30', payments: 4, refunds: 0, disputes: 0, since: 'Jan 14, 2026', latestWhen: 'Aug 19, 2026', event: 'Pricing Event 637236', res: 'Omni Tempe Hotel at ASU RES-5375166', repeat: true, isNew: false },
  { id: 'CUS-10436', name: 'Chris Okonkwo', email: 'chris.okonkwo@example.com', phone: '(206) 555-0157', brand: 'Mastercard', last4: '••••5309', methods: 1, spend: '$762.00', payments: 1, refunds: 0, disputes: 0, since: 'Aug 18, 2026', latestWhen: 'Aug 18, 2026', event: 'Automated Playwright Live Event 340366', res: 'Hyatt Regency Seattle RES-5370782', repeat: false, isNew: true },
  { id: 'CUS-10428', name: 'Priya Raman', email: 'priya.raman@example.com', phone: '(480) 555-0183', brand: 'AMEX', last4: '••••3315', methods: 2, spend: '$1,503.00', payments: 2, refunds: 0, disputes: 1, since: 'Aug 11, 2026', latestWhen: 'Aug 20, 2026', event: 'Pricing Event 539073', res: 'Marriott Tempe at The Buttes RES-5379550', repeat: false, isNew: true },
  { id: 'CUS-10413', name: 'Owen Marsh', email: 'owen.marsh@example.com', phone: '(602) 555-0104', brand: 'VISA', last4: '••••6620', methods: 1, spend: '$3,410.90', payments: 1, refunds: 0, disputes: 1, since: 'Aug 4, 2026', latestWhen: 'Aug 4, 2026', event: 'Pricing Event 637236', res: 'Omni Tempe Hotel at ASU RES-5362210', repeat: false, isNew: true },
  { id: 'CUS-10392', name: 'Grace Lindqvist', email: 'grace.lindqvist@example.com', phone: '(206) 555-0162', brand: 'VISA', last4: '••••1188', methods: 1, spend: '$2,150.00', payments: 1, refunds: 0, disputes: 0, since: 'Jun 18, 2026', latestWhen: 'Jun 18, 2026', event: 'Automated Playwright Live Event 340366', res: 'Hyatt Regency Seattle RES-5341907', repeat: false, isNew: false },
  { id: 'CUS-10377', name: 'Maya Sorensen', email: 'maya.sorensen@example.com', phone: '(480) 555-0129', brand: 'Discover', last4: '••••7076', methods: 2, spend: '$7,124.77', payments: 3, refunds: 0, disputes: 1, since: 'Nov 3, 2025', latestWhen: 'Mar 20, 2026', event: 'Pricing Event 539073', res: 'Marriott Tempe at The Buttes RES-5302284', repeat: true, isNew: false },
]

export const customerNames = CUSTOMERS.map((c) => c.name)

/* ---------------------------------------------------------------------------
 * Products — the product-type catalogue (2026-09-29 revision).
 *
 * Products is the one concept NOT tied to the ledger's 09/28 test events. The
 * user approved building it on the ticketing repo's product offering
 * (presto-2026-ticketing), so its examples are that repo's two events with that
 * repo's product names and prices. Anything marked `invented: true` is an
 * event-travel type the user asked for that the repo does not have yet.
 * ------------------------------------------------------------------------- */

export const TICKETING_REPO = 'https://epprestodesign.github.io/presto-2026-ticketing/'

/** The two events the ticketing repo is built around. */
export const PRODUCT_EVENTS = [
  { key: 'nfl', name: 'Pittsburgh Steelers at New England Patriots', short: 'Steelers at Patriots', where: 'Gillette Stadium · Sun, Sep 20, 2026' },
  { key: 'cheer', name: 'Sunshine State Spirit Nationals 2027', short: 'Spirit Nationals 2027', where: 'OCCC, Orlando · Feb 12–14, 2027' },
]
export const productEventNames = PRODUCT_EVENTS.map((e) => e.name)
const NFL = PRODUCT_EVENTS[0]
const CHEER = PRODUCT_EVENTS[1]

/** The taxonomy. `form` is which create form the type opens: four types get a
 *  dedicated form, everything else shares `generic`; stays open none — they
 *  are read from Room Blocks. `source` names where the example comes from. */
export const PRODUCT_TYPES = [
  { key: 'stay', label: 'Stays', single: 'Hotel stay', icon: 'hotel', unit: 'per room-night', rules: 'Read-only here. Rate, inventory and dates come from the event\'s room block.', example: 'Renaissance Patriot Place · King Room, $329.00', form: null, source: 'trip-builder/src/trip.js' },
  { key: 'ticket', label: 'Tickets', single: 'Ticket tiers', icon: 'confirmation_number', unit: 'per ticket', rules: 'One event, several tiers. Face value is locked; inventory is set per tier. Never discounted by the bundle credit.', example: 'Weekend Spectator Pass, $89.00', form: 'tickets', source: 'hotel-first/src/tickets.js' },
  { key: 'package', label: 'Packages', single: 'Package', icon: 'card_travel', unit: 'per party', rules: 'Composed from other products and priced for the party size. Bundle credit (10%) on the stay and extras only.', example: 'Westin Package, $3,368.00 for 4', form: 'package', source: 'option-d/src/packages.js' },
  { key: 'addon', label: 'Add-ons', single: 'Add-on', icon: 'add_circle_outline', unit: 'per guest · vehicle · booking', rules: 'Quantity follows the ticket count or is chosen by the guest; optional max per order; can require a hotel in the trip; gameday or destination timing.', example: 'Prepaid Gameday Parking, $65.00 per vehicle', form: 'addon', source: 'tickets-first/src/addons.js, hotel-first/src/addons.js' },
  { key: 'meal', label: 'Meals', single: 'Meal or banquet', icon: 'restaurant', unit: 'per person', rules: 'Date, time and a seat capacity.', example: 'Team Awards Banquet, $68.00', form: 'generic', source: 'invented — requested by the user' },
  { key: 'transport', label: 'Transport', single: 'Group transport', icon: 'directions_bus', unit: 'per seat · per coach', rules: 'A departure time and a capacity; coaches are chartered whole.', example: 'Round-trip stadium shuttle, $28.00 per seat', form: 'generic', source: 'trip-builder/src/trip.js + invented charter coach' },
  { key: 'merch', label: 'Merchandise', single: 'Merchandise', icon: 'checkroom', unit: 'per item', rules: 'Variants (size × colour) with stock per variant; picked up at check-in or shipped.', example: 'Spirit Nationals Event Tee, $28.00', form: 'merch', source: 'invented — requested by the user' },
  { key: 'experience', label: 'Experiences', single: 'Experience', icon: 'stars', unit: 'per person', rules: 'A session time and a capacity.', example: 'Legends stadium tour, $120.00', form: 'generic', source: 'trip-builder/src/trip.js + invented clinic' },
  { key: 'protection', label: 'Protection & Fees', single: 'Protection or fee', icon: 'verified_user', unit: 'per booking · % of trip', rules: 'Trip/housing protection and hotel extras & fees. Percent or flat.', example: 'Trip Protection, 7% of trip cost', form: 'generic', source: 'invented + the earlier concept\'s fee rows' },
]
export const productTypeByKey = Object.fromEntries(PRODUCT_TYPES.map((t) => [t.key, t]))

/** Every type has at least one row. Prices and names are the repo's unless the
 *  row says `invented`. */
export const PRODUCTS = [
  { id: 'PRD-0101', type: 'stay', status: 'Room Block', name: 'Renaissance Patriot Place · King Room', desc: '2 nights, Sat Sep 19 – Mon Sep 21', price: '$329.00', unit: 'per room-night', event: NFL, used: 'Managed in Room Blocks' },
  { id: 'PRD-0102', type: 'stay', status: 'Room Block', name: 'Rosen Centre Convention Hotel · Double Queen', desc: '3 nights, Feb 12 – 15, 2027', price: '$229.00', unit: 'per room-night', event: CHEER, used: 'Managed in Room Blocks' },
  { id: 'PRD-0110', type: 'ticket', status: 'Active', name: 'Gameday tickets · 4 tiers', desc: 'Upper Level to Club Level', price: '$89.00 – $375.00', unit: 'per ticket', event: NFL, used: 'On 212 orders' },
  { id: 'PRD-0111', type: 'ticket', status: 'Sold Out', name: 'Spirit Nationals admission · 5 tiers', desc: 'Mat-Side Finals Seating sold out', price: '$25.00 – $149.00', unit: 'per ticket', event: CHEER, used: 'On 164 orders' },
  { id: 'PRD-0120', type: 'package', status: 'Active', name: 'Westin Package', desc: 'Club Level tickets + 2 nights + coach + hospitality', price: '$3,368.00', unit: 'for a party of 4', event: NFL, used: 'On 18 orders' },
  { id: 'PRD-0121', type: 'package', status: 'Active', name: 'Ritz-Carlton Package', desc: 'Club Level tickets + 2 nights + coach + hospitality', price: '$3,154.00', unit: 'for a party of 4', event: NFL, used: 'On 9 orders' },
  { id: 'PRD-0130', type: 'addon', status: 'Active', name: 'Prepaid Gameday Parking', desc: 'Lot 6 · 4 min walk to Gate A · max 4', price: '$65.00', unit: 'per vehicle', event: NFL, used: 'On 96 orders' },
  { id: 'PRD-0131', type: 'addon', status: 'Active', name: 'Round-Trip Stadium Transfer', desc: 'Requires a hotel · departs 2:00 PM', price: '$42.00', unit: 'per guest', event: NFL, used: 'On 71 orders' },
  { id: 'PRD-0132', type: 'addon', status: 'Active', name: 'Walt Disney World 1-Day Ticket', desc: 'Destination · best on Mon, Feb 15', price: '$139.00', unit: 'per guest', event: CHEER, used: 'On 58 orders' },
  { id: 'PRD-0133', type: 'addon', status: 'Active', name: 'MCO Airport Round-Trip Transfer', desc: 'Destination · one van per booking', price: '$145.00', unit: 'per booking', event: CHEER, used: 'On 41 orders' },
  { id: 'PRD-0140', type: 'meal', status: 'Active', name: 'Character Breakfast', desc: 'Hosted at your hotel', price: '$59.00', unit: 'per guest', event: CHEER, used: 'On 33 orders' },
  { id: 'PRD-0141', type: 'meal', status: 'Draft', name: 'Team Awards Banquet', desc: 'Sun, Feb 14 · 7:00 PM · 240 seats', price: '$68.00', unit: 'per person', event: CHEER, used: 'Not on sale', invented: true },
  { id: 'PRD-0150', type: 'transport', status: 'Active', name: 'Round-trip stadium shuttle', desc: 'From the hotel block, two hours before kickoff', price: '$28.00', unit: 'per seat', event: NFL, used: 'On 64 orders' },
  { id: 'PRD-0151', type: 'transport', status: 'Active', name: 'Charter coach · 56 seats', desc: 'Hotel ↔ Gillette Stadium, gameday', price: '$1,850.00', unit: 'per coach', event: NFL, used: 'On 2 orders', invented: true },
  { id: 'PRD-0160', type: 'merch', status: 'Active', name: 'Spirit Nationals Event Tee', desc: '7 sizes × 2 colours · pickup at check-in', price: '$28.00', unit: 'per item', event: CHEER, used: 'On 47 orders', invented: true },
  { id: 'PRD-0170', type: 'experience', status: 'Active', name: 'Legends stadium tour', desc: 'Locker room, tunnel and Hall of Fame', price: '$120.00', unit: 'per person', event: NFL, used: 'On 22 orders' },
  { id: 'PRD-0171', type: 'experience', status: 'Active', name: 'Pro Tumbling Clinic', desc: 'Sat, Feb 13 · 8:00 AM · 40 athletes', price: '$45.00', unit: 'per athlete', event: CHEER, used: 'On 26 orders', invented: true },
  { id: 'PRD-0180', type: 'protection', status: 'Active', name: 'Trip Protection', desc: 'Cancellation cover for the whole trip', price: '7%', unit: 'of trip cost', event: null, used: 'On 88 orders', invented: true },
  { id: 'PRD-0181', type: 'protection', status: 'Active', name: 'Housing service fee', desc: 'Team Travel Source booking and changes', price: '$25.00', unit: 'per reservation', event: null, used: 'On 190 orders' },
  { id: 'PRD-0182', type: 'protection', status: 'Archived', name: 'Late checkout', desc: 'Until 2:00 PM, subject to availability', price: '$75.00', unit: 'one-time', event: NFL, used: 'On 6 orders' },
]
