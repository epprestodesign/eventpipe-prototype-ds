<script setup>
// HotelListingCard — composite search-result card for hotel listings.
// Drives several conditional variants from props: deal vs standard pricing,
// availability (available / limited / sold out), trust badge, refundability,
// rating-or-new, and a loading skeleton. The image carousel sources photos
// dynamically from the local imagery library (imagery.js) by category.
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { loadImagery } from '../lib/imagery'
import QuantityStepper from './QuantityStepper.vue'
import AvailabilityDialog from './AvailabilityDialog.vue'

const props = defineProps({
  name: { type: String, default: 'Hotel Name' },
  location: { type: String, default: '' },
  // Explicit images win; otherwise pulled from the imagery library by category.
  images: { type: Array, default: () => [] },
  imageCategories: { type: Array, default: () => ['exterior', 'lobby', 'rooms', 'pool', 'dining'] },
  seed: { type: Number, default: 0 }, // offsets which library image each category yields
  amenities: { type: Array, default: () => [] }, // [{ icon, label }]
  refundLabel: { type: String, default: 'Fully Refundable' },
  rating: { type: Number, default: null }, // null => "New"
  reviews: { type: Number, default: 0 },
  currency: { type: String, default: '$' },
  price: { type: Number, default: null }, // current nightly price
  originalPrice: { type: Number, default: null }, // shown struck-through when > price
  total: { type: Number, default: null },
  discountLabel: { type: String, default: '' }, // e.g. "10% Off"
  badge: { type: Object, default: null }, // { label, tone }
  availability: { type: String, default: 'available' }, // available | limited | soldout
  roomsLeft: { type: Number, default: 0 },
  orientation: { type: String, default: 'horizontal' }, // horizontal | vertical
  loading: { type: Boolean, default: false },
  ctaLabel: { type: String, default: 'Choose your room' },
  ratingLabel: { type: String, default: '' }, // e.g. "Excellent" (Availability dialog)

  // --- Group bookings: "Availability" secondary action + inventory dialog ---
  // When `groupBooking` is set, the card shows an "Availability" secondary button
  // beside the primary CTA that opens an AvailabilityDialog: a compact hotel
  // summary + a hold-mode RoomsCarousel built from `availabilityRooms`.
  groupBooking: { type: Boolean, default: false },
  availabilityRooms: { type: Array, default: () => [] }, // hold-room data for the dialog

  // --- Bookmark / "Save to travel plans" ---
  bookmarkable: { type: Boolean, default: true },     // show the carousel bookmark button
  bookmarked: { type: Boolean, default: false },      // v-model:bookmarked
  tripName: { type: String, default: 'Boston' },      // used in the save toast
  bookmarkToast: { type: Boolean, default: true },    // show a toast on toggle

  // --- Room-rate booking variants (vertical only) ---
  // When `bookingMode` is set, the vertical card renders a room-rate detail
  // body below the carousel instead of the standard listing body:
  //   'reserve' → "Book Reservations": nights availability + Reserve Room CTA
  //   'hold'    → "Hold Rooms for Group or Team": per-night quantity steppers
  //               + Add to Cart CTA
  bookingMode: { type: String, default: null }, // null | 'reserve' | 'hold'
  roomType: { type: String, default: '' },      // room title (falls back to `name`)
  bedConfig: { type: String, default: '' },     // e.g. "1 King Bed, Separate Living Room"
  maxOccupancy: { type: Number, default: null },
  roomDetails: { type: Array, default: () => [] }, // [{ label, value }]
  nights: { type: Array, default: () => [] },      // [{ date, roomsLeft, price }]
  roomCount: { type: Number, default: 1 },         // reserve summary ("N room…")
})
const emit = defineEmits(['update:bookmarked', 'toggle-bookmark'])
const $q = useQuasar()

// Bookmark state mirrors the prop so the card works both controlled
// (v-model:bookmarked) and standalone.
const saved = ref(props.bookmarked)
watch(() => props.bookmarked, (v) => { saved.value = v })
const toggleBookmark = () => {
  saved.value = !saved.value
  emit('update:bookmarked', saved.value)
  emit('toggle-bookmark', saved.value)
  if (props.bookmarkToast) {
    $q.notify({
      message: saved.value ? `This property was saved to your ${props.tripName} trip.` : 'This property was removed',
      icon: saved.value ? 'bookmark' : 'bookmark_border',
      color: 'dark',
      textColor: 'white',
      position: 'bottom',
      timeout: 2600,
    })
  }
}

