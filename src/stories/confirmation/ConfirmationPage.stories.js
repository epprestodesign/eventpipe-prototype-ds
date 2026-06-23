// CONFIRMATION / Confirmation Page — the post-checkout success screen.
// Two variants mirror the two booking journeys: a single hotel **Reservation**
// and a group/team **Group Hold** room block.
import ConfirmationPage from '../../components/confirmation/ConfirmationPage.vue'

// Shared post-booking content (area tips + FAQ) reused by both variants.
const areaTips = [
  { icon: 'restaurant', title: 'Eat nearby', text: 'Plenty of cafés and family-friendly restaurants within a 5-minute walk.' },
  { icon: 'directions_transit', title: 'Getting around', text: 'A transit stop is one block away; downtown is a 10-minute ride.' },
  { icon: 'local_parking', title: 'Parking', text: 'On-site self-parking is available; garage entrance is on the north side.' },
]
const faqs = [
  { q: 'What time is check-in and check-out?', a: 'Check-in begins at 3:00pm and check-out is at 11:00am. Early check-in may be available on request.' },
  { q: 'Can I modify or cancel my booking?', a: 'Yes — use Change or Cancel above. Free cancellation applies up until the date shown in the cancellation policy.' },
  { q: 'Is breakfast included?', a: 'A complimentary breakfast is included with this rate and served daily from 6:30–10:00am.' },
  { q: 'Is parking available?', a: 'On-site self-parking is available. See the location details for the garage entrance.' },
  { q: 'Are pets allowed?', a: 'This property is pet friendly. A small cleaning fee may apply — contact the hotel for details.' },
  { q: 'How do I get help during my stay?', a: 'Use the “Need help?” options below to call or email our support team anytime.' },
]
const help = { phone: '+1 (800) 555-0142', email: 'youraccount@eventpipe.com' }

// Single hotel stay — matches the Expedia-style confirmation reference.
const reserveData = {
  itinerary: '72055771948934',
  email: 'youraccount@eventpipe.com',
  hotel: {
    name: 'Days Inn by Wyndham Carson City',
    location: 'Carson City',
    rating: { score: '7.0/10', label: 'Good', reviews: 1003 },
    checkIn: 'Mon, Jul 1, 3:00pm',
    checkOut: 'Tue, Jul 2, 11:00am',
    roomTitle: 'Room, 1 Queen Bed, Non Smoking',
    features: [
      { icon: 'bed', label: '1 Queen Bed' },
      { icon: 'group', label: 'Sleeps 2' },
      { icon: 'free_breakfast', label: 'Breakfast included' },
      { icon: 'pets', label: 'Pet friendly' },
    ],
  },
  party: [
    { name: 'Alex Smith', role: 'You', status: 'host' },
    { name: 'Unknown Guest', status: 'unknown' },
  ],
  cancellation: {
    freeUntil: 'Thu, Oct 10, 4:00pm',
    text: 'A cancellation fee will not be charged if you cancel before Thu, Oct 10 at 4:00pm. If you cancel after that, you agree to be charged a fee of $128.00. Any waiver of the fee is at the sole discretion of the property.',
  },
  location: { lat: 39.1638, lng: -119.7674, address: '4100 N Carson St, Carson City, NV 89706', label: 'Days Inn by Wyndham Carson City' },
  areaTips,
  faqs,
  help,
}

// Group/team room block — one card per hotel, rooms held by night.
const holdData = {
  blockName: 'Spring Cup — Eagles SC',
  itinerary: '72055771948934',
  email: 'youraccount@eventpipe.com',
  teams: [
    { name: 'Eagles SC', ageDivision: 'U14', gender: 'Boys' },
    { name: 'Eagles SC', ageDivision: 'U12', gender: 'Girls' },
    { name: 'Arsenal U16 Boys' },
    { name: 'Chelsea U10 Girls' },
  ],
  party: [
    { name: 'Coach Lee', role: 'Organizer', status: 'host' },
    { name: 'Jordan Maye', role: 'Assistant', status: 'invited' },
    { name: 'Unknown Guest', status: 'unknown' },
  ],
  cancellation: {
    freeUntil: 'Mon, Jun 16, 4:00pm',
    text: 'Held rooms can be released without charge until Mon, Jun 16 at 4:00pm. After that, unreleased rooms in the block may be subject to the property’s group cancellation terms. Contact us to adjust your block.',
  },
  location: { lat: 41.8888, lng: -87.6256, address: '511 N Columbus Dr, Chicago, IL 60611', label: 'Embassy Suites Chicago Downtown' },
  areaTips: [
    { icon: 'sports_soccer', title: 'Near the fields', text: 'The tournament complex is a 12-minute drive; shuttle pickup is out front.' },
    { icon: 'restaurant', title: 'Team meals', text: 'Several large-group restaurants nearby can seat a full roster — reserve ahead.' },
    { icon: 'local_parking', title: 'Bus parking', text: 'Oversized-vehicle parking is available; ask the front desk for the permit.' },
  ],
  faqs,
  help,
  hotels: [
    {
      name: 'Embassy Suites Chicago Downtown',
      location: 'Chicago, IL',
      rating: { score: '8.6/10', label: 'Excellent', reviews: 2417 },
      rooms: [
        { type: 'Two-Room Suite King', summary: '1 King Bed · Sleeps 4', nights: [
          { date: 'Tue, Jun 23', qty: 4 }, { date: 'Wed, Jun 24', qty: 1 },
        ] },
        { type: 'Two-Room Suite Double', summary: '2 Queen Beds · Sleeps 4', nights: [
          { date: 'Tue, Jun 23', qty: 1 },
        ] },
      ],
    },
    {
      name: 'The Concord Hotel',
      location: 'Chicago, IL',
      rating: { score: '8.1/10', label: 'Very good', reviews: 1190 },
      rooms: [
        { type: 'King Studio', summary: '1 King Bed · Sleeps 2', nights: [
          { date: 'Tue, Jun 23', qty: 1 },
        ] },
      ],
    },
  ],
}

