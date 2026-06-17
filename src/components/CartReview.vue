<script setup>
// CartReview — the recyclable body of the booking cart, shared by CartFlyout
// (slide-over) and the Checkout "Review order" step. Two modes:
//   'hold'    → collapsible hotels → rooms → per-day QuantitySteppers + an
//               aggregated Price details card.
//   'reserve' → carousel, stay dates, highlights, room features + Price details.
// Emits live `update:count` / `update:total`; exposes clear() for "Clear Cart".
import { ref, computed, watch, onMounted } from 'vue'
import { loadImagery } from '../lib/imagery'
import QuantityStepper from './QuantityStepper.vue'

const props = defineProps({
  mode: { type: String, default: 'reserve' }, // reserve | hold
  cart: { type: Object, default: () => ({}) },
  currency: { type: String, default: '$' },
  showRequests: { type: Boolean, default: true },
  readonly: { type: Boolean, default: false }, // rail summary: static quantities, no edit
  showPrice: { type: Boolean, default: true }, // the Price details card
  showAddHotel: { type: Boolean, default: true }, // hold: "Add another hotel" CTA
  cards: { type: Boolean, default: false }, // hold: wrap hotels in its own card, separate from price
  orderTitle: { type: String, default: '' }, // hold: header above the hotels (e.g. "Review your order")
  collapsible: { type: Boolean, default: false }, // hold: orderTitle toggles the hotels list (starts collapsed)
  bind: { type: Boolean, default: false }, // edit the passed cart directly (share live state across instances)
})
const emit = defineEmits(['update:count', 'update:total', 'requests'])

