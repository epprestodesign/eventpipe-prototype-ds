/** COMPONENTS / Navigation / Search → DsSearch.vue (pill input + results dropdown). */
import { ref, onMounted } from 'vue'
import DsSearch from '../../components/DsSearch.vue'

// Focus the inner input so focus-gated dropdown stories render the panel open.
function useAutoFocus() {
  const root = ref(null)
  onMounted(() => root.value?.querySelector('input')?.focus())
  return root
}

export default {
  title: 'Components/Navigation/Search',
  component: DsSearch,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
The standardized **Search** — a pill input with a leading magnifier, a clearable
value, and a floating results dropdown that opens while focused with a non-empty
query. Renders a centered empty state when a search returns nothing.
` } } },
}

const sample = [
  { id: 1, label: 'Grand Hyatt — New York', sublabel: 'Hotel · Midtown Manhattan' },
  { id: 2, label: 'Mike Addesa', sublabel: 'Guest · Confirmation #A4821' },
  { id: 3, label: 'Pipe #10293', sublabel: 'Room block · 42 rooms' },
]

export const Default = {
  render: () => ({
    components: { DsSearch },
    setup: () => ({ q: ref('') }),
    template: `<div style="max-width:360px"><ds-search v-model="q" /></div>`,
  }),
}

export const WithResults = {
  render: () => ({
    components: { DsSearch },
    setup: () => ({ q: ref('Grand'), results: sample, root: useAutoFocus() }),
    template: `<div ref="root" style="max-width:360px;min-height:280px"><ds-search v-model="q" :results="results" /></div>`,
  }),
}

export const NoResults = {
  render: () => ({
    components: { DsSearch },
    setup: () => ({ q: ref('zzzz'), root: useAutoFocus() }),
    template: `<div ref="root" style="max-width:360px;min-height:260px"><ds-search v-model="q" :results="[]" /></div>`,
  }),
}
