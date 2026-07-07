/** DATA DISPLAY / Tooltip → Quasar: QTooltip (native) */
export default {
  title: 'Components/Typography & Content/Tooltip',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
Brief contextual label shown on hover/focus of an element.

## When to use
- Clarify icon-only buttons; show truncated values.

## When not to use
- Essential, persistent info (tooltips are transient and skipped on touch) → inline text.

## Accessibility
Don't hide critical content behind hover only; ensure focus also triggers it.

## Quasar mapping
\`Tooltip → QTooltip\` (native; child of the anchor element).
` } } },
}
export const Basic = {
  render: () => ({ template: `
    <q-btn color="primary" icon="help" label="Hover me">
      <q-tooltip class="bg-dark" :offset="[0,8]">Helpful tooltip text</q-tooltip>
    </q-btn>` }),
}
export const OnIcon = {
  render: () => ({ template: `
    <q-icon name="info" size="28px" color="primary">
      <q-tooltip>More information</q-tooltip>
    </q-icon>` }),
}
