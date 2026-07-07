/** PAGES / 15 Pipe Tools → action-card (navigation) list archetype, from production. */
import { page } from './_shell'
import DsPageToolbar from '../../components/DsPageToolbar.vue'

export default { title: 'Pages/15 Pipe Tools', tags: ['autodocs'], parameters: { layout: 'fullscreen' } }

const tools = [
  { title: 'Contract Template Management', icon: 'description' },
  { title: 'Event Hotel User Management', icon: 'manage_accounts' },
  { title: 'Rewards Member Management', icon: 'badge' },
  { title: 'Waitlist Management', icon: 'hourglass_empty' },
  { title: 'Bulk Move Reservation', icon: 'swap_horiz' },
]

export const PipeTools = page({
  active: 'pipe',
  components: { DsPageToolbar },
  setup: () => ({ tools }),
  slot: `
    <div style="padding:24px 28px 0; background:var(--ds-color-surface);">
      <ds-page-toolbar title="Pipe Tools" />
    </div>

    <div style="padding:20px 28px 28px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <div class="column q-gutter-md" style="max-width:620px;">
        <a v-for="t in tools" :key="t.title" href="#" @click.prevent
          style="display:flex; align-items:center; gap:18px; padding:20px 24px; text-decoration:none; background:var(--ds-color-surface); border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-lg);">
          <q-icon :name="t.icon" size="26px" color="primary" style="flex:none;" />
          <span style="font-size:1.125rem; font-weight:500; color:var(--ds-color-text);">{{ t.title }}</span>
        </a>
      </div>
    </div>`,
})
