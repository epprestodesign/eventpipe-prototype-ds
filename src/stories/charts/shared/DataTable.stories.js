/** COMPONENTS / Charts / Shared Elements / Data Table → DsChartDataTable.vue */
import DsChartDataTable from '../../../components/charts/DsChartDataTable.vue'
import { VALUE_FORMATS, LABEL_FORMATS } from '../../../components/charts/chartFormat.js'
import { CHECKINS_MISSING } from '../fixtures/chartFixtures.js'

export default {
  title: 'Components/Charts/Shared Elements/Data Table',
  component: DsChartDataTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
The accessible alternative to every chart. Each chart renders it **visually hidden** beside the canvas for screen readers, and **visibly** in its \`view="table"\` mode (the Chart Card toggle). Values use the same formatter as the chart; missing values read "No data". Scrollable and keyboard-focusable when taller than \`maxHeight\`.
`,
      },
    },
  },
  argTypes: { valueFormat: { control: 'select', options: VALUE_FORMATS }, labelFormat: { control: 'select', options: LABEL_FORMATS } },
  args: {
    caption: 'Daily check-ins, September 2026 (synthetic)',
    labels: CHECKINS_MISSING.labels,
    series: CHECKINS_MISSING.series,
    labelFormat: 'day',
    valueFormat: 'number',
    categoryHeader: 'Date',
    maxHeight: 320,
  },
}

export const Default = {
  render: (args) => ({ components: { DsChartDataTable }, setup: () => ({ args }), template: `<div style="max-width:560px"><ds-chart-data-table v-bind="args" /></div>` }),
}
