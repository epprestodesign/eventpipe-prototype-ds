/** COMPONENTS / Charts / Bar → DsBarChart.vue
 *  All data is SYNTHETIC (fixtures/chartFixtures.js). */
import { ref } from 'vue'
import DsBarChart from '../../components/charts/DsBarChart.vue'
import DsChartCard from '../../components/charts/DsChartCard.vue'
import DsChoiceChips from '../../components/DsChoiceChips.vue'
import { cartesianArgTypes, hiddenSeriesControl, frame, mobileFrame, DARK, LIGHT } from './_shared.js'
import { CHANNEL_BOOKINGS, CHANNEL_PERIODS, LONG_LABELS, BARS_MISSING, EMPTY } from './fixtures/chartFixtures.js'

export default {
  title: 'Components/Charts/Bar',
  component: DsBarChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**Compare magnitudes across categories** — bookings by channel, room nights by hotel, current vs. previous period.

## When to use
- Discrete categories (channels, hotels, events). For ordered time with many points, use **Line**.
- **Grouped** (2+ series): the same categories across two periods or segments. Mark the baseline \`comparison: true\` for the neutral colour.
- **Horizontal**: long category names or more than ~7 categories. Labels get the full width instead of truncating under each bar.

## Props
Everything in **Line** plus:

| Prop | Type | Notes |
| --- | --- | --- |
| \`horizontal\` | \`boolean\` | Categories on the vertical axis. |

Values always start at zero — a bar's length is its value.

## Usage
\`\`\`html
<ds-bar-chart :labels="channels" :series="[{ key: 'cur', label: 'Sep 2026', data }, { key: 'prev', label: 'Sep 2025', data: prev, comparison: true }]" />
<ds-bar-chart horizontal :labels="hotelNames" :series="nights" />
\`\`\`

## Interactions
Hover a category for all its series; ←/→ (↑/↓ when horizontal) to step with the keyboard; the legend toggles series.

## Limitations
- Vertical axis labels truncate past \`maxLabelLength\` (full text in the tooltip and table) — switch to horizontal when that happens often.
- A missing value draws **no bar**; a zero draws a zero-length bar. The tooltip and table say which.
`,
      },
    },
  },
  argTypes: { ...cartesianArgTypes, horizontal: { control: 'boolean' }, ...hiddenSeriesControl(CHANNEL_PERIODS) },
  args: {
    labels: CHANNEL_BOOKINGS.labels,
    series: CHANNEL_BOOKINGS.series,
    height: 280,
    valueFormat: 'number',
    labelFormat: 'category',
    showLegend: true,
    showGrid: true,
    beginAtZero: true,
    horizontal: false,
    loading: false,
    error: '',
    view: 'chart',
    hiddenSeries: [],
  },
}

const bound = (args, width) => ({ components: { DsBarChart }, setup: () => ({ args }), template: frame(`<ds-bar-chart v-bind="args" />`, width) })

export const Default = { render: (args) => bound(args) }

/** Channels compared inside the standard card, with DsChoiceChips as the
 *  metric filter — the one-row filter pattern for chart headers. */
export const CategoryComparison = {
  name: 'Category Comparison',
  render: () => ({
    components: { DsBarChart, DsChartCard, DsChoiceChips },
    setup() {
      const metric = ref('bookings')
      const options = [{ value: 'bookings', label: 'Bookings' }, { value: 'revenue', label: 'Revenue' }]
      const revenue = { labels: CHANNEL_BOOKINGS.labels, series: [{ key: 'revenue', label: 'Revenue', data: [412300, 298600, 131800, 60200, 19400] }] }
      return { metric, options, bookings: CHANNEL_BOOKINGS, revenue }
    },
    template: frame(`
      <ds-chart-card title="By booking channel" subtitle="September 2026 · synthetic" table-toggle>
        <template #actions>
          <ds-choice-chips v-model="metric" :options="options" :multiple="false" />
        </template>
        <template #default="{ view }">
          <ds-bar-chart v-if="metric === 'revenue'" :labels="revenue.labels" :series="revenue.series" value-format="currency" :view="view" />
          <ds-bar-chart v-else :labels="bookings.labels" :series="bookings.series" :view="view" />
        </template>
      </ds-chart-card>`),
  }),
}

export const Horizontal = {
  args: { horizontal: true, height: 260 },
  render: (args) => bound(args),
}

/** Current vs. previous period — the previous period is the neutral comparison colour. */
export const Grouped = {
  args: { labels: CHANNEL_PERIODS.labels, series: CHANNEL_PERIODS.series },
  render: (args) => bound(args),
}

/** Long hotel names: vertical truncates (full name in tooltip/table),
 *  horizontal gives them room. */
export const LongLabels = {
  name: 'Long Labels',
  render: () => ({
    components: { DsBarChart, DsChartCard },
    setup: () => ({ data: LONG_LABELS }),
    template: `
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(340px, 1fr)); gap:16px; max-width:1100px;">
        <ds-chart-card title="Vertical — labels truncate" subtitle="Synthetic">
          <ds-bar-chart :labels="data.labels" :series="data.series" :height="260" />
        </ds-chart-card>
        <ds-chart-card title="Horizontal — preferred for long labels" subtitle="Synthetic">
          <ds-bar-chart horizontal :labels="data.labels" :series="data.series" :height="260" :max-label-length="28" />
        </ds-chart-card>
      </div>`,
  }),
}

/** March is MISSING (no bar, tooltip "No data"); June is a real ZERO. */
export const MissingData = {
  name: 'Missing Data',
  args: { labels: BARS_MISSING.labels, series: BARS_MISSING.series, valueFormat: 'currency', labelFormat: 'month' },
  render: (args) => bound(args),
}

export const Empty = { args: { labels: EMPTY.labels, series: EMPTY.series }, render: (args) => bound(args) }

export const ErrorState = {
  name: 'Error',
  args: { error: 'Channel data could not be loaded (synthetic error).' },
  render: (args) => bound(args),
}

export const Mobile = {
  render: () => ({
    components: { DsBarChart, DsChartCard },
    setup: () => ({ data: CHANNEL_PERIODS }),
    template: mobileFrame(`
      <ds-chart-card title="By booking channel" subtitle="Sep 2026 vs Sep 2025" table-toggle>
        <template #default="{ view }">
          <ds-bar-chart horizontal :labels="data.labels" :series="data.series" :height="300" :view="view" />
        </template>
      </ds-chart-card>`),
  }),
}

const cardStory = {
  components: { DsBarChart, DsChartCard },
  setup: () => ({ data: CHANNEL_PERIODS }),
  template: frame(`
    <ds-chart-card title="By booking channel" subtitle="Sep 2026 vs Sep 2025 · synthetic" table-toggle>
      <template #default="{ view }"><ds-bar-chart :labels="data.labels" :series="data.series" :view="view" /></template>
    </ds-chart-card>`),
}
export const Light = { parameters: LIGHT, render: () => cardStory }
export const Dark = { parameters: DARK, render: () => cardStory }
