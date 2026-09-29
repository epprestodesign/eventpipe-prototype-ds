/** NAVIGATION / Pagination → DsPagination (wraps QPagination) */
import { ref } from 'vue'
import DsPagination from '../../components/DsPagination.vue'
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

## Component
\`DsPagination\` — the design system's pager, and what every paged table uses
(all EP Pay tables included). Its page control is the **Rich** configuration:
\`QPagination\` with boundary numbers, direction links, up to 6 page buttons,
primary colour. Pass \`total\`, \`pageSize\` and \`noun\` to add the
"Showing 11–20 of 33 payouts" summary a table footer needs.

\`\`\`html
<ds-pagination v-model="page" :total="rows.length" :page-size="10" noun="payouts" />
\`\`\`

**Basic** below is plain \`QPagination\`, kept for reference; use \`DsPagination\`.
` } } },
}
export const Basic = {
  render: () => ({ setup: () => ({ page: ref(3) }), template: `<q-pagination v-model="page" :max="9" color="primary" />` }),
}
/** The standard pager — this story renders the real DsPagination component. */
export const Rich = {
  render: () => ({ components: { DsPagination }, setup: () => ({ page: ref(3) }), template: `<ds-pagination v-model="page" :max="15" />` }),
}

/** In a table footer: the result summary on the left, the pager on the right. */
export const WithSummary = {
  name: 'With summary',
  render: () => ({
    components: { DsPagination },
    setup: () => ({ page: ref(2) }),
    template: `<div style="max-width:900px;"><ds-pagination v-model="page" :total="33" :page-size="10" noun="payouts" /></div>`,
  }),
}
