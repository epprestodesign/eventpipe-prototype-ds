<script setup>
// DsChartHeader — title, optional subtitle and a right-aligned actions slot
// (period select, filter chips, Chart/Table toggle). Filters live in ONE row
// here, above the plot, never scattered around it.
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  /** Heading level for the title (h2–h4) so the card fits the page outline. */
  level: { type: Number, default: 3 },
})
</script>

<template>
  <div class="dsch">
    <div class="dsch__text">
      <component :is="`h${level}`" class="dsch__title">{{ title }}</component>
      <div v-if="subtitle" class="dsch__sub">{{ subtitle }}</div>
    </div>
    <div v-if="$slots.actions" class="dsch__actions"><slot name="actions" /></div>
  </div>
</template>

<style scoped>
.dsch { display: flex; align-items: flex-start; gap: 12px 16px; flex-wrap: wrap; }
.dsch__text { flex: 1 1 200px; min-width: 0; }
.dsch__title { margin: 0; font-size: 1rem; line-height: 1.3; font-weight: var(--ds-font-weight-bold); letter-spacing: 0; color: var(--ds-color-text); }
.dsch__sub { margin-top: 2px; font-size: var(--ds-font-size-sm); color: var(--ds-color-text-subtle); }
.dsch__actions { flex: none; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
</style>
