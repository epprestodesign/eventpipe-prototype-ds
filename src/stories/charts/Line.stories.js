/** COMPONENTS / Charts / Line → DsLineChart.vue
 *  All data is SYNTHETIC (fixtures/chartFixtures.js). */
import { ref, computed } from 'vue'
import DsLineChart from '../../components/charts/DsLineChart.vue'
import DsChartCard from '../../components/charts/DsChartCard.vue'
import { cartesianArgTypes, hiddenSeriesControl, frame, mobileFrame, PERIODS, DARK, LIGHT } from './_shared.js'
import {
  REVENUE_DAILY, REVENUE_MONTHLY, CHANNELS_MONTHLY, CHECKINS_MISSING, DENSE_DAILY,
  ALL_ZERO, ALL_MISSING, EMPTY,
} from './fixtures/chartFixtures.js'

export default {
  title: 'Components/Charts/Line',
  component: DsLineChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**Change over time** for one to five continuous series — revenue by day, bookings by month, current vs. previous period.

## When to use
- A continuous measure over ordered time. Use **Bar** for unordered categories, **Area** when the volume under the line is the point.
- Comparing the current period with the previous one: mark the baseline series \`comparison: true\` — it draws **dashed and neutral, behind** the current series.

## Props
| Prop | Type | Notes |
| --- | --- | --- |
| \`labels\` | \`string[]\` | X categories. ISO dates (\`YYYY-MM-DD\`) with a date \`labelFormat\`. |
| \`series\` | \`{ key, label, data, comparison?, color? }[]\` | \`data\` is \`(number \\| null)[]\`. **null = missing**, drawn as a gap. |
| \`valueFormat\` | \`number · compact · currency · currency-compact · percent\` | Axis uses the compact form; tooltip and table use the full form. \`percent\` expects ratios. |
| \`labelFormat\` | \`category · day · month · month-year\` | Dates format in UTC (en-US). |
| \`height\` | \`number\` | Plot height in px; width always fills the container. |
| \`showLegend\` / \`showGrid\` / \`beginAtZero\` | \`boolean\` | Legend renders for 2+ series only. |
| \`hiddenSeries\` | \`string[]\` | \`v-model:hidden-series\`. The legend toggles it; the last visible series cannot be hidden. |
| \`loading\` / \`error\` / \`emptyText\` | | State props. \`@retry\` fires from the error state. |
| \`view\` | \`chart · table · data\` | The table is the accessible alternative; \`data\` makes it interactive (search, sort, series columns) — the Chart Card's **View more** modal renders the chart with it. |
| \`ariaLabel\` | \`string\` | Accessible summary; auto-generated from the data when omitted. |

## Usage
\`\`\`html
<ds-line-chart :labels="months" :series="[
  { key: 'current', label: '2026', data: revenue2026 },
  { key: 'previous', label: '2025', data: revenue2025, comparison: true },
]" value-format="currency" label-format="month" />
\`\`\`

## Interactions
- Hover: crosshair-style index tooltip with every visible series at that point; missing values read **No data**.
- Keyboard: focus the chart (Tab), then ←/→ to step through points, Home/End, Esc to dismiss.
- Legend items are toggle buttons (\`aria-pressed\`) that hide/show a series.

## Limitations
- Up to **5 categorical series**; a 6th renders in the neutral colour (never a generated hue) — split into small multiples instead.
- One value axis. Two measures of different scale belong in two charts, not a dual axis.
- Straight segments only (no smoothing) — smoothing invents values between points.
`,
      },
    },
  },
  argTypes: { ...cartesianArgTypes, ...hiddenSeriesControl(REVENUE_MONTHLY) },
  args: {
    labels: REVENUE_DAILY.labels,
    series: REVENUE_DAILY.series,
    height: 280,
    valueFormat: 'currency',
    labelFormat: 'day',
    currency: 'USD',
    showLegend: true,
    showGrid: true,
    beginAtZero: true,
    loading: false,
    error: '',
    view: 'chart',
    hiddenSeries: [],
  },
}

const bound = (args, width) => ({
  components: { DsLineChart },
  setup: () => ({ args }),
  template: frame(`<ds-line-chart v-bind="args" />`, width),
})

/** One series, bound to Controls. */
export const Default = { render: (args) => bound(args) }

/** The standard composition: the chart inside DsChartCard with a period filter
 *  and the View more data modal. Current year vs. the previous year. */
