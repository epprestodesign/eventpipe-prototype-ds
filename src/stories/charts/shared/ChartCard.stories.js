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
| \`title\` / \`subtitle\` | Header text. \`headingLevel\` (2–4) fits the page outline. Also the data modal's title / subtitle. |
| \`tableToggle\` | Adds a **View more** button (accessible name "View more: *title* data") that opens a DsModal (\`lg\`) with the chart's data as an interactive table: row search, sortable columns (\`aria-sort\`), show / hide series columns, a live "Showing N of M rows" count. The prop keeps its historical name — there is no in-card Chart / Table switch any more. |
| \`dataOpen\` | The data modal is open. \`v-model:data-open\`. Focus moves to the row search on open and back to View more on close. |
| \`view\` | What the card body's slot receives. Always \`chart\` in practice; \`view="table"\` is still honoured for backward compatibility. |
| \`#actions\` | Filters (period select, DsChoiceChips) — one row, right of the title, before View more. |
| \`#default="{ view }"\` | The chart. Bind \`:view="view"\`: the card renders this slot twice — in the card with \`view: 'chart'\`, in the modal with \`view: 'data'\` (the interactive table). |
| \`#footer\` | Source / as-of / comparison note. |
`,
      },
    },
  },
  args: { title: 'By booking channel', subtitle: 'Sep 2026 vs Sep 2025 · synthetic', tableToggle: true, dataOpen: false },
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

/** A header filter (Quasar select) beside View more, with the modal state held
 *  outside the card via v-model:data-open. */
export const WithFilters = {
  name: 'With Filters',
  render: () => ({
    components: { DsChartCard, DsBarChart },
    setup() {
      const dataOpen = ref(false)
      const period = ref('September 2026')
      return { dataOpen, period, data: CHANNEL_PERIODS }
    },
    template: frame(`
      <ds-chart-card v-model:data-open="dataOpen" title="By booking channel" subtitle="Synthetic" table-toggle>
        <template #actions>
          <q-select v-model="period" :options="['September 2026', 'August 2026']" outlined dense options-dense style="min-width:170px" aria-label="Period" />
        </template>
        <template #default="{ view }"><ds-bar-chart :labels="data.labels" :series="data.series" :view="view" /></template>
      </ds-chart-card>
      <p style="margin-top:8px; font-size:13px; color:var(--ds-color-text-subtle)">Data modal open: {{ dataOpen }}</p>`),
  }),
}

/** View more, opened: the same chart rendered as an interactive table in a
 *  DsModal — search rows, sort a column, show / hide a series. (Export name kept
 *  as `TableView` so the story id stays stable.) */
export const TableView = {
  name: 'View more (data modal open)',
  parameters: { docs: { story: { inline: false, height: '640px' } } },
  render: () => ({
    components: { DsChartCard, DsBarChart },
    setup: () => ({ dataOpen: ref(true), data: CHANNEL_PERIODS }),
    template: frame(`
      <ds-chart-card v-model:data-open="dataOpen" title="By booking channel" subtitle="Sep 2026 vs Sep 2025 · synthetic" table-toggle>
        <template #default="{ view }"><ds-bar-chart :labels="data.labels" :series="data.series" :view="view" /></template>
      </ds-chart-card>`),
  }),
}

export const Dark = { parameters: DARK, render: (args) => Default.render(args) }
