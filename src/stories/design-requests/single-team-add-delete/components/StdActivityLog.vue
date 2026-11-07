<script setup>
// STD-4 · ENG2-114 — the event-level activity log. Existing columns record who
// and when; the blurb records what: "Team ‘Augusta Lions’ was deleted."
// Written only when the delete succeeds. `highlight` marks the newest row so a
// reviewer can find the entry the prototype just wrote.
defineProps({
  rows: { type: Array, default: () => [] },
  highlight: { type: Number, default: -1 },
})
const columns = [
  { name: 'when', label: 'Date/Time', field: 'when', align: 'left', style: 'width:260px' },
  { name: 'user', label: 'User', field: 'user', align: 'left', style: 'width:300px' },
  { name: 'text', label: 'Activity', field: 'text', align: 'left' },
]
</script>

<template>
  <q-table class="ds-table" :rows="rows" :columns="columns" :row-key="(r) => r.when + r.text"
    flat bordered hide-bottom :pagination="{ rowsPerPage: 0 }">
    <template #body="props">
      <q-tr :props="props" :class="{ 'std-log__new': props.rowIndex === highlight }">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">{{ col.value }}</q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<style scoped>
.std-log__new td { background: var(--ds-color-background-brand-subtlest) !important; font-weight: 600; }
</style>
