/** DATA DISPLAY / Badge → Quasar: QBadge (native) */
export default {
  title: 'Components/Feedback & Status/Badge',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
Small count or status indicator, often attached to another element.

## When to use
- Unread counts, statuses, "new" markers on icons/tabs.

## When not to use
- Removable user input → **Chip**.

## Quasar mapping
\`Badge → QBadge\` (native).
` } } },
}
export const Basic = {
  render: () => ({ template: `<q-badge color="primary">New</q-badge>` }),
}
export const Variants = {
  render: () => ({ template: `
    <div class="q-gutter-md row items-center">
      <q-badge color="primary">Label</q-badge>
      <q-badge color="positive">Active</q-badge>
      <q-badge color="warning" rounded />
      <q-btn color="primary" icon="notifications" round>
        <q-badge color="negative" floating>4</q-badge>
      </q-btn>
    </div>` }),
}
