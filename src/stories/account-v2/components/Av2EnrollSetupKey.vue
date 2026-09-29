<script setup>
/* Av2EnrollSetupKey — the "Can't scan the code?" disclosure.
 *
 * Collapsed by default, because the QR is the path almost everyone takes and an
 * always-visible secret string competes with it for attention. Open, it shows
 * the same secret the QR encodes, grouped in fours with a copy button.
 *
 * It has to exist: a desktop-only setup step cannot be scanned by the
 * phone of a user whose camera is broken, whose authenticator lives in a
 * password manager on the *same* machine, or who is on a locked-down device
 * with no camera permission. Without the manual key those users cannot enrol
 * at all. Klaviyo's older login is the in-repo precedent for the collapsed
 * disclosure as the pattern for a secondary path (references, Appendix).
 */
import { ref } from 'vue'

const props = defineProps({
  /** Base32 TOTP secret. Grouped for reading, copied ungrouped. */
  secret: { type: String, required: true },
})

const open = ref(false)
const copied = ref(false)

/** Grouped in fours: a 32-character unbroken string is unreadable and
 *  mistranscribing one character produces a silent, confusing failure later. */
const grouped = (props.secret.match(/.{1,4}/g) || []).join(' ')

function copy() {
  // Clipboard access throws in an insecure context and in some iframes; a
  // failed copy must not take the disclosure down with it.
  try {
    navigator.clipboard?.writeText(props.secret)
  } catch (_err) { /* the key is on screen — the user can still select it */ }
  copied.value = true
  setTimeout(() => { copied.value = false }, 1800)
}
</script>

<template>
  <div class="av2key">
    <button type="button" class="av2key__toggle" :aria-expanded="open" @click="open = !open">
      <q-icon :name="open ? 'expand_less' : 'expand_more'" size="18px" />
      <span>Can't scan the code?</span>
    </button>

    <div v-if="open" class="av2key__body">
      <p class="av2key__hint">
        In your authenticator app choose <strong>Enter a setup key</strong> and type this in.
        The account name is your EventPipe email.
      </p>
      <div class="av2key__row">
        <code class="av2key__code">{{ grouped }}</code>
        <q-btn flat dense no-caps color="primary" class="av2key__copy"
          :icon="copied ? 'check' : 'content_copy'"
          :label="copied ? 'Copied' : 'Copy'" @click="copy" />
      </div>
      <p class="av2key__hint av2key__hint--tight">
        Time-based, 6 digits, 30-second interval — the defaults in every authenticator app.
      </p>
    </div>
  </div>
</template>

<style scoped>
.av2key { margin-top: 18px; border-top: 1px solid var(--ds-color-border); padding-top: 14px; }

.av2key__toggle {
  display: flex; align-items: center; gap: 6px;
  width: 100%; padding: 0; background: none; border: 0; cursor: pointer;
  font: inherit; font-size: 0.875rem; font-weight: 500; color: var(--ds-color-link);
}
.av2key__toggle:hover span { text-decoration: underline; }

.av2key__body { margin-top: 12px; }
.av2key__hint { margin: 0 0 10px; font-size: 0.8125rem; line-height: 1.55; color: var(--ds-color-text-subtle); }
.av2key__hint--tight { margin: 10px 0 0; font-size: 0.75rem; color: var(--ds-color-text-subtlest); }

.av2key__row {
  display: flex; align-items: center; gap: 8px;
  background: var(--ds-color-surface-sunken);
  border: 1px solid var(--ds-color-border);
  border-radius: var(--ds-radius-md); padding: 10px 8px 10px 12px;
}
.av2key__code {
  flex: 1;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.9375rem; letter-spacing: 0.02em;
  color: var(--ds-color-text); word-break: break-all;
}
/* Fixed width so the label swapping to "Copied" does not shove the key. */
.av2key__copy { min-width: 96px; }
</style>
