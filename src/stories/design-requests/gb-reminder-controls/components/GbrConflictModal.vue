<script setup>
/* GbrConflictModal — PP-44 / GBR-2.
 *
 * Scott: "that modal is basically warning the user: hey, you have compliance
 * reminders and group block reminders turned on for this event. And then some
 * kind of warning that this could increase the amount of reminders that your
 * group block creators receive… I think we should say it's recommended that you
 * turn off group block reminders. And then there's an option to turn off group
 * block reminders and continue with the save, or save without changing."
 *
 * Three decisions this makes:
 *
 *  • It names the person affected. "Group block creators get two sets of
 *    reminders" is the consequence; "you have two settings on" is only the
 *    cause. The cause is still stated underneath, because the user has to know
 *    which two things to change.
 *
 *  • It shows the actual overlap — the tier count and the configured interval —
 *    rather than a generic warning. A Hoco deciding whether this matters needs
 *    to know if it is two emails or nine.
 *
 *  • Neither button is destructive-red and neither is a "cancel". Both save;
 *    they differ only in what gets saved. The recommended one is primary.
 *    Advisory means advisory.
 */
import { computed } from 'vue'
import { FIRST_REMINDER_DAYS } from '../_gbr'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  /** Configured days between group block reminders (from event Email Settings). */
  interval: { type: [Number, String], default: 3 },
  /** How many compliance reminder tiers include group block contacts. */
  tiers: { type: Number, default: 1 },
  /** What the X and Escape do — see Concepts › Modal Dismiss Behavior.
   *  'save'   (PP-44 as written) completes the save with both left on
   *  'cancel' abandons the save and returns to the dirty page
   *  'none'   removes the X entirely, forcing the choice between the buttons */
  dismissMode: { type: String, default: 'save' },
})
const emit = defineEmits(['update:modelValue', 'turn-off-and-save', 'save-anyway', 'cancel'])

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const intervalText = computed(() => {
  const n = Number(props.interval)
  if (!Number.isInteger(n) || n < 1) return 'on the interval set for this event'
  return n === 1 ? 'every day' : `every ${n} days`
})
const tierText = computed(() => (props.tiers === 1 ? '1 compliance reminder tier' : `${props.tiers} compliance reminder tiers`))

/* Dismissing completes the save with both left on — PP-44 states that
   explicitly ("Secondary action, or dismissing the modal, completes the save
   with both reminder types left on"), so the X is wired to the same handler as
   Save with both on rather than to a silent close. */
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
          Compliance reminders and group block reminders are both on for this event, and
          <strong>{{ tierText }}</strong> sends to group block contacts. Those contacts will
          receive both streams: a compliance reminder on your tier schedule, and a group block
          reminder {{ intervalText }} from {{ FIRST_REMINDER_DAYS }} days after each block opens
          until its release date.
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
