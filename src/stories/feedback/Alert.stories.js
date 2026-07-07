/** FEEDBACK / Alert → Quasar: QBanner (inline; wrap as PrestoAlert severity API) */
export default {
  title: 'Components/Feedback & Status/Alert',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
Inline, in-context message about the state of a task or region (not a global toast).
Each alert pairs a bold **title** with a muted **description** and a severity icon.

## When to use
- Form-level errors, inline warnings, contextual info tied to a section.

## When not to use
- Transient action confirmation → **Snackbar**. Page-wide announcement → **Banner**.

## Severity styling
Each severity is **tinted with its hue** — a soft \`background.*\` surface, a
matching \`background.*-bold\` border, and a \`text.*\` accent on the icon + title.
The same hue convention is shared by **Snackbar** and **Toast**.
- **Default** — neutral surface + border (no hue).
- **Success** — emerald tint. **Info** — blue tint. **Warning** — amber tint. **Error** — rose/danger tint.

## Quasar mapping
\`Alert → QBanner\` (inline). Recommended wrapper \`PrestoAlert\` mapping
\`severity\` → icon + color tokens.
` } } },
}

// Severity → token map. Each severity is tinted with its hue: `bg` is the soft
// `background.*` surface, `border` the `background.*-bold` step, `accent` the
// `text.*` color (icon + title). Body stays subtle except error (also danger).
const SEV = {
  default: { icon: null,                   accent: 'var(--ds-color-text)',         bg: 'var(--ds-color-surface)',            border: 'var(--ds-color-border)',                  body: 'var(--ds-color-text-subtle)' },
  success: { icon: 'check_circle_outline', accent: 'var(--ds-color-text-success)', bg: 'var(--ds-color-background-success)',  border: 'var(--ds-color-background-success-bold)', body: 'var(--ds-color-text-subtle)' },
  info:    { icon: 'info',                 accent: 'var(--ds-color-text-info)',    bg: 'var(--ds-color-background-info)',     border: 'var(--ds-color-background-info-bold)',    body: 'var(--ds-color-text-subtle)' },
  warning: { icon: 'warning_amber',        accent: 'var(--ds-color-text-warning)', bg: 'var(--ds-color-background-warning)',  border: 'var(--ds-color-background-warning-bold)', body: 'var(--ds-color-text-subtle)' },
  error:   { icon: 'error_outline',        accent: 'var(--ds-color-text-danger)',  bg: 'var(--ds-color-background-danger)',   border: 'var(--ds-color-background-danger-bold)',  body: 'var(--ds-color-text-danger)' },
}

const alert = (severity, title, body, { action } = {}) => {
  const s = SEV[severity]
  const icon = s.icon
    ? `<q-icon name="${s.icon}" size="20px" style="color:${s.accent};margin-top:1px;flex:none" />`
    : ''
  const btn = action
    ? `<q-btn unelevated no-caps label="${action}" style="align-self:center;flex:none;background:var(--ds-color-text);color:#fff;border-radius:var(--ds-radius-pill);font-weight:600;padding:6px 18px" />`
    : ''
  return `
    <div style="display:flex;align-items:flex-start;gap:12px;max-width:560px;padding:14px 16px;background:${s.bg};border:1px solid ${s.border};border-radius:12px;margin-bottom:12px">
      ${icon}
      <div style="flex:1;min-width:0">
        <div style="font-weight:600;font-size:15px;line-height:1.3;color:${s.accent}">${title}</div>
        <div style="font-size:14px;line-height:1.45;color:${s.body};margin-top:2px">${body}</div>
      </div>
      ${btn}
    </div>`
}

export const Severities = {
  render: () => ({ template: `
    <div>
      ${alert('error', 'Payment failed', 'Your payment could not be processed. Please check your payment method and try again.')}
      ${alert('warning', 'Your subscription will expire in 3 days.', 'Renew now to avoid service interruption or upgrade to a paid plan to continue using the service.')}
      ${alert('success', 'Payment successful', 'Your payment of $29.99 has been processed. A receipt has been sent to your email address.')}
      ${alert('info', 'New feature available', "We've added dark mode support. You can enable it in your account settings.")}
    </div>` }),
}

export const WithAction = {
  render: () => ({ template: `
    <div>
      ${alert('default', 'Dark mode is now available', 'Enable it under your profile settings to get started.', { action: 'Enable' })}
    </div>` }),
}
