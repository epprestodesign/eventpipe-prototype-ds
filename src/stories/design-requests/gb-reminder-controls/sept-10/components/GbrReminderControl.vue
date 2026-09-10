<script setup>
/* GbrReminderControl — the new Email Settings row. PP-42 (GBR-1) + PP-43 (GBR-3).
 *
 * Scott named all three pieces of copy in the 09/04 Loom and they are used as
 * given: title "Group Block Reminders", caption "interval between each
 * reminder", and info text describing the 2-day first send plus the interval.
 *
 * Two things it does that were not dictated:
 *
 *  • The ⓘ states the interval **currently set** rather than "every N days".
 *    The value is in the field right beside it, so echoing it costs nothing and
 *    turns an abstract sentence into an answerable one — set 14 and the tooltip
 *    says 14.
 *  • The ⓘ carries PP-42's confirmation-email exception ("The group block
 *    confirmation email sends regardless of toggle state"), because the natural
 *    reading of an off switch is that group block email stops altogether.
 *
 * One control carries both tickets: the toggle is GBR-1, the field is GBR-3.
 * They were specified separately but there is no state where a user wants one
 * without the other — an interval with no way to stop the sends is the problem
 * customers already have.
 */
import { computed } from 'vue'
import GbrSettingRow from './GbrSettingRow.vue'
import { REMINDER_TOOLTIP, validateInterval } from '../_gbr'

const props = defineProps({
  /** Days between reminders (PP-43). */
  interval: { type: [String, Number], default: 3 },
  /** Whether group block reminders send for this event at all (PP-42). */
  enabled: { type: Boolean, default: true },
  /** Show the computed next-send line under the field (see Concepts). */
  showNextSend: { type: Boolean, default: false },
})
const emit = defineEmits(['update:interval', 'update:enabled'])

const error = computed(() => (props.enabled ? validateInterval(props.interval) : ''))
const tooltip = REMINDER_TOOLTIP

/** Illustrative next-send date for the concept story — a block opened today,
 *  first reminder 2 days later, then every `interval` days. */
const nextSend = computed(() => {
  const n = Number(props.interval)
  if (!props.enabled || !Number.isInteger(n) || n < 1) return ''
  const d = new Date('2026-12-01T00:00:00')
  d.setDate(d.getDate() + 2 + n)
  return d.toLocaleDateString('en-US', { weekday: 'short', month: '2-digit', day: '2-digit', year: 'numeric' })
})

defineExpose({ error })
</script>

<template>
  <GbrSettingRow
    label="Group Block Reminders"
    :model-value="interval"
    @update:model-value="(v) => emit('update:interval', v)"
    :enabled="enabled"
    @update:enabled="(v) => emit('update:enabled', v)"
    :tooltip="tooltip"
    caption="Interval between each reminder"
    :error="error">
    <template #below>
      <div v-if="showNextSend && nextSend" class="gbr-next">
        Next reminder for a block opened today: <strong>{{ nextSend }}</strong>
      </div>
    </template>
  </GbrSettingRow>
</template>

<style scoped>
.gbr-next { font-size: 0.75rem; color: var(--ds-color-text-subtle); margin-top: 4px; }
</style>
