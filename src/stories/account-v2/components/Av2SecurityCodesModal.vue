<script setup>
/* Av2SecurityCodesModal — a freshly generated set of recovery codes, shown once,
 * over Account Security. ENG-3033 (later): "recovery codes to download".
 *
 * Same gate as the last setup step: persistent, no close button, and Done stays
 * disabled until "I've saved these" is ticked. The codes are stored hashed, so
 * this is the only time they can be shown; closing without keeping them leaves
 * an account with a second factor and no way around it.
 */
import { computed, ref } from 'vue'
import DsModal from '../../../components/DsModal.vue'
import Av2EnrollCodeSheet from './Av2EnrollCodeSheet.vue'
import Av2EnrollNotice from './Av2EnrollNotice.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  codes: { type: Array, required: true },
})
const emit = defineEmits(['update:modelValue'])
const open = computed({ get: () => props.modelValue, set: (v) => emit('update:modelValue', v) })
const saved = ref(false)
</script>

<template>
  <ds-modal v-model="open" size="md" title="Your new recovery codes" persistent hide-close>
    <p class="av2cm__lead">
      Your old codes stopped working just now. Keep these instead — each one works once.
    </p>
    <av2-enroll-code-sheet :codes="codes" />
    <av2-enroll-notice tone="warning" icon="visibility_off" title="Shown once, and only here">
      <p>
        We store a hash of each code, not the code, so we can't show them again or read them out
        over a support call.
      </p>
    </av2-enroll-notice>
    <!-- Not pre-ticked: the tick is the user's claim, not ours. -->
    <div style="margin-top:16px;">
      <q-checkbox v-model="saved" color="primary" size="sm" label="I've saved these codes somewhere safe" />
    </div>

    <template #footer>
      <span />
      <q-btn unelevated no-caps color="primary" label="Done" :disable="!saved" @click="open = false" />
    </template>
  </ds-modal>
</template>

<style scoped>
.av2cm__lead { margin: 0; font-size: 0.9375rem; line-height: 1.55; color: var(--ds-color-text); }
</style>
