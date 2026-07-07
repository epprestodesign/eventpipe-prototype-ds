/** INPUTS / Slider → Quasar: QSlider (+ QRange) (native) */
import { ref } from 'vue'
export default {
  title: 'Components/Forms/Slider',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
Select a number (or a range) from a continuous or stepped scale.

## When to use
- Approximate values where direct manipulation helps (party size, price range).

## When not to use
- Precise/known values → **Text Field** (number).

## Quasar mapping
\`Slider → QSlider\`; range variant → \`QRange\` (native).
` } } },
}

export const Basic = {
  render: () => ({ setup: () => ({ v: ref(40) }), template: `<q-slider v-model="v" :min="0" :max="100" color="primary" style="max-width:360px" />` }),
}

export const Stepped = {
  render: () => ({ setup: () => ({ v: ref(60) }), template: `<q-slider v-model="v" :min="0" :max="100" :step="10" markers label label-always color="accent" style="max-width:360px" />` }),
}

export const Range = {
  render: () => ({ setup: () => ({ v: ref({ min: 20, max: 70 }) }), template: `<q-range v-model="v" :min="0" :max="100" label color="primary" style="max-width:360px" />` }),
}
