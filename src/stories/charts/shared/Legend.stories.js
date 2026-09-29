/** COMPONENTS / Charts / Shared Elements / Legend → DsChartLegend.vue */
import { ref } from 'vue'
import DsChartLegend from '../../../components/charts/DsChartLegend.vue'
import { DARK } from '../_shared.js'

const ITEMS = [
  { key: 'direct', label: 'Direct booking site', color: 'chart-1' },
  { key: 'group', label: 'Group blocks', color: 'chart-2' },
  { key: 'partner', label: 'Partner referrals', color: 'chart-3' },
  { key: 'phone', label: 'Phone', color: 'chart-4' },
  { key: 'walkin', label: 'Walk-in', color: 'chart-5' },
  { key: 'prev', label: 'Previous period', color: 'comparison', dashed: true },
]

export default {
  title: 'Components/Charts/Shared Elements/Legend',
  component: DsChartLegend,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
The HTML legend used by every chart. Swatches read the chart colour tokens directly, so they follow the theme; labels stay in text colours, never the series colour.

- **Interactive** (cartesian charts): each item is a toggle button with \`aria-pressed\`; hidden items show a hollow swatch and struck-through label.
- **Static** (donut): a list with value and share columns.
- A dashed swatch marks the comparison (previous-period) series, matching its dashed line.

This also documents the **categorical order**: slots 1–5 in fixed order, then the neutral comparison colour.
`,
      },
    },
  },
  args: { items: ITEMS, hidden: [], interactive: true, layout: 'row' },
  argTypes: { layout: { control: 'inline-radio', options: ['row', 'column'] } },
}

export const Default = {
  render: (args) => ({
    components: { DsChartLegend },
    setup() {
      const hidden = ref([...args.hidden])
      const toggle = (k) => { hidden.value = hidden.value.includes(k) ? hidden.value.filter((x) => x !== k) : [...hidden.value, k] }
      return { args, hidden, toggle }
    },
    template: `<div style="max-width:720px"><ds-chart-legend v-bind="args" :hidden="hidden" @toggle="toggle" /></div>`,
  }),
}

export const WithHiddenSeries = {
  name: 'With Hidden Series',
  args: { hidden: ['group', 'phone'] },
  render: (args) => Default.render(args),
}

export const StaticWithValues = {
  name: 'Static with Values',
  args: {
    interactive: false,
    layout: 'column',
    items: [
      { key: 'direct', label: 'Direct booking site', color: 'chart-1', value: '1,840', detail: '45.1%' },
      { key: 'group', label: 'Group blocks', color: 'chart-2', value: '1,320', detail: '32.4%' },
      { key: 'partner', label: 'Partner referrals', color: 'chart-3', value: '640', detail: '15.7%' },
      { key: 'phone', label: 'Phone', color: 'chart-4', value: '280', detail: '6.9%' },
    ],
  },
  render: (args) => ({ components: { DsChartLegend }, setup: () => ({ args }), template: `<div style="max-width:340px"><ds-chart-legend v-bind="args" /></div>` }),
}

export const Dark = { parameters: DARK, render: (args) => Default.render(args) }
