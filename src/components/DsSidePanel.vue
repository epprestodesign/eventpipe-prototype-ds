<script setup>
// DsSidePanel — the standard slide-over chrome: a dimmed scrim + a panel that
// slides in from a side, with a header (title + close), scrollable body, and an
// optional footer. Standardizes the cart fly-out, saved-hotels fly-out, and the
// profile edit modal. Controlled via v-model.
import { watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  side: { type: String, default: 'right' },   // right | left | center (full-height sheet)
  title: { type: String, default: '' },
  ariaLabel: { type: String, default: '' },   // accessible label when there's no visible title
  width: { type: String, default: '500px' },
  persistent: { type: Boolean, default: false }, // clicking the scrim won't close
})
const emit = defineEmits(['update:modelValue'])
const close = () => emit('update:modelValue', false)
const onScrim = () => { if (!props.persistent) close() }

// Esc to close + lock body scroll while open.
const onKey = (e) => { if (e.key === 'Escape' && !props.persistent) close() }
watch(() => props.modelValue, (open) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = open ? 'hidden' : ''
  if (open) document.addEventListener('keydown', onKey)
  else document.removeEventListener('keydown', onKey)
}, { immediate: true })
onBeforeUnmount(() => { if (typeof document !== 'undefined') { document.body.style.overflow = ''; document.removeEventListener('keydown', onKey) } })
</script>

<template>
  <teleport to="body">
    <div v-if="modelValue" class="dsp" :class="`dsp--${side}`">
      <div class="dsp__scrim" @click="onScrim" />
      <aside class="dsp__panel" role="dialog" aria-modal="true" :aria-label="ariaLabel || title || 'Panel'" :style="{ width }">
        <header class="dsp__head">
          <button class="dsp__close" aria-label="Close" @click="close"><q-icon name="close" size="22px" /></button>
          <h2 v-if="title" class="dsp__title">{{ title }}</h2>
          <span class="dsp__headend"><slot name="header-end" /></span>
        </header>
        <div class="dsp__body"><slot /></div>
        <footer v-if="$slots.footer" class="dsp__foot"><slot name="footer" /></footer>
      </aside>
    </div>
  </teleport>
</template>

<style scoped>
.dsp { position: fixed; inset: 0; z-index: 3000; }
.dsp__scrim { position: absolute; inset: 0; background: rgba(9, 9, 11, 0.5); animation: dsp-fade 0.18s ease; }
.dsp__panel { position: absolute; top: 0; height: 100%; max-width: 100vw; background: var(--ds-color-surface); display: flex; flex-direction: column; box-shadow: var(--ds-shadow-4, 0 24px 60px rgba(0, 0, 0, 0.25)); }
.dsp--right .dsp__panel { right: 0; animation: dsp-slide-r 0.22s var(--ds-ease-standard); }
.dsp--left .dsp__panel { left: 0; animation: dsp-slide-l 0.22s var(--ds-ease-standard); }
.dsp--center .dsp__panel { left: 50%; transform: translateX(-50%); animation: dsp-rise 0.2s var(--ds-ease-standard); }
@keyframes dsp-fade { from { opacity: 0; } }
@keyframes dsp-slide-r { from { transform: translateX(100%); } }
@keyframes dsp-slide-l { from { transform: translateX(-100%); } }
@keyframes dsp-rise { from { transform: translate(-50%, 1.5%); opacity: 0.6; } }

.dsp__head { display: flex; align-items: center; gap: 12px; padding: 12px 16px; flex: none; }
.dsp__close { width: 36px; height: 36px; flex: none; border: 0; border-radius: 50%; background: var(--ds-palette-graphite-100); color: var(--ds-color-text); cursor: pointer; display: flex; align-items: center; justify-content: center; }
.dsp__close:hover { background: var(--ds-palette-graphite-200); }
.dsp__title { flex: 1; min-width: 0; margin: 0; font-size: 1.25rem; font-weight: 800; color: var(--ds-color-text); }
.dsp__headend { flex: none; }

.dsp__body { flex: 1; overflow-y: auto; padding: 4px 24px 24px; }
.dsp__foot { flex: none; border-top: 1px solid var(--ds-color-border); padding: 16px 24px; background: var(--ds-color-surface); }

@media (max-width: 520px) { .dsp__panel { width: 100vw !important; } }
</style>
