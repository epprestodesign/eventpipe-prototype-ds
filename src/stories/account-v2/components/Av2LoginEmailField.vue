<script setup>
/* Av2LoginEmailField — the email row on the sign-in card.
 *
 * Why not DsInput: DsInput's non-prop attributes land on its DsField wrapper
 * <div>, never on the native <input>, and its <label> has no `for`. ENG-3019's
 * acceptance criteria need both — a programmatically labelled field, and the
 * failed-login message linked to it with aria-describedby — so this renders the
 * same outlined, dense QInput DsInput renders (the global .q-field--outlined
 * rules in app.scss give it the identical 40px look) with the wiring DsInput
 * cannot pass through. The label styling copies .dsf__label so the two fields
 * line up with every other DS form.
 */
defineProps({
  modelValue: { type: String, default: '' },
  inputId: { type: String, default: 'av2-signin-email' },
  /** id of the message that describes this field; empty when there is none. */
  describedby: { type: String, default: '' },
  invalid: { type: Boolean, default: false },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="av2lem">
    <label class="av2lem__label" :for="inputId">Email</label>
    <q-input
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :for="inputId"
      type="email"
      outlined
      dense
      hide-bottom-space
      placeholder="you@company.com"
      autocomplete="username"
      :aria-describedby="describedby || undefined"
      :aria-invalid="invalid ? 'true' : undefined" />
  </div>
</template>

<style scoped>
.av2lem { display: flex; flex-direction: column; gap: 6px; }
.av2lem__label {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--ds-color-text-subtle);
  line-height: 1.3;
}
</style>
