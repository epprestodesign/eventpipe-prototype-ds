// BROWSE HOTELS / Availability Dialog — opened from a Hotel Listing Card's
// "Availability" action (group bookings). Shows a compact hotel summary above a
// hold-mode RoomsCarousel so an organizer can hold inventory per night.
import { ref } from 'vue'
import AvailabilityDialog from '../../components/AvailabilityDialog.vue'
import { popularAmenities } from '../../lib/amenities.js'

const features = [
  { label: 'Entertainment', value: '55" Smart TV, Netflix, Apple TV' },
  { label: 'Food & Drink', value: 'Coffee Maker, Mini Fridge' },
  { label: 'Non-smoking', value: 'Yes' },
]
const nights = (base) => [
  { date: 'Tue, Jun 23', roomsLeft: 6, price: base },
  { date: 'Wed, Jun 24', roomsLeft: 7, price: base },
  { date: 'Thu, Jun 25', roomsLeft: 3, price: base + 18 },
]

const rooms = [
  { roomType: 'King Bedroom', bedConfig: '1 King Bed', maxOccupancy: 2, features, nights: nights(301), availability: 'available' },
  { roomType: 'Double Queen Bedroom', bedConfig: '2 Queen Beds', maxOccupancy: 4, features, nights: nights(363), availability: 'available' },
  { roomType: 'Studio Suite', bedConfig: '1 King Bed + Sofa', maxOccupancy: 3, features, nights: nights(401), availability: 'limited' },
  { roomType: 'Accessible King', bedConfig: '1 King Bed', maxOccupancy: 2, features, nights: nights(289), availability: 'soldout' },
]

const base = {
  name: 'Hilton Orlando Lake Buena Vista',
  location: 'Lake Buena Vista, Orlando, FL · 2.4 mi from venue',
  rating: 4.5,
  reviews: 1284,
  ratingLabel: 'Excellent',
  amenities: popularAmenities(),
  imageCategories: ['exterior', 'lobby'],
  seed: 0,
  rooms,
}

export default {
  title: 'Browse Hotels/Availability Dialog',
  component: AvailabilityDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: `
## Overview
The **Availability Dialog** opens from a [Hotel Listing Card](/?path=/docs/browse-hotels-hotel-listing-card--docs)'s
**"Availability"** secondary action (shown in group-booking mode). It pairs a
compact high-level hotel summary — photo, name, location, guest rating, and
popular amenities — with a **hold-mode RoomsCarousel** so an organizer can
browse and hold inventory per night without leaving the listings page.

Self-contained: pass the hotel info + room data via props. Rooms render in hold
mode regardless of the data's mode.
` } } },
}

/** The dialog open over the listings, showing four rooms (one sold out). */
export const Default = {
  render: () => ({
    components: { AvailabilityDialog },
    setup() {
      const show = ref(true)
      return { show, base }
    },
    template: `
      <div>
        <button style="height:44px;padding:0 20px;border:1px solid var(--ds-color-border-bold);border-radius:10px;background:#fff;font-weight:600;cursor:pointer" @click="show = true">Open Availability</button>
        <availability-dialog v-model="show" v-bind="base" />
      </div>`,
  }),
}
