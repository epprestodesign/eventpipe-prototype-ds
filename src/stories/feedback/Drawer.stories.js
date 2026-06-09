/** FEEDBACK / Drawer → Quasar: QDrawer (needs QLayout; wrap as PrestoDrawer) */
import { ref } from 'vue'
export default {
  title: 'Feedback/Drawer',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
A panel that slides in from a screen edge for secondary content or navigation.

## When to use
- Search filters, room/reservation detail panels, contextual editing without leaving the page.

## When not to use
- A blocking decision → **Dialog**. Primary content → a full page.

## Note
QDrawer must live inside a **QLayout**. Below it is shown \`container\`-scoped so it
fits the story frame.

## Quasar mapping
\`Drawer → QDrawer\` (native, in QLayout). Recommended wrapper \`PrestoDrawer\`.
` } } },
}
export const RightPanel = {
  render: () => ({ setup: () => ({ open: ref(true) }), template: `
    <q-layout view="hHh lpR fFf" container style="height:380px" class="shadow-2 rounded-borders">
      <q-header class="bg-primary text-white"><q-toolbar>
        <q-toolbar-title>Search results</q-toolbar-title>
        <q-btn flat round dense icon="tune" @click="open = !open" />
      </q-toolbar></q-header>
      <q-drawer v-model="open" side="right" :width="260" bordered>
        <div class="q-pa-md">
          <div class="text-subtitle1 q-mb-sm">Filters</div>
          <q-toggle label="Free cancellation" color="primary" />
          <q-toggle label="Breakfast included" color="primary" />
          <q-toggle label="Pool" color="primary" />
          <q-select outlined dense label="Star rating" :options="['Any','3+ stars','4+ stars','5 stars']" class="q-mt-md" />
        </div>
      </q-drawer>
      <q-page-container><q-page padding>Hotel search results. Toggle the filter drawer →</q-page></q-page-container>
    </q-layout>` }),
}
