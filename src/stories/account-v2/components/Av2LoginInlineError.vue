<script setup>
/* Av2LoginInlineError — one red, icon-prefixed line placed at the point of
 * failure.
 *
 * Shared by the password field and the code control so the two failures read
 * identically: someone who has just mistyped a password and then mistypes a
 * code should not have to learn a second error language mid-flow.
 *
 * It exists rather than reusing DsField's `error` prop because DsField renders
 * that as plain 12px text with no icon, which is close enough to its own hint
 * styling to be skimmed past — and a sign-in failure is the one message in this
 * flow that must not be missed.
 *
 * Give it an `id` (falls through to the <p>) and point the failing field's
 * `aria-describedby` at it, so the message is read again whenever the field is
 * focused — ENG-3019 asks for field errors linked with aria-describedby.
 */
defineProps({
  message: { type: String, required: true },
  /** true: this line is its own alert. false: it sits inside a caller-owned
   *  aria-live region (the code page keeps one mounted permanently), and a
   *  second, nested alert would make screen readers announce it twice. */
  announce: { type: Boolean, default: true },
})
</script>

<template>
  <!-- role=alert so the message is announced when it appears, not only when the
       field is next focused: the user's eyes are on the button they just hit. -->
  <p class="av2lerr" :role="announce ? 'alert' : undefined">
    <q-icon name="error" size="16px" class="av2lerr__icon" aria-hidden="true" />
    <span>{{ message }}</span>
  </p>
</template>

<style scoped>
.av2lerr {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin: 8px 0 0;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: var(--ds-color-text-danger);
}
.av2lerr__icon { flex: none; margin-top: 1px; }
</style>
