<script setup>
// DsChoiceChips — a chip toggle group (single or multi select). Extracted from
// the browse filters (star rating, hotel class). Options can be plain strings or
// { value, label, icon }. v-model is an array (multi) or a single value.
import { computed } from 'vue'

const props = defineProps({
  modelValue: { default: undefined },
  options: { type: Array, default: () => [] },
  multiple: { type: Boolean, default: true },
})
const emit = defineEmits(['update:modelValue'])

const norm = computed(() => props.options.map((o) => (typeof o === 'object' ? o : { value: o, label: String(o) })))
const selected = computed(() => (props.multiple ? (props.modelValue || []) : props.modelValue))
const isOn = (v) => (props.multiple ? (props.modelValue || []).includes(v) : props.modelValue === v)
const toggle = (v) => {
  if (props.multiple) {
    const list = props.modelValue || []
    emit('update:modelValue', list.includes(v) ? list.filter((x) => x !== v) : [...list, v])
  } else {
    emit('update:modelValue', props.modelValue === v ? null : v)
  }
}
</script>

<template>
  <div class="dscc" role="group">
    <button
      v-for="o in norm" :key="o.value" type="button"
      class="dscc__chip" :class="{ 'is-on': isOn(o.value) }" :aria-pressed="isOn(o.value)"
      @click="toggle(o.value)"
    >
      <span>{{ o.label }}</span>
      <q-icon v-if="o.icon" :name="o.icon" size="15px" />
    </button>
  </div>
</template>

<style scoped>
.dscc { display: flex; flex-wrap: wrap; gap: 12px; }
.dscc__chip { display: inline-flex; align-items: center; gap: 6px; min-height: 48px; padding: 0 18px; justify-content: center; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-md); background: var(--ds-color-surface); color: var(--ds-color-text); font-weight: 700; font-size: 0.9375rem; cursor: pointer; transition: background var(--ds-duration-fast) var(--ds-ease-standard), border-color var(--ds-duration-fast) var(--ds-ease-standard); }
.dscc__chip .q-icon { color: var(--ds-color-text); }
.dscc__chip:hover { border-color: var(--ds-color-text); }
.dscc__chip.is-on { background: var(--ds-color-background-brand-bold); border-color: var(--ds-color-background-brand-bold); color: #fff; }
.dscc__chip.is-on .q-icon { color: #fff; }
</style>
