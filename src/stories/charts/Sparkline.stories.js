/** COMPONENTS / Charts / Sparkline → DsSparkline.vue
 *  All data is SYNTHETIC (fixtures/chartFixtures.js). */
import DsSparkline from '../../components/charts/DsSparkline.vue'
import { SPARK_UP, SPARK_DOWN, SPARK_FLAT, SPARK_MISSING, SPARK_PREV } from './fixtures/chartFixtures.js'

export default {
  title: 'Components/Charts/Sparkline',
  component: DsSparkline,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**A word-sized trend** — shape only, no axes, no tooltip. It sits beside a number that carries the magnitude (see **Metric Card**).

## Implementation note
Inline SVG, not the chart renderer: a sparkline has no interaction to power, dashboards show many at once, and SVG strokes read \`var(--ds-color-*)\` directly, so theme switching needs no JavaScript.

## Props
| Prop | Type | Notes |
| --- | --- | --- |
| \`data\` | \`(number \\| null)[]\` | \`null\` breaks the line (gap). |
| \`comparison\` | \`(number \\| null)[]\` | Previous period, neutral and dashed, behind. |
| \`tone\` | \`brand · positive · negative · neutral\` | Colour of the main line. Pair it with text — colour alone is not the trend. |
| \`area\` / \`showEndPoint\` | \`boolean\` | Light fill under the line; dot on the latest value. |
| \`height\` | \`number\` | Width fills the container. |
| \`ariaLabel\` / \`decorative\` | | Auto summary ("Trend up, from 12 to 29"); \`decorative\` hides it when adjacent text says the same. |

## Limitations
Scales to its own min/max (shape, not magnitude) — never compare two sparklines' heights.
`,
      },
    },
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['brand', 'positive', 'negative', 'neutral'] },
    height: { control: { type: 'range', min: 24, max: 96, step: 4 } },
    data: { control: false },
    comparison: { control: false },
  },
  args: { data: SPARK_UP, comparison: [], tone: 'brand', height: 40, area: false, showEndPoint: true },
}

const inline = (args) => ({
  components: { DsSparkline },
  setup: () => ({ args }),
  template: `<div style="width:240px"><ds-sparkline v-bind="args" /></div>`,
})

export const Default = { render: (args) => inline(args) }

export const PositiveTrend = {
  name: 'Positive Trend',
  args: { data: SPARK_UP, comparison: SPARK_PREV, tone: 'positive', area: true },
  render: (args) => inline(args),
}

export const NegativeTrend = {
  name: 'Negative Trend',
  args: { data: SPARK_DOWN, tone: 'negative', area: true },
  render: (args) => inline(args),
}

/** A flat series draws a flat line on the baseline — "nothing changed" is a
 *  result, not an empty box. */
export const FlatTrend = {
  name: 'Flat Trend',
  args: { data: SPARK_FLAT, tone: 'neutral' },
  render: (args) => inline(args),
}

/** Gaps where values were not reported; an isolated point keeps a dot. */
export const MissingData = {
  name: 'Missing Data',
  args: { data: SPARK_MISSING },
  render: (args) => inline(args),
}

/** In a table row — the typical sparkline context. */
export const InTableRow = {
  name: 'In Table Row',
  render: () => ({
    components: { DsSparkline },
    setup: () => ({ rows: [
      { name: 'Bend Premier Cup', value: '1,204', data: SPARK_UP, tone: 'brand' },
      { name: 'Show-Me State Games', value: '862', data: SPARK_DOWN, tone: 'negative' },
      { name: 'Oregon Super Cup', value: '430', data: SPARK_FLAT, tone: 'neutral' },
    ] }),
    template: `
      <table class="ds-table" style="border-collapse:collapse; min-width:480px; color:var(--ds-color-text);">
        <thead><tr>
          <th style="text-align:left; padding:8px 12px; border-bottom:1px solid var(--ds-color-border);">Event (synthetic)</th>
          <th style="text-align:right; padding:8px 12px; border-bottom:1px solid var(--ds-color-border);">Room nights</th>
          <th style="padding:8px 12px; border-bottom:1px solid var(--ds-color-border);">12-week trend</th>
        </tr></thead>
        <tbody><tr v-for="r in rows" :key="r.name">
          <td style="padding:8px 12px; border-bottom:1px solid var(--ds-color-border);">{{ r.name }}</td>
          <td style="padding:8px 12px; text-align:right; font-variant-numeric:tabular-nums; border-bottom:1px solid var(--ds-color-border);">{{ r.value }}</td>
          <td style="padding:8px 12px; width:140px; border-bottom:1px solid var(--ds-color-border);"><ds-sparkline :data="r.data" :tone="r.tone" :height="28" /></td>
        </tr></tbody>
      </table>`,
  }),
}
