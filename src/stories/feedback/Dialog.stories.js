/** FEEDBACK / Dialog → Quasar: QDialog (native; wrap as PrestoDialog) */
import { ref } from 'vue'
export default {
  title: 'Feedback/Dialog',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
Modal surface for focused tasks or decisions that interrupt the main flow.

## When to use
- Confirmations, short forms, focused detail that needs the user's full attention.

## When not to use
- Non-blocking feedback → **Snackbar**. Lots of content/navigation → a page or **Drawer**.

## Accessibility
Trap focus, support Esc to close, return focus to the trigger on close (QDialog handles this).

## Quasar mapping
\`Dialog → QDialog\` (native). Recommended wrapper \`PrestoDialog\` for standard header/actions.
` } } },
}
export const Basic = {
  render: () => ({ setup: () => ({ open: ref(false) }), template: `
    <div>
      <q-btn color="primary" label="Open dialog" @click="open = true" />
      <q-dialog v-model="open">
        <q-card style="min-width:320px">
          <q-card-section><div class="text-h6">Confirm booking</div></q-card-section>
          <q-card-section class="q-pt-none">Book Deluxe King at The Grand Plaza, Jun 2–6 (4 nights) for $756?</q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn unelevated label="Confirm" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>` }),
}
export const Persistent = {
  render: () => ({ setup: () => ({ open: ref(false) }), template: `
    <div>
      <q-btn color="negative" label="Cancel reservation" @click="open = true" />
      <q-dialog v-model="open" persistent>
        <q-card style="min-width:320px">
          <q-card-section class="row items-center q-gutter-sm">
            <q-icon name="warning" color="negative" size="28px" /><span class="text-h6">Cancel reservation?</span>
          </q-card-section>
          <q-card-section class="q-pt-none">This non-refundable booking cannot be reinstated once cancelled.</q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Keep booking" color="primary" v-close-popup />
            <q-btn unelevated label="Cancel reservation" color="negative" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>` }),
}
