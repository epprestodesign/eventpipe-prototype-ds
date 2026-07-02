<script setup>
// HotelDetailPage — the full hotel detail screen, composed from the Hotel
// Details building blocks: a photo gallery (DsImageList), a sticky DetailTabs
// nav that scrolls to each section, the HotelSummaryHeader, the RoomsCarousel
// ("Select Your Room"), and the About / Amenities / Policies sections.
import { ref, onMounted } from 'vue'
import { loadImagery } from '../../lib/imagery'
import GalleryHero from './GalleryHero.vue'
import DetailTabs from './DetailTabs.vue'
import HotelSummaryHeader from './HotelSummaryHeader.vue'
import RoomsCarousel from './RoomsCarousel.vue'
import AboutProperty from './AboutProperty.vue'
import AmenitiesSection from './AmenitiesSection.vue'
import PoliciesSection from './PoliciesSection.vue'

const props = defineProps({
  // Summary header
  name: { type: String, default: 'Hotel Name' },
  stars: { type: Number, default: 0 },
  address: { type: String, default: '' },
  distance: { type: String, default: '' },
  score: { type: Number, default: null },
  reviews: { type: Number, default: null },
  ratingLabel: { type: String, default: '' },
  popularAmenities: { type: Array, default: () => [] },
  lat: { type: Number, default: 28.5383 },
  lng: { type: Number, default: -81.3792 },

  // Gallery
  galleryCategories: { type: Array, default: () => ['exterior', 'rooms', 'dining', 'suites', 'bar', 'pool', 'lobby', 'spa', 'bathroom'] },
  seed: { type: Number, default: 0 },

  // Rooms
  rooms: { type: Array, default: () => [] },
  roomsFlow: { type: String, default: 'reserve' }, // 'reserve' | 'group'
  roomsTitle: { type: String, default: 'Select Your Room' },
  roomsSubtitle: { type: String, default: '' },

  // Sections
  about: { type: String, default: '' },
  amenityGroups: { type: Array, default: () => [] },
  policies: { type: Array, default: () => [] },
})

const tabs = [
  { name: 'overview', label: 'Overview' },
  { name: 'rooms', label: 'Rooms' },
  { name: 'property', label: 'Property' },
  { name: 'amenities', label: 'Amenities' },
  { name: 'policies', label: 'Policies' },
]
const activeTab = ref('overview')
const root = ref(null)

const onTab = (name) => {
  if (name === 'overview') { root.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }); return }
  const el = root.value?.querySelector(`#hdp-${name}`)
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// Gallery images sourced from the local imagery library by category.
const gallery = ref([])
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)
onMounted(async () => {
  const lib = await loadImagery()
  const out = []
  props.galleryCategories.forEach((c, k) => {
    const arr = lib[c]
    if (arr && arr.length) { const e = arr[(props.seed + k) % arr.length]; out.push({ src: e.url, title: cap(c) }) }
  })
  gallery.value = out
})
</script>

<template>
  <div ref="root" class="hdp">
    <!-- Photo hero gallery -->
    <gallery-hero :images="gallery" :all-images="gallery" />

    <!-- Section nav -->
    <div class="hdp__tabs">
      <detail-tabs v-model="activeTab" :tabs="tabs" @select="onTab" />
    </div>

    <!-- Summary -->
    <hotel-summary-header
      :name="name" :stars="stars" :address="address" :distance="distance"
      :score="score" :reviews="reviews" :rating-label="ratingLabel"
      :amenities="popularAmenities" :lat="lat" :lng="lng"
    />

    <!-- Rooms -->
    <section id="hdp-rooms" class="hdp__section">
      <rooms-carousel :rooms="rooms" :flow="roomsFlow" :title="roomsTitle" :subtitle="roomsSubtitle" />
    </section>

    <!-- Property / About -->
    <section id="hdp-property" class="hdp__section hdp__section--ruled">
      <about-property :text="about" />
    </section>

    <!-- Amenities -->
    <section id="hdp-amenities" class="hdp__section hdp__section--ruled">
      <amenities-section :groups="amenityGroups" />
    </section>

    <!-- Policies -->
    <section id="hdp-policies" class="hdp__section hdp__section--ruled">
      <policies-section :policies="policies" />
    </section>
  </div>
</template>

<style scoped>
.hdp { max-width: 1180px; margin: 0 auto; padding: 18px 24px 60px; display: flex; flex-direction: column; }
.hdp__tabs { position: sticky; top: 0; z-index: 5; background: var(--ds-color-surface); margin: 24px 0; }
.hdp__section { padding-top: 28px; }
.hdp__section--ruled { margin-top: 20px; border-top: 1px solid var(--ds-color-border); padding-top: 32px; }
</style>
