// HOTEL DETAILS / Group Block / Hotel Detail Page — the full detail screen for
// the group-block flow (rooms carousel of RoomCardGroup with per-night steppers).
import HotelDetailPage from '../../components/details/HotelDetailPage.vue'
import { base } from './HotelDetailPage.stories.js'

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

const groupBase = {
  ...base,
  rooms: groupRooms,
  roomsFlow: 'group',
  roomsTitle: 'Hold Rooms for Your Group',
  roomsSubtitle: 'Choose how many rooms to hold each night.',
}

export default {
  title: 'Hotel Details/Group Block/Hotel Detail Page',
  component: HotelDetailPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: `
## Hotel Detail Page — Group Block
The full detail screen for the group-block flow — same composition as Book
Reservation, but the **Rooms** carousel renders RoomCardGroup cards with
per-night quantity steppers ("Hold Rooms for Your Group").
` } } },
}

/** The full hotel detail screen — group-block room holds. */
export const Default = {
  render: () => ({ components: { HotelDetailPage }, setup: () => ({ args: groupBase }), template: `<hotel-detail-page v-bind="args" />` }),
}
