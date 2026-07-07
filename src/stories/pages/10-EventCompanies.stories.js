/** PAGES / 10 Event Companies → resource-card list archetype, recreated from production. */
import { page } from './_shell'
import DsPageToolbar from '../../components/DsPageToolbar.vue'
import DsThumbnail from '../../components/DsThumbnail.vue'
import logo365 from '../../assets/logo/365Logo_Horizontal.png'

export default { title: 'Pages/10 Event Companies', tags: ['autodocs'], parameters: { layout: 'fullscreen' } }

const companies = [
  { name: '365 Sports Travel', location: 'Browns Summit, NC', contact: 'Kristen Sasso, (execute@365sportstravel.com), (000) 000-0000', logo: logo365 },
]

export const EventCompanies = page({
  active: 'event-companies',
  components: { DsPageToolbar, DsThumbnail },
  setup: () => ({ companies }),
  slot: `
    <div style="padding:24px 28px 0; background:var(--ds-color-surface);">
      <ds-page-toolbar title="Event Companies" :count="1">
        <template #search>
          <q-input outlined dense placeholder="Search" style="max-width:520px" hide-bottom-space>
            <template #append><q-icon name="search" /></template>
          </q-input>
        </template>
        <template #actions>
          <q-btn unelevated no-caps color="primary" label="Add Event Company" />
        </template>
      </ds-page-toolbar>
    </div>

    <div style="padding:20px 28px 28px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <div class="column q-gutter-md">
        <div v-for="c in companies" :key="c.name"
          style="display:flex; align-items:center; gap:20px; padding:20px 24px; background:var(--ds-color-surface); border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-lg);">
          <ds-thumbnail size="lg" :rounded="false" fit="contain" :src="c.logo" />
          <div style="flex:1; min-width:0;">
            <a href="#" class="text-primary" style="text-decoration:none; font-size:1.0625rem; font-weight:700;" @click.prevent>{{ c.name }}</a>
            <div style="font-size:0.9375rem; margin-top:2px; color:var(--ds-color-text-subtle);">{{ c.location }}</div>
            <div style="font-size:0.9375rem; margin-top:4px;"><span style="font-weight:700; color:var(--ds-color-text);">Contact:</span> <span style="color:var(--ds-color-text-subtle);">{{ c.contact }}</span></div>
          </div>
          <q-btn flat round dense icon="more_horiz" color="grey-7" />
        </div>
      </div>
    </div>`,
})
