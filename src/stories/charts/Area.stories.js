/** COMPONENTS / Charts / Area → DsAreaChart.vue
 *  All data is SYNTHETIC (fixtures/chartFixtures.js). */
import DsAreaChart from '../../components/charts/DsAreaChart.vue'
import DsChartCard from '../../components/charts/DsChartCard.vue'
import { cartesianArgTypes, hiddenSeriesControl, frame, mobileFrame, DARK } from './_shared.js'
import { REVENUE_DAILY, GROWTH_WEEKLY, ROOM_TYPES_MONTHLY, CHECKINS_MISSING, ALL_ZERO } from './fixtures/chartFixtures.js'

export default {
  title: 'Components/Charts/Area',
  component: DsAreaChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**Volume over time.** A line whose filled area carries the meaning — cumulative growth, or (with \`stacked\`) how parts build a total over time.

## When to use
- Cumulative or volume measures where "how much" matters as much as "which way".
- \`stacked\`: composition of a total over time, 2–4 layers. The top edge is the total.

## When not to use
- Comparing series that overlap heavily — use **Line**; overlapping translucent fills muddy.
- Sparse data with gaps in a stacked chart — a gap in a lower layer shifts every layer above it. Use the table view or an unstacked **Line**.

## Props
Everything in **Line** (\`labels · series · valueFormat · labelFormat · height · showLegend · showGrid · hiddenSeries · loading · error · view · ariaLabel\`) plus:

| Prop | Type | Notes |
| --- | --- | --- |
| \`stacked\` | \`boolean\` | Stack layers so the top edge is the total. |

## Usage
\`\`\`html
<ds-area-chart :labels="weeks" :series="[{ key: 'reg', label: 'Registrations', data }]" label-format="day" />
<ds-area-chart stacked :labels="months" :series="roomTypes" label-format="month" />
\`\`\`

## Interactions
Same as Line: index tooltip on hover, ←/→ keyboard stepping, toggleable legend.

## Limitations
- Fill is the series colour at low opacity (14% single, 50% stacked) so gridlines stay legible.
- Missing values are gaps. In stacked mode Chart.js stacks by index, so keep stacked data complete.
`,
      },
    },
  },
  argTypes: { ...cartesianArgTypes, stacked: { control: 'boolean' }, ...hiddenSeriesControl(ROOM_TYPES_MONTHLY) },
  args: {
    labels: REVENUE_DAILY.labels,
    series: REVENUE_DAILY.series,
    height: 280,
    valueFormat: 'currency',
    labelFormat: 'day',
    showLegend: true,
    showGrid: true,
    beginAtZero: true,
    stacked: false,
    loading: false,
    error: '',
    view: 'chart',
    hiddenSeries: [],
  },
}

const bound = (args) => ({ components: { DsAreaChart }, setup: () => ({ args }), template: frame(`<ds-area-chart v-bind="args" />`) })

export const Default = { render: (args) => bound(args) }

/** Cumulative registrations across a 12-week window, in the standard card. */
export const GrowthOverTime = {
  name: 'Growth Over Time',
  render: () => ({
    components: { DsAreaChart, DsChartCard },
    setup: () => ({ data: GROWTH_WEEKLY }),
    template: frame(`
      <ds-chart-card title="Registrations" subtitle="Cumulative · weekly · synthetic" table-toggle>
        <template #default="{ view }">
          <ds-area-chart :labels="data.labels" :series="data.series" label-format="day" :view="view" />
        </template>
        <template #footer>Registration opened Jun 1, 2026.</template>
      </ds-chart-card>`),
  }),
}

/** Room nights by room type. The top edge is the total. */
export const Stacked = {
  args: { labels: ROOM_TYPES_MONTHLY.labels, series: ROOM_TYPES_MONTHLY.series, stacked: true, valueFormat: 'number', labelFormat: 'month' },
  render: (args) => bound(args),
}

/** Unstacked area with a reporting outage: the fill breaks with the line. */
export const MissingData = {
  name: 'Missing Data',
  args: { labels: CHECKINS_MISSING.labels, series: [CHECKINS_MISSING.series[0]], valueFormat: 'number', labelFormat: 'day' },
  render: (args) => bound(args),
}

export const AllZeroValues = {
  name: 'All Zero Values',
  args: { labels: ALL_ZERO.labels, series: ALL_ZERO.series, valueFormat: 'currency', labelFormat: 'day' },
  render: (args) => bound(args),
}

export const Loading = { args: { loading: true }, render: (args) => bound(args) }

export const Mobile = {
  render: () => ({
    components: { DsAreaChart, DsChartCard },
    setup: () => ({ data: ROOM_TYPES_MONTHLY }),
    template: mobileFrame(`
      <ds-chart-card title="Room nights by type" subtitle="Synthetic">
        <ds-area-chart stacked :labels="data.labels" :series="data.series" label-format="month" :height="220" />
      </ds-chart-card>`),
  }),
}

export const Dark = {
  parameters: DARK,
  render: () => ({
    components: { DsAreaChart, DsChartCard },
    setup: () => ({ data: ROOM_TYPES_MONTHLY }),
    template: frame(`
      <ds-chart-card title="Room nights by type" subtitle="Stacked · synthetic" table-toggle>
        <template #default="{ view }">
          <ds-area-chart stacked :labels="data.labels" :series="data.series" label-format="month" :view="view" />
        </template>
      </ds-chart-card>`),
  }),
}
