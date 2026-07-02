// HOTEL DETAILS / Book Reservation / Rooms — the "Select Your Room" carousel for
// the single-reservation flow. Lays out RoomCardReserve cards in a horizontal,
// scroll-snapping track. Sold-out rooms stay in the list (disabled), not removed.
import RoomsCarousel from '../../components/details/RoomsCarousel.vue'

const features = [
  { label: 'Entertainment', value: '55" Smart TV, Netflix, Apple TV' },
  { label: 'Food & Drink', value: 'Coffee Maker, Mini Fridge' },
  { label: 'Non-smoking', value: 'Yes' },
]
const nights = (a, b, c) => [
  { date: 'Thu, 7/9/2026', roomsLeft: a }, { date: 'Fri, 7/10/2026', roomsLeft: b }, { date: 'Sat, 7/11/2026', roomsLeft: c },
]

const reserveRooms = [
  { roomType: 'Urban King', bedConfig: '1 King Bed', maxOccupancy: 2, features, pricePerNight: 179, total: 573.0, roomCount: 1, availability: 'available', nights: nights(5, 6, 5) },
  { roomType: 'Two-Room Suite King', bedConfig: '1 King Bed, Separate Living Room', maxOccupancy: 4, features, pricePerNight: 269, total: 5821.56, roomCount: 6, availability: 'available', nights: nights(2, 4, 5) },
  { roomType: 'Two-Room Suite Double', bedConfig: '2 Double Beds, Separate Living Room', maxOccupancy: 6, features, pricePerNight: 289, total: 6252.36, roomCount: 6, availability: 'limited', nights: nights(1, 2, 1) },
  { roomType: 'Accessible King', bedConfig: '1 King Bed', maxOccupancy: 2, features, pricePerNight: 189, total: 610.0, roomCount: 1, availability: 'soldout', nights: nights(0, 0, 0) },
]

const wrap = (rooms, extra = {}) => ({
  components: { RoomsCarousel },
  setup: () => ({ args: { rooms, flow: 'reserve', ...extra } }),
  template: `<div style="max-width:1180px"><rooms-carousel v-bind="args" /></div>`,
})

export default {
  title: 'Hotel Details/Book Reservation/Rooms',
  component: RoomsCarousel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: `
## Rooms — Book Reservation
The "Select Your Room" carousel for the single-reservation flow: **RoomCardReserve**
cards in a horizontal, scroll-snapping track (‹ › arrows or touch/trackpad swipe).
Sold-out rooms stay in the list (disabled), not removed.
` } } },
}

/** Full lineup — available, limited, and sold out; scrolls when it overflows. */
export const Default = { render: () => wrap(reserveRooms, { subtitle: 'Prices shown are per room per night for your selected dates.' }) }

/** Only two rooms — fits without scrolling, so the arrows are hidden. */
export const FewRooms = { render: () => wrap(reserveRooms.slice(0, 2)) }
