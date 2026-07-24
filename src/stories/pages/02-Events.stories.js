/** PAGES / 02 Events → resource-card list archetype, recreated from production. */
import { ref } from 'vue'
import { page } from './_shell'
import DsPageToolbar from '../../components/DsPageToolbar.vue'
import DsStatus from '../../components/DsStatus.vue'
import DsStat from '../../components/DsStat.vue'
import DsThumbnail from '../../components/DsThumbnail.vue'
import DsPageHeader from '../../components/DsPageHeader.vue'
import DsInfoGrid from '../../components/DsInfoGrid.vue'

// Event logos from src/assets/events (auto-imported).
const eventLogos = Object.values(import.meta.glob('../../assets/events/*.{png,jpg,jpeg}', { eager: true, import: 'default' }))

export default { title: 'Pages/02 Events', tags: ['autodocs'], parameters: { layout: 'fullscreen' } }

const events = [
  { title: 'Bend Premier Cup | 2026', status: 'Active', location: 'Bend, OR', producer: '365 Sports Travel', dates: 'Fri, 07/10/2026 - Sun, 07/12/2026', release: 'All Closed', cutoff: 'Sat, 06/27/2026',
    stats: { peak: 0, res: 370, unconf: 2, nights: 846, blocks: 64, pending: 21 } },
  { title: 'AT | Jr Canes - Marlborough, MA | Tim - 7/16-19', status: 'Inactive', location: 'Raleigh, NC', producer: '365 Sports Travel', dates: 'Thu, 07/16/2026 - Sun, 07/19/2026', release: 'No Blocks', cutoff: 'No Hotels',
    stats: { peak: 0, res: 0, unconf: 0, nights: 0, blocks: 0, pending: 0 } },
  { title: 'Knights | Show-Me State Games | 2026 | 1st weekend', status: 'Active', location: 'Columbia, MO', producer: '365 Sports Travel', dates: 'Fri, 07/17/2026 - Sun, 07/19/2026', release: 'No Blocks', cutoff: 'No Hotels',
    stats: { peak: 0, res: 0, unconf: 0, nights: 0, blocks: 0, pending: 0 } },
  { title: 'AT | Bend FC - Oregon Super Cup - 8/7-9', status: 'Cancelled', location: 'Bend, OR', producer: '365 Sports Travel', dates: 'Fri, 08/07/2026 - Sun, 08/09/2026', release: 'No Blocks', cutoff: 'No Hotels',
    stats: { peak: 30, res: 0, unconf: 0, nights: 0, blocks: 0, pending: 0 } },
]

export const Events = page({
  active: 'events',
  components: { DsPageToolbar, DsStatus, DsStat, DsThumbnail },
  setup: () => ({ events, eventLogos, sort: ref('Earliest Start Date') }),
  slot: `
    <div style="padding:24px 28px 20px; background:var(--ds-color-surface);">
      <ds-page-toolbar title="Events" :count="106">
        <template #search>
          <div class="row items-center q-gutter-md no-wrap">
            <q-input outlined dense placeholder="Search" style="width:340px" hide-bottom-space>
              <template #append><q-icon name="search" /></template>
            </q-input>
            <div class="row items-center q-gutter-sm no-wrap">
              <span class="text-grey-7">Sort By</span>
              <q-select v-model="sort" :options="['Earliest Start Date','Latest Start Date','Name']" outlined dense style="width:200px" hide-bottom-space />
            </div>
          </div>
        </template>
        <template #actions>
          <q-btn outline no-caps color="primary" label="Filter" />
          <q-btn-dropdown split unelevated no-caps color="primary" label="New Event">
            <q-list><q-item clickable v-close-popup><q-item-section>Import Events</q-item-section></q-item></q-list>
          </q-btn-dropdown>
        </template>
        <template #filters>
          <span class="text-grey-7">Filter by:</span>
          <q-chip removable dense color="grey-3" text-color="dark">From: Tue, 07/07/2026</q-chip>
        </template>
      </ds-page-toolbar>
    </div>

    <div style="padding:20px 28px 28px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <div class="column q-gutter-md">
        <div v-for="(e, i) in events" :key="e.title"
          style="display:flex; gap:24px; padding:24px 28px; background:var(--ds-color-surface); border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-lg);">
          <ds-thumbnail size="xl" fit="contain" :src="eventLogos[i % eventLogos.length]" />
          <div style="flex:1 1 40%; min-width:0;">
            <div class="row items-center q-gutter-sm">
              <a href="#" class="text-primary" style="text-decoration:none; font-size:1.25rem; font-weight:700;" @click.prevent>{{ e.title }}</a>
              <ds-status variant="pill" :label="e.status" />
            </div>
            <div style="color:var(--ds-color-text-subtle); margin:4px 0 8px;">{{ e.location }}</div>
            <div v-for="m in [['Event Producer:', e.producer],['Start/End Dates:', e.dates],['Earliest Group Release Date:', e.release],['Latest Hotel Cutoff:', e.cutoff]]" :key="m[0]"
              style="display:flex; gap:6px; font-size:0.9375rem; margin-top:2px;">
              <span style="font-weight:700; color:var(--ds-color-text);">{{ m[0] }}</span>
              <span style="color:var(--ds-color-text-subtle);">{{ m[1] }}</span>
            </div>
          </div>
          <div style="flex:1 1 40%; display:grid; grid-template-columns:repeat(3,1fr); gap:16px 24px; align-content:start;">
            <ds-stat :value="e.stats.peak" label="Available on Peak" />
            <ds-stat :value="e.stats.res" label="Total Reservations" />
            <ds-stat :value="e.stats.unconf" label="Unconf. Reservations" />
            <ds-stat :value="e.stats.nights" label="Nights Booked" />
            <ds-stat :value="e.stats.blocks" label="Total Group Blocks" />
            <ds-stat :value="e.stats.pending" label="Pending Changes/Cxls" />
          </div>
          <div style="flex:none; display:flex; flex-direction:column; align-items:flex-end; justify-content:space-between;">
            <a href="#" class="row items-center text-primary" style="text-decoration:none; font-size:0.875rem; gap:4px;" @click.prevent><q-icon name="star_border" size="18px" />Favorite</a>
            <q-btn flat round dense icon="more_horiz" color="grey-7" />
          </div>
        </div>
      </div>
    </div>`,
})

