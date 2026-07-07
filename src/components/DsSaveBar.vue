<script setup>
// DsSaveBar — a sticky "unsaved changes" contextual save bar pinned to the bottom
// of an editing surface (the Discard / Save footer from Edit Event / Edit Refund
// Policy). Emits `save` and `discard`.
defineProps({
  message: { type: String, default: 'Unsaved changes' },
  saveLabel: { type: String, default: 'Save' },
  discardLabel: { type: String, default: 'Discard' },
  saving: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})
const emit = defineEmits(['save', 'discard'])
</script>

<template>
  <div class="dssb">
    <div class="dssb__inner">
      <span class="dssb__msg">{{ message }}</span>
      <div class="dssb__actions">
        <q-btn outline no-caps color="primary" :label="discardLabel" @click="emit('discard')" />
        <q-btn unelevated no-caps color="primary" :label="saveLabel" :loading="saving" :disable="disabled" @click="emit('save')" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dssb {
  position: sticky;
  bottom: 0;
  background: var(--ds-color-surface);
  border-top: 1px solid var(--ds-color-border);
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
}
.dssb__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  height: 60px;
  padding: 0 24px;
}
.dssb__msg { font-weight: 700; color: var(--ds-color-text); }
.dssb__actions { display: flex; gap: 10px; }
</style>
