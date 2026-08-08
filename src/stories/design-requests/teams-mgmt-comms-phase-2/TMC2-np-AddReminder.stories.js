/** Components / Notification Preferences / Add Compliance Reminder.
 *
 *  NEW IN PHASE 2 — DES-428 · P0-4. The screen previously shipped a fixed
 *  early / mid / late set of reminders that could not be added to.
 *
 *  The row renders the real fragment (`addReminderRow` in _tmc2.js). The dialog
 *  is reproduced here because it lives inline in the screen story.
 */
import { ref } from 'vue'
import { addReminderRow } from './_tmc2'
import DsInput from './components/DsInput.vue'

export default {
  title: 'Design Requests/Teams Mgmt Comms Phase 2/Components/Notification Preferences/Add Compliance Reminder',
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: `
**New in Phase 2** — [DES-428 · P0-4](https://linear.app/eventpipe/issue/DES-428).

Unlimited compliance reminders. The fixed early / mid / late model is gone.

### The row

An outline button matching the other add-actions in this folder (*+ Add New
Note*, *+ Add New Compliance Credit* on Team Detail), plus an **info icon**.

The explanation sits in the icon rather than beside the button because review
asked for the help to be available but not permanently occupying the row — and
for the copy to explain what you would *use* this for rather than restating that
the limit was removed:

> Add additional Compliance Reminder templates to set a specific escalating tone
> or cadence to your communications as your event draws closer. Be sure to set
> the **Days until Event Start to Begin/End Reminders** to avoid overlapping with
> other reminders you have in place.

### The dialog

Name and Description only. The new template starts as a **copy of the standard
Compliance Reminder** — content, schedule, statuses and recipients included —
so there is nothing else to ask for up front.

Confirm is **Add Reminder**, not "Add template": only compliance reminders can be
added, so naming the thing is more useful than naming the type.

Confirm is disabled until a name is entered. The reminder is **staged**, not
applied — it does not reach Event Registration Settings until Save.

### Diverges from the written AC

The ticket says the dialog offers a *type* choice (Compliance Reminder or
General Communication). The newer direction is unlimited compliance reminders
that duplicate an existing one, so there is no type picker.
` } } },
}

export const Row = {
  render: () => ({
    setup: () => ({ openAdd: () => {} }),
    template: `
      <div style="max-width:820px; border:1px solid var(--ds-color-border-container);
                  border-radius:var(--ds-radius-lg); background:var(--ds-color-surface); overflow:hidden;">
        <div class="text-grey-6" style="padding:16px 28px; font-size:0.8125rem;">
          …the section's templates would sit above this.
        </div>
        <q-separator />
        ${addReminderRow('openAdd')}
      </div>`,
  }),
}
Row.storyName = 'Row — button + info icon'

export const Dialog = {
  render: () => ({
    components: { DsInput },
    setup: () => {
      const addOpen = ref(true)
      const newName = ref('')
      const newDesc = ref('')
      return { addOpen, newName, newDesc, confirmAdd: () => { addOpen.value = false } }
    },
    template: `
      <div style="min-height:420px;">
        <q-btn v-if="!addOpen" outline no-caps color="primary" icon="add"
          label="Add Compliance Reminder" @click="addOpen = true" />
        <q-dialog v-model="addOpen">
          <q-card flat bordered style="min-width:480px; border-radius:var(--ds-radius-lg);">
            <q-card-section style="padding:28px 28px 4px;">
              <div class="text-h6" style="font-weight:700;">Add Compliance Reminder</div>
              <div class="text-grey-8" style="font-size:0.8125rem; line-height:1.5; margin-top:6px;">
                The new template starts as a <b>copy of STP - Compliance Reminder</b> —
                content, schedule, statuses and recipients included. Edit it once it is added.
              </div>
            </q-card-section>
            <q-card-section style="padding:18px 28px 8px;">
              <ds-input v-model="newName" label="Name" required placeholder="e.g. 30 Day Reminder" />
              <div class="q-mt-md">
                <ds-input v-model="newDesc" label="Description" placeholder="What this reminder is for"
                  hint="Optional — defaults to the copied description." />
              </div>
            </q-card-section>
            <q-card-actions align="right" class="q-pa-md">
              <q-btn flat no-caps color="primary" label="Cancel" @click="addOpen = false" />
              <q-btn unelevated no-caps color="primary" label="Add Reminder"
                :disable="!newName.trim()" @click="confirmAdd" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>`,
  }),
}
Dialog.storyName = 'Dialog'