/* ------------------------------------------------------------------------- *
 * Event detail → Reservations tab. Recreated from production with DS components
 * (DsPageHeader + DsInfoGrid + DsPageToolbar + DsStatus). All data is fake for a
 * demo event, "Bend Premier Cup | 2026". The Edit Event "…" overflow menu is wired
 * with the production action list.
 * ------------------------------------------------------------------------- */
const resMeta = [
  { label: 'City/State:', value: 'Bend, OR' },
  { label: 'Room Night Goal:', value: '1,200' },
  { label: 'Account Manager:', value: 'Alex Rivera' },
  { label: 'Event Producer:', value: 'Cascade Sports Group' },
  { label: 'Peak Night Goal:', value: '600' },
  { label: 'Stay to Play:', value: 'True' },
  { label: 'Start/End Dates:', value: 'Fri, 07/24/2026 - Sun, 07/26/2026' },
]

const eventTabs = ['Hotels', 'RFPs', 'Venues', 'Notes', 'Groups', 'Reservations', 'Waitlist', 'Pickup', 'Registration', 'Customize', 'Activity Logs']

// Production "…" overflow-menu actions next to Edit Event.
const moreMenu = [
  'Admin Booking Site', 'Admin Private Booking Site', 'Admin Comp Booking Site',
  'Guest Booking Site', 'Event Producer Info', 'Delete Event',
  'Enable Customer Changes', 'Send Pre Arrival Emails', 'Create Inventory Request',
]

