/** COMPONENTS / Charts / Donut → DsDonutChart.vue
 *  All data is SYNTHETIC (fixtures/chartFixtures.js). */
import DsDonutChart from '../../components/charts/DsDonutChart.vue'
import DsChartCard from '../../components/charts/DsChartCard.vue'
import { VALUE_FORMATS } from '../../components/charts/chartFormat.js'
import { frame, mobileFrame, DARK, LIGHT } from './_shared.js'
import { CHANNEL_SEGMENTS, MANY_SEGMENTS, SEGMENTS_MISSING, SEGMENTS_ZERO, SEGMENTS_ALL_MISSING } from './fixtures/chartFixtures.js'

export default {
  title: 'Components/Charts/Donut',
  component: DsDonutChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**Part-to-whole for a few parts** — bookings by channel, balance split. The legend carries every value and share, so the ring is never the only way to read the numbers.

## When to use
- 2–5 parts of one total, where "which part dominates" is the message.
- Prefer **Bar** when parts need precise comparison, and **Stacked Bar** to compare composition across categories.

## Props
| Prop | Type | Notes |
| --- | --- | --- |
| \`segments\` | \`{ key, label, value }[]\` | Non-negative values; \`null\` = missing (listed as "No data", excluded from the ring). |
| \`size\` | \`number\` | Ring diameter in px. |
| \`valueFormat\` / \`currency\` | | As the other charts. |
| \`centerValue\` / \`centerLabel\` | \`string\` | Centre metric. \`centerValue\` defaults to the formatted total. |
| \`showLegend\` / \`legendPosition\` | \`boolean\` / \`right · bottom\` | Legend lists value and share. |
| \`maxSegments\` | \`number\` | Parts beyond this fold into "Other" (max 5). |
| \`loading\` / \`error\` / \`emptyText\` / \`view\` / \`ariaLabel\` | | Shared state and a11y props. |

## Usage
\`\`\`html
<ds-donut-chart :segments="channels" center-label="Bookings" />
\`\`\`

## Interactions
Hover a slice (or focus the ring and use the arrow keys) for its value and share. "Other" lists the parts it contains.

## Limitations
- No negative values. More than 5 parts fold into "Other" — never a generated sixth colour.
- All-zero data draws an empty track with a note: there is no composition to show.
`,
      },
    },
  },
  argTypes: {
    size: { control: { type: 'range', min: 120, max: 320, step: 10 } },
    valueFormat: { control: 'select', options: VALUE_FORMATS },
    legendPosition: { control: 'inline-radio', options: ['right', 'bottom'] },
    maxSegments: { control: { type: 'number', min: 2, max: 5 } },
    view: { control: 'inline-radio', options: ['chart', 'table', 'data'] },
    loading: { control: 'boolean' },
    error: { control: 'text' },
    segments: { control: false },
  },
  args: {
    segments: CHANNEL_SEGMENTS,
    size: 200,
    valueFormat: 'number',
    centerLabel: '',
    showLegend: true,
    legendPosition: 'right',
    maxSegments: 5,
    loading: false,
    error: '',
    view: 'chart',
  },
}

const bound = (args, width = 640) => ({ components: { DsDonutChart }, setup: () => ({ args }), template: frame(`<ds-donut-chart v-bind="args" />`, width) })

export const Default = { render: (args) => bound(args) }

export const ChannelBreakdown = {
  name: 'Channel Breakdown',
  render: () => ({
    components: { DsDonutChart, DsChartCard },
    setup: () => ({ segments: CHANNEL_SEGMENTS }),
    template: frame(`
      <ds-chart-card title="Bookings by channel" subtitle="September 2026 · synthetic" table-toggle>
        <template #default="{ view }">
          <ds-donut-chart :segments="segments" center-label="Bookings" :view="view" />
        </template>
      </ds-chart-card>`, 640),
  }),
}

/** The centre metric is HTML — theme-aware and selectable. Here it shows a
 *  currency total rather than the default count. */
export const CenterMetric = {
  name: 'Center Metric',
  args: {
    segments: [
      { key: 'available', label: 'Available', value: 48210.55 },
      { key: 'pending', label: 'Pending', value: 12904.1 },
      { key: 'reserved', label: 'Reserve', value: 3200 },
    ],
    valueFormat: 'currency',
    centerLabel: 'Total balance',
    size: 220,
  },
  render: (args) => bound(args),
}

/** Seven channels → top four + "Other (3)". Hover "Other" to see its members. */
export const ManySegments = {
  name: 'Many Segments (folds to Other)',
  args: { segments: MANY_SEGMENTS, centerLabel: 'Bookings' },
  render: (args) => bound(args),
}

export const MissingData = {
  name: 'Missing Data',
  args: { segments: SEGMENTS_MISSING, centerLabel: 'Reported' },
  render: (args) => bound(args),
}

export const AllZeroValues = {
  name: 'All Zero Values',
  args: { segments: SEGMENTS_ZERO, centerLabel: 'Bookings' },
  render: (args) => bound(args),
}

export const AllMissing = { name: 'All Missing', args: { segments: SEGMENTS_ALL_MISSING }, render: (args) => bound(args) }

export const Empty = { args: { segments: [] }, render: (args) => bound(args) }

export const Loading = { args: { loading: true }, render: (args) => bound(args) }

export const ErrorState = { name: 'Error', args: { error: 'Channel totals are unavailable (synthetic error).' }, render: (args) => bound(args) }

export const LongLabels = {
  name: 'Long Labels',
  args: {
    segments: [
      { key: 'a', label: 'Downtown Convention Center Hotel & Suites', value: 2140 },
      { key: 'b', label: 'Riverside Marriott — Conference Wing', value: 1780 },
      { key: 'c', label: 'Airport Hilton Garden Inn (Shuttle Partner)', value: 1320 },
    ],
    centerLabel: 'Room nights',
  },
  render: (args) => bound(args, 560),
}

export const Mobile = {
  render: () => ({
    components: { DsDonutChart, DsChartCard },
    setup: () => ({ segments: CHANNEL_SEGMENTS }),
    template: mobileFrame(`
      <ds-chart-card title="Bookings by channel" subtitle="Synthetic">
        <ds-donut-chart :segments="segments" center-label="Bookings" legend-position="bottom" :size="180" />
      </ds-chart-card>`),
  }),
}

const cardStory = {
  components: { DsDonutChart, DsChartCard },
  setup: () => ({ segments: CHANNEL_SEGMENTS }),
  template: frame(`
    <ds-chart-card title="Bookings by channel" subtitle="September 2026 · synthetic">
      <ds-donut-chart :segments="segments" center-label="Bookings" />
    </ds-chart-card>`, 640),
}
export const Light = { parameters: LIGHT, render: () => cardStory }
export const Dark = { parameters: DARK, render: () => cardStory }
