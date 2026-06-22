// Canonical amenities catalog for the hotel experience. One source of truth for
// every place amenities surface — the Hotel Summary Header's "popular" row, the
// Amenities section on the detail screen, listing/room cards, and the Search &
// Filters amenity list.
//
// Each amenity has a stable `key` (used by filters / cards), a Material icon,
// a human `label`, and a `category`. Render any of them with the `Amenity`
// component, or pull grouped/ordered lists with the helpers below.

export const AMENITY_CATEGORIES = [
  'Internet',
  'Parking & Transport',
  'Food & Drink',
  'Pool & Spa',
  'Fitness & Recreation',
  'Family & Accessibility',
  'Services',
  'Room Features',
  'Policies & Views',
]

// Representative icon per category (used as the group heading icon).
export const CATEGORY_ICONS = {
  'Internet': 'wifi',
  'Parking & Transport': 'local_parking',
  'Food & Drink': 'restaurant',
  'Pool & Spa': 'pool',
  'Fitness & Recreation': 'fitness_center',
  'Family & Accessibility': 'family_restroom',
  'Services': 'room_service',
  'Room Features': 'king_bed',
  'Policies & Views': 'visibility',
}

// The flat catalog. Add new amenities here and they flow everywhere.
export const AMENITIES = [
  // Internet
  { key: 'wifi', icon: 'wifi', label: 'Free WiFi', category: 'Internet' },
  { key: 'wired_internet', icon: 'settings_ethernet', label: 'Wired Internet', category: 'Internet' },
  { key: 'business_center', icon: 'business_center', label: 'Business Center', category: 'Internet' },

  // Parking & Transport
  { key: 'parking', icon: 'local_parking', label: 'Free Parking', category: 'Parking & Transport' },
  { key: 'valet', icon: 'directions_car', label: 'Valet Parking (fee)', category: 'Parking & Transport' },
  { key: 'shuttle', icon: 'airport_shuttle', label: 'Free Airport Shuttle', category: 'Parking & Transport' },
  { key: 'ev_charging', icon: 'ev_station', label: 'EV Charging', category: 'Parking & Transport' },
  { key: 'car_rental', icon: 'car_rental', label: 'Car Rental', category: 'Parking & Transport' },

  // Food & Drink
  { key: 'breakfast', icon: 'free_breakfast', label: 'Free Breakfast', category: 'Food & Drink' },
  { key: 'breakfast_fee', icon: 'free_breakfast', label: 'Breakfast (fee $)', category: 'Food & Drink' },
  { key: 'restaurant', icon: 'restaurant', label: 'Restaurant On-Site', category: 'Food & Drink' },
  { key: 'bar', icon: 'local_bar', label: 'Bar / Lounge', category: 'Food & Drink' },
  { key: 'rooftop_bar', icon: 'local_bar', label: 'Rooftop Bar / Lounge', category: 'Food & Drink' },
  { key: 'room_service', icon: 'room_service', label: '24-Hour Room Service', category: 'Food & Drink' },
  { key: 'coffee_shop', icon: 'local_cafe', label: 'Coffee Shop', category: 'Food & Drink' },
  { key: 'minibar', icon: 'kitchen', label: 'Minibar', category: 'Food & Drink' },

  // Pool & Spa
  { key: 'pool', icon: 'pool', label: 'Swimming Pool', category: 'Pool & Spa' },
  { key: 'indoor_pool', icon: 'pool', label: 'Indoor Pool', category: 'Pool & Spa' },
  { key: 'outdoor_pool', icon: 'pool', label: 'Outdoor Pool', category: 'Pool & Spa' },
  { key: 'hot_tub', icon: 'hot_tub', label: 'Hot Tub / Jacuzzi', category: 'Pool & Spa' },
  { key: 'spa', icon: 'spa', label: 'Spa & Wellness Center', category: 'Pool & Spa' },
  { key: 'sauna', icon: 'sauna', label: 'Sauna', category: 'Pool & Spa' },
  { key: 'steam_room', icon: 'foggy', label: 'Steam Room', category: 'Pool & Spa' },

  // Fitness & Recreation
  { key: 'fitness', icon: 'fitness_center', label: 'Fitness Center', category: 'Fitness & Recreation' },
  { key: 'yoga', icon: 'self_improvement', label: 'Yoga Studio', category: 'Fitness & Recreation' },
  { key: 'tennis', icon: 'sports_tennis', label: 'Tennis Court', category: 'Fitness & Recreation' },
  { key: 'golf', icon: 'golf_course', label: 'Golf Course', category: 'Fitness & Recreation' },
  { key: 'game_room', icon: 'sports_esports', label: 'Game Room', category: 'Fitness & Recreation' },
  { key: 'bike_rental', icon: 'pedal_bike', label: 'Bike Rental', category: 'Fitness & Recreation' },
  { key: 'beach_access', icon: 'beach_access', label: 'Beach Access', category: 'Fitness & Recreation' },
  { key: 'casino', icon: 'casino', label: 'Casino', category: 'Fitness & Recreation' },

  // Family & Accessibility
  { key: 'family_rooms', icon: 'family_restroom', label: 'Family Rooms', category: 'Family & Accessibility' },
  { key: 'kids_club', icon: 'child_care', label: 'Kids Club', category: 'Family & Accessibility' },
  { key: 'cribs', icon: 'child_friendly', label: 'Cribs Available', category: 'Family & Accessibility' },
  { key: 'playground', icon: 'attractions', label: 'Playground', category: 'Family & Accessibility' },
  { key: 'accessible', icon: 'accessible', label: 'Handicap Accessible', category: 'Family & Accessibility' },
  { key: 'roll_in_shower', icon: 'shower', label: 'Roll-in Shower', category: 'Family & Accessibility' },
  { key: 'elevator', icon: 'elevator', label: 'Elevator', category: 'Family & Accessibility' },

  // Services
  { key: 'front_desk_24h', icon: 'support_agent', label: '24-Hour Front Desk', category: 'Services' },
  { key: 'concierge', icon: 'support_agent', label: 'Concierge Service', category: 'Services' },
  { key: 'laundry', icon: 'local_laundry_service', label: 'Laundry Services (fee)', category: 'Services' },
  { key: 'dry_cleaning', icon: 'dry_cleaning', label: 'Dry Cleaning (fee)', category: 'Services' },
  { key: 'luggage_storage', icon: 'luggage', label: 'Luggage Storage', category: 'Services' },
  { key: 'housekeeping', icon: 'cleaning_services', label: 'Daily Housekeeping', category: 'Services' },
  { key: 'atm', icon: 'local_atm', label: 'ATM On-Site', category: 'Services' },
  { key: 'currency_exchange', icon: 'paid', label: 'Currency Exchange', category: 'Services' },
  { key: 'express_checkin', icon: 'bolt', label: 'Express Check-In / Check-Out', category: 'Services' },
  { key: 'gift_shop', icon: 'card_giftcard', label: 'Gift Shop', category: 'Services' },
  { key: 'safe_deposit_box', icon: 'lock', label: 'Safe Deposit Box', category: 'Services' },
  { key: 'ski_storage', icon: 'inventory', label: 'Ski Storage', category: 'Services' },

  // Room Features
  { key: 'air_conditioning', icon: 'ac_unit', label: 'Air Conditioning', category: 'Room Features' },
  { key: 'tv', icon: 'tv', label: 'Flat-Screen TV', category: 'Room Features' },
  { key: 'safe', icon: 'lock', label: 'In-Room Safe', category: 'Room Features' },
  { key: 'kitchenette', icon: 'countertops', label: 'Kitchenette', category: 'Room Features' },
  { key: 'in_room_fridge', icon: 'kitchen', label: 'In-room Refrigerator', category: 'Room Features' },
  { key: 'microwave', icon: 'microwave', label: 'Microwave', category: 'Room Features' },
  { key: 'balcony', icon: 'balcony', label: 'Balcony', category: 'Room Features' },
  { key: 'iron', icon: 'iron', label: 'Iron & Board', category: 'Room Features' },
  { key: 'coffee_maker', icon: 'coffee_maker', label: 'Coffee Maker', category: 'Room Features' },
  { key: 'exterior_corridors', icon: 'apartment', label: 'Exterior Corridors', category: 'Room Features' },
  { key: 'interior_corridors', icon: 'meeting_room', label: 'Interior Corridors', category: 'Room Features' },
  { key: 'connecting_rooms', icon: 'meeting_room', label: 'Connecting Rooms Available', category: 'Room Features' },
  { key: 'rollaway_beds', icon: 'single_bed', label: 'Rollaway Beds Available', category: 'Room Features' },

  // Policies & Views
  { key: 'non_smoking', icon: 'smoke_free', label: '100% Smoke-Free Hotel', category: 'Policies & Views' },
  { key: 'pet_friendly', icon: 'pets', label: 'Pet-friendly', category: 'Policies & Views' },
  { key: 'ocean_view', icon: 'water', label: 'Ocean View', category: 'Policies & Views' },
  { key: 'garden', icon: 'yard', label: 'Garden', category: 'Policies & Views' },
]

