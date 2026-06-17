// YOUR TRIPS / Saved Items — bookmarking a hotel slides in the "Saved Hotels"
// fly-out (cart-style), showcased against a list of Hotel Listing Cards. The
// panel is also shown docked. Saving uses the bookmark icon used app-wide.
import { reactive } from 'vue'
import SavedItems from '../../components/yourtrips/SavedItems.vue'
import GlobalNav from '../../components/GlobalNav.vue'
import HotelListingCard from '../../components/HotelListingCard.vue'

// Browse results used in the live demo.
const hotels = [
  { id: 'h1', name: 'Hampton Inn Boston-Logan Airport', location: 'Boston, MA', imageCategories: ['exterior', 'lobby'], seed: 0, rating: 3.8, reviews: 3254, hotelClass: '3-star hotel', price: 168 },
  { id: 'h2', name: 'The Concord Hotel', location: 'Boston, MA', imageCategories: ['lobby', 'rooms'], seed: 1, rating: 4.4, reviews: 1190, hotelClass: '4-star hotel', price: 212 },
  { id: 'h3', name: 'Embassy Suites Downtown', location: 'Boston, MA', imageCategories: ['suites', 'pool'], seed: 2, rating: 4.6, reviews: 2417, hotelClass: '4-star hotel', price: 254 },
]

export default {
  title: 'Your Trips/Saved Items',
  component: SavedItems,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: `
## Overview
**Saved Hotels** is the lightweight "your travel plans" list. Bookmarking a hotel
on its listing card shows a **toast** (saved/removed) and updates the count; the
**bookmark icon in the Global Nav** opens the Saved Hotels **fly-out** (same chrome
as the cart). Each row's filled bookmark removes it. The panel is also usable
docked. Saving uses the bookmark icon used app-wide; accents are the DS primary (Zinc).
` } } },
}

/** Live demo — bookmark a card to see the toast; open the nav bookmark for the fly-out. */
export const SaveFromListings = {
  name: 'Save from listings',
  render: () => ({
    components: { GlobalNav, HotelListingCard },
    setup() {
      const saved = reactive([])
      const isSaved = (h) => saved.some((s) => s.id === h.id)
      const onToggle = (h, val) => {
        const i = saved.findIndex((s) => s.id === h.id)
        if (val && i < 0) saved.push({ ...h })
        else if (!val && i >= 0) saved.splice(i, 1)
      }
      const onRemove = (it) => { const i = saved.findIndex((s) => s.id === it.id); if (i >= 0) saved.splice(i, 1) }
      return { hotels, saved, isSaved, onToggle, onRemove }
    },
    template: `
      <div style="min-height:100vh;background:var(--ds-palette-neutral-100)">
        <global-nav brand="Presto" :saved="saved" @remove="onRemove" />
        <div style="max-width:760px;margin:0 auto;padding:24px">
          <h2 style="margin:0 0 16px;font-size:1.5rem;font-weight:800;color:var(--ds-color-text)">Hotels in Boston</h2>
          <div style="display:flex;flex-direction:column;gap:16px">
            <hotel-listing-card
              v-for="h in hotels" :key="h.id"
              :name="h.name" :location="h.location" :image-categories="h.imageCategories" :seed="h.seed"
              :rating="h.rating" :reviews="h.reviews" :price="h.price" trip-name="Boston"
              :bookmarked="isSaved(h)"
              @toggle-bookmark="(v) => onToggle(h, v)"
            />
          </div>
        </div>
      </div>`,
  }),
}

/** The Saved Hotels panel, docked (not in the fly-out). */
export const Panel = {
  render: () => ({
    components: { SavedItems },
    setup() {
      const saved = reactive([
        { id: 'h1', name: 'Hampton Inn Boston-Logan Airport', rating: 3.8, reviews: 3254, hotelClass: '3-star hotel', imageCategories: ['exterior', 'lobby'], seed: 0 },
        { id: 'h2', name: 'The Concord Hotel', rating: 4.4, reviews: 1190, hotelClass: '4-star hotel', imageCategories: ['lobby', 'rooms'], seed: 1 },
      ])
      const onRemove = (it) => { const i = saved.findIndex((s) => s.id === it.id); if (i >= 0) saved.splice(i, 1) }
      return { saved, onRemove }
    },
    template: `<div style="padding:32px;max-width:480px"><saved-items :items="saved" @remove="onRemove" /></div>`,
  }),
}

/** Empty state — nothing saved yet. */
export const Empty = {
  render: () => ({
    components: { SavedItems },
    template: `<div style="padding:32px;max-width:480px"><saved-items :items="[]" /></div>`,
  }),
}
