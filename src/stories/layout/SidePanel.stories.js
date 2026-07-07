// LAYOUT / Side Panel — the standard slide-over chrome (scrim + sliding panel).
import { ref } from 'vue'
import DsSidePanel from '../../components/DsSidePanel.vue'
import DsListItem from '../../components/DsListItem.vue'

export default {
  title: 'Components/Actions/Side Panel',
  component: DsSidePanel,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: `
## Overview
**Side Panel** is the standard slide-over: a dimmed scrim + a panel that slides in
from a side, with a header (title + close), a scrollable body, and an optional
footer. It standardizes the cart fly-out, saved-hotels fly-out, and the profile
edit sheet. Controlled via \`v-model\`; closes on scrim-click or Esc (unless
\`persistent\`), and locks body scroll while open.

- \`side\` — \`right\` (default) / \`left\` / \`center\` (full-height sheet)
- Slots: default (body), \`footer\`, \`header-end\`

\`\`\`html
<ds-side-panel v-model="open" title="Order summary">
  …body…
  <template #footer><q-btn ... /></template>
</ds-side-panel>
\`\`\`
` } } },
}

export const RightDrawer = {
  name: 'Right drawer',
  render: () => ({
    components: { DsSidePanel, DsListItem },
    setup: () => ({ open: ref(true) }),
    template: `
      <div style="min-height:100vh;background:var(--ds-palette-neutral-100);padding:24px">
        <q-btn unelevated no-caps color="primary" label="Open panel" @click="open = true" />
        <ds-side-panel v-model="open" title="Order summary">
          <div style="display:flex;flex-direction:column;gap:10px;margin-top:8px">
            <ds-list-item title="Hampton Inn Boston-Logan" subtitle="3-star hotel" icon="hotel" chevron clickable />
            <ds-list-item title="The Concord Hotel" subtitle="4-star hotel" icon="hotel" chevron clickable />
          </div>
        </ds-side-panel>
      </div>`,
  }),
}

export const WithFooter = {
  name: 'With footer',
  render: () => ({
    components: { DsSidePanel },
    setup: () => ({ open: ref(true) }),
    template: `
      <div style="min-height:100vh;background:var(--ds-palette-neutral-100);padding:24px">
        <q-btn unelevated no-caps color="primary" label="Open panel" @click="open = true" />
        <ds-side-panel v-model="open" title="Edit profile">
          <p style="color:var(--ds-color-text-subtle)">Body content scrolls; the footer stays pinned.</p>
          <template #footer>
            <q-btn unelevated no-caps class="ds-btn--secondary" label="Cancel" style="border-radius:var(--ds-radius-pill);padding:0 18px;margin-right:10px" @click="open = false" />
            <q-btn unelevated no-caps color="primary" label="Save" style="border-radius:var(--ds-radius-pill);padding:0 22px" @click="open = false" />
          </template>
        </ds-side-panel>
      </div>`,
  }),
}

export const CenterSheet = {
  name: 'Center sheet',
  render: () => ({
    components: { DsSidePanel },
    setup: () => ({ open: ref(true) }),
    template: `
      <div style="min-height:100vh;background:var(--ds-palette-neutral-100);padding:24px">
        <q-btn unelevated no-caps color="primary" label="Open sheet" @click="open = true" />
        <ds-side-panel v-model="open" side="center" title="Basic information" width="640px">
          <p style="color:var(--ds-color-text-subtle)">A full-height centered sheet — used for focused edit forms.</p>
        </ds-side-panel>
      </div>`,
  }),
}
