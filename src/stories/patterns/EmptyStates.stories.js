/** PATTERNS / Empty States → custom DsEmptyState (composition) */
import DsEmptyState from '../../components/DsEmptyState.vue'
export default {
  title: 'Browse Hotels/Empty States',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
What a screen shows when there's no data yet, no results, or an error. A good
empty state explains why it's empty and offers the next action. Uses \`DsEmptyState\`.

## Hotel edge cases covered
- **No trips yet** (new user) · **No search results** (filters too tight) ·
  **Sold out** (dates unavailable).
` } } },
}
export const NoTrips = {
  name: 'No Trips Yet',
  render: () => ({ components: { DsEmptyState }, template: `
    <ds-empty-state icon="luggage" title="No trips yet"
      description="When you book a stay, your upcoming reservations will appear here.">
      <template #action><q-btn color="primary" icon="search" label="Find a hotel" /></template>
    </ds-empty-state>` }),
}
export const NoResults = {
  render: () => ({ components: { DsEmptyState }, template: `
    <ds-empty-state icon="search_off" title="No hotels match your filters"
      description="Try widening your dates, raising your price range, or removing a filter.">
      <template #action><q-btn flat color="primary" label="Clear filters" /></template>
    </ds-empty-state>` }),
}
export const SoldOut = {
  name: 'Sold Out',
  render: () => ({ components: { DsEmptyState }, template: `
    <ds-empty-state icon="event_busy" title="Sold out for these dates"
      description="This property has no availability for Jun 2–6. Try nearby dates or similar hotels.">
      <template #action><q-btn color="primary" label="See similar hotels" /></template>
    </ds-empty-state>` }),
}
