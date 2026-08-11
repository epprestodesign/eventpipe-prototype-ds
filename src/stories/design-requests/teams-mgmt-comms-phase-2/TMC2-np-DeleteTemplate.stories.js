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
| Template editor → **Save ▾** → *Delete template* | You usually only decide a reminder is redundant while reading it. Making you back out to the list to act on that is a wasted round trip |

**Save is a split button** (2026-08-11), the same shape as *Edit* on the list
rows. Saving stays one click; *Restore to Default* and *Delete template* sit
behind the arrow rather than competing with it as three peer buttons. **Save is
repeated as the menu's first item**, again matching *Edit* — once the arrow is
open the primary action should still be reachable without closing it. Restore
moved here from the rich-text toolbar, where it sat among the formatting controls
and read as one of them. **Preview email** stays broken out — it is the action
you take while still deciding, so it should not cost a menu.

Both destructive items confirm first: delete via the dialog below, restore via
*Components › Notification Preferences › **Restore to Default***.

Both open the same confirmation. Deleting from the editor returns you to the
list, since the template you were editing no longer exists.

### Seeded templates cannot be deleted

Welcome, Previously Compliant Notice and the seeded Compliance Reminder ship with
every account. They can be **reverted to default**, never removed — so the delete
item simply does not appear on them. The dialog says so rather than leaving you
to infer it.

### Only the furthest tier can be deleted

Added 2026-08-11. In the tiers model the numbering is the identity, so deleting
from the middle would either strand a gap or renumber the tiers underneath the
user. Instead the delete item stays visible on every user-added tier but is
**disabled on all but the last**, with a tooltip explaining that tiers unwind
from the end. Hiding it would have been quieter and taught nothing.

This also removed a rule that existed only to cope with gaps: adding a tier used
to search for the lowest unused number. With gaps impossible, the next tier is
just the count plus one.

### The delete is staged

Like everything else on this screen, it does not take effect until **Save**. A
reminder that was never saved is dropped outright; a saved one leaves the shared
store on Save, which is when it also disappears from Event Registration Settings.
` } } },
}

export const EditorHeader = {
  render: () => ({
    setup: () => ({ editing: { title: 'STP - Compliance Reminder - Tier 3', userAdded: true } }),
    template: `
      <q-card flat bordered style="max-width:900px; min-height:280px;">
        <q-card-section style="padding:24px 32px;">
          <div class="row items-center justify-between">
            <div class="row items-center q-gutter-sm no-wrap">
              <h2 style="margin:0; font-size:1.375rem; font-weight:700; color:var(--ds-color-text);">{{ editing.title }}</h2>
              <q-badge outline color="primary" class="q-px-sm q-py-xs">Recurring reminder</q-badge>
            </div>
            <div class="row items-center q-gutter-sm">
              <q-btn flat no-caps color="primary" icon="visibility" label="Preview email" />
              <q-btn outline no-caps color="primary" label="Cancel" />
              <q-btn-dropdown split unelevated no-caps color="primary" label="Save">
                <q-list style="min-width:230px">
                  <q-item clickable v-close-popup>
                    <q-item-section avatar><q-icon name="check" /></q-item-section>
                    <q-item-section>Save</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable v-close-popup>
                    <q-item-section avatar><q-icon name="undo" color="negative" /></q-item-section>
                    <q-item-section class="text-negative">Restore to Default</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable v-close-popup>
                    <q-item-section avatar><q-icon name="delete" color="negative" /></q-item-section>
                    <q-item-section class="text-negative">Delete template</q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
          </div>
        </q-card-section>
      </q-card>`,
  }),
}
EditorHeader.storyName = 'Editor header — Save split button'

/* The tiers rule, shown as the two menus side by side rather than described.
 * Both menus are open at once because the whole point is the contrast: the same
 * item, live on the last tier and disabled on the one above it. */
export const TierGating = {
  render: () => ({
    setup: () => ({
      tiers: [
        { title: 'STP - Compliance Reminder - Tier 2', last: false },
        { title: 'STP - Compliance Reminder - Tier 3', last: true },
      ],
    }),
    template: `
      <div class="row q-gutter-xl" style="min-height:320px; padding:8px;">
        <div v-for="t in tiers" :key="t.title" style="width:320px;">
          <div style="font-size:0.8125rem; font-weight:600; margin-bottom:10px; color:var(--ds-color-text);">
            {{ t.title }}
          </div>
          <q-list bordered separator style="border-radius:var(--ds-radius-md);">
            <q-item clickable>
              <q-item-section avatar><q-icon name="edit" /></q-item-section>
              <q-item-section>Edit template</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section avatar><q-icon name="visibility" /></q-item-section>
              <q-item-section>Preview</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section avatar><q-icon name="outgoing_mail" /></q-item-section>
              <q-item-section>Send test email</q-item-section>
            </q-item>
            <div>
              <q-item clickable :disable="!t.last">
                <q-item-section avatar><q-icon name="delete" color="negative" /></q-item-section>
                <q-item-section class="text-negative">Delete template</q-item-section>
              </q-item>
              <q-tooltip v-if="!t.last" max-width="260px" class="text-body2"
                style="line-height:1.5; padding:8px 10px;">
                Tiers are removed from the last one back. Delete the highest-numbered tier first.
              </q-tooltip>
            </div>
          </q-list>
          <div style="font-size:0.75rem; margin-top:8px; color:var(--ds-color-text-subtle);">
            {{ t.last ? 'Furthest tier — Delete is live.' : 'Not the furthest tier — Delete is disabled, with a tooltip on hover.' }}
          </div>
        </div>
      </div>`,
  }),
}
TierGating.storyName = 'Tiers — only the furthest can be deleted'

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
