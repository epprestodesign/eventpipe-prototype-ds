<script setup>
// DsCard — the standard surface card: a bordered, rounded container on the
// surface color. The most-reused shape in the system (confirmation cards, the
// account panel, saved rows, filter sidebar, etc.). Use it instead of hand-
// rolling `background: surface; border; border-radius`.
import { computed } from 'vue'

const props = defineProps({
  tag: { type: String, default: 'div' },
  padding: { type: String, default: 'md' },   // none | sm | md | lg
  radius: { type: String, default: 'lg' },     // md | lg
  interactive: { type: Boolean, default: false }, // hover affordance (for clickable cards)
})

const PAD = { none: '0', sm: '14px', md: '20px', lg: '28px' }
const RAD = { md: 'var(--ds-radius-md)', lg: 'var(--ds-radius-lg)' }
const style = computed(() => ({ padding: PAD[props.padding] ?? PAD.md, borderRadius: RAD[props.radius] ?? RAD.lg }))
</script>

<template>
  <component :is="tag" class="ds-card" :class="{ 'ds-card--interactive': interactive }" :style="style">
    <slot />
  </component>
</template>

<style scoped>
.ds-card { background: var(--ds-color-surface); border: 1px solid var(--ds-color-border); }
.ds-card--interactive { cursor: pointer; transition: border-color var(--ds-duration-fast) var(--ds-ease-standard), box-shadow var(--ds-duration-fast) var(--ds-ease-standard); }
.ds-card--interactive:hover { border-color: var(--ds-color-border-bold); box-shadow: var(--ds-shadow-2, 0 4px 12px rgba(0, 0, 0, 0.08)); }
</style>
