// Shared rich data for the fully-rendered Hotel Detail Page examples
// (Book Reservation + Group Block). Gallery images load from the imagery library
// by category at runtime; room cards are text-only with detailed features.
import { popularAmenities, amenityGroups } from '../../lib/amenities.js'

const feat = (extra = []) => [
  { label: 'Entertainment', value: '55" Smart TV, Netflix, Apple TV, Premium Channels' },
  { label: 'Food & Drink', value: 'Coffee Maker, Mini Fridge, Bottled Water' },
  { label: 'Bathroom', value: 'Walk-in shower, Premium toiletries, Hair dryer' },
  ...extra,
  { label: 'Non-smoking', value: 'Yes' },
]

const NIGHTS = ['Thu, 7/9/2026', 'Fri, 7/10/2026', 'Sat, 7/11/2026']
const rNights = (a, b, c) => NIGHTS.map((date, i) => ({ date, roomsLeft: [a, b, c][i] }))
const gNights = (a, b, c, price) => NIGHTS.map((date, i) => ({ date, roomsLeft: [a, b, c][i], price }))

// Book Reservation — per-night rooms-left + per-room/night + stay total.
export const reserveRooms = [
  { roomType: 'Urban King', bedConfig: '1 King Bed', maxOccupancy: 2, imageCategories: ['rooms'], seed: 0, features: feat(), pricePerNight: 179, total: 573.0, roomCount: 1, availability: 'available', nights: rNights(5, 6, 5) },
  { roomType: 'Double Queen', bedConfig: '2 Queen Beds', maxOccupancy: 4, imageCategories: ['rooms'], seed: 1, features: feat([{ label: 'Need to know', value: 'Rollaway beds available on request' }]), pricePerNight: 199, total: 637.0, roomCount: 1, availability: 'limited', nights: rNights(3, 2, 1) },
  { roomType: 'Two-Room Suite King', bedConfig: '1 King Bed, Separate Living Room', maxOccupancy: 4, imageCategories: ['suites'], seed: 0, features: feat([{ label: 'Space', value: '620 sq ft, Sofa bed, Dining area' }, { label: 'Need to know', value: 'Complimentary evening reception' }]), pricePerNight: 269, total: 861.0, roomCount: 1, availability: 'available', nights: rNights(4, 4, 3) },
  { roomType: 'Accessible King', bedConfig: '1 King Bed', maxOccupancy: 2, imageCategories: ['rooms'], seed: 2, features: feat([{ label: 'Accessibility', value: 'Roll-in shower, Grab bars, Lowered fixtures' }]), pricePerNight: 189, total: 605.0, roomCount: 1, availability: 'soldout', nights: rNights(0, 0, 0) },
]

// Group Block — per-night rooms-left + price, quantity steppers.
export const groupRooms = [
  { roomType: 'Urban King', bedConfig: '1 King Bed', maxOccupancy: 2, imageCategories: ['rooms'], seed: 3, features: feat(), availability: 'available', nights: gNights(8, 10, 6, 179) },
  { roomType: 'Double Queen', bedConfig: '2 Queen Beds', maxOccupancy: 4, imageCategories: ['rooms'], seed: 4, features: feat([{ label: 'Need to know', value: 'Rollaway beds available on request' }]), availability: 'available', nights: gNights(6, 5, 7, 199) },
  { roomType: 'Two-Room Suite King', bedConfig: '1 King Bed, Separate Living Room', maxOccupancy: 4, imageCategories: ['suites'], seed: 1, features: feat([{ label: 'Space', value: '620 sq ft, Sofa bed, Dining area' }]), availability: 'limited', nights: gNights(2, 1, 3, 269) },
  { roomType: 'Accessible Queen', bedConfig: '1 Queen Bed', maxOccupancy: 2, imageCategories: ['rooms'], seed: 5, features: feat([{ label: 'Accessibility', value: 'Roll-in shower, Grab bars' }]), availability: 'soldout', nights: gNights(0, 0, 0, 189) },
]

export const policies = [
  { title: 'Check-in', body: 'Check-in from 3:00 PM – 2:00 AM. Front desk staffed 24 hours. Photo ID and the credit card used for booking are required at check-in.' },
  { title: 'Check-out', body: 'Check-out before 11:00 AM. Late check-out may be available for a fee, subject to availability.' },
  { title: 'Children and extra beds', body: 'All children are welcome. Extra beds depend on the room you choose. When booking more than 5 rooms, different policies and additional supplements may apply.' },
  { title: 'Pets', body: 'Pets are welcome for a $50 per-stay fee (2 pets max, 50 lb limit). Service animals are exempt and always welcome.' },
]

export const hotelBase = {
  name: 'Hilton Orlando Lake Buena Vista',
  stars: 4,
  address: '1751 Hotel Plaza Blvd, Lake Buena Vista, FL',
  distance: '2.4 mi from Main Arena',
  score: 4.5,
  reviews: 1284,
  ratingLabel: 'Excellent',
  popularAmenities: popularAmenities(),
  galleryCategories: ['exterior', 'rooms', 'suites', 'pool', 'dining', 'bar', 'lobby', 'spa', 'bathroom'],
  seed: 0,
  about: 'In the heart of Lake Buena Vista, this resort is an ideal base for tournament weekends — minutes from the pitch, with top attractions, dining, and shopping just steps away. Relax in a newly renovated room after match day, unwind at the heated pool and full-service spa, or refuel at one of three on-site restaurants. Complimentary premium Wi-Fi, a 24-hour fitness centre, and free scheduled shuttle service round out a stay built for teams and families alike.',
  amenityGroups: amenityGroups(),
  policies,
}
