/** Teams Mgmt Comms Phase 2 / Components / Notification Preferences /
 *  Restore to Default — the warning shown before an email's content is replaced.
 */
import { ref } from 'vue'
import DsConfirmDialog from './components/DsConfirmDialog.vue'

export default {
  title: 'Design Requests/Teams Mgmt Comms Phase 2/Components/Notification Preferences/Restore to Default',
  parameters: {
    docs: { description: { component: `
**New in Phase 2** — [DES-428 · P0-4](https://linear.app/eventpipe/issue/DES-428).

Restoring an email's content throws away everything the company has written and
puts the EventPipe default back. That is irreversible, and it is reached from
**one item down a menu** — which is exactly where a mis-click happens. So it
asks first.

### Why a warning and not an undo

An undo would be the better answer if the editor had a history stack, but it does
not: content is a single value, and once the default overwrites it the custom
copy is gone. A confirmation is the honest affordance for that.

### What the copy has to do

| | |
| --- | --- |
| **Name the template** | The action is reached from a menu on a screen with several emails. "This email" is not specific enough to act on |
| **Say what is lost** | Both cases — edits made to a default template, and content written from scratch for a reminder the company created |
| **Say what is *not* lost** | Scheduling, recipients and compliance statuses are untouched. Without that line "restore the default template" sounds like it resets the whole configuration |
| **Label the safe way out** | *Keep my content*, not *Cancel*. The stakes belong on the button |

### Not the same as *Revert to default*

The row menu's **Revert to default** acts on the whole template and clears its
*Custom* badge. This one only replaces the content of the email you have open.
Two different actions with deliberately similar names — worth watching in review.
` } },
  },
}

/* Opened by default so the warning is the first thing the story shows; the
 * button underneath is only there to get it back after a decision. */
const dialogStory = (title) => ({
  render: () => ({
    components: { DsConfirmDialog },
    setup: () => {
      const restoreOpen = ref(true)
      return {
        restoreOpen,
        editing: { title },
        confirmRestoreContent: () => { restoreOpen.value = false },
      }
    },
    template: `
      <div style="min-height:420px;">
        <q-btn v-if="!restoreOpen" outline no-caps color="negative" icon="undo"
          label="Restore to Default" @click="restoreOpen = true" />
        <ds-confirm-dialog v-model="restoreOpen" title="Restore the default template?" destructive
          confirm-label="Restore default" cancel-label="Keep my content" @confirm="confirmRestoreContent">
          <template #body>
            This replaces the content of <strong>{{ editing.title }}</strong> with the EventPipe
            default template. Everything your company has written here — edits to the default,
            or content written from scratch for a reminder you created — is
            <strong>permanently discarded</strong> and cannot be recovered.
            <div style="margin-top:12px;">Scheduling, recipients and compliance statuses are not affected.</div>
          </template>
        </ds-confirm-dialog>
      </div>`,
  }),
})

/** A seeded template the company has edited — restoring undoes those edits. */
export const EditedDefault = dialogStory('STP - Previously Compliant Notice')
EditedDefault.storyName = 'Warning — edited default template'

/** A tier the company created. Its content was written from scratch, so
 *  "restore" means replacing it with the standard reminder copy. */
export const CreatedReminder = dialogStory('STP - Compliance Reminder - Tier 3')
CreatedReminder.storyName = 'Warning — company-created reminder'
