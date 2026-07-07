/** PAGES / 02 Events → resource-card list archetype, recreated from production. */
import { ref } from 'vue'
import { page } from './_shell'
import DsPageToolbar from '../../components/DsPageToolbar.vue'
import DsStatus from '../../components/DsStatus.vue'
import DsStat from '../../components/DsStat.vue'
import DsThumbnail from '../../components/DsThumbnail.vue'

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
