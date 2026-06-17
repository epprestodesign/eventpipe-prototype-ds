<script setup>
// SortDropdown — the browse results "Sort by" control. A pill button showing the
// active option that opens a single-select menu. v-model holds the option value.
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: 'recommended' },
  options: { type: Array, default: () => ([
    { value: 'recommended', label: 'Recommended' },
    { value: 'price_asc', label: 'Price (low to high)' },
    { value: 'price_desc', label: 'Price (high to low)' },
    { value: 'guest_rating', label: 'Guest rating' },
    { value: 'star_rating', label: 'Star rating' },
    { value: 'distance', label: 'Distance' },
  ]) },
  label: { type: String, default: 'Sort by' },
})
const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const current = computed(() => props.options.find((o) => o.value === props.modelValue) || props.options[0])
const choose = (o) => { emit('update:modelValue', o.value); open.value = false }
</script>

<template>
  <div class="srt">
    <button type="button" class="srt__btn" :class="{ 'is-open': open }" @click="open = !open">
      <q-icon name="swap_vert" size="18px" />
      <span class="srt__label">{{ label }}:</span>
      <span class="srt__current">{{ current.label }}</span>
      <q-icon name="expand_more" size="18px" class="srt__chev" />
      <q-menu v-model="open" anchor="bottom left" self="top left" :offset="[0, 6]" class="srt__menu">
        <div class="srt__list">
          <button v-for="o in options" :key="o.value" type="button" class="srt__opt" :class="{ 'is-on': o.value === modelValue }" @click="choose(o)">
            <span>{{ o.label }}</span>
            <q-icon v-if="o.value === modelValue" name="check" size="18px" />
          </button>
        </div>
      </q-menu>
    </button>
  </div>
</template>

<style scoped>
.srt { display: inline-block; }
.srt__btn { display: inline-flex; align-items: center; gap: 8px; height: 46px; padding: 0 16px; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-pill); background: var(--ds-color-surface); color: var(--ds-color-text); font-family: inherit; font-size: 0.9375rem; cursor: pointer; transition: border-color var(--ds-duration-fast) var(--ds-ease-standard); }
.srt__btn:hover, .srt__btn.is-open { border-color: var(--ds-color-text); }
.srt__btn > .q-icon { color: var(--ds-color-text-subtle); }
.srt__label { color: var(--ds-color-text-subtle); }
.srt__current { font-weight: 700; }
.srt__chev { transition: transform var(--ds-duration-fast) var(--ds-ease-standard); }
.srt__btn.is-open .srt__chev { transform: rotate(180deg); }
</style>

<!-- Unscoped: q-menu content is teleported outside this component. -->
<style>
.srt__menu .srt__list { min-width: 240px; padding: 6px; display: flex; flex-direction: column; }
.srt__menu .srt__opt { display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%; padding: 11px 12px; border: 0; border-radius: var(--ds-radius-md); background: none; text-align: left; font-family: inherit; font-size: 0.9375rem; color: var(--ds-color-text); cursor: pointer; }
.srt__menu .srt__opt:hover { background: var(--ds-palette-zinc-100); }
.srt__menu .srt__opt.is-on { font-weight: 700; }
.srt__menu .srt__opt .q-icon { color: var(--ds-color-background-brand-bold); }
</style>
