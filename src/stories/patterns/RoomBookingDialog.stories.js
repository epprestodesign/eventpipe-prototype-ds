// PATTERNS / Room Booking Dialog — a full item-detail modal that hosts the same
// reserve / hold booking experience as the Hotel Listing Card booking variants,
// laid out like an Uber Eats item dialog (image left, scrollable detail right,
// sticky CTA footer). Selections (nights, rooms, add-ons) drive the live total.
import { ref } from 'vue'
import RoomBookingDialog from '../../components/RoomBookingDialog.vue'

const base = {
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
const onBackdrop = (args) => ({
  components: { RoomBookingDialog },
  setup: () => ({ args }),
  template: `<div style="background:rgba(9,9,11,0.55);padding:40px;display:flex;justify-content:center;border-radius:16px"><room-booking-dialog v-bind="args" /></div>`,
})

export default {
  title: 'Browse Hotels/Room Booking Dialog',
  component: RoomBookingDialog,
  tags: ['autodocs'],
  argTypes: {
    bookingMode: { control: 'inline-radio', options: ['reserve', 'hold'] },
  },
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: `
## Overview
The **Room Booking Dialog** is a full item-detail modal that reuses the
**Hotel Listing Card** booking experience inside an Uber Eats-style layout:

- **Left** — a large hero image (pulled from the local imagery library).
- **Right** — scrollable room detail: title + nightly price, description,
  trust badge, room features, a "Most popular" add-on carousel, the booking
  section, and an "Enhance your stay" extras list.
- **Footer** — a sticky CTA whose total updates live as nights / rooms and
  add-ons are selected.

## Booking modes (\`bookingMode\`)
- **\`reserve\`** ("Book Reservations") — read-only nights availability;
  CTA reads **Reserve Room · total**.
- **\`hold\`** ("Hold Rooms for Group or Team") — per-night − / + steppers;
  CTA stays muted until rooms are selected, then reads **Add N to Cart · total**.

Built on DS tokens, shared with the Hotel Listing Card booking variants.
` } },
  },
}

/** Book Reservations mode — nights availability + Reserve Room CTA. */
export const Reserve = { render: () => onBackdrop({ ...base, bookingMode: 'reserve', seed: 0 }) }

/** Hold Rooms for Group or Team mode — per-night steppers + Add to Cart CTA. */
export const Hold = { render: () => onBackdrop({ ...base, bookingMode: 'hold', seed: 2 }) }

/** Launched from a button as a real Quasar dialog (click "Choose your room"). */
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
