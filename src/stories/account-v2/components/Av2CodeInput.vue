<script setup>
/* Av2CodeInput — the 6-digit verification code control.
 *
 * Six SEPARATE boxes on screen, ONE real input underneath. The boxes are
 * painted; a single visually-hidden <input> owns the value, the caret, paste,
 * autofill (autocomplete="one-time-code") and the mobile numeric keyboard.
 * That split is the whole trick: truly separate <input>s are where paste
 * breaks — the browser drops the whole string into box one and the user
 * retypes it — so the separation is visual only. (Until 2026-09-29 the boxes
 * were also drawn as one joined bar; they were pulled apart at the user's
 * request to read as distinct, more engaging slots.)
 *
 * Paste is handled explicitly because a code arriving by email (the launch
 * factor, ENG-3037) or from an authenticator app (later, ENG-3033) is almost
 * always pasted, never typed.
 *
 * What makes it feel alive, all from DS colour + motion tokens:
 *   · grouped 3 · 3 with a small dash, the way codes are read aloud;
 *   · the box you're on lifts, gets the focus ring and a blinking caret;
 *   · each digit pops in as it lands; filled boxes take the brand tint;
 *   · a full code runs a quick left-to-right wave — "ready to verify";
 *   · an error turns the boxes red and gives the row one short shake.
 * Every animation is dropped under prefers-reduced-motion.
 *
 * Responsive: boxes share the row (flex, min-width 0) up to a 60px cap, keep a
 * 5:6 aspect, and the digit size scales with them.
 */
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  length: { type: Number, default: 6 },
  /** Error styling (red boxes + one shake); the message is rendered by the step. */
  error: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  autofocus: { type: Boolean, default: false },
  /** id of the element describing the field (hint or error), forwarded to the
   *  real input so screen readers hear it — attributes on the component would
   *  otherwise land on the wrapper div, not on the input. */
  describedby: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue', 'complete'])

const field = ref(null)
const focused = ref(false)

const digits = computed(() =>
  Array.from({ length: props.length }, (_, i) => props.modelValue[i] || '')
)
/** The box the caret is "in" — the first empty one, or the last when full. */
const caretAt = computed(() => Math.min(props.modelValue.length, props.length - 1))
/** Index the 3 · 3 dash sits before; even lengths of 6+ only. */
const splitAt = computed(() => (props.length >= 6 && props.length % 2 === 0 ? props.length / 2 : -1))
const complete = computed(() => props.modelValue.length === props.length && !props.error && !props.disabled)

function onInput(e) {
  const clean = String(e.target.value || '').replace(/\D/g, '').slice(0, props.length)
  emit('update:modelValue', clean)
  if (clean.length === props.length) emit('complete', clean)
}
</script>

<template>
  <div class="av2ci"
    :class="{ 'is-error': error, 'is-disabled': disabled, 'is-complete': complete, 'is-focused': focused }"
    @click="field?.focus()">
    <input
      ref="field"
      class="av2ci__input"
      :value="modelValue"
      :disabled="disabled"
      :autofocus="autofocus"
      inputmode="numeric"
      autocomplete="one-time-code"
      :maxlength="length"
      aria-label="Verification code"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="describedby || undefined"
      @input="onInput"
      @focus="focused = true"
      @blur="focused = false" />

    <div class="av2ci__slots" aria-hidden="true">
      <template v-for="(d, i) in digits" :key="i">
        <span v-if="i === splitAt" class="av2ci__sep" />
        <span class="av2ci__slot" :style="{ '--i': i }"
          :class="{ 'is-filled': !!d, 'is-active': focused && i === caretAt && !disabled }">
          <!-- Keyed on the digit so a changed digit re-mounts and pops again. -->
          <span v-if="d" :key="`${i}-${d}`" class="av2ci__digit">{{ d }}</span>
          <span v-else-if="focused && i === caretAt && !disabled" class="av2ci__caret" />
        </span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.av2ci { position: relative; display: block; cursor: text; }

/* The real input: invisible, covering the boxes so a tap anywhere focuses it.
   `[disabled]` needs the !important — Quasar ships a global
   `[disabled] { opacity: .6 !important }` that otherwise wins, and the input's
   own digits then showed through the painted boxes in the disabled state. */
