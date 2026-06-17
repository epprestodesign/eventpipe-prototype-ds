<script setup>
// DsRange — a dual-handle range slider with a min/max readout. Extracted from
// the browse budget filter. v-model is an object `{ min, max }`. `prefix` and
// `plus` format the readout (e.g. "$ 50", "$ 1000+").
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Object, default: () => ({ min: 0, max: 100 }) },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  prefix: { type: String, default: '' },   // e.g. "$ "
  minLabel: { type: String, default: 'Min' },
  maxLabel: { type: String, default: 'Max' },
})
const emit = defineEmits(['update:modelValue'])

const range = computed({
  get: () => props.modelValue || { min: props.min, max: props.max },
  set: (v) => emit('update:modelValue', v),
})
const money = (n) => props.prefix + Number(n).toLocaleString('en-US') + (n >= props.max ? '+' : '')
</script>

<template>
  <div class="dsr">
    <q-range v-model="range" :min="min" :max="max" :step="step" class="dsr__range" color="dark" track-color="grey-4" />
    <div class="dsr__mm">
      <div class="dsr__box"><span>{{ minLabel }}</span><strong>{{ money(range.min) }}</strong></div>
      <div class="dsr__box"><span>{{ maxLabel }}</span><strong>{{ money(range.max) }}</strong></div>
    </div>
  </div>
</template>

<style scoped>
.dsr { display: flex; flex-direction: column; }
.dsr__range { padding: 0 6px; }
.dsr__mm { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 18px; }
.dsr__box { display: flex; flex-direction: column; gap: 4px; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-md); padding: 12px 16px; }
.dsr__box span { font-size: 0.9375rem; color: var(--ds-color-text-subtle); }
.dsr__box strong { font-size: 1.25rem; font-weight: 700; color: var(--ds-color-text); }
</style>
