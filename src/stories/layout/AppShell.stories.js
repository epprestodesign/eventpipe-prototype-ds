/** LAYOUT / App Shell → custom AppShell.vue (sidebar + AppBar + content canvas) */
import { ref } from 'vue'
import AppShell from '../../components/AppShell.vue'
import DsPageHeader from '../../components/DsPageHeader.vue'
import DsInfoGrid from '../../components/DsInfoGrid.vue'

export default {
  title: 'App Chrome/App Shell',
  component: AppShell,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: `
## Overview
The primary application scaffold: a fixed **dark navy sidebar**
(\`--ds-color-surface-sidebar\` = #00123D) with the EventPipe logo, primary nav,
and a pinned **Company Settings** footer — beside a main column built from the
**App Bar** and a content canvas (\`--ds-color-surface-canvas\` = #F8F9FA) holding
an elevated white panel (\`--ds-shadow-2\`, elevation level 2).

## Anatomy
- **Sidebar** — brand header, scrollable nav (\`items\`), footer action.
- **App Bar** — org switcher, search, user menu (see **Navigation / App Bar**).
- **Content** — the default slot renders inside the elevated panel.

## Elevation
The app bar reads as level 1 (\`--ds-shadow-1\`); the content panel reads as level
2 (\`--ds-shadow-2\`) — the same token the DS card uses.
` } },
  },
  argTypes: {
    active: { control: 'text' },
    org: { control: 'text' },
    user: { control: 'text' },
  },
}

const frame = (inner) => ({
  components: { AppShell },
  setup: () => ({ args: inner.args }),
  template: `
    <div style="height: 100vh;">
      <app-shell v-bind="args" @navigate="(k) => (args.active = k)">
        ${inner.slot || ''}
      </app-shell>
    </div>`,
})

export const Default = {
  render: (args) => ({
    ...frame({
      args,
      slot: `
        <div style="padding: 24px 28px;">
          <q-breadcrumbs active-color="primary" gutter="sm" class="text-body2">
            <template #separator><q-icon name="chevron_right" size="18px" color="grey-5" /></template>
            <q-breadcrumbs-el label="Inventory Requests" />
            <q-breadcrumbs-el label="REQUEST # R-00081527" class="text-grey-6" />
          </q-breadcrumbs>
        </div>`,
    }),
  }),
  args: { active: 'inventory', org: 'Team Travel Source', user: 'Mike Addesa' },
}

/* --- Full Inventory Request detail page, built entirely from DS components --- */
const IR_META = [
  { label: 'Created by:', value: 'Justin Girard' },
  { label: 'Hotel Name:', value: 'Best Western Plus Normandy Inn & Suites' },
  { label: 'Event Name:', value: 'USAV Boys Junior National Championships (BJNC)' },
  { label: 'Assigned to:', value: 'Josh Silverberg' },
  { label: 'Hotel Contact:', value: "R'Donn Robinson (test@test.com)" },
  { label: 'Event Start Date:', value: 'Fri, 04/11/2025' },
  { label: 'Request Created:', value: 'Tue, 04/01/2025 09:45 AM EST' },
  { label: 'Pipe ID:', value: 'PIPE-355872' },
  { label: 'Event End Date:', value: 'Sun, 04/13/2025' },
  { label: 'Request ID:', value: 'R-00081527' },
  { label: 'Group Block ID:', value: 'GB-BJNC-NORMANDY-01' },
  { label: 'Watchers:', value: '2 users' },
]
const ROOM_COLS = [
  { name: 'date', label: 'Date', field: 'date', align: 'left' },
  { name: 'orig', label: 'Original # of Rooms', field: 'orig', align: 'left' },
  { name: 'req', label: 'Requested Rooms', field: 'req', align: 'left' },
  { name: 'contract', label: 'Contracted Rate', field: 'contract', align: 'left' },
  { name: 'offer', label: 'Offered Rate', field: 'offer', align: 'left' },
  { name: 'total', label: 'Total Rooms', field: 'total', align: 'left' },
]
const ROOM_ROWS = [
  { date: 'Thu, 01/01/2026', orig: 10, req: 5, contract: '$110.00', offer: '$110.00', total: 15 },
  { date: 'Fri, 01/02/2026', orig: 10, req: 5, contract: '$110.00', offer: '$110.00', total: 15 },
  { date: 'Sat, 01/03/2026', orig: 10, req: 5, contract: '$110.00', offer: '$110.00', total: 15 },
]
const ACT_COLS = [
  { name: 'dt', label: 'Date/ Time', field: 'dt', align: 'left' },
  { name: 'user', label: 'User', field: 'user', align: 'left' },
  { name: 'activity', label: 'Activity', field: 'activity', align: 'left' },
]
const ACT_ROWS = [
  { dt: 'Mon, 01/27/2026 10:15 AM EST', user: 'Scott Villemain', activity: 'Inventory Request closed R-00081527' },
]

