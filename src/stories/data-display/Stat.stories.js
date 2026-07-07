/** COMPONENTS / Layout & Structure / Stat → DsStat.vue (KPI metric). */
import DsStat from '../../components/DsStat.vue'

export default {
  title: 'Components/Layout & Structure/Stat',
  component: DsStat,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'A single KPI metric — a large value over a muted label. Lay several in a grid for a stat block (the Events card metrics).' } } },
  args: { value: '846', label: 'Nights Booked' },
}

export const Default = { render: (args) => ({ components: { DsStat }, setup: () => ({ args }), template: `<ds-stat v-bind="args" />` }) }

export const Grid = {
  render: () => ({
    components: { DsStat },
    template: `
      <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:20px 32px; max-width:560px;">
        <ds-stat value="0" label="Available on Peak" /><ds-stat value="370" label="Total Reservations" /><ds-stat value="2" label="Unconf. Reservations" />
        <ds-stat value="846" label="Nights Booked" /><ds-stat value="64" label="Total Group Blocks" /><ds-stat value="21" label="Pending Changes/Cxls" />
      </div>`,
  }),
}
