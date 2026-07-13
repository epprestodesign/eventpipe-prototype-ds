/** NAVIGATION / Tabs → Quasar: QTabs + QTab + QTabPanels (wrap as EpTabs) */
import { ref } from 'vue'
export default {
  title: 'Components/Navigation/Tabs',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
Switch between related views within the same context, without navigating away.

## When to use
- 2–6 peer views of one object (Hotel: Overview / Rooms / Amenities / Reviews).

## When not to use
- Top-level app sections → **App Shell** (sidebar). Sequential flow → **Stepper**.

## Quasar mapping
\`Tabs → QTabs + QTab + QTabPanels\` (native compound). Recommended wrapper \`EpTabs\`.
` } } },
}
export const Basic = {
  render: () => ({ setup: () => ({ tab: ref('overview') }), template: `
    <div style="max-width:560px">
      <q-tabs v-model="tab" class="text-primary" align="left">
        <q-tab name="overview" icon="hotel" label="Overview" />
        <q-tab name="rooms" icon="king_bed" label="Rooms" />
        <q-tab name="amenities" icon="pool" label="Amenities" />
        <q-tab name="reviews" icon="reviews" label="Reviews" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="overview">A boutique stay in the heart of the city…</q-tab-panel>
        <q-tab-panel name="rooms">Choose from 4 room types…</q-tab-panel>
        <q-tab-panel name="amenities">Pool · Spa · Free WiFi · Breakfast…</q-tab-panel>
        <q-tab-panel name="reviews">4.5 ★ · 1,284 guest reviews…</q-tab-panel>
      </q-tab-panels>
    </div>` }),
}
