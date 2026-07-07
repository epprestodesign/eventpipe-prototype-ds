/** BASE COMPONENTS / Inputs / Input Date → DsInput.vue (type=date). */
import { ref } from 'vue'
import DsInput from '../../components/DsInput.vue'

export default {
  title: 'Components/Forms/Input Date',
  component: DsInput,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
Date field with a calendar popup (the "Start Date / End Date" pattern from Edit
Event). Restyled QInput + QDate inside **Form Field**. Format \`MM/DD/YYYY\`.
` } } },
  args: { label: 'Start Date', placeholder: 'MM/DD/YYYY' },
}

export const Default = { render: (args) => ({ components: { DsInput }, setup: () => ({ args, v: ref('') }), template: `<div style="max-width:340px"><ds-input v-model="v" type="date" v-bind="args" /></div>` }) }

export const Range = {
  render: () => ({
    components: { DsInput },
    setup: () => ({ start: ref(''), end: ref('') }),
    template: `
      <div class="row q-col-gutter-md" style="max-width:520px">
        <div class="col"><ds-input v-model="start" type="date" label="Default Check-in Date" placeholder="MM/DD/YYYY" required /></div>
        <div class="col"><ds-input v-model="end" type="date" label="Default Check-out Date" placeholder="MM/DD/YYYY" /></div>
      </div>`,
  }),
}
