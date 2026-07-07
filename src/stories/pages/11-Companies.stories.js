/** PAGES / 11 Companies → compact resource-card list, from production. */
import { page } from './_shell'
import DsPageToolbar from '../../components/DsPageToolbar.vue'
import DsThumbnail from '../../components/DsThumbnail.vue'

// Company logos from the partner-logo set (github.com/epprestodesign/presto-ds-imagery
// batch), auto-imported. Skips the TTS duplicate.
const companyLogos = Object.entries(import.meta.glob('../../assets/logo/batch_070726/*.{png,jpg,jpeg}', { eager: true, import: 'default' }))
  .filter(([path]) => !path.includes('TTS-Logo-e1749152469615'))
  .map(([, src]) => src)

export default { title: 'Pages/11 Companies', tags: ['autodocs'], parameters: { layout: 'fullscreen' } }

const companies = [
  { name: '288 Sports Group LLC', location: 'Richmond, VA', website: 'https://www.288travel.com' },
  { name: '365 Sports Travel', location: 'Brown Summit, NC', website: 'https://365sportstravel.com/' },
  { name: '3UP Sports', location: 'Kelowna, BC', website: 'www.3UPSports.com' },
  { name: '435 Housing', location: 'Overland Park, KS', website: 'https://435housing.com' },
  { name: '5 Star Sports', location: 'City, AL', website: 'http://5starsportsleague.com' },
  { name: '804 Travel LLC', location: 'Richmond, VA', website: 'http://804travel.com/' },
  { name: 'Absolut Sport', location: 'La Palma, CA', website: 'us.absolut-sport.com' },
  { name: 'Academy of Management', location: 'Valhalla, NY', website: 'https://www.aom.org/' },
  { name: 'Albuquerque International Balloon Fiesta, Inc', location: 'Albuquerque, NM', website: 'https://www.balloonfiesta.com/' },
  { name: 'Ashton Conference Planning', location: 'Ashton, MD', website: 'https://ashtonconferenceplanning.com/' },
]

export const Companies = page({
  active: 'companies',
  components: { DsPageToolbar, DsThumbnail },
  setup: () => ({ companies, companyLogos }),
  slot: `
    <div style="padding:24px 28px 0; background:var(--ds-color-surface);">
      <ds-page-toolbar title="Companies" :count="176">
        <template #search>
          <q-input outlined dense placeholder="Search" style="max-width:520px" hide-bottom-space>
            <template #append><q-icon name="search" /></template>
          </q-input>
        </template>
        <template #actions>
          <q-btn unelevated no-caps color="primary" label="Add Company" />
        </template>
      </ds-page-toolbar>
    </div>

    <div style="padding:20px 28px 28px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <div class="column q-gutter-md">
        <div v-for="(c, i) in companies" :key="c.name"
          style="display:flex; align-items:center; gap:20px; padding:16px 20px; background:var(--ds-color-surface); border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-lg);">
          <ds-thumbnail size="lg" fit="contain" :src="companyLogos[i % companyLogos.length]" />
          <div style="flex:1; min-width:0;">
            <a href="#" class="text-primary" style="text-decoration:none; font-size:1.0625rem; font-weight:700;" @click.prevent>{{ c.name }}</a>
            <div style="color:var(--ds-color-text-subtle); font-size:0.9375rem; margin-top:2px;">{{ c.location }}</div>
            <div style="font-size:0.9375rem; margin-top:2px;"><span style="font-weight:700;">Website:</span> <span style="color:var(--ds-color-text-subtle);">{{ c.website }}</span></div>
          </div>
          <q-btn flat round dense icon="more_horiz" color="grey-7" />
        </div>
      </div>
    </div>`,
})
