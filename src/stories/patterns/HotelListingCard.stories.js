// PATTERNS / Hotel Listing Card — composite search-result card with a dynamic
// image carousel (sourced from the local imagery library) and conditional
// variants for deals, availability, trust badges, rating, layout, and loading.
import HotelListingCard from '../../components/HotelListingCard.vue'

const amenities = [
  { icon: 'wifi', label: 'Free Wi-Fi' },
  { icon: 'restaurant', label: 'Breakfast Included' },
  { icon: 'kitchen', label: 'Kitchen' },
]

// Base props mirroring the reference design.
const base = {
  name: 'Hilton Nashville Downtown',
  location: 'Nashville, TN',
  amenities,
  refundLabel: 'Fully Refundable',
  rating: 4.5,
  reviews: 120,
  price: 250,
  originalPrice: 278,
  total: 1225,
  discountLabel: '10% Off',
  badge: { label: 'Preferred Hotel', tone: 'teal' },
  availability: 'available',
}

const wrap = (extra = {}, style = 'max-width:1100px') => ({
  components: { HotelListingCard },
  setup: () => ({ args: { ...base, ...extra } }),
  template: `<div style="${style}"><hotel-listing-card v-bind="args" /></div>`,
})

export default {
  title: 'Browse Hotels/Hotel Listing Card',
  component: HotelListingCard,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    availability: { control: 'inline-radio', options: ['available', 'limited', 'soldout'] },
    bookingMode: { control: 'inline-radio', options: [null, 'reserve', 'hold'] },
    rating: { control: 'number' },
    loading: { control: 'boolean' },
  },
  parameters: { docs: { description: { component: `
## Overview
The **Hotel Listing Card** is the composite search-result card used on listings
and results pages. A single component renders many states through props:

- **Dynamic carousel** — photos pulled at runtime from the local imagery
  library (\`imagery.js\`) by category, with working ‹ › arrows + dot indicators.
- **Deal vs Standard** — discount badge + struck-through price appear only when
  \`originalPrice > price\`.
- **Availability** — \`available\`, \`limited\` ("Only N rooms left"), \`soldout\`
  (CTA disabled + overlay).
- **Trust badge** — \`Preferred Hotel\`, \`Member Price\`, \`New\`, or none.
- **Rating or New** — falls back to a "New" pill when \`rating\` is null.
- **Loading** — shimmer skeleton.

Built on DS tokens (Zinc/Poppins, palette ramps, radius/shadow tokens).

> **Note:** This card is now **horizontal-only**. The room-rate booking
> variants (reserve / hold) moved to **Hotel Details / Room Card**, and the
> \`vertical\` orientation is **deprecated** — see the Vertical Card story below.
` } } },
}

/** The reference design — deal pricing + Preferred Hotel badge. */
export const Default = { render: () => wrap() }

/** No active deal — single price, no discount badge or strikethrough. */
export const StandardPrice = {
  render: () => wrap({ discountLabel: '', originalPrice: null, badge: null, price: 250, total: 1225, seed: 1 }),
}

/** Urgency — limited rooms remaining. */
export const LimitedAvailability = {
  render: () => wrap({ availability: 'limited', roomsLeft: 2, badge: { label: 'Member Price', tone: 'blue' }, seed: 2 }),
}

/** Sold out — CTA disabled, media overlay, card dimmed. */
export const SoldOut = {
  render: () => wrap({ availability: 'soldout', discountLabel: '', originalPrice: null, badge: null, seed: 3 }),
}

/** A brand-new property with no reviews yet. */
export const NewHotel = {
  render: () => wrap({ name: 'The Bellwether Nashville', rating: null, reviews: 0, discountLabel: '', originalPrice: null, badge: { label: 'New', tone: 'emerald' }, seed: 4 }),
}

