<script setup>
// DsStat — a single metric: a large value over a muted label (the KPI cells on
// the Events cards). Lay several out in a grid/row for a stat block.
defineProps({
  value: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  align: { type: String, default: 'left' }, // left | center | right
})
</script>

<template>
  <div class="dsstat" :style="{ textAlign: align }">
    <div class="dsstat__value">{{ value }}</div>
    <div class="dsstat__label">{{ label }}</div>
  </div>
</template>

<style scoped>
.dsstat__value { font-size: 1.375rem; font-weight: 700; color: var(--ds-color-text); line-height: 1.15; }
.dsstat__label { margin-top: 2px; font-size: 0.8125rem; color: var(--ds-color-text-subtle); }
</style>
