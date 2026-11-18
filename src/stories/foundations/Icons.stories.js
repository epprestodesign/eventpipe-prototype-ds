/**
 * FOUNDATIONS / Icons → Quasar: QIcon + Material Icons (@quasar/extras)
 * Curated for a consumer HOTEL BOOKING & RESERVATION experience.
 */
export default {
  id: 'foundations-icons', title: 'Design System/Foundations/Icons',
  // The Docs page is the hand-written MDX beside this file, not autodocs.
  tags: [],
  parameters: { docs: { description: { component: `
## Overview
Icons are rendered with **QIcon** using **Material Icons** (self-hosted via
\`@quasar/extras\`, imported in \`.storybook/preview.js\`). This page is the curated
icon set for the hotel reservation experience — searching stays, choosing rooms,
reviewing amenities, booking, and managing trips.

## Usage
\`\`\`html
<q-icon name="hotel" size="24px" color="primary" />
\`\`\`
Sizes: \`xs sm md lg xl\` or any CSS length. Color: any brand token.

## Guidance
- Use one icon set consistently; pair actionable icons with an accessible label.
- Match icon size to adjacent text (20–24px beside body copy).
- Reinforce meaning with color tokens (\`positive\` for confirmed, \`negative\` for sold out / cancelled).
` } } },
}

// Shared grid template (icons are passed in via setup() as `items`).
const GRID = `
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:14px">
    <div v-for="n in items" :key="n" class="column items-center q-gutter-xs"
         style="padding:10px;border:1px solid #eee;border-radius:10px">
      <q-icon :name="n" size="26px" color="primary" />
      <div class="text-caption text-center" style="word-break:break-word">{{ n }}</div>
    </div>
  </div>`

const cat = (name, items) => ({
  name,
  render: () => ({ setup: () => ({ items }), template: GRID }),
})

export const PropertyLodging = cat('Property & Lodging', [
  'hotel', 'apartment', 'villa', 'cottage', 'house', 'holiday_village',
  'location_city', 'business', 'domain', 'night_shelter', 'cabin', 'bungalow',
])

export const RoomsBeds = cat('Rooms & Beds', [
  'king_bed', 'single_bed', 'bed', 'bedroom_parent', 'bedroom_child',
  'meeting_room', 'door_front', 'room_preferences', 'bathtub', 'shower', 'balcony',
])

export const Amenities = cat('Amenities', [
  'wifi', 'free_breakfast', 'restaurant', 'local_bar', 'local_cafe', 'coffee',
  'pool', 'fitness_center', 'spa', 'hot_tub', 'beach_access', 'ac_unit',
  'local_parking', 'pets', 'smoke_free', 'smoking_rooms', 'tv', 'kitchen',
  'elevator', 'stairs', 'local_laundry_service', 'dry_cleaning', 'iron',
  'room_service', 'business_center', 'cleaning_services', 'fireplace', 'deck',
  'accessible', 'crib', 'family_restroom', 'no_drinks', 'casino',
])

export const SearchDiscovery = cat('Search & Discovery', [
  'search', 'filter_list', 'tune', 'sort', 'map', 'place', 'location_on',
  'near_me', 'explore', 'travel_explore', 'directions', 'public', 'language',
])

export const DatesBooking = cat('Dates & Booking', [
  'event', 'event_available', 'event_busy', 'calendar_month', 'date_range',
  'today', 'schedule', 'history', 'book_online', 'confirmation_number',
  'pending_actions', 'update', 'edit_calendar', 'free_cancellation',
])

export const GuestsTravel = cat('Guests & Travel', [
  'person', 'group', 'groups', 'people', 'person_add', 'family_restroom',
  'child_care', 'elderly', 'luggage', 'no_luggage', 'flight', 'flight_takeoff',
  'flight_land', 'train', 'directions_car', 'local_taxi', 'directions_boat',
])

export const PaymentLoyalty = cat('Payment & Loyalty', [
  'payments', 'credit_card', 'account_balance_wallet', 'attach_money',
  'price_check', 'sell', 'local_offer', 'loyalty', 'redeem', 'card_membership',
  'currency_exchange', 'receipt_long', 'qr_code_2', 'verified',
])

export const ReviewsRatings = cat('Reviews & Ratings', [
  'star', 'star_half', 'star_border', 'grade', 'reviews', 'rate_review',
  'recommend', 'thumb_up', 'favorite', 'favorite_border', 'bookmark',
  'bookmark_border', 'share', 'photo_camera', 'photo_library',
])

export const StatusFeedback = cat('Status & Feedback', [
  'check_circle', 'cancel', 'error', 'warning', 'info', 'pending',
  'hourglass_empty', 'do_not_disturb', 'report_problem', 'event_busy',
  'lock', 'lock_open', 'verified_user', 'priority_high',
])

export const AccountSupport = cat('Account & Support', [
  'account_circle', 'manage_accounts', 'login', 'logout', 'support_agent',
  'help', 'help_outline', 'chat', 'call', 'email', 'notifications',
  'notifications_active', 'settings', 'translate',
])

export const CommonActions = cat('Common Actions', [
  'add', 'remove', 'edit', 'delete', 'close', 'arrow_back', 'arrow_forward',
  'expand_more', 'expand_less', 'more_vert', 'more_horiz', 'refresh',
  'download', 'print', 'check', 'shopping_cart', 'shopping_bag',
])

export const Sizes = {
  render: () => ({ setup: () => ({ sizes: ['xs', 'sm', 'md', 'lg', 'xl'] }), template: `
    <div class="row items-end q-gutter-lg">
      <div v-for="s in sizes" :key="s" class="column items-center q-gutter-xs">
        <q-icon name="hotel" :size="s" color="primary" /><div class="text-caption">{{ s }}</div>
      </div>
    </div>` }),
}
