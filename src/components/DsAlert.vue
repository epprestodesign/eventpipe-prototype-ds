<script setup>
// DsAlert — the inline, in-context message (Components › Feedback & Status ›
// Alert): a severity icon, a bold title and a muted description, tinted with
// the severity's hue. Use it for form-level errors and section-scoped notices;
// page-wide announcements are Banner, transient feedback is Snackbar / Toast.
//
// Each severity is tinted with its hue — a soft `background.*` surface, the
// matching `background.*-bold` border and a `text.*` accent on the icon and
// title. The description stays subtle, except on error where it is danger too.
//
// Error and warning are announced (role="alert"); the rest are polite status
// messages. The description can be the `description` prop or the default slot
// (for links or a list); an optional `action` slot sits on the right.
import { computed } from 'vue'

const props = defineProps({
  severity: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'success', 'info', 'warning', 'error'].includes(v),
  },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
})

const ICONS = { default: null, success: 'check_circle_outline', info: 'info', warning: 'warning_amber', error: 'error_outline' }
const icon = computed(() => ICONS[props.severity])
const role = computed(() => (['error', 'warning'].includes(props.severity) ? 'alert' : 'status'))
</script>

<template>
  <div class="dsalert" :class="`dsalert--${severity}`" :role="role">
    <q-icon v-if="icon" :name="icon" size="20px" class="dsalert__icon" aria-hidden="true" />
    <div class="dsalert__body">
      <div v-if="title" class="dsalert__title">{{ title }}</div>
      <div v-if="description || $slots.default" class="dsalert__desc"><slot>{{ description }}</slot></div>
    </div>
    <div v-if="$slots.action" class="dsalert__action"><slot name="action" /></div>
  </div>
</template>

<style scoped>
.dsalert {
  --dsalert-accent: var(--ds-color-text);
  --dsalert-bg: var(--ds-color-surface);
  --dsalert-border: var(--ds-color-border);
  --dsalert-body: var(--ds-color-text-subtle);
  display: flex; align-items: flex-start; gap: 12px;
  padding: 14px 16px;
  background: var(--dsalert-bg);
  border: 1px solid var(--dsalert-border);
  border-radius: 12px;
}
.dsalert--success { --dsalert-accent: var(--ds-color-text-success); --dsalert-bg: var(--ds-color-background-success); --dsalert-border: var(--ds-color-background-success-bold); }
.dsalert--info    { --dsalert-accent: var(--ds-color-text-info);    --dsalert-bg: var(--ds-color-background-info);    --dsalert-border: var(--ds-color-background-info-bold); }
.dsalert--warning { --dsalert-accent: var(--ds-color-text-warning); --dsalert-bg: var(--ds-color-background-warning); --dsalert-border: var(--ds-color-background-warning-bold); }
.dsalert--error   { --dsalert-accent: var(--ds-color-text-danger);  --dsalert-bg: var(--ds-color-background-danger);  --dsalert-border: var(--ds-color-background-danger-bold); --dsalert-body: var(--ds-color-text-danger); }
.dsalert__icon { color: var(--dsalert-accent); flex: none; margin-top: 1px; }
.dsalert__body { flex: 1; min-width: 0; }
.dsalert__title { font-weight: 600; font-size: 15px; line-height: 1.3; color: var(--dsalert-accent); }
.dsalert__desc { font-size: 14px; line-height: 1.45; color: var(--dsalert-body); }
.dsalert__title + .dsalert__desc { margin-top: 2px; }
.dsalert__desc :deep(ul) { margin: 4px 0 0; padding-left: 18px; }
.dsalert__action { align-self: center; flex: none; }
</style>
