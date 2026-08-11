/** Multiple Secondary Fees (DES-451 · DES-452 · DES-456) — shared scaffold.
 *
 *  Josh's request: today an event (and an event hotel) can carry exactly ONE
 *  secondary custom fee. It needs to carry up to THREE, configurable at both
 *  levels and shown wherever secondary fees are surfaced.
 *
 *  This folder covers the EventPipe admin screens only — the booking-site
 *  surfaces (DES-453/454/455) are a separate batch.
 *
 *  Everything here is fixture data and template fragments shared by the
 *  screens: the app nav as it appears in the reference captures, the event /
 *  hotel / reservation records, the fee model, and the money helpers that keep
 *  the same fee reading identically on a config screen and on a summary.
 */
import AppShell from '../../../components/AppShell.vue'

/* ---------------------------------------------------------------------------
 * App chrome
 * ------------------------------------------------------------------------- */

/** Nav exactly as it appears in the 08/11 reference captures — PAGES_NAV plus
 *  **Compliance**, which the shared list lacks. Declared here so nothing in
 *  this folder edits chrome shared by 20+ unrelated stories. */
export const MSF_NAV = [
  { key: 'users', label: 'Users', icon: 'groups' },
  { key: 'events', label: 'Events', icon: 'event' },
  { key: 'compliance', label: 'Compliance', icon: 'fact_check' },
  { key: 'pickup', label: 'Pickup Reports', icon: 'receipt_long' },
  { key: 'reports', label: 'Reports', icon: 'bar_chart' },
  { key: 'hotels', label: 'Hotels', icon: 'apartment' },
  { key: 'brands', label: 'Hotel Brands', icon: 'domain' },
  { key: 'amenities', label: 'Amenities', icon: 'room_service' },
  { key: 'room-types', label: 'Room Types', icon: 'king_bed' },
  { key: 'venues', label: 'Venues', icon: 'explore' },
  { key: 'event-companies', label: 'Event Companies', icon: 'account_tree' },
  { key: 'companies', label: 'Companies', icon: 'business_center' },
  { key: 'requests', label: 'Requests', icon: 'assignment' },
  { key: 'inventory', label: 'Inventory Request', icon: 'library_add' },
  { key: 'admin', label: 'Admin Tools', icon: 'manage_accounts' },
  { key: 'pipe', label: 'Pipe Tools', icon: 'build' },
  { key: 'webhooks', label: 'Webhooks', icon: 'link' },
]

export const COMPANY = 'Team Travel Source (TTS)'
export const USER = 'Justin Girard'

/* Every screen here is a runtime-compiled template string. When one fails — a
 * malformed tag, a binding setup() never returned — Vue renders nothing and
 * writes to the console, which in Storybook reads as an inexplicably blank
 * story. So the shell catches it and renders the message instead. */
const fatalTemplate = `
  <div style="padding:32px; font-family:ui-monospace, SFMono-Regular, Menlo, monospace;">
    <div style="max-width:900px; border:2px solid var(--ds-color-border-danger, #c62828);
                border-radius:var(--ds-radius-lg); overflow:hidden;">
      <div style="background:#c62828; color:#fff; padding:12px 18px; font-weight:700;">
        This screen failed to render
      </div>
      <pre style="margin:0; padding:18px; white-space:pre-wrap; word-break:break-word;
                  font-size:0.8125rem; line-height:1.6; color:var(--ds-color-text);">{{ fatal }}</pre>
    </div>
  </div>`

/** Wrap `slot` in the App Shell — same contract as pages/_shell's page(). */
export function msfPage({ active = 'events', org = COMPANY, user = USER, components = {}, setup = () => ({}), slot = '' }) {
  const pageTemplate = `
    <div style="height:100vh">
      <app-shell :items="nav" active="${active}" org="${org}" user="${user}" bleed>
        ${slot}
      </app-shell>
    </div>`
  return {
    render: (args) => ({
      components: { AppShell, ...components },
      setup: () => {
        try {
          return { fatal: '', nav: MSF_NAV, ...setup(args) }
        } catch (err) {
          return { fatal: 'setup() threw:\n\n' + (err && err.stack ? err.stack : String(err)) }
        }
      },
      template: `
        <template v-if="fatal">${fatalTemplate}</template>
        <template v-else>${pageTemplate}</template>`,
    }),
  }
}