const reservations = [
  { name: 'Anderson, Mark', phone: '(541) 382-1100', email: 'manderson@example.com', reservedOn: 'Sun, 01/04/2026 07:53 PM', origin: 'Contracted',
    hotel: 'Riverhouse on the Deschutes', addr: '3075 N Business 97, Bend, OR 97703', room: 'Two Queen Beds', dates: 'Thu, 07/23/2026 - Sun, 07/26/2026',
    conf: '40944890', confEdit: false, pipe: 'R-05146302', status: 'Canceled', tone: 'danger' },
  { name: 'Nguyen, Lisa', phone: '(541) 388-4000', email: 'lnguyen@example.com', reservedOn: 'Mon, 01/05/2026 08:16 PM', origin: 'Contracted',
    hotel: 'The Oxford Hotel Bend', addr: '10 NW Minnesota Ave, Bend, OR 97701', room: 'Two Queen Beds', dates: 'Wed, 07/22/2026 - Sun, 07/26/2026',
    conf: '88383943', confEdit: true, pipe: 'R-05150380', status: 'Processed', tone: 'success' },
  { name: 'Patel, Raj', phone: '(541) 317-8500', email: 'rpatel@example.com', reservedOn: 'Mon, 01/05/2026 09:56 PM', origin: 'Contracted',
    hotel: 'Hampton Inn & Suites Bend', addr: '730 SW Columbia St, Bend, OR 97702', room: 'Two Double Beds', dates: 'Thu, 07/23/2026 - Sun, 07/26/2026',
    conf: '3509745616', confEdit: true, pipe: 'R-05150889', status: 'Processed', tone: 'success' },
  { name: 'Thompson, Sarah', phone: '(541) 330-5000', email: 'sthompson@example.com', reservedOn: 'Mon, 01/05/2026 11:10 PM', origin: 'Contracted',
    hotel: 'SpringHill Suites Bend', addr: '551 SW Industrial Way, Bend, OR 97702', room: 'Two Double Beds', dates: 'Wed, 07/22/2026 - Sun, 07/26/2026',
    conf: '3499195314', confEdit: true, pipe: 'R-05151271', status: 'Processed', tone: 'success' },
  { name: 'Garcia, Miguel', phone: '(541) 382-8282', email: 'mgarcia@example.com', reservedOn: 'Wed, 01/07/2026 03:33 AM', origin: 'Contracted',
    hotel: 'DoubleTree by Hilton Bend', addr: '300 NW Franklin Ave, Bend, OR 97701', room: 'Two Queen Beds', dates: 'Wed, 07/22/2026 - Mon, 07/27/2026',
    conf: '71427560', confEdit: true, pipe: 'R-05158005', status: 'Processed', tone: 'success' },
  { name: 'Wilson, Emily', phone: '(541) 388-8000', email: 'ewilson@example.com', reservedOn: 'Wed, 01/07/2026 10:50 AM', origin: 'Contracted',
    hotel: 'Hilton Garden Inn Bend', addr: '425 SW Bluff Dr, Bend, OR 97702', room: 'Two Double Beds', dates: 'Thu, 07/23/2026 - Sun, 07/26/2026',
    conf: '', confEdit: false, pipe: 'R-05158604', status: 'Pending Cxl', tone: 'danger' },
]

