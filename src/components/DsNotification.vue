<script setup>
// DsNotification — a rich notification "card" in the Untitled-UI mold: a featured
// icon, a title, supporting description text, an optional row of actions, and a
// close button. Use it inline in a page (stacked notification lists, banners) OR
// as the content of a floating toast. Color variants map to the same semantic DS
// tokens as Alerts / Toast (success / info / warning / error) plus a neutral
// default. For brief imperative confirmations, the Toast (Quasar Notify) pattern
// is lighter; reach for DsNotification when you need a title + description + actions.
import { computed } from 'vue'

const props = defineProps({
  // Semantic color + default icon.
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'success', 'info', 'warning', 'error'].includes(v),
  },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  // Override the per-variant default icon (any Material Icons name).
  icon: { type: String, default: '' },
  // Show the leading featured icon (tinted circle).
  featuredIcon: { type: Boolean, default: true },
  // Show the ✕ close button.
  closable: { type: Boolean, default: true },
  // Drop the card shadow (for embedding inline in an already-bordered surface).
  flat: { type: Boolean, default: false },
})
const emit = defineEmits(['close'])

// variant → { icon, token-suffix }. `suffix` maps onto the DS background/text
// token families (background-<suffix>, text-<suffix>). `default` is neutral.
const MAP = {
  default: { icon: 'notifications', suffix: null },
  success: { icon: 'check_circle', suffix: 'success' },
  info: { icon: 'info', suffix: 'info' },
  warning: { icon: 'warning', suffix: 'warning' },
  error: { icon: 'error', suffix: 'danger' },
}
const cfg = computed(() => MAP[props.variant] || MAP.default)
const iconName = computed(() => props.icon || cfg.value.icon)
// Featured-icon tint: variant surface + accent, or a neutral sunken chip.
const featStyle = computed(() => {
  const s = cfg.value.suffix
  return s
    ? { background: `var(--ds-color-background-${s})`, color: `var(--ds-color-text-${s})` }
    : { background: 'var(--ds-color-surface-sunken)', color: 'var(--ds-color-text-subtle)' }
})
</script>

<template>
  <div class="dsn" :class="{ 'dsn--flat': flat }" role="status">
    <div v-if="featuredIcon" class="dsn__feat" :style="featStyle">
      <q-icon :name="iconName" size="22px" />
    </div>

    <div class="dsn__body">
      <div v-if="title" class="dsn__title">{{ title }}</div>
      <div v-if="description || $slots.default" class="dsn__desc">
        <slot>{{ description }}</slot>
      </div>
      <div v-if="$slots.actions" class="dsn__actions">
        <slot name="actions" />
      </div>
    </div>

    <q-btn v-if="closable" flat round dense icon="close" size="sm" class="dsn__close"
      color="grey-6" @click="emit('close')">
      <q-tooltip>Dismiss</q-tooltip>
    </q-btn>
  </div>
</template>

<style scoped>
.dsn {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  min-width: 320px;
  max-width: 440px;
  background: var(--ds-color-surface);
  border: 1px solid var(--ds-color-border-container);
  border-radius: var(--ds-radius-md);
  box-shadow: var(--ds-shadow-card);
}
.dsn--flat { box-shadow: none; }
.dsn__feat {
  flex: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dsn__body { flex: 1 1 auto; min-width: 0; }
.dsn__title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--ds-color-text);
  line-height: 1.35;
}
.dsn__desc {
  margin-top: 2px;
  font-size: 0.875rem;
  color: var(--ds-color-text-subtle);
  line-height: 1.45;
  overflow-wrap: anywhere;
}
.dsn__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}
.dsn__close { flex: none; margin: -4px -4px 0 0; }
</style>
