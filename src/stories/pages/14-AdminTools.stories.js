/** PAGES / 14 Admin Tools → action-card list archetype, recreated from production. */
import { page } from './_shell'

export default { title: 'Pages/14 Admin Tools', tags: ['autodocs'], parameters: { layout: 'fullscreen' } }

const tools = [
  { title: 'Hotel Loading Tool', desc: 'This tool searches external sources for hotel metadata and compares it to hotels already in EventPipe.', icon: 'apartment', action: 'Find Hotels' },
  { title: 'Support Manager', desc: 'Run database tasks.', icon: 'apartment', action: 'Go to Manager' },
]

export const AdminTools = page({
  active: 'admin',
  setup: () => ({ tools }),
  slot: `
    <div style="padding:28px 28px 40px;">
      <h1 style="margin:0 0 24px; font-size:1.5rem; font-weight:700; color:var(--ds-color-text);">Tools</h1>
      <div class="column q-gutter-md">
        <div v-for="t in tools" :key="t.title"
          style="display:flex; align-items:center; gap:20px; padding:24px 28px; background:var(--ds-color-surface); border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-lg);">
          <q-icon :name="t.icon" size="36px" color="primary" style="flex:none;" />
          <div style="flex:1; min-width:0;">
            <div style="font-size:1.25rem; font-weight:700; color:var(--ds-color-text); margin-bottom:4px;">{{ t.title }}</div>
            <div style="color:var(--ds-color-text-subtle); line-height:1.5;">{{ t.desc }}</div>
          </div>
          <q-btn unelevated no-caps color="primary" :label="t.action" style="flex:none;" />
        </div>
      </div>
    </div>`,
})
