/** INPUTS / Switch → Quasar: QToggle (native) */
import { ref } from 'vue'
export default {
  title: 'Components/Forms/Switch',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
Toggles a single setting that applies **immediately** (no Save needed).

## When to use
- Instant-apply preferences (notifications, availability, kiosk mode).

## When not to use
- Choices that require a Save action → **Checkbox**.

## Quasar mapping
\`Switch → QToggle\` (native).
` } } },
}

export const Basic = {
  render: () => ({ setup: () => ({ v: ref(true) }), template: `<q-toggle v-model="v" label="Online ordering" color="primary" />` }),
}

export const States = {
  render: () => ({ setup: () => ({ a: ref(true), b: ref(false) }), template: `
    <div class="column q-gutter-sm">
      <q-toggle v-model="a" label="On" color="primary" />
      <q-toggle v-model="b" label="Off" color="primary" />
      <q-toggle v-model="a" label="With icons" checked-icon="check" unchecked-icon="clear" color="accent" />
      <q-toggle :model-value="true" label="Disabled" disable />
    </div>` }),
}
