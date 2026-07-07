// INPUTS / Range — dual-handle range slider with a min/max readout.
import { ref } from 'vue'
import DsRange from '../../components/DsRange.vue'

export default {
  title: 'Components/Forms/Range',
  component: DsRange,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
**Range** is a dual-handle slider with a min/max readout. \`v-model\` is
\`{ min, max }\`. \`prefix\` + the auto "+" at the ceiling format the readout
(e.g. "$ 50" … "$ 1000+"). Extracted from the budget filter.

\`\`\`html
<ds-range v-model="budget" :min="20" :max="850" prefix="$ " />
\`\`\`
` } } },
}

export const Budget = {
  render: () => ({
    components: { DsRange },
    setup: () => ({ v: ref({ min: 120, max: 600 }) }),
    template: `<div style="max-width:420px"><ds-range v-model="v" :min="20" :max="850" :step="10" prefix="$ " /></div>`,
  }),
}
