/** PAGES / 16 Webhooks → list page with empty state, recreated from production. */
import { page } from './_shell'
import DsPageToolbar from '../../components/DsPageToolbar.vue'

export default { title: 'Pages/16 Webhooks', tags: ['autodocs'], parameters: { layout: 'fullscreen' } }

export const Webhooks = page({
  active: 'webhooks',
  components: { DsPageToolbar },
  setup: () => ({}),
  slot: `
    <div style="padding:24px 28px 0; background:var(--ds-color-surface);">
      <ds-page-toolbar title="Event Webhooks" :count="0">
        <template #search>
          <q-input outlined dense placeholder="Search" style="max-width:360px" hide-bottom-space>
            <template #append><q-icon name="search" /></template>
          </q-input>
        </template>
        <template #actions>
          <q-btn unelevated no-caps color="primary" label="Add Event Webhook" />
        </template>
      </ds-page-toolbar>
    </div>

    <div style="padding:20px 28px 28px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; padding:80px 28px; background:var(--ds-color-surface); border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-lg);">
        <q-icon name="webhook" size="56px" color="primary" />
        <div style="font-size:1.25rem; font-weight:700; color:var(--ds-color-text); margin-top:8px;">No webhooks found</div>
        <div style="color:var(--ds-color-text-subtle);">Once you create a webhook, it will appear here.</div>
      </div>
    </div>`,
})
