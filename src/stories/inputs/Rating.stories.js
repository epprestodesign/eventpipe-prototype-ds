/** INPUTS / Rating → Quasar: QRating (native) */
import { ref } from 'vue'
export default {
  title: 'Components/Forms/Rating',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
Capture or display a discrete score — a guest's hotel review, or a property's
star rating in search results.

## When to use
- Star ratings on listings; collecting post-stay guest reviews.

## When not to use
- Precise numeric input → **Slider**/**Text Field**.

## Quasar mapping
\`Rating → QRating\` (native). Use \`readonly\` to display a property's average score.
` } } },
}

export const StarRating = {
  render: () => ({ setup: () => ({ v: ref(4) }), template: `<q-rating v-model="v" :max="5" size="2em" color="primary" />` }),
}

export const PropertyScore = {
  parameters: { docs: { description: { story: 'Read-only average rating shown on a hotel listing.' } } },
  render: () => ({ template: `
    <div class="row items-center q-gutter-sm">
      <q-rating :model-value="4.5" :max="5" size="1.6em" color="primary" icon="star" icon-half="star_half" readonly />
      <span class="text-body2 text-grey-8">4.5 · 1,284 reviews</span>
    </div>` }),
}

export const ReviewInput = {
  render: () => ({ setup: () => ({ v: ref(0) }), template: `
    <div class="column q-gutter-sm">
      <div class="text-body2">How was your stay?</div>
      <q-rating v-model="v" :max="5" size="2.2em" icon="sentiment_dissatisfied" icon-selected="sentiment_very_satisfied" color="primary" />
    </div>` }),
}
