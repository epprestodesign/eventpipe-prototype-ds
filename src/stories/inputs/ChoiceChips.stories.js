// INPUTS / Choice Chips — single or multi-select chip toggle group.
import { ref } from 'vue'
import DsChoiceChips from '../../components/DsChoiceChips.vue'

export default {
  title: 'Components/Forms/Choice Chips',
  component: DsChoiceChips,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
**Choice Chips** are a chip toggle group for single or multi-select. Options are
plain strings or \`{ value, label, icon }\`. \`v-model\` is an array (multi) or a
single value. Used for star rating, hotel class, and similar filters.

\`\`\`html
<ds-choice-chips v-model="stars" :options="[{value:5,label:'5',icon:'star'}]" multiple />
\`\`\`
` } } },
}

export const StarRating = {
  render: () => ({
    components: { DsChoiceChips },
    setup: () => ({ v: ref([4, 5]), opts: [1, 2, 3, 4, 5].map((n) => ({ value: n, label: String(n), icon: 'star' })) }),
    template: `<div style="max-width:420px"><ds-choice-chips v-model="v" :options="opts" multiple /></div>`,
  }),
}

export const SingleSelect = {
  name: 'Single select',
  render: () => ({
    components: { DsChoiceChips },
    setup: () => ({ v: ref('any'), opts: [{ value: 'any', label: 'Any' }, { value: 'free', label: 'Free cancellation' }, { value: 'breakfast', label: 'Breakfast' }] }),
    template: `<div style="max-width:420px"><ds-choice-chips v-model="v" :options="opts" :multiple="false" /></div>`,
  }),
}
