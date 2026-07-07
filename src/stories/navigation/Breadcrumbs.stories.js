/** NAVIGATION / Breadcrumbs → Quasar: QBreadcrumbs + QBreadcrumbsEl (native) */
export default {
  title: 'Components/Navigation/Breadcrumbs',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
Shows the user's location in a hierarchy and lets them jump back up levels.

## When to use
- Deep hierarchies (Home → New York → The Grand Plaza → Deluxe King).

## When not to use
- Flat apps with ≤2 levels.

## Quasar mapping
\`Breadcrumbs → QBreadcrumbs + QBreadcrumbsEl\` (native).
` } } },
}
export const Basic = {
  render: () => ({ template: `
    <q-breadcrumbs active-color="primary">
      <template #separator><q-icon name="chevron_right" size="18px" color="grey-5" /></template>
      <q-breadcrumbs-el label="Home" icon="home" />
      <q-breadcrumbs-el label="New York" icon="place" />
      <q-breadcrumbs-el label="The Grand Plaza" icon="hotel" />
      <q-breadcrumbs-el label="Deluxe King" />
    </q-breadcrumbs>` }),
}

/** EventPipe style — text-only, blue links, gray current page, chevron separators
 *  (the "Inventory Requests › REQUEST # …" / "Events › Inventory Testing › …" bars). */
export const EventPipe = {
  render: () => ({ template: `
    <div class="column q-gutter-md">
      <q-breadcrumbs active-color="primary" gutter="sm" class="text-body2">
        <template #separator><q-icon name="chevron_right" size="18px" color="grey-5" /></template>
        <q-breadcrumbs-el label="Inventory Requests" />
        <q-breadcrumbs-el label="REQUEST # R-00081527" class="text-grey-6" />
      </q-breadcrumbs>

      <q-breadcrumbs active-color="primary" gutter="sm" class="text-body2">
        <template #separator><q-icon name="chevron_right" size="18px" color="grey-5" /></template>
        <q-breadcrumbs-el label="Team Travel Source (TTS)" />
        <q-breadcrumbs-el label="Events" />
        <q-breadcrumbs-el label="Inventory Testing" />
        <q-breadcrumbs-el label="Edit Refund Policies" />
        <q-breadcrumbs-el label="Refund Policy" class="text-grey-6" />
      </q-breadcrumbs>
    </div>` }),
}
