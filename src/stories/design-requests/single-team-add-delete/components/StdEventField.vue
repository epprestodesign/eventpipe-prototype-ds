<script setup>
// STA-2 · ENG2-116 — Event Name, a type-ahead (11/09 review: "the control
// should work like it does in the filter"). Type 4 characters and the matching
// events drop down; pick one. The picked event shows in the box with a clear
// (×) button, as production's Event Name filter does.
//
// Used twice: the create form's required Event Name (preselected from the
// Compliance filter) and the Compliance page's Event Name filter itself.
// Registration System Event ID is not asked for.
import { computed, ref } from 'vue'
import DsField from '../../../../components/DsField.vue'
import { EVENTS, TYPEAHEAD_MIN, eventSearch } from '../_std'

const props = defineProps({
  modelValue: { type: String, default: '' },
  events: { type: Array, default: () => EVENTS },
  label: { type: String, default: 'Event Name' },
  required: { type: Boolean, default: false },
  error: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])

const query = ref('')
const options = computed(() => eventSearch(props.events, query.value).map((e) => ({ label: e.name, value: e.id })))
// Under 4 characters nothing is offered — except the picked event, which the
// box needs to show its name.
const picked = computed(() => props.events.filter((e) => e.id === props.modelValue).map((e) => ({ label: e.name, value: e.id })))
const shown = computed(() => (query.value.trim().length >= TYPEAHEAD_MIN ? options.value : picked.value))
const noOption = computed(() => (query.value.trim().length < TYPEAHEAD_MIN ? '' : `No events match “${query.value.trim()}”.`))

function filter(val, update) { update(() => { query.value = val }) }
</script>

<template>
  <ds-field :label="label" :required="required" :error="error"
    :hint="modelValue ? '' : `Must type ${TYPEAHEAD_MIN} characters to search`">
    <q-select
      :model-value="modelValue || null"
      :options="shown"
      outlined dense use-input hide-selected fill-input clearable emit-value map-options
      input-debounce="0" hide-dropdown-icon hide-bottom-space
      :error="!!error" :aria-label="label" class="stdev"
      @filter="filter"
      @update:model-value="(v) => emit('update:modelValue', v || '')">
      <template #no-option>
        <q-item v-if="noOption"><q-item-section class="text-grey-7">{{ noOption }}</q-item-section></q-item>
      </template>
    </q-select>
  </ds-field>
</template>

<style scoped>
.stdev :deep(.q-field__control) { min-height: 40px; }
</style>
