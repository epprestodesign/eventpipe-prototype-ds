<script setup>
// DsPinInput — a segmented code entry (verification / 2FA codes). Renders N
// single-character boxes; typing auto-advances, Backspace steps back, and paste
// distributes across the boxes. v-model is the joined string.
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  length: { type: Number, default: 6 },
  type: { type: String, default: 'text' }, // text | number
  disabled: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue', 'complete'])

const cells = ref(Array.from({ length: props.length }, (_, i) => props.modelValue[i] || ''))
const inputs = ref([])

watch(() => props.modelValue, (v) => {
  cells.value = Array.from({ length: props.length }, (_, i) => (v || '')[i] || '')
})

function emitValue() {
  const joined = cells.value.join('')
  emit('update:modelValue', joined)
  if (joined.length === props.length && !joined.includes('')) emit('complete', joined)
}
function onInput(i, e) {
  let ch = e.target.value.slice(-1)
  if (props.type === 'number' && ch && !/\d/.test(ch)) ch = ''
  cells.value[i] = ch
  emitValue()
  if (ch && i < props.length - 1) inputs.value[i + 1]?.focus()
}
function onKeydown(i, e) {
  if (e.key === 'Backspace' && !cells.value[i] && i > 0) inputs.value[i - 1]?.focus()
  else if (e.key === 'ArrowLeft' && i > 0) inputs.value[i - 1]?.focus()
  else if (e.key === 'ArrowRight' && i < props.length - 1) inputs.value[i + 1]?.focus()
}
function onPaste(e) {
  e.preventDefault()
  let text = (e.clipboardData?.getData('text') || '').trim()
  if (props.type === 'number') text = text.replace(/\D/g, '')
  for (let i = 0; i < props.length; i++) cells.value[i] = text[i] || ''
  emitValue()
  inputs.value[Math.min(text.length, props.length - 1)]?.focus()
}
</script>

<template>
  <div class="dspin" :class="{ 'is-disabled': disabled }" @paste="onPaste">
    <input
      v-for="(c, i) in cells"
      :key="i"
      :ref="(el) => (inputs[i] = el)"
      class="dspin__cell"
      :value="c"
      :inputmode="type === 'number' ? 'numeric' : 'text'"
      maxlength="1"
      :disabled="disabled"
      aria-label="Verification digit"
      @input="onInput(i, $event)"
      @keydown="onKeydown(i, $event)"
    />
  </div>
</template>

<style scoped>
.dspin { display: inline-flex; gap: 10px; }
.dspin__cell {
  width: 48px;
  height: 56px;
  text-align: center;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--ds-color-text);
  border: 1px solid var(--ds-color-border-bold);
  border-radius: var(--ds-radius-md);
  background: var(--ds-color-surface);
  outline: none;
  transition: border-color var(--ds-duration-fast) var(--ds-ease-standard),
    box-shadow var(--ds-duration-fast) var(--ds-ease-standard);
}
.dspin__cell:focus {
  border-color: var(--ds-color-border-focused);
  box-shadow: 0 0 0 3px var(--ds-palette-azure-100);
}
.dspin.is-disabled { opacity: 0.6; }
</style>
