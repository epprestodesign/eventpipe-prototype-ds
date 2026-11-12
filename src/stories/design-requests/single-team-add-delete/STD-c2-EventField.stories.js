import { ref } from 'vue'
import StdEventField from './components/StdEventField.vue'
import { ticketDecorator, docText } from './_components'

export default {
  title: 'Design Requests/Single-Team Add and Delete/Components/Event Field',
  component: StdEventField,
  tags: ['autodocs', 'STA-2', 'ENG2-116'],
  decorators: [ticketDecorator('STA-2')],
  parameters: { layout: 'padded', docs: { description: { component: docText('**Event Name**, a type-ahead — the same control as the Compliance page’s Event Name filter. Type 4 characters and matching events drop down; pick one, clear it with ×. Required at the top of create-mode Team Edit, and preselected when the Compliance list is filtered to an event. Saving without one shows an inline error. Registration System Event ID is not asked for.', 'STA-2') } } },
}

const field = (initial, error = '') => ({
  render: () => ({
    components: { StdEventField },
    setup: () => ({ v: ref(initial), error }),
    template: '<div style="max-width:656px;"><std-event-field v-model="v" required :error="error" /></div>',
  }),
})
export const Empty = { name: 'Empty · type 4 characters', ...field('') }
export const Preselected = field('evt-east')
export const Required = { name: 'Required error', ...field('', 'Select an event.') }
