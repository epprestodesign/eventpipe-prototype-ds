/** Components / Notification Preferences / Delete Template.
 *
 *  NEW IN PHASE 2 — DES-428 · P0-4. Templates could not be deleted before; the
 *  set was fixed, so the only recovery action was Revert to default.
 */
import { ref } from 'vue'
import DsConfirmDialog from './components/DsConfirmDialog.vue'

export default {
  title: 'Design Requests/Aug 19/Components/Notification Preferences/Delete Template',
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: `
**New in Phase 2** — [DES-428 · P0-4](https://linear.app/eventpipe/issue/DES-428).

Once you can add reminders, you need to be able to remove them.

**One route, as of 2026-08-19** — the template editor's **Actions ▾** menu,
limited to user-added reminders.

Deleting used to be reachable from two places: the row's *Edit ▾* menu on the
list, and the editor. The row menu came out in the Aug 19 revision — *"get rid
of the actions dropdown and put it in the email itself"* — and everything it
held moved into the editor. The row is now a plain **Edit** button whose only
job is to get you into the email.

That leaves deleting where the decision is actually made. You rarely conclude a
reminder is redundant from a list of titles; you conclude it while reading the
thing. The old row route made you act on a template you could not see.

**Actions is a plain dropdown, not a split button.** It was *Save ▾* until the
Aug 19 revision, which is a shape that only works when one item is the obvious
default. "Actions" names a menu of peers, so a primary click would have to guess
which one you meant.

**Saving is not in this menu at all.** It moved to the unsaved-changes bar,
which appears the instant there is anything to save and disappears when there is
not — see *Components › Notification Preferences › **Unsaved Changes Bar***. A
*Save* item alongside it would be redundant when the bar is up and a no-op when
it is not, and the only way to tell which was to open the menu and look.
Everything left in here works whether or not the email has been edited.

**Preview email** and **Send test** stay broken out beside it. They are the two
things you do while still deciding, so neither should cost a menu — they appear
in the menu as well, so both habits work.

Both destructive items confirm first: delete via the dialog below, restore via
*Components › Notification Preferences › **Restore to Default***. Deleting from
the editor returns you to the list, since the template you were editing no
longer exists.

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

The rule survived the move to *Actions* unchanged — same gating expression, same
tooltip, same wrapper carrying it, because a disabled menu item is an
unreliable hover target wherever it sits.

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
      <q-card flat bordered style="max-width:900px; min-height:420px;">
        <q-card-section style="padding:24px 32px;">
          <div class="row items-center justify-between">
            <div class="row items-center q-gutter-sm no-wrap">
              <h2 style="margin:0; font-size:1.375rem; font-weight:700; color:var(--ds-color-text);">{{ editing.title }}</h2>
            </div>
            <div class="row items-center q-gutter-sm">
              <q-btn flat no-caps color="primary" icon="visibility" label="Preview email" />
              <q-btn outline no-caps color="primary" icon="outgoing_mail" label="Send test" />
              <q-btn-dropdown unelevated no-caps color="primary" label="Actions">
                <q-list style="min-width:230px">
                  <q-item clickable>
                    <q-item-section avatar><q-icon name="edit_note" /></q-item-section>
                    <q-item-section>Change description</q-item-section>
                  </q-item>
                  <q-item clickable>
                    <q-item-section avatar><q-icon name="visibility" /></q-item-section>
                    <q-item-section>Preview</q-item-section>
                  </q-item>
                  <q-item clickable>
                    <q-item-section avatar><q-icon name="outgoing_mail" /></q-item-section>
                    <q-item-section>Send test email</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable>
                    <q-item-section avatar><q-icon name="undo" color="negative" /></q-item-section>
                    <q-item-section class="text-negative">Restore to Default</q-item-section>
                  </q-item>
                  <q-item clickable>
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
EditorHeader.storyName = 'Editor header — Actions menu'

/* The tiers rule, shown as the two menus side by side rather than described.
 * Both are open at once because the whole point is the contrast: the same item,
 * live on the last tier and disabled on the one above it.
 *
 * These are Actions menus as of 2026-08-19, not row menus — the rule did not
 * change, only where it is enforced. Edit template is gone from the list: you
 * are already inside the template by the time you can see this. */
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
              <q-item-section avatar><q-icon name="edit_note" /></q-item-section>
              <q-item-section>Change description</q-item-section>
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
