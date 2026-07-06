<script setup>
// RoomCardReserve — "Book Reservations" vertical room card for the Hotel Details
// "Select Your Room" section. Header (room type, bed, occupancy, features) +
// a per-night rooms-left list + price (per room/night, stay total) + a
// "Price Details" link and "Reserve Room" CTA.
// Availability: available | limited | soldout (soldout dims the card + disables
// the CTA; per-night labels color by remaining count).
import { ref, computed, onMounted } from 'vue'
import { loadImagery } from '../../lib/imagery'

const props = defineProps({
  roomType: { type: String, default: 'Room' },
  bedConfig: { type: String, default: '' },
  maxOccupancy: { type: Number, default: null },
  features: { type: Array, default: () => [] },   // [{ label, value }]
  nights: { type: Array, default: () => [] },      // [{ date, roomsLeft }]
  currency: { type: String, default: '$' },
  pricePerNight: { type: Number, default: null },  // "$X USD / room / night"
  total: { type: Number, default: null },          // stay total
  roomCount: { type: Number, default: 1 },
  availability: { type: String, default: 'available' }, // available | limited | soldout
  // Optional photo: explicit `image` wins; else pulled from the imagery library
  // by category. Omit both for a text-only card.
  image: { type: String, default: '' },
  imageCategories: { type: Array, default: () => [] }, // e.g. ['rooms','suites']
  seed: { type: Number, default: 0 },
})
const emit = defineEmits(['reserve', 'price-details'])

const soldout = computed(() => props.availability === 'soldout')

// Optional thumbnail — explicit image, or first available library image.
const loaded = ref('')
const thumb = computed(() => props.image || loaded.value)
onMounted(async () => {
  if (props.image || !props.imageCategories.length) return
  const lib = await loadImagery()
  for (const c of props.imageCategories) {
    const arr = lib[c]
    if (arr && arr.length) { loaded.value = arr[props.seed % arr.length].url; break }
  }
})
const money = (n) => props.currency + Number(n ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const leftLabel = (n) => (n <= 0 ? 'Sold out' : n <= 3 ? `Only ${n} left` : `${n} rooms left`)
const leftClass = (n) => (n <= 0 ? 'is-sold' : n <= 3 ? 'is-limited' : 'is-ok')
</script>

<template>
  <div class="rcr" :class="{ 'rcr--soldout': soldout }">
    <img v-if="thumb" :src="thumb" :alt="roomType" class="rcr__media" />
    <!-- HEAD -->
    <div class="rcr__head">
      <h3 class="rcr__title">{{ roomType }}</h3>
      <div v-if="bedConfig" class="rcr__bed">{{ bedConfig }}</div>
      <div v-if="maxOccupancy != null" class="rcr__occ"><q-icon name="bed" size="18px" /> <span>Max Occupancy: {{ maxOccupancy }}</span></div>
      <div v-if="features.length" class="rcr__feat">
        <p v-for="f in features" :key="f.label"><strong>{{ f.label }}:</strong> {{ f.value }}</p>
      </div>
    </div>

    <!-- NIGHTS -->
    <div v-if="nights.length" class="rcr__sec">
      <h4 class="rcr__h">Nights</h4>
      <div v-for="n in nights" :key="n.date" class="rcr__night">
        <span class="rcr__date">{{ n.date }}</span>
        <span class="rcr__left" :class="leftClass(n.roomsLeft)">{{ leftLabel(n.roomsLeft) }}</span>
      </div>
    </div>

    <!-- PRICE + CTA -->
    <div class="rcr__foot">
      <div v-if="pricePerNight != null" class="rcr__per">{{ money(pricePerNight) }} USD / room / night</div>
      <div v-if="total != null" class="rcr__total">{{ money(total) }} USD total</div>
      <div class="rcr__sub">{{ roomCount }} room{{ roomCount === 1 ? '' : 's' }} · incl. taxes &amp; fees</div>
      <div class="rcr__actions">
        <button type="button" class="rcr__pricelink" @click="emit('price-details')">Price Details ›</button>
        <button type="button" class="rcr__cta" :disabled="soldout" @click="emit('reserve')">{{ soldout ? 'Sold out' : 'Reserve Room' }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rcr { display: flex; flex-direction: column; width: 360px; background: var(--ds-color-surface); border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-md); overflow: hidden; }
.rcr--soldout { opacity: 0.6; }
.rcr__media { width: 100%; height: 168px; object-fit: cover; display: block; }

.rcr__head { padding: 20px 22px 16px; display: flex; flex-direction: column; gap: 8px; }
.rcr__title { margin: 0; font-size: 1.375rem; font-weight: 700; color: var(--ds-color-text-brand); line-height: 1.2; }
.rcr__bed { color: var(--ds-color-text-subtle); font-size: 1rem; }
.rcr__occ { display: inline-flex; align-items: center; gap: 8px; color: var(--ds-color-text); font-size: 1rem; }
.rcr__occ .q-icon { color: var(--ds-color-text-brand); }
.rcr__feat { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; }
.rcr__feat p { margin: 0; font-size: 0.9375rem; line-height: 1.4; color: var(--ds-color-text-subtle); }
.rcr__feat strong { color: var(--ds-color-text-brand); font-weight: 700; }

.rcr__sec { padding: 14px 22px; border-top: 1px solid var(--ds-color-border); }
.rcr__h { margin: 0 0 10px; font-size: 1.0625rem; font-weight: 700; color: var(--ds-color-text-brand); }
.rcr__night { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 6px 0; }
.rcr__date { color: var(--ds-color-text-brand); font-weight: 700; font-size: 1rem; }
.rcr__left { font-weight: 700; font-size: 1rem; white-space: nowrap; }
.rcr__left.is-ok { color: var(--ds-color-text-success); }
.rcr__left.is-limited { color: var(--ds-palette-orange-600); }
.rcr__left.is-sold { color: var(--ds-color-text-subtlest); }

.rcr__foot { padding: 16px 22px 20px; border-top: 1px solid var(--ds-color-border); margin-top: auto; }
.rcr__per { color: var(--ds-color-text-subtle); font-size: 1rem; }
.rcr__total { color: var(--ds-color-text-brand); font-size: 1.5rem; font-weight: 700; line-height: 1.1; margin-top: 2px; }
.rcr__sub { color: var(--ds-color-text-subtlest); font-size: 0.8125rem; margin-top: 4px; }
.rcr__actions { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 16px; }
.rcr__pricelink { background: none; border: 0; padding: 0; color: var(--ds-color-link); font-family: inherit; font-size: 1rem; font-weight: 600; cursor: pointer; }
.rcr__pricelink:hover { text-decoration: underline; }
.rcr__cta { height: 46px; padding: 0 22px; border: 0; border-radius: var(--ds-radius-button); background: var(--ds-color-background-brand-bold); color: #fff; font-family: inherit; font-size: 1rem; font-weight: 700; cursor: pointer; transition: background var(--ds-duration-fast) var(--ds-ease-standard); }
.rcr__cta:hover:not(:disabled) { background: var(--ds-palette-navy-800); }
.rcr__cta:disabled { background: var(--ds-palette-slate-300); cursor: default; }
</style>
