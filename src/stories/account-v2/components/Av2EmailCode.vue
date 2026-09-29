<script setup>
/* Av2EmailCode — the one-time code, large and copyable.
 *
 * The digits are ONE unbroken text run: the visual gap between them is
 * letter-spacing, which is not copied. Double-click selects the whole code and
 * a paste into the code page's six boxes lands in one go. Real spaces, or one
 * element per digit, would paste as "482 913" or not select as a word.
 *
 * No copy button: email clients strip scripts, so a button would be a picture
 * of a button. Selection is the copy affordance that actually works.
 */
defineProps({
  code: { type: String, required: true },
  caption: { type: String, default: '' },
})
</script>

<template>
  <div class="av2ec">
    <div class="av2ec__code" :aria-label="`Code: ${code.split('').join(' ')}`">{{ code }}</div>
    <div v-if="caption" class="av2ec__caption">{{ caption }}</div>
  </div>
</template>

<style scoped>
.av2ec {
  margin: 4px 0 18px;
  padding: 18px 16px;
  text-align: center;
  background: var(--ds-color-surface-sunken);
  border: 1px solid var(--ds-color-border-container);
  border-radius: var(--ds-radius-md);
}
.av2ec__code {
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: 0.3em;
  /* letter-spacing trails the last glyph; pull it back so the code centres. */
  margin-right: -0.3em;
  font-variant-numeric: tabular-nums;
  color: var(--ds-color-text);
  user-select: all;
}
.av2ec__caption { margin-top: 8px; font-size: 0.8125rem; color: var(--ds-color-text-subtle); }
</style>
