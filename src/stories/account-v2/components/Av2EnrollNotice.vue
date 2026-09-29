<script setup>
/* Av2EnrollNotice — the callout block used by enrolment and recovery codes.
 *
 * One component rather than four hand-rolled boxes, because these screens carry
 * an unusual number of statements the user must not skim past ("this is the only
 * time we show these", "your old codes stop working") and they have to look
 * identical each time or they stop reading as warnings.
 *
 * Tone is a prop rather than separate components: the difference is entirely
 * colour and default icon, and the copy is what carries the meaning. Every
 * tone is a design-system semantic pair — a warning is the warning token, a
 * danger is the danger token — so these keep their meaning unchanged by the
 * move off the sampled palette.
 */
import { computed } from 'vue'

const props = defineProps({
  tone: { type: String, default: 'info' }, // info | warning | danger | success
  /** Overrides the tone's default icon. */
  icon: { type: String, default: '' },
  /** Bold lead line. Optional — a one-sentence notice reads better without one. */
  title: { type: String, default: '' },
})

const DEFAULT_ICON = {
  info: 'info',
  warning: 'shield',
  danger: 'warning',
  success: 'check_circle',
}

const resolvedIcon = computed(() => props.icon || DEFAULT_ICON[props.tone] || 'info')
</script>

<template>
  <div class="av2note" :class="`av2note--${tone}`">
    <q-icon :name="resolvedIcon" size="20px" class="av2note__icon" />
    <div class="av2note__body">
      <p v-if="title" class="av2note__title">{{ title }}</p>
      <div class="av2note__text"><slot /></div>
    </div>
  </div>
</template>

<style scoped>
.av2note {
  display: flex; gap: 11px; align-items: flex-start;
  margin-top: 20px; padding: 13px 15px;
  border: 1px solid transparent; border-radius: var(--ds-radius-md);
  text-align: left;
}
.av2note__icon { flex: none; margin-top: 1px; }
.av2note__body { min-width: 0; }
.av2note__title { margin: 0 0 3px; font-size: 0.875rem; font-weight: 700; color: var(--ds-color-text); }
.av2note__text { font-size: 0.8125rem; line-height: 1.55; color: var(--ds-color-text-subtle); }
.av2note__text :deep(p) { margin: 0; }
.av2note__text :deep(p + p) { margin-top: 7px; }

.av2note--info { background: var(--ds-color-surface-sunken); border-color: var(--ds-color-border); }
.av2note--info .av2note__icon { color: var(--ds-color-text-subtle); }

.av2note--warning { background: var(--ds-color-background-warning); border-color: var(--ds-color-background-warning-bold); }
.av2note--warning .av2note__icon { color: var(--ds-color-text-warning); }

.av2note--danger { background: var(--ds-color-background-danger); border-color: var(--ds-color-background-danger-bold); }
.av2note--danger .av2note__icon { color: var(--ds-color-text-danger); }

.av2note--success { background: var(--ds-color-background-success); border-color: var(--ds-color-background-success-bold); }
.av2note--success .av2note__icon { color: var(--ds-color-text-success); }
</style>
