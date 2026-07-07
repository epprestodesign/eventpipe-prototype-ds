/** PAGES / 12 Requests → multi-column resource-card list, from production. */
import { ref } from 'vue'
import { page } from './_shell'
import DsPageToolbar from '../../components/DsPageToolbar.vue'
import DsStatus from '../../components/DsStatus.vue'

export default { title: 'Pages/12 Requests', tags: ['autodocs'], parameters: { layout: 'fullscreen' } }

const requests = [
  { hotel: 'Embassy Suites Greensboro-Airport', loc: '204 Centreport Drive, NC - 13.39 Miles from primary venue.', event: 'Adidas Clash | Boys 2026', rfp: 'Adidas Clash | Boys 2026', manager: 'Scott Gartner', status: 'Negotiating', tone: 'warning', contact: 'Damara Gomez, (damara.gomez@atriumhos…', received: 'Wed, 07/09/2025 - 2…' },
  { hotel: 'Homewood Suites by Hilton Greensboro', loc: '201 Centreport Drive, NC - 13.42 Miles from primary venue.', event: 'Adidas Clash | Boys 2026', rfp: 'Adidas Clash | Boys 2026', manager: 'Scott Gartner', status: 'In Proposal', tone: 'warning', contact: 'Damara Gomez, (damara.gomez@atriumhos…', received: 'Wed, 07/09/2025 - 2…' },
  { hotel: 'Embassy Suites Greensboro-Airport', loc: '204 Centreport Drive, NC - 13.39 Miles from primary venue.', event: 'Labor Day Shootout 2026', rfp: 'Labor Day Shootout 2026', manager: 'Kristen Sasso', status: 'Contract Pending', tone: 'warning', contact: 'Damara Gomez, (damara.gomez@atriumhos…', received: 'Wed, 07/09/2025 - 2…' },
  { hotel: 'Aloft Wilmington at Coastline Center', loc: '501 NUTT STREET, NC - 2.66 Miles from primary venue.', event: 'AT | Skyline Elite ECNL B Wilmington 9/26-27', rfp: 'Skyline Elite ECNL B Wilmington 9/26-27', manager: 'Mackenzie Hellsten', status: 'Not Sent', tone: 'neutral', contact: 'Laura Clark, (laura.clark2@marriott.com)', received: '— —' },
  { hotel: 'Best Western Plus Coastline Inn', loc: '503 Nutt St, NC - 2.69 Miles from primary venue.', event: 'AT | Skyline Elite ECNL B Wilmington 9/26-27', rfp: 'Skyline Elite ECNL B Wilmington 9/26-27', manager: 'Mackenzie Hellsten', status: 'Opened', tone: 'info', contact: 'Mackenzie Hellsten, (mackenzie.hellsten@g…', received: 'Thu, 08/07/2025 - 1…' },
]

export const Requests = page({
  active: 'requests',
  components: { DsPageToolbar, DsStatus },
  setup: () => ({ requests, sort: ref('Decision Date'), order: ref('0-9 / A-Z') }),
  slot: `
    <div style="padding:24px 28px 0; background:var(--ds-color-surface);">
      <ds-page-toolbar title="Requests" :count="1843">
        <template #search>
          <div class="row items-center q-gutter-md no-wrap">
            <q-input outlined dense placeholder="Search" style="width:320px" hide-bottom-space>
              <template #append><q-icon name="search" /></template>
            </q-input>
            <div class="row items-center q-gutter-sm no-wrap">
              <span class="text-grey-7">Sort By</span>
              <q-select v-model="sort" :options="['Decision Date','Received Date','Hotel Name']" outlined dense style="width:170px" hide-bottom-space />
              <q-select v-model="order" :options="['0-9 / A-Z','Z-A / 9-0']" outlined dense style="width:140px" hide-bottom-space />
            </div>
          </div>
        </template>
        <template #actions><q-btn outline no-caps color="primary" label="Filter" /></template>
        <template #filters>
          <span class="text-grey-7">Filtered by:</span>
          <q-chip removable dense color="grey-3" text-color="dark">Event Date From: Tue, 07/07/2026</q-chip>
        </template>
      </ds-page-toolbar>
    </div>

    <div style="padding:20px 28px 28px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <div class="column q-gutter-md">
        <div v-for="(r, i) in requests" :key="i"
          style="background:var(--ds-color-surface); border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-lg);">
          <div style="display:flex; gap:24px; padding:20px 24px;">
            <div style="flex:1 1 42%; min-width:0;">
              <a href="#" class="text-primary" style="text-decoration:none; font-size:1.0625rem; font-weight:700;" @click.prevent>{{ r.hotel }}</a>
              <div style="color:var(--ds-color-text-subtle); font-size:0.875rem; margin:2px 0;">{{ r.loc }}</div>
              <div style="font-size:0.9375rem;"><span style="font-weight:700;">Event Name:</span> <span style="color:var(--ds-color-text-subtle);">{{ r.event }}</span></div>
            </div>
            <div style="flex:1 1 42%; min-width:0;">
              <div style="font-size:0.9375rem;"><span style="font-weight:700;">RFP Name:</span> <span style="color:var(--ds-color-text-subtle);">{{ r.rfp }}</span></div>
              <div style="font-size:0.9375rem; margin-top:4px;"><span style="font-weight:700;">Account Manager:</span> <span style="color:var(--ds-color-text-subtle);">{{ r.manager }}</span></div>
            </div>
            <div style="flex:none; display:flex; align-items:center; gap:12px;">
              <ds-status variant="pill" :label="r.status" :tone="r.tone" />
              <q-btn outline no-caps color="primary" label="View More" />
            </div>
          </div>
          <q-separator />
          <div style="display:flex; justify-content:space-between; gap:16px; padding:12px 24px; font-size:0.9375rem;">
            <div><span style="font-weight:700;">Hotel Contact:</span> <span style="color:var(--ds-color-text-subtle);">{{ r.contact }}</span></div>
            <div><span style="font-weight:700;">Received on:</span> <span style="color:var(--ds-color-text-subtle);">{{ r.received }}</span></div>
          </div>
        </div>
      </div>
    </div>`,
})
