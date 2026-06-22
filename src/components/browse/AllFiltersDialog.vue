<script setup>
// AllFiltersDialog — an Airbnb-style "All filters" modal that consolidates every
// browse filter into one scrollable, accordion experience. Each section is a
// collapsible `Filter`; the footer shows a live, anticipatable result count
// ("Show N results") plus "Clear all". Controlled: v-model (open) + the filter
// values via `filters` (v-model:filters); the parent computes `resultCount`
// from those values so the count updates live as the user adjusts filters.
import { onMounted, onBeforeUnmount, watch } from 'vue'
import BrowseFilter from './Filter.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  // Combined filter values, keyed by section key (e.g. { roomType, budget, ... }).
  filters: { type: Object, default: () => ({}) },
  // Live count shown in the footer; null hides the number.
  resultCount: { type: Number, default: null },
  title: { type: String, default: 'Filters' },
  // Accordion sections. `plain` renders inline (no collapse); `open` starts expanded.
  sections: {
    type: Array,
    default: () => [
      { key: 'propertySearch', type: 'propertySearch', plain: true },
      { key: 'roomType', type: 'roomType', open: true },
      { key: 'budget', type: 'budget', open: true, props: { histogram: [3, 6, 10, 14, 18, 16, 12, 9, 6, 4, 3, 2] } },
      { key: 'amenities', type: 'amenities', open: true },
      { key: 'starRating', type: 'starRating' },
      { key: 'guestRating', type: 'guestRating' },
      { key: 'hotelClass', type: 'hotelClass' },
      { key: 'brands', type: 'brands' },
    ],
  },
})
const emit = defineEmits(['update:modelValue', 'update:filters', 'clear', 'apply'])

const close = () => emit('update:modelValue', false)
const setVal = (key, v) => emit('update:filters', { ...props.filters, [key]: v })
const clearAll = () => { emit('update:filters', {}); emit('clear') }
const apply = () => { emit('apply'); close() }

const onKey = (e) => { if (e.key === 'Escape') close() }
onMounted(() => document.addEventListener('keydown', onKey))
onBeforeUnmount(() => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' })
watch(() => props.modelValue, (open) => { if (typeof document !== 'undefined') document.body.style.overflow = open ? 'hidden' : '' })
</script>

<template>
  <div v-if="modelValue" class="afd" @click.self="close">
    <div class="afd__card" role="dialog" aria-modal="true" :aria-label="title">
      <header class="afd__head">
        <button type="button" class="afd__close" aria-label="Close" @click="close"><q-icon name="close" size="22px" /></button>
        <h2 class="afd__title">{{ title }}</h2>
        <span class="afd__spacer" />
      </header>

      <div class="afd__body">
        <div v-for="s in sections" :key="s.key" class="afd__section" :class="{ 'afd__section--plain': s.plain }">
          <browse-filter
            :type="s.type"
            :collapsible="!s.plain"
            :default-open="!!s.open"
            :model-value="filters[s.key]"
            v-bind="s.props || {}"
            @update:model-value="setVal(s.key, $event)"
          />
        </div>
      </div>

      <footer class="afd__foot">
        <button type="button" class="afd__clear" @click="clearAll">Clear all</button>
        <button type="button" class="afd__apply" @click="apply">
          {{ resultCount != null ? `Show ${resultCount.toLocaleString('en-US')} result${resultCount === 1 ? '' : 's'}` : 'Show results' }}
        </button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.afd { position: fixed; inset: 0; z-index: 4000; background: rgba(9,9,11,0.5); display: flex; align-items: center; justify-content: center; padding: 24px; }
.afd__card { display: flex; flex-direction: column; width: 100%; max-width: 600px; max-height: 88vh; background: var(--ds-color-surface); border-radius: var(--ds-radius-lg); box-shadow: var(--ds-shadow-4); overflow: hidden; }

.afd__head { position: relative; display: flex; align-items: center; justify-content: center; padding: 14px 16px; border-bottom: 1px solid var(--ds-color-border); flex: none; }
.afd__title { font-size: 1.0625rem; font-weight: 700; margin: 0; color: var(--ds-color-text); }
.afd__close { position: absolute; left: 12px; width: 36px; height: 36px; border: 0; border-radius: 50%; background: none; color: var(--ds-color-text); cursor: pointer; display: flex; align-items: center; justify-content: center; }
.afd__close:hover { background: var(--ds-palette-zinc-100); }
.afd__spacer { width: 36px; }

.afd__body { overflow-y: auto; padding: 4px 24px; }
.afd__section { padding: 18px 0; }
.afd__section + .afd__section { border-top: 1px solid var(--ds-color-border); }

.afd__foot { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 20px; border-top: 1px solid var(--ds-color-border); flex: none; }
.afd__clear { background: none; border: 0; padding: 8px 4px; font-family: inherit; font-size: 1rem; font-weight: 700; color: var(--ds-color-text); text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
.afd__apply { height: 48px; padding: 0 24px; border: 0; border-radius: var(--ds-radius-md); background: var(--ds-color-background-brand-bold); color: #fff; font-family: inherit; font-size: 1rem; font-weight: 600; cursor: pointer; }
.afd__apply:hover { filter: brightness(1.12); }

@media (max-width: 560px) {
  .afd { padding: 0; }
  .afd__card { max-width: 100%; height: 100%; max-height: 100%; border-radius: 0; }
}
</style>
