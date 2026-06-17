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

// Room-rate content shared by the two vertical booking variants (reserve / hold).
const roomRate = {
  roomType: 'Two-Room Suite King',
  bedConfig: '1 King Bed, Separate Living Room',
  maxOccupancy: 4,
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
  price: 269,
  total: 970.26,
  roomCount: 1,
}

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
- **Layout** — \`horizontal\` (row) or \`vertical\` (grid card) via \`orientation\`.
- **Booking variants** (vertical only) — \`bookingMode\` swaps the body for a
  room-rate detail card: \`reserve\` ("Book Reservations" → nights list +
  Reserve Room) or \`hold\` ("Hold Rooms for Group or Team" → per-night
  quantity steppers + Add to Cart).
- **Loading** — shimmer skeleton.

Built on DS tokens (Zinc/Poppins, palette ramps, radius/shadow tokens).
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

/** Vertical grid card — image top, content stacked. */
export const VerticalCard = {
  render: () => ({
    components: { HotelListingCard },
    setup: () => ({ args: { ...base, orientation: 'vertical' } }),
    template: `<hotel-listing-card v-bind="args" />`,
  }),
}

/**
 * Vertical booking variant — **Book Reservations** mode. Below the carousel:
 * room details, a "Nights" availability list, a pricing summary, and a
 * "Price Details" link beside the navy **Reserve Room** CTA.
 */
export const BookReservation = {
  render: () => ({
    components: { HotelListingCard },
    setup: () => ({ args: { ...base, ...roomRate, orientation: 'vertical', bookingMode: 'reserve' } }),
    template: `<hotel-listing-card v-bind="args" />`,
  }),
}

/**
 * Vertical booking variant — **Hold Rooms for Group or Team** mode. Each night
 * gets a functional − / + quantity stepper (clamped to rooms left); the
 * **Add to Cart** CTA stays muted until at least one room is selected, then
 * activates and shows the running count.
 */
export const HoldRoomsForGroup = {
  render: () => ({
    components: { HotelListingCard },
    setup: () => ({ args: { ...base, ...roomRate, orientation: 'vertical', bookingMode: 'hold' } }),
    template: `<hotel-listing-card v-bind="args" />`,
  }),
}

/** Both booking variants side by side for comparison. */
export const BookingModes = {
  render: () => ({
    components: { HotelListingCard },
    setup: () => ({
      reserve: { ...base, ...roomRate, orientation: 'vertical', bookingMode: 'reserve' },
      hold: { ...base, ...roomRate, orientation: 'vertical', bookingMode: 'hold', seed: 2 },
    }),
    template: `<div style="display:flex;gap:24px;flex-wrap:wrap;align-items:flex-start"><hotel-listing-card v-bind="reserve" /><hotel-listing-card v-bind="hold" /></div>`,
  }),
}

/** Results grid of vertical cards. */
export const ResultsGrid = {
  render: () => ({
    components: { HotelListingCard },
    setup: () => ({
      cards: [
        { ...base, orientation: 'vertical', seed: 0 },
        { ...base, name: 'Omni Nashville Hotel', orientation: 'vertical', availability: 'limited', roomsLeft: 3, discountLabel: '', originalPrice: null, badge: { label: 'Member Price', tone: 'blue' }, seed: 1 },
        { ...base, name: 'The Bellwether Nashville', orientation: 'vertical', rating: null, reviews: 0, discountLabel: '', originalPrice: null, badge: { label: 'New', tone: 'emerald' }, seed: 4 },
      ],
    }),
    template: `<div style="display:flex;gap:20px;flex-wrap:wrap"><hotel-listing-card v-for="(c,i) in cards" :key="i" v-bind="c" /></div>`,
  }),
}
