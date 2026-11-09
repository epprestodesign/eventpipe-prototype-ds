import DsAlert from '../../../components/DsAlert.vue'
import DsLink from '../../../components/DsLink.vue'
import { ticketDecorator, docText } from './_components'

export default {
  title: 'Design Requests/Single-Team Add and Delete/Components/Delete Success Message',
  component: DsAlert,
  tags: ['autodocs', 'STD-3', 'ENG2-113'],
  decorators: [ticketDecorator('STD-3')],
  parameters: { layout: 'padded', docs: { description: { component: docText('After a confirmed delete the user returns to the Compliance list with this success message (DsAlert, success). It names the team, says its linked group blocks and reservations went to Reconciliation, and links there (11/09 review: no activity-log link).', 'STD-3') } } },
}

export const Default = {
  render: () => ({
    components: { DsAlert, DsLink },
    template: `<div style="max-width:900px;">
      <ds-alert severity="success" title="Team ‘Augusta Lions’ was deleted.">
        Its linked group blocks and reservations were moved to Reconciliation.
        <ds-link href="#reconciliation" @click.prevent>View in Reconciliation</ds-link>
        <template #action><q-btn flat round dense icon="close" aria-label="Dismiss" /></template>
      </ds-alert></div>`,
  }),
}
