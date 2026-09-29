/** COMPONENTS / Charts / Metric Card → DsMetricCard.vue
 *  Composes DsCard + DsStat (Components/Layout & Structure/Stat) + DsSparkline.
 *  All data is SYNTHETIC. */
import DsMetricCard from '../../components/charts/DsMetricCard.vue'
import { VALUE_FORMATS } from '../../components/charts/chartFormat.js'
import { mobileFrame, DARK } from './_shared.js'
import { SPARK_UP, SPARK_DOWN, SPARK_PREV, SPARK_FLAT, SPARK_MISSING } from './fixtures/chartFixtures.js'

export default {
  title: 'Components/Charts/Metric Card',
  component: DsMetricCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**A headline number with its comparison and trend.** Built by composition — **DsCard** + **DsStat** (the existing DS metric, *Components / Layout & Structure / Stat*) + a delta badge + **Sparkline** — not a competing metric primitive.

## Props
| Prop | Type | Notes |
| --- | --- | --- |
| \`label\` | \`string\` | Metric name. |
| \`value\` / \`previousValue\` | \`number \\| null\` | \`null\` = not reported. A missing previous value shows "No comparison", never 0%. |
| \`valueFormat\` / \`currency\` | | Same formatter as the charts. |
| \`comparisonLabel\` | \`string\` | e.g. "vs. previous 30 days". |
| \`polarity\` | \`up-is-good · down-is-good · neutral\` | Which direction is good. Disputes going **down** is good. |
| \`spark\` / \`sparkPrevious\` | \`(number \\| null)[]\` | Trend and its baseline. |
| \`rangeStart\` / \`rangeEnd\` | \`string\` | Captions under the sparkline. |
| \`loading\` / \`error\` | | States. |

## Accessibility
The delta badge states direction with an icon **and** text, and exposes a full sentence ("Up 14.2% vs. previous period, from $42,210.00") to screen readers. Colour is never the only signal.

## Migration note
EP Pay's Dashboard metric tiles are built on this component (they replaced the hand-rolled \`EpPayStatCard\`, now deleted).
`,
      },
    },
  },
  argTypes: {
    valueFormat: { control: 'select', options: VALUE_FORMATS },
    polarity: { control: 'inline-radio', options: ['up-is-good', 'down-is-good', 'neutral'] },
    spark: { control: false },
    sparkPrevious: { control: false },
  },
  args: {
    label: 'Gross volume',
    value: 48210.55,
    previousValue: 42210.0,
    valueFormat: 'currency',
    comparisonLabel: 'vs. previous 30 days',
    polarity: 'up-is-good',
    spark: SPARK_UP,
    sparkPrevious: SPARK_PREV,
    rangeStart: 'Sep 1, 2026',
    rangeEnd: 'Sep 30, 2026',
    loading: false,
    error: '',
  },
}

const single = (args) => ({ components: { DsMetricCard }, setup: () => ({ args }), template: `<div style="max-width:360px"><ds-metric-card v-bind="args" /></div>` })

export const WithSparkline = { name: 'With Sparkline', render: (args) => single(args) }

/** No sparkline — the number and its period comparison only. */
export const WithPeriodComparison = {
  name: 'With Period Comparison',
  args: { spark: [], sparkPrevious: [], label: 'Room nights', value: 3812, previousValue: 3540, valueFormat: 'number', comparisonLabel: 'vs. September 2025' },
  render: (args) => single(args),
}

/** Disputes went DOWN, which is good: green badge, trending_down icon. */
export const DownIsGood = {
  name: 'Down Is Good',
  args: { label: 'Disputes', value: 34, previousValue: 41, valueFormat: 'number', polarity: 'down-is-good', spark: SPARK_DOWN, sparkPrevious: [] },
  render: (args) => single(args),
}

export const Unchanged = {
  args: { label: 'Active events', value: 20, previousValue: 20, valueFormat: 'number', spark: SPARK_FLAT, sparkPrevious: [] },
  render: (args) => single(args),
}

/** The previous period was not reported: "No comparison", not 0%. */
export const NoComparisonData = {
  name: 'No Comparison Data',
  args: { previousValue: null, sparkPrevious: [], spark: SPARK_MISSING },
  render: (args) => single(args),
}

/** A dashboard row: cards share height and wrap on narrow screens. */
export const DashboardRow = {
  name: 'Dashboard Row',
  render: () => ({
    components: { DsMetricCard },
    setup: () => ({ SPARK_UP, SPARK_DOWN, SPARK_PREV, SPARK_FLAT }),
    template: `
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:16px; max-width:1100px;">
        <ds-metric-card label="Gross volume" :value="48210.55" :previous-value="42210" value-format="currency" :spark="SPARK_UP" :spark-previous="SPARK_PREV" range-start="Sep 1" range-end="Sep 30" />
        <ds-metric-card label="Net volume" :value="45020.1" :previous-value="46110.4" value-format="currency" :spark="SPARK_DOWN" range-start="Sep 1" range-end="Sep 30" />
        <ds-metric-card label="Disputes" :value="34" :previous-value="41" polarity="down-is-good" :spark="SPARK_DOWN" range-start="Sep 1" range-end="Sep 30" />
        <ds-metric-card label="Conversion" :value="0.184" :previous-value="0.184" value-format="percent" :spark="SPARK_FLAT" range-start="Sep 1" range-end="Sep 30" />
      </div>`,
  }),
}

export const Loading = { args: { loading: true }, render: (args) => single(args) }

export const ErrorState = { name: 'Error', args: { error: 'Volume unavailable (synthetic error)' }, render: (args) => single(args) }

export const Mobile = {
  render: () => ({
    components: { DsMetricCard },
    setup: () => ({ SPARK_UP, SPARK_PREV }),
    template: mobileFrame(`<ds-metric-card label="Gross volume" :value="48210.55" :previous-value="42210" value-format="currency" :spark="SPARK_UP" :spark-previous="SPARK_PREV" range-start="Sep 1" range-end="Sep 30" />`),
  }),
}

export const Dark = { parameters: DARK, render: () => DashboardRow.render() }