.av2ci__input,
.av2ci .av2ci__input[disabled] {
  position: absolute; inset: 0; width: 100%; height: 100%;
  opacity: 0 !important; border: 0; padding: 0; font: inherit;
  color: transparent; -webkit-text-fill-color: transparent; caret-color: transparent;
}

/* Padding + equal negative margin: room for the active box's lift and focus
   ring (and the shake) so no container with overflow:hidden can clip them,
   without changing the component's footprint. */
.av2ci__slots { display: flex; align-items: center; gap: 10px; padding: 6px 4px; margin: -6px -4px; }

.av2ci__slot {
  position: relative;
  flex: 1 1 0; min-width: 0; max-width: 60px; aspect-ratio: 5 / 6;
  display: flex; align-items: center; justify-content: center;
  border: 1.5px solid var(--ds-color-border-bold);
  border-radius: var(--ds-radius-md);
  background: var(--ds-color-background-input);
  font-size: clamp(1.25rem, 0.9rem + 1.2vw, 1.75rem); font-weight: 700;
  color: var(--ds-color-text); font-variant-numeric: tabular-nums;
  transition:
    border-color var(--ds-duration-fast) var(--ds-ease-standard),
    background var(--ds-duration-fast) var(--ds-ease-standard),
    box-shadow var(--ds-duration-fast) var(--ds-ease-standard),
    transform var(--ds-duration-fast) var(--ds-ease-standard);
}
.av2ci__slot:hover { border-color: var(--ds-color-border-focused); }

.av2ci__sep {
  flex: none; width: 10px; height: 2px; border-radius: 1px;
  background: var(--ds-color-border-bold);
}

/* Filled — the brand tint says "this one's done". */
.av2ci__slot.is-filled {
  border-color: var(--ds-color-border-brand);
  background: var(--ds-color-background-brand-subtlest);
}

/* The box you're on lifts and gets the focus ring. */
.av2ci__slot.is-active {
  border-color: var(--ds-color-border-focused);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--ds-color-border-focused) 22%, transparent);
  transform: translateY(-2px);
}

.av2ci__caret {
  width: 2px; height: 42%; border-radius: 1px;
  background: var(--ds-color-background-brand-bold);
  animation: av2ci-blink 1s steps(1) infinite;
}
.av2ci__digit { display: inline-block; animation: av2ci-pop var(--ds-duration-base) var(--ds-ease-emphasized) both; }

/* A full code: one left-to-right wave. */
.av2ci.is-complete .av2ci__slot {
  animation: av2ci-wave 420ms var(--ds-ease-emphasized) both;
  animation-delay: calc(var(--i) * 45ms);
}

/* Error: red boxes, one short shake of the row. */
.av2ci.is-error .av2ci__slot {
  border-color: var(--ds-color-background-danger-bold);
  background: var(--ds-color-background-danger);
}
.av2ci.is-error .av2ci__slot.is-active {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--ds-color-background-danger-bold) 22%, transparent);
}
.av2ci.is-error .av2ci__slots { animation: av2ci-shake 360ms var(--ds-ease-standard) both; }

/* Disabled: muted, not translucent — nothing underneath may show through. */
.av2ci.is-disabled { cursor: not-allowed; }
.av2ci.is-disabled .av2ci__slot {
  border-color: var(--ds-color-border-disabled);
  background: var(--ds-color-surface-sunken);
  color: var(--ds-color-text-subtle);
}
.av2ci.is-disabled .av2ci__sep { background: var(--ds-color-border-disabled); }

@keyframes av2ci-blink { 50% { opacity: 0; } }
@keyframes av2ci-pop {
  from { opacity: 0; transform: scale(0.4) translateY(4px); }
  60% { opacity: 1; transform: scale(1.14); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes av2ci-wave {
  0%, 100% { transform: translateY(0); }
  40% { transform: translateY(-5px); }
}
@keyframes av2ci-shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(5px); }
  60% { transform: translateX(-3px); }
  80% { transform: translateX(2px); }
}

@media (prefers-reduced-motion: reduce) {
  .av2ci__slot, .av2ci__digit, .av2ci__caret, .av2ci__slots,
  .av2ci.is-complete .av2ci__slot { animation: none !important; transition: none; }
  .av2ci__slot.is-active { transform: none; }
}
</style>
