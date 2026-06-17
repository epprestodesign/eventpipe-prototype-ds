<script setup>
// Filter — a single browse-sidebar filter section. The `type` prop selects the
// control; each type is a Storybook variant:
//   amenities      → checkbox list (multi-select)
//   amenitiesGrid  → icon-tile grid (multi-select)
//   guestRating    → radio group (single-select)
//   starRating     → star chip toggles (multi-select)
//   hotelClass     → description cards (multi-select)
//   brands         → nested checkbox tree; a parent toggles all its children
//   budget         → dual-handle range slider + min/max readout (+ optional histogram)
//   propertySearch → text input, with optional autocomplete suggestions
// v-model holds the appropriate value shape per type. Selected states use the
// DS primary (Zinc). Stack several to build a full filter sidebar.
import { computed, reactive, ref } from 'vue'

const props = defineProps({
  type: { type: String, required: true },
  title: { type: String, default: '' },
  modelValue: { default: undefined },
  options: { type: Array, default: null }, // amenities / guestRating / hotelClass overrides
  brands: { type: Array, default: null },  // brands tree override
  tiles: { type: Array, default: null },   // amenitiesGrid override
  // budget
  min: { type: Number, default: 50 },
  max: { type: Number, default: 1000 },
  step: { type: Number, default: 10 },
  currency: { type: String, default: '$' },
  histogram: { type: Array, default: null }, // budget: price-distribution bar heights
  // propertySearch
  placeholder: { type: String, default: '' },
  suggestions: { type: Array, default: null }, // [string] or [{ name, location }]
  // layout
  collapsible: { type: Boolean, default: false }, // title becomes an expand/collapse header
  defaultOpen: { type: Boolean, default: true },
})
const emit = defineEmits(['update:modelValue'])

const DEFAULTS = {
  amenities: {
    title: 'Amenities',
    options: ['Breakfast Included', 'Pool', 'WiFi Included', 'Airport Shuttle', 'Parking Included', 'Hot Tub', 'Pet Friendly', 'Ocean View', 'Kitchen', 'Spa', 'Fitness Center', 'Restaurants', 'Fully Refundable'],
    value: () => [],
  },
  amenitiesGrid: {
    title: 'Amenities',
    tiles: [
      { label: 'Free Wi-Fi', icon: 'wifi' }, { label: 'Free breakfast', icon: 'free_breakfast' },
      { label: 'Restaurant', icon: 'restaurant' }, { label: 'Bar', icon: 'local_bar' },
      { label: 'Kid-friendly', icon: 'child_friendly' }, { label: 'Pet-friendly', icon: 'pets' },
      { label: 'Free parking', icon: 'local_parking' }, { label: 'Parking', icon: 'local_parking' },
      { label: 'EV charger', icon: 'ev_station' }, { label: 'Room service', icon: 'room_service' },
      { label: 'Fitness center', icon: 'fitness_center' }, { label: 'Spa', icon: 'spa' },
      { label: 'Pool', icon: 'pool' }, { label: 'Indoor pool', icon: 'pool' },
      { label: 'Outdoor pool', icon: 'pool' }, { label: 'Air-conditioned', icon: 'ac_unit' },
      { label: 'Wheelchair accessible', icon: 'accessible' }, { label: 'Beach access', icon: 'beach_access' },
      { label: 'All-inclusive available', icon: 'all_inclusive' },
    ],
    value: () => [],
  },
  guestRating: {
    title: 'Guest Rating',
    options: ['Any', '2.0 – 2.9', '3.0 – 3.9', '4.0 – 4.9', '5.0'],
    value: () => 'Any',
  },
  starRating: { title: 'Star Rating', options: [1, 2, 3, 4, 5], value: () => [] },
  hotelClass: {
    title: 'Hotel class',
    options: [
      { label: '2-star', sub: 'Just the basics' }, { label: '3-star', sub: 'Quality comfort' },
      { label: '4-star', sub: 'Lots of extras' }, { label: '5-star', sub: 'Top service' },
    ],
    value: () => [],
  },
  brands: {
    title: 'Brands',
    brands: [
      { name: 'Choice Hotels', children: ['Cambria', 'Comfort', 'Quality Inn', 'Rodeway Inn'] },
      { name: 'Extended Stay America', children: ['Extended Stay America Suites', 'Extended Stay America Select'] },
      { name: 'Hilton Honors', children: ['Hampton', 'DoubleTree', 'Embassy Suites', 'Hilton Garden Inn'] },
      { name: 'Hyatt', children: ['Hyatt Place', 'Hyatt House', 'Grand Hyatt', 'Park Hyatt'] },
      { name: 'IHG Hotels & Resorts', children: ['Holiday Inn', 'Crowne Plaza', 'Staybridge Suites', 'Candlewood Suites'] },
    ],
    value: () => [],
  },
  budget: { title: 'Your budget (per night)', value: () => ({ min: 50, max: 1000 }) },
  propertySearch: { title: 'Search By Property Name', placeholder: 'e.g Hilton', value: () => '' },
}

