// DATA DISPLAY / Rating — read-only review-score display.
import DsRating from '../../components/DsRating.vue'

export default {
  title: 'Data Display/Rating',
  component: DsRating,
  tags: ['autodocs'],
  argTypes: {
    score: { control: 'text' },
    max: { control: 'inline-radio', options: [5, 10] },
    reviews: { control: 'number' },
    label: { control: 'text' },
    showStar: { control: 'boolean' },
    showMax: { control: 'boolean' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: { score: '8.6', max: 10, reviews: 1234, label: 'Excellent', showStar: true, showMax: true, size: 'md' },
  parameters: { docs: { description: { component: `
## Overview
**Rating** is the compact, read-only review-score shown on listing cards, saved
items, the map, and confirmation — e.g. \`★ 8.6/10 Excellent (1,234)\`. For
*collecting* a rating, use **Inputs / Rating**.

\`\`\`html
<ds-rating :score="3.8" :max="5" :reviews="3254" />
<ds-rating :score="8.6" :max="10" label="Excellent" :reviews="1234" />
\`\`\`
` } } },
}

export const Basic = {
  render: (args) => ({ components: { DsRating }, setup: () => ({ args }), template: `<ds-rating v-bind="args" />` }),
}

export const Scales = {
  render: () => ({
    components: { DsRating },
    template: `<div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start">
      <ds-rating :score="3.8" :max="5" :reviews="3254" />
      <ds-rating :score="8.6" :max="10" label="Excellent" :reviews="1234" />
      <ds-rating :score="4.9" :max="5" />
    </div>`,
  }),
}

export const Sizes = {
  render: () => ({
    components: { DsRating },
    template: `<div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start">
      <ds-rating size="sm" :score="4.2" :max="5" :reviews="980" />
      <ds-rating size="md" :score="4.2" :max="5" :reviews="980" />
      <ds-rating size="lg" :score="4.2" :max="5" :reviews="980" />
    </div>`,
  }),
}
