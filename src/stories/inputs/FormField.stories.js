/** BASE COMPONENTS / Form Field → DsField.vue (the standard field wrapper). */
import { ref } from 'vue'
import DsField from '../../components/DsField.vue'
import DsInput from '../../components/DsInput.vue'

export default {
  title: 'Components/Forms/Form Field',
  component: DsField,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
The standard EventPipe field wrapper. It provides the consistent field anatomy
used across every form — a gray **label** above the control, an optional
required \`*\` and ⓘ **tooltip**, an optional gray **sub-label**, the **control**
slot, and a **helper / error** message below.

Inputs (**Input**, **Input Number**, **Select**, …) compose into this wrapper so
every field aligns. Label sits *above* the control (stacked), never floating.

## Anatomy
\`\`\`
Label *  ⓘ
sub-label (optional)
┌────────────────────┐
│  control (slot)     │
└────────────────────┘
helper text  · or ·  error text
\`\`\`
` } } },
  argTypes: {
    label: { control: 'text' },
    required: { control: 'boolean' },
    tooltip: { control: 'text' },
    sublabel: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
  },
}

export const Anatomy = {
  args: {
    label: 'Event Name',
    required: true,
    tooltip: 'The public name shown to attendees.',
    hint: 'Appears on the booking page.',
  },
  render: (args) => ({
    components: { DsField, DsInput },
    setup: () => ({ args, v: ref('') }),
    template: `<div style="max-width:340px"><ds-field v-bind="args"><q-input v-model="v" outlined dense placeholder="Data" /></ds-field></div>`,
  }),
}

export const States = {
  render: () => ({
    components: { DsInput },
    setup: () => ({ a: ref(''), b: ref(''), c: ref('') }),
    template: `
      <div class="column q-gutter-lg" style="max-width:340px">
        <ds-input v-model="a" label="Default" placeholder="Data" />
        <ds-input v-model="b" label="Required" required tooltip="This field is required." placeholder="Data" />
        <ds-input v-model="c" label="With error" error="This field is required." placeholder="Data" />
        <ds-input model-value="" label="Disabled" disabled placeholder="Data" />
      </div>`,
  }),
}
