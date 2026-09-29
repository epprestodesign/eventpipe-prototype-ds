/** COMPONENTS / Charts / Shared Elements / States → DsChartState.vue */
import DsChartState from '../../../components/charts/DsChartState.vue'
import { DARK } from '../_shared.js'

export default {
  title: 'Components/Charts/Shared Elements/States',
  component: DsChartState,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
The non-data states every chart shares, sized to the plot height so the layout does not jump when data arrives. Charts pick the state themselves from their props; this component is exported for custom visualisations.

| State | Means | Is **not** |
| --- | --- | --- |
| \`loading\` | Request in flight. Announced politely. | — |
| \`error\` | Request failed; optional **Retry** (\`@retry\`). | Empty. |
| \`empty\` | Nothing to plot — no categories / no series. | Zero. |
| \`missing\` | Categories exist; no value was reported for any of them. | Zero, and not Empty. |

**Zero** is not a state: an all-zero dataset renders the chart on its baseline with a note, because zero is a measurement.
`,
      },
    },
  },
  args: { state: 'empty', height: 220, message: '' },
  argTypes: { state: { control: 'inline-radio', options: ['loading', 'error', 'empty', 'missing'] } },
}

const one = (args) => ({ components: { DsChartState }, setup: () => ({ args }), template: `<div style="max-width:560px"><ds-chart-state v-bind="args" /></div>` })

export const Default = { render: (args) => one(args) }

export const AllStates = {
  name: 'All States',
  render: () => ({
    components: { DsChartState },
    template: `
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:16px; max-width:1040px;">
        <ds-chart-state state="loading" :height="180" />
        <ds-chart-state state="error" :height="180" message="The service did not respond." />
        <ds-chart-state state="empty" :height="180" message="No bookings in this period." />
        <ds-chart-state state="missing" :height="180" message="Nothing was reported. This is not the same as zero." />
      </div>`,
  }),
}

export const Dark = { parameters: DARK, render: () => AllStates.render() }
