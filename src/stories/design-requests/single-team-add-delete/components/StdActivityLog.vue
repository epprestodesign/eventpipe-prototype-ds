<script setup>
// STD-4 · ENG2-114 — the event-level activity log. Existing columns record who
// and when; the blurb records what: "Team ‘Augusta Lions’ was deleted."
// Written only when the delete succeeds. A plain row, like every other entry
// (11/09 review: don't bold it — the log has no "recent" emphasis today).
defineProps({
  rows: { type: Array, default: () => [] },
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
      <q-tr :props="props">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">{{ col.value }}</q-td>
      </q-tr>
    </template>
  </q-table>
</template>
