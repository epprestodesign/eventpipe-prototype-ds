// HOTEL DETAILS / Room Card / Book Reservations — vertical room card for the
// single-reservation flow, with availability edge cases.
import RoomCardReserve from '../../components/details/RoomCardReserve.vue'

const features = [
  { label: 'Entertainment', value: '2× 55" Smart TV, Premium Channels, High-Speed WiFi' },
  { label: 'Food & Drink', value: 'Coffee Maker, Mini Bar, Microwave, Mini Fridge' },
  { label: 'Need to know', value: 'Complimentary evening reception (drinks & snacks)' },
  { label: 'Non-smoking', value: 'Yes' },
]

export default {
  title: 'Hotel Details/Book Reservation/Room Card',
  component: RoomCardReserve,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Book Reservations room card
Vertical room card for the **Select Your Room** section (single-reservation flow):
room type · bed · occupancy · features · a per-night **rooms-left** list · price
(per room/night + stay total) · **Price Details** link + **Reserve Room** CTA.

**Edge cases:** available (green) · only-N-left (orange) · sold out (dimmed card,
disabled CTA).
` } } },
}

const base = {
  roomType: 'Two-Room Suite King', bedConfig: '1 King Bed, Separate Living Room',
  maxOccupancy: 4, features, pricePerNight: 269, total: 5821.56, roomCount: 6,
}
const render = (args) => ({ components: { RoomCardReserve }, setup: () => ({ args }), template: `<room-card-reserve v-bind="args" />` })

/** Available — plenty of rooms each night. */
export const Available = {
  render,
  args: { ...base, availability: 'available', nights: [
    { date: 'Thu, 7/9/2026', roomsLeft: 5 }, { date: 'Fri, 7/10/2026', roomsLeft: 6 }, { date: 'Sat, 7/11/2026', roomsLeft: 5 },
  ] },
}

/** Only a few rooms left — orange urgency. */
export const OnlyAFewLeft = {
  name: 'Only a Few Left',
  render,
  args: { ...base, availability: 'limited', nights: [
    { date: 'Thu, 7/9/2026', roomsLeft: 2 }, { date: 'Fri, 7/10/2026', roomsLeft: 1 }, { date: 'Sat, 7/11/2026', roomsLeft: 3 },
  ] },
}

/** Sold out — dimmed card, disabled CTA. */
export const SoldOut = {
  name: 'Sold Out',
  render,
  args: { ...base, availability: 'soldout', nights: [
    { date: 'Thu, 7/9/2026', roomsLeft: 0 }, { date: 'Fri, 7/10/2026', roomsLeft: 0 }, { date: 'Sat, 7/11/2026', roomsLeft: 0 },
  ] },
}

/** Two cards side by side (as on the results page). */
export const Pair = {
  render: () => ({
    components: { RoomCardReserve },
    setup: () => ({
      king: { ...base, availability: 'available', nights: [
        { date: 'Thu, 7/9/2026', roomsLeft: 2 }, { date: 'Fri, 7/10/2026', roomsLeft: 4 }, { date: 'Sat, 7/11/2026', roomsLeft: 5 },
      ] },
      dbl: { ...base, roomType: 'Two-Room Suite Double', bedConfig: '2 Double Beds, Separate Living Room', maxOccupancy: 6, pricePerNight: 289, total: 6252.36, availability: 'available', nights: [
        { date: 'Thu, 7/9/2026', roomsLeft: 1 }, { date: 'Fri, 7/10/2026', roomsLeft: 5 }, { date: 'Sat, 7/11/2026', roomsLeft: 4 },
      ] },
    }),
    template: `<div style="display:flex;gap:24px;flex-wrap:wrap;align-items:flex-start"><room-card-reserve v-bind="king" /><room-card-reserve v-bind="dbl" /></div>`,
  }),
}
