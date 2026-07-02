// HOTEL DETAILS / Group Block / Room Booking Dialog — the same item-detail modal
// hosting the group-block (hold) booking experience: per-night − / + steppers,
// with a CTA that stays muted until rooms are selected, then Add N to Cart.
import { ref } from 'vue'
import RoomBookingDialog from '../../components/RoomBookingDialog.vue'
import { base, onBackdrop } from './RoomBookingDialog.stories.js'

export default {
  title: 'Hotel Details/Group Block/Room Booking Dialog',
  component: RoomBookingDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: `
## Room Booking Dialog — Group Block
The item-detail modal hosting the **hold** booking experience: per-night − / +
steppers to hold inventory. The CTA stays muted until rooms are selected, then
reads **Add N to Cart · total**.
` } },
  },
}

/** Hold Rooms for Group or Team mode — per-night steppers + Add to Cart CTA. */
export const Hold = { render: () => onBackdrop({ ...base, bookingMode: 'hold', seed: 2 }) }

/** Launched from a button as a real Quasar dialog. */
export const LaunchFromButton = {
  render: () => ({
    components: { RoomBookingDialog },
    setup: () => {
      const open = ref(false)
      return { open, args: { ...base, bookingMode: 'hold', seed: 1 } }
    },
    template: `
      <div style="padding:40px">
        <q-btn unelevated no-caps color="primary" label="Choose your room" @click="open = true" />
        <q-dialog v-model="open">
          <room-booking-dialog v-bind="args" @close="open = false" />
        </q-dialog>
      </div>`,
  }),
}
