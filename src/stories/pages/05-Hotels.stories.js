/** PAGES / 05 Hotels → compact resource-card list, from production. */
import { page } from './_shell'
import DsPageToolbar from '../../components/DsPageToolbar.vue'
import DsStatus from '../../components/DsStatus.vue'
import DsThumbnail from '../../components/DsThumbnail.vue'

export default { title: 'Pages/05 Hotels', tags: ['autodocs'], parameters: { layout: 'fullscreen' } }

// Hotel imagery pulled from the hosted imagery repo (github.com/epprestodesign/presto-ds-imagery).
const IMG = 'https://epprestodesign.github.io/presto-ds-imagery'
const hotels = [
  { name: '106 Jefferson Huntsville, Curio Collection by Hilton', address: '106 Jefferson Street, Huntsville, AL, 35801', phone: '1-800-4458667', img: `${IMG}/exterior/exterior-1.jpg` },
  { name: '110th Boutique Hotel', address: '135 East 110th Street, New York, NY, 10029', phone: '1-718-3833704', img: `${IMG}/rooms/rooms-2.jpg` },
  { name: '112 Motel', address: '2001 Route 112, Medford, NY, 11763', phone: '1-631-4759260', img: `${IMG}/exterior/exterior-3.jpg` },
  { name: '115 Little Harbor Inn', address: '611 Destiny Dr, Ruskin, FL, 33570', phone: '8888470086', img: `${IMG}/views/views-4.jpg` },
  { name: '11 Howard, New York, a Member of Design Hotels', address: '11 Howard Street, New York, NY, 10013', phone: '1-212-235-1111', img: `${IMG}/exterior/exterior-7.jpg` },
  { name: '121 Hotel by AvantStay', address: '121 30TH AVENUE N, Nashville, TN, 37203', phone: '1-833-442-8268', img: `${IMG}/rooms/rooms-5.jpg` },
  { name: '1229 Apartments at Beachcomber Resort', address: '1229 South Ocean Boulevard, Pompano Beach, FL, 33062', phone: '1-954-941-7830', img: `${IMG}/pool/pool-1.jpg` },
]

export const Hotels = page({
  active: 'hotels',
  components: { DsPageToolbar, DsStatus, DsThumbnail },
  setup: () => ({ hotels }),
  slot: `
    <div style="padding:24px 28px 0; background:var(--ds-color-surface);">
      <ds-page-toolbar title="Hotels" :count="62528">
        <template #search>
          <q-input outlined dense placeholder="Search" style="max-width:520px" hide-bottom-space>
            <template #append><q-icon name="search" /></template>
          </q-input>
        </template>
        <template #actions>
          <q-btn flat no-caps color="primary" label="Clear Filters" />
          <q-btn outline no-caps color="primary" label="Filter" />
          <q-btn unelevated no-caps color="primary" label="New Hotel" />
        </template>
      </ds-page-toolbar>
    </div>

    <div style="padding:20px 28px 28px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <div class="column q-gutter-md">
        <div v-for="h in hotels" :key="h.name"
          style="display:flex; align-items:center; gap:20px; padding:16px 20px; background:var(--ds-color-surface); border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-lg);">
          <ds-thumbnail size="lg" :src="h.img" />
          <div style="flex:1; min-width:0;">
            <div class="row items-center q-gutter-sm">
              <a href="#" class="text-primary" style="text-decoration:none; font-size:1.0625rem; font-weight:700;" @click.prevent>{{ h.name }}</a>
              <ds-status variant="pill" label="Active" />
            </div>
            <div style="font-size:0.9375rem; margin-top:4px;"><span style="font-weight:700;">Hotel Address:</span> <span style="color:var(--ds-color-text-subtle);">{{ h.address }}</span></div>
            <div style="font-size:0.9375rem; margin-top:2px;"><span style="font-weight:700;">Hotel Phone:</span> <span style="color:var(--ds-color-text-subtle);">{{ h.phone }}</span></div>
          </div>
          <q-btn flat round dense icon="more_horiz" color="grey-7" />
        </div>
      </div>
    </div>`,
})