// Soft badge tones mapped to DS palette ramps.
const TONES = {
  teal: { '--bg': 'var(--ds-palette-teal-100)', '--fg': 'var(--ds-palette-teal-700)' },
  emerald: { '--bg': 'var(--ds-palette-emerald-100)', '--fg': 'var(--ds-palette-emerald-700)' },
  blue: { '--bg': 'var(--ds-palette-blue-100)', '--fg': 'var(--ds-palette-blue-700)' },
  amber: { '--bg': 'var(--ds-palette-amber-100)', '--fg': 'var(--ds-palette-amber-700)' },
  rose: { '--bg': 'var(--ds-palette-rose-100)', '--fg': 'var(--ds-palette-rose-700)' },
  zinc: { '--bg': 'var(--ds-palette-zinc-100)', '--fg': 'var(--ds-color-text)' },
}
const toneStyle = (tone) => TONES[tone] || TONES.teal

const showAvailability = ref(false)
const discounted = computed(() => props.originalPrice != null && props.price != null && props.originalPrice > props.price)
const soldout = computed(() => props.availability === 'soldout')
const limited = computed(() => props.availability === 'limited')
const money = (n) => props.currency + Number(n).toLocaleString('en-US')

// --- Carousel ---
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

// --- Room-rate booking variants ---
const isRoomRate = computed(() => !!props.bookingMode && props.orientation === 'vertical')
const isReserve = computed(() => props.bookingMode === 'reserve')
// Two-decimal currency for the room-rate pricing block (e.g. "269.00").
const fmt2 = (n) => Number(n ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// Per-night room quantities for the 'hold' stepper. Clamped to [0, roomsLeft].
const qty = ref(props.nights.map(() => 0))
const totalSelected = computed(() => qty.value.reduce((a, b) => a + b, 0))
const startingPrice = computed(() => props.nights.length ? Math.min(...props.nights.map((n) => n.price)) : props.price)
</script>

<template>
  <div class="hlc" :class="[`hlc--${orientation}`, { 'hlc--soldout': soldout, 'hlc--group': groupBooking }]">
    <!-- LOADING SKELETON -->
    <template v-if="loading">
      <div class="hlc__media hlc__sk" />
      <div class="hlc__body">
        <div class="hlc__main">
          <div class="hlc__sk hlc__sk-line" style="width:60%;height:22px" />
          <div class="hlc__sk hlc__sk-line" style="width:35%" />
          <div class="hlc__sk hlc__sk-line" style="width:80%;margin-top:16px" />
          <div class="hlc__sk hlc__sk-line" style="width:45%" />
        </div>
        <div class="hlc__price">
          <div class="hlc__sk hlc__sk-line" style="width:80px;height:28px;margin-left:auto" />
          <div class="hlc__sk hlc__sk-line" style="width:120px;margin-left:auto" />
          <div class="hlc__sk hlc__sk-line" style="width:140px;height:44px;margin-top:12px;border-radius:var(--ds-radius-pill)" />
        </div>
      </div>
    </template>

    <!-- CONTENT -->
    <template v-else>
      <div class="hlc__media">
        <img v-if="slides.length" :src="slides[idx].url" :alt="slides[idx].alt" class="hlc__img" />
        <div v-else class="hlc__img hlc__img--empty"><q-icon name="image" size="32px" /></div>

        <div v-if="badge" class="hlc__badge" :style="toneStyle(badge.tone)">{{ badge.label }}</div>

        <button v-if="bookmarkable" type="button" class="hlc__bookmark" :class="{ 'is-saved': saved }" :aria-pressed="saved" :aria-label="saved ? 'Remove from travel plans' : 'Save to travel plans'" @click.stop="toggleBookmark">
          <q-icon :name="saved ? 'bookmark' : 'bookmark_border'" size="20px" />
        </button>

        <template v-if="slides.length > 1">
          <button class="hlc__arrow hlc__arrow--prev" aria-label="Previous photo" @click="prev"><q-icon name="chevron_left" size="20px" /></button>
          <button class="hlc__arrow hlc__arrow--next" aria-label="Next photo" @click="next"><q-icon name="chevron_right" size="20px" /></button>
          <div class="hlc__dots">
            <span v-for="(s, i) in slides" :key="i" class="hlc__dot" :class="{ 'is-active': i === idx }" @click="go(i)" />
          </div>
        </template>

        <div v-if="soldout" class="hlc__sold">Sold out</div>
      </div>

      <!-- ROOM-RATE BODY — vertical booking variants ('reserve' / 'hold') -->
      <div v-if="isRoomRate" class="hlc__rr">
        <div class="hlc__rr-head">
          <h3 class="hlc__rr-title">{{ roomType || name }}</h3>
          <div v-if="bedConfig" class="hlc__rr-bed">{{ bedConfig }}</div>
          <div v-if="maxOccupancy != null" class="hlc__rr-occ">
            <q-icon name="king_bed" size="18px" /> Max Occupancy: {{ maxOccupancy }}
          </div>
          <div v-if="roomDetails.length" class="hlc__rr-details">
            <p v-for="d in roomDetails" :key="d.label"><strong>{{ d.label }}:</strong> {{ d.value }}</p>
          </div>
        </div>

        <div class="hlc__rr-nights">
          <h4 class="hlc__rr-h">{{ isReserve ? 'Nights' : 'Rooms per Night' }}</h4>

          <template v-if="isReserve">
            <div v-for="(n, i) in nights" :key="i" class="hlc__rr-night">
              <span class="hlc__rr-date">{{ n.date }}</span>
              <span class="hlc__rr-avail">{{ n.roomsLeft }} room{{ n.roomsLeft === 1 ? '' : 's' }} left</span>
            </div>
          </template>

          <template v-else>
            <div v-for="(n, i) in nights" :key="i" class="hlc__rr-night hlc__rr-night--hold">
              <div class="hlc__rr-ndate">
                <span class="hlc__rr-date">{{ n.date }}</span>
                <span class="hlc__rr-nrate">{{ currency }}{{ fmt2(n.price) }} / night</span>
              </div>
              <span class="hlc__rr-avail hlc__rr-avail--sm">{{ n.roomsLeft - qty[i] }} left</span>
              <quantity-stepper v-model="qty[i]" :min="0" :max="n.roomsLeft" size="sm" />
            </div>
          </template>
        </div>

        <div class="hlc__rr-foot">
          <template v-if="isReserve">
            <div class="hlc__rr-rate">{{ currency }}{{ fmt2(price) }} USD / room / night</div>
            <div class="hlc__rr-total">{{ currency }}{{ fmt2(total) }} USD total</div>
            <div class="hlc__rr-sub">{{ roomCount }} room{{ roomCount === 1 ? '' : 's' }} · incl. taxes &amp; fees</div>
            <div class="hlc__rr-actions">
              <button class="hlc__rr-link">Price Details ›</button>
              <q-btn unelevated no-caps class="hlc__rr-reserve" label="Reserve Room" />
            </div>
          </template>
          <template v-else>
            <div class="hlc__rr-starting">Starting price</div>
            <div class="hlc__rr-total">{{ currency }}{{ fmt2(startingPrice) }} <span class="hlc__rr-pernight">/ night</span></div>
            <q-btn
              unelevated no-caps
              class="hlc__rr-cart"
              :class="{ 'hlc__rr-cart--ready': totalSelected > 0 }"
              :tabindex="totalSelected > 0 ? 0 : -1"
              :label="totalSelected > 0 ? `Add ${totalSelected} to Cart` : 'Add to Cart'"
            />
          </template>
        </div>
      </div>

      <div v-else class="hlc__body">
        <div class="hlc__main">
          <h3 class="hlc__name">{{ name }}</h3>
          <div v-if="location" class="hlc__loc">{{ location }}</div>

          <div v-if="amenities.length" class="hlc__amenities">
            <span v-for="a in amenities" :key="a.label" class="hlc__amenity"><q-icon :name="a.icon" size="18px" />{{ a.label }}</span>
          </div>

          <div class="hlc__row">
            <span v-if="refundLabel" class="hlc__refund">{{ refundLabel }}</span>
          </div>

          <div class="hlc__rating">
            <template v-if="rating != null">
              <span class="hlc__score">{{ rating.toFixed(1) }}</span>
              <span class="hlc__reviews">{{ reviews.toLocaleString('en-US') }} reviews</span>
            </template>
            <template v-else>
              <span class="hlc__score hlc__score--new">New</span>
              <span class="hlc__reviews">No reviews yet</span>
            </template>
          </div>
        </div>

        <div class="hlc__price">
          <div v-if="discountLabel" class="hlc__deal" :style="toneStyle('teal')">{{ discountLabel }}</div>
          <div class="hlc__prices">
            <span v-if="discounted" class="hlc__orig">{{ money(originalPrice) }}</span>
            <span class="hlc__now">{{ money(price) }}</span>
          </div>
          <div v-if="total != null" class="hlc__totals">{{ money(total) }} total<br><span>(includes taxes &amp; fees)</span></div>
          <div v-if="limited" class="hlc__urgency">Only {{ roomsLeft }} room{{ roomsLeft === 1 ? '' : 's' }} left</div>
          <div class="hlc__actions">
            <button v-if="groupBooking && !soldout" type="button" class="hlc__avail" @click="showAvailability = true">Availability</button>
            <q-btn unelevated class="hlc__cta" :class="{ 'hlc__cta--disabled': soldout }" :tabindex="soldout ? -1 : 0" :label="soldout ? 'Sold out' : ctaLabel" no-caps />
          </div>
        </div>
      </div>
    </template>

    <!-- Group bookings: inventory/availability dialog (hold-mode rooms) -->
    <teleport to="body">
      <availability-dialog
        v-if="groupBooking"
        v-model="showAvailability"
        :name="name" :location="location"
        :rating="rating" :reviews="reviews" :rating-label="ratingLabel"
        :amenities="amenities"
        :images="images" :image-categories="imageCategories" :seed="seed"
        :rooms="availabilityRooms" :currency="currency"
      />
    </teleport>
  </div>
</template>

<style scoped>
.hlc { display: flex; background: var(--ds-color-surface); border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-lg); overflow: hidden; box-shadow: var(--ds-shadow-1); transition: box-shadow var(--ds-duration-base) var(--ds-ease-standard); }
/* Horizontal cards hold the reference proportions so the media never squishes. */
.hlc:not(.hlc--vertical) { min-height: 240px; }
.hlc:not(.hlc--vertical):hover { box-shadow: var(--ds-shadow-3); }
/* Group bookings stack two CTAs (Availability + Choose your room), so give the
   card more height and a bit more breathing room above the action stack. */
