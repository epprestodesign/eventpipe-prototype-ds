<script setup>
// DsPageHeader — the record/page header shell: an optional breadcrumb, a title
// row with an optional status badge and right-aligned CTAs, and slots for the
// metadata grid (DsInfoGrid) and a tab bar below. Composed per screen — the
// info grid and tabs are passed in via slots (kept as separate pieces).
defineProps({
  title: { type: String, required: true },
  // Optional status badge shown next to the title
  badge: { type: String, default: '' },
  badgeColor: { type: String, default: 'positive' }, // Quasar color name
})
</script>

<template>
  <header class="dsph">
    <div v-if="$slots.breadcrumb" class="dsph__crumb"><slot name="breadcrumb" /></div>

    <div class="dsph__bar">
      <div class="dsph__titlewrap">
        <h1 class="dsph__title">{{ title }}</h1>
        <slot name="badge">
          <q-badge v-if="badge" :color="badgeColor" class="dsph__badge" rounded>{{ badge }}</q-badge>
        </slot>
      </div>
      <div v-if="$slots.actions" class="dsph__actions"><slot name="actions" /></div>
    </div>

    <div v-if="$slots.meta" class="dsph__meta"><slot name="meta" /></div>
    <div v-if="$slots.tabs" class="dsph__tabs"><slot name="tabs" /></div>
  </header>
</template>

<style scoped>
.dsph { display: flex; flex-direction: column; gap: 16px; }
.dsph__crumb { margin-bottom: -4px; }
.dsph__bar { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.dsph__titlewrap { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; min-width: 0; }
.dsph__title { margin: 0; font-size: 1.75rem; font-weight: 700; letter-spacing: -0.01em; color: var(--ds-color-text); line-height: 1.2; }
.dsph__badge { font-size: 0.8125rem; font-weight: 700; padding: 5px 12px; }
.dsph__actions { flex: none; display: flex; align-items: center; gap: 10px; }
.dsph__meta { margin-top: 4px; }
.dsph__tabs { margin-top: 4px; }
</style>
