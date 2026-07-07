/** DES-207 / Components / Recipient Selector → checkbox group (library only). */
import { ref } from 'vue'
import DsField from '../../components/DsField.vue'

export default {
  title: 'Design Requests/🟢 DES-207 Communications | Email Template Editor/Components/Recipient Selector',
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: 'Who receives the reminder — Team Manager, Group Block Contacts, or both. A Checkbox group inside a Form Field.' } } },
}

export const Selector = {
  render: () => ({
    components: { DsField },
    setup: () => ({ recipients: ref(['team-manager']) }),
    template: `
      <div style="max-width:420px;">
        <ds-field label="Recipients" required>
          <q-option-group v-model="recipients" type="checkbox" color="primary" :options="[
            { label: 'Team Manager', value: 'team-manager' },
            { label: 'Group Block Contacts', value: 'group-block-contacts' },
          ]" />
        </ds-field>
      </div>`,
  }),
}
