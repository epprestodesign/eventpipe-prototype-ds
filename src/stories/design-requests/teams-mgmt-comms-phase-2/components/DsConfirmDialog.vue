<script setup>
// DsConfirmDialog — a focused confirm/deny dialog for a single decision
// (revert, discard, delete…). Wraps Quasar QDialog + the DS `.ds-dialog`
// styling so callers only supply copy. Set `destructive` to render the confirm
// action in danger red; it's `persistent` by default so the choice is explicit.
//
//   <ds-confirm-dialog v-model="open" title="Revert to default template?"
//     message="…" destructive confirm-label="Revert to default"
//     cancel-label="Keep custom" @confirm="revert" />
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, required: true },
  message: { type: String, default: '' },
  confirmLabel: { type: String, default: 'Confirm' },
  cancelLabel: { type: String, default: 'Cancel' },
  destructive: { type: Boolean, default: false },
  persistent: { type: Boolean, default: true },
})
const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

function onCancel () { emit('cancel'); open.value = false }
function onConfirm () { emit('confirm'); open.value = false }
</script>

<template>
  <q-dialog v-model="open" :persistent="persistent">
    <q-card class="ds-dialog" role="alertdialog">
      <h2 class="ds-dialog__title">{{ title }}</h2>
      <div class="ds-dialog__body">
        <slot name="body">{{ message }}</slot>
      </div>
      <div class="ds-dialog__actions">
        <q-btn unelevated no-caps class="ds-dialog__btn ds-btn--secondary" :label="cancelLabel" @click="onCancel" />
        <q-btn
          unelevated no-caps
          class="ds-dialog__btn"
          :class="destructive ? 'ds-btn--danger' : 'ds-btn--primary'"
          :label="confirmLabel"
          @click="onConfirm"
        />
      </div>
    </q-card>
  </q-dialog>
</template>
