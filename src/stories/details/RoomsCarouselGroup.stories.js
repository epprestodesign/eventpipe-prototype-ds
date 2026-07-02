// HOTEL DETAILS / Group Block / Rooms — the "Select Your Room" carousel for the
// group-block flow. Lays out RoomCardGroup cards (per-night steppers) in a
// horizontal, scroll-snapping track. Sold-out rooms stay in the list (disabled).
import RoomsCarousel from '../../components/details/RoomsCarousel.vue'

const features = [
  { label: 'Entertainment', value: '55" Smart TV, Netflix, Apple TV' },
  { label: 'Food & Drink', value: 'Coffee Maker, Mini Fridge' },
  { label: 'Non-smoking', value: 'Yes' },
]
const gnights = (a, b, c, price) => [
  { date: 'Thu, 7/9/2026', roomsLeft: a, price }, { date: 'Fri, 7/10/2026', roomsLeft: b, price }, { date: 'Sat, 7/11/2026', roomsLeft: c, price },
]

const groupRooms = [
  { roomType: 'Urban King', bedConfig: '1 King Bed', maxOccupancy: 2, features, availability: 'available', nights: gnights(6, 8, 5, 179) },
  { roomType: 'Two-Room Suite King', bedConfig: '1 King Bed, Separate Living Room', maxOccupancy: 4, features, availability: 'available', nights: gnights(4, 5, 6, 269) },
  { roomType: 'Double Queen', bedConfig: '2 Queen Beds', maxOccupancy: 4, features, availability: 'limited', nights: gnights(2, 1, 3, 229) },
  { roomType: 'Accessible Queen', bedConfig: '1 Queen Bed', maxOccupancy: 2, features, availability: 'soldout', nights: gnights(0, 0, 0, 199) },
]

const wrap = (rooms, extra = {}) => ({
  components: { RoomsCarousel },
  setup: () => ({ args: { rooms, flow: 'group', ...extra } }),
  template: `<div style="max-width:1180px"><rooms-carousel v-bind="args" /></div>`,
})

export default {
  title: 'Hotel Details/Group Block/Rooms',
  component: RoomsCarousel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: `
## Rooms — Group Block
The "Select Your Room" carousel for the group-block flow: **RoomCardGroup** cards
(with per-night quantity steppers) in a horizontal, scroll-snapping track.
Sold-out rooms stay in the list (disabled), not removed.
` } } },
}

/** Full lineup — available, limited, and sold out; scrolls when it overflows. */
export const Default = {
  render: () => wrap(groupRooms, { title: 'Hold Rooms for Your Group', subtitle: 'Choose how many rooms to hold each night.' }),
}

/** Only two rooms — fits without scrolling, so the arrows are hidden. */
export const FewRooms = {
  render: () => wrap(groupRooms.slice(0, 2), { title: 'Hold Rooms for Your Group' }),
}