// Multiple room reservations — one card per reservation, rooms with occupancy.
// Edge cases: (1) one reservation with two differently-occupied rooms (2 adults
// + 1 child, and a 1-guest room); (2) the same guest with one room today and one
// room at a different hotel tomorrow — two separate reservation cards.
const reservationsData = {
  heading: 'Your reservations are confirmed!',
  ctaLabel: 'View your trips',
  itinerary: '72055771948934',
  email: 'youraccount@eventpipe.com',
  reservations: [
    // Edge case 1 — one reservation, two rooms with different occupancy.
    {
      hotel: {
        name: 'Hilton Orlando Lake Buena Vista',
        location: 'Orlando, FL',
        rating: { score: '8.8/10', label: 'Excellent', reviews: 3120 },
      },
      checkIn: 'Mon, Jun 29, 3:00pm',
      checkOut: 'Wed, Jul 1, 11:00am',
      rooms: [
        { label: 'Room 1', type: 'King Room', summary: '1 King Bed · Sleeps 3', guests: '2 adults · 1 child' },
        { label: 'Room 2', type: 'Queen Room', summary: '1 Queen Bed · Sleeps 2', guests: '1 adult' },
      ],
    },
    // Edge case 2a — one guest, one room, checking in today.
    {
      hotel: {
        name: 'Omni Orlando Resort at ChampionsGate',
        location: 'ChampionsGate, FL',
        rating: { score: '8.4/10', label: 'Very good', reviews: 1985 },
      },
      checkIn: 'Tue, Jun 23, 3:00pm',
      checkOut: 'Wed, Jun 24, 11:00am',
      rooms: [
        { label: 'Room 1', type: 'Double Queen Room', summary: '2 Queen Beds · Sleeps 4', guests: '1 adult' },
      ],
    },
    // Edge case 2b — same guest, one room at a different hotel, checking in tomorrow.
    {
      hotel: {
        name: 'Margaritaville Resort Orlando',
        location: 'Kissimmee, FL',
        rating: { score: '8.1/10', label: 'Very good', reviews: 1432 },
      },
      checkIn: 'Wed, Jun 24, 3:00pm',
      checkOut: 'Thu, Jun 25, 11:00am',
      rooms: [
        { label: 'Room 1', type: 'King Suite', summary: '1 King Bed · Sleeps 2', guests: '1 adult' },
      ],
    },
  ],
  party: [
    { name: 'Alex Smith', role: 'You', status: 'host' },
    { name: 'Jordan Maye', role: 'Traveler', status: 'invited' },
    { name: 'Unknown Guest', status: 'unknown' },
  ],
  cancellation: {
    freeUntil: 'Sat, Jun 21, 4:00pm',
    text: 'Free cancellation applies to each reservation until the date shown for that hotel. After that, the property’s individual cancellation terms apply per room. Manage any reservation independently above.',
  },
  location: { lat: 28.3892, lng: -81.5417, address: '1751 Hotel Plaza Blvd, Orlando, FL 32830', label: 'Hilton Orlando Lake Buena Vista' },
  areaTips,
  faqs,
  help,
}

export default {
  title: 'Confirmation/Confirmation Page',
  component: ConfirmationPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: `
## Overview
The **Confirmation Page** is the post-checkout success screen. The hero, itinerary
meta, reward banner, and "get the app" QR section are shared; the body differs by
booking type:

- **Reservation** — a single hotel stay: check-in / check-out and room features.
- **Group Hold** — a group/team room block: one card per hotel with rooms held by night.
- **Multiple Room Reservations** — one card per reservation; room details reuse the
  Group Hold layout, showing per-room occupancy and each reservation's own hotel + dates.

Accents use the DS primary (Zinc 900).
` } },
  },
}

/** Single hotel reservation. */
export const Reservation = {
  render: () => ({
    components: { ConfirmationPage },
    setup: () => ({ data: reserveData }),
    template: `<confirmation-page mode="reserve" :data="data" />`,
  }),
}

/** Group / team room block hold. */
export const GroupHold = {
  render: () => ({
    components: { ConfirmationPage },
    setup: () => ({ data: holdData }),
    template: `<confirmation-page mode="hold" :data="data" />`,
  }),
}

/**
 * Multiple room reservations — one card per reservation, with room details laid
 * out like Group Hold (room type + summary) but showing per-room occupancy.
 * Covers the edge cases: a single reservation with two differently-occupied
 * rooms (2 adults + 1 child, and a 1-guest room), and one guest booking a room
 * today plus a room at a different hotel tomorrow (two separate cards).
 */
export const MultipleReservations = {
  name: 'Multiple Room Reservations',
  render: () => ({
    components: { ConfirmationPage },
    setup: () => ({ data: reservationsData }),
    template: `<confirmation-page mode="reservations" :data="data" />`,
  }),
}
