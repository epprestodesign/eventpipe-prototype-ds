<script setup>
// DsFileUpload — a drag-and-drop upload dropzone with a browse fallback and a
// selected-files list. Emits the File[] via v-model. For a compact single-field
// trigger, see the QFile-based "Input File" instead.
import { ref } from 'vue'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  accept: { type: String, default: '' },
  multiple: { type: Boolean, default: true },
  hint: { type: String, default: 'PNG, JPG or PDF · up to 10MB' },
  disabled: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

const over = ref(false)
const input = ref(null)

function add(fileList) {
  const files = Array.from(fileList || [])
  emit('update:modelValue', props.multiple ? [...props.modelValue, ...files] : files.slice(0, 1))
}
function onDrop(e) { over.value = false; if (!props.disabled) add(e.dataTransfer.files) }
function remove(i) { const next = [...props.modelValue]; next.splice(i, 1); emit('update:modelValue', next) }
function fmt(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(0) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}
</script>

<template>
  <div class="dsfu">
    <div class="dsfu__zone" :class="{ 'is-over': over, 'is-disabled': disabled }"
      @dragover.prevent="over = true" @dragleave.prevent="over = false" @drop.prevent="onDrop"
      @click="!disabled && input.click()">
      <q-icon name="cloud_upload" size="32px" class="dsfu__icon" />
      <div class="dsfu__prompt"><span class="dsfu__link">Click to upload</span> or drag and drop</div>
      <div class="dsfu__hint">{{ hint }}</div>
      <input ref="input" type="file" class="dsfu__input" :accept="accept" :multiple="multiple"
        :disabled="disabled" @change="add($event.target.files)" />
    </div>

    <ul v-if="modelValue.length" class="dsfu__list">
      <li v-for="(f, i) in modelValue" :key="i" class="dsfu__file">
        <q-icon name="description" size="20px" class="dsfu__file-icon" />
        <span class="dsfu__file-name">{{ f.name }}</span>
        <span class="dsfu__file-size">{{ fmt(f.size) }}</span>
        <button type="button" class="dsfu__remove" aria-label="Remove" @click="remove(i)"><q-icon name="close" size="16px" /></button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.dsfu { display: flex; flex-direction: column; gap: 12px; }
.dsfu__zone {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: 28px 20px; text-align: center; cursor: pointer;
  border: 1.5px dashed var(--ds-color-border-bold);
  border-radius: var(--ds-radius-lg);
  background: var(--ds-color-surface);
  transition: border-color var(--ds-duration-fast) var(--ds-ease-standard),
    background var(--ds-duration-fast) var(--ds-ease-standard);
}
.dsfu__zone.is-over { border-color: var(--ds-color-border-focused); background: var(--ds-color-background-brand-subtlest); }
.dsfu__zone.is-disabled { opacity: 0.6; cursor: not-allowed; }
.dsfu__icon { color: var(--ds-color-icon-subtle); }
.dsfu__prompt { font-size: 0.9375rem; color: var(--ds-color-text); }
.dsfu__link { color: var(--ds-color-text-brand); font-weight: 700; }
.dsfu__hint { font-size: 0.75rem; color: var(--ds-color-text-subtle); }
.dsfu__input { display: none; }
.dsfu__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.dsfu__file {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-md);
}
.dsfu__file-icon { color: var(--ds-color-icon-subtle); flex: none; }
.dsfu__file-name { flex: 1 1 auto; font-size: 0.875rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsfu__file-size { flex: none; font-size: 0.75rem; color: var(--ds-color-text-subtle); }
.dsfu__remove { flex: none; border: 0; background: transparent; color: var(--ds-color-icon-subtle); cursor: pointer; display: flex; padding: 2px; border-radius: 4px; }
.dsfu__remove:hover { background: var(--ds-color-surface-sunken); color: var(--ds-color-text); }
</style>
