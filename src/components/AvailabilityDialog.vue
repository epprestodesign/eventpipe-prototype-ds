<script setup>
// AvailabilityDialog — opened from a Hotel Listing Card's "Availability" action
// (group bookings). Shows a compact high-level hotel summary (photo, name,
// location, guest rating, popular amenities) above a hold-mode RoomsCarousel,
// so an organizer can browse and hold inventory per night without leaving the
// listing. Self-contained: pass the hotel info + rooms via props.
import { ref, computed, onMounted } from 'vue'
import { loadImagery } from '../lib/imagery'
import DsModal from './DsModal.vue'
import DsRating from './DsRating.vue'
import Amenity from './Amenity.vue'
import RoomsCarousel from './details/RoomsCarousel.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  name: { type: String, default: '' },
  location: { type: String, default: '' },
  rating: { type: Number, default: null },
  reviews: { type: Number, default: null },
  ratingLabel: { type: String, default: '' },
  amenities: { type: Array, default: () => [] },     // [{ icon, label }]
  // Header photo: explicit images win, else resolved from the imagery library.
  images: { type: Array, default: () => [] },
  imageCategories: { type: Array, default: () => ['exterior', 'lobby'] },
  seed: { type: Number, default: 0 },
  rooms: { type: Array, default: () => [] },          // room data for the carousel
  currency: { type: String, default: '$' },
  carouselTitle: { type: String, default: 'Available rooms' },
  carouselSubtitle: { type: String, default: 'Choose how many rooms to hold each night.' },
})
const emit = defineEmits(['update:modelValue'])

// Rooms render as group-block cards (per-night quantity steppers), regardless of caller.
const holdRooms = computed(() => props.rooms.map((r) => ({ currency: props.currency, ...r })))

// Header photo
const lib = ref(null)
onMounted(async () => { lib.value = await loadImagery() })
const photo = computed(() => {
  if (props.images.length) return props.images[0]
  if (!lib.value) return null
  for (const c of props.imageCategories) {
    const arr = lib.value[c]
    if (arr?.length) { const e = arr[props.seed % arr.length]; return { url: e.url, alt: e.alt } }
  }
  return null
})
</script>

<template>
  <ds-modal
    :model-value="modelValue"
    title="Availability"
    :aria-label="`Availability — ${name}`"
    size="lg"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="avd__body">
      <!-- High-level hotel summary -->
      <div class="avd__summary">
        <div class="avd__photo">
          <img v-if="photo" :src="photo.url" :alt="photo.alt || name" />
          <div v-else class="avd__photo--empty"><q-icon name="image" size="28px" /></div>
        </div>
        <div class="avd__info">
          <h3 class="avd__name">{{ name }}</h3>
          <div v-if="location" class="avd__loc">{{ location }}</div>
          <ds-rating v-if="rating != null" :score="rating" :reviews="reviews" :label="ratingLabel" size="sm" />
          <div v-if="amenities.length" class="avd__amenities">
            <amenity v-for="a in amenities" :key="a.key || a.label" :amenity="a" size="sm" />
          </div>
        </div>
      </div>

      <!-- Inventory carousel (hold-mode room cards) -->
      <rooms-carousel :rooms="holdRooms" flow="group" :title="carouselTitle" :subtitle="carouselSubtitle" />
    </div>
  </ds-modal>
</template>

<style scoped>
.avd__body { display: flex; flex-direction: column; gap: 24px; }

/* Summary */
.avd__summary { display: flex; gap: 18px; }
.avd__photo { flex: 0 0 200px; height: 140px; border-radius: var(--ds-radius-md); overflow: hidden; background: var(--ds-palette-zinc-100); }
.avd__photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
.avd__photo--empty { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--ds-color-text-disabled); }
.avd__info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 8px; }
.avd__name { font-size: 1.375rem; font-weight: 700; line-height: 1.2; margin: 0; color: var(--ds-color-text); }
.avd__loc { color: var(--ds-color-text-subtle); font-size: 0.9375rem; }
.avd__amenities { display: flex; flex-wrap: wrap; gap: 10px 20px; margin-top: 2px; }

@media (max-width: 640px) {
  .avd__summary { flex-direction: column; }
  .avd__photo { flex: none; width: 100%; height: 160px; }
}
</style>