// Default "popular amenities" shown in the summary header.
export const POPULAR_AMENITY_KEYS = ['breakfast', 'pool', 'wifi', 'fitness', 'parking', 'spa']

// The amenity filter list for Search & Filters, in display order (mirrors the
// product spec). Add/reorder here to change what the filters show.
export const FILTER_AMENITY_KEYS = [
  'non_smoking', 'breakfast_fee', 'ev_charging', 'exterior_corridors', 'shuttle',
  'breakfast', 'parking', 'accessible', 'in_room_fridge', 'indoor_pool',
  'interior_corridors', 'kitchenette', 'laundry', 'outdoor_pool', 'restaurant',
  'pet_friendly', 'front_desk_24h', 'room_service', 'bar', 'beach_access',
  'bike_rental', 'business_center', 'casino', 'concierge', 'connecting_rooms',
  'currency_exchange', 'dry_cleaning', 'express_checkin', 'gift_shop', 'golf',
  'hot_tub', 'kids_club', 'luggage_storage', 'microwave', 'rollaway_beds',
  'rooftop_bar', 'safe_deposit_box', 'ski_storage', 'spa', 'tennis', 'valet',
]

// key -> amenity lookup
const BY_KEY = Object.fromEntries(AMENITIES.map((a) => [a.key, a]))

/** Resolve a list of amenity keys to amenity objects (unknown keys dropped). */
export function getAmenities(keys = []) {
  return keys.map((k) => BY_KEY[k]).filter(Boolean)
}

/** The popular-amenities list (objects), for the summary header. */
export function popularAmenities() {
  return getAmenities(POPULAR_AMENITY_KEYS)
}

/** The Search & Filters amenity list (objects), in display order. */
export function filterAmenities() {
  return getAmenities(FILTER_AMENITY_KEYS)
}

/**
 * Group amenities by category for the Amenities section.
 * @param {string[]} [keys] - optional subset; omit for the full catalog.
 * @returns {{ title, icon, items: Amenity[] }[]}
 */
export function amenityGroups(keys) {
  const source = keys ? getAmenities(keys) : AMENITIES
  return AMENITY_CATEGORIES
    .map((category) => ({
      title: category,
      icon: CATEGORY_ICONS[category],
      items: source.filter((a) => a.category === category),
    }))
    .filter((g) => g.items.length)
}
