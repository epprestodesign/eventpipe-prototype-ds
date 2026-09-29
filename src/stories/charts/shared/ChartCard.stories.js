/** COMPONENTS / Charts / Shared Elements / Chart Card → DsChartCard.vue */
import { ref } from 'vue'
import DsChartCard from '../../../components/charts/DsChartCard.vue'
import DsBarChart from '../../../components/charts/DsBarChart.vue'
import { frame, DARK } from '../_shared.js'
import { CHANNEL_PERIODS } from '../fixtures/chartFixtures.js'

export default {
  title: 'Components/Charts/Shared Elements/Chart Card',
  component: DsChartCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
The standard container for any chart: **DsCard** surface + **Header** + the chart + optional footer.

| Prop / slot | Notes |
| --- | --- |
| \`title\` / \`subtitle\` | Header text. \`headingLevel\` (2–4) fits the page outline. |
| \`tableToggle\` | Adds a Chart / Table switch (buttons with \`aria-pressed\`). |
| \`view\` | \`chart · table\`, \`v-model:view\`. Passed to the default slot as \`{ view }\`. |
| \`#actions\` | Filters (period select, DsChoiceChips) — one row, right of the title. |
| \`#default="{ view }"\` | The chart. Bind \`:view="view"\` so the toggle reaches it. |
| \`#footer\` | Source / as-of / comparison note. |
`,
      },
    },
  },
  args: { title: 'By booking channel', subtitle: 'Sep 2026 vs Sep 2025 · synthetic', tableToggle: true },
}

export const Default = {
  render: (args) => ({
    components: { DsChartCard, DsBarChart },
    setup: () => ({ args, data: CHANNEL_PERIODS }),
    template: frame(`
      <ds-chart-card v-bind="args">
        <template #default="{ view }"><ds-bar-chart :labels="data.labels" :series="data.series" :view="view" /></template>
        <template #footer>Source: synthetic fixture · as of Sep 30, 2026</template>
      </ds-chart-card>`),
  }),
}

/** A header filter (Quasar select) plus the table toggle, and the view held
 *  outside the card with v-model:view. */
export const WithFilters = {
  name: 'With Filters',
  render: () => ({
    components: { DsChartCard, DsBarChart },
    setup() {
      const view = ref('chart')
      const period = ref('September 2026')
      return { view, period, data: CHANNEL_PERIODS }
    },
    template: frame(`
      <ds-chart-card v-model:view="view" title="By booking channel" subtitle="Synthetic" table-toggle>
        <template #actions>
          <q-select v-model="period" :options="['September 2026', 'August 2026']" outlined dense options-dense style="min-width:170px" aria-label="Period" />
        </template>
        <template #default="{ view }"><ds-bar-chart :labels="data.labels" :series="data.series" :view="view" /></template>
      </ds-chart-card>
      <p style="margin-top:8px; font-size:13px; color:var(--ds-color-text-subtle)">Current view: {{ view }}</p>`),
  }),
}

/** The table view — the accessible alternative, one click away. */
export const TableView = {
  name: 'Table View',
  render: () => ({
    components: { DsChartCard, DsBarChart },
    setup: () => ({ data: CHANNEL_PERIODS }),
    template: frame(`
      <ds-chart-card title="By booking channel" subtitle="Synthetic" table-toggle view="table">
        <template #default="{ view }"><ds-bar-chart :labels="data.labels" :series="data.series" :view="view" /></template>
      </ds-chart-card>`),
  }),
}

export const Dark = { parameters: DARK, render: (args) => Default.render(args) }
