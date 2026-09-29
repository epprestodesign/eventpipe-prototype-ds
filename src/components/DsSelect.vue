<script setup>
// DsSelect — the EventPipe labeled select/dropdown field (the "Target Hotel"
// pattern). Restyled QSelect (outlined) composed inside DsField for the standard
// label/required/tooltip/hint/error anatomy. Supports single or multiple select,
// clearable, and searchable (use-input) modes.
import { computed } from 'vue'
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

/* QSelect only renders `placeholder` in searchable (use-input) mode, so a plain
   empty select showed a blank box — "Any reason" never appeared. When empty and
   not searchable, show the placeholder as the display value, muted, instead. */
const isEmpty = computed(() => props.modelValue == null || props.modelValue === ''
  || (Array.isArray(props.modelValue) && props.modelValue.length === 0))
const showPlaceholder = computed(() => !props.searchable && !!props.placeholder && isEmpty.value)
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
      :display-value="showPlaceholder ? placeholder : undefined"
      :class="{ 'dssel--placeholder': showPlaceholder }"
      :disable="disabled"
      :error="!!error"
      emit-value
      map-options
      hide-bottom-space
      dropdown-icon="expand_more"
    />
  </DsField>
</template>

<style scoped>
.dssel--placeholder :deep(.q-field__native) { color: var(--ds-color-text-subtle); }
</style>
