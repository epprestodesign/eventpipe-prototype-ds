<script setup>
/* Av2ViewLockedEmail — the address the code was sent to, shown locked above
 * the code input (Attio's greyed email row), with a "Change" link back to the
 * email step. Not an input: nothing here is editable, and a read-only field
 * would still be a tab stop that does nothing. The only interactive part is
 * "Change".
 */
defineProps({
  email: { type: String, required: true },
  changeHref: { type: String, default: '#' },
})
</script>

<template>
  <div class="av2vle">
    <q-icon name="mail_outline" size="18px" class="av2vle__icon" aria-hidden="true" />
    <span class="av2vle__email"><span class="av2vle__sr">Code sent to </span>{{ email }}</span>
    <a :href="changeHref" class="av2vle__change" :aria-label="`Change email address, ${email}`">Change</a>
  </div>
</template>

<style scoped>
.av2vle {
  display: flex; align-items: center; gap: 10px;
  height: 40px; padding: 0 12px;
  border: 1px solid var(--ds-color-border);
  border-radius: var(--ds-radius-md);
  background: var(--ds-color-surface-sunken);
}
.av2vle__icon { flex: none; color: var(--ds-color-icon-subtle); }
.av2vle__email {
  flex: 1; min-width: 0; font-size: 0.9375rem; color: var(--ds-color-text-subtle);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.av2vle__sr {
  position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}
.av2vle__change {
  flex: none; font-size: 0.875rem; font-weight: 600;
  color: var(--ds-color-link); text-decoration: none;
  border-radius: var(--ds-radius-sm);
}
.av2vle__change:hover { text-decoration: underline; }
.av2vle__change:focus-visible { outline: 2px solid var(--ds-color-border-focused); outline-offset: 2px; }
</style>
