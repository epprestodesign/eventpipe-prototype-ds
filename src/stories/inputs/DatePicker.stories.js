/** INPUTS / Date Picker → Quasar: QDate (native) */
import { ref } from 'vue'
export default {
  title: 'Components/Forms/Date Picker',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
Select check-in / check-out dates. Maps directly to **QDate**. The core input of
the hotel search — almost always a **range** (stay length), shown in a popup field.

## When to use
- Choosing check-in/check-out, changing dates on an existing reservation.

## When not to use
- Arrival time of day → **Time Picker**. Free numeric entry → **Text Field**.

## States
Default · range (stay) · multiple · min-date (no past dates) · disabled.

## Edge cases
- **No past dates**: set \`:options\` to disable days before today.
- **Minimum stay** / sold-out nights: disable specific dates via \`:options\`.
- **Same-day check-in/out** not allowed: validate that check-out > check-in.

## Accessibility
Keep the field keyboard-editable; the calendar is a supplementary picker. Label clearly.

## Quasar mapping
\`Date Picker → QDate\` (native). Value is a string mask (default \`YYYY/MM/DD\`).
` } } },
}

/** Stay dates — the primary booking pattern (range in a field). */
export const StayDates = {
  parameters: { docs: { description: { story: 'Check-in → check-out range inside a field — the standard hotel search input.' } } },
  render: () => ({
    setup() {
      const range = ref({ from: '2026/06/02', to: '2026/06/06' })
      const label = ref('Jun 2 – Jun 6 · 4 nights')
      return { range, label }
    },
    template: `
      <q-input :model-value="label" readonly outlined label="Check-in — Check-out" style="max-width:340px">
        <template #prepend><q-icon name="event" /></template>
        <template #append>
          <q-icon name="expand_more" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="range" range color="primary">
                <div class="row items-center justify-end"><q-btn v-close-popup label="Apply" color="primary" flat /></div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>`,
  }),
}

/** Inline single-date calendar. */
export const Basic = {
  render: () => ({ setup: () => ({ date: ref('2026/06/02') }), template: `<q-date v-model="date" color="primary" />` }),
}

/** Range — select a stay span. */
export const Range = {
  render: () => ({ setup: () => ({ range: ref({ from: '2026/06/02', to: '2026/06/06' }) }), template: `<q-date v-model="range" range color="primary" />` }),
}

/** No past dates — disables days before today (edge case). */
export const NoPastDates = {
  render: () => ({
    setup() {
      const date = ref('2026/06/10')
      const notPast = (d) => d >= '2026/06/02'
      return { date, notPast }
    },
    template: `<q-date v-model="date" :options="notPast" color="primary" />`,
  }),
}
