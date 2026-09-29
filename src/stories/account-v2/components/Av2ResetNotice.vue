<script setup>
/* Av2ResetNotice — the inline notice used on the forgot / set-password cards.
 *
 * Three tones:
 *  - 'success' — a finished action the user should know about (the "Your
 *    password has been set" line on the sign-in card after ENG-3020).
 *  - 'info'    — neutral, factual (who invited you, how long a link lasts).
 *  - 'advisory'— amber, accepted-but-imperfect. Distinct from an error on
 *    purpose: red plus a disabled button tells the user to go back and fix
 *    something the product has already accepted.
 *
 * Lives here rather than in src/css/account-v2.scss because only these cards
 * use it; the shared shell file stays the shell.
 */
import { computed } from 'vue'

const props = defineProps({
  tone: { type: String, default: 'info' }, // success | info | advisory
})

const ICON = { success: 'check_circle', info: 'info', advisory: 'error_outline' }
const icon = computed(() => ICON[props.tone] || 'info')
</script>

<template>
  <!-- role=status: the success notice is the first thing on a page the user
       was just redirected to, and a screen reader should say why they are here. -->
  <div class="av2rn" :class="'av2rn--' + tone" role="status">
    <!-- Decorative: the sentence carries the meaning. -->
    <q-icon :name="icon" size="18px" class="av2rn__icon" aria-hidden="true" />
    <div><slot /></div>
  </div>
</template>

<style scoped>
.av2rn {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  margin: 0 0 18px;
  padding: 10px 12px;
  border: 1px solid transparent;
  border-radius: var(--ds-radius-md);
  font-size: 0.875rem;
  line-height: 1.5;
  text-align: left;
}
.av2rn__icon { flex: none; margin-top: 1px; }
.av2rn--success {
  background: var(--ds-color-background-success);
  border-color: var(--ds-color-background-success-bold);
  color: var(--ds-color-text);
}
.av2rn--success .av2rn__icon { color: var(--ds-color-text-success); }
.av2rn--info {
  background: var(--ds-color-surface-sunken);
  border-color: var(--ds-color-border);
  color: var(--ds-color-text-subtle);
}
.av2rn--advisory {
  background: var(--ds-color-background-warning);
  color: var(--ds-color-text-warning);
}
</style>
