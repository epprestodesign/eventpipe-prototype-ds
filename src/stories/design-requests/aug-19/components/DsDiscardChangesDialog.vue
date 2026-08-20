<script setup>
// DsDiscardChangesDialog — the standard "you have unsaved work and are about to
// walk away from it" dialog. Aug 19.
//
//   <ds-discard-changes-dialog v-model="open" @confirm="leave" />
//
// Sibling to DsConfirmDialog, not a replacement for it. The two answer different
// questions and deliberately look different:
//
//   DsConfirmDialog          "Delete this?" / "Restore the default?"
//                            You asked for something irreversible. Full-width
//                            buttons, the confirm in danger red — the weight is
//                            the point.
//
//   DsDiscardChangesDialog   "You have unsaved changes."
//                            You did NOT ask for anything destructive; you just
//                            navigated. Nothing has gone wrong and nothing is
//                            being deleted, so it is the lighter shape: text
//                            buttons, right-aligned, no red.
//
// Using the heavy destructive treatment for this made an ordinary Back click
// look like a delete confirmation.
//
// Copy defaults to the generic discard-changes message so every instance says
// the same thing; every string is overridable for the cases that need to be
// specific.
import { computed } from 'vue'
import './ds-dialog-shell.css'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'Discard Changes' },
  message: {
    type: String,
    default: 'You have not saved your changes. Are you sure you want to go back without saving?',
  },
  confirmLabel: { type: String, default: 'Continue' },
  cancelLabel: { type: String, default: 'Cancel' },
  // Persistent by default: the whole point is that the choice is made, not
  // dismissed by a stray click on the backdrop while changes hang in the balance.
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
    <!-- role="alertdialog" rather than "dialog": this interrupts a navigation
         the user already asked for, so assistive tech should announce it rather
         than wait to be explored. -->
    <q-card class="dsdlg" role="alertdialog">
      <h2 class="dsdlg__title">{{ title }}</h2>
      <div class="dsdlg__body">
        <slot name="body">{{ message }}</slot>
      </div>
      <div class="dsdlg__actions">
        <q-btn flat no-caps class="dsdlg__btn dsdlg__btn--cancel"
          :label="cancelLabel" @click="onCancel" />
        <q-btn flat no-caps class="dsdlg__btn dsdlg__btn--primary"
          :label="confirmLabel" @click="onConfirm" />
      </div>
    </q-card>
  </q-dialog>
</template>
