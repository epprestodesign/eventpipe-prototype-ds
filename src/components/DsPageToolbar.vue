<script setup>
// DsPageToolbar — the standard list-page header row: a title (with optional
// count), a growing search/mid slot, and right-aligned actions — plus optional
// tabs and applied-filter rows below. Shared by every list-style Page.
defineProps({
  title: { type: String, required: true },
  count: { type: [Number, String], default: null },
})
</script>

<template>
  <div class="dspt">
    <div class="dspt__row">
      <h1 class="dspt__title">
        {{ title }}<span v-if="count !== null" class="dspt__count"> ( {{ count }} )</span>
      </h1>
      <div class="dspt__mid"><slot name="search" /></div>
      <div v-if="$slots.actions" class="dspt__actions"><slot name="actions" /></div>
    </div>
    <div v-if="$slots.tabs" class="dspt__tabs"><slot name="tabs" /></div>
    <div v-if="$slots.filters" class="dspt__filters"><slot name="filters" /></div>
  </div>
</template>

<style scoped>
.dspt { display: flex; flex-direction: column; }
.dspt__row { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.dspt__title { margin: 0; font-size: 1.5rem; font-weight: 700; letter-spacing: -0.01em; color: var(--ds-color-text); white-space: nowrap; }
.dspt__count { color: var(--ds-color-text-subtle); font-weight: 700; }
.dspt__mid { flex: 1 1 240px; min-width: 0; }
.dspt__actions { flex: none; display: flex; align-items: center; gap: 10px; }
.dspt__tabs { margin-top: 16px; }
.dspt__filters { margin-top: 12px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
</style>