/* ---------------------------------------------------------------------------
 * Records — the same event / hotel / reservation used in the reference captures,
 * so every screen in this folder describes one consistent booking.
 * ------------------------------------------------------------------------- */

export const EVENT = {
  name: 'Reservation Status Testing',
  producer: '3STEP Sports - 3STEP Field Hockey',
  type: 'Boxing (Sporting Event)',
  accountManager: 'Alexis Rubin',
  dates: '06/01/2027 - 06/04/2027',
  housingOpensGroups: '06/11/2026 04:00 AM ET',
  housingOpensAttendees: '06/11/2026 04:00 AM ET',
  location: 'Boston, MA, United States',
}

export const HOTEL = {
  name: 'Quality Suites Hotel',
  address: '723 7th Ave, Longview, WA 98632',
  phone: '+1 (360) 414-1000',
  status: 'Live',
  tabs: ['Reservations (2)', 'Group Blocks', 'Room Blocks', 'Property Policies', 'Housing Company Policies', 'Users', 'Notes', 'Documents', 'Activity Logs'],
}

/** The reservation behind the summary screen (DES-456). Four room nights — the
 *  same length Josh demos with, so a $5 per-room-night fee reads as $20. */
export const RESERVATION = {
  guest: 'Emily Johnson',
  email: 'emily.johnson@example.com',
  phone: '+1 (617) 555-0134',
  confirmation: 'CONF1002',
  pipeId: 'R-01337912',
  groupId: 'G-00081623',
  status: 'Confirmed',
  checkIn: 'Mon, 05/31/2027',
  checkOut: 'Fri, 06/04/2027',
  nights: 4,
  rooms: 1,
  roomType: 'Two Queen Beds',
  occupancy: '2 Adults',
  nightlyRate: 189,
  taxRate: 0.1425,
  reservationFee: 0,
}

/* ---------------------------------------------------------------------------
 * The fee model
 * ------------------------------------------------------------------------- */

/** Max secondary custom fees per level. The ticket says three; naming them
 *  "Secondary Custom Fee 1/2/3" is Josh's working convention, so the cap and
 *  the labels both come from this one constant. */
export const MAX_SECONDARY_FEES = 3

export const CHARGE_TYPES = ['Per Reservation', 'Per Room Night']

/** One secondary custom fee. Same four fields the single fee has today —
 *  charge type, dollar amount, display label, description — plus the on/off
 *  state each of the three slots now carries independently. */
export function makeFee({ enabled = false, chargeType = 'Per Reservation', amount = null, label = '', description = '' } = {}) {
  return { enabled, chargeType, amount, label, description }
}

/** Three fee slots, seeded from `seeds` (index 0 → Fee 1). Always returns
 *  MAX_SECONDARY_FEES entries so the toggles are stable positions, not a list
 *  that grows and shrinks under the user. */
export function makeFees(seeds = []) {
  return Array.from({ length: MAX_SECONDARY_FEES }, (_, i) => makeFee(seeds[i] || {}))
}

/** Event-level seed: two fees configured, the third slot left off — the state
 *  that proves the section collapses cleanly when fewer than three are used. */
export const EVENT_FEE_SEEDS = [
  { enabled: true, chargeType: 'Per Reservation', amount: 10, label: 'Custom Name 1', description: 'Custom Description 1' },
  { enabled: true, chargeType: 'Per Room Night', amount: 5, label: 'Custom Name 2', description: 'Custom Description 2' },
  {},
]

/** Event-hotel seed: all three configured — the maximum, which is what the
 *  view page and the reservation summary have to survive. */
export const HOTEL_FEE_SEEDS = [
  { enabled: true, chargeType: 'Per Room Night', amount: 5, label: 'Custom Name 1', description: 'Custom Description 1' },
  { enabled: true, chargeType: 'Per Reservation', amount: 15, label: 'Custom Name 2', description: 'Custom Description 2' },
  { enabled: true, chargeType: 'Per Room Night', amount: 2, label: 'Custom Name 3', description: 'Custom Description 3' },
]

