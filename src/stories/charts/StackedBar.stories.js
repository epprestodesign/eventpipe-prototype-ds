/** COMPONENTS / Charts / Stacked Bar → DsStackedBarChart.vue
 *  All data is SYNTHETIC (fixtures/chartFixtures.js). */
import DsStackedBarChart from '../../components/charts/DsStackedBarChart.vue'
import DsChartCard from '../../components/charts/DsChartCard.vue'
import { cartesianArgTypes, hiddenSeriesControl, frame, mobileFrame, DARK } from './_shared.js'
import { STATUS_BY_EVENT, STATUS_EDGE_CASES, SHARE_SINGLE, ROOM_TYPES_MONTHLY } from './fixtures/chartFixtures.js'

export default {
  title: 'Components/Charts/Stacked Bar',
  component: DsStackedBarChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**Composition** — how parts make up each category's total (reservation status per event), or, with \`percent\`, each part's share.

## When to use
- 2–5 parts per category where both the total and the split matter.
- \`percent\`: only the split matters (totals differ wildly between categories).
- A single horizontal row (\`horizontal percent\`, one label) replaces the hand-drawn "share bars" on the EP Pay Disputes and Balances screens.

## Props
Everything in **Line** plus:

| Prop | Type | Notes |
| --- | --- | --- |
| \`horizontal\` | \`boolean\` | Bars run left to right. |
| \`percent\` | \`boolean\` | Normalise each bar to 100%. Tooltip shows share **and** raw value. |

## Usage
\`\`\`html
<ds-stacked-bar-chart :labels="events" :series="[confirmed, pending, cancelled]" />
<ds-stacked-bar-chart percent horizontal :labels="['Disputed amount']" :series="byMethod" bare :height="28" :show-grid="false" />
\`\`\`

## Interactions
Hover a bar for every part of that category; keyboard ←/→ (↑/↓ horizontal); legend toggles parts.

## Limitations
- A category whose parts sum to 0 (or are all missing) has **no composition**: no bar is drawn and the tooltip reads "No data", rather than a fake 0%.
- A missing part is excluded from its category's total; the table and tooltip mark it "No data".
- Segments are separated by a 1px surface stroke; ends are square (stacked segments do not round).
`,
      },
    },
  },
  argTypes: { ...cartesianArgTypes, horizontal: { control: 'boolean' }, percent: { control: 'boolean' }, ...hiddenSeriesControl(STATUS_BY_EVENT) },
  args: {
    labels: STATUS_BY_EVENT.labels,
    series: STATUS_BY_EVENT.series,
    height: 280,
    valueFormat: 'number',
    labelFormat: 'category',
    showLegend: true,
    showGrid: true,
    horizontal: false,
    percent: false,
    loading: false,
    error: '',
    view: 'chart',
    hiddenSeries: [],
  },
}

const bound = (args) => ({ components: { DsStackedBarChart }, setup: () => ({ args }), template: frame(`<ds-stacked-bar-chart v-bind="args" />`) })

export const Default = { render: (args) => bound(args) }

/** Reservation status per event, in the standard card. */
export const CategoryComposition = {
  name: 'Category Composition',
  render: () => ({
    components: { DsStackedBarChart, DsChartCard },
    setup: () => ({ data: STATUS_BY_EVENT }),
    template: frame(`
      <ds-chart-card title="Reservations by status" subtitle="Per event · synthetic" table-toggle>
        <template #default="{ view }">
          <ds-stacked-bar-chart horizontal :labels="data.labels" :series="data.series" :height="260" :view="view" :max-label-length="22" />
        </template>
      </ds-chart-card>`),
  }),
}

/** Each bar normalised to 100%. */
export const PercentageBreakdown = {
  name: 'Percentage Breakdown',
  args: { percent: true, labels: ROOM_TYPES_MONTHLY.labels, series: ROOM_TYPES_MONTHLY.series, labelFormat: 'month' },
  render: (args) => bound(args),
}

/** The single-row share bar the EP Pay screens hand-draw today, built from the
 *  same component. "Other methods" is the neutral comparison colour. */
export const ShareBar = {
  name: 'Share Bar (single row)',
  render: () => ({
    components: { DsStackedBarChart, DsChartCard },
    setup: () => ({ data: SHARE_SINGLE }),
    template: frame(`
      <ds-chart-card title="Disputes by payment method" subtitle="Last 12 months · synthetic" table-toggle>
        <template #default="{ view }">
          <ds-stacked-bar-chart percent horizontal :labels="data.labels" :series="data.series" value-format="currency"
            bare :height="28" :show-grid="false" :view="view" />
        </template>
      </ds-chart-card>`, 560),
  }),
}

/** "Winter Invitational" has zero reservations of every status — no
 *  composition, so no bar. "Show-Me State Games" is missing its pending count. */
export const ZeroAndMissing = {
  name: 'Zero and Missing',
  args: { labels: STATUS_EDGE_CASES.labels, series: STATUS_EDGE_CASES.series, percent: true },
  render: (args) => bound(args),
}

export const Loading = { args: { loading: true }, render: (args) => bound(args) }

export const Mobile = {
  render: () => ({
    components: { DsStackedBarChart, DsChartCard },
    setup: () => ({ data: STATUS_BY_EVENT }),
    template: mobileFrame(`
      <ds-chart-card title="Reservations by status" subtitle="Synthetic">
        <ds-stacked-bar-chart horizontal :labels="data.labels" :series="data.series" :height="280" />
      </ds-chart-card>`),
  }),
}

export const Dark = {
  parameters: DARK,
  render: () => ({
    components: { DsStackedBarChart, DsChartCard },
    setup: () => ({ data: STATUS_BY_EVENT }),
    template: frame(`
      <ds-chart-card title="Reservations by status" subtitle="Per event · synthetic" table-toggle>
        <template #default="{ view }"><ds-stacked-bar-chart :labels="data.labels" :series="data.series" :view="view" /></template>
      </ds-chart-card>`),
  }),
}
