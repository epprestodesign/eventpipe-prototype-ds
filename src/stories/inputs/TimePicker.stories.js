/** INPUTS / Time Picker → Quasar: QTime (native) */
import { ref } from 'vue'
export default {
  title: 'Components/Forms/Time Picker',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
Select a time of day (clock UI). Maps directly to **QTime**. In booking: estimated
**arrival time**, airport-transfer pickup, or a spa/dining reservation slot.

## When to use
- Estimated arrival time, transfer pickup, on-site reservation slots.

## When not to use
- A date → **Date Picker**.

## Quasar mapping
\`Time Picker → QTime\` (native). Supports \`format24h\`, \`:hour-options\` for windows.
` } } },
}

/** Estimated arrival time inside a field. */
export const ArrivalTime = {
  render: () => ({ setup: () => ({ time: ref('15:00') }), template: `
    <q-input v-model="time" outlined label="Estimated arrival" hint="Check-in from 3:00 PM" style="max-width:320px">
      <template #append>
        <q-icon name="schedule" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-time v-model="time" color="primary">
              <div class="row items-center justify-end"><q-btn v-close-popup label="Close" color="primary" flat /></div>
            </q-time>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>` }),
}

/** Basic — inline clock. */
export const Basic = {
  render: () => ({ setup: () => ({ time: ref('15:00') }), template: `<q-time v-model="time" color="primary" />` }),
}

/** Check-in window only (15:00–22:00) — restricts selectable hours (edge case). */
export const CheckInWindow = {
  render: () => ({ setup: () => ({ time: ref('15:00'), hours: [15,16,17,18,19,20,21,22] }), template: `<q-time v-model="time" format24h :hour-options="hours" color="primary" />` }),
}
