// HOTEL DETAILS / Book Reservation / Room Booking Dialog — a full item-detail
// modal (Uber Eats-style) hosting the reserve booking experience: image left,
// scrollable detail right, sticky CTA footer whose total updates live.
import { ref } from 'vue'
import RoomBookingDialog from '../../components/RoomBookingDialog.vue'

export const base = {
  roomType: 'Two-Room Suite King',
  bedConfig: '1 King Bed, Separate Living Room',
  maxOccupancy: 4,
  badge: { label: 'Preferred Hotel', tone: 'teal' },
  roomDetails: [
    { label: 'Entertainment', value: '2× 55" Smart TV, Premium Channels, High-Speed WiFi' },
    { label: 'Food & Drink', value: 'Coffee Maker, Mini Bar, Microwave, Mini Fridge' },
    { label: 'Need to know', value: 'Complimentary evening reception (drinks & snacks)' },
    { label: 'Non-smoking', value: 'Yes' },
  ],
  nights: [
    { date: 'Tue, 6/23/2026', roomsLeft: 4, price: 269 },
    { date: 'Wed, 6/24/2026', roomsLeft: 5, price: 269 },
    { date: 'Thu, 6/25/2026', roomsLeft: 6, price: 269 },
  ],
  extras: [
    { id: 'breakfast', label: 'Breakfast for Two', price: 25, popular: true, note: 'Added by 5+ guests' },
    { id: 'late', label: 'Late Checkout (2 PM)', price: 30, popular: true, note: 'Added by 5+ guests' },
    { id: 'transfer', label: 'Airport Transfer', price: 45, popular: true, note: 'Recommended' },
    { id: 'spa', label: 'Spa & Wellness Access', price: 60 },
    { id: 'parking', label: 'Valet Parking', price: 35 },
    { id: 'champagne', label: 'Welcome Champagne', price: 40 },
  ],
  price: 269,
  total: 970.26,
}

// Render the dialog surface on a dimmed backdrop to evoke the modal context.
export const onBackdrop = (args) => ({
  components: { RoomBookingDialog },
  setup: () => ({ args }),
  template: `<div style="background:rgba(1,17,62,0.55);padding:40px;display:flex;justify-content:center;border-radius:16px"><room-booking-dialog v-bind="args" /></div>`,
})

export default {
  title: 'Hotel Details/Book Reservation/Room Booking Dialog',
  component: RoomBookingDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: `
## Room Booking Dialog — Book Reservation
A full item-detail modal (Uber Eats-style) hosting the **reserve** booking
experience: large hero image (left), scrollable room detail (right), and a sticky
CTA footer. Nights availability is read-only; the CTA reads **Reserve Room · total**.
` } },
  },
}

/** Book Reservations mode — nights availability + Reserve Room CTA. */
export const Reserve = { render: () => onBackdrop({ ...base, bookingMode: 'reserve', seed: 0 }) }

/** Launched from a button as a real Quasar dialog. */
export const LaunchFromButton = {
  render: () => ({
    components: { RoomBookingDialog },
    setup: () => {
      const open = ref(false)
      return { open, args: { ...base, bookingMode: 'reserve', seed: 1 } }
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
