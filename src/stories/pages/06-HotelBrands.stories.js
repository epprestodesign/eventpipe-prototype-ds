/** PAGES / 06 Hotel Brands → compact resource-card list, recreated from production. */
import { page } from './_shell'
import DsPageToolbar from '../../components/DsPageToolbar.vue'
import DsStatus from '../../components/DsStatus.vue'

export default { title: 'Pages/06 Hotel Brands', tags: ['autodocs'], parameters: { layout: 'fullscreen' } }

const brands = [
  { name: "1840's Carrollton Inn", parent: 'INDEPENDENT OWNED PROPERTIES', subsidiary: true },
  { name: '19 Atlantic Hotel', parent: 'INDEPENDENT OWNED PROPERTIES', subsidiary: true },
  { name: '1 Hotels', parent: 'INDEPENDENT OWNED PROPERTIES', subsidiary: true },
  { name: '1 Onboarding blocker', parent: 'INDEPENDENT OWNED PROPERTIES', subsidiary: true },
  { name: '21 1/2 Boutique Hotel', parent: 'INDEPENDENT OWNED PROPERTIES', subsidiary: true },
  { name: '21c Museum Hotel', parent: 'INDEPENDENT OWNED PROPERTIES', subsidiary: true },
  { name: '3 Palms', parent: 'Sonesta - Red Lions Hotels', subsidiary: true },
  { name: '3 Palms', parent: '', subsidiary: false },
  { name: '402 Hotel', parent: 'INDEPENDENT OWNED PROPERTIES', subsidiary: true },
  { name: '402 Hotel - #the BigO', parent: 'INDEPENDENT OWNED PROPERTIES', subsidiary: true },
  { name: '816 Hotel', parent: 'INDEPENDENT OWNED PROPERTIES', subsidiary: true },
  { name: 'Above Property', parent: 'INDEPENDENT OWNED PROPERTIES', subsidiary: true },
  { name: 'Absecon Inn', parent: 'INDEPENDENT OWNED PROPERTIES', subsidiary: true },
  { name: 'ACCOR', parent: '', subsidiary: false },
]

export const HotelBrands = page({
  active: 'brands',
  components: { DsPageToolbar, DsStatus },
  setup: () => ({ brands }),
  slot: `
    <div style="padding:24px 28px 0; background:var(--ds-color-surface);">
      <ds-page-toolbar title="Hotel Brands">
        <template #search>
          <q-input outlined dense placeholder="Search" style="max-width:520px" hide-bottom-space>
            <template #append><q-icon name="search" /></template>
          </q-input>
        </template>
        <template #actions>
          <q-btn unelevated no-caps color="primary" label="Add New Brand" />
        </template>
      </ds-page-toolbar>
    </div>

    <div style="padding:20px 28px 28px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <div class="column q-gutter-md">
        <div v-for="(b, i) in brands" :key="i"
          style="display:flex; align-items:center; gap:20px; padding:18px 24px; background:var(--ds-color-surface); border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-lg);">
          <div style="flex:1; min-width:0;">
            <a href="#" class="text-primary" style="text-decoration:none; font-size:1.0625rem; font-weight:700;" @click.prevent>{{ b.name }}</a>
            <div v-if="b.parent" style="font-size:0.9375rem; margin-top:4px;"><span style="font-weight:700;">Parent Brand:</span> <span style="color:var(--ds-color-text-subtle);">{{ b.parent }}</span></div>
          </div>
          <ds-status v-if="b.subsidiary" variant="pill" tone="success" label="Subsidiary" />
          <q-btn flat round dense icon="more_horiz" color="grey-7" />
        </div>
      </div>
    </div>`,
})
