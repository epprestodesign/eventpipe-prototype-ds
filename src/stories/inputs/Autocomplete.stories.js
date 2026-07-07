/** INPUTS / Autocomplete → Quasar: QSelect use-input @filter (wrap as PrestoAutocomplete) */
import { ref } from 'vue'
const destinations = ['New York, USA', 'Paris, France', 'Tokyo, Japan', 'London, UK', 'Rome, Italy', 'Barcelona, Spain', 'Dubai, UAE', 'Sydney, Australia', 'Cancún, Mexico']
export default {
  title: 'Components/Forms/Autocomplete',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
A Select that lets users **type to filter** a large option set, with suggestions —
the destination/city/hotel search field at the top of every booking flow.

## When to use
- Long lists (destinations, cities, hotels) where typing beats scrolling.

## When not to use
- Short fixed lists → **Select**/**Radio Group**.

## Edge cases
- **No matches** → show a clear "No destinations found" empty option.
- **Loading** remote results → set \`loading\` while fetching.

## Quasar mapping
\`Autocomplete → QSelect use-input @filter\`. Recommended wrapper \`PrestoAutocomplete\`.
` } } },
}

export const Basic = {
  render: () => ({
    setup() {
      const model = ref(null)
      const options = ref(destinations)
      const filterFn = (val, update) => update(() => {
        const n = val.toLowerCase()
        options.value = destinations.filter((o) => o.toLowerCase().includes(n))
      })
      return { model, options, filterFn }
    },
    template: `
      <q-select v-model="model" :options="options" outlined use-input input-debounce="0"
        label="Where to?" @filter="filterFn" style="max-width:340px" clearable>
        <template #prepend><q-icon name="place" /></template>
        <template #no-option><q-item><q-item-section class="text-grey">No destinations found</q-item-section></q-item></template>
      </q-select>`,
  }),
}
