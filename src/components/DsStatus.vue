<script setup>
// DsStatus — a status indicator. Two variants:
//  • 'dot'  — a colored dot + label (Active / Invitation Expired) for table cells.
//  • 'pill' — a soft filled pill (Active / Inactive / Cancelled) for cards.
// The tone is auto-derived from common status words, or set explicitly.
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  tone: { type: String, default: '' },        // success | warning | danger | neutral | info (auto if empty)
  variant: { type: String, default: 'dot' },    // dot | pill
})

const TONE_BY_WORD = {
  active: 'success', approved: 'success', confirmed: 'success', complete: 'success', completed: 'success', enabled: 'success', live: 'success',
  pending: 'warning', 'in review': 'warning', processing: 'warning', unconfirmed: 'warning',
  inactive: 'neutral', draft: 'neutral', archived: 'neutral', disabled: 'neutral', closed: 'neutral',
  cancelled: 'danger', canceled: 'danger', declined: 'danger', expired: 'danger', 'invitation expired': 'danger', failed: 'danger', error: 'danger',
}
const tone = computed(() => props.tone || TONE_BY_WORD[props.label.toLowerCase()] || 'neutral')
</script>

<template>
  <span class="dsst" :class="[`dsst--${variant}`, `dsst--${tone}`]">
    <span v-if="variant === 'dot'" class="dsst__dot"></span>
    {{ label }}
  </span>
</template>

<style scoped>
.dsst { display: inline-flex; align-items: center; gap: 8px; font-size: 0.9375rem; white-space: nowrap; }
.dsst__dot { width: 9px; height: 9px; border-radius: 50%; flex: none; background: currentColor; }

/* Dot variant: neutral text + colored dot */
.dsst--dot { color: var(--ds-color-text); }
.dsst--dot .dsst__dot { background: var(--dsst-color); }

/* Pill variant: soft colored background */
.dsst--pill {
  padding: 4px 12px;
  border-radius: var(--ds-radius-pill);
  font-size: 0.8125rem;
  font-weight: 700;
  color: #fff;
  background: var(--dsst-color);
}

/* Tone → color */
.dsst--success { --dsst-color: var(--ds-color-background-success-bold); }
.dsst--warning { --dsst-color: var(--ds-color-background-warning-bold); }
.dsst--danger  { --dsst-color: var(--ds-color-background-danger-bold); }
.dsst--info    { --dsst-color: var(--ds-color-background-info-bold); }
.dsst--neutral { --dsst-color: var(--ds-palette-graphite-400); }
/* Warning pill needs dark text for contrast on yellow */
.dsst--pill.dsst--warning { color: var(--ds-color-text); }
</style>
