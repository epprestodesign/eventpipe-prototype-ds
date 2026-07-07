/** NAVIGATION / Pagination → Quasar: QPagination (native) */
import { ref } from 'vue'
export default {
  title: 'Components/Navigation/Pagination',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
Navigate large result sets one page at a time.

## When to use
- Long lists/tables where loading everything is impractical.

## When not to use
- Continuous feeds → infinite scroll.

## Quasar mapping
\`Pagination → QPagination\` (native).
` } } },
}
export const Basic = {
  render: () => ({ setup: () => ({ page: ref(3) }), template: `<q-pagination v-model="page" :max="9" color="primary" />` }),
}
export const Rich = {
  render: () => ({ setup: () => ({ page: ref(3) }), template: `<q-pagination v-model="page" :max="15" :max-pages="6" boundary-numbers direction-links color="primary" />` }),
}
