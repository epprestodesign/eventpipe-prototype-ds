import { ref } from 'vue'
import StdEventField from './components/StdEventField.vue'
import { ticketDecorator, docText } from './_components'

export default {
  title: 'Design Requests/Single-Team Add and Delete/Components/Event Field',
  component: StdEventField,
  tags: ['autodocs', 'STA-2', 'ENG2-116'],
  decorators: [ticketDecorator('STA-2')],
  parameters: { layout: 'padded', docs: { description: { component: docText('The required, single-select **Event** dropdown at the top of create-mode Team Edit. Preselected when the Compliance list is filtered to an event; otherwise “Please select”. Saving without one shows an inline error. Registration System Event ID is not asked for.', 'STA-2') } } },
}

const field = (initial, error = '') => ({
  render: () => ({
    components: { StdEventField },
    setup: () => ({ v: ref(initial), error }),
    template: '<div style="max-width:408px;"><std-event-field v-model="v" :error="error" /></div>',
  }),
})
export const PleaseSelect = { name: 'Please select', ...field('') }
export const Preselected = field('evt-east')
export const Required = { name: 'Required error', ...field('', 'Select an event.') }
