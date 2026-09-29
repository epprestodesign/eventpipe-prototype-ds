<script setup>
/* Av2CodeResend — the "Resend code" line under the emailed-code input
 * (ENG-3037: disabled for a 60-second countdown after each send).
 *
 * The countdown is a prop, not a timer. Each story renders one frozen moment —
 * "Resend code in 0:42" — so screenshots and the smoke test are deterministic.
 * Production swaps `wait` for a ticking value; the markup does not change.
 * (Av2ResetResend, on the password pages, does run a real timer; this one is
 * static on purpose because the code page has more states to sign off.)
 *
 * Three states:
 *   cooling — just sent; disabled, with the time left in the label.
 *   ready   — countdown over; an ordinary enabled button.
 *   limited — hourly resend limit reached (5/hour); disabled with no timer,
 *             because the page's error message owns the explanation.
 */
import { computed } from 'vue'

const props = defineProps({
  state: {
    type: String,
    default: 'cooling',
    validator: (v) => ['cooling', 'ready', 'limited'].includes(v),
  },
  /** m:ss left on the countdown, e.g. "0:42". Only read when cooling. */
  wait: { type: String, default: '1:00' },
})

const seconds = computed(() => {
  const [m, s] = props.wait.split(':').map(Number)
  return (m || 0) * 60 + (s || 0)
})
</script>

<template>
  <p class="av2cr">
    <!-- The spam nudge only makes sense while resending is possible; once the
         hourly limit is hit, the page's error message is the explanation. -->
    <span v-if="state !== 'limited'">Didn't get the email? Check your spam folder, or</span>
    <!-- Deliberately not a live region: announcing a new number every second
         would talk over the user for a full minute. The aria-label states the
         wait once, in words; the visible m:ss is for sighted users. -->
    <q-btn v-if="state === 'cooling'" flat dense no-caps disable
      class="av2cr__btn av2cr__btn--wait"
      :aria-label="`Resend code, available in ${seconds} seconds`">
      Resend code in <span class="av2cr__time">{{ wait }}</span>
    </q-btn>
    <q-btn v-else-if="state === 'ready'" flat dense no-caps color="primary"
      class="av2cr__btn" label="Resend code" />
    <q-btn v-else flat dense no-caps disable class="av2cr__btn av2cr__btn--wait"
      label="Resend code" />
  </p>
</template>

<style scoped>
.av2cr {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  /* Left-aligned, with the rest of the split shell's content column. */
  justify-content: flex-start;
  gap: 0 2px;
  margin: 12px 0 0;
  font-size: 0.8125rem;
  color: var(--ds-color-text-subtle);
}
.av2cr__btn { font-size: 0.8125rem; font-weight: 600; padding: 0 2px; min-height: 0; line-height: inherit; }
.av2cr__btn :deep(.q-btn__content) { line-height: inherit; }
/* Quasar's disabled state is opacity only; paint it in DS neutrals so it reads
   as "not yet" rather than as a faded link that might still work. */
.av2cr__btn--wait { opacity: 1 !important; color: var(--ds-color-text-subtlest); }
.av2cr__time { font-variant-numeric: tabular-nums; margin-left: 3px; }
</style>