const cfg = computed(() => DEFAULTS[props.type] || {})
const heading = computed(() => props.title || cfg.value.title || '')
const opts = computed(() => props.options || cfg.value.options || [])
const tiles = computed(() => props.tiles || cfg.value.tiles || [])
const brandOpts = computed(() => props.brands || cfg.value.brands || [])
const suggestions = computed(() => props.suggestions || [])

// v-model with per-type defaults when the parent leaves it undefined.
const val = computed({
  get: () => (props.modelValue === undefined ? cfg.value.value?.() : props.modelValue),
  set: (v) => emit('update:modelValue', v),
})

const toggleIn = (list, item) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item])
const toggleVal = (item) => { val.value = toggleIn(val.value || [], item) }

// Budget readout — top of the range shows "<max>+".
const money = (n) => props.currency + ' ' + Number(n).toLocaleString('en-US') + (n >= props.max ? '+' : '')
const range = computed({
  get: () => val.value || { min: props.min, max: props.max },
  set: (v) => { val.value = v },
})

// Price-distribution bars: scaled to the tallest bucket; a bar is "active"
// (brand color) when its price bucket falls inside the selected range.
const bars = computed(() => {
  const h = props.histogram
  if (!h || !h.length) return []
  const peak = Math.max(...h, 1)
  return h.map((v, i) => {
    const price = props.min + ((i + 0.5) / h.length) * (props.max - props.min)
    return { h: Math.max(6, (v / peak) * 100), active: price >= range.value.min && price <= range.value.max }
  })
})

// Brands tree — value is the list of selected leaf names; a parent reflects
// 'all' / 'some' / 'none' of its children and toggling it selects/clears them.
const expanded = reactive(Object.fromEntries(brandOpts.value.map((b, i) => [b.name, i === 0])))
const toggleExpand = (name) => { expanded[name] = !expanded[name] }
const brandState = (b) => {
  const sel = val.value || []
  const ch = b.children || []
  if (!ch.length) return sel.includes(b.name) ? 'all' : 'none'
  const n = ch.filter((c) => sel.includes(c)).length
  return n === 0 ? 'none' : n === ch.length ? 'all' : 'some'
}
const toggleBrand = (b) => {
  const sel = val.value || []
  const ch = b.children || []
  if (!ch.length) { toggleVal(b.name); return }
  val.value = brandState(b) === 'all' ? sel.filter((c) => !ch.includes(c)) : Array.from(new Set([...sel, ...ch]))
}

// Property-search autocomplete.
const acFocused = ref(false)
const matches = computed(() => {
  const q = (val.value || '').toString().trim().toLowerCase()
  if (!q) return []
  return suggestions.value
    .map((s) => (typeof s === 'string' ? { name: s } : s))
    .filter((s) => `${s.name} ${s.location || ''}`.toLowerCase().includes(q))
    .slice(0, 6)
})
const pick = (s) => { val.value = s.name; acFocused.value = false }

// Collapsible section state.
const open = ref(props.defaultOpen)
</script>

