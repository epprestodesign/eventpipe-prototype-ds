<script setup>
// DsChartState — the non-data states every chart shares, sized to the plot so
// the card does not jump when data arrives.
//   loading → skeleton bars (announced politely)
//   error   → message + optional Retry
//   empty   → nothing to plot (no categories / no series)
//   missing → categories exist but no value was reported for any of them.
//             Distinct from empty and from zero — the period happened, the
//             data did not arrive.
defineProps({
  state: { type: String, default: 'empty' }, // loading | error | empty | missing
  height: { type: Number, default: 280 },
  message: { type: String, default: '' },
  retryable: { type: Boolean, default: true },
})
const emit = defineEmits(['retry'])

const COPY = {
  error: { icon: 'error_outline', title: 'Couldn’t load this chart' },
  empty: { icon: 'bar_chart', title: 'No data for this period' },
  missing: { icon: 'help_outline', title: 'No values reported' },
}
const BARS = [46, 72, 58, 88, 64, 40, 76, 54]
</script>

<template>
  <div class="dscs" :class="`dscs--${state}`" :style="{ height: height + 'px' }" role="status" aria-live="polite">
    <template v-if="state === 'loading'">
      <span class="dscs__sr">Loading chart…</span>
      <div class="dscs__skeleton" aria-hidden="true">
        <span v-for="(h, i) in BARS" :key="i" class="dscs__bar" :style="{ height: h + '%' }"></span>
      </div>
    </template>
    <template v-else>
      <q-icon :name="COPY[state]?.icon || 'info'" size="28px" class="dscs__icon" />
      <div class="dscs__title">{{ COPY[state]?.title }}</div>
      <div v-if="message" class="dscs__msg">{{ message }}</div>
      <q-btn
        v-if="state === 'error' && retryable" outline no-caps label="Retry" icon="refresh"
        class="q-mt-sm dscs__retry" @click="emit('retry')"
      />
    </template>
  </div>
</template>

<style scoped>
.dscs {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;
  text-align: center; padding: 16px; color: var(--ds-color-text-subtle);
  border: 1px dashed var(--ds-color-border); border-radius: var(--ds-radius-md);
}
.dscs--loading { border-style: solid; border-color: transparent; padding: 0; align-items: stretch; }
.dscs__icon { color: var(--ds-color-icon-subtle); }
.dscs--error .dscs__icon { color: var(--ds-color-text-danger); }
.dscs__retry { color: var(--ds-color-text-brand); }
.dscs__title { font-weight: var(--ds-font-weight-bold); color: var(--ds-color-text); }
.dscs__msg { font-size: var(--ds-font-size-sm); max-width: 360px; }
.dscs__skeleton {
  flex: 1; display: flex; align-items: flex-end; gap: 6%; padding: 8px 4% 0;
  border-bottom: 1px solid var(--ds-color-chart-axis);
}
.dscs__bar {
  flex: 1; border-radius: var(--ds-radius-sm) var(--ds-radius-sm) 0 0;
  background: var(--ds-color-chart-track);
  animation: dscs-pulse 1.4s var(--ds-ease-standard) infinite;
}
@keyframes dscs-pulse { 50% { opacity: 0.45; } }
@media (prefers-reduced-motion: reduce) { .dscs__bar { animation: none; } }
.dscs__sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
</style>
