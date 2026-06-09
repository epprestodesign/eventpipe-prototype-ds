/** FEEDBACK / Alert → Quasar: QBanner (inline; wrap as PrestoAlert severity API) */
export default {
  title: 'Feedback/Alert',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
Inline, in-context message about the state of a task or region (not a global toast).

## When to use
- Form-level errors, inline warnings, contextual info tied to a section.

## When not to use
- Transient action confirmation → **Snackbar**. Page-wide announcement → **Banner**.

## Quasar mapping
\`Alert → QBanner\` (inline). Recommended wrapper \`PrestoAlert\` mapping
\`severity\` → color + icon.
` } } },
}
// Warning uses a dark foreground (ADS color.text.warning.inverse #292A2E)
// because white on yellow fails contrast. Other severities use white.
const fg = (color) => (color === 'warning' ? 'text-dark' : 'text-white')
const alert = (color, icon, msg) => `
  <q-banner rounded class="bg-${color} ${fg(color)} q-mb-sm" style="max-width:520px">
    <template #avatar><q-icon name="${icon}" /></template>${msg}
  </q-banner>`
export const Severities = {
  render: () => ({ template: `
    <div>
      ${alert('positive','check_circle','Success — your reservation is confirmed.')}
      ${alert('info','info','Info — check-in is from 3:00 PM, check-out by 11:00 AM.')}
      ${alert('warning','warning','Warning — only 2 rooms left at this price.')}
      ${alert('negative','error','Error — payment could not be processed.')}
    </div>` }),
}
export const WithAction = {
  render: () => ({ template: `
    <q-banner rounded class="bg-warning text-dark" style="max-width:520px">
      <template #avatar><q-icon name="warning" /></template>
      Your session will expire soon.
      <template #action><q-btn flat label="Extend" color="dark" /></template>
    </q-banner>` }),
}
