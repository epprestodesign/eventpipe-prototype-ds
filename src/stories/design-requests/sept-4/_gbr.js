/** Group Block Reminder Controls (PP-42 · PP-43 · PP-44) — shared scaffold.
 *
 *  Scott's 09/04 Loom, in his words: "it consists of two pretty simple UI
 *  changes."
 *
 *    1. Edit Event › Email Settings has no setting for group block reminders
 *       and needs one — an on/off toggle plus an interval between reminders.
 *       (Covers PP-42 / GBR-1 and PP-43 / GBR-3.)
 *    2. Registration Settings › Communications: turning Compliance Reminder on
 *       and saving should raise a modal warning that group block creators will
 *       get two streams of reminder email, with a way to turn group block
 *       reminders off as part of the save. (PP-44 / GBR-2 — the ticket says
 *       "Prototype Pending", so the modal is net-new design.)
 *
 *  Everything here is fixture data and template fragments shared by those
 *  screens, all keyed to the event Scott demos with so the folder reads as one
 *  walkthrough of one event.
 */
import AppShell from '../../../components/AppShell.vue'

/* ---------------------------------------------------------------------------
 * App chrome
 * ------------------------------------------------------------------------- */

/** Nav as it appears in Scott's capture. */
export const GBR_NAV = [
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
]

export const COMPANY = 'Team Travel Source (TTS)'
export const USER = 'Scott Villemain'

