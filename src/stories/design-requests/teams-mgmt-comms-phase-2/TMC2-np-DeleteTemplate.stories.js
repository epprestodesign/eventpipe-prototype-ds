/** Components / Notification Preferences / Delete Template.
 *
 *  NEW IN PHASE 2 — DES-428 · P0-4. Templates could not be deleted before; the
 *  set was fixed, so the only recovery action was Revert to default.
 */
import { ref } from 'vue'
import DsConfirmDialog from './components/DsConfirmDialog.vue'

export default {
  title: 'Design Requests/Teams Mgmt Comms Phase 2/Components/Notification Preferences/Delete Template',
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: `
**New in Phase 2** — [DES-428 · P0-4](https://linear.app/eventpipe/issue/DES-428).

Once you can add reminders, you need to be able to remove them. **Two routes,
both limited to user-added reminders:**

| Where | Why both |
| --- | --- |
| Row menu → *Delete template* | Acting on the list, where you can see the whole set |
| Template editor header → *Delete* | You usually only decide a reminder is redundant while reading it. Making you back out to the list to act on that is a wasted round trip |

Both open the same confirmation. Deleting from the editor returns you to the
list, since the template you were editing no longer exists.

### Seeded templates cannot be deleted

Welcome, Previously Compliant Notice, Compliance Achieved and the seeded
Compliance Reminder ship with every account. They can be **reverted to default**,
never removed — so the delete item simply does not appear on them. The dialog
says so rather than leaving you to infer it.

### The delete is staged

Like everything else on this screen, it does not take effect until **Save**. A
reminder that was never saved is dropped outright; a saved one leaves the shared
store on Save, which is when it also disappears from Event Registration Settings.
` } } },
}

export const EditorHeader = {
  render: () => ({
    setup: () => ({ editing: { title: '30 Day Reminder', userAdded: true } }),
    template: `
      <q-card flat bordered style="max-width:900px;">
        <q-card-section style="padding:24px 32px;">
          <div class="row items-center justify-between">
            <div class="row items-center q-gutter-sm no-wrap">
              <h2 style="margin:0; font-size:1.375rem; font-weight:700; color:var(--ds-color-text);">{{ editing.title }}</h2>
              <q-badge outline color="primary" class="q-px-sm q-py-xs">Recurring reminder</q-badge>
            </div>
            <div class="row items-center q-gutter-sm">
              <q-btn v-if="editing.userAdded" flat no-caps color="negative" icon="delete" label="Delete" />
              <q-btn flat no-caps color="primary" icon="visibility" label="Preview email" />
              <q-btn outline no-caps color="primary" label="Cancel" />
              <q-btn unelevated no-caps color="primary" label="Save" />
            </div>
          </div>
        </q-card-section>
      </q-card>`,
  }),
}
EditorHeader.storyName = 'Editor header — Delete beside Cancel'

export const ConfirmDialog = {
  render: () => ({
    components: { DsConfirmDialog },
    setup: () => {
      const deleteOpen = ref(true)
      return { deleteOpen, deleteTarget: { title: '30 Day Reminder' }, confirmDelete: () => { deleteOpen.value = false } }
    },
    template: `
      <div style="min-height:360px;">
        <q-btn v-if="!deleteOpen" outline no-caps color="negative" icon="delete"
          label="Delete template" @click="deleteOpen = true" />
        <ds-confirm-dialog v-model="deleteOpen" title="Delete this template?" destructive
          confirm-label="Delete template" cancel-label="Cancel" @confirm="confirmDelete">
          <template #body>
            <strong>{{ deleteTarget.title }}</strong> was added by your company. Deleting it removes the
            template and stops any reminders scheduled from it. Templates that ship with EventPipe
            cannot be deleted — only reverted to default.
          </template>
        </ds-confirm-dialog>
      </div>`,
  }),
}
ConfirmDialog.storyName = 'Confirmation'
