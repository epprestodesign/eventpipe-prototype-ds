<script setup>
/* Av2EmailButton — the single call to action in an email. A link styled as
 * the DS primary button (brand-bold fill, inverse text, button radius) because
 * in email it has to be an <a>; the URL is printed underneath so anyone wary
 * of a button in a security email can read where it goes before clicking. */
defineProps({
  label: { type: String, required: true },
  href: { type: String, required: true },
  /** The URL as the reader should see it, e.g. eventpipe.com/set-password/… */
  shownUrl: { type: String, default: '' },
})
</script>

<template>
  <div class="av2eb">
    <a :href="href" class="av2eb__btn">{{ label }}</a>
    <div v-if="shownUrl" class="av2eb__url">
      Or paste this link into your browser: <span>{{ shownUrl }}</span>
    </div>
  </div>
</template>

<style scoped>
.av2eb { margin: 6px 0 20px; }
.av2eb__btn {
  display: inline-block;
  padding: 10px 22px;
  border-radius: var(--ds-radius-button);
  background: var(--ds-color-background-brand-bold);
  color: var(--ds-color-text-inverse);
  font-weight: 700;
  font-size: 0.9375rem;
  text-decoration: none;
}
.av2eb__url { margin-top: 10px; font-size: 0.8125rem; color: var(--ds-color-text-subtle); overflow-wrap: anywhere; }
.av2eb__url span { color: var(--ds-color-link); }
</style>
