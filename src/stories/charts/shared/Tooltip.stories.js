/** COMPONENTS / Charts / Shared Elements / Tooltip → DsChartTooltip.vue */
import DsChartTooltip from '../../../components/charts/DsChartTooltip.vue'
import DsLineChart from '../../../components/charts/DsLineChart.vue'
import DsChartCard from '../../../components/charts/DsChartCard.vue'
import { DARK } from '../_shared.js'
import { CHECKINS_MISSING } from '../fixtures/chartFixtures.js'

export default {
  title: 'Components/Charts/Shared Elements/Tooltip',
  component: DsChartTooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
The tooltip every chart shows on hover and keyboard focus. HTML, token-styled, \`position: fixed\` so a card's \`overflow\` cannot clip it; it flips to the left of the pointer near the right edge and clamps to the viewport.

Rows show every visible series at the hovered point. A missing value reads **No data** (italic, muted) — it is never shown as 0. Stacked percentage bars add the raw value beside the share.

\`inline\` renders it in normal flow (this page). Inside charts it is positioned by the chart.
`,
      },
    },
  },
  args: {
    inline: true,
    visible: true,
    title: 'Thu, Sep 10, 2026',
    rows: [
      { key: 'cur', label: 'Check-ins', color: 'chart-1', value: '166' },
      { key: 'prev', label: 'Same day, 2025', color: 'comparison', dashed: true, value: '145' },
    ],
  },
}

export const Default = {
  render: (args) => ({ components: { DsChartTooltip }, setup: () => ({ args }), template: `<ds-chart-tooltip v-bind="args" />` }),
}

export const WithMissingValue = {
  name: 'With Missing Value',
  args: {
    rows: [
      { key: 'cur', label: 'Check-ins', color: 'chart-1', missing: true },
      { key: 'prev', label: 'Same day, 2025', color: 'comparison', dashed: true, value: '145' },
    ],
  },
  render: (args) => Default.render(args),
}

export const WithShareDetail = {
  name: 'With Share Detail',
  args: {
    title: 'Bend Premier Cup',
    rows: [
      { key: 'c', label: 'Confirmed', color: 'chart-1', value: '82.2%', detail: '412' },
      { key: 'p', label: 'Pending', color: 'chart-2', value: '11.6%', detail: '58' },
      { key: 'x', label: 'Cancelled', color: 'chart-3', value: '6.2%', detail: '31' },
    ],
  },
  render: (args) => Default.render(args),
}

/** Live: hover the chart (or Tab to it and press →). The chart sits at the
 *  right edge of a card with overflow hidden — the tooltip still escapes. */
export const InChart = {
  name: 'In Chart (hover)',
  render: () => ({
    components: { DsLineChart, DsChartCard },
    setup: () => ({ data: CHECKINS_MISSING }),
    template: `
      <div style="max-width:620px; margin-left:auto; overflow:hidden;">
        <ds-chart-card title="Check-ins" subtitle="Synthetic · gaps are missing data">
          <ds-line-chart :labels="data.labels" :series="data.series" label-format="day" :height="220" />
        </ds-chart-card>
      </div>`,
  }),
}

export const Dark = { parameters: DARK, render: (args) => Default.render(args) }