/* Screens here are runtime-compiled template strings; when one fails Vue
 * renders nothing and logs to the console, which in Storybook reads as an
 * inexplicably blank story. The shell renders the error instead. */
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
export function gbrPage({ active = 'events', org = COMPANY, user = USER, components = {}, setup = () => ({}), slot = '' }) {
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
          return { fatal: '', nav: GBR_NAV, ...setup(args) }
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
 * The event Scott demos with (braves-dev, 09/04)
 * ------------------------------------------------------------------------- */

export const EVENT = {
  name: '2026 - Scott-O Invitational Showdown',
  status: 'Active',
  cityState: 'Atlanta, GA',
  producer: '3STEP Sports - 3D Lacrosse',
  dates: 'Tue, 12/01/2026 - Sat, 12/05/2026',
  accountManager: 'Bryttny Cole',
  roomNightGoal: '110',
  peakNightGoal: '110',
  stayToPlay: 'True',
  earliestGroupRelease: 'No Blocks',
  latestHotelCutoff: 'Tue, 11/24/2026',
  availableOnPeak: '220',
  tabs: ['Hotels', 'RFPs', 'Venues', 'Notes', 'Groups', 'Reservations', 'Waitlist', 'Pickup', 'Registration', 'Customize', 'Activity Logs'],
}

/** Meta grid under the event title — row-major across 3 columns. */
EVENT.meta = [
  { label: 'City/State:', value: EVENT.cityState },
  { label: 'Room Night Goal:', value: EVENT.roomNightGoal },
  { label: 'Account Manager:', value: EVENT.accountManager },
  { label: 'Event Producer:', value: EVENT.producer },
  { label: 'Peak Night Goal:', value: EVENT.peakNightGoal },
  { label: 'Stay to Play:', value: EVENT.stayToPlay },
  { label: 'Start/End Dates:', value: EVENT.dates },
]

export const HOTELS = [
  {
    name: 'Staybridge Suites Atlanta Ne - Duluth, an IHG Hotel',
    address: '2360 Stephens Center Drive, GA · 0.25 Miles from venue',
    phone: '1-678-425-8990',
    release: 'No Blocks',
    cutoff: 'Tue, 11/24/2026',
    status: 'Live',
    statusColor: 'positive',
  },
  {
    name: 'Studio 6 Duluth, GA - Near Gas South District',
    address: '2350 Stephens Center Dr, GA · 0.24 Miles from venue',
    phone: '1-678-474-9700',
    release: 'No Blocks',
    cutoff: '- -',
    status: 'Not Contracted',
    statusColor: 'grey-6',
  },
]

/* ---------------------------------------------------------------------------
 * The group block reminder model
 * ------------------------------------------------------------------------- */

/** Today's hard-coded schedule, from the project description: a confirmation on
 *  creation, a reminder 2 days later, then every 3 days until release. Only the
 *  3 becomes configurable — the 2-day first reminder stays fixed (PP-43). */
export const FIRST_REMINDER_DAYS = 2
export const DEFAULT_INTERVAL = 3

/** Event-level group block reminder settings. Defaults preserve today's
 *  behavior exactly, which is what both tickets specify. */
export function makeGroupBlockReminders({ enabled = true, interval = DEFAULT_INTERVAL } = {}) {
  return { enabled, interval }
}

/** Scott: "the info text needs to probably say something like, you know, when
 *  enabled, group block creators will get reminders starting two days after
 *  their group block opens. They'll get a reminder every n number of days that
 *  you set below."
 *
 *  Written as a function of the current interval so the tooltip states the
 *  schedule actually configured rather than a generic "every N days" — the
 *  value is right there in the field, so echoing it costs nothing and makes the
 *  sentence answerable. */
export function reminderTooltip(interval) {
  const n = Number(interval)
  const every = Number.isInteger(n) && n > 0
    ? (n === 1 ? 'every day' : `every ${n} days`)
    : 'on the interval you set below'
  return `When on, the person who created a group block gets a reminder ${FIRST_REMINDER_DAYS} days after the block opens, then ${every} until the block's release date. The group block confirmation email sends either way.`
}

/** PP-43: positive integers only — zero, negatives, decimals, non-numeric and
 *  empty are all rejected. Returns an error string, or '' when valid. */
export function validateInterval(value) {
  if (value === '' || value === null || value === undefined) return 'Enter a number of days'
  const n = Number(value)
  if (!Number.isFinite(n)) return 'Enter a number of days'
  if (!Number.isInteger(n)) return 'Whole days only'
  if (n < 1) return 'Must be at least 1 day'
  return ''
}

/** The three conditions PP-44 requires to ALL be true before the modal shows.
 *  Kept as one function so the modal's trigger is stated once and the screens
 *  can't drift from it. */
export function hasReminderConflict({ complianceReminderOn, groupBlockRemindersOn, companyRecipientsIncludeGroupBlockContacts }) {
  return Boolean(complianceReminderOn && groupBlockRemindersOn && companyRecipientsIncludeGroupBlockContacts)
}

/* ---------------------------------------------------------------------------
 * Shared chrome fragments
 * ------------------------------------------------------------------------- */

/** Event record header — breadcrumb, title + status, meta grid, tab bar.
 *  Consuming setup must expose `evt` (EVENT) and a `tab` ref. */
export const eventHeader = `
  <div style="background:var(--ds-color-surface); padding:20px 32px 0;">
    <q-breadcrumbs active-color="primary" gutter="sm" class="text-body2 q-mb-sm">
      <template #separator><q-icon name="chevron_right" size="18px" color="grey-5" /></template>
      <q-breadcrumbs-el label="Events" />
      <q-breadcrumbs-el :label="evt.name" class="text-grey-6" />
    </q-breadcrumbs>

    <div class="row items-center q-gutter-md no-wrap">
      <div class="text-primary" style="font-size:1.5rem; font-weight:700; letter-spacing:-0.02em;">{{ evt.name }}</div>
      <q-chip dense clickable color="positive" text-color="white" icon-right="expand_more" :label="evt.status" />
      <q-space />
      <q-btn unelevated no-caps color="primary" label="Edit Event" />
      <q-btn flat dense round icon="more_horiz" color="grey-7" />
    </div>

    <div style="display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:4px 48px; margin:14px 0 18px; max-width:1180px;">
      <div v-for="(m, mi) in evt.meta" :key="mi" style="display:grid; grid-template-columns:170px 1fr; gap:12px; font-size:0.9375rem;">
        <span style="color:var(--ds-color-text-subtle);">{{ m.label }}</span>
        <span style="color:var(--ds-color-text);">{{ m.value }}</span>
      </div>
    </div>

    <q-tabs v-model="tab" no-caps active-color="primary" indicator-color="primary" align="left"
      class="text-grey-7" style="margin:0 -8px;">
      <q-tab v-for="t in evt.tabs" :key="t" :name="t.toLowerCase().replace(/ /g,'-')" :label="t" />
    </q-tabs>
  </div>`

/* ---------------------------------------------------------------------------
 * The company's Teams Management templates, worded as in the 09/04 capture.
 * Shared by the Registration Settings screen and the Communications Card
 * component story so the two can't drift.
 * ------------------------------------------------------------------------- */
export const TM_TEMPLATES = [
  {
    key: 'previously-compliant',
    title: 'Previously Compliant Notice',
    desc: 'Sent when a team that had met its goal drops back below it — usually after a cancellation. Sends once and if they remain non-compliant then compliance reminder emails take over.',
    on: false,
  },
  {
    key: 'compliance-reminder',
    title: 'Compliance Reminder',
    desc: 'The recurring nudge for teams. Runs on a cadence and date range you set relative to the event start. Intended for non-compliant teams. Add tiers to shift your tone, frequency, or audience as the event draws closer.',
    on: false,
  },
  {
    key: 'welcome',
    title: 'Welcome Email',
    desc: 'Sent once per team per event. Establishes that the event is Stay-to-Play and points the team at the booking link. Intended for teams traveling to the event with a compliance requirement.',
    on: true,
  },
]

/** The four Email Settings rows that exist today, in production order. */
export const EXISTING_EMAIL_ROWS = [
  { key: 'preArrival', label: 'Pre Arrival', value: 0, enabled: false,
    tooltip: 'When enabled, a pre-arrival email is sent to guests the number of days prior to check-in specified.' },
  { key: 'resReminder', label: 'Reservation Reminder', value: 45, enabled: true, caption: 'Sat, 10/17/2026',
    tooltip: 'When enabled, a reminder is sent to guests who have not yet booked, the number of days prior to the event specified.' },
  { key: 'depositReminder', label: 'Deposit Reminder', value: 5, enabled: true,
    tooltip: 'When enabled, a reminder is sent the number of days before the deposit is due.' },
  { key: 'hotelVerification', label: 'Hotel User Verification', value: 45, enabled: true, caption: 'Prior to the first hotel cutoff date',
    tooltip: 'When enabled, a verification email will be sent to hotel users the number of days prior to the first hotel cutoff specified. This email will verify the user is still involved with your event at the hotel and the level of access they will need.' },
]
