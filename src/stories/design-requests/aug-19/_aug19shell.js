/** Phase 2 app-shell scaffold.
 *
 *  Mirrors `stories/pages/_shell.js` but carries the nav as it appears in the
 *  production screens this project works from (references/080626): it includes
 *  **Compliance** — which PAGES_NAV lacks — and drops "Inventory Requests".
 *
 *  Defined here rather than by editing the shared _shell.js so every Phase 2
 *  change stays inside this folder. AppShell itself is imported, not forked —
 *  it is global chrome shared by 20+ unrelated stories.
 */
import AppShell from '../../../components/AppShell.vue'
import { COMPANY, USER } from './_aug19fixtures'

export const AUG19_NAV = [
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
  { key: 'admin', label: 'Admin Tools', icon: 'manage_accounts' },
  { key: 'pipe', label: 'Pipe Tools', icon: 'build' },
  { key: 'webhooks', label: 'Webhooks', icon: 'link' },
]

/* Every screen in this folder is a runtime-compiled template string. When one
 * of those fails — a malformed tag, a binding the setup never returned — Vue
 * renders nothing and writes to the browser console. In Storybook that reads as
 * a blank story with no clue what went wrong, which is a bad way to lose an
 * afternoon.
 *
 * So the shell checks the template up front and catches anything the setup
 * throws, and renders the message in the story instead of leaving it empty. */
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

/** Wrap `slot` in the App Shell, same contract as pages/_shell's page(). */
export function aug19Page({ active, org = COMPANY.name, user = USER, components = {}, setup = () => ({}), slot = '' }) {
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
          return { fatal: '', nav: AUG19_NAV, ...setup(args) }
        } catch (err) {
          // Returned rather than rethrown: the v-if below swaps the whole page
          // for the message, so no binding the real markup expects is touched.
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
 * Event detail chrome — breadcrumb, title + status, the meta grid and the
 * event tab bar. Shared by the event-scoped screens. The consuming story's
 * setup must provide `evt` (see EVENT_* fixtures below) and a `tab` ref.
 */
export const eventHeader = `
  <div style="background:var(--ds-color-surface); padding:20px 32px 0;">
    <q-breadcrumbs active-color="primary" gutter="sm" class="text-body2 q-mb-sm">
      <template #separator><q-icon name="chevron_right" size="18px" color="grey-5" /></template>
      <q-breadcrumbs-el label="Events" />
      <q-breadcrumbs-el :label="evt.name" class="text-grey-6" />
    </q-breadcrumbs>

    <div class="row items-center q-gutter-md no-wrap">
      <div class="text-primary" style="font-size:1.75rem; font-weight:700; letter-spacing:-0.02em;">{{ evt.name }}</div>
      <!-- Status chip: the DS status pattern (Components › Typography & Content ›
           Chip → "Status" — dense + semantic color), plus a dropdown affordance. -->
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
