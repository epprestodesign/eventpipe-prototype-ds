// INPUTS / Checkbox Tree — two-level tree; parent selects all children.
import { ref } from 'vue'
import DsCheckboxTree from '../../components/DsCheckboxTree.vue'

const brands = [
  { name: 'Choice Hotels', children: ['Cambria', 'Comfort', 'Quality Inn', 'Rodeway Inn'] },
  { name: 'Hilton Honors', children: ['Hampton', 'DoubleTree', 'Embassy Suites', 'Hilton Garden Inn'] },
  { name: 'Hyatt', children: ['Hyatt Place', 'Hyatt House', 'Grand Hyatt', 'Park Hyatt'] },
  { name: 'IHG Hotels & Resorts', children: ['Holiday Inn', 'Crowne Plaza', 'Staybridge Suites', 'Candlewood Suites'] },
]

export default {
  title: 'Components/Forms/Checkbox Tree',
  component: DsCheckboxTree,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
**Checkbox Tree** is a two-level checkbox tree: checking a parent selects all its
children (an indeterminate dash shows a partial selection); a chevron
expands/collapses. \`v-model\` is the list of selected child names. Extracted from
the brands filter.

\`\`\`html
<ds-checkbox-tree v-model="selected" :nodes="brands" :default-expanded="['Choice Hotels']" />
\`\`\`
` } } },
}

export const Brands = {
  render: () => ({
    components: { DsCheckboxTree },
    setup: () => ({ v: ref(['Cambria', 'Comfort']), brands }),
    template: `<div style="max-width:420px"><ds-checkbox-tree v-model="v" :nodes="brands" :default-expanded="['Choice Hotels']" /></div>`,
  }),
}
