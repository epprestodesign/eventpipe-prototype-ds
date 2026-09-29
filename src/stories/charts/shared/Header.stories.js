/** COMPONENTS / Charts / Shared Elements / Header → DsChartHeader.vue */
import { ref } from 'vue'
import DsChartHeader from '../../../components/charts/DsChartHeader.vue'
import DsChoiceChips from '../../../components/DsChoiceChips.vue'

export default {
  title: 'Components/Charts/Shared Elements/Header',
  component: DsChartHeader,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Chart title, optional subtitle, and one right-aligned row of actions (filters, the Chart Card “View more” button). Wraps under the title on narrow widths. Used by **Chart Card**; usable alone above a chart that sits in another container.',
      },
    },
  },
  args: { title: 'Booking revenue', subtitle: 'Last 12 months · USD · synthetic', level: 3 },
  argTypes: { level: { control: 'inline-radio', options: [2, 3, 4] } },
}

export const Default = {
  render: (args) => ({ components: { DsChartHeader }, setup: () => ({ args }), template: `<div style="max-width:760px"><ds-chart-header v-bind="args" /></div>` }),
}

export const WithActions = {
  name: 'With Actions',
  render: (args) => ({
    components: { DsChartHeader, DsChoiceChips },
    setup: () => ({ args, period: ref('12m'), options: [{ value: '30d', label: '30 days' }, { value: '12m', label: '12 months' }] }),
    template: `
      <div style="max-width:760px">
        <ds-chart-header v-bind="args">
          <template #actions><ds-choice-chips v-model="period" :options="options" :multiple="false" /></template>
        </ds-chart-header>
      </div>`,
  }),
}

export const Narrow = {
  render: (args) => ({
    components: { DsChartHeader },
    setup: () => ({ args }),
    template: `
      <div style="width:320px">
        <ds-chart-header v-bind="args">
          <template #actions><q-select :model-value="'Last 12 months'" :options="['Last 12 months']" outlined dense style="min-width:170px" aria-label="Period" /></template>
        </ds-chart-header>
      </div>`,
  }),
}
