<script setup>
// RoomBookingDialog — a full item-detail modal that hosts the same booking
// experience as the Hotel Listing Card booking variants (reserve / hold), laid
// out like an Uber Eats item dialog: a large image on the left, scrollable room
// detail on the right, and a sticky CTA footer whose total updates live with
// the selected nights / rooms and add-ons.
import { ref, computed, onMounted } from 'vue'
import { loadImagery } from '../lib/imagery'
import QuantityStepper from './QuantityStepper.vue'

const props = defineProps({
  name: { type: String, default: '' },
  roomType: { type: String, default: 'Two-Room Suite King' },
  bedConfig: { type: String, default: '' },          // "1 King Bed, Separate Living Room"
  maxOccupancy: { type: Number, default: null },
  roomDetails: { type: Array, default: () => [] },     // [{ label, value }]
  images: { type: Array, default: () => [] },          // explicit imgs win over the library
  imageCategories: { type: Array, default: () => ['suites', 'rooms', 'lobby', 'pool', 'dining'] },
  seed: { type: Number, default: 0 },
  badge: { type: Object, default: null },              // { label, tone }
  nights: { type: Array, default: () => [] },          // [{ date, roomsLeft, price }]
  extras: { type: Array, default: () => [] },          // [{ id, label, price, note, popular }]
  price: { type: Number, default: null },              // nightly rate (header)
  total: { type: Number, default: null },              // reserve base total
  currency: { type: String, default: '$' },
  bookingMode: { type: String, default: 'reserve' },   // reserve | hold
})
const emit = defineEmits(['close'])

// Soft badge tones mapped to DS palette ramps (mirrors HotelListingCard).
const TONES = {
  teal: { '--bg': 'var(--ds-palette-teal-100)', '--fg': 'var(--ds-palette-teal-700)' },
  blue: { '--bg': 'var(--ds-palette-blue-100)', '--fg': 'var(--ds-palette-blue-700)' },
  emerald: { '--bg': 'var(--ds-palette-emerald-100)', '--fg': 'var(--ds-palette-emerald-700)' },
  amber: { '--bg': 'var(--ds-palette-amber-100)', '--fg': 'var(--ds-palette-amber-700)' },
}
const toneStyle = (t) => TONES[t] || TONES.teal

