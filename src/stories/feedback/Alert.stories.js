/** FEEDBACK / Alert → DsAlert (inline, severity-tinted) */
import DsAlert from '../../components/DsAlert.vue'

export default {
  title: 'Components/Feedback & Status/Alert',
  component: DsAlert,
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

## Component
\`<ds-alert severity="error" title="…" description="…" />\` — \`severity\` is
default · success · info · warning · error. Pass the description as a prop or
the default slot (for links or a list); an optional \`action\` slot sits on the
right. Error and warning use \`role="alert"\`, so they are announced.
` } } },
}

const DEMO = 'display:flex;flex-direction:column;gap:12px;max-width:560px'

export const Severities = {
  render: () => ({
    components: { DsAlert },
    template: `
      <div style="${DEMO}">
        <ds-alert severity="error" title="Payment failed" description="Your payment could not be processed. Please check your payment method and try again." />
        <ds-alert severity="warning" title="Your subscription will expire in 3 days." description="Renew now to avoid service interruption or upgrade to a paid plan to continue using the service." />
        <ds-alert severity="success" title="Payment successful" description="Your payment of $29.99 has been processed. A receipt has been sent to your email address." />
        <ds-alert severity="info" title="New feature available" description="We've added dark mode support. You can enable it in your account settings." />
      </div>`,
  }),
}

export const WithAction = {
  render: () => ({
    components: { DsAlert },
    template: `
      <div style="${DEMO}">
        <ds-alert title="Dark mode is now available" description="Enable it under your profile settings to get started.">
          <template #action>
            <q-btn unelevated no-caps label="Enable" style="background:var(--ds-color-text);color:#fff;border-radius:var(--ds-radius-pill);font-weight:600;padding:6px 18px" />
          </template>
        </ds-alert>
      </div>`,
  }),
}

/** Form-level error above a form, summarising the field errors below it. */
export const FormErrorSummary = {
  name: 'Form error summary',
  render: () => ({
    components: { DsAlert },
    template: `
      <div style="${DEMO}">
        <ds-alert severity="error" title="Check the highlighted fields">
          <ul><li>Enter a valid email address.</li><li>Enter your password.</li></ul>
        </ds-alert>
      </div>`,
  }),
}
