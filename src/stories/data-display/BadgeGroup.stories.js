/** BASE COMPONENTS / Badge Group → a row of QBadges with a leading label. */
export default {
  title: 'Components/Feedback & Status/Badge Group',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
A cluster of related badges — status sets, counts, or category tags shown
together. Uses QBadge with DS status colors.
` } } },
}

export const StatusSet = {
  render: () => ({ template: `
    <div class="row items-center q-gutter-sm">
      <q-badge color="positive" rounded class="q-px-sm q-py-xs">Approved by Hotel</q-badge>
      <q-badge color="warning" text-color="dark" rounded class="q-px-sm q-py-xs">Pending</q-badge>
      <q-badge color="negative" rounded class="q-px-sm q-py-xs">Declined</q-badge>
      <q-badge color="grey-6" rounded class="q-px-sm q-py-xs">Draft</q-badge>
    </div>` }),
}

export const Counts = {
  render: () => ({ template: `
    <div class="row items-center q-gutter-lg">
      <div class="row items-center q-gutter-xs">Requests <q-badge color="primary" rounded>12</q-badge></div>
      <div class="row items-center q-gutter-xs">Notes <q-badge color="grey-6" rounded>3</q-badge></div>
      <div class="row items-center q-gutter-xs">Watchers <q-badge color="primary" rounded>2</q-badge></div>
    </div>` }),
}