const money = (n) => props.currency + Number(n ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const isReserve = computed(() => props.mode === 'reserve')

// --- Imagery (reserve carousel + per-hotel thumbnails) ---
const lib = ref(null)
onMounted(async () => { lib.value = await loadImagery() })
const resolveImages = (cats, seed) => {
  if (!lib.value) return []
  const out = []
  for (const c of cats || []) { const arr = lib.value[c]; if (arr?.length) { const e = arr[(seed || 0) % arr.length]; out.push({ url: e.url, alt: e.alt }) } }
  return out
}
const slides = computed(() => (props.cart.images?.length ? props.cart.images : resolveImages(props.cart.imageCategories || ['suites', 'rooms', 'lobby', 'pool', 'dining'], props.cart.seed)))
const idx = ref(0)
const go = (n) => { const len = slides.value.length || 1; idx.value = (n + len) % len }
const prev = () => go(idx.value - 1)
const next = () => go(idx.value + 1)
const hotelThumb = (h) => resolveImages(h.imageCategories || ['suites', 'rooms'], h.seed)[0]
const hotel = computed(() => props.cart.hotel || {})

// --- Hold: collapsible hotels → rooms → nights. With `bind`, edit the passed
// (reactive) cart directly so multiple instances stay in sync; otherwise clone. ---
const hotels = ref(props.bind
  ? (props.cart.hotels || [])
  : (props.cart.hotels || []).map((h) => ({ ...h, rooms: h.rooms.map((r) => ({ ...r, nights: r.nights.map((n) => ({ ...n })) })) })))
// In the rail (collapsible), each hotel starts collapsed to a compact header row.
const openHotels = ref((props.cart.hotels || []).map(() => !props.collapsible))
const toggleHotel = (hi) => { openHotels.value[hi] = !openHotels.value[hi] }
const removeNight = (hi, ri, ni) => {
  const rooms = hotels.value[hi].rooms
  rooms[ri].nights.splice(ni, 1)
  if (rooms[ri].nights.length === 0) rooms.splice(ri, 1)
  if (rooms.length === 0) { hotels.value.splice(hi, 1); openHotels.value.splice(hi, 1) }
}
const clear = () => { hotels.value = []; openHotels.value = [] }
const hotelRooms = (h) => h.rooms.reduce((s, r) => s + r.nights.reduce((a, n) => a + n.qty, 0), 0)
const hotelSubtotal = (h) => h.rooms.reduce((s, r) => s + r.nights.reduce((a, n) => a + n.qty * r.price, 0), 0)
const totalRooms = computed(() => hotels.value.reduce((s, h) => s + hotelRooms(h), 0))

const roomLines = computed(() => {
  const lines = []
  for (const h of hotels.value) {
    for (const r of h.rooms) {
      const nights = r.nights.reduce((a, n) => a + n.qty, 0)
      if (nights > 0) lines.push({ label: r.type, nights, subtotal: nights * r.price })
    }
  }
  return lines
})
const holdSubtotal = computed(() => roomLines.value.reduce((s, l) => s + l.subtotal, 0))
const holdTaxes = computed(() => holdSubtotal.value * (props.cart.taxRate ?? 0.12))
const holdFee = computed(() => totalRooms.value * (props.cart.feePerNight ?? 0))
const holdTotal = computed(() => holdSubtotal.value + holdTaxes.value + holdFee.value)

const total = computed(() => (isReserve.value ? (props.cart.priceDetails?.total ?? 0) : holdTotal.value))

watch(totalRooms, (v) => emit('update:count', isReserve.value ? 1 : v), { immediate: true })
watch(total, (v) => emit('update:total', v), { immediate: true })

defineExpose({ clear })
</script>

<template>
  <div class="cr" :class="{ 'cr--cards': cards }">
    <!-- ============ RESERVE ============ -->
    <template v-if="isReserve">
      <div class="cr__resbody" :class="{ 'cr__resbody--card': cards }">
      <div class="cr__carousel">
        <img v-if="slides.length" :src="slides[idx].url" :alt="slides[idx].alt" class="cr__img" />
        <div v-else class="cr__img cr__img--empty"><q-icon name="image" size="36px" /></div>
        <span v-if="slides.length" class="cr__counter">{{ idx + 1 }}/{{ slides.length }}</span>
        <template v-if="slides.length > 1">
          <button class="cr__arrow cr__arrow--prev" aria-label="Previous photo" @click="prev"><q-icon name="chevron_left" size="20px" /></button>
          <button class="cr__arrow cr__arrow--next" aria-label="Next photo" @click="next"><q-icon name="chevron_right" size="20px" /></button>
        </template>
      </div>

      <div class="cr__pad">
        <h3 class="cr__hotel">{{ hotel.name }}</h3>
        <div v-if="hotel.address" class="cr__addr">{{ hotel.address }}</div>

        <div class="cr__stay">
          <div class="cr__stay-col">
            <span class="cr__stay-label">Check-in</span>
            <span class="cr__stay-val">{{ cart.checkIn?.date }}</span>
            <span v-if="cart.checkIn?.time" class="cr__stay-sub">{{ cart.checkIn.time }}</span>
          </div>
          <div class="cr__stay-col">
            <span class="cr__stay-label">Check-out</span>
            <span class="cr__stay-val">{{ cart.checkOut?.date }}</span>
            <span v-if="cart.checkOut?.time" class="cr__stay-sub">{{ cart.checkOut.time }}</span>
          </div>
          <div class="cr__stay-col">
            <span class="cr__stay-label">Nights</span>
            <span class="cr__stay-val">{{ cart.nights }}</span>
          </div>
        </div>

        <div v-if="cart.highlights?.length" class="cr__feat">
          <h4 class="cr__feat-h">Property highlights</h4>
          <div class="cr__feat-grid">
            <span v-for="h in cart.highlights" :key="h.label" class="cr__feat-item"><q-icon :name="h.icon" size="18px" />{{ h.label }}</span>
          </div>
        </div>

        <div v-if="cart.roomType" class="cr__feat">
          <h4 class="cr__feat-h">{{ cart.roomType }}</h4>
          <div class="cr__feat-grid">
            <span v-if="cart.bedConfig" class="cr__feat-item"><q-icon name="king_bed" size="18px" />{{ cart.bedConfig }}</span>
            <span v-if="cart.sleeps != null" class="cr__feat-item"><q-icon name="group" size="18px" />Sleeps {{ cart.sleeps }}</span>
          </div>
          <div v-if="cart.amenities?.length" class="cr__feat-grid">
            <span v-for="a in cart.amenities" :key="a.label" class="cr__feat-item"><q-icon :name="a.icon" size="18px" />{{ a.label }}</span>
          </div>
        </div>

        <button v-if="showRequests" class="cr__reqrow" @click="emit('requests')">Any special/accessibility requests? <q-icon name="chevron_right" size="20px" /></button>
      </div>
      </div>

      <div v-if="cart.priceDetails && showPrice" class="cr__pricecard">
        <h4 class="cr__price-h">Price details</h4>
        <div class="cr__priceline">
          <div class="cr__priceline-l">
            <span>{{ cart.priceDetails.nights }} night{{ cart.priceDetails.nights === 1 ? '' : 's' }} x {{ cart.priceDetails.rooms }} room{{ cart.priceDetails.rooms === 1 ? '' : 's' }} x {{ money(cart.priceDetails.rate) }}</span>
            <span v-if="cart.priceDetails.program" class="cr__price-sub">{{ cart.priceDetails.program }}</span>
          </div>
          <span>{{ money(cart.priceDetails.subtotal) }}</span>
        </div>
        <div v-if="cart.priceDetails.discount" class="cr__discount">{{ cart.priceDetails.discount }}</div>
        <div class="cr__kv"><span>Taxes</span><span>{{ money(cart.priceDetails.taxes) }}</span></div>
        <div v-if="cart.priceDetails.propertyFee != null" class="cr__kv"><span>Property fee</span><span>{{ money(cart.priceDetails.propertyFee) }}</span></div>
        <div class="cr__rule" />
        <div class="cr__kv cr__kv--total"><span>Total</span><span>{{ money(cart.priceDetails.total) }}</span></div>
        <div class="cr__quoted">Rates are quoted in USD ($).</div>
        <div v-if="cart.roomsLeft" class="cr__heldnote"><q-icon name="king_bed" size="15px" /> <span>We have {{ cart.roomsLeft }} room{{ cart.roomsLeft === 1 ? '' : 's' }} left at this price!</span></div>
      </div>
    </template>

    <!-- ============ HOLD ============ -->
    <template v-else>
      <div class="cr__hold" :class="{ 'cr__hold--cards': cards }">
        <div class="cr__holdwrap" :class="{ 'cr__holdwrap--card': cards }">
        <h3 v-if="orderTitle" class="cr__ordertitle">{{ orderTitle }}</h3>
        <div v-for="(h, hi) in hotels" :key="hi" class="cr__hotelblock">
          <button class="cr__hotelhead" :aria-expanded="openHotels[hi]" @click="toggleHotel(hi)">
            <img v-if="hotelThumb(h)" :src="hotelThumb(h).url" :alt="hotelThumb(h).alt" class="cr__hthumb" />
            <div v-else class="cr__hthumb cr__img--empty"><q-icon name="image" size="18px" /></div>
            <div class="cr__hinfo">
              <span class="cr__hname">{{ h.name }}</span>
              <span class="cr__hsummary">{{ hotelRooms(h) }} room{{ hotelRooms(h) === 1 ? '' : 's' }} · {{ money(hotelSubtotal(h)) }}</span>
            </div>
            <q-icon :name="openHotels[hi] ? 'expand_less' : 'expand_more'" size="24px" class="cr__hchevron" />
          </button>

          <div v-show="openHotels[hi]" class="cr__hbody">
            <div v-for="(r, ri) in h.rooms" :key="ri" class="cr__room">
              <div class="cr__roomhead">
                <div class="cr__rinfo">
                  <span class="cr__rtitle">{{ r.type }}</span>
                  <span v-if="r.summary" class="cr__rsummary">{{ r.summary }}</span>
                </div>
                <span class="cr__rprice">{{ money(r.price) }}<small>/nt</small></span>
              </div>
              <div v-for="(n, ni) in r.nights" :key="ni" class="cr__dayrow">
                <div class="cr__dayinfo">
                  <span class="cr__date">{{ n.date }}</span>
                  <span v-if="!readonly" class="cr__left">{{ n.roomsLeft - n.qty }} left</span>
                </div>
                <quantity-stepper v-if="!readonly" v-model="n.qty" :min="1" :max="n.roomsLeft" removable size="sm" @remove="removeNight(hi, ri, ni)" />
                <span v-else class="cr__qty">{{ n.qty }} room{{ n.qty === 1 ? '' : 's' }}</span>
              </div>
            </div>
          </div>
        </div>

        <button v-if="!readonly && showAddHotel" class="cr__addhotel"><q-icon name="add" size="18px" /> Add another hotel</button>
        </div>

        <div v-if="totalRooms > 0 && showPrice" class="cr__pricecard">
          <h4 class="cr__price-h">Price details</h4>
          <div v-for="(l, i) in roomLines" :key="i" class="cr__kv"><span>{{ l.label }} · {{ l.nights }} night{{ l.nights === 1 ? '' : 's' }}</span><span>{{ money(l.subtotal) }}</span></div>
          <div class="cr__rule" />
          <div class="cr__kv"><span>Taxes</span><span>{{ money(holdTaxes) }}</span></div>
          <div class="cr__kv"><span>Property fee</span><span>{{ money(holdFee) }}</span></div>
          <div class="cr__rule" />
          <div class="cr__kv cr__kv--total"><span>Total</span><span>{{ money(holdTotal) }}</span></div>
          <div class="cr__quoted">Rates are quoted in USD ($).</div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.cr__pad { padding: 18px 20px 24px; }

/* Reserve carousel */
.cr__carousel { position: relative; }
.cr__img { width: 100%; aspect-ratio: 16 / 10; object-fit: cover; display: block; background: var(--ds-palette-zinc-100); }
.cr__img--empty { display: flex; align-items: center; justify-content: center; color: var(--ds-color-text-disabled); }
.cr__arrow { position: absolute; top: 50%; transform: translateY(-50%); width: 32px; height: 32px; border: 0; border-radius: 50%; background: rgba(0, 0, 0, 0.45); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.cr__arrow:hover { background: rgba(0, 0, 0, 0.65); }
.cr__arrow--prev { left: 10px; }
.cr__arrow--next { right: 10px; }
.cr__counter { position: absolute; bottom: 10px; left: 10px; background: rgba(0, 0, 0, 0.55); color: #fff; font-size: 0.75rem; font-weight: 600; padding: 2px 9px; border-radius: var(--ds-radius-pill); }

.cr__hotel { font-size: 1.375rem; font-weight: 700; margin: 0; color: var(--ds-color-text); line-height: 1.2; }
.cr__addr { color: var(--ds-color-text-subtle); font-size: 0.9375rem; margin-top: 8px; }

.cr__stay { display: flex; gap: 32px; background: var(--ds-palette-zinc-100); border-radius: var(--ds-radius-md); padding: 24px; margin-top: 14px; }
.cr__stay-col { display: flex; flex-direction: column; gap: 2px; }
.cr__stay-label { font-size: 0.75rem; color: var(--ds-color-text-subtle); }
.cr__stay-val { font-size: 0.875rem; font-weight: 600; color: var(--ds-color-text); line-height: 1.25; white-space: nowrap; }
.cr__stay-sub { font-size: 0.8125rem; color: var(--ds-color-text-subtle); }

.cr__feat { margin-top: 18px; }
.cr__feat-h { font-size: 0.9375rem; font-weight: 700; color: var(--ds-color-text); margin: 0 0 10px; }
.cr__feat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 12px; }
.cr__feat-grid + .cr__feat-grid { margin-top: 10px; }
.cr__feat-item { display: inline-flex; align-items: center; gap: 8px; font-size: 0.875rem; color: var(--ds-color-text-subtle); }
.cr__feat-item :deep(.q-icon) { color: var(--ds-color-text); flex: none; }
.cr__reqrow { display: flex; align-items: center; justify-content: space-between; width: 100%; gap: 12px; margin-top: 18px; padding: 14px 0 0; border: 0; border-top: 1px solid var(--ds-color-border); background: none; cursor: pointer; font-size: 0.9375rem; color: var(--ds-color-text); }
.cr__reqrow:hover { color: var(--ds-color-text-info); }

/* Hold: collapsible hotels */
.cr__hold { display: flex; flex-direction: column; }
/* Card mode (rail): body in its own card, separated from the price card. */
.cr--cards { display: flex; flex-direction: column; gap: 16px; }
.cr--cards .cr__pricecard { margin: 0; }
.cr__hold--cards { gap: 16px; }
.cr__holdwrap--card { background: var(--ds-color-surface); border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-lg); overflow: hidden; }
.cr__holdwrap--card .cr__hotelblock:last-child { border-bottom: 0; }
.cr__resbody--card { background: var(--ds-color-surface); border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-lg); overflow: hidden; }
.cr__ordertitle { font-size: 1.375rem; font-weight: 700; color: var(--ds-color-text); margin: 0; padding: 18px 20px 10px; }
.cr__hotelblock { border-bottom: 1px solid var(--ds-color-border); }
.cr__hotelhead { display: flex; align-items: center; gap: 12px; width: 100%; padding: 14px 20px; background: none; border: 0; cursor: pointer; text-align: left; }
.cr__hotelhead:hover { background: var(--ds-palette-zinc-50); }
.cr__hthumb { width: 44px; height: 44px; border-radius: var(--ds-radius-sm); object-fit: cover; flex: none; background: var(--ds-palette-zinc-100); }
.cr__hinfo { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.cr__hname { font-weight: 700; font-size: 0.9375rem; color: var(--ds-color-text); }
.cr__hsummary { font-size: 0.8125rem; color: var(--ds-color-text-subtle); }
.cr__hchevron { color: var(--ds-color-text-subtle); flex: none; }
.cr__hbody { padding: 0 20px 10px; }

.cr__room { padding: 12px 0; border-top: 1px solid var(--ds-color-border); }
.cr__room:first-child { border-top: 0; }
.cr__roomhead { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.cr__rinfo { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.cr__rtitle { font-weight: 600; font-size: 0.9375rem; color: var(--ds-color-text); }
.cr__rsummary { font-size: 0.8125rem; color: var(--ds-color-text-subtle); }
.cr__rprice { font-weight: 700; font-size: 0.9375rem; color: var(--ds-color-text); white-space: nowrap; }
.cr__rprice small { font-weight: 500; color: var(--ds-color-text-subtle); font-size: 0.8125rem; }
.cr__dayrow { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 8px 0 0 16px; }
.cr__dayinfo { display: flex; align-items: center; gap: 10px; }
.cr__date { font-size: 0.875rem; color: var(--ds-color-text); }
.cr__left { font-size: 0.75rem; font-weight: 600; color: var(--ds-palette-orange-600); white-space: nowrap; }
.cr__qty { font-weight: 600; font-size: 0.875rem; color: var(--ds-color-text); white-space: nowrap; }
.cr__addhotel { display: inline-flex; align-items: center; gap: 6px; align-self: flex-start; margin: 14px 20px 20px; padding: 10px 18px; border: 1px solid var(--ds-color-background-brand-bold); border-radius: var(--ds-radius-pill); background: var(--ds-color-surface); color: var(--ds-color-text); font-weight: 600; font-size: 0.9375rem; cursor: pointer; transition: background var(--ds-duration-fast) var(--ds-ease-standard), color var(--ds-duration-fast) var(--ds-ease-standard); }
.cr__addhotel:hover { background: var(--ds-color-background-brand-bold); color: #fff; }

/* Shared key/value + rule */
.cr__rule { height: 1px; background: var(--ds-color-border); margin: 12px 0; }
.cr__kv { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; padding: 4px 0; font-size: 0.9375rem; }
.cr__kv > span:first-child { color: var(--ds-color-text-subtle); }
.cr__kv > span:last-child { color: var(--ds-color-text); }
.cr__kv--total { font-size: 1.0625rem; }
.cr__kv--total > span { color: var(--ds-color-text) !important; font-weight: 700; }

/* Price details card */
.cr__pricecard { background: var(--ds-color-surface); margin: 6px 20px 20px; border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-md); padding: 16px; }
.cr__price-h { font-size: 1.0625rem; font-weight: 700; margin: 0 0 12px; color: var(--ds-color-text); }
.cr__priceline { display: flex; justify-content: space-between; gap: 12px; align-items: flex-start; }
.cr__priceline-l { display: flex; flex-direction: column; }
.cr__priceline-l > span:first-child { color: var(--ds-color-text); font-size: 0.9375rem; }
.cr__price-sub { color: var(--ds-color-text-subtle); font-size: 0.8125rem; margin-top: 2px; }
.cr__discount { display: inline-block; background: var(--ds-palette-green-600); color: #fff; font-weight: 600; font-size: 0.8125rem; padding: 3px 10px; border-radius: var(--ds-radius-sm); margin-top: 10px; }
.cr__quoted { color: var(--ds-color-text-subtlest); font-size: 0.75rem; margin-top: 12px; }
.cr__heldnote { display: flex; align-items: center; gap: 7px; margin-top: 12px; background: var(--ds-color-background-warning); color: var(--ds-palette-amber-800); border: 1px solid var(--ds-palette-amber-200); border-radius: var(--ds-radius-md); padding: 9px 12px; font-size: 0.8125rem; }
</style>