export const WithContent = {
  parameters: { docs: { description: { story: 'A full Inventory Request detail page composed entirely from DS components — App Shell, Page Header, Info Grid, Breadcrumbs, Tabs, Buttons, and two Table variants.' } } },
  render: (args) => ({
    components: { AppShell, DsPageHeader, DsInfoGrid },
    setup: () => ({ args, meta: IR_META, tab: ref('details'), roomCols: ROOM_COLS, roomRows: ROOM_ROWS, actCols: ACT_COLS, actRows: ACT_ROWS }),
    template: `
    <div style="height:100vh">
      <app-shell v-bind="args" @navigate="(k) => (args.active = k)">
        <div style="display:flex; flex-direction:column;">

          <!-- Page header (white) -->
          <div style="padding:20px 28px 0;">
            <ds-page-header title="BJNC 2025 – Best Western Plus Normandy – Inventory Request" badge="Approved by Hotel" badge-color="positive">
              <template #breadcrumb>
                <q-breadcrumbs active-color="primary" gutter="sm" class="text-body2">
                  <template #separator><q-icon name="chevron_right" size="18px" color="grey-5" /></template>
                  <q-breadcrumbs-el label="Inventory Requests" />
                  <q-breadcrumbs-el label="REQUEST # R-00081527" class="text-grey-6" />
                </q-breadcrumbs>
              </template>
              <template #actions>
                <q-btn outline no-caps color="primary" label="Duplicate" />
                <q-btn unelevated no-caps color="primary" label="Edit" />
              </template>
              <template #meta><ds-info-grid :items="meta" min-col-width="320px" label-width="120px" /></template>
              <template #tabs>
                <q-tabs v-model="tab" no-caps active-color="primary" indicator-color="primary" align="left" class="text-grey-7">
                  <q-tab name="details" label="Request Details" />
                  <q-tab name="notes" label="Notes" />
                  <q-tab name="activity" label="Activity Log" />
                </q-tabs>
              </template>
            </ds-page-header>
          </div>

          <!-- Tab content (sunken grey) -->
          <div style="background:var(--ds-color-surface-sunken); padding:20px 28px 28px;">
            <div class="row justify-end q-gutter-sm q-mb-md">
              <q-btn outline no-caps color="primary" label="Mark Guest Notified" />
              <q-btn outline no-caps color="negative" label="Mark Not Fulfilled" />
            </div>

            <div style="background:var(--ds-color-surface); border:1px solid var(--ds-color-border); border-radius:var(--ds-radius-lg); padding:28px;">
              <h2 style="margin:0 0 18px; font-size:1.375rem; font-weight:700; color:var(--ds-color-text);">Proposed Inventory Changes</h2>

              <!-- Request Details callout -->
              <div style="background:var(--ds-color-surface-sunken); border-radius:var(--ds-radius-md); padding:16px 18px; margin-bottom:24px;">
                <div style="font-weight:700; margin-bottom:6px;">Request Details:</div>
                <p style="margin:0; color:var(--ds-color-text-subtle); line-height:1.5;">Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Maecenas sed diam eget risus varius blandit sit amet non magna. Cras mattis consectetur purus sit amet fermentum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh.</p>
              </div>

              <div style="font-style:italic; font-weight:700; color:var(--ds-color-text-brand); margin-bottom:12px;">Two Queen Beds, Suite, 2 Queen Beds, Non Smoking</div>

              <q-table class="ds-table ds-table--muted q-mb-lg" :rows="roomRows" :columns="roomCols" row-key="date" flat hide-bottom :pagination="{ rowsPerPage: 0 }" />

              <!-- Completed callout -->
              <div style="display:flex; align-items:center; gap:12px; border:1px solid var(--ds-color-border); border-radius:var(--ds-radius-md); background:var(--ds-color-surface-sunken); padding:14px 18px; margin-bottom:28px;">
                <q-icon name="add_circle_outline" size="22px" style="color:var(--ds-color-text-subtle);" />
                <div style="font-style:italic;">
                  <div style="font-weight:700; color:var(--ds-color-text);">Add Approved Rooms to Event Inventory</div>
                  <div style="color:var(--ds-color-text-subtle); font-size:0.875rem;">Completed on Monday, January 27th, 2026</div>
                </div>
              </div>

              <h3 style="margin:0 0 14px; font-size:1.25rem; font-weight:700; color:var(--ds-color-text);">Activity</h3>
              <q-table class="ds-table" :rows="actRows" :columns="actCols" row-key="dt" flat hide-bottom :pagination="{ rowsPerPage: 0 }" />
            </div>
          </div>
        </div>
      </app-shell>
    </div>`,
  }),
  args: { active: 'inventory', org: 'Team Travel Source', user: 'Mike Addesa' },
}
