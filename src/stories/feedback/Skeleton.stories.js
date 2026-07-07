/** FEEDBACK / Skeleton → Quasar: QSkeleton (native) */
export default {
  title: 'Components/Feedback & Status/Skeleton',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
Placeholder shapes that mimic content layout while data loads — reduces perceived wait.

## When to use
- Initial load of cards, lists, tables where the layout is known.

## When not to use
- Action progress → **Progress**. Quick toggles → no loader at all.

## Quasar mapping
\`Skeleton → QSkeleton\` (native).
` } } },
}
export const Card = {
  render: () => ({ template: `
    <q-card style="max-width:320px">
      <q-skeleton height="160px" square />
      <q-card-section>
        <q-skeleton type="text" class="text-h6" />
        <q-skeleton type="text" width="60%" />
        <div class="row q-gutter-sm q-mt-sm"><q-skeleton type="QBtn" /><q-skeleton type="QBtn" /></div>
      </q-card-section>
    </q-card>` }),
}
export const ListRows = {
  render: () => ({ template: `
    <q-list style="max-width:360px">
      <q-item v-for="n in 3" :key="n">
        <q-item-section avatar><q-skeleton type="QAvatar" /></q-item-section>
        <q-item-section><q-skeleton type="text" /><q-skeleton type="text" width="50%" /></q-item-section>
      </q-item>
    </q-list>` }),
}
