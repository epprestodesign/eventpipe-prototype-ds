<script setup>
// DsLink — an inline text link. Brand-colored, weight 600, underline-on-hover by
// default. Set `external` for an open-in-new affordance + safe rel.
defineProps({
  href: { type: String, default: '#' },
  tone: { type: String, default: 'brand' },        // brand | subtle
  underline: { type: String, default: 'hover' },     // hover | always | none
  external: { type: Boolean, default: false },
})
</script>

<template>
  <a
    :href="href"
    class="dslink"
    :class="[`dslink--${tone}`, `dslink--u-${underline}`]"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
  >
    <slot />
    <q-icon v-if="external" name="open_in_new" size="14px" class="dslink__ext" />
  </a>
</template>

<style scoped>
.dslink { color: var(--ds-color-text-brand); text-decoration: none; font-weight: 700; cursor: pointer; }
.dslink--subtle { color: var(--ds-color-text-subtle); }
.dslink--u-always { text-decoration: underline; }
.dslink--u-hover:hover { text-decoration: underline; }
.dslink:focus-visible { outline: 2px solid var(--ds-color-border-focused); outline-offset: 2px; border-radius: 2px; }
.dslink__ext { vertical-align: -1px; margin-left: 2px; }
</style>
