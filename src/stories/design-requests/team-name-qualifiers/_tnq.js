/** Team Name Qualifiers — shared scaffold.
 *
 *  The admin half of the Team Name Qualifiers request: the event Registration
 *  tab, reskinned from the captures supplied on 2026-10-07 onto the design
 *  system. (The guest checkout half of the brief is being built in another
 *  repo and is deliberately not here.)
 *
 *  Everything below is fixture data and the page chrome, keyed to the event in
 *  the captures so the folder reads as one walkthrough of one event.
 */
import AppShell from '../../../components/AppShell.vue'

/* ---------------------------------------------------------------------------
 * App chrome — nav as it appears in the captures.
 * ------------------------------------------------------------------------- */
export const TNQ_NAV = [
  { key: 'users', label: 'Users', icon: 'groups' },
  { key: 'events', label: 'Events', icon: 'event' },
  { key: 'compliance', label: 'Compliance', icon: 'fact_check' },
  { key: 'pickup', label: 'Pickup Reports', icon: 'receipt_long' },
  { key: 'reports', label: 'Reports', icon: 'bar_chart' },
  { key: 'venues', label: 'Venues', icon: 'explore' },
  { key: 'event-companies', label: 'Event Companies', icon: 'account_tree' },
  { key: 'hotels', label: 'Hotels', icon: 'apartment' },
  { key: 'brands', label: 'Hotel Brands', icon: 'domain' },
  { key: 'amenities', label: 'Amenities', icon: 'room_service' },
  { key: 'room-types', label: 'Room Types', icon: 'king_bed' },
  { key: 'companies', label: 'Companies', icon: 'business_center' },
  { key: 'requests', label: 'Requests', icon: 'assignment' },
  { key: 'inventory', label: 'Inventory Request', icon: 'library_add' },
  { key: 'admin', label: 'Admin Tools', icon: 'manage_accounts' },
  { key: 'pipe', label: 'Pipe Tools', icon: 'build' },
  { key: 'webhooks', label: 'Webhooks', icon: 'link' },
]
export const COMPANY = 'Team Travel Source (TTS)'
export const USER = 'Scott Villemain'

/* Screens here are runtime-compiled template strings; when one fails Vue
 * renders nothing, which in Storybook reads as a blank story. The shell
 * renders the error instead. */
const fatalTemplate = `
  <div style="padding:32px; font-family:ui-monospace, SFMono-Regular, Menlo, monospace;">
    <div style="max-width:900px; border:2px solid var(--ds-color-background-danger-bold); border-radius:var(--ds-radius-lg); overflow:hidden;">
      <div style="background:var(--ds-color-background-danger-bold); color:#fff; padding:12px 18px; font-weight:700;">This screen failed to render</div>
      <pre style="margin:0; padding:18px; white-space:pre-wrap; word-break:break-word; font-size:0.8125rem; line-height:1.6; color:var(--ds-color-text);">{{ fatal }}</pre>
    </div>
  </div>`

/** Wrap `slot` in the App Shell, with the Events item active. */
export function tnqPage({ components = {}, setup = () => ({}), slot = '' }) {
  return {
    render: (args) => ({
      components: { AppShell, ...components },
      setup: () => {
        try {
          return { fatal: '', nav: TNQ_NAV, ...setup(args) }
        } catch (err) {
          return { fatal: 'setup() threw:\n\n' + (err && err.stack ? err.stack : String(err)) }
        }
      },
      template: `
        <template v-if="fatal">${fatalTemplate}</template>
        <div v-else style="height:100vh">
          <app-shell :items="nav" active="events" org="${COMPANY}" user="${USER}" bleed>
            ${slot}
          </app-shell>
        </div>`,
    }),
  }
}

/* ---------------------------------------------------------------------------
 * The event in the captures
 * ------------------------------------------------------------------------- */
export const EVENT = {
  name: 'Scott’s Volleyball Smash Tournament',
  status: 'Active',
  tabs: ['Hotels', 'RFPs', 'Venues', 'Notes', 'Groups', 'Reservations', 'Waitlist', 'Pickup', 'Registration', 'Customize', 'Activity Logs'],
  /** Meta grid under the title — row-major across 3 columns, values as captured. */
  meta: [
    { label: 'City/State:', value: 'suiasda, AL' },
    { label: 'Room Night Goal:', value: '3' },
    { label: 'Account Manager:', value: 'Abby Brooks' },
    { label: 'Event Producer:', value: '3v3 Livee' },
    { label: 'Peak Night Goal:', value: '3' },
    { label: 'Stay to Play:', value: 'False' },
    { label: 'Start/End Dates:', value: 'Fri, 02/05/2027 – Mon, 02/08/2027' },
  ],
}

/** Event title, meta grid and tabs — the same header every event tab uses. */
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
    </div>
    <div style="display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:4px 48px; margin:14px 0 18px; max-width:1180px;">
      <div v-for="(m, mi) in evt.meta" :key="mi" style="display:grid; grid-template-columns:170px 1fr; gap:12px; font-size:0.9375rem;">
        <span style="color:var(--ds-color-text-subtle);">{{ m.label }}</span>
        <span style="color:var(--ds-color-text);">{{ m.value }}</span>
      </div>
    </div>
    <q-tabs :model-value="'registration'" no-caps active-color="primary" indicator-color="primary" align="left" class="text-grey-7" style="margin:0 -8px;">
      <q-tab v-for="t in evt.tabs" :key="t" :name="t.toLowerCase().replace(/ /g,'-')" :label="t" />
    </q-tabs>
  </div>`

/* ---------------------------------------------------------------------------
 * Team Name Qualifiers — the company's custom fields that can qualify a team
 * name. Order is the order they appear in the picker and in the built name.
 * ------------------------------------------------------------------------- */
export const QUALIFIER_FIELDS = [
  { key: 'age', label: 'Age Division', type: 'dropdown', options: ['U10', 'U11', 'U12', 'U13', 'U14', 'U15', 'U16', 'U17', 'U18'] },
  { key: 'gender', label: 'Gender', type: 'dropdown', options: ['Boys', 'Girls', 'Co-ed'] },
  { key: 'skill', label: 'Skill Level', type: 'dropdown', options: ['Recreational', 'Club', 'Elite'] },
  { key: 'coach', label: 'Coach Name', type: 'text', options: [] },
]

/** The example team a manually entered name is previewed with. */
export const SAMPLE_TEAM = 'Augusta Arsenal'

/**
 * The preview of a manually entered team name: the sample team, then each
 * selected qualifier in picker order. A dropdown shows its first option; a
 * free-text field shows a "[Field name]" placeholder.
 */
export function previewParts(selectedKeys, fields = QUALIFIER_FIELDS) {
  return [
    { text: SAMPLE_TEAM, placeholder: false },
    ...fields
      .filter((f) => selectedKeys.includes(f.key))
      .map((f) => (f.type === 'text'
        ? { text: `[${f.label}]`, placeholder: true }
        : { text: f.options[0], placeholder: false })),
  ]
}

/**
 * Booking Site Behavior rules, as shown in the captures. Requiring team
 * selection for BOTH group blocks and reservations means every guest picks
 * from the registered team list, so nobody types a team name: Hide Team List
 * is disabled and Team Name Qualifiers become "Not applicable".
 */
export const teamListLocked = (f) => f.groupBlockTeamRequired && f.reservationTeamRequired
