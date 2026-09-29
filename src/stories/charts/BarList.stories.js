/** COMPONENTS / Charts / Bar List → DsBarList.vue
 *  All data is SYNTHETIC (inline below), with fixed values. */
import DsBarList from '../../components/charts/DsBarList.vue'
import DsChartCard from '../../components/charts/DsChartCard.vue'
import { VALUE_FORMATS } from '../../components/charts/chartFormat.js'
import { frame, mobileFrame, DARK, LIGHT } from './_shared.js'

/** Room nights by hotel, September 2026 — seven hotels, so Default shows the
 *  top five and the other two still count toward "share". */
const HOTELS = [
  { key: 'hyatt', label: 'Hyatt Regency Seattle', value: 1284 },
  { key: 'marriott', label: 'Marriott Tempe at The Buttes', value: 1127 },
  { key: 'omni', label: 'Omni Tempe Hotel at ASU', value: 842 },
  { key: 'westin', label: 'The Westin Seattle', value: 516 },
  { key: 'sheraton', label: 'Sheraton Grand Phoenix', value: 377 },
  { key: 'hilton', label: 'Hilton Garden Inn Tempe', value: 204 },
  { key: 'kimpton', label: 'Kimpton Palladian Hotel', value: 96 },
]

/** Gross volume by customer — currency, with a sublabel. */
const CUSTOMERS = [
  { key: 'ef', label: 'Elena Fischer', sublabel: '14 payments', value: 18420.5 },
  { key: 'nk', label: 'Noah Klein', sublabel: '11 payments', value: 15206.0 },
  { key: 'ja', label: 'Jordan Alvarez', sublabel: '12 payments', value: 12988.75 },
  { key: 'hr', label: 'Hannah Reyes', sublabel: '9 payments', value: 9730.0 },
  { key: 'mw', label: 'Marcus Webb', sublabel: '6 payments', value: 7815.4 },
]

/** One channel reported nothing (null), one reported zero — two different facts. */
const MISSING_ZERO = [
  { key: 'web', label: 'Booking site', value: 842 },
  { key: 'agent', label: 'Agent-assisted', value: 311 },
  { key: 'group', label: 'Group block', value: 0 },
  { key: 'api', label: 'Partner API', value: null },
]

export default {
  title: 'Components/Charts/Bar List',
  component: DsBarList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**A ranked "top N" breakdown** — hotels, customers, payment methods. Each row is a thin bar (length ∝ value; the largest shown value fills the track), then the label, then the value right-aligned.

## When to use
- "Which ones, and how much?" for one measure across many named items, where the labels are long.
- Inside a card beside other breakdowns (dashboards, insights pages), where an axis and gridlines would be noise.
- Prefer **Bar** (horizontal) to compare categories against a shared, labelled axis; **Donut** for 2–5 parts of a whole; a **Table** for a long list of exact values.

## Props
| Prop | Type | Notes |
| --- | --- | --- |
| \`items\` | \`{ key, label, value, sublabel?, href? }[]\` | Non-negative values. \`null\` = missing ("—", no bar). \`href\` makes the label a link. |
| \`valueFormat\` / \`currency\` | | Formats through \`chartFormat.js\`, like every chart. |
| \`max\` | \`number\` | Rows shown (default 5). |
| \`showShare\` | \`boolean\` | Appends each row's % of the total of **all** reported items, not only the rows shown. |
| \`sort\` | \`desc · asc · none\` | Default \`desc\`. Missing rows always sort last. |
| \`loading\` / \`error\` / \`emptyText\` / \`ariaLabel\` | | Shared state and a11y props (\`@retry\` from the error state). |

## Usage
\`\`\`html
<ds-bar-list :items="hotels" value-format="currency" :max="5" />
\`\`\`

## Accessibility
It is a real list (\`<ul>\`/\`<li>\`): each row reads label → sublabel → value → share, in order. The bars are \`aria-hidden\` — every number they encode is in the text, so no hidden data table is needed. Bars use \`--ds-color-chart-1\` on a \`--ds-color-chart-track\` track, so they theme in dark mode.

## Missing vs. zero
A **zero** row keeps its (empty) track and reads $0.00 / 0; a **missing** row has no track and reads "—", with a note under the list.
`,
      },
    },
  },
  argTypes: {
    valueFormat: { control: 'select', options: VALUE_FORMATS },
    sort: { control: 'inline-radio', options: ['desc', 'asc', 'none'] },
    max: { control: { type: 'number', min: 1, max: 10 } },
    showShare: { control: 'boolean' },
    loading: { control: 'boolean' },
    error: { control: 'text' },
    items: { control: false },
  },
  args: {
    items: HOTELS,
    valueFormat: 'number',
    currency: 'USD',
    max: 5,
    showShare: false,
    sort: 'desc',
    loading: false,
    error: '',
    emptyText: 'No data for this period',
  },
}

const bound = (args, width = 560) => ({ components: { DsBarList }, setup: () => ({ args }), template: frame(`<ds-bar-list v-bind="args" />`, width) })

export const Default = { render: (args) => bound(args) }

/** Share is of all seven hotels, so the top five sum to less than 100%. */
export const WithShare = { name: 'With share %', args: { showShare: true }, render: (args) => bound(args) }

export const Currency = {
  args: { items: CUSTOMERS, valueFormat: 'currency' },
  render: (args) => bound(args),
}

/** "Group block" reported zero (empty track, 0); "Partner API" reported
 *  nothing (no track, "—") and sorts last. */
export const MissingAndZero = {
  name: 'Missing and zero',
  args: { items: MISSING_ZERO, showShare: true },
  render: (args) => bound(args),
}

export const Loading = { args: { loading: true }, render: (args) => bound(args) }

export const Empty = { args: { items: [] }, render: (args) => bound(args) }

export const ErrorState = { name: 'Error', args: { error: 'Hotel totals are unavailable (synthetic error).' }, render: (args) => bound(args) }

export const Mobile = {
  render: () => ({
    components: { DsBarList, DsChartCard },
    setup: () => ({ items: CUSTOMERS }),
    template: mobileFrame(`
      <ds-chart-card title="Top customers" subtitle="Synthetic">
        <ds-bar-list :items="items" value-format="currency" />
      </ds-chart-card>`),
  }),
}

const cardStory = {
  components: { DsBarList, DsChartCard },
  setup: () => ({ items: CUSTOMERS }),
  template: frame(`
    <ds-chart-card title="Top customers" subtitle="September 2026 · synthetic">
      <ds-bar-list :items="items" value-format="currency" show-share />
    </ds-chart-card>`, 560),
}
export const Light = { parameters: LIGHT, render: () => cardStory }
export const Dark = { parameters: DARK, render: () => cardStory }
