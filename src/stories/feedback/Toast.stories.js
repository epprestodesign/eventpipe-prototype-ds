// FEEDBACK / Toast — Quasar's Notify plugin styled to the DS. Color variants map
// to Quasar's semantic types (positive/negative/warning/info) but use our
// palette + radius via the `.ds-toast` classes in src/css/app.scss.
import { useQuasar } from 'quasar'

export default {
  title: 'Components/Feedback & Status/Toast',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
A **Toast** is a brief, auto-dismissing message confirming an action or surfacing
a status. It's Quasar's **Notify** plugin (imperative — no component to render),
restyled to DS tokens via shared classes so every toast matches the system.

## Usage
\`\`\`js
import { useQuasar } from 'quasar'
const $q = useQuasar()
$q.notify({
  message: 'Saved successfully.',
  icon: 'check_circle',
  classes: 'ds-toast ds-toast--success', // DS look
  position: 'bottom',
  timeout: 2600,
})
\`\`\`

## Color variants
Tinted with the same **hue convention as Alerts** — a soft \`background.*\`
surface, a matching \`background.*-bold\` border, and a \`text.*\` accent on the
icon + message:

| Variant | Class | Use |
| --- | --- | --- |
| Default | \`ds-toast--default\` | Neutral status (surface) |
| Success | \`ds-toast--success\` | Completed action (Emerald) |
| Info | \`ds-toast--info\` | Informational (Blue) |
| Warning | \`ds-toast--warning\` | Caution (Amber) |
| Error | \`ds-toast--error\` | Failure (Rose) |

## Guidance
- Keep it short and action-oriented ("Saved", "Removed").
- Use **Error** for failures and let them linger longer.
- Offer **Undo** for destructive actions instead of a confirm dialog.
` } } },
}

const VARIANTS = [
  { key: 'default', label: 'Default', icon: 'notifications', message: 'Here’s a quick update.' },
  { key: 'success', label: 'Success', icon: 'check_circle', message: 'Your changes were saved.' },
  { key: 'info', label: 'Info', icon: 'info', message: 'New rates are available for your dates.' },
  { key: 'warning', label: 'Warning', icon: 'warning', message: 'Double-check your details before continuing.' },
  { key: 'error', label: 'Error', icon: 'error', message: 'Something went wrong. Try again.' },
]

const fire = ($q, v) => $q.notify({
  message: v.message,
  icon: v.icon,
  classes: `ds-toast ds-toast--${v.key}`,
  position: 'bottom',
  timeout: 2600,
})

/** All color variants — click to fire each toast. */
export const Variants = {
  render: () => ({
    setup() {
      const $q = useQuasar()
      return { variants: VARIANTS, show: (v) => fire($q, v) }
    },
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:12px;padding:24px">
        <button v-for="v in variants" :key="v.key" @click="show(v)"
          style="display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 18px;border:1px solid var(--ds-color-border-bold);border-radius:var(--ds-radius-pill);background:var(--ds-color-surface);color:var(--ds-color-text);font-weight:600;cursor:pointer">
          <span class="material-icons" style="font-size:20px">{{ v.icon }}</span> {{ v.label }}
        </button>
      </div>`,
  }),
}

/** A success toast with an Undo action (DS styled). */
export const WithAction = {
  render: () => ({
    setup() {
      const $q = useQuasar()
      // Same layout/config as Snackbar → Variants → "With Undo": bottom, 4s,
      // progress bar + an Undo action. Undo uses a visible accent color (the
      // light DS toast needs dark/brand text, not white).
      const remove = () => $q.notify({
        message: 'Hotel removed from your saves.',
        icon: 'delete',
        classes: 'ds-toast ds-toast--default',
        position: 'bottom',
        timeout: 4000,
        progress: true,
        actions: [{ label: 'Undo', color: 'primary', handler: () => {} }],
      })
      return { remove }
    },
    template: `<div style="padding:24px"><q-btn unelevated no-caps color="primary" label="Remove (with Undo)" @click="remove" /></div>`,
  }),
}
