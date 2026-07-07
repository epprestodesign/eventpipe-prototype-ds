/** BASE COMPONENTS / Inputs / Input Number → DsInput.vue (type=number). */
import { ref } from 'vue'
import DsInput from '../../components/DsInput.vue'

export default {
  title: 'Components/Forms/Input Number',
  component: DsInput,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
Numeric field. Supports an optional trailing **unit** (e.g. \`days\`) and a ▲▼
**stepper** (the "60 days" pattern from Edit Refund Policy). Restyled QInput
inside **Form Field**.
` } } },
  args: { label: 'Group Max', placeholder: '0', type: 'number' },
  argTypes: {
    label: { control: 'text' }, unit: { control: 'text' }, stepper: { control: 'boolean' },
    step: { control: 'number' }, min: { control: 'number' }, max: { control: 'number' },
  },
}

export const Default = { render: (args) => ({ components: { DsInput }, setup: () => ({ args, v: ref(null) }), template: `<div style="max-width:340px"><ds-input v-model="v" v-bind="args" /></div>` }) }

export const Variations = {
  render: () => ({
    components: { DsInput },
    setup: () => ({ a: ref(60), b: ref(45), c: ref(2) }),
    template: `
      <div class="column q-gutter-lg" style="max-width:340px">
        <ds-input v-model="a" type="number" label="Days" sublabel="Number of days prior to check-in" unit="days" stepper :min="0" />
        <ds-input v-model="b" type="number" label="Reservation Reminder" unit="Days" :min="0" tooltip="Days before arrival to send the reminder." />
        <ds-input v-model="c" type="number" label="Guests" stepper :min="1" :max="20" />
      </div>`,
  }),
}
