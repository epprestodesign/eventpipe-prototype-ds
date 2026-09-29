<script setup>
/* Av2SupportModal — "We're here to help", opened from "Get support" in the
 * top bar of every auth step (Av2TopBar, via Av2Split).
 *
 * DsModal (small) with the header slot carrying an info icon in a tinted
 * circle — the DsNotification featured-icon treatment — so the dialog reads
 * as help, not as a warning. One contact route: an email row with a copy
 * button. The copy button swaps to a check + "Copied" and says so through a
 * polite live region, because a clipboard write is otherwise invisible to
 * screen-reader users (and to everyone else, frankly).
 *
 * The address is SUPPORT_EMAIL from _account.js (support@eventpipe.com) — a
 * placeholder until the right inbox for staff sign-in help is confirmed.
 */
import { ref, onBeforeUnmount } from 'vue'
import DsModal from '../../../components/DsModal.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  email: { type: String, required: true },
})
defineEmits(['update:modelValue'])

const copied = ref(false)
let resetTimer = null

async function copy () {
  try {
    await navigator.clipboard.writeText(props.email)
  } catch {
    // Clipboard can be refused (permissions, insecure context). The address is
    // on screen and selectable either way; the confirmation still shows so the
    // prototype demonstrates the state.
  }
  copied.value = true
  clearTimeout(resetTimer)
  resetTimer = setTimeout(() => { copied.value = false }, 2000)
}
onBeforeUnmount(() => clearTimeout(resetTimer))
</script>

<template>
  <DsModal :model-value="modelValue" size="sm" aria-label="We're here to help"
    @update:model-value="$emit('update:modelValue', $event)">
    <template #header>
      <div class="av2sm__head">
        <span class="av2sm__feat" aria-hidden="true"><q-icon name="info" size="22px" /></span>
        <h2 class="av2sm__title">We're here to help</h2>
      </div>
    </template>

    <p class="av2sm__lead">
      Having trouble signing in, or a code that never arrived? Write to us and
      the EventPipe support team will get back to you.
    </p>

    <div class="av2sm__row">
      <q-icon name="mail_outline" size="22px" class="av2sm__icon" aria-hidden="true" />
      <div class="av2sm__text">
        <div class="av2sm__label">Send us an email</div>
        <a class="av2sm__email" :href="`mailto:${email}`">{{ email }}</a>
      </div>
      <q-btn flat no-caps dense color="primary" class="av2sm__copy"
        :icon="copied ? 'check' : 'content_copy'" :label="copied ? 'Copied' : ''"
        :aria-label="copied ? 'Email address copied' : 'Copy email address'"
        @click="copy">
        <q-tooltip v-if="!copied">Copy email address</q-tooltip>
      </q-btn>
    </div>
    <span class="av2sm__sr" aria-live="polite">{{ copied ? 'Email address copied to clipboard' : '' }}</span>
  </DsModal>
</template>

<style scoped>
.av2sm__head { display: flex; align-items: center; gap: 12px; }
.av2sm__feat {
  width: 40px; height: 40px; flex: none; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: var(--ds-color-background-info); color: var(--ds-color-text-info);
}
.av2sm__title { margin: 0; font-size: 1.1875rem; font-weight: 700; color: var(--ds-color-text); line-height: 1.25; }
.av2sm__lead { margin: 0 0 16px; font-size: 0.9375rem; line-height: 1.55; color: var(--ds-color-text-subtle); }
.av2sm__row {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 12px 12px 16px;
  background: var(--ds-color-surface-sunken);
  border: 1px solid var(--ds-color-border-container);
  border-radius: var(--ds-radius-md);
}
.av2sm__icon { color: var(--ds-color-icon-subtle); flex: none; }
.av2sm__text { flex: 1 1 auto; min-width: 0; }
.av2sm__label { font-size: 0.8125rem; font-weight: 700; color: var(--ds-color-text-subtle); }
.av2sm__email { font-size: 0.9375rem; color: var(--ds-color-link); text-decoration: none; overflow-wrap: anywhere; }
.av2sm__email:hover { text-decoration: underline; }
.av2sm__copy { flex: none; min-width: 36px; font-weight: 600; }
.av2sm__sr {
  position: absolute; width: 1px; height: 1px; overflow: hidden;
  clip: rect(0 0 0 0); white-space: nowrap;
}
</style>