const isReserve = computed(() => props.bookingMode === 'reserve')
const fmt2 = (n) => Number(n ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const money2 = (n) => props.currency + fmt2(n)

// --- Hero carousel (photos from the imagery library) ---
const loaded = ref([])
const slides = computed(() => (props.images.length ? props.images : loaded.value))
const idx = ref(0)
const go = (n) => { const len = slides.value.length || 1; idx.value = (n + len) % len }
const prev = () => go(idx.value - 1)
const next = () => go(idx.value + 1)
onMounted(async () => {
  if (props.images.length) return
  const lib = await loadImagery()
  const out = []
  for (const c of props.imageCategories) {
    const arr = lib[c]
    if (arr && arr.length) { const e = arr[props.seed % arr.length]; out.push({ url: e.url, alt: e.alt }) }
  }
  loaded.value = out
})

// --- "Most popular" upsell carousel ---
const popRow = ref(null)
const scrollPop = (dir) => popRow.value && popRow.value.scrollBy({ left: dir * 260, behavior: 'smooth' })
const popular = computed(() => props.extras.filter((e) => e.popular))

// --- Add-on selection (shared by the carousel cards and the extras list) ---
const picked = ref(Object.fromEntries(props.extras.map((e) => [e.id, false])))
const toggle = (id) => { picked.value[id] = !picked.value[id] }
const extrasTotal = computed(() => props.extras.filter((e) => picked.value[e.id]).reduce((s, e) => s + e.price, 0))

// --- Per-night quantities (hold mode). Clamped to [0, roomsLeft]. ---
const qty = ref(props.nights.map(() => 0))
const roomsSelected = computed(() => qty.value.reduce((a, b) => a + b, 0))
const nightsTotal = computed(() => props.nights.reduce((s, n, i) => s + n.price * qty.value[i], 0))

// --- Live total + CTA ---
const baseTotal = computed(() => (isReserve.value ? (props.total ?? 0) : nightsTotal.value))
const grandTotal = computed(() => baseTotal.value + extrasTotal.value)
const ctaReady = computed(() => isReserve.value || roomsSelected.value > 0)
const ctaText = computed(() => {
  if (isReserve.value) return `Reserve Room · ${money2(grandTotal.value)}`
  return roomsSelected.value > 0 ? `Add ${roomsSelected.value} to Cart · ${money2(grandTotal.value)}` : 'Add to Cart'
})
</script>

<template>
  <div class="rbd">
    <!-- top bar: close + share -->
    <div class="rbd__bar">
      <button class="rbd__icon" aria-label="Close" @click="emit('close')"><q-icon name="close" size="22px" /></button>
      <button class="rbd__icon" aria-label="Share"><q-icon name="ios_share" size="20px" /></button>
    </div>

    <div class="rbd__body">
      <!-- LEFT: hero carousel -->
      <div class="rbd__media">
        <div class="rbd__carousel">
          <img v-if="slides.length" :src="slides[idx].url" :alt="slides[idx].alt" class="rbd__img" />
          <div v-else class="rbd__img rbd__img--empty"><q-icon name="image" size="40px" /></div>

          <template v-if="slides.length > 1">
            <button class="rbd__arrow rbd__arrow--prev" aria-label="Previous photo" @click="prev"><q-icon name="chevron_left" size="22px" /></button>
            <button class="rbd__arrow rbd__arrow--next" aria-label="Next photo" @click="next"><q-icon name="chevron_right" size="22px" /></button>
            <div class="rbd__dots">
              <span v-for="(s, i) in slides" :key="i" class="rbd__dot" :class="{ 'is-active': i === idx }" @click="go(i)" />
            </div>
          </template>
        </div>
      </div>

      <!-- RIGHT: scrollable detail -->
      <div class="rbd__content">
        <h2 class="rbd__title">{{ roomType }}</h2>
        <div v-if="price != null" class="rbd__price">{{ money2(price) }} <span>/ night</span></div>
        <p v-if="bedConfig || maxOccupancy != null" class="rbd__desc">
          {{ bedConfig }}<template v-if="bedConfig && maxOccupancy != null"> · </template><template v-if="maxOccupancy != null">Sleeps {{ maxOccupancy }}</template>
        </p>
        <div v-if="badge" class="rbd__chip" :style="toneStyle(badge.tone)">{{ badge.label }}</div>

        <div v-if="roomDetails.length" class="rbd__details">
          <p v-for="d in roomDetails" :key="d.label"><strong>{{ d.label }}:</strong> {{ d.value }}</p>
        </div>

        <!-- Most popular add-ons (horizontal carousel) -->
        <div v-if="popular.length" class="rbd__sec">
          <div class="rbd__sec-head">
            <h3 class="rbd__h">Most popular</h3>
            <div class="rbd__nav">
              <button class="rbd__navbtn" aria-label="Scroll left" @click="scrollPop(-1)"><q-icon name="arrow_back" size="18px" /></button>
              <button class="rbd__navbtn" aria-label="Scroll right" @click="scrollPop(1)"><q-icon name="arrow_forward" size="18px" /></button>
            </div>
          </div>
          <div ref="popRow" class="rbd__cards">
            <button v-for="e in popular" :key="e.id" class="rbd__card" :class="{ 'is-on': picked[e.id] }" :aria-pressed="picked[e.id]" @click="toggle(e.id)">
              <span class="rbd__card-radio"><q-icon v-if="picked[e.id]" name="check" size="16px" /></span>
              <span class="rbd__card-note">{{ e.note || 'Recommended' }}</span>
              <span class="rbd__card-label">Add {{ e.label }}</span>
              <span class="rbd__card-price">+{{ money2(e.price) }}</span>
            </button>
          </div>
        </div>

        <!-- Booking section: nights (reserve) or per-night steppers (hold) -->
        <div class="rbd__sec">
          <h3 class="rbd__h">{{ isReserve ? 'Nights' : 'Rooms per Night' }}</h3>
          <p class="rbd__sub">{{ isReserve ? 'Availability for your selected dates' : 'Choose how many rooms to hold each night' }}</p>

          <template v-if="isReserve">
            <div v-for="(n, i) in nights" :key="i" class="rbd__night">
              <span>{{ n.date }}</span>
              <span class="rbd__avail">{{ n.roomsLeft }} room{{ n.roomsLeft === 1 ? '' : 's' }} left</span>
            </div>
          </template>

          <template v-else>
            <div v-for="(n, i) in nights" :key="i" class="rbd__night rbd__night--hold">
              <div class="rbd__ndate"><span>{{ n.date }}</span><span class="rbd__nrate">{{ money2(n.price) }} / night</span></div>
              <span class="rbd__avail rbd__avail--sm">{{ n.roomsLeft - qty[i] }} left</span>
              <quantity-stepper v-model="qty[i]" :min="0" :max="n.roomsLeft" size="sm" />
            </div>
          </template>
        </div>

        <!-- Extras list (+ to add) -->
        <div v-if="extras.length" class="rbd__sec">
          <h3 class="rbd__h">Enhance your stay</h3>
          <p class="rbd__sub">Optional · Add as many as you like</p>
          <div v-for="e in extras" :key="e.id" class="rbd__extra">
            <div class="rbd__extra-info">
              <span class="rbd__extra-label">{{ e.label }}</span>
              <span class="rbd__extra-price">+{{ money2(e.price) }}</span>
            </div>
            <button
              class="rbd__add" :class="{ 'is-on': picked[e.id] }"
              :aria-pressed="picked[e.id]" :aria-label="(picked[e.id] ? 'Remove ' : 'Add ') + e.label"
              @click="toggle(e.id)"
            ><q-icon :name="picked[e.id] ? 'check' : 'add'" size="20px" /></button>
          </div>
        </div>
      </div>
    </div>

    <!-- sticky footer CTA -->
    <div class="rbd__foot">
      <q-btn unelevated no-caps class="rbd__cta" :class="{ 'rbd__cta--ready': ctaReady }" :tabindex="ctaReady ? 0 : -1" :label="ctaText" />
    </div>
  </div>
</template>

<style scoped>
.rbd { display: flex; flex-direction: column; width: 100%; max-width: 1040px; max-height: 86vh; background: var(--ds-color-surface); border-radius: var(--ds-radius-lg); overflow: hidden; box-shadow: var(--ds-shadow-4); }

.rbd__bar { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; flex: none; }
.rbd__icon { width: 36px; height: 36px; border-radius: 50%; border: 0; background: var(--ds-palette-zinc-100); color: var(--ds-color-text); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background var(--ds-duration-fast) var(--ds-ease-standard); }
.rbd__icon:hover { background: var(--ds-palette-zinc-200); }

.rbd__body { display: flex; flex: 1; min-height: 0; overflow: hidden; }
.rbd__media { flex: 0 0 44%; padding: 0 24px 24px; }
.rbd__carousel { position: relative; border-radius: var(--ds-radius-md); overflow: hidden; }
.rbd__img { width: 100%; aspect-ratio: 1 / 1; object-fit: cover; display: block; background: var(--ds-palette-zinc-100); }
.rbd__img--empty { display: flex; align-items: center; justify-content: center; color: var(--ds-color-text-disabled); }
.rbd__arrow { position: absolute; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; border-radius: 50%; border: 0; background: rgba(0, 0, 0, 0.45); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background var(--ds-duration-fast) var(--ds-ease-standard); }
.rbd__arrow:hover { background: rgba(0, 0, 0, 0.65); }
.rbd__arrow--prev { left: 10px; }
.rbd__arrow--next { right: 10px; }
.rbd__dots { position: absolute; bottom: 12px; left: 0; right: 0; display: flex; justify-content: center; gap: 6px; }
.rbd__dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(255, 255, 255, 0.55); cursor: pointer; }
.rbd__dot.is-active { background: #fff; }
.rbd__content { flex: 1; min-width: 0; overflow-y: auto; padding: 4px 28px 28px; }

.rbd__title { font-size: 1.75rem; font-weight: 700; line-height: 1.15; margin: 0; color: var(--ds-color-text); }
.rbd__price { font-size: 1.125rem; font-weight: 600; color: var(--ds-color-text-subtle); margin-top: 6px; }
.rbd__price span { font-weight: 500; font-size: 0.9375rem; }
.rbd__desc { color: var(--ds-color-text-subtle); margin: 14px 0 0; font-size: 0.9375rem; }
.rbd__chip { display: inline-block; background: var(--bg); color: var(--fg); font-weight: 600; font-size: 0.8125rem; padding: 5px 12px; border-radius: var(--ds-radius-pill); margin-top: 14px; }
.rbd__details { display: flex; flex-direction: column; gap: 6px; margin-top: 16px; }
.rbd__details p { margin: 0; font-size: 0.875rem; line-height: 1.4; color: var(--ds-color-text-subtle); }
.rbd__details strong { color: var(--ds-color-text); font-weight: 600; }

.rbd__sec { margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--ds-color-border); }
.rbd__sec-head { display: flex; align-items: center; justify-content: space-between; }
.rbd__h { font-size: 1.1875rem; font-weight: 700; margin: 0; color: var(--ds-color-text); }
.rbd__sub { color: var(--ds-color-text-subtle); font-size: 0.875rem; margin: 4px 0 0; }
.rbd__nav { display: flex; gap: 8px; }
.rbd__navbtn { width: 34px; height: 34px; border-radius: 50%; border: 1px solid var(--ds-color-border); background: var(--ds-color-surface); color: var(--ds-color-text); cursor: pointer; display: flex; align-items: center; justify-content: center; }
.rbd__navbtn:hover { background: var(--ds-palette-zinc-100); }

