<script setup>
// DsRating — a compact review-score display: "8.6/10 ★ (1,234)". Read-only
// (for collecting a rating, use Inputs/Rating). Standardizes the score shown on
// listing cards, saved items, the map, confirmation, etc.
import { computed } from 'vue'

const props = defineProps({
  score: { type: [Number, String], required: true },
  max: { type: Number, default: 5 },          // 5 or 10
  reviews: { type: Number, default: null },     // shown as "(1,234)"
  label: { type: String, default: '' },         // e.g. "Excellent"
  showStar: { type: Boolean, default: true },
  showMax: { type: Boolean, default: true },
  size: { type: String, default: 'md' },         // sm | md | lg
})

const SIZES = { sm: '0.8125rem', md: '0.9375rem', lg: '1.0625rem' }
const fontSize = computed(() => SIZES[props.size] || SIZES.md)
const iconSize = computed(() => ({ sm: '14px', md: '16px', lg: '18px' }[props.size] || '16px'))
const reviewsText = computed(() => (props.reviews != null ? `(${Number(props.reviews).toLocaleString()})` : ''))
</script>

<template>
  <span class="ds-rating" :style="{ fontSize }">
    <q-icon v-if="showStar" name="star" :size="iconSize" class="ds-rating__star" />
    <strong class="ds-rating__score">{{ score }}<template v-if="showMax">/{{ max }}</template></strong>
    <span v-if="label" class="ds-rating__label">{{ label }}</span>
    <span v-if="reviewsText" class="ds-rating__reviews">{{ reviewsText }}</span>
  </span>
</template>

<style scoped>
.ds-rating { display: inline-flex; align-items: center; gap: 5px; color: var(--ds-color-text); line-height: 1; }
.ds-rating__star { color: #f59e0b; flex: none; }
.ds-rating__score { font-weight: 700; }
.ds-rating__label { font-weight: 600; }
.ds-rating__reviews { color: var(--ds-color-text-subtle); }
</style>
