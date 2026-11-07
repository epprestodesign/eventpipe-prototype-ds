<script setup>
// STA-2 · ENG2-116 — the required, single-select event dropdown at the top of
// create-mode Team Edit, labelled "Event Name" as the Registration Data
// Uploader labels the same choice. Preselected when the Compliance list's
// filters narrow it to one event; otherwise it reads "Please select".
// Registration System Event ID is not asked for.
import { computed } from 'vue'
import DsSelect from '../../../../components/DsSelect.vue'
import { EVENTS } from '../_std'

const props = defineProps({
  modelValue: { type: String, default: '' },
  error: { type: String, default: '' },
  events: { type: Array, default: () => EVENTS },
})
const emit = defineEmits(['update:modelValue'])
const options = computed(() => props.events.map((e) => ({ label: e.name, value: e.id })))
</script>

<template>
  <ds-select :model-value="modelValue || null" :options="options" label="Event Name" required
    placeholder="Please select" :error="error" @update:model-value="(v) => emit('update:modelValue', v)" />
</template>
