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
import { COMPANY, USER } from './_tmc2fixtures'

export const TMC2_NAV = [
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

/** Wrap `slot` in the App Shell, same contract as pages/_shell's page(). */
export function tmc2Page({ active, org = COMPANY.name, user = USER, components = {}, setup = () => ({}), slot = '' }) {
  return {
    render: (args) => ({
      components: { AppShell, ...components },
      setup: () => ({ nav: TMC2_NAV, ...setup(args) }),
      template: `
        <div style="height:100vh">
          <app-shell :items="nav" active="${active}" org="${org}" user="${user}" bleed>
            ${slot}
          </app-shell>
        </div>`,
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
