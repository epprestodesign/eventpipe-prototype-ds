/** FEEDBACK / Dialog → Quasar: QDialog, styled with the DS dialog + button pair */
import { ref } from 'vue'
export default {
  title: 'Components/Actions/Dialog',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
Modal surface for focused tasks or decisions that interrupt the main flow. We use
Quasar's **QDialog** with the DS card + action styling:

- **\`.ds-dialog\`** on the \`QCard\` — generous padding, rounded corners, a bold
  \`.ds-dialog__title\`, a muted \`.ds-dialog__body\`, and a \`.ds-dialog__actions\` row.
- **\`.ds-dialog__btn\`** + a color treatment for each action — \`.ds-btn--secondary\`
  (grey) for the lower-emphasis choice, \`.ds-btn--primary\` (brand) or
  \`.ds-btn--danger\` (red) for the confirming action.

\`\`\`html
<q-card class="ds-dialog">
  <h2 class="ds-dialog__title">You have unsaved changes.</h2>
  <p class="ds-dialog__body">Are you sure you want to leave and discard your changes?</p>
  <div class="ds-dialog__actions">
    <q-btn unelevated no-caps class="ds-dialog__btn ds-btn--secondary" label="Discard Changes" v-close-popup />
    <q-btn unelevated no-caps class="ds-dialog__btn ds-btn--primary"   label="Save Changes" v-close-popup />
  </div>
</q-card>
\`\`\`

## When not to use
- Non-blocking feedback → **Snackbar / Toast**. Lots of content/navigation → a page.
` } } },
}

/** Standard confirm — secondary + primary pair. */
export const UnsavedChanges = {
  name: 'Unsaved changes',
  render: () => ({ setup: () => ({ open: ref(false) }), template: `
    <div>
      <q-btn unelevated no-caps color="primary" label="Open dialog" @click="open = true" />
      <q-dialog v-model="open">
        <q-card class="ds-dialog">
          <h2 class="ds-dialog__title">You have unsaved changes.</h2>
          <p class="ds-dialog__body">Are you sure you want to leave this screen and discard your changes?</p>
          <div class="ds-dialog__actions">
            <q-btn unelevated no-caps class="ds-dialog__btn ds-btn--secondary" label="Discard Changes" v-close-popup />
            <q-btn unelevated no-caps class="ds-dialog__btn ds-btn--primary" label="Save Changes" v-close-popup />
          </div>
        </q-card>
      </q-dialog>
    </div>` }),
}

/** Destructive confirm — secondary + red danger. */
export const CancelReservation = {
  name: 'Cancel reservation',
  render: () => ({ setup: () => ({ open: ref(false) }), template: `
    <div>
      <q-btn unelevated no-caps class="ds-btn--danger" style="border-radius:var(--ds-radius-pill);padding:0 18px" label="Cancel reservation" @click="open = true" />
      <q-dialog v-model="open" persistent>
        <q-card class="ds-dialog">
          <h2 class="ds-dialog__title">Cancel reservation?</h2>
          <p class="ds-dialog__body">Are you sure you want to cancel this reservation? This non-refundable booking <strong>cannot be undone</strong>.</p>
          <div class="ds-dialog__actions">
            <q-btn unelevated no-caps class="ds-dialog__btn ds-btn--secondary" label="Keep reservation" v-close-popup />
            <q-btn unelevated no-caps class="ds-dialog__btn ds-btn--danger" label="Cancel reservation" v-close-popup />
          </div>
        </q-card>
      </q-dialog>
    </div>` }),
}
