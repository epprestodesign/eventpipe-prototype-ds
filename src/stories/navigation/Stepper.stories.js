/** NAVIGATION / Stepper → Quasar: QStepper + QStep (wrap as PrestoStepper) */
import { ref } from 'vue'
export default {
  title: 'Navigation/Stepper',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
Guides users through a sequential, multi-step task with clear progress.

## When to use
- Ordered flows (the booking funnel: dates → room → guest details → payment).

## When not to use
- Non-sequential views → **Tabs**.

## Quasar mapping
\`Stepper → QStepper + QStep\` (native). Recommended wrapper \`PrestoStepper\`.
` } } },
}
export const Basic = {
  render: () => ({ setup: () => ({ step: ref(1) }), template: `
    <q-stepper v-model="step" color="primary" animated style="max-width:600px">
      <q-step :name="1" title="Dates & guests" icon="event" :done="step > 1">Choose check-in/check-out and number of guests.</q-step>
      <q-step :name="2" title="Choose room" icon="king_bed" :done="step > 2">Pick a room type and rate plan.</q-step>
      <q-step :name="3" title="Guest details" icon="person" :done="step > 3">Enter the lead guest's contact info.</q-step>
      <q-step :name="4" title="Payment" icon="payments">Pay securely and confirm your reservation.</q-step>
      <template #navigation>
        <q-stepper-navigation>
          <q-btn v-if="step < 4" color="primary" label="Continue" @click="step++" />
          <q-btn v-if="step > 1" flat color="primary" label="Back" class="q-ml-sm" @click="step--" />
        </q-stepper-navigation>
      </template>
    </q-stepper>` }),
}
