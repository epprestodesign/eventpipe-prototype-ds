<script setup>
// RoomCardGroup — "Group Block" vertical room card for the Hotel Details
// "Select Your Room" section. Header (room type, bed, occupancy, features) +
// a "Rooms per Night" list with per-night quantity steppers + starting price
// + an "Add to Cart" CTA (muted until a room is picked).
// Availability: available | limited | soldout (soldout dims the card, zeroes the
// steppers, and disables the CTA; per-night labels color by remaining count).
import { ref, computed, onMounted } from 'vue'
import { loadImagery } from '../../lib/imagery'
import QuantityStepper from '../QuantityStepper.vue'

const props = defineProps({
  roomType: { type: String, default: 'Room' },
  bedConfig: { type: String, default: '' },
  maxOccupancy: { type: Number, default: null },
  features: { type: Array, default: () => [] },   // [{ label, value }]
  nights: { type: Array, default: () => [] },      // [{ date, roomsLeft, price }]
  currency: { type: String, default: '$' },
  availability: { type: String, default: 'available' }, // available | limited | soldout
  // Optional photo: explicit `image` wins; else pulled from the imagery library.
  image: { type: String, default: '' },
  imageCategories: { type: Array, default: () => [] },
  seed: { type: Number, default: 0 },
})
const emit = defineEmits(['add'])

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
const leftLabel = (n) => (n <= 0 ? 'Sold out' : n <= 3 ? `Only ${n} left` : `${n} left`)
const leftClass = (n) => (n <= 0 ? 'is-sold' : n <= 3 ? 'is-limited' : 'is-ok')

const qty = ref(props.nights.map(() => 0))
const totalSelected = computed(() => qty.value.reduce((a, b) => a + b, 0))
const startingPrice = computed(() => (props.nights.length ? Math.min(...props.nights.map((n) => n.price)) : 0))
</script>

<template>
  <div class="rcg" :class="{ 'rcg--soldout': soldout }">
    <img v-if="thumb" :src="thumb" :alt="roomType" class="rcg__media" />
    <!-- HEAD -->
    <div class="rcg__head">
      <h3 class="rcg__title">{{ roomType }}</h3>
      <div v-if="bedConfig" class="rcg__bed">{{ bedConfig }}</div>
      <div v-if="maxOccupancy != null" class="rcg__occ"><q-icon name="bed" size="18px" /> <span>Max Occupancy: {{ maxOccupancy }}</span></div>
      <div v-if="features.length" class="rcg__feat">
        <p v-for="f in features" :key="f.label"><strong>{{ f.label }}:</strong> {{ f.value }}</p>
      </div>
    </div>

    <!-- ROOMS PER NIGHT -->
    <div v-if="nights.length" class="rcg__sec">
      <h4 class="rcg__h">Rooms per Night</h4>
      <div v-for="(n, i) in nights" :key="n.date" class="rcg__night">
        <div class="rcg__ndate">
          <span class="rcg__date">{{ n.date }}</span>
          <span class="rcg__nrate">{{ money(n.price) }} / night</span>
        </div>
        <span class="rcg__left" :class="leftClass(n.roomsLeft)">{{ leftLabel(n.roomsLeft) }}</span>
        <quantity-stepper v-model="qty[i]" :min="0" :max="soldout ? 0 : n.roomsLeft" size="sm" />
      </div>
    </div>

    <!-- STARTING PRICE + CTA -->
    <div class="rcg__foot">
      <div class="rcg__starting">STARTING PRICE</div>
      <div class="rcg__amount"><strong>{{ money(startingPrice) }}</strong> <span>/ night</span></div>
      <button type="button" class="rcg__cta" :class="{ 'rcg__cta--ready': totalSelected > 0 && !soldout }" :disabled="soldout || totalSelected === 0" @click="emit('add', totalSelected)">
        {{ soldout ? 'Sold out' : (totalSelected > 0 ? `Add ${totalSelected} to Cart` : 'Add to Cart') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.rcg { display: flex; flex-direction: column; width: 360px; background: var(--ds-color-surface); border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-md); overflow: hidden; }
.rcg--soldout { opacity: 0.6; }
.rcg__media { width: 100%; height: 168px; object-fit: cover; display: block; }

.rcg__head { padding: 20px 22px 16px; display: flex; flex-direction: column; gap: 8px; }
.rcg__title { margin: 0; font-size: 1.375rem; font-weight: 700; color: var(--ds-color-text-brand); line-height: 1.2; }
.rcg__bed { color: var(--ds-color-text-subtle); font-size: 1rem; }
.rcg__occ { display: inline-flex; align-items: center; gap: 8px; color: var(--ds-color-text); font-size: 1rem; }
.rcg__occ .q-icon { color: var(--ds-color-text-brand); }
.rcg__feat { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; }
.rcg__feat p { margin: 0; font-size: 0.9375rem; line-height: 1.4; color: var(--ds-color-text-subtle); }
.rcg__feat strong { color: var(--ds-color-text-brand); font-weight: 700; }

.rcg__sec { padding: 14px 22px; border-top: 1px solid var(--ds-color-border); }
.rcg__h { margin: 0 0 10px; font-size: 1.0625rem; font-weight: 700; color: var(--ds-color-text-brand); }
.rcg__night { display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: 12px; padding: 8px 0; }
.rcg__ndate { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.rcg__date { color: var(--ds-color-text-brand); font-weight: 700; font-size: 1rem; }
.rcg__nrate { color: var(--ds-color-text-subtlest); font-size: 0.8125rem; }
.rcg__left { font-weight: 700; font-size: 0.9375rem; white-space: nowrap; }
.rcg__left.is-ok { color: var(--ds-color-text-success); }
.rcg__left.is-limited { color: var(--ds-palette-orange-600); }
.rcg__left.is-sold { color: var(--ds-color-text-subtlest); }

.rcg__foot { padding: 16px 22px 20px; border-top: 1px solid var(--ds-color-border); margin-top: auto; }
.rcg__starting { color: var(--ds-color-text-subtle); font-size: 0.8125rem; font-weight: 600; letter-spacing: 0.04em; }
.rcg__amount { color: var(--ds-color-text-brand); margin-top: 2px; }
.rcg__amount strong { font-size: 1.5rem; font-weight: 700; }
.rcg__amount span { color: var(--ds-color-text-subtle); font-size: 0.9375rem; }
.rcg__cta { width: 100%; height: 46px; margin-top: 14px; border: 0; border-radius: var(--ds-radius-button); background: var(--ds-palette-slate-300); color: #fff; font-family: inherit; font-size: 1rem; font-weight: 700; cursor: default; transition: background var(--ds-duration-fast) var(--ds-ease-standard); }
.rcg__cta--ready { background: var(--ds-color-background-brand-bold); cursor: pointer; }
.rcg__cta--ready:hover { background: var(--ds-palette-navy-800); }
</style>
