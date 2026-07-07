/** INPUTS / Radio Group → Quasar: QOptionGroup (type=radio) / QRadio (native) */
import { ref } from 'vue'
export default {
  title: 'Components/Forms/Radio Group',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
Single choice from a small, visible set of mutually-exclusive options — rate
plans, bed type, or cancellation policy in a booking.

## When to use
- 2–6 options where seeing all choices at once helps the decision.

## When not to use
- Many options → **Select**. On/off → **Switch**/**Checkbox**.

## Quasar mapping
\`Radio Group → QOptionGroup type="radio"\` (or individual \`QRadio\`).
` } } },
}

export const RatePlan = {
  render: () => ({
    setup: () => ({ picked: ref('flex'), options: [
      { label: 'Free cancellation — $189/night', value: 'flex' },
      { label: 'Partially refundable — $169/night', value: 'semi' },
      { label: 'Non-refundable — $149/night', value: 'nonref' },
    ] }),
    template: `<q-option-group v-model="picked" :options="options" type="radio" color="primary" />`,
  }),
}

export const BedType = {
  render: () => ({
    setup: () => ({ picked: ref('king') }),
    template: `
      <div class="q-gutter-sm">
        <q-radio v-model="picked" val="king" label="1 King bed" color="primary" />
        <q-radio v-model="picked" val="twin" label="2 Twin beds" color="primary" />
      </div>`,
  }),
}
