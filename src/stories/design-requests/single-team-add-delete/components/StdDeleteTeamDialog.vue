<script setup>
// STD-2 · ENG2-112 — the confirmation modal. One warning, static copy that is
// the same for every team (it does not count linked blocks or reservations).
// Cancel is the default action and takes focus; dismissing changes nothing.
// "Team" reads "Organization" when the event registers Organizations.
import { computed } from 'vue'
import { deleteCopy } from '../_std'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  word: { type: String, default: 'Team' },
  /** STD-3: the delete is in flight — keep the modal up, block a second click. */
  deleting: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue', 'confirm'])
const copy = computed(() => deleteCopy(props.word))
const close = () => { if (!props.deleting) emit('update:modelValue', false) }
</script>

<template>
  <q-dialog :model-value="modelValue" @update:model-value="(v) => !v && close()">
    <q-card class="ds-dialog" role="alertdialog" aria-labelledby="std-del-title" aria-describedby="std-del-body">
      <h2 id="std-del-title" class="ds-dialog__title">{{ copy.title }}</h2>
      <div id="std-del-body" class="ds-dialog__body">
        <strong class="std-del__lead">{{ copy.lead }}</strong> {{ copy.body }}
      </div>
      <div class="ds-dialog__actions">
        <q-btn unelevated no-caps autofocus class="ds-dialog__btn ds-btn--secondary" label="Cancel" :disable="deleting" @click="close" />
        <q-btn unelevated no-caps class="ds-dialog__btn ds-btn--danger" :label="copy.confirm" :loading="deleting" @click="emit('confirm')" />
      </div>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.std-del__lead { color: var(--ds-color-text); }
</style>
