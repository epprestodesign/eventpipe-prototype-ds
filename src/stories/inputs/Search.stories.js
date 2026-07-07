/** COMPONENTS / Forms / Search → search field (QInput with search affordances). */
import { ref } from 'vue'
import DsInput from '../../components/DsInput.vue'

export default {
  title: 'Components/Forms/Search',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
A **Search field** — a text input with a leading magnifier, clearable value, and
debounced input. The standalone version of the App Bar search.
` } } },
}

export const Default = {
  render: () => ({
    setup: () => ({ q: ref('') }),
    template: `
      <div style="max-width:360px">
        <q-input v-model="q" outlined dense clearable debounce="300" placeholder="Search" hide-bottom-space>
          <template #prepend><q-icon name="search" /></template>
        </q-input>
      </div>`,
  }),
}

export const Labeled = {
  render: () => ({
    components: { DsInput },
    setup: () => ({ q: ref('') }),
    template: `<div style="max-width:360px"><ds-input v-model="q" label="Search requests" placeholder="Guest, Pipe ID, hotel…" clearable /></div>`,
  }),
}