/** Trust badge options side by side. */
export const TrustBadges = {
  render: () => ({
    components: { HotelListingCard },
    setup: () => ({
      cards: [
        { ...base, badge: { label: 'Preferred Hotel', tone: 'teal' }, seed: 0 },
        { ...base, name: 'Omni Nashville Hotel', badge: { label: 'Member Price', tone: 'blue' }, discountLabel: '', originalPrice: null, seed: 1 },
        { ...base, name: 'The Bellwether Nashville', badge: { label: 'New', tone: 'emerald' }, rating: null, reviews: 0, discountLabel: '', originalPrice: null, seed: 4 },
      ],
    }),
    template: `<div style="max-width:1100px;display:flex;flex-direction:column;gap:16px"><hotel-listing-card v-for="(c,i) in cards" :key="i" v-bind="c" /></div>`,
  }),
}

/** Loading skeleton. */
export const Loading = { render: () => wrap({ loading: true }) }

/**
 * Group booking — adds an **Availability** secondary button beside the primary
 * CTA. It opens the [Availability Dialog](/?path=/docs/browse-hotels-availability-dialog--docs):
 * a compact hotel summary + a hold-mode rooms carousel for holding inventory.
 */
export const GroupBooking = {
  render: () => {
    const feat = (n) => [{ icon: 'wifi', label: 'Free WiFi' }, { icon: 'spa', label: 'Spa Access' }, { icon: 'straighten', label: `${n} sq ft` }]
    const nights = (p) => [
      { date: 'Tue, Jun 23', roomsLeft: 6, price: p },
      { date: 'Wed, Jun 24', roomsLeft: 7, price: p },
      { date: 'Thu, Jun 25', roomsLeft: 3, price: p + 18 },
    ]
    return wrap({
      groupBooking: true,
      ratingLabel: 'Excellent',
      availabilityRooms: [
        { roomType: 'King Bedroom', bedConfig: '1 King Bed', sleeps: 2, features: feat(241), price: 301, nights: nights(301), refundable: true, seed: 0 },
        { roomType: 'Double Queen Bedroom', bedConfig: '2 Queen Beds', sleeps: 4, features: feat(256), price: 363, nights: nights(363), refundable: false, seed: 1 },
        { roomType: 'Studio Suite', bedConfig: '1 King Bed + Sofa', sleeps: 3, features: feat(240), price: 401, nights: nights(401), refundable: true, seed: 2 },
      ],
    })
  },
}

/**
 * **Deprecated.** The vertical grid card (image top, content stacked).
 *
 * Kept for reference only. The listing experience now uses horizontal cards,
 * and the vertical room-rate variants moved to **Hotel Details / Room Card**.
 * Avoid using `orientation: 'vertical'` in new work.
 */
export const VerticalCard = {
  render: () => ({
    components: { HotelListingCard },
    setup: () => ({ args: { ...base, orientation: 'vertical' } }),
    template: `<hotel-listing-card v-bind="args" />`,
  }),
  parameters: { docs: { description: { story: 'Deprecated — use horizontal cards for listings and Hotel Details / Room Card for room rates.' } } },
}

/** Results list — the horizontal cards as they stack on a results page. */
export const ResultsGrid = {
  render: () => ({
    components: { HotelListingCard },
    setup: () => ({
      cards: [
        { ...base, seed: 0 },
        { ...base, name: 'Omni Nashville Hotel', availability: 'limited', roomsLeft: 3, discountLabel: '', originalPrice: null, badge: { label: 'Member Price', tone: 'blue' }, seed: 1 },
        { ...base, name: 'The Bellwether Nashville', rating: null, reviews: 0, discountLabel: '', originalPrice: null, badge: { label: 'New', tone: 'emerald' }, seed: 4 },
      ],
    }),
    template: `<div style="max-width:1100px;display:flex;flex-direction:column;gap:18px"><hotel-listing-card v-for="(c,i) in cards" :key="i" v-bind="c" /></div>`,
  }),
}
