<script setup>
// Filter — a single browse-sidebar filter section. The `type` prop selects the
// control; each type is a Storybook variant:
//   amenities      → checkbox list (multi-select)
//   amenitiesGrid  → icon-tile grid (multi-select)
//   roomType       → icon chip toggles (multi-select)
//   guestRating    → radio group (single-select)
//   starRating     → star chip toggles (multi-select)
//   hotelClass     → description cards (multi-select)
//   brands         → nested checkbox tree; a parent toggles all its children
//   budget         → dual-handle range slider + min/max readout (+ optional histogram)
//   propertySearch → text input, with optional autocomplete suggestions
// v-model holds the appropriate value shape per type. Selected states use the
// DS primary (Zinc). Stack several to build a full filter sidebar.
import { computed, reactive, ref } from 'vue'
import { AMENITIES, filterAmenities } from '../../lib/amenities.js'

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
  // amenities / amenitiesGrid: show only the first N items behind a
  // "View more / Fewer" toggle. null → per-type default; 0 → show all.
  collapseAfter: { type: Number, default: null },
})
const emit = defineEmits(['update:modelValue'])

const DEFAULTS = {
  amenities: {
    title: 'Amenities',
    // Full amenity list, sourced from the shared catalog (src/lib/amenities.js).
    options: filterAmenities().map((a) => a.label),
    value: () => [],
  },
  amenitiesGrid: {
    title: 'Amenities',
    // Icon-tile grid sourced from the full amenities catalog (src/lib/amenities.js).
    tiles: AMENITIES.map((a) => ({ label: a.label, icon: a.icon })),
    value: () => [],
  },
  roomType: {
    title: 'Room Type',
    options: [
      { label: 'King', icon: 'king_bed' },
      { label: 'Double', icon: 'bed' },
      { label: 'Queen', icon: 'bed' },
      { label: 'Suite', icon: 'meeting_room' },
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
// Editable Min/Max inputs, kept in sync with the slider and clamped so the
// handles never cross. An empty Max means "no cap" (the slider's top).
const setMin = (v) => {
  let n = Number(v)
  if (Number.isNaN(n)) n = props.min
  n = Math.max(props.min, Math.min(n, range.value.max - props.step))
  range.value = { min: n, max: range.value.max }
}
const setMax = (v) => {
  let n = (v === '' || v == null) ? props.max : Number(v)
  if (Number.isNaN(n)) n = props.max
  n = Math.min(props.max, Math.max(n, range.value.min + props.step))
  range.value = { min: range.value.min, max: n }
}

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

// "View more / Fewer amenity options" — collapse long amenity lists/grids to a
// preview, with a toggle. Defaults: 15 checkbox rows, 8 grid tiles.
const DEFAULT_COLLAPSE = { amenities: 15, amenitiesGrid: 8 }
const showAll = ref(false)
const collapseLimit = computed(() => {
  const n = props.collapseAfter ?? DEFAULT_COLLAPSE[props.type] ?? 0
  return n > 0 ? n : 0
})
const totalCount = computed(() => (props.type === 'amenitiesGrid' ? tiles.value.length : opts.value.length))
const hiddenCount = computed(() => Math.max(0, totalCount.value - collapseLimit.value))
const canToggle = computed(() => collapseLimit.value > 0 && hiddenCount.value > 0)
const collapse = (list) => (collapseLimit.value && !showAll.value ? list.slice(0, collapseLimit.value) : list)
const visibleOpts = computed(() => collapse(opts.value))
const visibleTiles = computed(() => collapse(tiles.value))
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
    <template v-if="type === 'amenities'">
      <div class="flt__list">
        <button v-for="a in visibleOpts" :key="a" type="button" class="flt__check" :class="{ 'is-on': (val || []).includes(a) }" role="checkbox" :aria-checked="(val || []).includes(a)" @click="toggleVal(a)">
          <span class="flt__box"><q-icon v-if="(val || []).includes(a)" name="check" size="16px" /></span>
          <span class="flt__label">{{ a }}</span>
        </button>
      </div>
      <button v-if="canToggle" type="button" class="flt__more" :aria-expanded="showAll" @click="showAll = !showAll">
        <q-icon :name="showAll ? 'expand_less' : 'expand_more'" size="20px" />
        {{ showAll ? 'Fewer amenity options' : `View ${hiddenCount} more amenities` }}
      </button>
    </template>

    <!-- amenities: icon-tile grid -->
    <template v-else-if="type === 'amenitiesGrid'">
      <div class="flt__grid">
        <button v-for="t in visibleTiles" :key="t.label" type="button" class="flt__tile" :class="{ 'is-on': (val || []).includes(t.label) }" :aria-pressed="(val || []).includes(t.label)" @click="toggleVal(t.label)">
          <q-icon :name="t.icon" size="24px" />
          <span>{{ t.label }}</span>
        </button>
      </div>
      <button v-if="canToggle" type="button" class="flt__more" :aria-expanded="showAll" @click="showAll = !showAll">
        <q-icon :name="showAll ? 'expand_less' : 'expand_more'" size="20px" />
        {{ showAll ? 'Fewer amenity options' : `View ${hiddenCount} more amenities` }}
      </button>
    </template>

    <!-- room type: icon chip toggles -->
    <div v-else-if="type === 'roomType'" class="flt__chips">
      <button v-for="o in opts" :key="o.label" type="button" class="flt__chip" :class="{ 'is-on': (val || []).includes(o.label) }" :aria-pressed="(val || []).includes(o.label)" @click="toggleVal(o.label)">
        <q-icon :name="o.icon" size="20px" />
        <span>{{ o.label }}</span>
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
        <label class="flt__mm">
          <span>Minimum</span>
          <span class="flt__mmfield"><span class="flt__mmcur">{{ currency }}</span><input class="flt__mminput" type="number" inputmode="numeric" :value="range.min" :min="min" :max="range.max - step" @change="setMin($event.target.value)" /></span>
        </label>
        <label class="flt__mm">
          <span>Max price</span>
          <span class="flt__mmfield"><span class="flt__mmcur">{{ currency }}</span><input class="flt__mminput" type="number" inputmode="numeric" :value="range.max >= max ? null : range.max" placeholder="Max" :min="range.min + step" :max="max" @change="setMax($event.target.value)" /></span>
        </label>
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

/* "View more / Fewer amenity options" toggle */
.flt__more { display: inline-flex; align-items: center; gap: 6px; margin-top: 12px; padding: 4px 0; background: none; border: 0; color: var(--ds-color-text); font-family: inherit; font-weight: 700; font-size: 1.0625rem; cursor: pointer; }
.flt__more:hover { text-decoration: underline; }

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
.flt__mm { display: flex; flex-direction: column; gap: 4px; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-md); padding: 10px 16px; cursor: text; transition: border-color var(--ds-duration-fast) var(--ds-ease-standard); }
.flt__mm:focus-within { border-color: var(--ds-color-border-focused); }
.flt__mm > span:first-child { font-size: 0.9375rem; color: var(--ds-color-text-subtle); }
.flt__mmfield { display: flex; align-items: center; gap: 4px; }
.flt__mmcur { font-size: 1.25rem; font-weight: 700; color: var(--ds-color-text); flex: none; }
.flt__mminput { width: 100%; min-width: 0; border: 0; outline: none; background: none; padding: 0; font-family: inherit; font-size: 1.25rem; font-weight: 700; color: var(--ds-color-text); }
.flt__mminput::placeholder { color: var(--ds-color-text-subtlest); font-weight: 700; }
/* Hide number-input spinners for a cleaner look. */
.flt__mminput::-webkit-outer-spin-button, .flt__mminput::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.flt__mminput { -moz-appearance: textfield; }

/* room type chips */
.flt__chips { display: flex; flex-wrap: wrap; gap: 12px; }
.flt__chip { display: inline-flex; align-items: center; gap: 8px; height: 48px; padding: 0 20px; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-pill); background: var(--ds-color-surface); color: var(--ds-color-text); font-weight: 600; font-size: 1.0625rem; cursor: pointer; transition: background var(--ds-duration-fast) var(--ds-ease-standard), border-color var(--ds-duration-fast) var(--ds-ease-standard); }
.flt__chip .q-icon { color: var(--ds-color-text); }
.flt__chip:hover { border-color: var(--ds-color-text); }
.flt__chip.is-on { border-color: var(--ds-color-background-brand-bold); background: var(--ds-palette-zinc-100); box-shadow: inset 0 0 0 1px var(--ds-color-background-brand-bold); }

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
