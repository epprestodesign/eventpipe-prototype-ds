<script setup>
// DsModal — the design system's canonical centered modal/dialog shell. Every
// centered dialog (Availability, All Filters, payment, profile, map…) shares the
// same plumbing: a fixed backdrop, a centered surface card, a header with a
// close button, ESC-to-close, click-outside-to-close, body scroll-lock, and a
// full-screen collapse on mobile. DsModal owns all of that so feature dialogs
// only describe their content.
//
// Usage:
//   <ds-modal v-model="open" title="Availability" size="lg"> …body… </ds-modal>
// Slots: default (body), #header (replace the title block), #footer (sticky bar).
import { computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  ariaLabel: { type: String, default: '' },
  // sm 440 · md 600 · lg 1040 · xl 1200 · fullscreen (tall, near-viewport)
  size: { type: String, default: 'md' },
  headerAlign: { type: String, default: 'left' }, // left | center
  hideHeader: { type: Boolean, default: false },
  hideClose: { type: Boolean, default: false },
  // persistent: clicking the backdrop / pressing ESC will NOT close the modal.
  persistent: { type: Boolean, default: false },
  // flush: remove body padding (e.g. a map or media that bleeds to the edges).
  flush: { type: Boolean, default: false },
  zIndex: { type: [Number, String], default: 3500 },
})
const emit = defineEmits(['update:modelValue', 'close'])

const ariaLabelComputed = computed(() => props.ariaLabel || props.title || 'Dialog')

function close () {
  emit('update:modelValue', false)
  emit('close')
}
function onBackdrop () { if (!props.persistent) close() }

const onKey = (e) => { if (e.key === 'Escape' && !props.persistent && props.modelValue) close() }

function lockScroll (locked) {
  if (typeof document === 'undefined') return
  document.body.style.overflow = locked ? 'hidden' : ''
}
watch(() => props.modelValue, lockScroll)
onMounted(() => {
  document.addEventListener('keydown', onKey)
  if (props.modelValue) lockScroll(true)
})
onBeforeUnmount(() => { document.removeEventListener('keydown', onKey); lockScroll(false) })
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="dsm" :style="{ zIndex }" @click.self="onBackdrop">
      <div class="dsm__card" :class="`dsm__card--${size}`" role="dialog" aria-modal="true" :aria-label="ariaLabelComputed">
        <header v-if="!hideHeader" class="dsm__head" :class="`dsm__head--${headerAlign}`">
          <button v-if="!hideClose && headerAlign === 'center'" type="button" class="dsm__close" aria-label="Close" @click="close"><q-icon name="close" size="22px" /></button>
          <div class="dsm__titles">
            <slot name="header">
              <h2 v-if="title" class="dsm__title">{{ title }}</h2>
              <p v-if="subtitle" class="dsm__sub">{{ subtitle }}</p>
            </slot>
          </div>
          <button v-if="!hideClose && headerAlign !== 'center'" type="button" class="dsm__close" aria-label="Close" @click="close"><q-icon name="close" size="22px" /></button>
        </header>

        <div class="dsm__body" :class="{ 'dsm__body--flush': flush }">
          <slot />
        </div>

        <footer v-if="$slots.footer" class="dsm__foot">
          <slot name="footer" :close="close" />
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.dsm { position: fixed; inset: 0; background: rgba(9, 9, 11, 0.55); display: flex; align-items: center; justify-content: center; padding: 28px; }
.dsm__card { display: flex; flex-direction: column; width: 100%; max-height: 92vh; background: var(--ds-color-surface); border-radius: var(--ds-radius-lg); box-shadow: var(--ds-shadow-4); overflow: hidden; }

.dsm__card--sm { max-width: 440px; }
.dsm__card--md { max-width: 600px; }
.dsm__card--lg { max-width: 1040px; }
.dsm__card--xl { max-width: 1200px; }
.dsm__card--fullscreen { max-width: min(1200px, 96vw); height: min(840px, 92vh); }

/* Header — left layout (title left, close right) or center layout (close left). */
.dsm__head { display: flex; align-items: center; gap: 12px; padding: 14px 18px; border-bottom: 1px solid var(--ds-color-border); flex: none; }
.dsm__head--center { position: relative; justify-content: center; }
.dsm__titles { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.dsm__head--left .dsm__titles { flex: 1; }
.dsm__title { font-size: 1.1875rem; font-weight: 700; margin: 0; color: var(--ds-color-text); line-height: 1.25; }
.dsm__sub { margin: 0; font-size: 0.8125rem; color: var(--ds-color-text-subtle); }

.dsm__close { width: 38px; height: 38px; flex: none; border: 0; border-radius: 50%; background: var(--ds-palette-graphite-100); color: var(--ds-color-text); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.12s ease; }
.dsm__close:hover { background: var(--ds-palette-graphite-200); }
.dsm__head--center .dsm__close { position: absolute; left: 12px; background: none; }
.dsm__head--center .dsm__close:hover { background: var(--ds-palette-graphite-100); }

.dsm__body { position: relative; flex: 1 1 auto; min-height: 0; overflow-y: auto; padding: 20px; }
.dsm__body--flush { padding: 0; overflow: hidden; }

.dsm__foot { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 20px; border-top: 1px solid var(--ds-color-border); flex: none; }

@media (max-width: 640px) {
  .dsm { padding: 0; }
  .dsm__card, .dsm__card--fullscreen { max-width: 100%; width: 100%; height: 100%; max-height: 100%; border-radius: 0; }
}
</style>
