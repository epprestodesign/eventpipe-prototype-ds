/** Components / Shared / Discard Changes Dialog.
 *
 *  The reusable one. Every "you have unsaved work and are about to walk away
 *  from it" prompt in this folder should be this component, so they cannot drift
 *  into saying the same thing three different ways.
 */
import { ref } from 'vue'
import DsDiscardChangesDialog from './components/DsDiscardChangesDialog.vue'
import DsConfirmDialog from './components/DsConfirmDialog.vue'

export default {
  title: 'Design Requests/Aug 19/Components/Shared/Discard Changes Dialog',
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: `
**Use this for any discard-changes action.** Unsaved work, and something is about
to throw it away — leaving an editor, closing a form, switching records.

### Why it is not DsConfirmDialog

The folder has two dialogs now, and they answer different questions.

| | **DsConfirmDialog** | **DsDiscardChangesDialog** |
| --- | --- | --- |
| Asks | *"Delete this?"*, *"Restore the default?"* | *"You have unsaved changes."* |
| You | asked for something irreversible | just navigated |
| Confirm | tonal **red** | tonal **blue** |

**They share one layout.** Since 2026-08-20 both draw their box, title, spacing
and buttons from \`ds-dialog-shell.css\`, so the only thing that changes between
them is the colour of the committing action — which is the only thing that
should. Colour carries the severity; nothing else needs to.

Before that, DsConfirmDialog wore the design system's \`.ds-dialog\` treatment —
bold title, two full-width buttons, a solid red confirm — and the two sat side by
side looking like they came from different products. The leave-template guard
also used it, which made an ordinary Back click look like a delete confirmation.

### Anatomy

**Regular-weight title**, not bold. It is a question, not an alarm.

**Right-aligned text buttons** with a wide gap above them, so they read as the
answer to the question rather than part of it.

**Cancel is plain; Continue carries a soft tonal background.** Two identical text
buttons side by side make you read both to work out which is which. Tonal rather
than filled because nothing here is destructive — the primary action earns
emphasis, not alarm.

**Persistent.** A stray backdrop click should not decide this.

**\`role="alertdialog"\`**, not \`dialog\` — it interrupts a navigation you already
asked for, so assistive tech announces it rather than waiting to be explored.

### Copy

Defaults to the generic message so every instance says the same thing:

> **Discard Changes**
> You have not saved your changes. Are you sure you want to go back without saving?

\`title\`, \`message\`, \`confirmLabel\` and \`cancelLabel\` are all overridable, and
there is a \`#body\` slot when the message needs markup. Prefer the default —
consistency is the reason this component exists.

### Events

\`@confirm\` fires when the user commits to discarding; \`@cancel\` when they back
out. Both close the dialog. **The caller is responsible for actually reverting
state** — the dialog only reports the decision.

### In use

*Screens › Notification Preferences* and *First-Time Setup › Notification
Preferences*, on the editor's **Go Back to Preferences** link, when the email has
unsaved edits. Saving, discarding via the save bar, and deleting the template all
bypass it — each already answers for itself.
` } } },
}

const demo = (props = {}, note = '') => ({
  components: { DsDiscardChangesDialog },
  setup: () => {
    const open = ref(true)
    const outcome = ref('')
    return {
      open,
      outcome,
      props,
      note,
      onConfirm: () => { outcome.value = 'confirmed — the caller now reverts and navigates' },
      onCancel: () => { outcome.value = 'cancelled — nothing changed' },
    }
  },
  template: `
    <div style="min-height:420px; padding:8px;">
      <q-btn unelevated no-caps color="primary" label="Open dialog" @click="open = true" />
      <div v-if="note" style="margin-top:14px; font-size:0.8125rem; color:var(--ds-color-text-subtle);">{{ note }}</div>
      <div v-if="outcome" style="margin-top:10px; font-size:0.8125rem; color:var(--ds-color-text);">
        Last result: <strong>{{ outcome }}</strong>
      </div>
      <ds-discard-changes-dialog v-model="open" v-bind="props"
        @confirm="onConfirm" @cancel="onCancel" />
    </div>`,
})

/** The default, and what every discard-changes prompt should look like. */
export const Default = { render: () => demo() }
Default.storyName = 'Default'

/** Every string is overridable for the cases that genuinely need to be specific
 *  — but reach for the default first. */
export const CustomCopy = {
  render: () => demo({
    title: 'Discard this reminder?',
    message: 'The reminder you were adding has not been saved. Leaving now discards it.',
    confirmLabel: 'Discard reminder',
  }, 'Overridden title, message and confirm label.'),
}
CustomCopy.storyName = 'Custom copy'

/** Side by side with the dialog it is NOT — the same decision rendered both
 *  ways, so the difference in weight is visible rather than described. */
export const AgainstConfirmDialog = {
  render: () => ({
    components: { DsDiscardChangesDialog, DsConfirmDialog },
    setup: () => ({ a: ref(false), b: ref(false) }),
    template: `
      <div style="min-height:420px; padding:8px;">
        <div class="row q-gutter-md">
          <q-btn outline no-caps color="primary" label="Discard changes (this component)" @click="a = true" />
          <q-btn outline no-caps color="negative" label="Delete template (DsConfirmDialog)" @click="b = true" />
        </div>
        <div style="margin-top:16px; max-width:620px; font-size:0.8125rem; line-height:1.6; color:var(--ds-color-text-subtle);">
          Open both. Same box, same title, same buttons in the same place — the
          only difference is the colour of the action on the right. The first is
          something that happened to you on the way past; the second is something
          you asked for, and permanent.
        </div>
        <ds-discard-changes-dialog v-model="a" />
        <ds-confirm-dialog v-model="b" title="Delete this template?" destructive
          confirm-label="Delete template" cancel-label="Keep it">
          <template #body>
            This permanently removes <strong>Compliance Reminder - Tier 3</strong>.
            It cannot be recovered.
          </template>
        </ds-confirm-dialog>
      </div>`,
  }),
}
AgainstConfirmDialog.storyName = 'Against DsConfirmDialog'
