<script setup>
// DsActionMenu — the "⋮" overflow button and the menu of actions behind it.
// Used for row actions in tables and for secondary actions in page headers.
//
// ONE size, on purpose: 40×40, the design system's standard control height,
// so it lines up with the buttons beside it in headers and toolbars and never
// drifts between screens (before this component existed EP Pay had three
// different sizes built three different ways). There is no size prop.
//
// Items: [{ label, icon?, danger?, disabled?, dividerBefore?,
//           copy?: 'text to copy',
//           confirm?: { title, message, okLabel },
//           ...anything else the caller wants back }]
// - `copy` copies the text and shows a "Copied" toast.
// - `confirm` asks first (Quasar Dialog); the item is only selected on OK.
//   Use it for anything destructive (Refund, Void, Delete…).
// Picking an item emits `select(item)` and also dispatches a bubbling
// `ds-action-select` DOM event (detail = the item, plus `handled: 'copy' |
// 'confirm'` when a built-in behaviour ran), so a page can handle every menu
// on it in one place without wiring each row.
import { ref } from 'vue'
import { Dialog, Notify, copyToClipboard } from 'quasar'

const props = defineProps({
  items: { type: Array, required: true },
  /** Accessible name, e.g. "Actions for TXN-2026-16006". Required: the button
   *  is icon-only. */
  label: { type: String, required: true },
  icon: { type: String, default: 'more_vert' },
  disabled: { type: Boolean, default: false },
})
const emit = defineEmits(['select'])

const root = ref(null)
const open = ref(false)

function done(item, handled) {
  const detail = handled ? { ...item, handled } : item
  emit('select', detail)
  root.value?.dispatchEvent(new CustomEvent('ds-action-select', { bubbles: true, detail }))
}

function choose(item) {
  if (item.disabled) return
  if (item.copy) {
    copyToClipboard(item.copy)
      .then(() => Notify.create({ message: `Copied ${item.copy}`, icon: 'content_copy', timeout: 1600 }))
      .catch(() => Notify.create({ message: 'Couldn’t copy to the clipboard', type: 'negative', timeout: 2000 }))
    done(item, 'copy')
    return
  }
  if (item.confirm) {
    Dialog.create({
      title: item.confirm.title || item.label,
      message: item.confirm.message || '',
      cancel: { label: 'Cancel', flat: true, noCaps: true, color: 'grey-8' },
      ok: { label: item.confirm.okLabel || item.label, unelevated: true, noCaps: true, color: item.danger ? 'negative' : 'primary' },
      persistent: true,
    }).onOk(() => done(item, 'confirm'))
    return
  }
  done(item)
}
</script>

<template>
  <span ref="root" class="dsam">
    <q-btn
      flat :icon="icon" :disable="disabled" class="dsam__btn" padding="0"
      :aria-label="label" aria-haspopup="menu" :aria-expanded="String(open)"
      @click.stop
    >
      <q-menu v-model="open" anchor="bottom right" self="top right" :offset="[0, 4]" class="dsam__menu">
        <q-list role="menu" :aria-label="label" style="min-width: 208px;" class="q-py-xs">
          <template v-for="(it, i) in props.items" :key="it.key || it.label">
            <q-separator v-if="it.dividerBefore && i > 0" class="q-my-xs" />
            <q-item
              clickable v-close-popup role="menuitem" :disable="it.disabled"
              class="dsam__item" :class="{ 'dsam__item--danger': it.danger }"
              @click="choose(it)"
            >
              <q-item-section v-if="it.icon" avatar class="dsam__icon">
                <q-icon :name="it.icon" size="20px" />
              </q-item-section>
              <q-item-section>{{ it.label }}</q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-menu>
    </q-btn>
  </span>
</template>

<style scoped>
.dsam { display: inline-flex; }
/* Fixed 40×40 regardless of context (dense tables, headers, Quasar's own
   dense/size modifiers) — the whole point of the component. */
.dsam__btn.q-btn {
  width: 40px; height: 40px; min-width: 40px; min-height: 40px;
  border: 1px solid var(--ds-color-border-container);
  border-radius: var(--ds-radius-md);
  background: var(--ds-color-surface);
  color: var(--ds-color-icon-subtle);
}
.dsam__btn.q-btn:hover { background: var(--ds-color-surface-sunken); color: var(--ds-color-text); }
.dsam__btn.q-btn[aria-expanded='true'] { border-color: var(--ds-color-border-focused); color: var(--ds-color-text); }
.dsam__btn :deep(.q-icon) { font-size: 22px; }
.dsam__item { min-height: 40px; font-size: 0.9375rem; color: var(--ds-color-text); }
.dsam__icon { min-width: 32px; padding-right: 8px; color: var(--ds-color-icon-subtle); }
.dsam__item--danger, .dsam__item--danger .dsam__icon { color: var(--ds-color-text-danger); }
</style>
