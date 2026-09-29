<script setup>
/* Av2LoginPasswordField — the password row, with "Forgot password?"
 * right-aligned on the label baseline and a keyboard-operable show/hide toggle.
 *
 * Why not DsInput:
 *
 *  1. DsField owns its label and offers no slot beside it, and the references
 *     are unanimous that the recovery link belongs on the Password label row or
 *     directly under the field — never in a page footer.
 *  2. ENG-3019 needs the field labelled (`for`/`id`) and its error linked with
 *     aria-describedby. DsInput passes neither through to the native <input>.
 *  3. DsInput's show/hide is a bare clickable icon — not focusable, no name, no
 *     state — and ENG-3019's AC is "fully keyboard usable". Here it is a real
 *     button with an aria-label and aria-pressed.
 *
 * The QInput is the same outlined + dense one DsInput renders, so it looks
 * identical (the global .q-field--outlined rules in app.scss do the styling).
 *
 * The error renders under this field, and its id is exposed as `errorId` so
 * the email field above can point at the same message: the failed-login error
 * is deliberately generic and blames the pair, not one field.
 */
import { ref } from 'vue'
import Av2LoginInlineError from './Av2LoginInlineError.vue'

defineProps({
  modelValue: { type: String, default: '' },
  /** Message text; empty means no error. */
  error: { type: String, default: '' },
  inputId: { type: String, default: 'av2-signin-password' },
  errorId: { type: String, default: 'av2-signin-error' },
})
defineEmits(['update:modelValue'])

const shown = ref(false)
</script>

<template>
  <div>
    <div class="av2lpw__row">
      <label class="av2lpw__label" :for="inputId">Password</label>
      <a class="av2lpw__forgot" href="#">Forgot password?</a>
    </div>

    <!-- The border stays neutral on error: the reference treatment lets the
         message do the work, and painting only this border would contradict a
         message that deliberately does not say which field was wrong. -->
    <q-input
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :for="inputId"
      :type="shown ? 'text' : 'password'"
      outlined
      dense
      hide-bottom-space
      autocomplete="current-password"
      :aria-describedby="error ? errorId : undefined"
      :aria-invalid="error ? 'true' : undefined">
      <template #append>
        <button type="button" class="av2lpw__toggle"
          :aria-label="shown ? 'Hide password' : 'Show password'"
          :aria-pressed="shown ? 'true' : 'false'"
          :aria-controls="inputId"
          @click="shown = !shown">
          <q-icon :name="shown ? 'visibility' : 'visibility_off'" size="20px" aria-hidden="true" />
        </button>
      </template>
    </q-input>

    <Av2LoginInlineError v-if="error" :id="errorId" :message="error" />
  </div>
</template>

<style scoped>
/* Baseline alignment, not centre: the link is smaller than the label and the
   two must sit on one reading line. */
.av2lpw__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 6px;
}
/* Matches .dsf__label so this field lines up with every DsField above it. */
.av2lpw__label {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--ds-color-text-subtle);
  line-height: 1.3;
}
.av2lpw__forgot {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--ds-color-link);
  text-decoration: none;
  white-space: nowrap;
}
.av2lpw__forgot:hover { text-decoration: underline; }

.av2lpw__toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: -6px;
  padding: 0;
  border: 0;
  border-radius: var(--ds-radius-sm);
  background: transparent;
  color: var(--ds-color-icon-subtle);
  cursor: pointer;
}
.av2lpw__toggle:hover { color: var(--ds-color-text); background: var(--ds-color-surface-sunken); }
.av2lpw__toggle:focus-visible { outline: 2px solid var(--ds-color-border-focused); outline-offset: 0; }
</style>
