/** Components / Registration Settings / Conflict Modal.
 *
 *  NEW — PP-44 (GBR-2). The ticket says "Prototype Pending", so this is
 *  net-new design rather than a rebuild.
 */
import { ref } from 'vue'
import GbrConflictModal from './components/GbrConflictModal.vue'

export default {
  title: 'Design Requests/GB Reminder Controls/Sept 10/Components/Registration Settings/Conflict Modal',
  component: GbrConflictModal,
  tags: ['autodocs'],
  parameters: { layout: 'centered', docs: { description: { component: `
**New** — [PP-44 · GBR-2](https://linear.app/eventpipe/issue/PP-44). Raised on
save of registration settings when **all three** conditions hold:

1. Compliance reminders are enabled for this event
2. Group block reminders are enabled for this event
3. The company's Compliance Reminder recipients include group block contacts for
   at least one tier

The trigger lives in \`hasReminderConflict()\` in \`_gbr.js\` — one
implementation, so the screen and this component cannot disagree about when it
fires. See **Screens › 02 · Registration Settings** for it firing in place.

### Copy is Scott's, approved 2026-09-09

He supplied the body wording verbatim and asked to keep *"We recommend turning
group block reminders off for this event."*

An earlier version named the **tier count** and the **configured interval**, so
a Hoco could tell whether the overlap meant two emails or nine. That is gone:
*"I would rather the devs not have to pull in variables to that modal."* The
modal now takes no data about the event at all — it describes the shape of the
problem rather than this event's version of it. Worth knowing that the trade is
real: the copy is simpler to build and tells the user less about their own
situation.

The headline was not part of his rewrite, so it stands as it was. **Still worth
confirming with him**, since he supplied every other line.

### The X is gone — decided 2026-09-09

PP-44 said dismissing completes the save with both left on, which meant an X
that silently wrote. Scott: *"I agree that the X, actually saving it, doesn't
make much sense. Either remove the X or remove the hover text… I'll adjust the
requirements accordingly."*

Removing the X was the better half of that choice — stripping only the tooltip
would have left the behaviour while hiding the explanation. The dialog is
already **persistent**, so Escape and backdrop clicks were blocked anyway; the two
buttons are now the only way out and both say what they do.

The rejected options are kept in **Concepts › Modal Dismiss Behavior**.

### Neither button is a cancel, and neither is red

The modal is advisory and PP-44 is explicit that the save proceeds either way.
Both buttons save; they differ only in what gets saved, and the recommended one
is primary.
` } } },
}

const modal = () => ({
  components: { GbrConflictModal },
  setup: () => {
    const open = ref(true)
    const last = ref('')
    return { open, last,
      onOff: () => { last.value = 'Saved · group block reminders turned off for this event' },
      onAny: () => { last.value = 'Saved · both reminder types left on' } }
  },
  template: `
    <div style="min-width:420px; text-align:center;">
      <q-btn v-if="!open" unelevated no-caps color="primary" label="Save registration settings" @click="open = true; last = ''" />
      <div v-if="last" style="margin-top:14px; color:var(--ds-color-text-subtle); font-size:0.875rem;">{{ last }}</div>
      <gbr-conflict-modal v-model="open" @turn-off-and-save="onOff" @save-anyway="onAny" />
    </div>`,
})

/** The modal as it ships. Press either button — the result is reported below
 *  the trigger. There is no X: the two buttons are the only way out. */
export const Default = { render: () => modal() }

