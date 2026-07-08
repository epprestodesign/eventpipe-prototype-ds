<script setup>
// DsSectionHeader — a section title with optional subtitle + actions slot.
// Variants:
//  • 'default'    — neutral heading + optional subtitle (original behavior).
//  • 'section'    — EventPipe blue title with a hairline rule extending right
//                   (e.g. "Event Details", "Tier 1", "Select Reservations to Move").
//  • 'subsection' — smaller black bold title, no rule ("Refund Policies").
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  variant: { type: String, default: 'default' }, // default | section | subsection
})
</script>

<template>
  <!-- EventPipe blue section header with rule -->
  <div v-if="variant === 'section'" class="dsh dsh--section">
    <div class="dsh__row">
      <h3 class="dsh__title dsh__title--accent">{{ title }}</h3>
      <span class="dsh__rule"></span>
      <div class="dsh__actions"><slot name="actions" /></div>
    </div>
    <div v-if="subtitle" class="dsh__sub">{{ subtitle }}</div>
  </div>

  <!-- Blue accent heading, no rule (Company Settings sections) -->
  <div v-else-if="variant === 'accent'" class="dsh dsh--subsection">
    <div class="dsh__row">
      <h3 class="dsh__title dsh__title--accent">{{ title }}</h3>
      <div class="dsh__actions"><slot name="actions" /></div>
    </div>
    <div v-if="subtitle" class="dsh__sub">{{ subtitle }}</div>
  </div>

  <!-- Black subsection header, no rule -->
  <div v-else-if="variant === 'subsection'" class="dsh dsh--subsection">
    <div class="dsh__row">
      <h4 class="dsh__title dsh__title--sub">{{ title }}</h4>
      <div class="dsh__actions"><slot name="actions" /></div>
    </div>
    <div v-if="subtitle" class="dsh__sub">{{ subtitle }}</div>
  </div>

  <!-- Default (original) -->
  <div v-else class="ds-section-header row items-center q-mb-md">
    <div class="col">
      <div class="text-h6">{{ title }}</div>
      <div v-if="subtitle" class="text-body2 text-grey-7">{{ subtitle }}</div>
    </div>
    <div class="col-auto"><slot name="actions" /></div>
  </div>
</template>

<style scoped>
.dsh--section { margin-bottom: 16px; }
.dsh--subsection { margin-bottom: 4px; }
.dsh__row { display: flex; align-items: center; gap: 16px; }
.dsh__title { margin: 0; font-weight: 700; letter-spacing: -0.01em; line-height: 1.2; }
.dsh__title--accent { color: var(--ds-color-background-brand-bold); font-size: 1.125rem; font-weight: 500; white-space: nowrap; }
.dsh__title--sub { color: var(--ds-color-text); font-size: 0.9375rem; white-space: nowrap; }
.dsh__rule { flex: 1 1 auto; height: 1px; background: var(--ds-color-border); }
.dsh__actions { flex: none; display: flex; align-items: center; gap: 8px; }
.dsh__sub { margin-top: 2px; font-size: 0.8125rem; line-height: 1.35; color: var(--ds-color-text-subtle); }
</style>
