/** INPUTS / Checkbox → Quasar: QCheckbox (native) */
import { ref } from 'vue'
export default {
  title: 'Components/Forms/Checkbox',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
Lets users select zero or more options, or toggle a single setting on/off.

## When to use
- Independent on/off choices; "select all" lists; terms acceptance.

## When not to use
- Single choice from a set → **Radio Group**. Instant-apply setting → **Switch**.

## States
Checked · unchecked · indeterminate · disabled.

## Quasar mapping
\`Checkbox → QCheckbox\` (native).
` } } },
}

export const Basic = {
  render: () => ({ setup: () => ({ v: ref(true) }), template: `<q-checkbox v-model="v" label="Accept terms" color="primary" />` }),
}

export const States = {
  render: () => ({ setup: () => ({ a: ref(true), b: ref(false), c: ref(null) }), template: `
    <div class="column q-gutter-sm">
      <q-checkbox v-model="a" label="Checked" color="primary" />
      <q-checkbox v-model="b" label="Unchecked" color="primary" />
      <q-checkbox v-model="c" label="Indeterminate" toggle-indeterminate color="accent" />
      <q-checkbox :model-value="true" label="Disabled" disable />
    </div>` }),
}