export const RevenueOverTime = {
  name: 'Revenue Over Time',
  render: (args) => ({
    components: { DsLineChart, DsChartCard },
    setup() {
      const period = ref(PERIODS[0])
      const data = computed(() => (period.value === PERIODS[0] ? REVENUE_MONTHLY : REVENUE_DAILY))
      const labelFormat = computed(() => (period.value === PERIODS[0] ? 'month' : 'day'))
      return { args, period, data, labelFormat, PERIODS }
    },
    template: frame(`
      <ds-chart-card title="Booking revenue" subtitle="Synthetic data · USD" table-toggle>
        <template #actions>
          <q-select v-model="period" :options="PERIODS" outlined dense options-dense style="min-width:170px" aria-label="Period" />
        </template>
        <template #default="{ view }">
          <ds-line-chart :labels="data.labels" :series="data.series" value-format="currency"
            :label-format="labelFormat" :view="view" :height="args.height" :show-grid="args.showGrid"
            :hidden-series="args.hiddenSeries" />
        </template>
        <template #footer>Compared with the same months of 2025.</template>
      </ds-chart-card>`),
  }),
}

/** Three channels. Colour is assigned by entity in a fixed order; hiding a
 *  series from the legend never repaints the others. */
export const MultipleSeries = {
  name: 'Multiple Series',
  args: { labels: CHANNELS_MONTHLY.labels, series: CHANNELS_MONTHLY.series, valueFormat: 'number', labelFormat: 'month' },
  argTypes: hiddenSeriesControl(CHANNELS_MONTHLY),
  render: (args) => bound(args),
}

/** A four-day reporting outage and two isolated gaps. Nulls are gaps — never
 *  bridged, never dropped to zero. An isolated reported value keeps a dot so it
 *  does not vanish between gaps. The tooltip reads "No data" in the gaps. */
export const MissingData = {
  name: 'Missing Data',
  args: { labels: CHECKINS_MISSING.labels, series: CHECKINS_MISSING.series, valueFormat: 'number', labelFormat: 'day' },
  render: (args) => bound(args),
}

/** Every reported value is a real zero. The line sits on the baseline and the
 *  chart says so — distinct from Missing and Empty. */
export const AllZeroValues = {
  name: 'All Zero Values',
  args: { labels: ALL_ZERO.labels, series: ALL_ZERO.series, valueFormat: 'currency', labelFormat: 'day' },
  render: (args) => bound(args),
}

/** Every slot exists but nothing was reported — "No values reported", which is
 *  not the same claim as zero. */
export const AllMissing = {
  name: 'All Missing',
  args: { labels: ALL_MISSING.labels, series: ALL_MISSING.series, valueFormat: 'currency', labelFormat: 'day' },
  render: (args) => bound(args),
}

/** No categories and no series. */
export const Empty = {
  args: { labels: EMPTY.labels, series: EMPTY.series },
  render: (args) => bound(args),
}

export const Loading = {
  args: { loading: true },
  render: (args) => bound(args),
}

export const ErrorState = {
  name: 'Error',
  args: { error: 'The revenue service did not respond. Try again in a moment.' },
  render: (args) => bound(args),
}

/** 90 daily points against the previous 90 days. Ticks auto-skip; points only
 *  appear on hover. */
export const DenseData = {
  name: 'Dense Data',
  args: { labels: DENSE_DAILY.labels, series: DENSE_DAILY.series, valueFormat: 'number', labelFormat: 'day' },
  render: (args) => bound(args),
}

/** 360px column — ticks thin out, the legend wraps, the card header stacks. */
export const Mobile = {
  render: () => ({
    components: { DsLineChart, DsChartCard },
    setup: () => ({ data: REVENUE_MONTHLY }),
    template: mobileFrame(`
      <ds-chart-card title="Booking revenue" subtitle="Synthetic · USD" table-toggle>
        <template #default="{ view }">
          <ds-line-chart :labels="data.labels" :series="data.series" value-format="currency" label-format="month" :height="220" :view="view" />
        </template>
      </ds-chart-card>`),
  }),
}

const cardStory = {
  components: { DsLineChart, DsChartCard },
  setup: () => ({ data: REVENUE_MONTHLY }),
  template: frame(`
    <ds-chart-card title="Booking revenue" subtitle="Synthetic data · USD" table-toggle>
      <template #default="{ view }">
        <ds-line-chart :labels="data.labels" :series="data.series" value-format="currency" label-format="month" :view="view" />
      </template>
    </ds-chart-card>`),
}

/** Forced light — pairs with Dark for visual regression. Same component, same fixture. */
export const Light = { parameters: LIGHT, render: () => cardStory }

/** Forced dark via the real Quasar Dark state (Canvas) or a local dark scope
 *  (Docs). Chart, card, legend and tooltip all read the dark tokens. */
export const Dark = { parameters: DARK, render: () => cardStory }
