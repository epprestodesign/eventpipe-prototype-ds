<script setup>
// DsConfirmDialog — a focused confirm/deny dialog for a single decision
// (revert, discard, delete…). Set `destructive` to render the confirm action in
// danger red; it's `persistent` by default so the choice is explicit.
//
// Shares its layout with DsDiscardChangesDialog via ds-dialog-shell.css
// (2026-08-20). It used to carry the DS `.ds-dialog` treatment — bold title,
// two full-width buttons, a solid red confirm — which sat beside the discard
// dialog looking like a different product. Same box, same title weight, same
// right-aligned text buttons now; the only thing that changes between them is
// the colour of the committing action, which is the one thing that should.
//
//   <ds-confirm-dialog v-model="open" title="Revert to default template?"
//     message="…" destructive confirm-label="Revert to default"
//     cancel-label="Keep custom" @confirm="revert" />
import { computed } from 'vue'
import './ds-dialog-shell.css'

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
    <q-card class="dsdlg" role="alertdialog">
      <h2 class="dsdlg__title">{{ title }}</h2>
      <div class="dsdlg__body">
        <slot name="body">{{ message }}</slot>
      </div>
      <div class="dsdlg__actions">
        <q-btn flat no-caps class="dsdlg__btn dsdlg__btn--cancel"
          :label="cancelLabel" @click="onCancel" />
        <q-btn flat no-caps
          class="dsdlg__btn"
          :class="destructive ? 'dsdlg__btn--danger' : 'dsdlg__btn--primary'"
          :label="confirmLabel"
          @click="onConfirm"
        />
      </div>
    </q-card>
  </q-dialog>
</template>
