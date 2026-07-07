/** PAGES / 09 Venues → resource-card list archetype, recreated from production. */
import { page } from './_shell'
import DsPageToolbar from '../../components/DsPageToolbar.vue'

export default { title: 'Pages/09 Venues', tags: ['autodocs'], parameters: { layout: 'fullscreen' } }

const venues = [
  { name: '60 Acres Soccer Complex', address: '15200 NE 116th St, Redmond, WA 98052', phone: '' },
  { name: 'ADVENTHEALTH CENTER ICE', address: '3173 CYPRESS RIDGE BLVD, WESLEY CHAPEL, FL 33544', phone: '' },
  { name: 'AHN Sports Complex at Cool Springs', address: '3001 Cool Springs Dr, Pittsburgh, PA 15234', phone: '' },
  { name: 'AJ McClung Memorial Stadium', address: '400 4th St, Columbus, GA 31901', phone: '' },
  { name: 'ATLANTA ICE HOUSE', address: '2600 PRADO LANE, MARIETTA, GA 30066', phone: '' },
  { name: 'Addison Ice Arena', address: '475 S Grace St,, Addison,, IL 60101', phone: '' },
  { name: 'Adrienne C. Nelson High School', address: '14897 Southeast Parklane Drive, Happy Valley, OR 97015', phone: '' },
  { name: 'AffinityPlex Indoor Soccer Centre', address: '1700 Elphinstone St,, Regina, SK S4T3W4', phone: '(130) 635-2804' },
  { name: "Afrim's Sports Complex", address: '969 Watervliet Shaker Rd, Colonie, NY 12205', phone: '' },
  { name: 'Allen Creek Soccer', address: '2500 Allen Creek Rd, Gainesville, GA 30507', phone: '' },
  { name: 'American Legion Park', address: '850 SW Rimrock Way, Redmond, OR 97756', phone: '(541) 548-7275' },
  { name: 'American University', address: '4400 Massachusetts Ave NW, Washington, DC 20016', phone: '' },
]

export const Venues = page({
  active: 'venues',
  components: { DsPageToolbar },
  setup: () => ({ venues }),
  slot: `
    <div style="padding:24px 28px 0; background:var(--ds-color-surface);">
      <ds-page-toolbar title="Venues" :count="545">
        <template #search>
          <q-input outlined dense placeholder="Search" style="max-width:520px" hide-bottom-space>
            <template #append><q-icon name="search" /></template>
          </q-input>
        </template>
        <template #actions>
          <q-btn unelevated no-caps color="primary" label="New Venue" />
        </template>
      </ds-page-toolbar>
    </div>

    <div style="padding:20px 28px 28px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <div class="column q-gutter-md">
        <div v-for="v in venues" :key="v.name"
          style="display:flex; align-items:center; gap:20px; padding:18px 22px; background:var(--ds-color-surface); border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-lg);">
          <span style="flex:none; width:48px; height:48px; border-radius:50%; background:var(--ds-color-primary, #2f6bff); display:inline-flex; align-items:center; justify-content:center;">
            <q-icon name="place" color="white" size="24px" />
          </span>
          <div style="flex:1; min-width:0;">
            <div style="font-size:1.0625rem; font-weight:700; color:var(--ds-color-text);">{{ v.name }}</div>
            <div style="font-size:0.9375rem; margin-top:2px; color:var(--ds-color-text-subtle);">{{ v.address }}</div>
          </div>
          <div v-if="v.phone" class="row items-center" style="gap:6px; color:var(--ds-color-primary, #2f6bff); font-size:0.9375rem; white-space:nowrap;">
            <q-icon name="phone" size="18px" />{{ v.phone }}
          </div>
          <q-btn flat round dense icon="more_horiz" color="grey-7" />
        </div>
      </div>
    </div>`,
})