.rbd__cards { display: flex; gap: 14px; overflow-x: auto; margin-top: 14px; padding-bottom: 4px; scroll-snap-type: x mandatory; }
.rbd__cards::-webkit-scrollbar { height: 0; }
.rbd__card { position: relative; flex: 0 0 240px; scroll-snap-align: start; text-align: left; display: flex; flex-direction: column; gap: 4px; padding: 16px; border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-md); background: var(--ds-color-surface); cursor: pointer; transition: border-color var(--ds-duration-fast) var(--ds-ease-standard); }
.rbd__card:hover { border-color: var(--ds-color-border-bold); }
.rbd__card.is-on { border-color: var(--ds-color-background-brand-bold); box-shadow: inset 0 0 0 1px var(--ds-color-background-brand-bold); }
.rbd__card-radio { position: absolute; top: 14px; right: 14px; width: 22px; height: 22px; border-radius: 50%; border: 1.5px solid var(--ds-color-border-bold); display: flex; align-items: center; justify-content: center; color: #fff; }
.rbd__card.is-on .rbd__card-radio { background: var(--ds-color-background-brand-bold); border-color: var(--ds-color-background-brand-bold); }
.rbd__card-note { font-size: 0.8125rem; color: var(--ds-color-text-subtle); padding-right: 28px; }
.rbd__card-label { font-weight: 600; font-size: 0.9375rem; color: var(--ds-color-text); }
.rbd__card-price { font-size: 0.875rem; color: var(--ds-color-text-subtle); }

.rbd__night { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--ds-color-border); }
.rbd__night:last-child { border-bottom: 0; }
.rbd__avail { color: var(--ds-palette-orange-600); font-weight: 700; font-size: 0.9375rem; }
.rbd__avail--sm { font-size: 0.8125rem; font-weight: 600; white-space: nowrap; }
.rbd__night--hold { gap: 14px; }
.rbd__ndate { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.rbd__nrate { color: var(--ds-color-text-subtlest); font-size: 0.8125rem; }


.rbd__extra { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--ds-color-border); }
.rbd__extra:last-child { border-bottom: 0; }
.rbd__extra-info { display: flex; flex-direction: column; }
.rbd__extra-label { font-weight: 500; color: var(--ds-color-text); font-size: 0.9375rem; }
.rbd__extra-price { color: var(--ds-color-text-subtle); font-size: 0.875rem; margin-top: 2px; }
.rbd__add { width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--ds-color-border-bold); background: var(--ds-color-surface); color: var(--ds-color-text); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background var(--ds-duration-fast) var(--ds-ease-standard), border-color var(--ds-duration-fast) var(--ds-ease-standard), color var(--ds-duration-fast) var(--ds-ease-standard); flex: none; }
.rbd__add:hover { background: var(--ds-palette-zinc-100); }
.rbd__add.is-on { background: var(--ds-color-background-brand-bold); border-color: var(--ds-color-background-brand-bold); color: #fff; }

.rbd__foot { flex: none; padding: 16px 24px; border-top: 1px solid var(--ds-color-border); background: var(--ds-color-surface); }
.rbd__cta { width: 100%; height: 52px; border-radius: var(--ds-radius-pill); background: var(--ds-palette-zinc-200); color: var(--ds-color-text-subtlest); font-weight: 700; font-size: 1rem; pointer-events: none; transition: background var(--ds-duration-fast) var(--ds-ease-standard), color var(--ds-duration-fast) var(--ds-ease-standard); }
.rbd__cta--ready { background: var(--ds-color-background-brand-bold); color: #fff; pointer-events: auto; }

/* Stack columns on narrow viewports. */
@media (max-width: 760px) {
  .rbd__body { flex-direction: column; overflow-y: auto; }
  .rbd__media { flex: none; padding: 0 20px 16px; }
  .rbd__content { overflow: visible; }
}
</style>
