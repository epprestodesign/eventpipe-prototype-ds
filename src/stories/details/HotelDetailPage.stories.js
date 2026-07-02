// HOTEL DETAILS / Book Reservation / Hotel Detail Page — the full detail screen
// for the single-reservation flow (gallery, tabs, summary header, rooms carousel
// of RoomCardReserve, about, amenities, policies).
import HotelDetailPage from '../../components/details/HotelDetailPage.vue'
import GlobalNav from '../../components/GlobalNav.vue'
import { popularAmenities, amenityGroups } from '../../lib/amenities.js'

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

const policies = [
  { title: 'Check-in', body: 'Check-in from 3 PM – 2:00 AM' },
  { title: 'Check-out', body: 'Check-out before noon' },
  { title: 'Children and extra beds', body: 'Extra beds depend on the room you choose. All children are welcome. When booking more than 5 rooms, different policies and additional supplements may apply.' },
]

export const base = {
  name: 'Hilton Orlando Lake Buena Vista',
  stars: 4,
  address: 'Lake Buena Vista, Orlando, FL',
  distance: '2.4 mi from venue',
  score: 4.5,
  reviews: 1284,
  ratingLabel: 'Excellent',
  popularAmenities: popularAmenities(),
  rooms: reserveRooms,
  roomsFlow: 'reserve',
  roomsSubtitle: 'Prices shown are per room per night for your selected dates.',
  about: 'Located in the heart of Lake Buena Vista, this resort is an ideal base for tournament weekends — minutes from the pitch, with top attractions, dining, and shopping just steps away. Relax in a newly renovated room after match day, unwind at the heated pool and spa, or refuel at one of three on-site restaurants. Complimentary premium Wi-Fi and a 24-hour fitness centre round out a stay built for teams and families alike.',
  amenityGroups: amenityGroups(),
  policies,
}

export default {
  title: 'Hotel Details/Book Reservation/Hotel Detail Page',
  component: HotelDetailPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: `
## Hotel Detail Page — Book Reservation
The full detail screen for the single-reservation flow, composed end-to-end:
photo gallery · sticky detail tabs · summary header · **Rooms** carousel
(RoomCardReserve, incl. a sold-out room) · about / amenities / policies.

> The summary mini-map needs a Google Maps API key at runtime.
` } } },
}

/** The full hotel detail screen — reserve room rates. */
export const Default = {
  render: () => ({ components: { HotelDetailPage }, setup: () => ({ args: base }), template: `<hotel-detail-page v-bind="args" />` }),
}

/** Full rendered page — under the persistent Global Nav with sub-hero + footer. */
export const FullPage = {
  render: () => ({
    components: { GlobalNav, HotelDetailPage },
    setup: () => ({ args: base, cart: {} }),
    template: `
      <div style="background:var(--ds-color-surface)">
        <global-nav brand="Soccer League" cart-mode="reserve" :cart="cart" />
        <div style="position:relative;color:#fff;padding:28px;min-height:120px;display:flex;align-items:center;justify-content:center;gap:18px;overflow:hidden;background:linear-gradient(90deg,rgba(1,17,62,.85),rgba(1,17,62,.6) 45%,rgba(1,17,62,.7)),var(--ds-palette-navy-900)">
          <div style="text-align:center">
            <h2 style="margin:0;font-size:1.5rem;font-weight:700">2025–2026 Soccer Season</h2>
            <p style="margin:2px 0 0;opacity:.85;font-size:.95rem">Secure Your Stay for Soccer — Rooms Going Fast!</p>
          </div>
        </div>
        <div style="padding-top:8px">
          <a style="display:inline-flex;align-items:center;gap:6px;max-width:1180px;margin:8px auto 0;padding:0 24px;width:100%;color:var(--ds-color-text);font-weight:500;font-size:.9375rem;cursor:pointer">‹ Back to Hotel listing</a>
          <hotel-detail-page v-bind="args" />
        </div>
        <footer style="background:var(--ds-palette-navy-950);color:#fff;padding:40px 24px;text-align:center;font-size:.85rem;opacity:.85">Powered by <strong>eventpipe</strong></footer>
      </div>
    `,
  }),
}
