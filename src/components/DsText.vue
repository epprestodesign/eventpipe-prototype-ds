<script setup>
// DsText — the text primitive for headings, body copy, and captions. One
// component covers Shopify's Text / Heading / Paragraph: pick a `variant` for the
// type scale, a `tone` for color, and `as` for the rendered tag.
defineProps({
  as: { type: String, default: 'span' },
  variant: { type: String, default: 'body' }, // display | h1 | h2 | h3 | h4 | body-lg | body | caption | overline
  tone: { type: String, default: 'default' },   // default | subtle | subtlest | brand | danger | success | inverse
  weight: { type: String, default: '' },          // '' | bold | regular
})
</script>

<template>
  <component :is="as" class="dstext" :class="[`dst--${variant}`, `dst--t-${tone}`, weight && `dst--w-${weight}`]">
    <slot />
  </component>
</template>

<style scoped>
.dstext { margin: 0; }
/* Type scale */
.dst--display { font-size: 2rem; font-weight: 700; line-height: 1.15; letter-spacing: -0.02em; }
.dst--h1 { font-size: 1.75rem; font-weight: 700; line-height: 1.2; letter-spacing: -0.01em; }
.dst--h2 { font-size: 1.375rem; font-weight: 700; line-height: 1.25; }
.dst--h3 { font-size: 1.125rem; font-weight: 700; line-height: 1.3; }
.dst--h4 { font-size: 1rem; font-weight: 700; line-height: 1.3; }
.dst--body-lg { font-size: 1.0625rem; line-height: 1.5; }
.dst--body { font-size: 0.9375rem; line-height: 1.5; }
.dst--caption { font-size: 0.8125rem; line-height: 1.4; }
.dst--overline { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 700; }
/* Tone */
.dst--t-default { color: var(--ds-color-text); }
.dst--t-subtle { color: var(--ds-color-text-subtle); }
.dst--t-subtlest { color: var(--ds-color-text-subtlest); }
.dst--t-brand { color: var(--ds-color-text-brand); }
.dst--t-danger { color: var(--ds-color-text-danger); }
.dst--t-success { color: var(--ds-color-text-success); }
.dst--t-inverse { color: var(--ds-color-text-inverse); }
/* Weight override */
.dst--w-bold { font-weight: 700; }
.dst--w-regular { font-weight: 400; }
</style>
