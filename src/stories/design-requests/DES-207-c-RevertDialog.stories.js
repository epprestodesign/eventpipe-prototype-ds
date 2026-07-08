/** DES-207 / Components / Revert to Default Dialog → DsConfirmDialog.vue. */
import { ref } from 'vue'
import DsConfirmDialog from '../../components/DsConfirmDialog.vue'

export default {
  title: 'Design Requests/🟢 DES-207 Communications | Email Template Editor/Components/Revert to Default Dialog',
  component: DsConfirmDialog,
  tags: ['autodocs'],
  parameters: { layout: 'centered', docs: { description: { component: 'The destructive confirmation shown when a user chooses **Revert to default** on a customized template — restoring the EventPipe default and discarding the company edits. Built on the reusable **DsConfirmDialog** (Quasar QDialog + the DS `.ds-dialog` styling, `.ds-btn--danger` confirm).' } } },
}

export const RevertToDefault = {
  render: () => ({
    components: { DsConfirmDialog },
    setup: () => ({ open: ref(false), reverted: ref(false) }),
    template: `
      <div class="column items-center q-gutter-md">
        <q-btn unelevated no-caps color="primary" label="Revert to default" @click="open = true" />
        <div v-if="reverted" class="text-positive">✓ Template reverted to the EventPipe default.</div>
        <ds-confirm-dialog
          v-model="open"
          title="Revert to default template?"
          destructive
          confirm-label="Revert to default"
          cancel-label="Keep custom"
          @confirm="reverted = true"
        >
          <template #body>
            This replaces <strong>STP - Compliance Reminder - Early Stage</strong> with the
            EventPipe default template. Your company's custom changes will be
            <strong>permanently discarded</strong> and can't be recovered.
          </template>
        </ds-confirm-dialog>
      </div>`,
  }),
}
