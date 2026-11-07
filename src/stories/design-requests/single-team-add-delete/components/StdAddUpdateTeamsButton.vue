<script setup>
// STA-1 · ENG2-111 — "Add/Update Teams". The Compliance page's Registration
// Data Uploader button, relabeled and given a dropdown arrow, the same pattern
// as Export beside it. Two options: the uploader (unchanged) and Add single team.
defineProps({ disabled: { type: Boolean, default: false } })
const emit = defineEmits(['upload', 'add-single'])
</script>

<template>
  <!-- Plain text options, like Export's menu in production. -->
  <q-btn-dropdown unelevated no-caps color="primary" label="Add/Update Teams" :disable="disabled"
    dropdown-icon="arrow_drop_down" menu-anchor="bottom right" menu-self="top right">
    <q-list style="min-width:220px;">
      <q-item v-close-popup clickable @click="emit('upload')"><q-item-section>Upload registration data</q-item-section></q-item>
      <q-item v-close-popup clickable @click="emit('add-single')"><q-item-section>Add single team</q-item-section></q-item>
    </q-list>
  </q-btn-dropdown>
</template>
