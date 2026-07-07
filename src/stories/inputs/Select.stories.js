/** INPUTS / Select → Quasar: QSelect (native) */
import { ref } from 'vue'
import DsSelect from '../../components/DsSelect.vue'
const roomTypes = ['Standard Queen', 'Deluxe King', 'Twin/Double', 'Ocean View Suite', 'Family Room', 'Executive Suite']
export default {
  title: 'Components/Forms/Select',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
Choose one or several values from a list. In booking flows: room type, bed
preference, number of rooms, or property filters.

## When to use
- 6+ options; multi-select with chips; grouped/option-rich data.

## When not to use
- 2–5 visible choices → **Radio Group**. Free text + suggestions → **Autocomplete**.

## Quasar mapping
\`Select → QSelect\` (native).
` } } },
}

export const Basic = {
  render: () => ({ setup: () => ({ v: ref('Deluxe King'), roomTypes }), template: `<q-select v-model="v" :options="roomTypes" outlined label="Room type" style="max-width:320px" />` }),
}

export const Multiple = {
  render: () => ({ setup: () => ({ v: ref(['Free WiFi', 'Breakfast included']), opts: ['Free WiFi','Breakfast included','Pool','Pet friendly','Free parking','Spa'] }), template: `<q-select v-model="v" :options="opts" outlined multiple use-chips label="Amenities" style="max-width:340px" />` }),
}

export const Rooms = {
  parameters: { docs: { description: { story: 'A compact occupancy selector — number of rooms.' } } },
  render: () => ({ setup: () => ({ v: ref(1), opts: [1,2,3,4,5] }), template: `<q-select v-model="v" :options="opts" outlined label="Rooms" style="max-width:200px" />` }),
}

/** EventPipe labeled select via DsSelect (the "Target Hotel" field) — gray label
 *  above, outlined control, chevron. Composes into the Form Field anatomy. */
export const Labeled = {
  render: () => ({
    components: { DsSelect },
    setup: () => ({ hotel: ref('Grand Plaza Hotel'), producer: ref(null),
      hotels: ['Grand Plaza Hotel', 'The Summit Lodge Denver', 'Pinnacle Hotel Denver', 'Skyline Suites Denver'],
      producers: ['Team Travel Source', 'Global Sports Group', 'Summit Events Co.'] }),
    template: `
      <div class="column q-gutter-lg" style="max-width:340px">
        <ds-select v-model="hotel" :options="hotels" label="Target Hotel" required />
        <ds-select v-model="producer" :options="producers" label="Event Producer" placeholder="Data" clearable
          tooltip="Who is running this event." />
      </div>`,
  }),
}
