<script setup>
// DsInfoGrid — a responsive label/value grid for record metadata (the 3-column
// "Created by / Hotel Name / Event Name …" block under a page header). Pass an
// array of { label, value } items; they flow into up to N responsive columns,
// each rendered as an aligned gray-label → dark-value pair.
defineProps({
  items: { type: Array, default: () => [] }, // [{ label, value }]
  minColWidth: { type: String, default: '280px' },
  labelWidth: { type: String, default: '130px' },
  layout: { type: String, default: 'inline' }, // inline (label → value) | stacked (label above value)
})
</script>

<template>
  <dl class="dsig" :class="`dsig--${layout}`" :style="{ gridTemplateColumns: `repeat(auto-fit, minmax(${minColWidth}, 1fr))` }">
    <div v-for="(it, i) in items" :key="i" class="dsig__row">
      <dt class="dsig__label" :style="{ minWidth: layout === 'stacked' ? '0' : labelWidth }">{{ it.label }}</dt>
      <dd class="dsig__value">{{ it.value }}</dd>
    </div>
  </dl>
</template>

<style scoped>
.dsig { display: grid; gap: 10px 40px; margin: 0; align-content: start; }
.dsig--stacked { gap: 16px 40px; }
.dsig__row { display: flex; align-items: baseline; gap: 12px; }
.dsig--stacked .dsig__row { flex-direction: column; align-items: stretch; gap: 4px; }
.dsig__label { flex: none; margin: 0; font-size: 0.9375rem; color: var(--ds-color-text-subtle); }
.dsig__value { margin: 0; font-size: 0.9375rem; font-weight: 700; color: var(--ds-color-text); }
.dsig--stacked .dsig__value { font-weight: 400; }
</style>
