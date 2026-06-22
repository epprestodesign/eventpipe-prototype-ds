// BROWSE HOTELS / Search & Filters — the browse-sidebar filter sections plus the
// results "Sort by" control. One `Filter` component drives every filter type via
// its `type` prop (each a variant below); the Sort dropdown is a sibling. The
// "All Filters" story stacks them into a full sidebar.
import { ref, computed } from 'vue'
import Filter from '../../components/browse/Filter.vue'
import SortDropdown from '../../components/browse/SortDropdown.vue'
import AllFiltersDialog from '../../components/browse/AllFiltersDialog.vue'

export default {
  title: 'Browse Hotels/Search & Filters',
  component: Filter,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['amenities', 'amenitiesGrid', 'roomType', 'guestRating', 'starRating', 'hotelClass', 'brands', 'budget', 'propertySearch'] },
  },
  parameters: { docs: { description: { component: `
## Overview
Browse-sidebar **filter** sections, each a variant of one \`Filter\` component
selected by its \`type\`:

- **Amenities** — checkbox list (multi-select)
- **Guest Rating** — radio group (single-select)
- **Star Rating** — star chip toggles (multi-select)
- **Your budget** — dual-handle range slider + min/max readout (per night)
- **Property Search** — text input

A **Sort by** dropdown handles results ordering. Selected states use the DS
primary (Zinc). Stack the filters to build a full sidebar — see **All Filters**.
` } } },
}

// NB: registered as <browse-filter>, not <filter> — `filter` is a native SVG
// element, so Vue's compiler would treat <filter> as an SVG tag, not a component.
const box = (inner, data = {}) => ({
  components: { BrowseFilter: Filter, SortDropdown },
  setup: () => data,
  template: `<div style="max-width:420px;padding:24px;background:var(--ds-color-surface)">${inner}</div>`,
})

/** Multi-select amenities checklist. */
export const Amenities = { render: () => box(`<browse-filter type="amenities" v-model="v" />`, { v: ref(['Free Breakfast', 'Indoor Pool']) }) }

/** Multi-select amenities as an icon-tile grid. */
export const AmenitiesGrid = {
  name: 'Amenities (grid)',
  render: () => box(`<browse-filter type="amenitiesGrid" v-model="v" />`, { v: ref(['Free WiFi', 'Swimming Pool']) }),
}

/** Single-select guest-rating bands. */
export const GuestRating = { render: () => box(`<browse-filter type="guestRating" v-model="v" />`, { v: ref('Any') }) }

/** Multi-select room-type chips (King / Double / Queen / Suite). */
export const RoomType = { render: () => box(`<browse-filter type="roomType" v-model="v" />`, { v: ref(['King']) }) }

/** Multi-select star-rating chips. */
export const StarRating = { render: () => box(`<browse-filter type="starRating" v-model="v" />`, { v: ref([4, 5]) }) }

/** Multi-select hotel-class description cards. */
export const HotelClass = { render: () => box(`<browse-filter type="hotelClass" v-model="v" />`, { v: ref(['4-star', '5-star']) }) }

/** Nested brand tree — checking a parent selects all its sub-brands; a partial
 *  selection shows an indeterminate (dash) parent. Click a chevron to expand. */
export const Brands = { render: () => box(`<browse-filter type="brands" v-model="v" />`, { v: ref(['Cambria', 'Comfort']) }) }

// Sample nightly-price distribution (relative bar heights) for the histogram.
const priceHistogram = [8, 14, 11, 24, 38, 52, 47, 61, 44, 70, 56, 66, 51, 43, 47, 31, 35, 27, 31, 22, 28, 34, 30, 24, 18, 14, 22, 10, 7, 5]

/** Dual-handle nightly budget range — slider on top, min/max readout below. */
export const Budget = { render: () => box(`<browse-filter type="budget" :min="20" :max="850" v-model="v" />`, { v: ref({ min: 120, max: 600 }) }) }

/** With a price-distribution histogram — bars inside the selected range are
 *  highlighted; drag the handles to see them recolor. */
export const BudgetWithHistogram = {
  name: 'Budget (with histogram)',
  render: () => box(`<browse-filter type="budget" :min="20" :max="850" :histogram="histogram" v-model="v" />`, { v: ref({ min: 20, max: 522 }), histogram: priceHistogram }),
}

/** Free-text property name search. */
export const PropertySearch = { render: () => box(`<browse-filter type="propertySearch" v-model="v" />`, { v: ref('') }) }

// Sample property suggestions for the autocomplete variant.
const propertySuggestions = [
  { name: 'Hilton Garden Inn', location: 'Chicago, IL' },
  { name: 'Hilton Chicago', location: 'Chicago, IL' },
  { name: 'Hampton Inn & Suites', location: 'Chicago, IL' },
  { name: 'DoubleTree by Hilton', location: 'Chicago, IL' },
  { name: 'Embassy Suites', location: 'Chicago, IL' },
  { name: 'Holiday Inn Express', location: 'Chicago, IL' },
  { name: 'Hyatt Place', location: 'Chicago, IL' },
  { name: 'Marriott Downtown', location: 'Chicago, IL' },
]

/** Property search with autocomplete — type to see matching suggestions
 *  (try "hil"); pick one to fill the field. */
