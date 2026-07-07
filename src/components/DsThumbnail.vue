<script setup>
// DsThumbnail — a small, fixed-size preview image with an image-icon fallback.
// Used in tables, lists, and cards. `size` is a token (xs–xl) or any CSS length.
defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  size: { type: String, default: 'md' }, // xs | sm | md | lg | xl | any CSS length
  rounded: { type: Boolean, default: true },
  fit: { type: String, default: 'cover' }, // cover (photos) | contain (logos)
})
const SIZES = { xs: '28px', sm: '40px', md: '56px', lg: '80px', xl: '120px' }
</script>

<template>
  <span class="dsthumb" :class="{ 'is-square': !rounded }"
    :style="{ width: SIZES[size] || size, height: SIZES[size] || size }">
    <img v-if="src" :src="src" :alt="alt" class="dsthumb__img" :style="{ objectFit: fit }" />
    <q-icon v-else name="image" size="45%" class="dsthumb__ph" />
  </span>
</template>

<style scoped>
.dsthumb {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  overflow: hidden;
  background: var(--ds-color-surface-sunken);
  border: 1px solid var(--ds-color-border);
  border-radius: var(--ds-radius-md);
}
.dsthumb.is-square { border-radius: 0; }
.dsthumb__img { width: 100%; height: 100%; object-fit: cover; display: block; }
.dsthumb__ph { color: var(--ds-color-icon-subtle); }
</style>
