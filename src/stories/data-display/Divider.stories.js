/** DATA DISPLAY / Divider → Quasar: QSeparator (native alias) */
export default {
  title: 'Components/Layout & Structure/Divider',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
A thin rule that separates content groups. Quasar calls it **QSeparator**.

## When to use
- Between list sections, toolbar groups, card regions.

## Quasar mapping
\`Divider → QSeparator\` (native; we alias the name in the DS).
` } } },
}
export const Horizontal = {
  render: () => ({ template: `
    <div style="max-width:320px">
      <div>Above</div>
      <q-separator class="q-my-md" />
      <div>Below</div>
      <q-separator class="q-my-md" color="primary" />
      <div>After colored divider</div>
    </div>` }),
}

/** Labeled divider — a leading label with a rule filling the remaining width
 *  (the "Select Reservations to Move ————" / section pattern). The blue accent
 *  version lives in **Section Header** (`variant="section"`). */
export const Labeled = {
  render: () => ({ template: `
    <div class="column q-gutter-lg" style="max-width:640px">
      <div class="row items-center no-wrap" style="gap:16px">
        <span class="text-weight-bold text-primary" style="white-space:nowrap">Select Reservations to Move</span>
        <q-separator style="flex:1" />
      </div>
      <div class="row items-center no-wrap" style="gap:16px">
        <span class="text-weight-bold" style="white-space:nowrap">Details</span>
        <q-separator style="flex:1" />
      </div>
    </div>` }),
}
export const Vertical = {
  render: () => ({ template: `
    <div class="row items-center" style="height:40px">
      <span>Left</span>
      <q-separator vertical class="q-mx-md" />
      <span>Middle</span>
      <q-separator vertical class="q-mx-md" />
      <span>Right</span>
    </div>` }),
}
