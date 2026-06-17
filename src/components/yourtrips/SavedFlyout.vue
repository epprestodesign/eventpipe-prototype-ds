<script setup>
// SavedFlyout — the right-side slide-over that brings in "Saved Hotels" when a
// hotel is bookmarked (mirrors the cart fly-out chrome: scrim + sliding panel).
// Controlled via v-model; renders the recyclable <SavedItems> body and bubbles
// its `remove` so the parent owns the saved list.
import SavedItems from './SavedItems.vue'

defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'Saved Hotels' },
  items: { type: Array, default: () => [] },
})
const emit = defineEmits(['update:modelValue', 'remove'])
const close = () => emit('update:modelValue', false)
</script>

<template>
  <teleport to="body">
    <div v-if="modelValue" class="sf">
      <div class="sf__scrim" @click="close" />
      <aside class="sf__panel" role="dialog" aria-label="Saved hotels">
        <div class="sf__top">
          <button class="sf__close" aria-label="Close" @click="close"><q-icon name="close" size="22px" /></button>
        </div>
        <div class="sf__body">
          <saved-items :title="title" :items="items" @remove="emit('remove', $event)" />
        </div>
      </aside>
    </div>
  </teleport>
</template>

<style scoped>
.sf { position: fixed; inset: 0; z-index: 3000; }
.sf__scrim { position: absolute; inset: 0; background: rgba(9, 9, 11, 0.5); animation: sf-fade 0.18s ease; }
.sf__panel { position: absolute; top: 0; right: 0; height: 100%; width: 500px; max-width: 92vw; background: var(--ds-color-surface); display: flex; flex-direction: column; box-shadow: var(--ds-shadow-4, 0 12px 32px rgba(0,0,0,0.18)); animation: sf-slide 0.22s var(--ds-ease-standard); }
@keyframes sf-fade { from { opacity: 0; } }
@keyframes sf-slide { from { transform: translateX(100%); } }

.sf__top { display: flex; align-items: center; padding: 12px 16px; flex: none; }
.sf__close { width: 36px; height: 36px; border: 0; border-radius: 50%; background: var(--ds-palette-zinc-100); color: var(--ds-color-text); cursor: pointer; display: flex; align-items: center; justify-content: center; }
.sf__close:hover { background: var(--ds-palette-zinc-200); }

.sf__body { flex: 1; overflow-y: auto; padding: 4px 24px 28px; }
.sf__body :deep(.sv) { max-width: 100%; }

@media (max-width: 520px) { .sf__panel { width: 100vw; } }
</style>