export const PropertySearchAutocomplete = {
  name: 'Property Search (autocomplete)',
  render: () => box(`<browse-filter type="propertySearch" :suggestions="suggestions" v-model="v" />`, { v: ref('Hil'), suggestions: propertySuggestions }),
}

/** The results "Sort by" dropdown. */
export const Sort = {
  render: () => ({
    components: { SortDropdown },
    setup: () => ({ v: ref('recommended') }),
    template: `<div style="padding:24px"><sort-dropdown v-model="v" /><div style="margin-top:14px;font-size:13px;color:var(--ds-color-text-subtle)">Sorting by: <strong>{{ v }}</strong></div></div>`,
  }),
}

/** The full filter sidebar — Sort at top, then every filter stacked with dividers. */
export const AllFilters = {
  name: 'All Filters',
  parameters: { layout: 'fullscreen' },
  render: () => ({
    components: { BrowseFilter: Filter, SortDropdown },
    setup() {
      return {
        sort: ref('recommended'),
        property: ref(''),
        suggestions: propertySuggestions,
        budget: ref({ min: 20, max: 522 }),
        histogram: priceHistogram,
        guest: ref('Any'),
        stars: ref([4, 5]),
        hotelClass: ref(['4-star', '5-star']),
        brands: ref(['Cambria', 'Comfort']),
        amenities: ref(['Free WiFi', 'Swimming Pool']),
      }
    },
    template: `
      <div style="min-height:100vh;background:var(--ds-palette-neutral-100);padding:32px 24px">
        <aside style="max-width:420px;margin:0 auto;background:var(--ds-color-surface);border:1px solid var(--ds-color-border);border-radius:var(--ds-radius-lg);padding:24px">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:20px">
            <h2 style="margin:0;font-size:1.5rem;font-weight:800;color:var(--ds-color-text)">Filters</h2>
            <sort-dropdown v-model="sort" />
          </div>
          <browse-filter collapsible type="propertySearch" :suggestions="suggestions" v-model="property" />
          <hr style="border:0;border-top:1px solid var(--ds-color-border);margin:24px 0" />
          <browse-filter collapsible type="budget" :min="20" :max="850" :histogram="histogram" v-model="budget" />
          <hr style="border:0;border-top:1px solid var(--ds-color-border);margin:24px 0" />
          <browse-filter collapsible type="hotelClass" v-model="hotelClass" />
          <hr style="border:0;border-top:1px solid var(--ds-color-border);margin:24px 0" />
          <browse-filter collapsible type="guestRating" v-model="guest" />
          <hr style="border:0;border-top:1px solid var(--ds-color-border);margin:24px 0" />
          <browse-filter collapsible type="starRating" v-model="stars" />
          <hr style="border:0;border-top:1px solid var(--ds-color-border);margin:24px 0" />
          <browse-filter collapsible type="brands" v-model="brands" />
          <hr style="border:0;border-top:1px solid var(--ds-color-border);margin:24px 0" />
          <browse-filter collapsible type="amenitiesGrid" v-model="amenities" />
        </aside>
      </div>`,
  }),
}

// Mock result count — fewer results as more filters are applied, so the footer
// shows a number the user can anticipate. (No real data behind it.)
const resultCount = (f) => {
  let n = 312
  if (f.propertySearch) n -= 80
  if (f.roomType?.length) n -= f.roomType.length * 26
  if (f.amenities?.length) n -= f.amenities.length * 10
  if (f.starRating?.length) n -= f.starRating.length * 12
  if (f.hotelClass?.length) n -= f.hotelClass.length * 16
  if (f.brands?.length) n -= f.brands.length * 14
  if (f.guestRating && f.guestRating !== 'Any') n -= 34
  if (f.budget) n -= Math.round((1 - (f.budget.max - f.budget.min) / 950) * 110)
  return Math.max(2, n)
}

/** **All Filters** button → an Airbnb-style modal consolidating every filter as
 *  collapsible accordion sections (Room Type, Budget & Amenities open by
 *  default). The footer shows a live "Show N results" count that updates as you
 *  change filters, plus "Clear all". */
export const AllFiltersModal = {
  name: 'All Filters (modal)',
  parameters: { layout: 'fullscreen' },
  render: () => ({
    components: { AllFiltersDialog },
    setup() {
      const open = ref(false)
      const filters = ref({ roomType: ['King'], amenities: ['Free Breakfast', 'Indoor Pool'] })
      const count = computed(() => resultCount(filters.value))
      return { open, filters, count }
    },
    template: `
      <div style="min-height:100vh;background:var(--ds-palette-neutral-100);padding:32px 24px">
        <button type="button" @click="open = true" style="display:inline-flex;align-items:center;gap:8px;height:48px;padding:0 22px;border:1px solid var(--ds-color-border-bold);border-radius:999px;background:var(--ds-color-surface);color:var(--ds-color-text);font-weight:600;font-size:1rem;cursor:pointer;font-family:inherit">
          <q-icon name="tune" size="20px" /> All filters
        </button>
        <p style="margin-top:14px;color:var(--ds-color-text-subtle);font-size:0.875rem">Click to open the consolidated filter dialog. The footer count updates live as you adjust filters.</p>
        <all-filters-dialog v-model="open" :filters="filters" @update:filters="filters = $event" :result-count="count" />
      </div>`,
  }),
}
