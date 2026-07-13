/** NAVIGATION / Menu → Quasar: QMenu (+ QList) (wrap as EpMenu) */
export default {
  title: 'Components/Actions/Menu',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
A popover list of actions or options, anchored to a trigger.

## When to use
- Overflow actions (⋮), context menus, account menus.

## When not to use
- Persistent primary nav → **App Shell** (sidebar). Single choice form field → **Select**.

## Quasar mapping
\`Menu → QMenu\` (native; child of the anchor). Recommended wrapper \`EpMenu\`.
` } } },
}
export const Basic = {
  render: () => ({ template: `
    <q-btn color="primary" label="Manage booking" icon-right="arrow_drop_down">
      <q-menu>
        <q-list style="min-width:200px">
          <q-item clickable v-close-popup><q-item-section avatar><q-icon name="edit_calendar" /></q-item-section><q-item-section>Change dates</q-item-section></q-item>
          <q-item clickable v-close-popup><q-item-section avatar><q-icon name="share" /></q-item-section><q-item-section>Share reservation</q-item-section></q-item>
          <q-item clickable v-close-popup><q-item-section avatar><q-icon name="receipt_long" /></q-item-section><q-item-section>View receipt</q-item-section></q-item>
          <q-separator />
          <q-item clickable v-close-popup><q-item-section avatar><q-icon name="cancel" color="negative" /></q-item-section><q-item-section class="text-negative">Cancel reservation</q-item-section></q-item>
        </q-list>
      </q-menu>
    </q-btn>` }),
}
export const ContextMenu = {
  render: () => ({ template: `
    <div class="bg-grey-2 flex flex-center rounded-borders" style="height:120px;max-width:320px">
      Right-click here
      <q-menu context-menu>
        <q-list style="min-width:160px">
          <q-item clickable v-close-popup><q-item-section>Refresh</q-item-section></q-item>
          <q-item clickable v-close-popup><q-item-section>Settings</q-item-section></q-item>
        </q-list>
      </q-menu>
    </div>` }),
}
