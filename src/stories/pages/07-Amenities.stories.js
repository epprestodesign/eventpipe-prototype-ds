/** PAGES / 07 Amenities → compact resource-card list, recreated from production. */
import { page } from './_shell'
import DsPageToolbar from '../../components/DsPageToolbar.vue'

export default { title: 'Pages/07 Amenities', tags: ['autodocs'], parameters: { layout: 'fullscreen' } }

const amenities = [
  { name: '100% Smoke-Free Hotel', icon: 'smoke_free' },
  { name: 'Apartment Style', icon: 'apartment' },
  { name: 'Arcade', icon: 'sports_esports' },
  { name: 'ATM On-site', icon: 'local_atm' },
  { name: 'Baggage Storage', icon: 'luggage' },
  { name: 'Bakery On-Site', icon: 'bakery_dining' },
  { name: 'Banquet Space', icon: 'celebration' },
  { name: 'Batting Cages', icon: 'sports_baseball' },
  { name: 'Beachfront', icon: 'beach_access' },
  { name: 'Bicycle Rentals', icon: 'directions_bike' },
  { name: 'Bowling Alley', icon: 'sports_score' },
]

export const Amenities = page({
  active: 'amenities',
  components: { DsPageToolbar },
  setup: () => ({ amenities }),
  slot: `
    <div style="padding:24px 28px 0; background:var(--ds-color-surface);">
      <ds-page-toolbar title="Amenities" :count="78">
        <template #search>
          <q-input outlined dense placeholder="Search" style="max-width:520px" hide-bottom-space>
            <template #append><q-icon name="search" /></template>
          </q-input>
        </template>
        <template #actions>
          <q-btn unelevated no-caps color="primary" label="Add New Amenity" />
        </template>
      </ds-page-toolbar>
    </div>

    <div style="padding:20px 28px 28px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <div class="column q-gutter-md">
        <div v-for="a in amenities" :key="a.name"
          style="display:flex; align-items:center; gap:20px; padding:16px 20px; background:var(--ds-color-surface); border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-lg);">
          <span style="display:inline-flex; align-items:center; justify-content:center; width:48px; height:48px; flex:none; border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-md); background:var(--ds-color-surface-sunken);">
            <q-icon :name="a.icon" size="26px" color="grey-9" />
          </span>
          <div style="flex:1; min-width:0;">
            <a href="#" class="text-primary" style="text-decoration:none; font-size:1.0625rem; font-weight:700;" @click.prevent>{{ a.name }}</a>
          </div>
          <q-btn flat round dense icon="more_horiz" color="grey-7" />
        </div>
      </div>
    </div>`,
})