export const Reservations = page({
  active: 'events',
  org: 'Team Travel Source (TTS)',
  user: 'Justin Girard',
  components: { DsPageHeader, DsInfoGrid, DsPageToolbar, DsStatus },
  setup: () => ({
    meta: resMeta, eventTabs, reservations, moreMenu,
    tab: ref('reservations'), sortField: ref('Create Date'), sortDir: ref('9-0 / Z-A'),
  }),
  slot: `
    <div style="padding:22px 32px 0; background:var(--ds-color-surface); border-bottom:1px solid var(--ds-color-border-container);">
      <ds-page-header title="Bend Premier Cup | 2026">
        <template #breadcrumb>
          <q-breadcrumbs active-color="primary" gutter="sm" class="text-body2">
            <template #separator><q-icon name="chevron_right" size="18px" color="grey-5" /></template>
            <q-breadcrumbs-el label="Events" />
            <q-breadcrumbs-el label="Bend Premier Cup | 2026" class="text-grey-6" />
          </q-breadcrumbs>
        </template>
        <template #badge>
          <q-btn dense no-caps unelevated color="positive" text-color="white" class="q-px-sm" style="border-radius:6px;">
            Active <q-icon name="arrow_drop_down" size="20px" />
          </q-btn>
        </template>
        <template #actions>
          <q-btn unelevated no-caps color="primary" label="Edit Event" />
          <q-btn flat round dense icon="more_horiz" color="grey-7">
            <q-menu anchor="bottom right" self="top right">
              <q-list style="min-width:250px">
                <q-item v-for="m in moreMenu" :key="m" clickable v-close-popup>
                  <q-item-section :class="m === 'Delete Event' ? 'text-negative' : 'text-grey-8'">{{ m }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </template>
        <template #meta><ds-info-grid :items="meta" min-col-width="300px" label-width="150px" /></template>
        <template #tabs>
          <q-tabs v-model="tab" no-caps active-color="primary" indicator-color="primary" align="left"
            class="text-grey-7" mobile-arrows outside-arrows>
            <q-tab v-for="t in eventTabs" :key="t" :name="t.toLowerCase().replace(/ /g,'-')" :label="t" />
          </q-tabs>
        </template>
      </ds-page-header>
    </div>

    <div style="padding:20px 32px 40px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <!-- Reservations toolbar -->
      <ds-page-toolbar title="Reservations">
        <template #search>
          <div style="display:flex; align-items:center; gap:16px; flex-wrap:nowrap;">
            <q-input outlined dense bg-color="white" placeholder="Search" style="width:300px" hide-bottom-space>
              <template #append><q-icon name="search" /></template>
            </q-input>
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:nowrap;">
              <span class="text-grey-7" style="white-space:nowrap;">Sort By</span>
              <q-select v-model="sortField" :options="['Create Date','Guest Name','Hotel','Check-In Date']" outlined dense bg-color="white" style="width:160px" hide-bottom-space />
              <q-select v-model="sortDir" :options="['9-0 / Z-A','0-9 / A-Z']" outlined dense bg-color="white" style="width:140px" hide-bottom-space />
            </div>
          </div>
        </template>
        <template #actions>
          <q-btn unelevated no-caps color="primary" label="Export" />
          <q-btn-dropdown outline no-caps color="primary" label="Filters">
            <q-list style="min-width:200px">
              <q-item clickable v-close-popup><q-item-section>Status</q-item-section></q-item>
              <q-item clickable v-close-popup><q-item-section>Hotel</q-item-section></q-item>
              <q-item clickable v-close-popup><q-item-section>Origin</q-item-section></q-item>
              <q-item clickable v-close-popup><q-item-section>Check-In Date</q-item-section></q-item>
            </q-list>
          </q-btn-dropdown>
        </template>
      </ds-page-toolbar>

      <!-- Reservation cards -->
      <div class="column q-gutter-md" style="margin-top:16px;">
        <div v-for="r in reservations" :key="r.pipe"
          style="display:flex; gap:24px; align-items:center; padding:22px 28px; background:var(--ds-color-surface); border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-lg);">
          <!-- Guest -->
          <div style="flex:1.3 1 0; min-width:0;">
            <a href="#" class="text-primary" style="text-decoration:none; font-weight:700; font-size:1.0625rem;" @click.prevent>{{ r.name }}</a>
            <div class="text-primary" style="font-size:0.8125rem;">{{ r.phone }}</div>
            <div style="font-size:0.875rem; margin-top:8px;"><span style="font-weight:700;">Email:</span> <span class="text-grey-8">{{ r.email }}</span></div>
            <div style="font-size:0.875rem;"><span style="font-weight:700;">Reserved On:</span> <span class="text-grey-8">{{ r.reservedOn }}</span></div>
            <div style="font-size:0.875rem;"><span style="font-weight:700;">Origin:</span> <span class="text-grey-8">{{ r.origin }}</span></div>
          </div>
          <div style="align-self:stretch; width:1px; flex:none; background:var(--ds-color-border-container);"></div>
          <!-- Hotel -->
          <div style="flex:1.5 1 0; min-width:0;">
            <div style="font-weight:700; color:var(--ds-color-text);">{{ r.hotel }}</div>
            <div class="text-grey-6" style="font-size:0.8125rem;">{{ r.addr }}</div>
            <div style="font-size:0.875rem; margin-top:8px;"><span style="font-weight:700;">Room Type:</span> <span class="text-grey-8">{{ r.room }}</span></div>
            <div style="font-size:0.875rem;"><span style="font-weight:700;">Check In/Out Date:</span> <span class="text-grey-8">{{ r.dates }}</span></div>
          </div>
          <div style="align-self:stretch; width:1px; flex:none; background:var(--ds-color-border-container);"></div>
          <!-- Hotel Confirmation -->
          <div style="flex:1 1 0; min-width:0;">
            <div class="row items-center no-wrap q-gutter-xs">
              <span style="font-weight:700; color:var(--ds-color-text);">{{ r.conf || '- -' }}</span>
              <q-icon v-if="r.confEdit" name="edit" size="14px" color="primary" />
            </div>
            <div class="text-grey-6" style="font-size:0.8125rem;">Hotel Confirmation</div>
          </div>
          <div style="align-self:stretch; width:1px; flex:none; background:var(--ds-color-border-container);"></div>
          <!-- Pipe ID -->
          <div style="flex:1 1 0; min-width:0;">
            <div style="font-weight:700; color:var(--ds-color-text);">{{ r.pipe }}</div>
            <div class="text-grey-6" style="font-size:0.8125rem;">Pipe ID</div>
            <div class="text-grey-6" style="font-size:0.8125rem; margin-top:8px;">Individual Reservation</div>
          </div>
          <!-- Status -->
          <div style="flex:none;">
            <ds-status variant="pill" :label="r.status" :tone="r.tone" />
          </div>
        </div>
      </div>
    </div>`,
})
Reservations.storyName = '6-reservations'
Reservations.parameters = { layout: 'fullscreen' }
