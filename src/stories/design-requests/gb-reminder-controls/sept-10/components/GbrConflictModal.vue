<script setup>
/* GbrConflictModal — PP-44 / GBR-2.
 *
 * Raised on save of registration settings when all three of PP-44's conditions
 * hold. The trigger lives in `hasReminderConflict()` in `_gbr.js`.
 *
 * The body copy is Scott's, approved verbatim on 2026-09-09. An earlier version
 * named the tier count and the configured interval so a Hoco could tell whether
 * the overlap meant two emails or nine. Scott replaced it with fixed wording:
 * "I would rather the devs not have to pull in variables to that modal." So the
 * modal takes no data about the event at all now — it describes the shape of
 * the problem rather than this event's version of it.
 *
 * The X is gone. PP-44 said dismissing completes the save with both reminder
 * types left on, which meant an X that silently wrote. Scott agreed it "doesn't
 * make much sense" and is adjusting the requirement. The dialog is `persistent`,
 * so Escape and backdrop clicks were already blocked; removing the X leaves the
 * two buttons as the only way out, and both of them say what they do.
 *
 * `dismissMode` survives only so Concepts › Modal Dismiss Behavior can still
 * show the two options that were rejected. Nothing in the product passes it.
 */
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  /** 'none' (shipped) · 'save' and 'cancel' exist for the Concepts story only. */
  dismissMode: { type: String, default: 'none' },
})
const emit = defineEmits(['update:modelValue', 'turn-off-and-save', 'save-anyway', 'cancel'])

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

function dismiss() {
  emit(props.dismissMode === 'cancel' ? 'cancel' : 'save-anyway')
  open.value = false
}
function turnOff() {
  emit('turn-off-and-save')
  open.value = false
}
function saveAnyway() {
  emit('save-anyway')
  open.value = false
}
</script>

<template>
  <q-dialog v-model="open" persistent>
    <q-card class="gbrm" style="width:560px; max-width:92vw;">
      <div class="gbrm__head">
        <q-icon name="notifications_active" size="22px" class="gbrm__icon" />
        <div class="gbrm__title">Group block creators will get two sets of reminders</div>
        <q-btn v-if="dismissMode !== 'none'" flat round dense icon="close" size="sm" class="gbrm__x" @click="dismiss">
          <q-tooltip>{{ dismissMode === 'cancel' ? 'Close without saving' : 'Save with both on' }}</q-tooltip>
        </q-btn>
      </div>

      <q-card-section class="gbrm__body">
        <p>
          Compliance reminders and group block reminders are both on for this event, and at least
          one compliance reminder tier sends to group block contacts. Those contacts will receive
          both streams: a compliance reminder on your tier schedule, and a group block reminder
          starting 2 days after each block opens and recurring on the interval you set for this
          event until the group block's release date.
        </p>
        <p class="gbrm__rec">
          We recommend turning group block reminders off for this event.
        </p>
      </q-card-section>

      <q-card-actions class="gbrm__actions">
        <q-btn flat no-caps color="primary" label="Save with both on" @click="saveAnyway" />
        <q-btn unelevated no-caps color="primary" label="Turn off group block reminders and save" @click="turnOff" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.gbrm { border-radius: var(--ds-radius-lg); }
.gbrm__head {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 22px 20px 4px 24px;
}
.gbrm__icon { color: var(--ds-color-icon-warning, #b54708); flex: none; margin-top: 1px; }
.gbrm__title { flex: 1; font-size: 1.0625rem; font-weight: 700; color: var(--ds-color-text); line-height: 1.35; }
.gbrm__x { flex: none; color: var(--ds-color-icon-subtle); margin: -6px -4px 0 0; }
.gbrm__body { padding: 12px 24px 4px 56px; }
.gbrm__body p { margin: 0 0 12px; font-size: 0.9375rem; line-height: 1.55; color: var(--ds-color-text); }
.gbrm__rec { font-weight: 700; }
.gbrm__actions { padding: 12px 20px 20px; gap: 8px; justify-content: flex-end; }
</style>
