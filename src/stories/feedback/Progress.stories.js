/** FEEDBACK / Progress → Quasar: QLinearProgress / QCircularProgress / QSpinner (native) */
export default {
  title: 'Components/Feedback & Status/Progress',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
Communicates that work is happening — determinate (known %) or indeterminate.

## When to use
- Determinate for known progress (uploads); indeterminate for unknown waits.

## When not to use
- Placeholder content while loading layout → **Skeleton**. Full-screen block → **Backdrop**.

## Quasar mapping
\`Progress → QLinearProgress · QCircularProgress · QSpinner\` (native).
` } } },
}
export const Linear = {
  render: () => ({ template: `
    <div class="column q-gutter-md" style="max-width:360px">
      <q-linear-progress :value="0.6" color="primary" />
      <q-linear-progress :value="0.4" color="accent" stripe size="10px" rounded />
      <q-linear-progress indeterminate color="secondary" />
    </div>` }),
}
export const Circular = {
  render: () => ({ template: `
    <div class="q-gutter-md row items-center">
      <q-circular-progress :value="68" size="80px" :thickness="0.2" color="primary" track-color="grey-3" show-value>68%</q-circular-progress>
      <q-circular-progress indeterminate size="50px" color="accent" />
    </div>` }),
}
export const Spinners = {
  render: () => ({ setup: () => ({ list: ['QSpinner','QSpinnerDots','QSpinnerGears','QSpinnerHourglass','QSpinnerOrbit'] }), template: `
    <div class="q-gutter-lg row items-center">
      <component v-for="s in list" :key="s" :is="s" color="primary" size="36px" />
    </div>` }),
}
