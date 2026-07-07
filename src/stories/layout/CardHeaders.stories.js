/** APPLICATION COMPONENTS / Card Headers → DsCard + DsSectionHeader header rows. */
import DsSectionHeader from '../../components/DsSectionHeader.vue'

export default {
  title: 'Components/Layout & Structure/Card Headers',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
Header rows for cards and panels — title (+ optional subtitle) with trailing
actions or a menu. Built from **Section Header** inside a card surface.
` } } },
}

const card = (inner) => `<div style="max-width:560px; border:1px solid var(--ds-color-border); border-radius:var(--ds-radius-lg); overflow:hidden;">${inner}</div>`

export const TitleAndActions = {
  render: () => ({
    components: { DsSectionHeader },
    template: card(`
      <div style="padding:16px 18px; border-bottom:1px solid var(--ds-color-border);">
        <ds-section-header title="Reservations" subtitle="Today · 24 bookings" variant="subsection">
          <template #actions>
            <q-btn dense flat round icon="more_horiz" />
          </template>
        </ds-section-header>
      </div>
      <div style="padding:20px 18px; color:var(--ds-color-text-subtle);">Card body…</div>`),
  }),
}

export const AccentHeader = {
  render: () => ({
    components: { DsSectionHeader },
    template: card(`
      <div style="padding:16px 18px 8px;">
        <ds-section-header title="Event Details" variant="section">
          <template #actions><q-btn dense flat no-caps color="primary" label="Edit" /></template>
        </ds-section-header>
      </div>
      <div style="padding:4px 18px 20px; color:var(--ds-color-text-subtle);">Fields…</div>`),
  }),
}

export const WithIconAndBadge = {
  render: () => ({
    template: card(`
      <div style="display:flex; align-items:center; gap:12px; padding:16px 18px; border-bottom:1px solid var(--ds-color-border);">
        <q-avatar color="primary" text-color="white" icon="hotel" size="40px" />
        <div style="flex:1;">
          <div style="font-weight:700;">Best Western Plus Normandy</div>
          <div style="font-size:0.8125rem; color:var(--ds-color-text-subtle);">Inventory Request</div>
        </div>
        <q-badge color="positive" rounded class="q-px-sm q-py-xs">Approved</q-badge>
      </div>
      <div style="padding:20px 18px; color:var(--ds-color-text-subtle);">Card body…</div>`),
  }),
}
