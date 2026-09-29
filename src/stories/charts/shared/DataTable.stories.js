/** COMPONENTS / Charts / Shared Elements / Data Table → DsChartDataTable.vue */
import DsChartDataTable from '../../../components/charts/DsChartDataTable.vue'
import { VALUE_FORMATS, LABEL_FORMATS } from '../../../components/charts/chartFormat.js'
import { CHECKINS_MISSING, CHANNEL_PERIODS } from '../fixtures/chartFixtures.js'

export default {
  title: 'Components/Charts/Shared Elements/Data Table',
  component: DsChartDataTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
The accessible alternative to every chart. Each chart renders it **visually hidden** beside the canvas for screen readers, and **visibly** in its \`view="table"\` mode. Values use the same formatter as the chart; missing values read "No data". Scrollable and keyboard-focusable when taller than \`maxHeight\`.

With \`interactive\` (a chart's \`view="data"\` — what the Chart Card's **View more** modal shows) it adds a row search (label or any formatted value, case-insensitive), sortable column headers (buttons, \`aria-sort\`; missing values always sort last), show / hide toggles per series column (at least one stays visible), a live "Showing N of M rows" count, and a "No rows match" state with Clear search. No height cap in this mode — the modal scrolls and the header row sticks.
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

/** `interactive` — the View more modal's table: search, sort, series columns. */
export const Interactive = {
  args: {
    interactive: true,
    caption: '',
    labels: CHANNEL_PERIODS.labels,
    series: CHANNEL_PERIODS.series,
    labelFormat: 'category',
    valueFormat: 'currency',
    categoryHeader: 'Channel',
    maxHeight: 0,
  },
  render: (args) => ({ components: { DsChartDataTable }, setup: () => ({ args }), template: `<div style="max-width:760px"><ds-chart-data-table v-bind="args" /></div>` }),
}
