<script setup>
// DsFileField — compact single-line file picker with an attached "Browse" suffix
// button. Built on Quasar's native QFile (clicking the field OR the Browse button
// opens the OS file dialog and binds the chosen File via v-model) wrapped in
// DsField, so it inherits the standard label / tooltip / sublabel / hint / error
// anatomy. This is the standardized "Choose Image [Browse]" field used across the
// Edit / Customize forms (event logo, landing-page background, hotel-list logo…).
// For a full drag-and-drop dropzone instead, use DsFileUpload.
import { ref } from 'vue'
import DsField from './DsField.vue'

const props = defineProps({
  modelValue: { type: [Object, Array], default: null }, // File | File[] | null
  // DsField anatomy
  label: { type: String, default: '' },
  tooltip: { type: String, default: '' },
  sublabel: { type: String, default: '' },
  required: { type: Boolean, default: false },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  // Control
  placeholder: { type: String, default: 'Choose Image' },
  buttonLabel: { type: String, default: 'Browse' },
  // Show a pre-existing filename (an already-uploaded asset) with no File object.
  displayValue: { type: String, default: '' },
  accept: { type: String, default: 'image/*' },
  multiple: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

const fileRef = ref(null)
// Open the native OS file dialog from the Browse button.
function browse() { fileRef.value?.pickFiles() }
</script>

<template>
  <ds-field :label="label" :tooltip="tooltip" :sublabel="sublabel" :required="required"
    :hint="hint" :error="error" :disabled="disabled">
    <q-file
      ref="fileRef"
      class="dsff"
      :model-value="modelValue"
      @update:model-value="(v) => emit('update:modelValue', v)"
      outlined dense hide-bottom-space
      :accept="accept"
      :multiple="multiple"
      :clearable="clearable"
      :disable="disabled"
      :placeholder="placeholder"
      :display-value="displayValue || undefined"
    >
      <template #append>
        <button type="button" class="dsff__browse" :disabled="disabled" @click.stop="browse">
          {{ buttonLabel }}
        </button>
      </template>
    </q-file>
  </ds-field>
</template>

<style scoped>
/* Same dense height as the other DS fields (DsInput) — no height/font override, so
   it lines up with a sibling input. The Browse action is pinned to the right edge
   as a full-height segment split by a hairline divider (one field + attached action). */
.dsff :deep(.q-field__control) { padding-right: 0; overflow: hidden; border-radius: var(--ds-radius-sm); }
/* Lighten the outlined border to the reference's hairline gray. */
.dsff :deep(.q-field__control:before) { border-color: var(--ds-color-border-container); }
.dsff :deep(.q-field__control:hover:before) { border-color: var(--ds-color-border); }
.dsff :deep(.q-field__native::placeholder) { color: var(--ds-color-text-subtle); opacity: 1; }
.dsff :deep(.q-field__append) { height: auto; align-self: stretch; padding-left: 0; }
.dsff__browse {
  align-self: stretch;
  display: inline-flex;
  align-items: center;
  padding: 0 20px;
  border: 0;
  border-left: 1px solid var(--ds-color-border-container);
  background: transparent;
  color: var(--ds-color-text);
  /* Explicit font — NOT `font: inherit`, which pulled an oversized font in and
     stretched the row. Match the field's value/placeholder text size. */
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s ease;
}
.dsff__browse:hover { background: var(--ds-color-surface-sunken); }
.dsff__browse:disabled { color: var(--ds-color-text-subtle); cursor: not-allowed; }
</style>
