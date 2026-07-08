<script setup>
// DsSearch — the standardized search field: a pill input with a leading
// magnifier, a clear "×" that appears once there's a query, and a floating
// results dropdown that opens while focused with a non-empty query. Shows a
// centered empty state when a search returns nothing. Google-style focus ring
// via the DS azure. Emits select on a result, search on Enter, clear on reset.
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Search' },
  results: { type: Array, default: () => [] },   // [{ id, label, sublabel? }]
  loading: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue', 'search', 'select', 'clear'])

const focused = ref(false)
const hasQuery = computed(() => !!props.modelValue && props.modelValue.length > 0)
const open = computed(() => focused.value && hasQuery.value)
const showEmpty = computed(() => hasQuery.value && !props.loading && props.results.length === 0)

function onInput(e) { emit('update:modelValue', e.target.value) }
function clear() { emit('update:modelValue', ''); emit('clear') }
function onEscape() { clear(); focused.value = false }
function onSelect(r) { emit('select', r); focused.value = false }
// Delay blur so a result click registers before the dropdown unmounts.
function onBlur() { setTimeout(() => { focused.value = false }, 120) }
</script>

<template>
  <div class="ds-search">
    <div class="ds-search__pill" :class="{ 'is-focused': focused }">
      <q-icon name="search" size="20px" class="ds-search__icon" />
      <input
        class="ds-search__input"
        role="combobox"
        :aria-label="placeholder"
        :aria-expanded="open"
        aria-autocomplete="list"
        :value="modelValue"
        :placeholder="placeholder"
        @input="onInput"
        @focus="focused = true"
        @blur="onBlur"
        @keyup.enter="emit('search', modelValue)"
        @keydown.esc="onEscape"
      />
      <button
        v-if="hasQuery"
        type="button"
        class="ds-search__clear"
        aria-label="Clear search"
        @click="clear"
      >
        <q-icon name="close" size="18px" />
      </button>
    </div>

    <div v-if="open" class="ds-search__panel">
      <ul v-if="results.length" class="ds-search__list">
        <li
          v-for="r in results"
          :key="r.id"
          class="ds-search__row"
          @mousedown.prevent="onSelect(r)"
        >
          <span class="ds-search__label">{{ r.label }}</span>
          <span v-if="r.sublabel" class="ds-search__sub">{{ r.sublabel }}</span>
        </li>
      </ul>

      <div v-else-if="showEmpty" class="ds-search__empty">
        <q-icon name="search" size="48px" class="ds-search__empty-icon" />
        <p class="ds-search__empty-title">No results found</p>
        <p class="ds-search__empty-text">
          We couldn't find results for your search, please check your spelling and try again.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ds-search { position: relative; width: 100%; }

.ds-search__pill {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 8px 0 16px;
  border: 1px solid var(--ds-color-border);
  border-radius: 9999px;
  background: var(--ds-color-surface);
  transition: border-color var(--ds-duration-fast) var(--ds-ease-standard),
    box-shadow var(--ds-duration-fast) var(--ds-ease-standard);
}
.ds-search__pill.is-focused {
  border-color: var(--ds-color-border-focused);
  box-shadow: 0 0 0 3px var(--ds-palette-azure-100);
}
.ds-search__icon { color: var(--ds-color-icon-subtle); flex: none; }
.ds-search__input {
  flex: 1 1 auto;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  font: inherit;
  font-size: 0.9375rem;
  color: var(--ds-color-text);
}
.ds-search__input::placeholder { color: var(--ds-color-text-subtlest); }

.ds-search__clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  flex: none;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--ds-color-icon-subtle);
  cursor: pointer;
}
.ds-search__clear:hover { background: var(--ds-color-surface-sunken); color: var(--ds-color-text); }

/* Floating dropdown */
.ds-search__panel {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 3000;
  background: var(--ds-color-surface);
  border: 1px solid var(--ds-color-border);
  border-radius: var(--ds-radius-md);
  box-shadow: var(--ds-shadow-3);
  overflow: hidden;
}

.ds-search__list { list-style: none; margin: 0; padding: 6px; }
.ds-search__row {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 12px;
  border-radius: var(--ds-radius-md);
  cursor: pointer;
}
.ds-search__row:hover { background: var(--ds-palette-graphite-100); }
.ds-search__label { font-size: 0.9375rem; font-weight: 600; color: var(--ds-color-text); line-height: 1.3; }
.ds-search__sub { font-size: 0.8125rem; color: var(--ds-color-text-subtle); }

/* Empty state */
.ds-search__empty { padding: 40px 24px; text-align: center; }
.ds-search__empty-icon { color: var(--ds-color-background-brand-bold); }
.ds-search__empty-title { margin: 12px 0 4px; font-size: 1rem; font-weight: 700; color: var(--ds-color-text); }
.ds-search__empty-text { margin: 0; font-size: 0.875rem; color: var(--ds-color-text-subtle); line-height: 1.4; }
</style>