/** Today's single fee, for the current-state reference screens. */
export const CURRENT_EVENT_FEE = { enabled: true, chargeType: 'Per Reservation', amount: 10, label: 'Custom Name', description: 'Custom Description' }
export const CURRENT_HOTEL_FEE = { enabled: true, chargeType: 'Per Room Night', amount: 5, label: 'Custom Name', description: 'Custom Description' }

/* ---------------------------------------------------------------------------
 * Money — one implementation, so a fee reads the same everywhere it appears.
 * ------------------------------------------------------------------------- */

export function money(n) {
  return '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/** The rate as the config + view screens state it: "$5.00 per room night". */
export function feeRate(fee) {
  return `${money(fee.amount)} ${fee.chargeType === 'Per Room Night' ? 'per room night' : 'per reservation'}`
}

/** What the guest is actually charged, once nights are known. A per-room-night
 *  fee multiplies by nights (and rooms); a per-reservation fee does not. */
export function feeTotal(fee, nights = 1, rooms = 1) {
  const amt = Number(fee.amount) || 0
  return fee.chargeType === 'Per Room Night' ? amt * nights * rooms : amt * rooms
}

/** Only the slots the user turned on, in slot order, each carrying its slot
 *  number so a screen can fall back to "Secondary Custom Fee 2" when the label
 *  is still blank. */
export function activeFees(fees) {
  return fees
    .map((fee, i) => ({ ...fee, slot: i + 1, name: fee.label || `Secondary Custom Fee ${i + 1}` }))
    .filter((fee) => fee.enabled)
}

/* ---------------------------------------------------------------------------
 * Shared chrome fragments
 * ------------------------------------------------------------------------- */

/** Event-hotel record header — breadcrumb, thumbnail, title + Live pill,
 *  Export Rooming List, and the hotel tab bar. Consuming setup must expose
 *  `hotel` (HOTEL) and a `tab` ref. */
export const hotelHeader = `
  <div style="padding:20px 32px 0; background:var(--ds-color-surface); border-bottom:1px solid var(--ds-color-border-container);">
    <q-breadcrumbs active-color="primary" gutter="sm" class="text-body2 q-mb-md">
      <template #separator><q-icon name="chevron_right" size="18px" color="grey-5" /></template>
      <q-breadcrumbs-el label="Events" />
      <q-breadcrumbs-el label="${EVENT.name}" />
      <q-breadcrumbs-el label="Manage Event Hotel" class="text-grey-6" />
    </q-breadcrumbs>

    <div class="row items-start justify-between no-wrap q-mb-md">
      <div class="row items-center no-wrap" style="gap:16px; min-width:0;">
        <ds-thumbnail size="xl" fit="cover" :src="hotelPhoto" />
        <div style="min-width:0;">
          <div class="row items-center no-wrap" style="gap:10px;">
            <a href="#" class="text-primary" style="text-decoration:none; font-size:1.375rem; font-weight:700;" @click.prevent>{{ hotel.name }}</a>
            <q-btn dense no-caps unelevated color="positive" text-color="white" class="q-px-sm" style="border-radius:6px;">
              {{ hotel.status }} <q-icon name="arrow_drop_down" size="20px" />
            </q-btn>
          </div>
          <div class="text-grey-6" style="font-size:0.875rem; margin-top:2px;">{{ hotel.address }} • {{ hotel.phone }}</div>
        </div>
      </div>
      <div class="row items-center no-wrap" style="gap:10px; flex:none;">
        <q-btn unelevated no-caps color="primary" label="Export Rooming List" />
        <q-btn flat round dense icon="more_horiz" color="grey-7" />
      </div>
    </div>

    <q-tabs v-model="tab" no-caps active-color="primary" indicator-color="primary" align="left"
      class="text-grey-7" mobile-arrows outside-arrows>
      <q-tab v-for="t in hotel.tabs" :key="t" :name="t.toLowerCase().replace(/[^a-z]+/g,'-').replace(/^-|-$/g,'')" :label="t" />
    </q-tabs>
  </div>`

/** The note that sits under the two reservation-fee toggles on both levels. */
export const RES_FEE_NOTE = '* The EventPipe Reservation Fee and Additional Reservation Fee are added together and included in the taxes and fees section of the checkout summary'