.hlc--group:not(.hlc--vertical) { min-height: 292px; }
.hlc--soldout { opacity: 0.92; }

/* Media / carousel */
.hlc__media { position: relative; flex: 0 0 320px; background: var(--ds-palette-zinc-100); overflow: hidden; }
.hlc__img { width: 100%; height: 100%; object-fit: cover; display: block; }
.hlc__img--empty { display: flex; align-items: center; justify-content: center; color: var(--ds-color-text-disabled); height: 100%; }
.hlc__badge { position: absolute; top: 14px; left: 14px; background: var(--bg); color: var(--fg); font-weight: 600; font-size: 0.8125rem; padding: 6px 12px; border-radius: var(--ds-radius-md); }
.hlc__bookmark { position: absolute; top: 12px; right: 12px; width: 38px; height: 38px; border: 0; border-radius: 50%; background: rgba(0,0,0,0.5); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background var(--ds-duration-fast) var(--ds-ease-standard), transform var(--ds-duration-fast) var(--ds-ease-standard); z-index: 2; }
.hlc__bookmark:hover { background: rgba(0,0,0,0.68); }
.hlc__bookmark:active { transform: scale(0.9); }
.hlc__bookmark.is-saved { color: #fff; }
.hlc__arrow { position: absolute; top: 50%; transform: translateY(-50%); width: 34px; height: 34px; border-radius: 50%; border: 0; background: rgba(0,0,0,0.45); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background var(--ds-duration-fast) var(--ds-ease-standard); }
.hlc__arrow:hover { background: rgba(0,0,0,0.65); }
.hlc__arrow--prev { left: 10px; }
.hlc__arrow--next { right: 10px; }
.hlc__dots { position: absolute; bottom: 12px; left: 0; right: 0; display: flex; justify-content: center; gap: 6px; }
.hlc__dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(255,255,255,0.55); cursor: pointer; }
.hlc__dot.is-active { background: #fff; }
.hlc__sold { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(9,9,11,0.55); color: #fff; font-weight: 700; font-size: 1.125rem; letter-spacing: 0.02em; text-transform: uppercase; }

/* Body */
.hlc__body { flex: 1; display: flex; justify-content: space-between; gap: 24px; padding: 22px 24px; }
.hlc__main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.hlc__name { font-size: 1.375rem; font-weight: 700; line-height: 1.2; margin: 0; color: var(--ds-color-text); }
.hlc__loc { color: var(--ds-color-text-subtle); margin-top: 4px; }
.hlc__amenities { display: flex; flex-wrap: wrap; gap: 18px; margin-top: 16px; color: var(--ds-color-text-subtle); }
.hlc__amenity { display: inline-flex; align-items: center; gap: 6px; font-size: 0.875rem; }
.hlc__row { margin-top: auto; padding-top: 18px; }
.hlc__refund { display: inline-block; background: var(--ds-palette-zinc-200); color: var(--ds-color-text); font-weight: 500; font-size: 0.875rem; padding: 7px 14px; border-radius: var(--ds-radius-md); }
.hlc__rating { display: flex; align-items: center; gap: 10px; margin-top: 14px; }
.hlc__score { background: var(--ds-color-background-brand-bold); color: #fff; font-weight: 700; font-size: 0.875rem; padding: 4px 10px; border-radius: var(--ds-radius-sm); }
.hlc__score--new { background: var(--ds-palette-teal-600); }
.hlc__reviews { color: var(--ds-color-text-subtle); font-size: 0.875rem; }

/* Price block */
.hlc__price { display: flex; flex-direction: column; align-items: flex-end; text-align: right; flex: 0 0 auto; min-width: 170px; }
.hlc__deal { background: var(--bg); color: var(--fg); font-weight: 700; font-size: 0.9375rem; padding: 5px 12px; border-radius: var(--ds-radius-md); margin-bottom: 12px; }
.hlc__prices { display: flex; align-items: baseline; gap: 8px; }
.hlc__orig { color: var(--ds-color-text-subtle); text-decoration: line-through; font-size: 1rem; }
.hlc__now { font-size: 1.875rem; font-weight: 700; color: var(--ds-color-text); line-height: 1; }
.hlc__totals { color: var(--ds-color-text-subtle); font-size: 0.8125rem; margin-top: 6px; line-height: 1.35; }
.hlc__urgency { color: var(--ds-palette-rose-600); font-weight: 600; font-size: 0.8125rem; margin-top: 8px; }
/* `auto` consumes the price column's free height so the CTA always anchors to
   the bottom; the column's flex-end keeps it pinned to the right. */
.hlc__cta { height: 48px; padding: 0 22px; border-radius: var(--ds-radius-md); background: var(--ds-color-background-brand-bold); color: #fff; font-weight: 600; }
.hlc__cta--disabled { pointer-events: none; background: var(--ds-palette-zinc-200) !important; color: var(--ds-color-text-subtle) !important; }
/* Group bookings: "Availability" secondary (outline) above the primary CTA.
   `auto` keeps the action stack pinned to the bottom of the price column. */
.hlc__actions { margin-top: auto; display: flex; flex-direction: column; gap: 10px; align-items: stretch; }
/* Group cards have two stacked CTAs — add a little space above the stack. */
.hlc--group .hlc__actions { padding-top: 16px; }
.hlc__avail { height: 48px; padding: 0 22px; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-md); background: var(--ds-color-surface); color: var(--ds-color-text); font-weight: 600; font-size: 0.9375rem; font-family: inherit; cursor: pointer; transition: background var(--ds-duration-fast) var(--ds-ease-standard); }
.hlc__avail:hover { background: var(--ds-color-surface-sunken); }

/* Skeleton */
.hlc__sk { position: relative; overflow: hidden; background: var(--ds-palette-zinc-100); border-radius: var(--ds-radius-sm); }
.hlc__sk-line { height: 14px; margin-bottom: 10px; }
.hlc__sk::after { content: ''; position: absolute; inset: 0; transform: translateX(-100%); background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent); animation: hlc-shimmer 1.3s infinite; }
@keyframes hlc-shimmer { 100% { transform: translateX(100%); } }

/* Vertical (grid card) */
.hlc--vertical { flex-direction: column; width: 340px; }
.hlc--vertical .hlc__media { flex: 0 0 200px; width: 100%; }
.hlc--vertical .hlc__body { flex-direction: column; gap: 16px; }
.hlc--vertical .hlc__row { margin-top: 4px; padding-top: 0; }
.hlc--vertical .hlc__price { align-items: stretch; text-align: left; min-width: 0; }
.hlc--vertical .hlc__deal { align-self: flex-start; }
.hlc--vertical .hlc__totals { margin-bottom: 4px; }
/* Stacked card has no spare height to absorb, so restore an explicit gap. */
.hlc--vertical .hlc__cta { width: 100%; margin-top: 16px; }

/* --- Room-rate booking variants (vertical: 'reserve' / 'hold') --- */
.hlc__rr { display: flex; flex-direction: column; flex: 1; }
/* Sections divide full-bleed, so each carries its own padding. */
.hlc__rr-head, .hlc__rr-nights, .hlc__rr-foot { padding: 18px 20px; }
.hlc__rr-nights, .hlc__rr-foot { border-top: 1px solid var(--ds-color-border); }

.hlc__rr-head { display: flex; flex-direction: column; gap: 8px; }
.hlc__rr-title { font-size: 1.25rem; font-weight: 700; line-height: 1.2; margin: 0; color: var(--ds-color-text); }
.hlc__rr-bed { color: var(--ds-color-text-subtle); font-size: 0.9375rem; }
.hlc__rr-occ { display: inline-flex; align-items: center; gap: 6px; color: var(--ds-color-text); font-size: 0.9375rem; }
.hlc__rr-details { display: flex; flex-direction: column; gap: 6px; margin-top: 4px; }
.hlc__rr-details p { margin: 0; font-size: 0.875rem; line-height: 1.4; color: var(--ds-color-text-subtle); }
.hlc__rr-details strong { color: var(--ds-color-text); font-weight: 600; }

.hlc__rr-h { font-size: 1.0625rem; font-weight: 700; margin: 0 0 12px; color: var(--ds-color-text); }
.hlc__rr-night { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 6px 0; }
.hlc__rr-night--hold { gap: 10px; }
.hlc__rr-ndate { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.hlc__rr-date { color: var(--ds-color-text); font-size: 0.9375rem; }
.hlc__rr-nrate { color: var(--ds-color-text-subtlest); font-size: 0.8125rem; }
.hlc__rr-avail { color: var(--ds-palette-orange-600); font-weight: 700; font-size: 0.9375rem; }
.hlc__rr-avail--sm { font-size: 0.8125rem; font-weight: 600; white-space: nowrap; }

/* Stepper — single rounded container, muted +/−, dark value (per reference). */

.hlc__rr-foot { display: flex; flex-direction: column; }
.hlc__rr-rate { color: var(--ds-color-text-subtle); font-size: 0.9375rem; }
.hlc__rr-total { font-size: 1.375rem; font-weight: 700; color: var(--ds-color-text); margin-top: 2px; }
.hlc__rr-pernight { font-size: 0.9375rem; font-weight: 500; color: var(--ds-color-text-subtle); }
.hlc__rr-sub { color: var(--ds-color-text-subtlest); font-size: 0.8125rem; margin-top: 4px; }
.hlc__rr-starting { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: var(--ds-color-text-subtle); }
.hlc__rr-actions { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 16px; }
.hlc__rr-link { background: none; border: 0; padding: 0; cursor: pointer; color: var(--ds-color-text-info); font-weight: 600; font-size: 0.9375rem; }
.hlc__rr-link:hover { text-decoration: underline; }
.hlc__rr-reserve { height: 46px; padding: 0 22px; border-radius: var(--ds-radius-md); background: var(--ds-color-background-brand-bold); color: #fff; font-weight: 600; }
/* Cart CTA is muted until at least one room is selected, then activates brand. */
.hlc__rr-cart { width: 100%; height: 46px; margin-top: 14px; border-radius: var(--ds-radius-md); background: var(--ds-palette-zinc-200); color: var(--ds-color-text-subtlest); font-weight: 600; pointer-events: none; transition: background var(--ds-duration-fast) var(--ds-ease-standard), color var(--ds-duration-fast) var(--ds-ease-standard); }
.hlc__rr-cart--ready { background: var(--ds-color-background-brand-bold); color: #fff; pointer-events: auto; }
</style>