<template>
  <section class="flt" :class="{ 'flt--collapsible': collapsible }">
    <button v-if="collapsible" type="button" class="flt__titlerow" :aria-expanded="open" @click="open = !open">
      <h3 class="flt__title">{{ heading }}</h3>
      <q-icon :name="open ? 'expand_less' : 'expand_more'" size="24px" class="flt__titlechev" />
    </button>
    <h3 v-else class="flt__title">{{ heading }}</h3>

    <div v-show="!collapsible || open" class="flt__body">
    <!-- amenities: checkbox list -->
    <div v-if="type === 'amenities'" class="flt__list">
      <button v-for="a in opts" :key="a" type="button" class="flt__check" :class="{ 'is-on': (val || []).includes(a) }" role="checkbox" :aria-checked="(val || []).includes(a)" @click="toggleVal(a)">
        <span class="flt__box"><q-icon v-if="(val || []).includes(a)" name="check" size="16px" /></span>
        <span class="flt__label">{{ a }}</span>
      </button>
    </div>

    <!-- amenities: icon-tile grid -->
    <div v-else-if="type === 'amenitiesGrid'" class="flt__grid">
      <button v-for="t in tiles" :key="t.label" type="button" class="flt__tile" :class="{ 'is-on': (val || []).includes(t.label) }" :aria-pressed="(val || []).includes(t.label)" @click="toggleVal(t.label)">
        <q-icon :name="t.icon" size="24px" />
        <span>{{ t.label }}</span>
      </button>
    </div>

    <!-- guest rating: radio group -->
    <div v-else-if="type === 'guestRating'" class="flt__list" role="radiogroup">
      <button v-for="o in opts" :key="o" type="button" class="flt__radio" :class="{ 'is-on': val === o }" role="radio" :aria-checked="val === o" @click="val = o">
        <span class="flt__dot"><span v-if="val === o" /></span>
        <span class="flt__label">{{ o }}</span>
      </button>
    </div>

    <!-- star rating: chip toggles -->
    <div v-else-if="type === 'starRating'" class="flt__stars">
      <button v-for="s in opts" :key="s" type="button" class="flt__star" :class="{ 'is-on': (val || []).includes(s) }" :aria-pressed="(val || []).includes(s)" @click="toggleVal(s)">
        {{ s }} <q-icon name="star" size="15px" />
      </button>
    </div>

    <!-- hotel class: description cards -->
    <div v-else-if="type === 'hotelClass'" class="flt__classes">
      <button v-for="c in opts" :key="c.label" type="button" class="flt__class" :class="{ 'is-on': (val || []).includes(c.label) }" :aria-pressed="(val || []).includes(c.label)" @click="toggleVal(c.label)">
        <strong>{{ c.label }}</strong>
        <span>{{ c.sub }}</span>
      </button>
    </div>

    <!-- brands: nested checkbox tree -->
    <div v-else-if="type === 'brands'" class="flt__brands">
      <div v-for="b in brandOpts" :key="b.name" class="flt__brand">
        <div class="flt__brandhead">
          <button type="button" class="flt__check" :class="{ 'is-on': brandState(b) === 'all' }" @click="toggleBrand(b)">
            <span class="flt__box" :class="{ 'is-indet': brandState(b) === 'some' }">
              <q-icon v-if="brandState(b) === 'all'" name="check" size="16px" />
              <span v-else-if="brandState(b) === 'some'" class="flt__dash" />
            </span>
            <span class="flt__label">{{ b.name }}</span>
          </button>
          <button v-if="(b.children || []).length" type="button" class="flt__chev" :aria-label="expanded[b.name] ? 'Collapse' : 'Expand'" @click="toggleExpand(b.name)">
            <q-icon :name="expanded[b.name] ? 'expand_less' : 'expand_more'" size="22px" />
          </button>
        </div>
        <div v-show="expanded[b.name]" class="flt__children">
          <button v-for="c in b.children" :key="c" type="button" class="flt__check flt__check--child" :class="{ 'is-on': (val || []).includes(c) }" role="checkbox" :aria-checked="(val || []).includes(c)" @click="toggleVal(c)">
            <span class="flt__box"><q-icon v-if="(val || []).includes(c)" name="check" size="16px" /></span>
            <span class="flt__label">{{ c }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- budget: dual-handle slider + min/max boxes (+ optional price histogram) -->
    <div v-else-if="type === 'budget'" class="flt__budget" :class="{ 'flt__budget--histo': bars.length }">
      <div class="flt__mmrow">
        <div class="flt__mm"><span>Min</span><strong>{{ money(range.min) }}</strong></div>
        <div class="flt__mm"><span>Max</span><strong>{{ money(range.max) }}</strong></div>
      </div>
      <div v-if="bars.length" class="flt__histo" aria-hidden="true">
        <span v-for="(b, i) in bars" :key="i" class="flt__bar" :class="{ 'is-active': b.active }" :style="{ height: b.h + '%' }" />
      </div>
      <q-range v-model="range" :min="min" :max="max" :step="step" class="flt__range" color="dark" track-color="grey-4" />
    </div>

    <!-- property search: text input with optional autocomplete -->
    <div v-else-if="type === 'propertySearch'" class="flt__searchwrap">
      <input v-model="val" class="flt__search" type="text" :placeholder="placeholder || cfg.placeholder" autocomplete="off" @focus="acFocused = true" @blur="acFocused = false" />
      <ul v-if="acFocused && matches.length" class="flt__ac">
        <li v-for="m in matches" :key="m.name">
          <button type="button" class="flt__acopt" @mousedown.prevent="pick(m)">
            <q-icon name="location_city" size="18px" />
            <span class="flt__acname">{{ m.name }}</span>
            <span v-if="m.location" class="flt__acloc">{{ m.location }}</span>
          </button>
        </li>
      </ul>
    </div>
    </div>
  </section>
</template>

<style scoped>
.flt { padding: 4px 0; }
.flt__title { margin: 0 0 16px; font-size: 1.25rem; font-weight: 800; color: var(--ds-color-text); }
.flt__titlerow { display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%; padding: 0; background: none; border: 0; cursor: pointer; text-align: left; }
.flt__titlerow .flt__title { margin: 0; }
.flt__titlechev { color: var(--ds-color-text-subtle); flex: none; }
.flt--collapsible .flt__body { padding-top: 16px; }

/* checkbox + radio rows */
.flt__list { display: flex; flex-direction: column; gap: 6px; }
.flt__check, .flt__radio { display: flex; align-items: center; gap: 14px; width: 100%; padding: 6px 0; background: none; border: 0; text-align: left; cursor: pointer; }
.flt__box { width: 26px; height: 26px; flex: none; border: 2px solid var(--ds-color-border-bold); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; transition: background var(--ds-duration-fast) var(--ds-ease-standard), border-color var(--ds-duration-fast) var(--ds-ease-standard); }
.flt__check.is-on .flt__box, .flt__box.is-indet { background: var(--ds-color-background-brand-bold); border-color: var(--ds-color-background-brand-bold); }
.flt__dash { width: 12px; height: 2px; border-radius: 1px; background: #fff; }
.flt__dot { width: 26px; height: 26px; flex: none; border: 2px solid var(--ds-color-border-bold); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.flt__radio.is-on .flt__dot { border-color: var(--ds-color-background-brand-bold); }
.flt__dot span { width: 14px; height: 14px; border-radius: 50%; background: var(--ds-color-background-brand-bold); }
.flt__label { font-size: 1.0625rem; font-weight: 600; color: var(--ds-color-text); }
.flt__check:hover .flt__box, .flt__radio:hover .flt__dot { border-color: var(--ds-color-text); }

/* amenities icon grid */
.flt__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.flt__tile { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; min-height: 92px; padding: 14px 10px; text-align: center; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-md); background: var(--ds-color-surface); color: var(--ds-color-text); font-size: 0.9375rem; font-weight: 600; cursor: pointer; transition: background var(--ds-duration-fast) var(--ds-ease-standard), border-color var(--ds-duration-fast) var(--ds-ease-standard); }
.flt__tile .q-icon { color: var(--ds-color-text-subtle); }
.flt__tile:hover { border-color: var(--ds-color-text); }
.flt__tile.is-on { border-color: var(--ds-color-background-brand-bold); background: var(--ds-palette-zinc-100); box-shadow: inset 0 0 0 1px var(--ds-color-background-brand-bold); }
.flt__tile.is-on .q-icon { color: var(--ds-color-background-brand-bold); }

/* star chips */
.flt__stars { display: flex; flex-wrap: wrap; gap: 12px; }
.flt__star { display: inline-flex; align-items: center; gap: 6px; height: 52px; min-width: 60px; padding: 0 16px; justify-content: center; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-md); background: var(--ds-color-surface); color: var(--ds-color-text); font-weight: 700; font-size: 1.0625rem; cursor: pointer; transition: background var(--ds-duration-fast) var(--ds-ease-standard), border-color var(--ds-duration-fast) var(--ds-ease-standard); }
.flt__star .q-icon { color: var(--ds-color-text); }
.flt__star:hover { border-color: var(--ds-color-text); }
.flt__star.is-on { background: var(--ds-color-background-brand-bold); border-color: var(--ds-color-background-brand-bold); color: #fff; }
.flt__star.is-on .q-icon { color: #fff; }

/* hotel class cards */
.flt__classes { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.flt__class { display: flex; flex-direction: column; gap: 4px; align-items: center; padding: 18px 12px; text-align: center; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-md); background: var(--ds-color-surface); cursor: pointer; transition: background var(--ds-duration-fast) var(--ds-ease-standard), border-color var(--ds-duration-fast) var(--ds-ease-standard); }
.flt__class strong { font-size: 1.0625rem; font-weight: 700; color: var(--ds-color-text); }
.flt__class span { font-size: 0.875rem; color: var(--ds-color-text-subtle); }
.flt__class:hover { border-color: var(--ds-color-text); }
.flt__class.is-on { border-color: var(--ds-color-background-brand-bold); background: var(--ds-palette-zinc-100); box-shadow: inset 0 0 0 1px var(--ds-color-background-brand-bold); }

/* brands tree */
.flt__brands { display: flex; flex-direction: column; }
.flt__brandhead { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.flt__chev { background: none; border: 0; padding: 6px; color: var(--ds-color-text-subtle); cursor: pointer; display: flex; }
.flt__children { display: flex; flex-direction: column; padding-left: 38px; }
.flt__check--child .flt__label { font-weight: 500; }

/* budget */
.flt__budget { display: flex; flex-direction: column; padding-top: 4px; }
.flt__range { padding: 0 6px; }
.flt__budget .flt__range { order: 1; }
.flt__budget .flt__mmrow { order: 2; margin-top: 18px; }
.flt__budget--histo .flt__mmrow { order: 1; margin-top: 0; margin-bottom: 22px; }
.flt__budget--histo .flt__histo { order: 2; }
.flt__budget--histo .flt__range { order: 3; }

.flt__mmrow { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.flt__mm { display: flex; flex-direction: column; gap: 4px; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-md); padding: 12px 16px; }
.flt__mm span { font-size: 0.9375rem; color: var(--ds-color-text-subtle); }
.flt__mm strong { font-size: 1.25rem; font-weight: 700; color: var(--ds-color-text); }

/* price-distribution histogram */
.flt__histo { display: flex; align-items: flex-end; gap: 3px; height: 96px; padding: 0 6px; }
.flt__bar { flex: 1; min-width: 0; border-radius: 4px 4px 0 0; background: var(--ds-palette-zinc-200); transition: background var(--ds-duration-fast) var(--ds-ease-standard); }
.flt__bar.is-active { background: var(--ds-color-background-brand-bold); }

/* property search + autocomplete */
.flt__searchwrap { position: relative; }
.flt__search { width: 100%; height: 54px; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-md); padding: 0 18px; font-family: inherit; font-size: 1.0625rem; color: var(--ds-color-text); outline: none; transition: border-color var(--ds-duration-fast) var(--ds-ease-standard); }
.flt__search:focus { border-color: var(--ds-color-border-focused); }
.flt__search::placeholder { color: var(--ds-color-text-subtlest); }
.flt__ac { list-style: none; margin: 6px 0 0; padding: 6px; position: absolute; z-index: 20; left: 0; right: 0; background: var(--ds-color-surface); border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-md); box-shadow: var(--ds-shadow-md, 0 8px 24px rgba(0, 0, 0, 0.12)); }
.flt__acopt { display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 12px; border: 0; border-radius: var(--ds-radius-sm); background: none; text-align: left; cursor: pointer; }
.flt__acopt:hover { background: var(--ds-palette-zinc-100); }
.flt__acopt .q-icon { color: var(--ds-color-text-subtle); flex: none; }
.flt__acname { font-size: 0.9375rem; font-weight: 600; color: var(--ds-color-text); }
.flt__acloc { font-size: 0.8125rem; color: var(--ds-color-text-subtle); margin-left: auto; }
</style>
