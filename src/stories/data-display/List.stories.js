/** DATA DISPLAY / List → Quasar: QList + QItem + QItemSection (native compound) */
export default {
  title: 'Components/Layout & Structure/List',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
Vertical collection of related rows — room options, amenities, booking summaries.

## When to use
- Scannable rows with icon/title/meta/action; amenity and room lists.

## When not to use
- Tabular, sortable, multi-column data → **Table**.

## Quasar mapping
\`List → QList + QItem + QItemSection\` (native). Recommended wrapper \`PrestoList\`
for the common icon/title/meta/action row.
` } } },
}
export const RoomOptions = {
  name: 'Room Options',
  render: () => ({ template: `
    <q-list bordered separator style="max-width:380px;border-radius:12px;overflow:hidden">
      <q-item clickable v-ripple>
        <q-item-section avatar><q-icon color="primary" name="king_bed" /></q-item-section>
        <q-item-section>
          <q-item-label>Deluxe King</q-item-label>
          <q-item-label caption>Free cancellation · Breakfast included</q-item-label>
        </q-item-section>
        <q-item-section side><div class="text-weight-medium">$189</div></q-item-section>
      </q-item>
      <q-item clickable v-ripple>
        <q-item-section avatar><q-icon color="primary" name="single_bed" /></q-item-section>
        <q-item-section>
          <q-item-label>Twin/Double</q-item-label>
          <q-item-label caption>Non-refundable</q-item-label>
        </q-item-section>
        <q-item-section side><div class="text-weight-medium">$149</div></q-item-section>
      </q-item>
      <q-item clickable v-ripple>
        <q-item-section avatar><q-icon color="primary" name="bedroom_parent" /></q-item-section>
        <q-item-section>
          <q-item-label>Ocean View Suite</q-item-label>
          <q-item-label caption>Balcony · Sea view</q-item-label>
        </q-item-section>
        <q-item-section side><div class="text-weight-medium">$329</div></q-item-section>
      </q-item>
    </q-list>` }),
}
export const Amenities = {
  render: () => ({ template: `
    <q-list dense style="max-width:280px">
      <q-item><q-item-section avatar><q-icon color="positive" name="wifi" /></q-item-section><q-item-section>Free WiFi</q-item-section></q-item>
      <q-item><q-item-section avatar><q-icon color="positive" name="free_breakfast" /></q-item-section><q-item-section>Breakfast included</q-item-section></q-item>
      <q-item><q-item-section avatar><q-icon color="positive" name="pool" /></q-item-section><q-item-section>Outdoor pool</q-item-section></q-item>
      <q-item><q-item-section avatar><q-icon color="positive" name="local_parking" /></q-item-section><q-item-section>Free parking</q-item-section></q-item>
    </q-list>` }),
}
