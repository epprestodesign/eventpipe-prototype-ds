<script setup>
/* Av2EmailFacts — the "what happened" rows in a security email: device,
 * approximate location, time. A label / value grid so the reader can check
 * each fact against what they know, rather than parse it out of a sentence. */
defineProps({
  /** [{ label, value }] */
  rows: { type: Array, required: true },
})
</script>

<template>
  <dl class="av2ef">
    <template v-for="r in rows" :key="r.label">
      <dt>{{ r.label }}</dt>
      <dd>{{ r.value }}</dd>
    </template>
  </dl>
</template>

<style scoped>
.av2ef {
  display: grid;
  grid-template-columns: minmax(120px, auto) 1fr;
  gap: 8px 20px;
  margin: 4px 0 18px;
  padding: 16px 20px;
  background: var(--ds-color-surface-sunken);
  border: 1px solid var(--ds-color-border-container);
  border-radius: var(--ds-radius-md);
  font-size: 0.875rem;
}
.av2ef dt { color: var(--ds-color-text-subtle); }
.av2ef dd { margin: 0; color: var(--ds-color-text); font-weight: 500; }
</style>
