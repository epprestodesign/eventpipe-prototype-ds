/** APPLICATION COMPONENTS / Info Grid → DsInfoGrid.vue (label/value metadata). */
import DsInfoGrid from '../../components/DsInfoGrid.vue'

export default {
  title: 'Components/Layout & Structure/Info Grid',
  component: DsInfoGrid,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
A responsive **label / value** grid for record metadata — the 3-column block
under a **Page Header**. Pass \`items\` as \`{ label, value }\` pairs; they flow into
as many responsive columns as fit (\`minColWidth\`).
` } } },
  args: {
    minColWidth: '320px',
    labelWidth: '120px',
    items: [
      { label: 'Created by:', value: 'Justin Girard' },
      { label: 'Hotel Name:', value: 'Best Western Plus Normandy Inn & Suites' },
      { label: 'Event Name:', value: 'USAV Boys Junior National Championships' },
      { label: 'Assigned to:', value: 'Josh Silverberg' },
      { label: 'Pipe ID:', value: 'PIPE-355872' },
      { label: 'Event Start Date:', value: 'Fri, 04/11/2025' },
    ],
  },
}

export const Default = { render: (args) => ({ components: { DsInfoGrid }, setup: () => ({ args }), template: `<ds-info-grid v-bind="args" />` }) }

export const TwoColumn = {
  render: () => ({
    components: { DsInfoGrid },
    setup: () => ({ items: [
      { label: 'Request ID:', value: 'R-00081527' },
      { label: 'Group Block ID:', value: 'GB-BJNC-NORMANDY-01' },
      { label: 'Status:', value: 'Approved by Hotel' },
      { label: 'Watchers:', value: '2 users' },
    ] }),
    template: `<div style="max-width:720px"><ds-info-grid :items="items" min-col-width="330px" label-width="130px" /></div>`,
  }),
}
