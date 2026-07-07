<script setup>
// DsSelect — the EventPipe labeled select/dropdown field (the "Target Hotel"
// pattern). Restyled QSelect (outlined) composed inside DsField for the standard
// label/required/tooltip/hint/error anatomy. Supports single or multiple select,
// clearable, and searchable (use-input) modes.
import DsField from './DsField.vue'

const props = defineProps({
  modelValue: { type: [String, Number, Array, Object], default: null },
  options: { type: Array, default: () => [] },
  label: { type: String, default: '' },
  required: { type: Boolean, default: false },
  tooltip: { type: String, default: '' },
  sublabel: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  multiple: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  searchable: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  dense: { type: Boolean, default: true },
})
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <DsField :label="label" :required="required" :tooltip="tooltip" :sublabel="sublabel"
    :hint="hint" :error="error" :disabled="disabled">
    <q-select
      :model-value="modelValue"
      @update:model-value="(v) => emit('update:modelValue', v)"
      :options="options"
      outlined
      :dense="dense"
      :multiple="multiple"
      :clearable="clearable"
      :use-input="searchable"
      :placeholder="placeholder"
      :disable="disabled"
      :error="!!error"
      emit-value
      map-options
      hide-bottom-space
      dropdown-icon="expand_more"
    />
  </DsField>
</template>
