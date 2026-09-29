<script>
/* Scored here rather than in the template so the Account Security page and the
 * Set Password page judge a password identically — a password called "Strong"
 * on one screen and "Fair" on the other would be a bug report on day one.
 *
 * Deliberately simple and deterministic. Production should use a proper
 * estimator (zxcvbn or similar) server- and client-side; this exists so the
 * meter's four states can be reviewed with realistic inputs. Length does most
 * of the work, because length is what actually resists guessing; a trailing
 * year or a product name costs a level, because those are the first things a
 * targeted guess tries. */
export const MIN_LENGTH = 10

export function scorePassword (pw = '') {
  if (!pw) return 0
  const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(pw)).length
  let s = 0
  if (pw.length >= MIN_LENGTH) s += 1
  if (pw.length >= 14) s += 1
  if (classes >= 3) s += 1
  if (pw.length >= 18 || (pw.length >= 14 && classes >= 3)) s += 1
  if (/(19|20)\d\d$|password|eventpipe|qwerty|123/i.test(pw)) s -= 1
  return Math.min(4, Math.max(1, s))
}
</script>

<script setup>
/* Av2SetPwStrength — the password strength meter ENG-3020 asks for.
 *
 * Hand-rolled because the design system has no meter: DsRange is an input and
 * QLinearProgress reads as "loading". Four segments plus a word, so strength
 * is never carried by colour alone.
 *
 * Advisory, not a gate. The only hard rule is MIN_LENGTH; the meter tells the
 * user how good the password is, and the submit button is governed by the
 * form's own rules, not by this.
 */
import { computed } from 'vue'

const props = defineProps({
  password: { type: String, default: '' },
})

const LEVELS = [
  { label: '', tone: '' },
  { label: 'Weak', tone: 'danger', hint: 'Easy to guess. Make it longer — a short phrase works well.' },
  { label: 'Fair', tone: 'warning', hint: 'Acceptable, but a few more characters would help.' },
  { label: 'Good', tone: 'success', hint: 'Hard to guess.' },
  { label: 'Strong', tone: 'success', hint: 'Very hard to guess.' },
]

const score = computed(() => scorePassword(props.password))
const level = computed(() => LEVELS[score.value])
const tooShort = computed(() => props.password.length > 0 && props.password.length < MIN_LENGTH)
</script>

<template>
  <div class="av2pws">
    <div class="av2pws__bar" aria-hidden="true">
      <span v-for="n in 4" :key="n" class="av2pws__seg"
        :class="n <= score ? 'av2pws__seg--' + level.tone : ''" />
    </div>
    <!-- Polite live region: announces the new level once typing settles, not
         on every keystroke's worth of colour change. -->
    <p class="av2pws__text" aria-live="polite">
      <template v-if="!password">At least {{ MIN_LENGTH }} characters. Longer beats complicated.</template>
      <template v-else-if="tooShort">
        <strong>Too short</strong> — {{ MIN_LENGTH - password.length }} more
        {{ MIN_LENGTH - password.length === 1 ? 'character' : 'characters' }} needed.
      </template>
      <template v-else>
        <strong :class="'av2pws__word--' + level.tone">{{ level.label }}.</strong> {{ level.hint }}
      </template>
    </p>
  </div>
</template>

<style scoped>
.av2pws { margin-top: 8px; }
.av2pws__bar { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; }
.av2pws__seg { height: 4px; border-radius: var(--ds-radius-sm); background: var(--ds-color-border); }
.av2pws__seg--danger { background: var(--ds-color-background-danger-bold); }
.av2pws__seg--warning { background: var(--ds-color-background-warning-bold); }
.av2pws__seg--success { background: var(--ds-color-background-success-bold); }
.av2pws__text { margin: 6px 0 0; font-size: 0.8125rem; line-height: 1.45; color: var(--ds-color-text-subtle); }
.av2pws__word--danger { color: var(--ds-color-text-danger); }
.av2pws__word--warning { color: var(--ds-color-text-warning); }
.av2pws__word--success { color: var(--ds-color-text-success); }
</style>
